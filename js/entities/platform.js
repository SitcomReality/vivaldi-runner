export class Platform {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 20;
        this.active = false;
        this.midiNote = 60;
        this.color = '#333';
    }
    
    init(x, y, width, note, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.midiNote = note;
        this.color = color;
        this.active = true;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const screen = camera.worldToScreen(this.x, this.y);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(screen.x, screen.y, this.width, this.height);
        
        // Edge highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(screen.x, screen.y, this.width, 2);
    }
}

