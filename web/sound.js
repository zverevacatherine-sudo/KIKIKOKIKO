// Sound management
class SoundManager {
    constructor() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.clickSound = document.getElementById('clickSound');
        this.hitSound = document.getElementById('hitSound');
        this.healSound = document.getElementById('healSound');
        this.musicPaused = false;
    }

    playMusic() {
        try {
            // Возвращаем Promise для обработки ошибок автозапуска
            return this.backgroundMusic.play().catch(e => {
                // Браузер может блокировать автозапуск звука
                // Это нормально, звук запустится при первом взаимодействии пользователя
                return Promise.reject(e);
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    pauseMusic() {
        if (this.backgroundMusic && !this.musicPaused) {
            this.backgroundMusic.pause();
            this.musicPaused = true;
        }
    }

    resumeMusic() {
        if (this.backgroundMusic && this.musicPaused) {
            this.backgroundMusic.play().catch(e => {
                console.log('Music resume failed:', e);
            });
            this.musicPaused = false;
        }
    }

    playClick() {
        try {
            this.clickSound.currentTime = 0;
            this.clickSound.play().catch(e => {});
        } catch (e) {}
    }

    playHit() {
        try {
            // В Python версии каждый раз создается новый Sound объект (hit_cometa = pygame.mixer.Sound(...))
            // Поэтому звук всегда играет, даже если предыдущий еще не закончился
            // В JavaScript создаем новый Audio элемент для каждого воспроизведения
            const sound = new Audio(this.hitSound.src); // Создаем новый Audio элемент
            sound.volume = this.hitSound.volume || 1.0;
            sound.currentTime = 0;
            sound.play().catch(e => {
                // Если не удалось воспроизвести, пробуем оригинальный элемент
                try {
                    this.hitSound.currentTime = 0;
                    this.hitSound.play().catch(e2 => {});
                } catch (e2) {}
            });
        } catch (e) {
            // Fallback на обычное воспроизведение
            try {
                this.hitSound.currentTime = 0;
                this.hitSound.play().catch(e => {});
            } catch (e2) {}
        }
    }

    playHeal() {
        try {
            this.healSound.currentTime = 0;
            this.healSound.play().catch(e => {});
        } catch (e) {}
    }
}


