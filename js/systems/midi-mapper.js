import { MAPPING_RULES } from '../config/mapping-rules.js';

export class MIDIMapper {
    constructor() {
        this.rules = MAPPING_RULES;
        this.activeNotes = new Map(); // Track note on/off for duration calculation
    }

    mapEventsToGameData(midiEvents, theme) {
        const gameEvents = [];

        for (const event of midiEvents) {
            if (event.type === 'noteOn') {
                // Store note on time
                const key = `${event.channel}-${event.note}`;
                this.activeNotes.set(key, event.time);

                const gameEvent = this.createGameEvent(event, theme);
                if (gameEvent) {
                    gameEvents.push(gameEvent);
                }
            } else if (event.type === 'noteOff') {
                // Calculate duration
                const key = `${event.channel}-${event.note}`;
                const noteOnTime = this.activeNotes.get(key);
                if (noteOnTime !== undefined) {
                    const duration = event.time - noteOnTime;
                    this.activeNotes.delete(key);
                    // Duration is now available if needed
                }
            }
        }

        return gameEvents;
    }

    createGameEvent(midiEvent, theme) {
        const entityType = this.rules.channelToEntity[midiEvent.channel] || 'platform';
        const y = this.mapPitchToY(midiEvent.note);
        const scale = this.mapVelocityToScale(midiEvent.velocity);
        const length = this.mapVelocityToLength(midiEvent.velocity);

        // Use a per-channel color if defined (season-aware), otherwise fall back to entity/theme color
        const channelColor = this.getColorForChannel(midiEvent.channel, theme);
        const fallbackColor = this.getColorForType(entityType, theme);
        const color = channelColor || fallbackColor;

        return {
            time: midiEvent.time,
            type: entityType,
            note: midiEvent.note,
            velocity: midiEvent.velocity,
            channel: midiEvent.channel,
            y: y,
            scale: scale,
            length: length,
            color: color
        };
    }

    getColorForChannel(channel, theme) {
        // Prefer season-specific palette if available
        if (theme && theme.channelPalette && theme.channelPalette[channel]) {
            return theme.channelPalette[channel];
        }
        // Fallback to global channel colors
        if (this.rules && this.rules.channelColors && this.rules.channelColors[channel]) {
            return this.rules.channelColors[channel];
        }
        return null;
    }

    mapPitchToY(note) {
        const { min, max, screenMin, screenMax } = this.rules.pitchToY;
        const normalized = Math.max(0, Math.min(1, (note - min) / (max - min)));
        return screenMin + (1 - normalized) * (screenMax - screenMin); // Invert so high notes are at top
    }

    mapVelocityToScale(velocity) {
        const normalized = velocity / 127;
        return this.rules.velocityToScale.min + 
               normalized * (this.rules.velocityToScale.max - this.rules.velocityToScale.min);
    }

    mapVelocityToLength(velocity) {
        const normalized = velocity / 127;
        return this.rules.durationToLength.minPixels + 
               normalized * (this.rules.durationToLength.maxPixels - this.rules.durationToLength.minPixels);
    }

    getColorForType(type, theme) {
        switch(type) {
            case 'platform':
                return theme.fg;
            case 'obstacle':
                return theme.accent;
            case 'enemy':
                return theme.accent;
            case 'background':
                // Soft pastel background elements, distinct from foreground
                return theme && theme.backgroundAccent ? theme.backgroundAccent : '#f3e5f5';
            default:
                return '#000';
        }
    }
}