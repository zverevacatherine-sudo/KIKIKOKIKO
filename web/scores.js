// Scores class - Challenge condition UI and game state management.

class Scores {
    constructor(ctx) {
        this.ctx = ctx;

        this.image_hp = null;
        this.image_progress = null;
        this.imagesLoaded = false;

        this.experience_study_url =
            "https://qualtricsxmbx6typpy4.qualtrics.com/jfe/form/SV_0w8HiouRlacVJH0";

        Promise.all([
            loadImage(
                "PICS/Stats/gear-cog-setting.png"
            ),
            loadImage(
                "PICS/Departaments/visited depa.png"
            )
        ]).then(([hpImg, progressImg]) => {
            const hpCanvas =
                document.createElement("canvas");

            hpCanvas.width = 70;
            hpCanvas.height = 70;

            const hpCtx =
                hpCanvas.getContext("2d");

            hpCtx.drawImage(
                hpImg,
                0,
                0,
                70,
                70
            );

            this.image_hp = hpCanvas;

            const progressCanvas =
                document.createElement("canvas");

            progressCanvas.width = 132;
            progressCanvas.height = 90;

            const progressCtx =
                progressCanvas.getContext("2d");

            progressCtx.drawImage(
                progressImg,
                0,
                0,
                132,
                90
            );

            this.image_progress =
                progressCanvas;

            this.imagesLoaded = true;
        });

        this.completed_departments =
            new Set();

        this.total_correct_answers = 0;

        this.total_departments =
            (
                typeof Departments !==
                    "undefined" &&
                Departments
            )
                ? Departments.length
                : 5;

        // Attention checks are added dynamically in Quiz and do not count.
        this.max_answers =
            (
                typeof Departments !==
                    "undefined" &&
                Departments
            )
                ? Departments.reduce(
                    (sum, department) =>
                        sum +
                        department.questions.length,
                    0
                )
                : 15;

        this.game = true;
        this.game_over = false;
        this.reached_planet = false;
        this.to_planet = false;

        this.restart_rect = {
            x: CONFIG.WIDTH / 2 - 220,
            y: CONFIG.HEIGHT / 2 + 120,
            width: 440,
            height: 80
        };

        this.continue_study_rect = {
            x: CONFIG.WIDTH / 2 - 310,
            y: 455,
            width: 620,
            height: 78
        };
    }

    show_health(hero) {
        if (!this.imagesLoaded) {
            return;
        }

        let x = 10;

        for (
            let i = 0;
            i < hero.health;
            i++
        ) {
            this.ctx.drawImage(
                this.image_hp,
                x,
                20
            );

            x += 70;
        }
    }

    visited_departments() {
        if (!this.imagesLoaded) {
            return;
        }

        const count =
            this.completed_departments.size;

        this.ctx.fillStyle = "white";
        this.ctx.font =
            "42px Comicsansms, Arial";
        this.ctx.textAlign = "left";

        this.ctx.drawImage(
            this.image_progress,
            940,
            20
        );

        this.ctx.fillText(
            `${count}/${this.total_departments}`,
            1085,
            72
        );
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
        this.ctx.font =
            "50px Comicsansms, Arial";
        this.ctx.textAlign = "center";

        this.ctx.fillText(
            "You were not cautious enough",
            CONFIG.WIDTH / 2,
            330
        );
    }

    _draw_win_text() {
        this.ctx.fillStyle = "white";
        this.ctx.font =
            "40px Comicsansms, Arial";
        this.ctx.textAlign = "center";

        this.ctx.fillText(
            "Mission completed! You successfully reached AIity",
            CONFIG.WIDTH / 2,
            320
        );

        this.ctx.font =
            "30px Comicsansms, Arial";

        this.ctx.fillText(
            `with a score of: ${this.total_correct_answers} / ${this.max_answers}`,
            CONFIG.WIDTH / 2,
            385
        );

        this.ctx.fillStyle =
            "rgb(39, 44, 78)";

        this._drawRoundedRect(
            this.continue_study_rect.x,
            this.continue_study_rect.y,
            this.continue_study_rect.width,
            this.continue_study_rect.height,
            16
        );

        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        this._drawRoundedRect(
            this.continue_study_rect.x,
            this.continue_study_rect.y,
            this.continue_study_rect.width,
            this.continue_study_rect.height,
            16
        );

        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.font =
            "28px Comicsansms, Arial";
        this.ctx.textAlign = "center";

        this.ctx.fillText(
            "Click here to continue with Experience Study",
            CONFIG.WIDTH / 2,
            this.continue_study_rect.y +
                this.continue_study_rect.height / 2 +
                10
        );
    }

    draw_restart_button() {
        if (!this.game_over) {
            return;
        }

        this.ctx.fillStyle =
            "rgb(39, 44, 78)";

        this._drawRoundedRect(
            this.restart_rect.x,
            this.restart_rect.y,
            this.restart_rect.width,
            this.restart_rect.height,
            12
        );

        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        this._drawRoundedRect(
            this.restart_rect.x,
            this.restart_rect.y,
            this.restart_rect.width,
            this.restart_rect.height,
            12
        );

        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.font =
            "40px Comicsansms, Arial";
        this.ctx.textAlign = "center";

        this.ctx.fillText(
            "Repair the spaceship",
            this.restart_rect.x +
                this.restart_rect.width / 2,
            this.restart_rect.y +
                this.restart_rect.height / 2 +
                15
        );
    }

    restart_clicked(x, y) {
        return (
            this.game_over &&
            pointInRect(
                x,
                y,
                this.restart_rect
            )
        );
    }

    handle_success_click(x, y) {
        if (
            this.reached_planet &&
            pointInRect(
                x,
                y,
                this.continue_study_rect
            )
        ) {
            window.location.href =
                this.experience_study_url;

            return true;
        }

        return false;
    }

    add_department_score(
        correct_answers
    ) {
        this.total_correct_answers +=
            correct_answers;
    }

    _drawRoundedRect(
        x,
        y,
        width,
        height,
        radius
    ) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
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
