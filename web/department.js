// Department (Border) class
class Border {
    constructor(stop_x, image_path, dept_id, title, y) {
        this.stop_x = stop_x;
        this.dept_id = dept_id;
        this.title = title;
        this.speed = 2;
        this.fly_out = false;
        this.image = null;
        this.imageLoaded = false;
        this.width = 220;
        this.height = 220;
        this.x = CONFIG.WIDTH;
        this.y = y;
        
        loadImage(image_path).then(img => {
            const canvas = document.createElement('canvas');
            canvas.width = 220;
            canvas.height = 220;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 220, 220);
            this.image = canvas;
            this.imageLoaded = true;
        });
    }

    start_fly_out() {
        this.fly_out = true;
    }

    update() {
        if (!this.imageLoaded) return;
        
        if (!this.fly_out) {
            if (this.x > this.stop_x) {
                this.x -= this.speed;
            } else {
                this.x = this.stop_x;
            }
        } else {
            this.x -= this.speed * 2;
        }
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




