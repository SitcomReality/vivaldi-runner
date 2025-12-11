export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 40;
        this.vx = 2.5; // Constant rightward movement
        this.vy = 0;
        this.onGround = false;
        this.trail = [];
        this.invincibilityTimer = 0;
        this.invincibilityDuration = 1000; // ms
        this.stalledTimer = 0;
        this.stalledDuration = 500; // ms
        this.lastDamageTime = 0;
    }

    update(gravity, platforms, deltaTime = 16) {
        // Update invincibility timer
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer -= deltaTime;
        }

        // Update stalled timer
        if (this.stalledTimer > 0) {
            this.stalledTimer -= deltaTime;
        }

        // Apply gravity
        this.vy += gravity;

        // Update position (constant movement to right, unless stalled)
        this.y += this.vy;
        if (this.stalledTimer <= 0) {
            this.x += this.vx;
        }

        // Trail effect
        if (this.vx > 0 && Math.random() > 0.5) {
            this.trail.push({
                x: this.x,
                y: this.y + this.height/2,
                alpha: 0.8,
                life: 20
            });
        }
        
        // Update trail
        for (let i = this.trail.length - 1; i >= 0; i--) {
            this.trail[i].life--;
            this.trail[i].alpha = this.trail[i].life / 20;
            if (this.trail[i].life <= 0) {
                this.trail.splice(i, 1);
            }
        }

        // Platform collision
        this.onGround = false;
        for (const platform of platforms) {
            if (this.collidesWithPlatform(platform)) {
                // Land on platform
                this.y = platform.y - this.height;
                this.vy = 0;
                this.onGround = true;
                break;
            }
        }

        // Reset to ground if fall way off screen
        if (this.y > 2000) {
            this.y = -100;
        }
    }
    
    takeDamage() {
        // Only stall if not currently invincible
        if (this.invincibilityTimer <= 0) {
            this.stalledTimer = this.stalledDuration;
            this.invincibilityTimer = this.invincibilityDuration;
            return true; // Was hit
        }
        return false; // Was invincible
    }
    
    isInvincible() {
        return this.invincibilityTimer > 0;
    }

    collidesWithPlatform(platform) {
        return this.x < platform.x + platform.width &&
               this.x + this.width > platform.x &&
               this.y + this.height > platform.y &&
               this.y + this.height < platform.y + platform.height + this.vy &&
               this.vy >= 0;
    }

    jump(force) {
        if (this.onGround) {
            this.vy = -force;
            this.onGround = false;
        }
    }

    draw(ctx, camera) {
        const screen = camera.worldToScreen(this.x, this.y);

        // Draw trail
        ctx.save();
        for (const particle of this.trail) {
            const pScreen = camera.worldToScreen(particle.x, particle.y);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            ctx.fillRect(pScreen.x, pScreen.y, 4, 4);
        }
        ctx.restore();

        // Invincibility flash
        if (this.isInvincible() && Math.floor(this.invincibilityTimer / 100) % 2 === 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        } else {
            ctx.fillStyle = '#000';
        }
        ctx.fillRect(screen.x, screen.y, this.width, this.height);

        // Simple face
        ctx.fillStyle = '#fff';
        ctx.fillRect(screen.x + 8, screen.y + 12, 5, 5);
        ctx.fillRect(screen.x + 17, screen.y + 12, 5, 5);
    }
}