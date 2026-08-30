class RulesScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.index = 0;
        this.rule_images = [];
        this.imagesLoaded = false;

        // Same button style as in the Basic version
        this.next_rect = {
            x: CONFIG.WIDTH - 150,
            y: CONFIG.HEIGHT - 125,
            width: 85,
            height: 65
        };

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

        // Draw current rules page
        this.ctx.drawImage(
            this.rule_images[this.index],
            0,
            0
        );


        // -------------------------
        // NEXT BUTTON
        // -------------------------

        this.ctx.fillStyle = "rgb(39, 44, 78)";

        this._drawRoundedRect(
            this.next_rect.x,
            this.next_rect.y,
            this.next_rect.width,
            this.next_rect.height,
            12
        );

        this.ctx.fill();


        // White border
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


        // Arrow
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

            this.index++;

            if (this.index >= this.rule_images.length) {
                return "done";
            }
        }

        return null;
    }


    _drawRoundedRect(x, y, width, height, radius) {

        this.ctx.beginPath();

        this.ctx.moveTo(
            x + radius,
            y
        );

        this.ctx.lineTo(
            x + width - radius,
            y
        );

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

        this.ctx.lineTo(
            x + radius,
            y + height
        );

        this.ctx.quadraticCurveTo(
            x,
            y + height,
            x,
            y + height - radius
        );

        this.ctx.lineTo(
            x,
            y + radius
        );

        this.ctx.quadraticCurveTo(
            x,
            y,
            x + radius,
            y
        );

        this.ctx.closePath();
    }
}
