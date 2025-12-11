export class BackgroundElement {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 20;
        this.active = false;
        this.color = 'rgba(0,0,0,0.1)';
        this.parallax = 0.5;
        this.shape = 'cloud';   // 'cloud' | 'star' | 'tree'
        this.groundY = null;    // used for trees
    }
    
    init(x, y, size, color, parallax = 0.5, shape = 'cloud', groundY = null) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.parallax = parallax;
        this.shape = shape;
        this.groundY = groundY;
        this.active = true;
    }
    
    draw(ctx, camera) {
        if (!this.active) return;
        
        const parallaxX = this.x - (camera.x * this.parallax);
        const screen = { x: parallaxX, y: this.y };
        
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        
        switch (this.shape) {
            case 'cloud': {
                // Soft cloud made of overlapping circles
                const r = this.size;
                ctx.beginPath();
                ctx.arc(screen.x, screen.y, r, 0, Math.PI * 2);
                ctx.arc(screen.x + r * 0.8, screen.y - r * 0.3, r * 0.85, 0, Math.PI * 2);
                ctx.arc(screen.x - r * 0.8, screen.y - r * 0.2, r * 0.75, 0, Math.PI * 2);
                ctx.arc(screen.x + r * 0.2, screen.y + r * 0.3, r * 0.9, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                break;
            }
            case 'star': {
                // Simple twinkling star
                const r = this.size * 0.4;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                    const x = screen.x + Math.cos(angle) * r;
                    const y = screen.y + Math.sin(angle) * r;
                    ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                
                // Cross sparkle
                ctx.globalAlpha *= 0.7;
                ctx.beginPath();
                ctx.moveTo(screen.x - r * 2, screen.y);
                ctx.lineTo(screen.x + r * 2, screen.y);
                ctx.moveTo(screen.x, screen.y - r * 2);
                ctx.lineTo(screen.x, screen.y + r * 2);
                ctx.stroke();
                break;
            }
            case 'tree': {
                if (this.groundY == null) {
                    // Fallback to simple circle if ground is unknown
                    ctx.beginPath();
                    ctx.arc(screen.x, screen.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                }
                const baseY = this.groundY;
                const trunkHeight = this.size * 2;
                const trunkWidth = this.size * 0.4;
                
                // Trunk
                ctx.fillStyle = 'rgba(120, 80, 60, 0.5)';
                ctx.fillRect(
                    screen.x - trunkWidth / 2,
                    baseY - trunkHeight,
                    trunkWidth,
                    trunkHeight
                );
                
                // Foliage (pastel canopy)
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(screen.x, baseY - trunkHeight, this.size * 1.2, 0, Math.PI * 2);
                ctx.arc(screen.x - this.size * 0.8, baseY - trunkHeight + this.size * 0.3, this.size, 0, Math.PI * 2);
                ctx.arc(screen.x + this.size * 0.8, baseY - trunkHeight + this.size * 0.2, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            default: {
                // Fallback simple circle
                ctx.beginPath();
                ctx.arc(screen.x, screen.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
        }
        
        ctx.restore();
    }
}

