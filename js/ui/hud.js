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
        if (!season) {
            this.progressEl.textContent = '';
            return;
        }

        if (season === 'CanCan') {
            this.progressEl.textContent = 'Can-can';
            return;
        }

        if (movement != null) {
            this.progressEl.textContent = `${season} - Movement ${movement}`;
        } else {
            this.progressEl.textContent = season;
        }
    }
}

