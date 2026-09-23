// StartScreen and RulesScreen classes

class StartScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.logo = null;
        this.logoLoaded = false;

        this.btn_w = 560;
        this.btn_h = 90;

        // Keep the familiar KiKoGame order, while adding Pre Study as step 1.
        this.btn_start = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: 325,
            width: this.btn_w,
            height: this.btn_h
        };

        this.btn_rules = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: 435,
            width: this.btn_w,
            height: this.btn_h
        };

        this.btn_prestudy = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: 545,
            width: this.btn_w,
            height: this.btn_h
        };

        loadImage("PICS/Player_right/LOGO.png").then(img => {
            const canvas = document.createElement("canvas");
            canvas.width = 950;
            canvas.height = 300;

            const c = canvas.getContext("2d");
            c.drawImage(img, 0, 0, 950, 300);

            this.logo = canvas;
            this.logoLoaded = true;
        });
    }

    draw(prestudy_completed, rules_completed) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.59)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        if (this.logoLoaded) {
            this.ctx.drawImage(
                this.logo,
                CONFIG.WIDTH / 2 - 475,
                20
            );
        }

        // START is available only after Pre Study + Rules.
        const start_allowed =
            prestudy_completed && rules_completed;

        this._drawButton(
            this.btn_start,
            "Start",
            start_allowed
                ? "rgb(39, 44, 78)"
                : "rgb(128, 128, 128)",
            start_allowed
                ? "white"
                : "rgb(96, 96, 96)"
        );

        // RULES become available only after passing the Pre Study.
        this._drawButton(
            this.btn_rules,
            "Assessment rules",
            prestudy_completed
                ? "rgb(39, 44, 78)"
                : "rgb(128, 128, 128)",
            prestudy_completed
                ? "white"
                : "rgb(96, 96, 96)"
        );

        // PRE STUDY is the first mandatory step.
        this._drawButton(
            this.btn_prestudy,
            prestudy_completed
                ? "Pre Study completed"
                : "Pre Study",
            prestudy_completed
                ? "rgb(128, 128, 128)"
                : "rgb(39, 44, 78)",
            prestudy_completed
                ? "rgb(96, 96, 96)"
                : "white"
        );
    }

    _drawButton(rect, text, bg, fg) {
        this.ctx.fillStyle = bg;
        this._drawRoundedRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            18
        );
        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this._drawRoundedRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            18
        );
        this.ctx.stroke();

        this.ctx.fillStyle = fg;
        this.ctx.font = "40px Comicsansms, Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            text,
            rect.x + rect.width / 2,
            rect.y + rect.height / 2 + 14
        );
    }

    handle_click(
        x,
        y,
        prestudy_completed,
        rules_completed
    ) {
        if (
            !prestudy_completed &&
            pointInRect(x, y, this.btn_prestudy)
        ) {
            return "prestudy";
        }

        if (
            prestudy_completed &&
            pointInRect(x, y, this.btn_rules)
        ) {
            return "rules";
        }

        if (
            prestudy_completed &&
            rules_completed &&
            pointInRect(x, y, this.btn_start)
        ) {
            return "start";
        }

        return null;
    }

    _drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(
            x + width,
            y,
            x + width,
            y + radius
        );
        this.ctx.lineTo(
            x + width,
            y + height - radius
        );
        this.ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height
        );
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(
            x,
            y + height,
            x,
            y + height - radius
        );
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(
            x,
            y,
            x + radius,
            y
        );
        this.ctx.closePath();
    }
}


class RulesScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.index = 0;
        this.rule_images = [];
        this.imagesLoaded = false;

        this.next_rect = {
            x: CONFIG.WIDTH - 150,
            y: CONFIG.HEIGHT - 125,
            width: 85,
            height: 65
        };

        const rulePaths = [];

        // Updated study version: Ru1.png through Ru12.png.
        for (let i = 1; i <= 12; i++) {
            rulePaths.push(
                `PICS/Rules/Rules/Ru${i}.png`
            );
        }

        loadImages(rulePaths).then(images => {
            this.rule_images = images.map(img => {
                const canvas =
                    document.createElement("canvas");

                canvas.width = CONFIG.WIDTH;
                canvas.height = CONFIG.HEIGHT;

                const c = canvas.getContext("2d");

                c.drawImage(
                    img,
                    0,
                    0,
                    CONFIG.WIDTH,
                    CONFIG.HEIGHT
                );

                return canvas;
            });

            this.imagesLoaded = true;
        });
    }

    open() {
        this.index = 0;
    }

    draw() {
        if (
            !this.imagesLoaded ||
            this.index >= this.rule_images.length
        ) {
            return;
        }

        this.ctx.drawImage(
            this.rule_images[this.index],
            0,
            0
        );

        this.ctx.fillStyle = "rgb(39, 44, 78)";
        this._drawRoundedRect(
            this.next_rect.x,
            this.next_rect.y,
            this.next_rect.width,
            this.next_rect.height,
            12
        );
        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this._drawRoundedRect(
            this.next_rect.x,
            this.next_rect.y,
            this.next_rect.width,
            this.next_rect.height,
            12
        );
        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            ">",
            this.next_rect.x + this.next_rect.width / 2,
            this.next_rect.y + 43
        );
    }

    handle_click(x, y) {
        if (pointInRect(x, y, this.next_rect)) {
            this.index += 1;

            if (this.index >= this.rule_images.length) {
                return "done";
            }
        }

        return null;
    }

    _drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(
            x + width,
            y,
            x + width,
            y + radius
        );
        this.ctx.lineTo(
            x + width,
            y + height - radius
        );
        this.ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height
        );
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(
            x,
            y + height,
            x,
            y + height - radius
        );
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(
            x,
            y,
            x + radius,
            y
        );
        this.ctx.closePath();
    }
}
