// Enemy (Asteroid/Comet) class
class Komets {
    constructor(speed) {
        this.speed = speed;
        this.image = null;
        this.imageLoaded = false;
        this.width = 106;
        this.height = 88;
        this.x = CONFIG.WIDTH;
        this.y = Math.random() * 620;
        
        // Randomly choose one of two asteroid images
        const asteroids = [
            'PICS/Enemy/Stone1.png',
            'PICS/Enemy/Stone2.png'
        ];
        const chosen = asteroids[Math.floor(Math.random() * 2)];
        
        loadImage(chosen).then(img => {
            const canvas = document.createElement('canvas');
            canvas.width = 106;
            canvas.height = 88;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 106, 88);
            this.image = canvas;
            this.imageLoaded = true;
        });
        
        // Hitbox (smaller than image)
        this.hitbox = {
            x: this.x + 7.5, // inflate(-15, -65) means width reduced by 15, height by 65
            y: this.y + 32.5,
            width: this.width - 15,
            height: this.height - 65,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    update() {
        if (!this.imageLoaded) return;
        
        this.x -= this.speed;
        
        // Update hitbox
        this.hitbox.x = this.x + 7.5;
        this.hitbox.y = this.y + 32.5;
        this.hitbox.centerX = this.x + this.width / 2;
        this.hitbox.centerY = this.y + this.height / 2;
    }

    draw(ctx) {
        if (!this.imageLoaded) return;
        ctx.drawImage(this.image, this.x, this.y);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    get rect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            right: this.x + this.width
        };
    }
}

