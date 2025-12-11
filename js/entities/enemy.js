export class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 35;
        this.height = 35;
        this.active = false;
        this.startY = 0;
        this.amplitude = 30;
        this.frequency = 0.05;
        this.time = 0;
        this.color = '#f44336';
    }

    init(x, y, amplitude, color) {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.amplitude = amplitude;
        this.time = 0;
        this.color = color;
        this.active = true;
    }

    update() {
        if (!this.active) return;

        this.time += this.frequency;
        this.y = this.startY + Math.sin(this.time) * this.amplitude;
    }

    draw(ctx, camera) {
        if (!this.active) return;

        const screen = camera.worldToScreen(this.x, this.y);

        // Draw enemy as rotating square
        ctx.save();
        ctx.translate(screen.x + this.width / 2, screen.y + this.height / 2);
        ctx.rotate(this.time);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    collidesWith(player) {
        return this.active &&
               player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}