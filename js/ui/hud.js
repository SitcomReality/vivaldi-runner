export class HUD {
    constructor() {
        this.hudEl = document.getElementById('hud');
        this.progressEl = document.getElementById('progress-text');
    }
    
    show() {
        this.hudEl.classList.remove('hidden');
    }
    
    hide() {
        this.hudEl.classList.add('hidden');
    }
    
    update(current, season, movement) {
        this.progressEl.textContent = `${season} - Movement ${movement}`;
    }
}

