export class Platform {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 20;
        this.active = false;
        this.midiNote = 60;
        this.color = '#333';
        this.season = 'Spring';
    }
    
    init(x, y, width, note, color, season = 'Spring') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.midiNote = note;
        this.color = color;
        this.season = season;
        this.active = true;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const screen = camera.worldToScreen(this.x, this.y);
        
        // Main body
        ctx.fillStyle = this.color;
        ctx.fillRect(screen.x, screen.y, this.width, this.height);
        
        // Seasonal details
        ctx.save();
        ctx.clip(new Path2D(`M ${screen.x} ${screen.y} h ${this.width} v ${this.height} h -${this.width} Z`));
        
        switch(this.season) {
            case 'Spring':
                // Grass top
                ctx.fillStyle = '#81c784'; // Lighter green
                ctx.fillRect(screen.x, screen.y, this.width, 6);
                // Flowers/Speckles
                ctx.fillStyle = '#fff';
                for (let i = 0; i < this.width; i+= 20) {
                    if ((this.midiNote + i) % 7 === 0) { // Random-ish based on note
                        ctx.fillRect(screen.x + i, screen.y + 2, 4, 4);
                    }
                }
                break;
                
            case 'Summer':
                // Sun baked top
                ctx.fillStyle = '#ffe082';
                ctx.fillRect(screen.x, screen.y, this.width, 4);
                // Cracks
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.beginPath();
                for (let i = 0; i < this.width; i += 40) {
                     ctx.moveTo(screen.x + i, screen.y);
                     ctx.lineTo(screen.x + i + 10, screen.y + 15);
                }
                ctx.stroke();
                break;
                
            case 'Autumn':
                // Leaves on top
                ctx.fillStyle = '#8d6e63'; // Brownish top
                ctx.fillRect(screen.x, screen.y, this.width, 4);
                // Random leaves
                const leafColors = ['#ff7043', '#ffca28', '#8d6e63'];
                for (let i = 0; i < this.width; i+= 15) {
                    if ((this.midiNote * i) % 3 === 0) {
                        ctx.fillStyle = leafColors[(i/15) % leafColors.length];
                        ctx.fillRect(screen.x + i, screen.y - 2, 6, 6);
                    }
                }
                break;
                
            case 'Winter':
                // Snow cap
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(screen.x, screen.y, this.width, 8);
                // Icicles
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                for (let i = 0; i < this.width; i += 25) {
                    const depth = ((i + this.midiNote) % 10) + 5;
                    ctx.fillRect(screen.x + i, screen.y + 8, 5, depth);
                }
                break;
        }
        
        ctx.restore();
        
        // Edge highlight (bottom/sides)
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeRect(screen.x, screen.y, this.width, this.height);
    }
}

