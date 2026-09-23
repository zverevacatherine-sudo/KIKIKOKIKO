// Quiz class - test overlay system.
// Department 3 contains an additional attention check that does not affect the AI-literacy score.

class Quiz {
    constructor(ctx) {
        this.ctx = ctx;
        this.quiz_active = false;
        this.list_of_questions = [];
        this.department_title = "";
        this.department_id = null;
        this.question_index = 0;
        this.correct_answered_q = 0;
        this.answer_rects = [];
        this.scored_question_count = 0;
        this.attention_check_index = -1;

        this.continue_rect = {
            x: CONFIG.WIDTH / 2 - 200,
            y: CONFIG.HEIGHT / 2 + 120,
            width: 400,
            height: 70
        };
    }

    open_quiz(dept_data) {
        this.quiz_active = true;
        this.department_title = dept_data.title;
        this.department_id = dept_data.id;
        this.question_index = 0;
        this.correct_answered_q = 0;

        // Copy original questions so Departments data remains unchanged.
        this.list_of_questions = dept_data.questions.map(question => [
            question[0],
            [...question[1]],
            question[2]
        ]);

        this.scored_question_count = dept_data.questions.length;
        this.attention_check_index = -1;

        // Add the in-study attention check only to Department 3.
        if (String(dept_data.id) === "3") {
            this.attention_check_index = this.list_of_questions.length;

            this.list_of_questions.push([
                "Dear participant, please select \"Please answer here\".",
                [
                    "a) Continue",
                    "b) Please answer here",
                    "c) Next question",
                    "d) None of the above"
                ],
                1
            ]);
        }
    }

    close_quiz() {
        this.quiz_active = false;
    }

    wrap_to_three_lines(text, maxWidth) {
        const words = text.split(" ");
        const lines = ["", "", ""];
        let lineIndex = 0;
        let i = 0;

        while (i < words.length && lineIndex < 3) {
            const test =
                (lines[lineIndex] + " " + words[i]).trim();

            const width = measureText(
                this.ctx,
                test,
                "28px Comicsansms, Arial"
            );

            if (width <= maxWidth) {
                lines[lineIndex] = test;
                i++;
            } else {
                lineIndex++;
            }
        }

        if (i < words.length) {
            while (
                measureText(
                    this.ctx,
                    lines[2] + "...",
                    "28px Comicsansms, Arial"
                ) > maxWidth &&
                lines[2].length > 0
            ) {
                lines[2] =
                    lines[2].slice(0, -1).trim();
            }

            lines[2] =
                (lines[2] || "") + "...";
        }

        return lines;
    }

    wrap_answer_to_two_lines(text, maxWidth) {
        const words = text.split(" ");
        let line1 = "";
        let i = 0;

        while (i < words.length) {
            const test =
                (line1 + " " + words[i]).trim();

            const width = measureText(
                this.ctx,
                test,
                "22px Comicsansms, Arial"
            );

            if (width <= maxWidth) {
                line1 = test;
                i++;
            } else {
                break;
            }
        }

        let line2 = "";

        while (i < words.length) {
            const test =
                (line2 + " " + words[i]).trim();

            const width = measureText(
                this.ctx,
                test,
                "22px Comicsansms, Arial"
            );

            if (width <= maxWidth) {
                line2 = test;
                i++;
            } else {
                break;
            }
        }

        if (i < words.length) {
            while (
                measureText(
                    this.ctx,
                    line2 + "...",
                    "22px Comicsansms, Arial"
                ) > maxWidth &&
                line2.length > 0
            ) {
                line2 =
                    line2.slice(0, -1).trim();
            }

            line2 += "...";
        }

        return [line1, line2];
    }

    handle_click(x, y) {
        if (!this.quiz_active) {
            return null;
        }

        if (
            this.question_index >=
            this.list_of_questions.length
        ) {
            if (
                pointInRect(
                    x,
                    y,
                    this.continue_rect
                )
            ) {
                this.close_quiz();
                return "finished";
            }

            return null;
        }

        for (
            let i = 0;
            i < this.answer_rects.length;
            i++
        ) {
            const rect = this.answer_rects[i];

            if (!pointInRect(x, y, rect)) {
                continue;
            }

            const correct_idx =
                this.list_of_questions[
                    this.question_index
                ][2];

            // The Department 3 attention check is screening only.
            if (
                this.question_index ===
                this.attention_check_index
            ) {
                if (i !== correct_idx) {
                    this.close_quiz();
                    return "attention_failed";
                }

                this.question_index += 1;
                return "answered";
            }

            if (i === correct_idx) {
                this.correct_answered_q += 1;
            }

            this.question_index += 1;

            return "answered";
        }

        return null;
    }

    draw() {
        if (!this.quiz_active) {
            return;
        }

        this.ctx.fillStyle =
            "rgba(0, 0, 0, 0.86)";

        this.ctx.fillRect(
            0,
            0,
            CONFIG.WIDTH,
            CONFIG.HEIGHT
        );

        // Results screen
        if (
            this.question_index >=
            this.list_of_questions.length
        ) {
            this.ctx.fillStyle = "white";
            this.ctx.font =
                "28px Comicsansms, Arial";
            this.ctx.textAlign = "center";

            this.ctx.fillText(
                `${this.department_title} - RESULTS`,
                CONFIG.WIDTH / 2,
                CONFIG.HEIGHT / 2 - 60
            );

            this.ctx.font =
                "26px Comicsansms, Arial";

            this.ctx.fillText(
                `Correct: ${this.correct_answered_q} / ${this.scored_question_count}`,
                CONFIG.WIDTH / 2,
                CONFIG.HEIGHT / 2 + 10
            );

            this.ctx.fillStyle =
                "rgb(60, 60, 60)";

            this._drawRoundedRect(
                this.continue_rect.x,
                this.continue_rect.y,
                this.continue_rect.width,
                this.continue_rect.height,
                12
            );

            this.ctx.fill();

            this.ctx.strokeStyle =
                "rgb(200, 200, 200)";
            this.ctx.lineWidth = 1;

            this._drawRoundedRect(
                this.continue_rect.x,
                this.continue_rect.y,
                this.continue_rect.width,
                this.continue_rect.height,
                12
            );

            this.ctx.stroke();

            this.ctx.fillStyle = "white";
            this.ctx.font =
                "26px Comicsansms, Arial";

            this.ctx.fillText(
                "Continue",
                CONFIG.WIDTH / 2,
                this.continue_rect.y +
                    this.continue_rect.height / 2 +
                    10
            );

            return;
        }

        const [q, answers] =
            this.list_of_questions[
                this.question_index
            ];

        this.ctx.fillStyle = "white";
        this.ctx.font =
            "22px Comicsansms, Arial";
        this.ctx.textAlign = "center";

        this.ctx.fillText(
            this.department_title,
            CONFIG.WIDTH / 2,
            110
        );

        const question_text =
            `Q${this.question_index + 1}/${this.list_of_questions.length}: ${q}`;

        const [q1, q2, q3] =
            this.wrap_to_three_lines(
                question_text,
                1150
            );

        this.ctx.font =
            "28px Comicsansms, Arial";

        this.ctx.fillText(
            q1,
            CONFIG.WIDTH / 2,
            145
        );

        this.ctx.fillText(
            q2,
            CONFIG.WIDTH / 2,
            175
        );

        this.ctx.fillText(
            q3,
            CONFIG.WIDTH / 2,
            205
        );

        this.answer_rects = [];

        for (
            let i = 0;
            i < answers.length;
            i++
        ) {
            const rect = {
                x: CONFIG.WIDTH / 2 - 550,
                y: 260 + i * 95,
                width: 1100,
                height: 75
            };

            this.answer_rects.push(rect);

            this.ctx.fillStyle = "white";

            this._drawRoundedRect(
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                12
            );

            this.ctx.fill();

            this.ctx.strokeStyle =
                "rgb(200, 200, 200)";
            this.ctx.lineWidth = 1;

            this._drawRoundedRect(
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                12
            );

            this.ctx.stroke();

            const [a1, a2] =
                this.wrap_answer_to_two_lines(
                    answers[i],
                    1000
                );

            this.ctx.fillStyle = "black";
            this.ctx.font =
                "22px Comicsansms, Arial";
            this.ctx.textAlign = "center";

            if (a2 === "") {
                this.ctx.fillText(
                    a1,
                    rect.x + rect.width / 2,
                    rect.y + rect.height / 2 + 8
                );
            } else {
                this.ctx.fillText(
                    a1,
                    rect.x + rect.width / 2,
                    rect.y + rect.height / 2 - 12
                );

                this.ctx.fillText(
                    a2,
                    rect.x + rect.width / 2,
                    rect.y + rect.height / 2 + 20
                );
            }
        }
    }

    get_score() {
        return this.correct_answered_q;
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
