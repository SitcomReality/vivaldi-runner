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
            bg: '#e8f4f8',
            fg: '#2d5016',
            accent: '#7cb342'
        },
        Summer: {
            bg: '#fff9e6',
            fg: '#d84315',
            accent: '#ffa726'
        },
        Autumn: {
            bg: '#fbe9e7',
            fg: '#5d4037',
            accent: '#ff6f00'
        },
        Winter: {
            bg: '#eceff1',
            fg: '#263238',
            accent: '#0277bd'
        }
    }
};