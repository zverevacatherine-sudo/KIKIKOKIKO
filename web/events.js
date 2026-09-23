// Events system - timers, collisions, spawning.
// Challenge condition: asteroids/comets, healing keys and 3-life system are retained.
class EventsManager {
    constructor() {
        this.Key_fly_in = null;
        this.Department_fly_in = null;
        this.AIity_fly_in = null;

        this.Key_between_time_distance = 9000;
        this.Departments_between_time_distance = 4000;
        this.AIity_delay = 3000;

        this.Total_departments = Departments.length;
    }

    init_events() {
        // Clear existing timers.
        if (this.Key_fly_in) clearInterval(this.Key_fly_in);
        if (this.Department_fly_in) clearTimeout(this.Department_fly_in);
        if (this.AIity_fly_in) clearTimeout(this.AIity_fly_in);

        this.Key_fly_in = null;
        this.Department_fly_in = null;
        this.AIity_fly_in = null;

        // Healing key every 9 seconds.
        this.Key_fly_in = setInterval(() => {
            if (
                window.game &&
                window.game.state === "game" &&
                !window.game.test_screen.quiz_active &&
                window.game.scores.game
            ) {
                window.game.spawnKey();
            }
        }, this.Key_between_time_distance);

        // First department after 4 seconds.
        this.Department_fly_in = setTimeout(() => {
            if (
                window.game &&
                window.game.state === "game" &&
                !window.game.scores.to_planet &&
                window.game.scores.game
            ) {
                window.game.spawnDepartment();
            }
        }, this.Departments_between_time_distance);
    }

    pause_timers() {
        if (this.Key_fly_in) clearInterval(this.Key_fly_in);
        if (this.Department_fly_in) clearTimeout(this.Department_fly_in);
        if (this.AIity_fly_in) clearTimeout(this.AIity_fly_in);

        this.Key_fly_in = null;
        this.Department_fly_in = null;
        this.AIity_fly_in = null;
    }

    resume_after_quiz(scores) {
        if (!scores.game) {
            return;
        }

        // Restart healing-key timer.
        if (this.Key_fly_in) {
            clearInterval(this.Key_fly_in);
        }

        this.Key_fly_in = setInterval(() => {
            if (
                window.game &&
                window.game.state === "game" &&
                !window.game.test_screen.quiz_active &&
                window.game.scores.game
            ) {
                window.game.spawnKey();
            }
        }, this.Key_between_time_distance);

        // Restart department timer only before planet phase.
        if (!scores.to_planet) {
            if (this.Department_fly_in) {
                clearTimeout(this.Department_fly_in);
            }

            this.Department_fly_in = setTimeout(() => {
                if (
                    window.game &&
                    window.game.state === "game" &&
                    !window.game.scores.to_planet &&
                    window.game.scores.game
                ) {
                    window.game.spawnDepartment();
                }
            }, this.Departments_between_time_distance);
        }
    }

    schedule_planet_spawn() {
        if (this.AIity_fly_in) {
            clearTimeout(this.AIity_fly_in);
        }

        this.AIity_fly_in = setTimeout(() => {
            if (
                window.game &&
                window.game.state === "game" &&
                window.game.scores.to_planet &&
                window.game.scores.game &&
                window.game.planets.length === 0
            ) {
                window.game.spawnPlanet();
            }
        }, this.AIity_delay);
    }

    static collide(hero, enemies, keys, soundManager) {
        // Asteroid/comet collision: lose one life.
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            if (rectCollide(hero.hitbox, enemy.hitbox)) {
                soundManager.playHit();
                enemies.splice(i, 1);
                hero.health -= 1;
            }
        }

        // Healing-key collision: restore one life, up to 3.
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];

            if (rectCollide(hero.hitbox, key.hitbox)) {
                soundManager.playHeal();
                keys.splice(i, 1);

                if (hero.health < 3) {
                    hero.health += 1;
                }
            }
        }
    }

    static collide_with_planet(hero, planets, scores) {
        if (!scores.to_planet) {
            return false;
        }

        for (let i = 0; i < planets.length; i++) {
            const planet = planets[i];

            if (rectCollide(hero.hitbox, planet.hitbox)) {
                scores.reached_planet = true;
                planets.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    static make_comet(enemies, ctx) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            enemy.update();
            enemy.draw(ctx);

            if (enemy.isOffScreen()) {
                enemies.splice(i, 1);
            }
        }

        // Keep up to fourt challenge objects on screen.
        if (enemies.length < 4) {
            enemies.push(
                new Komets(
                    4 + Math.random() * 2
                )
            );
        }
    }

    static move_key(keys, ctx) {
        for (let i = keys.length - 1; i >= 0; i--) {
            const key = keys[i];

            key.update();
            key.draw(ctx);

            if (key.isOffScreen()) {
                keys.splice(i, 1);
            }
        }
    }
}
