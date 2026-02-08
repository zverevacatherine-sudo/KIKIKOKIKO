// Key (Health pickup) class
class Key {
    constructor() {
        this.image = null;
        this.imageLoaded = false;
        this.width = 106;
        this.height = 88;
        this.x = CONFIG.WIDTH;
        this.y = 118 + Math.random() * (620 - 118);
        
        loadImage("PICS/Stats/key.png").then(img => {
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
            x: this.x + 10, // inflate(-20, -20)
            y: this.y + 10,
            width: this.width - 20,
            height: this.height - 20,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    update() {
        if (!this.imageLoaded) return;
        
        this.x -= 3;
        
        // Update hitbox
        this.hitbox.x = this.x + 10;
        this.hitbox.y = this.y + 10;
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

