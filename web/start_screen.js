// StartScreen and RulesScreen classes
class StartScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.logo = null;
        this.logoLoaded = false;
        this.btn_w = 560;
        this.btn_h = 110;
        
        this.btn_start = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: CONFIG.HEIGHT / 2 - 15,
            width: this.btn_w,
            height: this.btn_h
        };
        
        this.btn_rules = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: CONFIG.HEIGHT / 2 + 120,
            width: this.btn_w,
            height: this.btn_h
        };
        
        loadImage('PICS/Player_right/LOGO.png').then(img => {
            const canvas = document.createElement('canvas');
            canvas.width = 950;
            canvas.height = 300;
            const c = canvas.getContext('2d');
            c.drawImage(img, 0, 0, 950, 300);
            this.logo = canvas;
            this.logoLoaded = true;
        });
    }

    draw(start_allowed) {
        // Dark overlay
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.59)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Draw logo
        if (this.logoLoaded) {
            this.ctx.drawImage(this.logo, CONFIG.WIDTH / 2 - 475, 20);
        }

        // Start button
        if (start_allowed) {
            this.ctx.fillStyle = "rgb(39, 44, 78)";
            this._drawRoundedRect(this.btn_start.x, this.btn_start.y, this.btn_start.width, this.btn_start.height, 18);
            this.ctx.fill();
            
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;
            this._drawRoundedRect(this.btn_start.x, this.btn_start.y, this.btn_start.width, this.btn_start.height, 18);
            this.ctx.stroke();
            
            this.ctx.fillStyle = "white";
            this.ctx.font = "44px Optima, Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Start", this.btn_start.x + this.btn_start.width / 2, this.btn_start.y + this.btn_start.height / 2 + 15);
        } else {
            this.ctx.fillStyle = "rgb(128, 128, 128)";
            this._drawRoundedRect(this.btn_start.x, this.btn_start.y, this.btn_start.width, this.btn_start.height, 18);
            this.ctx.fill();
            
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;
            this._drawRoundedRect(this.btn_start.x, this.btn_start.y, this.btn_start.width, this.btn_start.height, 18);
            this.ctx.stroke();
            
            this.ctx.fillStyle = "rgb(96, 96, 96)";
            this.ctx.font = "44px Optima, Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Start", this.btn_start.x + this.btn_start.width / 2, this.btn_start.y + this.btn_start.height / 2 - 5);
            
            this.ctx.font = "24px Optima, Arial";
            this.ctx.fillText("(Read the rules first)", this.btn_start.x + this.btn_start.width / 2, this.btn_start.y + this.btn_start.height / 2 + 30);
        }

        // Rules button
        this.ctx.fillStyle = "rgb(39, 44, 78)";
        this._drawRoundedRect(this.btn_rules.x, this.btn_rules.y, this.btn_rules.width, this.btn_rules.height, 18);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this._drawRoundedRect(this.btn_rules.x, this.btn_rules.y, this.btn_rules.width, this.btn_rules.height, 18);
        this.ctx.stroke();
        
        this.ctx.fillStyle = "white";
        this.ctx.font = "44px Optima, Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Assessment rules", this.btn_rules.x + this.btn_rules.width / 2, this.btn_rules.y + this.btn_rules.height / 2 + 15);
    }

    handle_click(x, y, start_allowed) {
        if (pointInRect(x, y, this.btn_start)) {
            if (start_allowed) {
                return "start";
            }
            return null;
        }
        
        if (pointInRect(x, y, this.btn_rules)) {
            return "rules";
        }
        
        return null;
    }
    
    _drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
}

class RulesScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.index = 0;
        this.rule_images = [];
        this.imagesLoaded = false;
        this.circle_r = 30;
        this.circle_center = { x: CONFIG.WIDTH - 90, y: CONFIG.HEIGHT - 90 };
        
        const rulePaths = [];
        for (let i = 1; i <= 16; i++) {
            rulePaths.push(`PICS/Rules/Rules/Ru${i}.png`);
        }
        
        loadImages(rulePaths).then(images => {
            this.rule_images = images.map(img => {
                const canvas = document.createElement('canvas');
                canvas.width = CONFIG.WIDTH;
                canvas.height = CONFIG.HEIGHT;
                const c = canvas.getContext('2d');
                c.drawImage(img, 0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
                return canvas;
            });
            this.imagesLoaded = true;
        });
    }

    open() {
        this.index = 0;
    }

    draw() {
        if (!this.imagesLoaded || this.index >= this.rule_images.length) return;
        
        this.ctx.drawImage(this.rule_images[this.index], 0, 0);

        // Circle button
        this.ctx.fillStyle = "rgb(39, 44, 78)";
        this.ctx.beginPath();
        this.ctx.arc(this.circle_center.x, this.circle_center.y, this.circle_r, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = "rgb(200, 200, 200)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.circle_center.x, this.circle_center.y, this.circle_r, 0, Math.PI * 2);
        this.ctx.stroke();

        // Arrow
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Gill Sans, Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(">", this.circle_center.x, this.circle_center.y + 12);
    }

    handle_click(x, y) {
        if (pointInCircle(x, y, this.circle_center.x, this.circle_center.y, this.circle_r)) {
            this.index++;
            if (this.index >= this.rule_images.length) {
                return "done";
            }
        }
        return null;
    }
}

