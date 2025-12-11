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
        this.currentSeason = 'Spring';
        
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
    }
    
    setSeason(season) {
        this.currentSeason = season;
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
            // Former platforms are now obstacles in the flying mode
            case 'platform':
                {
                    const obstacleFromPlatform = this.obstaclePool.acquire();
                    // Use event.length as height to give variety to converted "platform" obstacles
                    obstacleFromPlatform.init(x, y, 40 * event.scale, event.color);
                    this.entities.obstacles.push(obstacleFromPlatform);
                }
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
                
            case 'background': {
                const bg = this.backgroundPool.acquire();
                const groundY = this.canvasHeight * MAPPING_RULES.game.groundLevel;
                
                // Choose a shape based on note characteristics for variety
                const selector = event.note % 3;
                let shape = 'cloud';
                let parallax = 0.3;
                let yPos = y;
                
                if (selector === 0) {
                    shape = 'cloud';
                    parallax = 0.25;
                    // keep y as mapped from pitch
                } else if (selector === 1) {
                    shape = 'star';
                    parallax = 0.1;
                    // stars tend to be higher in the sky
                    yPos = this.canvasHeight * event.y * 0.6;
                } else {
                    shape = 'tree';
                    parallax = 0.4;
                    // trees are always anchored at ground level
                    yPos = groundY;
                }
                
                bg.init(x, yPos, 15 * event.scale, event.color, parallax, shape, groundY);
                this.entities.backgrounds.push(bg);
                break;
            }
        }
    }
    
    cullBehind(cameraX) {
        const cullDistance = cameraX - MAPPING_RULES.game.cullBehindDistance;
        
        for (const key in this.entities) {
            this.entities[key] = this.entities[key].filter(entity => {
                // Backgrounds get extra leeway so they remain visible until well off-screen
                const effectiveCullDistance = key === 'backgrounds'
                    ? cameraX - MAPPING_RULES.game.cullBehindDistance * 2
                    : cullDistance;
                
                if (entity.x < effectiveCullDistance) {
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
        // Platforms are no longer used as solid ground; treat as empty for collision.
        return [];
    }
    
    getObstacles() {
        return this.entities.obstacles.filter(o => o.active);
    }
    
    getEnemies() {
        return this.entities.enemies.filter(e => e.active);
    }
}