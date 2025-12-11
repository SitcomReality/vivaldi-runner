import { parseMidi } from 'midi-file';

export class MIDIParser {
    constructor() {
        this.tracks = [];
        this.header = null;
        this.ppq = 480; // Pulses per quarter note
    }

    async loadFile(path) {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const midi = parseMidi(uint8Array);
        this.header = midi.header;
        this.tracks = midi.tracks;
        this.ppq = midi.header.ticksPerBeat || 480;

        return this.parseToEvents();
    }

    parseToEvents() {
        const events = [];
        let tempo = 500000; // Default tempo (120 BPM)

        // Process all tracks
        for (let trackIndex = 0; trackIndex < this.tracks.length; trackIndex++) {
            const track = this.tracks[trackIndex];
            let absoluteTime = 0;

            for (const event of track) {
                absoluteTime += event.deltaTime;

                // Update tempo
                if (event.type === 'setTempo') {
                    tempo = event.microsecondsPerBeat;
                }

                // Note events
                if (event.type === 'noteOn' && event.velocity > 0) {
                    const timeInSeconds = (absoluteTime / this.ppq) * (tempo / 1000000);

                    events.push({
                        type: 'noteOn',
                        time: timeInSeconds,
                        channel: event.channel,
                        note: event.noteNumber,
                        velocity: event.velocity,
                        track: trackIndex
                    });
                }

                if (event.type === 'noteOff' || (event.type === 'noteOn' && event.velocity === 0)) {
                    const timeInSeconds = (absoluteTime / this.ppq) * (tempo / 1000000);

                    events.push({
                        type: 'noteOff',
                        time: timeInSeconds,
                        channel: event.channel,
                        note: event.noteNumber,
                        track: trackIndex
                    });
                }
            }
        }

        // Sort by time
        events.sort((a, b) => a.time - b.time);

        return events;
    }

    getDuration() {
        if (this.tracks.length === 0) return 0;

        let maxTime = 0;
        let tempo = 500000;

        for (const track of this.tracks) {
            let absoluteTime = 0;
            for (const event of track) {
                absoluteTime += event.deltaTime;
                if (event.type === 'setTempo') {
                    tempo = event.microsecondsPerBeat;
                }
            }
            const timeInSeconds = (absoluteTime / this.ppq) * (tempo / 1000000);
            maxTime = Math.max(maxTime, timeInSeconds);
        }

        return maxTime;
    }
}