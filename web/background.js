// Background class - scrolling space background
class Background {
    constructor() {
        this.image = null;
        this.imageLoaded = false;
        this.movingSpeed = 1;
        this.bgX1 = 0;
        this.bgY1 = 0;
        this.bgX2 = 0;
        this.bgY2 = 0;
        
        // Load background image
        loadImage("PICS/Background/cosmos4.png").then(img => {
            // Scale image to 1365x763
            const canvas = document.createElement('canvas');
            canvas.width = 1365;
            canvas.height = 763;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 1365, 763);
            this.image = canvas;
            this.imageLoaded = true;
            this.bgX2 = 1365; // Start second image after first
        });
    }

    update() {
        if (!this.imageLoaded) return;
        
        // Move both backgrounds left
        this.bgX1 -= this.movingSpeed;
        this.bgX2 -= this.movingSpeed;

        // Loop first image
        if (this.bgX1 <= -1365) {
            this.bgX1 = 1365;
        }

        // Loop second image
        if (this.bgX2 <= -1365) {
            this.bgX2 = 1365;
        }
    }

    render(ctx) {
        if (!this.imageLoaded) return;
        
        ctx.drawImage(this.image, this.bgX1, this.bgY1);
        ctx.drawImage(this.image, this.bgX2, this.bgY2);
    }
}

