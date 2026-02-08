// Planet (Final destination) class
class Planet {
    constructor() {
        this.image = null;
        this.imageLoaded = false;
        this.width = 360;
        this.height = 360;
        this.speed = 2;
        this.stop_x = 750;
        this.x = CONFIG.WIDTH;
        this.y = 200;
        
        loadImage("PICS/New Hero, Rocket/last planet.png").then(img => {
            const canvas = document.createElement('canvas');
            canvas.width = 360;
            canvas.height = 360;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 360, 360);
            this.image = canvas;
            this.imageLoaded = true;
        });
        
        // Hitbox (smaller than image)
        this.hitbox = {
            x: this.x + 35, // inflate(-70, -70)
            y: this.y + 35,
            width: this.width - 70,
            height: this.height - 70,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }

    update() {
        if (!this.imageLoaded) return;
        
        if (this.x > this.stop_x) {
            this.x -= 2;
        }
        
        // Update hitbox
        this.hitbox.x = this.x + 35;
        this.hitbox.y = this.y + 35;
        this.hitbox.centerX = this.x + this.width / 2;
        this.hitbox.centerY = this.y + this.height / 2;
    }

    draw(ctx) {
        if (!this.imageLoaded) return;
        ctx.drawImage(this.image, this.x, this.y);
    }
    
    get rect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

