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
        } else if (this.isPaused) {
            this.isPaused = false;
            this.timeOffset = this.pauseTime;
            this.startTime = Tone.now() - this.timeOffset;
        }
    }

    pause() {
        if (this.isPlaying && !this.isPaused) {
            this.isPaused = true;
            this.pauseTime = Tone.now() - this.startTime;
        }
    }

    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.eventIndex = 0;
        this.timeOffset = 0;
        this.sampler.releaseAll();
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