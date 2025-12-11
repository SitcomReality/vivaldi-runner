export class Menu {
    constructor(onStart) {
        this.onStart = onStart;
        this.menuEl = document.getElementById('menu');
        this.selectedSeason = null;

        this.init();
    }

    init() {
        // Full composition button
        const fullButton = this.menuEl.querySelector('[data-mode="full"]');
        fullButton.addEventListener('click', () => {
            this.startGame('full', null, null);
        });

        // Season buttons
        const seasonButtons = this.menuEl.querySelectorAll('[data-mode="season"]');
        seasonButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const season = btn.dataset.season;
                this.selectedSeason = season;
                this.showMovementSelector();
            });
        });

        // Movement buttons
        const movementButtons = this.menuEl.querySelectorAll('[data-mode="movement"]');
        movementButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const movement = btn.dataset.movement;
                this.startGame('movement', this.selectedSeason, movement);
            });
        });
    }

    showMovementSelector() {
        document.getElementById('movement-selector').style.display = 'block';
    }

    startGame(mode, season, movement) {
        this.hide();
        this.onStart(mode, season, movement);
    }

    show() {
        this.menuEl.classList.remove('hidden');
        document.getElementById('movement-selector').style.display = 'none';
        this.selectedSeason = null;
    }

    hide() {
        this.menuEl.classList.add('hidden');
    }
}