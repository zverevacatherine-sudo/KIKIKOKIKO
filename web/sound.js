// Sound management for KiKoGame Challenge condition.

class SoundManager {
    constructor() {
        this.backgroundMusic =
            document.getElementById("backgroundMusic");

        this.clickSound =
            document.getElementById("clickSound");

        this.hitSound =
            document.getElementById("hitSound");

        this.healSound =
            document.getElementById("healSound");

        this.musicPaused = false;

        const audioElements = [
            this.backgroundMusic,
            this.clickSound,
            this.hitSound,
            this.healSound
        ];

        audioElements.forEach(audio => {
            if (audio) {
                audio.preload = "auto";
                audio.volume = 1.0;
                audio.load();
            }
        });
    }

    playMusic() {
        if (!this.backgroundMusic) {
            return Promise.resolve();
        }

        try {
            this.backgroundMusic.volume = 1.0;

            return this.backgroundMusic
                .play()
                .catch(error => {
                    return Promise.reject(error);
                });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    pauseMusic() {
        if (
            this.backgroundMusic &&
            !this.backgroundMusic.paused
        ) {
            this.backgroundMusic.pause();
        }

        this.musicPaused = true;
    }

    resumeMusic() {
        if (!this.backgroundMusic) {
            return;
        }

        if (
            this.musicPaused ||
            this.backgroundMusic.paused
        ) {
            this.backgroundMusic
                .play()
                .catch(error => {
                    console.log(
                        "Music resume failed:",
                        error
                    );
                });

            this.musicPaused = false;
        }
    }

    playClick() {
        if (!this.clickSound) {
            console.warn(
                "Department click sound element was not found."
            );
            return;
        }

        try {
            // Restart the same preloaded element on every department click.
            this.clickSound.pause();
            this.clickSound.currentTime = 0;
            this.clickSound.volume = 1.0;

            const playPromise =
                this.clickSound.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(
                        "Department click sound could not be played:",
                        error
                    );
                });
            }
        } catch (error) {
            console.warn(
                "Department click sound error:",
                error
            );
        }
    }

    playHit() {
        if (!this.hitSound) {
            return;
        }

        try {
            // Fresh copy lets repeated collisions overlap safely.
            const sound =
                this.hitSound.cloneNode(true);

            sound.volume = 1.0;
            sound.currentTime = 0;

            sound.play().catch(() => {
                try {
                    this.hitSound.pause();
                    this.hitSound.currentTime = 0;
                    this.hitSound.play().catch(() => {});
                } catch (error) {}
            });
        } catch (error) {
            try {
                this.hitSound.pause();
                this.hitSound.currentTime = 0;
                this.hitSound.play().catch(() => {});
            } catch (fallbackError) {}
        }
    }

    playHeal() {
        if (!this.healSound) {
            return;
        }

        try {
            this.healSound.pause();
            this.healSound.currentTime = 0;
            this.healSound.volume = 1.0;
            this.healSound.play().catch(() => {});
        } catch (error) {}
    }
}
