# Challenge KiKoGame – Response Tracking Update

Replace ONLY these files in the Challenge GitHub repository:

- main.js
- quiz.js
- study_screens.js

Do NOT replace scores.js. The Challenge Qualtrics URL already configured in your current scores.js is preserved.

The code sends the same variables as Basic and No-Challenge:

condition = challenge
PROLIFIC_PID / STUDY_ID / SESSION_ID
prestudy_score
pre_q1 ... pre_q3
pre_q1_correct ... pre_q3_correct
pre_attention / pre_attention_correct
q1 ... q15
q1_correct ... q15_correct
total_correct
main_attention / main_attention_correct

`total_correct` is recomputed directly from q1_correct ... q15_correct and is therefore always 0-15.

Challenge mechanics are untouched because events.js, enemy.js, key.js, scores.js, sound.js and spaceship.js are not replaced. Your manual 4-comet change in events.js therefore remains.
