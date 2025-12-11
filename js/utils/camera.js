export class Camera {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.targetX = 0;
        this.smoothing = 0.1;
    }
    
    follow(target) {
        this.targetX = target.x - this.width * 0.3; // Player at 30% from left
        this.x += (this.targetX - this.x) * this.smoothing;
    }
    
    update(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
    }
    
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
    
    isVisible(worldX, worldY, width = 0, height = 0) {
        return worldX + width > this.x && 
               worldX < this.x + this.width &&
               worldY + height > this.y && 
               worldY < this.y + this.height;
    }
}

