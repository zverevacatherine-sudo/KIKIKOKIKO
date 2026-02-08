// Scores class - UI and game state management
class Scores {
    constructor(ctx) {
        this.ctx = ctx;
        this.image_hp = null;
        this.image_progress = null;
        this.imagesLoaded = false;
        
        // Load UI images
        Promise.all([
            loadImage("PICS/Stats/gear-cog-setting.png"),
            loadImage("PICS/Departaments/visited depa.png")
        ]).then(([hpImg, progressImg]) => {
            // Scale health icon to 70x70
            const hpCanvas = document.createElement('canvas');
            hpCanvas.width = 70;
            hpCanvas.height = 70;
            const hpCtx = hpCanvas.getContext('2d');
            hpCtx.drawImage(hpImg, 0, 0, 70, 70);
            this.image_hp = hpCanvas;
            
            // Scale progress icon to 132x90
            const progressCanvas = document.createElement('canvas');
            progressCanvas.width = 132;
            progressCanvas.height = 90;
            const progressCtx = progressCanvas.getContext('2d');
            progressCtx.drawImage(progressImg, 0, 0, 132, 90);
            this.image_progress = progressCanvas;
            
            this.imagesLoaded = true;
        });
        
        // Game state
        this.completed_departments = new Set();
        this.total_correct_answers = 0;
        // Calculate max answers safely
        this.max_answers = (typeof Departments !== 'undefined' && Departments) 
            ? Departments.reduce((sum, d) => sum + d.questions.length, 0)
            : 20; // fallback value
        this.game = true;
        this.game_over = false;
        this.reached_planet = false;
        this.to_planet = false;
        
        // Restart button
        this.restart_rect = {
            x: CONFIG.WIDTH / 2 - 220,
            y: CONFIG.HEIGHT / 2 + 120,
            width: 440,
            height: 80
        };
    }

    show_health(hero) {
        if (!this.imagesLoaded) return;
        
        let x = 10;
        for (let i = 0; i < hero.health; i++) {
            this.ctx.drawImage(this.image_hp, x, 20);
            x += 70;
        }
    }

    visited_departments() {
        if (!this.imagesLoaded) return;
        
        const count = this.completed_departments.size;
        this.ctx.fillStyle = "white";
        this.ctx.font = "50px Optima, Arial";
        this.ctx.textAlign = "left";
        this.ctx.drawImage(this.image_progress, 1000, 20);
        this.ctx.fillText(count.toString(), 1110, 70);
    }

    finish(hero) {
        if (this.reached_planet) {
            this._draw_win_text();
            this.game = false;
            return;
        }
        
        if (hero.health <= 0) {
            this._draw_lose_text();
            this.game = false;
            this.game_over = true;
        }
    }

    _draw_lose_text() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "50px Optima, Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText("You were not cautious enough", 275, 330);
    }

    _draw_win_text() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Optima, Arial";
        this.ctx.textAlign = "left";
        this.ctx.fillText("Mission completed! You successfully reached AIity", 225, 330);
        
        this.ctx.font = "30px Optima, Arial";
        this.ctx.fillText(`with a score of: ${this.total_correct_answers} / ${this.max_answers}`, 225, 400);
    }

    draw_restart_button() {
        if (!this.game_over) return;
        
        // Button background
        this.ctx.fillStyle = "rgb(39, 44, 78)";
        this._drawRoundedRect(this.restart_rect.x, this.restart_rect.y, this.restart_rect.width, this.restart_rect.height, 12);
        this.ctx.fill();
        
        // Button border
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this._drawRoundedRect(this.restart_rect.x, this.restart_rect.y, this.restart_rect.width, this.restart_rect.height, 12);
        this.ctx.stroke();
        
        // Button text
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px Optima, Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Start from beginning", this.restart_rect.x + this.restart_rect.width / 2, this.restart_rect.y + this.restart_rect.height / 2 + 15);
    }

    restart_clicked(x, y) {
        return this.game_over &&
               x >= this.restart_rect.x &&
               x <= this.restart_rect.x + this.restart_rect.width &&
               y >= this.restart_rect.y &&
               y <= this.restart_rect.y + this.restart_rect.height;
    }

    add_department_score(correct_answers) {
        this.total_correct_answers += correct_answers;
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

