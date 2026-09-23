# KiKoGame Challenge – Study Flow Update

This update mirrors the final No-Challenge study-flow logic while retaining the complete Challenge mechanics.

## Same study flow as No-Challenge

- Pre Study is required before Assessment Rules.
- 3 content questions (correct answers B, D, D).
- Pre Study attention check.
- Attention-check failure code: `C1F917Z4`.
- All 3 content questions wrong (attention check passed): `CT8ALQ35`.
- Music stays off during Pre Study and starts when Assessment Rules are opened.
- Rules load `Ru1.png` through `Ru12.png`.
- Start unlocks only after Pre Study + Rules.
- Departments appear after 4 seconds.
- Department 3 contains the same attention check; it is excluded from the 15-point score.
- Department 3 attention failure code: `C1F917Z4`.
- Successful AIity arrival shows Mission completed + score + Continue with Experience Study button.
- Qualtrics:
  `https://qualtricsxmbx6typpy4.qualtrics.com/jfe/form/SV_0w8HiouRlacVJH0`
- Department click sound is replayed on every department click.

## Challenge mechanics retained

- Asteroids/comets
- Collision damage
- 3 lives
- Healing keys
- Hit sound
- Healing sound
- Game over when lives reach zero
- Repair the spaceship restart flow

## Files to replace/add in the Challenge repository

- `start_screen.js`
- `study_screens.js` (new if not already present)
- `quiz.js`
- `main.js`
- `scores.js`
- `events.js`
- `sound.js`
- `index.html`

Keep all Challenge PICS assets, especially:
- `PICS/Enemy/*`
- `PICS/Stats/key.png`
- `PICS/Stats/gear-cog-setting.png`
- `PICS/Music/Collision1.mp3`
- `PICS/Music/Heilung.mp3`
- `PICS/Music/Sound_82750500 1634320431.mp3`
- `PICS/Rules/Rules/Ru1.png` through `Ru12.png`
