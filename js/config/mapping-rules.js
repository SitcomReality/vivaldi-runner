export const MAPPING_RULES = {
    // MIDI channel to entity type mapping
    channelToEntity: {
        0: 'platform',     // Piano/melody - solid platforms
        1: 'obstacle',     // Second voice - obstacles
        2: 'background',   // Bass - background elements
        3: 'enemy',        // Additional instruments - enemies
        4: 'platform',     // Fallback to platforms
        5: 'background',
        6: 'obstacle',
        7: 'enemy',
        8: 'platform',
        9: 'background',    // Drums (if any)
        10: 'background',
        11: 'background',
        12: 'background',
        13: 'background',
        14: 'background',
        15: 'background'
    },

    // Global fallback per-channel colors (used if a season doesn't define its own palette)
    channelColors: {
        0: '#37474f',
        1: '#f4511e',
        2: '#00897b',
        3: '#ffb300',
        4: '#5e35b1',
        5: '#039be5',
        6: '#d81b60',
        7: '#6d4c41',
        8: '#455a64',
        9: '#8d6e63',
        10: '#7cb342',
        11: '#1e88e5',
        12: '#ef6c00',
        13: '#7b1fa2',
        14: '#00acc1',
        15: '#bf360c'
    },

    // Pitch ranges for vertical placement (MIDI note 0-127)
    pitchToY: {
        min: 36,  // C2
        max: 96,  // C7
        screenMin: 0.2,  // 20% from top
        screenMax: 0.8   // 80% from top
    },

    // Velocity to size/strength mapping
    velocityToScale: {
        min: 0.5,
        max: 2.0
    },

    // Duration to length mapping (in beats)
    durationToLength: {
        minBeats: 0.25,
        maxBeats: 4.0,
        minPixels: 40,
        maxPixels: 200
    },

    // Game settings
    game: {
        playerSpeed: 2.5,        // pixels per frame at 60fps
        gravity: 0.6,
        jumpForce: 12,
        spawnAheadDistance: 1500, // Generate world this far ahead
        cullBehindDistance: 500,  // Remove entities this far behind
        groundLevel: 0.85         // Ground platform level (0-1)
    },

    // Season-specific visual themes
    seasonThemes: {
        Spring: {
            // Soft morning sky gradient
            bgTop: '#fdf6ff',
            bgBottom: '#cfe9ff',
            // Midtone for any solid fills if needed
            bg: '#e4f0ff',
            // Foreground base colors (player/primary structures)
            fg: '#2e7d32',
            accent: '#66bb6a',
            backgroundAccent: '#e1bee7',
            // Per-instrument/channel palette for Spring
            channelPalette: {
                0: '#2e7d32',  // lead strings - fresh green
                1: '#f06292',  // counter-voice obstacles - blossom pink
                2: '#00897b',  // bass - teal
                3: '#ffb74d',  // enemies - warm amber
                4: '#7b1fa2',
                5: '#26a69a',
                6: '#ec407a',
                7: '#ffca28',
                8: '#5d4037',
                9: '#8d6e63',
                10: '#9ccc65',
                11: '#42a5f5',
                12: '#ab47bc',
                13: '#66bb6a',
                14: '#26c6da',
                15: '#ef5350'
            }
        },
        Summer: {
            // Bright, slightly hazy midday sky
            bgTop: '#fff3e0',
            bgBottom: '#ffcc80',
            bg: '#ffe0b2',
            fg: '#ef6c00',
            accent: '#ffb300',
            backgroundAccent: '#ffe082',
            channelPalette: {
                0: '#fb8c00',  // melody - orange
                1: '#e53935',  // obstacles - hot red
                2: '#00838f',  // bass - deep teal
                3: '#ffb300',  // enemies - bright yellow-orange
                4: '#6a1b9a',
                5: '#00897b',
                6: '#d81b60',
                7: '#fdd835',
                8: '#5d4037',
                9: '#8d6e63',
                10: '#7cb342',
                11: '#039be5',
                12: '#f4511e',
                13: '#8e24aa',
                14: '#00acc1',
                15: '#ff7043'
            }
        },
        Autumn: {
            // Muted sunset gradient
            bgTop: '#fbe9e7',
            bgBottom: '#ffccbc',
            bg: '#ffe0d7',
            fg: '#5d4037',
            accent: '#ff7043',
            backgroundAccent: '#ffe082',
            channelPalette: {
                0: '#8d6e63',  // melody - warm brown
                1: '#d84315',  // obstacles - deep orange
                2: '#6d4c41',  // bass - dark wood
                3: '#ffa726',  // enemies - bright leaf
                4: '#6a1b9a',
                5: '#00897b',
                6: '#c62828',
                7: '#ffb74d',
                8: '#4e342e',
                9: '#a1887f',
                10: '#9e9d24',
                11: '#5c6bc0',
                12: '#f57c00',
                13: '#8e24aa',
                14: '#00acc1',
                15: '#bf360c'
            }
        },
        Winter: {
            // Cool, crisp winter sky
            bgTop: '#e3f2fd',
            bgBottom: '#cfd8dc',
            bg: '#dde7f0',
            fg: '#263238',
            accent: '#0277bd',
            backgroundAccent: '#b3e5fc',
            channelPalette: {
                0: '#1e88e5',  // melody - icy blue
                1: '#ef5350',  // obstacles - cold red
                2: '#546e7a',  // bass - slate
                3: '#ffca28',  // enemies - muted gold
                4: '#5e35b1',
                5: '#00897b',
                6: '#ab47bc',
                7: '#ffb300',
                8: '#37474f',
                9: '#90a4ae',
                10: '#66bb6a',
                11: '#29b6f6',
                12: '#ff7043',
                13: '#7e57c2',
                14: '#26c6da',
                15: '#c62828'
            }
        }
    }
};