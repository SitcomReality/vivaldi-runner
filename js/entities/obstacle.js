export class Obstacle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 30;
        this.height = 40;
        this.active = false;
        this.color = '#d32f2f';
    }
    
    init(x, y, height, color) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.color = color;
        this.active = true;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const screen = camera.worldToScreen(this.x, this.y);
        
        // Draw spike
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y + this.height);
        ctx.lineTo(screen.x + this.width / 2, screen.y);
        ctx.lineTo(screen.x + this.width, screen.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
    
    collidesWith(player) {
        return this.active &&
               player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

