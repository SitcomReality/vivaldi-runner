export class BackgroundElement {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 20;
        this.active = false;
        this.color = 'rgba(0,0,0,0.1)';
        this.parallax = 0.5;
    }
    
    init(x, y, size, color, parallax = 0.5) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.parallax = parallax;
        this.active = true;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const parallaxX = this.x - (camera.x * this.parallax);
        const screen = { x: parallaxX, y: this.y };
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

