import * as Tone from 'tone';

export class AudioEngine {
    constructor() {
        this.sampler = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentEvents = [];
        this.eventIndex = 0;
        this.startTime = 0;
        this.pauseTime = 0;
        this.timeOffset = 0;
        this.scratchPlayer = null;
    }

    async init() {
        await Tone.start();

        // Create a simple sampler for MIDI playback
        this.sampler = new Tone.Sampler({
            urls: {
                C4: "https://tonejs.github.io/audio/salamander/C4.mp3",
                "D#4": "https://tonejs.github.io/audio/salamander/Ds4.mp3",
                "F#4": "https://tonejs.github.io/audio/salamander/Fs4.mp3",
                A4: "https://tonejs.github.io/audio/salamander/A4.mp3",
            },
            release: 1,
        }).toDestination();

        // Load scratch effect (attenuated)
        this.scratchPlayer = new Tone.Player("/scratch.mp3").toDestination();
        // Reduce scratch volume significantly so it's not jarring during testing
        if (this.scratchPlayer && this.scratchPlayer.volume && typeof this.scratchPlayer.volume.value === 'number') {
            this.scratchPlayer.volume.value = -18; // -18 dB quieter
        }

        await Tone.loaded();
    }

    loadEvents(midiEvents) {
        this.currentEvents = midiEvents.filter(e => e.type === 'noteOn');
        this.eventIndex = 0;
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.isPaused = false;
            this.startTime = Tone.now() - this.timeOffset;
            // Ensure Tone.Transport is running so scheduled audio/time references work reliably
            try { Tone.Transport.start(); } catch (e) { /* ignore if already started */ }
        } else if (this.isPaused) {
            this.isPaused = false;
            this.timeOffset = this.pauseTime;
            this.startTime = Tone.now() - this.timeOffset;
            try { Tone.Transport.start(); } catch (e) { /* ignore */ }
        }
    }

    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.isPaused = true;
            this.pauseTime = Tone.now() - this.startTime;
            // Pause the transport so scheduled timing halts
            try { Tone.Transport.pause(); } catch (e) { /* ignore */ }

            // Guard: only call releaseAll if sampler is initialized and has the method
            if (this.sampler && typeof this.sampler.releaseAll === 'function') {
                this.sampler.releaseAll();
            }
        }
    }

    playScratch() {
        // Guard: ensure scratchPlayer exists and is ready before starting
        if (this.scratchPlayer) {
            // Tone.Player exposes a loaded boolean in many builds; fall back to try/catch
            try {
                if (this.scratchPlayer.loaded === undefined || this.scratchPlayer.loaded) {
                    this.scratchPlayer.start();
                }
            } catch (e) {
                // Best-effort: attempt to start anyway
                try { this.scratchPlayer.start(); } catch (e) { /* ignore */ }
            }
        }
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.eventIndex = 0;
        this.timeOffset = 0;
        // Stop the transport to fully halt scheduling
        try { Tone.Transport.stop(); } catch (e) { /* ignore */ }

        // Guard: only call releaseAll if sampler exists
        if (this.sampler && typeof this.sampler.releaseAll === 'function') {
            this.sampler.releaseAll();
        }
    }

    update(currentGameTime) {
        if (!this.isPlaying || this.isPaused) return;

        const now = Tone.now();
        const elapsed = now - this.startTime;

        // Play notes that should have triggered by now
        while (this.eventIndex < this.currentEvents.length) {
            const event = this.currentEvents[this.eventIndex];

            if (event.time <= elapsed) {
                const note = Tone.Frequency(event.note, "midi").toNote();
                this.sampler.triggerAttackRelease(note, "8n", now, event.velocity / 127);
                this.eventIndex++;
            } else {
                break;
            }
        }
    }

    getCurrentTime() {
        if (!this.isPlaying) return 0;
        if (this.isPaused) return this.pauseTime;
        return Tone.now() - this.startTime;
    }
}