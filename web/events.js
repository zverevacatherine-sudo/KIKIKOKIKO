// Events system - timers, collisions, spawning
class EventsManager {
    constructor() {
        this.Key_fly_in = null;
        this.Department_fly_in = null;
        this.AIity_fly_in = null;
        this.Key_between_time_distance = 9000;
        this.Departments_between_time_distance = 12000;
        this.AIity_delay = 3000;
        this.Total_departments = Departments.length;
    }

    init_events() {
        // Clear existing timers
        if (this.Key_fly_in) clearInterval(this.Key_fly_in);
        if (this.Department_fly_in) clearTimeout(this.Department_fly_in);
        if (this.AIity_fly_in) clearTimeout(this.AIity_fly_in);
        
        // Start health key timer (every 9 seconds)
        this.Key_fly_in = setInterval(() => {
            if (window.game && window.game.state === 'game' && !window.game.test_screen.quiz_active) {
                window.game.spawnKey();
            }
        }, this.Key_between_time_distance);
        
        // Start department timer (first department after 12 seconds)
        this.Department_fly_in = setTimeout(() => {
            if (window.game && window.game.state === 'game' && !window.game.scores.to_planet) {
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
        // Restart health key timer
        this.Key_fly_in = setInterval(() => {
            if (window.game && window.game.state === 'game' && !window.game.test_screen.quiz_active) {
                window.game.spawnKey();
            }
        }, this.Key_between_time_distance);
        
        // Only restart department timer if not in planet phase
        if (!scores.to_planet) {
            this.Department_fly_in = setTimeout(() => {
                if (window.game && window.game.state === 'game' && !window.game.scores.to_planet) {
                    window.game.spawnDepartment();
                }
            }, this.Departments_between_time_distance);
        }
    }

    schedule_planet_spawn() {
        this.AIity_fly_in = setTimeout(() => {
            if (window.game && window.game.state === 'game' && window.game.scores.to_planet && window.game.planets.length === 0) {
                window.game.spawnPlanet();
            }
        }, this.AIity_delay);
    }

    static collide(hero, enemies, keys, soundManager) {
        // Check collisions with enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (rectCollide(hero.hitbox, enemy.hitbox)) {
                soundManager.playHit();
                enemies.splice(i, 1);
                hero.health -= 1;
            }
        }
        
        // Check collisions with keys
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
        if (!scores.to_planet) return false;
        
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
        // Update and draw enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.update();
            enemy.draw(ctx);
            if (enemy.isOffScreen()) {
                enemies.splice(i, 1);
            }
        }
        
        // Spawn new enemies if less than 3
        if (enemies.length < 3) {
            enemies.push(new Komets(4 + Math.random() * 2));
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




