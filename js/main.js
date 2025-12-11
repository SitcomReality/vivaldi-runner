import { MIDIParser } from './systems/midi-parser.js';
import { MIDIMapper } from './systems/midi-mapper.js';
import { AudioEngine } from './systems/audio-engine.js';
import { LevelAssembler } from './systems/level-assembler.js';
import { ProgressionMaestro } from './systems/progression-maestro.js';
import { Camera } from './utils/camera.js';
import { Player } from './entities/player.js';
import { Menu } from './ui/menu.js';
import { HUD } from './ui/hud.js';
import { MAPPING_RULES } from './config/mapping-rules.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        this.midiParser = new MIDIParser();
        this.midiMapper = new MIDIMapper();
        this.audioEngine = new AudioEngine();
        this.levelAssembler = new LevelAssembler(this.canvas.height);
        this.maestro = new ProgressionMaestro(this.audioEngine, this.levelAssembler);
        
        this.camera = new Camera(this.canvas);
        this.player = null;
        
        this.menu = new Menu(this.startGame.bind(this));
        this.hud = new HUD();
        
        this.isRunning = false;
        this.currentSeason = 'Spring';
        this.currentMovement = 1;
        this.currentTheme = MAPPING_RULES.seasonThemes.Spring;
        
        this.keys = {};
        this.touchActive = false;
        
        this.init();
    }
    
    async init() {
        await this.audioEngine.init();
        this.setupInput();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Only update camera if it exists yet (resizeCanvas is called during construction before camera is created)
        if (this.camera) {
            this.camera.update(this.canvas.width, this.canvas.height);
        }
        
        if (this.levelAssembler) {
            this.levelAssembler.canvasHeight = this.canvas.height;
        }
    }
    
    setupInput() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ' && this.player) {
                this.player.jump(MAPPING_RULES.game.jumpForce);
            }
            
            if (e.key === 'Escape') {
                this.returnToMenu();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Touch (for mobile)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchActive = true;
            
            if (this.player) {
                this.player.jump(MAPPING_RULES.game.jumpForce);
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchActive = false;
        });
        
        // Mobile jump fallback (tap screen)
        this.canvas.addEventListener('click', (e) => {
            if (this.player && this.isRunning) {
                this.player.jump(MAPPING_RULES.game.jumpForce);
            }
        });
    }
    
    async startGame(mode, season, movement) {
        // Determine which MIDI files to load
        const files = this.getMIDIFiles(mode, season, movement);
        
        if (files.length === 0) return;
        
        // For now, just load the first file
        const file = files[0];
        this.currentSeason = file.season;
        this.currentMovement = file.movement;
        this.currentTheme = MAPPING_RULES.seasonThemes[file.season];
        
        // Load and parse MIDI
        const midiEvents = await this.midiParser.loadFile(file.path);
        
        // Map to game events
        const gameEvents = this.midiMapper.mapEventsToGameData(midiEvents, this.currentTheme);
        
        // Setup game
        this.player = new Player(200, 100);
        this.levelAssembler.setSeason(this.currentSeason);
        this.levelAssembler.loadGameEvents(gameEvents);
        this.audioEngine.loadEvents(midiEvents);
        
        // Start
        this.hud.update(0, this.currentSeason, this.currentMovement);
        this.hud.show();
        this.isRunning = true;
        this.maestro.start();
        this.gameLoop();
    }
    
    getMIDIFiles(mode, season, movement) {
        const files = [];
        const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
        
        if (mode === 'full') {
            // All 12 files
            for (const s of seasons) {
                for (let m = 1; m <= 3; m++) {
                    files.push({
                        path: `/midi/${s}0${m}.mid`,
                        season: s,
                        movement: m
                    });
                }
            }
        } else if (mode === 'season') {
            // All movements of a season
            for (let m = 1; m <= 3; m++) {
                files.push({
                    path: `/midi/${season}0${m}.mid`,
                    season: season,
                    movement: m
                });
            }
        } else if (mode === 'movement') {
            // Single movement
            files.push({
                path: `/midi/${season}0${movement}.mid`,
                season: season,
                movement: parseInt(movement)
            });
        }
        
        return files;
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (!this.player) {
            this.returnToMenu();
            return;
        }
        
        // Update player (constant rightward movement)
        const platforms = this.levelAssembler.getPlatforms();
        this.player.update(MAPPING_RULES.game.gravity, platforms);
        
        // Check collisions with obstacles
        const obstacles = this.levelAssembler.getObstacles();
        for (const obstacle of obstacles) {
            if (obstacle.collidesWith(this.player)) {
                this.player.takeDamage();
            }
        }
        
        // Check collisions with enemies
        const enemies = this.levelAssembler.getEnemies();
        for (const enemy of enemies) {
            if (enemy.collidesWith(this.player)) {
                this.player.takeDamage();
            }
        }
        
        // Update camera
        this.camera.follow(this.player);
        
        // Update level generation
        this.levelAssembler.update(this.camera.x, this.player.vx);
        
        // Update maestro
        this.maestro.update(this.player, this.camera.x);
    }
    
    render() {
        // Clear with theme background
        this.ctx.fillStyle = this.currentTheme.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw level
        this.levelAssembler.draw(this.ctx, this.camera);
        
        // Draw player
        if (this.player) {
            this.player.draw(this.ctx, this.camera);
        }
    }
    
    returnToMenu() {
        this.isRunning = false;
        this.maestro.stop();
        this.hud.hide();
        this.menu.show();
    }
}

// Start the game
new Game();