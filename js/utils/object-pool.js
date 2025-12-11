export class ObjectPool {
    constructor(createFn, resetFn, initialSize = 50) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.available = [];
        this.inUse = new Set();
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            this.available.push(this.createFn());
        }
    }
    
    acquire() {
        let obj;
        if (this.available.length > 0) {
            obj = this.available.pop();
        } else {
            obj = this.createFn();
        }
        this.inUse.add(obj);
        return obj;
    }
    
    release(obj) {
        if (!this.inUse.has(obj)) return;
        this.inUse.delete(obj);
        this.resetFn(obj);
        this.available.push(obj);
    }
    
    releaseAll() {
        this.inUse.forEach(obj => {
            this.resetFn(obj);
            this.available.push(obj);
        });
        this.inUse.clear();
    }
    
    getActiveCount() {
        return this.inUse.size;
    }
}

