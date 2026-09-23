// Pre-study screening and termination screens.

class PreStudyScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.question_index = 0;
        this.content_correct = 0;
        this.attention_passed = false;
        this.answer_rects = [];

        this.questions = [
            {
                question: "What are the problems with regulating AI solutions?",
                answers: [
                    "a) The EU, USA, and China cannot agree on which of their three regulatory models should be implemented in the rest of the world.",
                    "b) The legislation on AI solutions cannot keep up with the rapid development and dissemination of new programs.",
                    "c) The EU's AI Act has clarified fundamental ethical issues.",
                    "d) In the EU, the state must approve every AI solution. This takes longer than developers would like, leading to difficulties in industry and politics."
                ],
                correct: 1,
                attention: false
            },
            {
                question: "What risks and challenges does using AI solutions entail in the three areas?",
                answers: [
                    "a) Legal and ethical issues have not yet been fully clarified.",
                    "b) In a social context, using confidential data to train and operate AI systems is completely unobjectionable.",
                    "c) Health insurance companies do not yet support using AI systems.",
                    "d) The power consumption for training AI systems is very high."
                ],
                correct: 3,
                attention: false
            },
            {
                question: "Which of the following contributes to the ethical development of computer vision applications?",
                answers: [
                    "a) Capturing and storing sensitive data during video surveillance.",
                    "b) Falsifying the identity of others during facial recognition.",
                    "c) The development of medical imaging applications without testing and ethical review.",
                    "d) Putting the safety and protection of users first when developing self-driving cars."
                ],
                correct: 3,
                attention: false
            },
            {
                question: "Attention check: Please select \"Please answer here\".",
                answers: [
                    "a) Continue",
                    "b) Please answer here",
                    "c) Next question",
                    "d) None of the above"
                ],
                correct: 1,
                attention: true
            }
        ];
    }

    open() {
        this.question_index = 0;
        this.content_correct = 0;
        this.attention_passed = false;
        this.answer_rects = [];
    }

    handle_click(x, y) {
        if (this.question_index >= this.questions.length) {
            return null;
        }

        for (let i = 0; i < this.answer_rects.length; i++) {
            if (!pointInRect(x, y, this.answer_rects[i])) {
                continue;
            }

            const current = this.questions[this.question_index];

            if (current.attention) {
                this.attention_passed = (i === current.correct);
            } else if (i === current.correct) {
                this.content_correct += 1;
            }

            this.question_index += 1;

            if (this.question_index >= this.questions.length) {
                // Two separate exclusion conditions:
                // 1) Failed attention check -> C1F917Z4
                // 2) All three content questions wrong -> CT8ALQ35
                //
                // If both happen at the same time, the attention-check
                // failure takes priority.
                if (!this.attention_passed) {
                    return "attention_failed";
                }

                if (this.content_correct === 0) {
                    return "content_failed";
                }

                return "passed";
            }

            return "answered";
        }

        return null;
    }

    draw() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.86)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        const current = this.questions[this.question_index];

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";

        this.ctx.font = "24px Comicsansms, Arial";
        this.ctx.fillText(
            `Pre Study — Question ${this.question_index + 1}/${this.questions.length}`,
            CONFIG.WIDTH / 2,
            70
        );

        this.ctx.font = "28px Comicsansms, Arial";
        const questionLines = this._wrapText(
            current.question,
            1080,
            "28px Comicsansms, Arial",
            3
        );

        questionLines.forEach((line, index) => {
            this.ctx.fillText(
                line,
                CONFIG.WIDTH / 2,
                120 + index * 34
            );
        });

        const answerStartY = 235;
        const answerGap = 103;
        const answerHeight = 88;

        this.answer_rects = [];

        current.answers.forEach((answer, index) => {
            const rect = {
                x: CONFIG.WIDTH / 2 - 550,
                y: answerStartY + index * answerGap,
                width: 1100,
                height: answerHeight
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

            this.ctx.strokeStyle = "rgb(200, 200, 200)";
            this.ctx.lineWidth = 1;
            this._drawRoundedRect(
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                12
            );
            this.ctx.stroke();

            const answerLines = this._wrapText(
                answer,
                1010,
                "20px Comicsansms, Arial",
                3
            );

            this.ctx.fillStyle = "black";
            this.ctx.font = "20px Comicsansms, Arial";
            this.ctx.textAlign = "center";

            const lineHeight = 24;
            const totalHeight = answerLines.length * lineHeight;
            const firstBaseline =
                rect.y + rect.height / 2 - totalHeight / 2 + 18;

            answerLines.forEach((line, lineIndex) => {
                this.ctx.fillText(
                    line,
                    rect.x + rect.width / 2,
                    firstBaseline + lineIndex * lineHeight
                );
            });
        });
    }

    _wrapText(text, maxWidth, font, maxLines) {
        const words = text.split(/\s+/);
        const lines = [];
        let current = "";

        this.ctx.font = font;

        for (const word of words) {
            const candidate = current ? `${current} ${word}` : word;

            if (this.ctx.measureText(candidate).width <= maxWidth) {
                current = candidate;
            } else {
                if (current) {
                    lines.push(current);
                }

                current = word;

                if (lines.length === maxLines - 1) {
                    break;
                }
            }
        }

        if (current && lines.length < maxLines) {
            lines.push(current);
        }

        // If the text was truncated, append an ellipsis safely.
        const combined = lines.join(" ");
        if (combined.length < text.length && lines.length > 0) {
            let last = lines.length - 1;
            let shortened = lines[last];

            while (
                shortened.length > 0 &&
                this.ctx.measureText(`${shortened}...`).width > maxWidth
            ) {
                shortened = shortened.slice(0, -1).trim();
            }

            lines[last] = `${shortened}...`;
        }

        return lines;
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


class TerminationScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.prolific_code = "C1F917Z4";
    }

    set_code(code) {
        this.prolific_code = code;
    }

    draw() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.86)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";

        this.ctx.font = "38px Comicsansms, Arial";
        this.ctx.fillText(
            "Thank you for the participation.",
            CONFIG.WIDTH / 2,
            275
        );

        this.ctx.font = "28px Comicsansms, Arial";
        this.ctx.fillText(
            "You may now go back to Prolific and enter the code",
            CONFIG.WIDTH / 2,
            345
        );

        this.ctx.font = "bold 44px Comicsansms, Arial";
        this.ctx.fillText(
            this.prolific_code,
            CONFIG.WIDTH / 2,
            420
        );
    }
}
