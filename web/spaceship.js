// Spaceship class - player rocket
class Spaceship {
    constructor(ctx) {
        this.ctx = ctx;
        this.flyRight = [];
        this.moveLeft = [];
        this.image = null;
        this.index = 0;
        this.x = 600;
        this.y = 400;
        this.width = 230;
        this.height = 150;
        this.speed = 3;
        this.health = 3;
        this.imagesLoaded = false;
        
        // Load right-facing images
        const rightImages = [
            'PICS/Player_right/R11.png',
            'PICS/Player_right/R22.png',
            'PICS/Player_right/R33.png',
            'PICS/Player_right/R44.png',
            'PICS/Player_right/R55.png',
            'PICS/Player_right/R66.png'
        ];
        
        // Load left-facing images
        const leftImages = [
            'PICS/Player_left/L11.png',
            'PICS/Player_left/L22.png',
            'PICS/Player_left/L33.png',
            'PICS/Player_left/L44.png',
            'PICS/Player_left/L55.png',
            'PICS/Player_left/L66.png'
        ];
        
        Promise.all([
            loadImages(rightImages),
            loadImages(leftImages)
        ]).then(([right, left]) => {
            // Scale images to 230x150
            this.flyRight = right.map(img => {
                const canvas = document.createElement('canvas');
                canvas.width = 230;
                canvas.height = 150;
                const c = canvas.getContext('2d');
                c.drawImage(img, 0, 0, 230, 150);
                return canvas;
            });
            
            this.moveLeft = left.map(img => {
                const canvas = document.createElement('canvas');
                canvas.width = 230;
                canvas.height = 150;
                const c = canvas.getContext('2d');
                c.drawImage(img, 0, 0, 230, 150);
                return canvas;
            });
            
            this.image = this.flyRight[0];
            this.imagesLoaded = true;
        });
        
        // Hitbox (smaller than image)
        this.hitbox = {
            x: this.x,
            y: this.y + 50, // Inflate(0, -100) means height reduced by 100
            width: this.width,
            height: this.height - 100
        };
    }

    update(keys) {
        if (!this.imagesLoaded) return;
        
        // Default animation (right-facing)
        this.image = this.flyRight[Math.floor(this.index / 6)];
        
        // Movement
        if (keys['ArrowRight'] && this.x < 700) {
            this.image = this.flyRight[Math.floor(this.index / 6)];
            this.x += this.speed;
        }
        
        if (keys['ArrowLeft'] && this.x > 0) {
            this.image = this.moveLeft[Math.floor(this.index / 6)];
            this.x -= this.speed;
        }
        
        if (keys['ArrowUp'] && this.y > 45) {
            this.y -= this.speed;
        }
        
        if (keys['ArrowDown'] && this.y < 560) {
            this.y += this.speed;
        }
        
        // Animation counter
        this.index++;
        if (this.index >= 30) {
            this.index = 0;
        }
        
        // Update hitbox
        this.hitbox.x = this.x;
        this.hitbox.y = this.y + 50;
        this.hitbox.centerX = this.x + this.width / 2;
        this.hitbox.centerY = this.y + this.height / 2;
    }

    draw() {
        if (!this.imagesLoaded) return;
        this.ctx.drawImage(this.image, this.x, this.y);
    }
    
    get rect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            centerX: this.x + this.width / 2,
            centerY: this.y + this.height / 2
        };
    }
}

