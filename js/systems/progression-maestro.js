export class ProgressionMaestro {
    constructor(audioEngine, levelAssembler) {
        this.audioEngine = audioEngine;
        this.levelAssembler = levelAssembler;
        this.isRunning = false;
        this.playerMoving = true;
    }

    start() {
        this.isRunning = true;
        this.audioEngine.play();
    }

    stop() {
        this.isRunning = false;
        this.audioEngine.stop();
    }

    pause() {
        this.audioEngine.pause();
        this.audioEngine.playScratch();
    }

    resume() {
        this.audioEngine.play();
    }

    update(player, cameraX) {
        if (!this.isRunning) return;

        // Check if player is moving forward
        const wasMoving = this.playerMoving;
        this.playerMoving = player.alive && player.vx > 0;

        // Handle audio based on movement state
        if (this.playerMoving && !wasMoving) {
            this.resume();
        } else if (!this.playerMoving && wasMoving) {
            this.pause();
        }

        // Update audio
        if (this.playerMoving) {
            this.audioEngine.update();
        }
    }
}