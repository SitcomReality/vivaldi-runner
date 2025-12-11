import { ObjectPool } from '../utils/object-pool.js';
import { Platform } from '../entities/platform.js';
import { Obstacle } from '../entities/obstacle.js';
import { BackgroundElement } from '../entities/background.js';
import { Enemy } from '../entities/enemy.js';
import { MAPPING_RULES } from '../config/mapping-rules.js';

export class LevelAssembler {
    constructor(canvasHeight) {
        this.canvasHeight = canvasHeight;
        this.gameEvents = [];
        this.eventIndex = 0;
        this.worldX = 0;
        
        // Object pools
        this.platformPool = new ObjectPool(
            () => new Platform(),
            (p) => { p.active = false; },
            30
        );
        
        this.obstaclePool = new ObjectPool(
            () => new Obstacle(),
            (o) => { o.active = false; },
            20
        );
        
        this.enemyPool = new ObjectPool(
            () => new Enemy(),
            (e) => { e.active = false; },
            15
        );
        
        this.backgroundPool = new ObjectPool(
            () => new BackgroundElement(),
            (b) => { b.active = false; },
            40
        );
        
        this.entities = {
            platforms: [],
            obstacles: [],
            enemies: [],
            backgrounds: []
        };
        
        // Add ground platform
        this.addGroundPlatform();
    }
    
    loadGameEvents(events) {
        this.gameEvents = events;
        this.eventIndex = 0;
        this.worldX = 0;
        
        // Clear all entities
        this.platformPool.releaseAll();
        this.obstaclePool.releaseAll();
        this.enemyPool.releaseAll();
        this.backgroundPool.releaseAll();
        
        this.entities = {
            platforms: [],
            obstacles: [],
            enemies: [],
            backgrounds: []
        };
        
        this.addGroundPlatform();
    }
    
    addGroundPlatform() {
        const ground = this.platformPool.acquire();
        ground.init(
            0,
            this.canvasHeight * MAPPING_RULES.game.groundLevel,
            10000,
            0,
            '#111'
        );
        this.entities.platforms.push(ground);
    }
    
    update(cameraX, playerSpeed) {
        this.worldX += playerSpeed;
        
        // Generate ahead
        this.generateAhead(cameraX);
        
        // Cull behind
        this.cullBehind(cameraX);
        
        // Update enemies
        for (const enemy of this.entities.enemies) {
            enemy.update();
        }
    }
    
    generateAhead(cameraX) {
        const spawnDistance = cameraX + MAPPING_RULES.game.spawnAheadDistance;
        
        while (this.eventIndex < this.gameEvents.length) {
            const event = this.gameEvents[this.eventIndex];
            const spawnX = event.time * 200; // Convert time to world space
            
            if (spawnX > spawnDistance) break;
            
            this.spawnEntity(event, spawnX);
            this.eventIndex++;
        }
    }
    
    spawnEntity(event, x) {
        const y = event.y * this.canvasHeight;
        
        switch(event.type) {
            case 'platform':
                const platform = this.platformPool.acquire();
                platform.init(x, y, event.length, event.note, event.color);
                this.entities.platforms.push(platform);
                break;
                
            case 'obstacle':
                const obstacle = this.obstaclePool.acquire();
                obstacle.init(x, y, 40 * event.scale, event.color);
                this.entities.obstacles.push(obstacle);
                break;
                
            case 'enemy':
                const enemy = this.enemyPool.acquire();
                enemy.init(x, y, 30 * event.scale, event.color);
                this.entities.enemies.push(enemy);
                break;
                
            case 'background':
                const bg = this.backgroundPool.acquire();
                bg.init(x, y, 15 * event.scale, event.color, 0.3);
                this.entities.backgrounds.push(bg);
                break;
        }
    }
    
    cullBehind(cameraX) {
        const cullDistance = cameraX - MAPPING_RULES.game.cullBehindDistance;
        
        for (const key in this.entities) {
            this.entities[key] = this.entities[key].filter(entity => {
                if (entity.x < cullDistance && entity !== this.entities.platforms[0]) { // Don't cull ground
                    switch(key) {
                        case 'platforms':
                            this.platformPool.release(entity);
                            break;
                        case 'obstacles':
                            this.obstaclePool.release(entity);
                            break;
                        case 'enemies':
                            this.enemyPool.release(entity);
                            break;
                        case 'backgrounds':
                            this.backgroundPool.release(entity);
                            break;
                    }
                    return false;
                }
                return true;
            });
        }
    }
    
    draw(ctx, camera) {
        // Draw backgrounds first
        for (const bg of this.entities.backgrounds) {
            bg.draw(ctx, camera);
        }
        
        // Draw platforms
        for (const platform of this.entities.platforms) {
            platform.draw(ctx, camera);
        }
        
        // Draw obstacles and enemies
        for (const obstacle of this.entities.obstacles) {
            obstacle.draw(ctx, camera);
        }
        
        for (const enemy of this.entities.enemies) {
            enemy.draw(ctx, camera);
        }
    }
    
    getPlatforms() {
        return this.entities.platforms.filter(p => p.active);
    }
    
    getObstacles() {
        return this.entities.obstacles.filter(o => o.active);
    }
    
    getEnemies() {
        return this.entities.enemies.filter(e => e.active);
    }
}