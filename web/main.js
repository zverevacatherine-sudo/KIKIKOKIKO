// Main game loop and state management
class Game {
    constructor() {
        // Check if all dependencies are loaded
        if (typeof Departments === 'undefined') {
            console.error('Departments is not defined! Make sure departments_data.js is loaded.');
            return;
        }
        if (typeof CONFIG === 'undefined') {
            console.error('CONFIG is not defined! Make sure config.js is loaded.');
            return;
        }
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.focus();
        
        // Game state
        this.state = "menu"; // "menu", "rules", "game"
        this.rules_completed = false;
        this.running = true;
        this.paused = false; // Флаг паузы (как в Python: while pause блокирует цикл)
        
        // Game objects
        this.background = new Background();
        this.rocket = new Spaceship(this.ctx);
        this.scores = new Scores(this.ctx);
        this.start_screen = new StartScreen(this.ctx);
        this.rules_screen = new RulesScreen(this.ctx);
        this.test_screen = new Quiz(this.ctx);
        this.soundManager = new SoundManager();
        this.eventsManager = new EventsManager();
        
        // Start background music immediately (как в Python: music() вызывается сразу)
        // В Python версии music() вызывается в main.py строка 97, до игрового цикла
        // В браузере автозапуск звука может быть заблокирован, поэтому пробуем запустить
        // и если не получится - запустим при первом клике пользователя
        this.soundManager.playMusic().catch(() => {
            // Если автозапуск заблокирован, запустим при первом взаимодействии
            const startMusicOnInteraction = () => {
                this.soundManager.playMusic();
                document.removeEventListener('click', startMusicOnInteraction);
                document.removeEventListener('keydown', startMusicOnInteraction);
            };
            document.addEventListener('click', startMusicOnInteraction, { once: true });
            document.addEventListener('keydown', startMusicOnInteraction, { once: true });
        });
        
        // Game entities
        this.asteroids = [];
        this.departments = [];
        this.keys = [];
        this.planets = [];
        this.active_house = null;
        
        // Input
        this.keys_pressed = {};
        this.mouse_x = 0;
        this.mouse_y = 0;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
    }

    setupEventListeners() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys_pressed[e.key] = true;
            
            if (e.key === ' ' && this.state === 'game' && this.scores.game && !this.test_screen.quiz_active && !this.paused) {
                e.preventDefault();
                this.doPause(); // Войти в паузу
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys_pressed[e.key] = false;
        });
        
        // Mouse - handle clicks
        this.canvas.addEventListener('click', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleMouseClick(x, y);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse_x = e.clientX - rect.left;
            this.mouse_y = e.clientY - rect.top;
        });
    }

    handleMouseClick(x, y) {
        // Scale coordinates if canvas is scaled (canvas might be displayed at different size)
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        
        console.log('Click at:', scaledX, scaledY, 'State:', this.state); // Debug
        
        if (this.state === "menu") {
            const action = this.start_screen.handle_click(scaledX, scaledY, this.rules_completed);
            console.log('Menu action:', action); // Debug
            if (action === "rules") {
                this.rules_screen.open();
                this.state = "rules";
            } else if (action === "start") {
                this.start_game_new_session();
                this.state = "game";
                // Музыка уже играет с начала (запущена в конструкторе)
            }
        } else if (this.state === "rules") {
            const r = this.rules_screen.handle_click(scaledX, scaledY);
            if (r === "done") {
                this.rules_completed = true;
                this.state = "menu";
            }
        } else if (this.state === "game") {
            if (this.scores.game_over) {
                if (this.scores.restart_clicked(x, y)) {
                    this.restart_run_keep_departments();
                }
                return;
            }
            
            if (this.test_screen.quiz_active) {
                const result = this.test_screen.handle_click(x, y);
                if (result === "finished" && this.active_house) {
                    this.scores.add_department_score(this.test_screen.get_score());
                    this.scores.completed_departments.add(this.active_house.dept_id);
                    this.active_house.start_fly_out();
                    this.active_house = null;
                    this.eventsManager.resume_after_quiz(this.scores);
                    
                    if (this.scores.completed_departments.size >= this.eventsManager.Total_departments) {
                        this.scores.to_planet = true;
                        this.eventsManager.pause_timers();
                        this.eventsManager.schedule_planet_spawn();
                    }
                }
            } else {
                if (!this.scores.to_planet) {
                    const dept = this.clicked_department(x, y);
                    if (dept) {
                        const dept_data = Departments.find(d => d.id === dept.dept_id);
                        if (dept_data) {
                            this.active_house = dept;
                            this.eventsManager.pause_timers();
                            this.test_screen.open_quiz(dept_data);
                            this.soundManager.pauseMusic();
                        }
                    }
                }
            }
        }
    }

    clicked_department(x, y) {
        for (const dept of this.departments) {
            const rect = dept.rect;
            if (x >= rect.x && x <= rect.x + rect.width &&
                y >= rect.y && y <= rect.y + rect.height) {
                this.soundManager.playClick();
                return dept;
            }
        }
        return null;
    }

    reset_world() {
        this.asteroids = [];
        this.departments = [];
        this.keys = [];
        this.planets = [];
        this.rocket.health = 3;
        this.rocket.x = 600;
        this.rocket.y = 400;
        this.rocket.hitbox.x = 600;
        this.rocket.hitbox.y = 450;
        this.test_screen.close_quiz();
    }

    start_game_new_session() {
        this.reset_world();
        this.scores.game = true;
        this.scores.game_over = false;
        this.scores.to_planet = false;
        this.scores.reached_planet = false;
        this.scores.completed_departments.clear();
        this.scores.total_correct_answers = 0;
        this.active_house = null;
        this.eventsManager.init_events();
        // Музыка уже играет с начала (запущена в конструкторе Game)
    }

    restart_run_keep_departments() {
        this.reset_world();
        this.scores.game = true;
        this.scores.game_over = false;
        this.scores.reached_planet = false;
        this.scores.to_planet = (this.scores.completed_departments.size >= this.eventsManager.Total_departments);
        this.active_house = null;
        this.eventsManager.init_events();
        
        if (this.scores.to_planet) {
            this.eventsManager.pause_timers();
            this.eventsManager.schedule_planet_spawn();
        }
        // Музыка уже играет с начала (запущена в конструкторе Game)
    }

    spawnKey() {
        this.keys.push(new Key());
    }

    spawnDepartment() {
        // Check if department is still on screen
        for (const dept of this.departments) {
            if (!dept.fly_out) {
                return;
            }
        }
        
        // Find next uncompleted department
        for (const d of Departments) {
            if (!this.scores.completed_departments.has(d.id)) {
                this.departments.push(new Border(d.stop_x, d.image, d.id, d.title, d.y));
                
                // Schedule next department
                this.eventsManager.Department_fly_in = setTimeout(() => {
                    if (this.state === 'game' && !this.scores.to_planet) {
                        this.spawnDepartment();
                    }
                }, this.eventsManager.Departments_between_time_distance);
                return;
            }
        }
    }

    spawnPlanet() {
        if (this.planets.length === 0) {
            this.planets.push(new Planet());
        }
    }

    doPause() {
        // Freeze the game until SPACE is pressed again (как в Python версии: while pause блокирует цикл)
        this.paused = true; // Остановить игровой цикл
        this.soundManager.pauseMusic(); // Остановить музыку
        
        const handleKeyDown = (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                this.paused = false; // Возобновить игру
                this.soundManager.resumeMusic(); // Возобновить музыку
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
    }

    gameLoop() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        
        // Update background
        this.background.update();
        this.background.render(this.ctx);
        
        // State-specific logic
        if (this.state === "menu") {
            this.start_screen.draw(this.rules_completed);
        } else if (this.state === "rules") {
            this.rules_screen.draw();
        } else if (this.state === "game") {
            // Если игра на паузе - показать overlay и выйти (как в Python: while pause блокирует обновление)
            if (this.paused) {
                // Dark overlay (как в Python: overlay.set_alpha(150), overlay.fill((39, 44, 78)))
                this.ctx.fillStyle = "rgba(39, 44, 78, 0.59)";
                this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
                
                // Pause text (как в Python: font.render("Pause! Press SPACE to continue", True, "white"))
                this.ctx.fillStyle = "white";
                this.ctx.font = "50px Optima, Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillText("Pause! Press SPACE to continue", CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
                
                requestAnimationFrame(() => this.gameLoop());
                return; // Не обновлять игру во время паузы
            }
            // Update departments
            if (this.scores.game) {
                for (const dept of this.departments) {
                    dept.update();
                }
            }
            
            // Draw departments
            for (const dept of this.departments) {
                dept.draw(this.ctx);
            }
            
            // Remove off-screen departments
            this.departments = this.departments.filter(d => !d.isOffScreen());
            
            if (this.scores.game) {
                if (this.test_screen.quiz_active) {
                    // Quiz is active - freeze gameplay
                    this.scores.show_health(this.rocket);
                    this.scores.visited_departments();
                    this.test_screen.draw();
                } else {
                    // Normal gameplay
                    this.rocket.update(this.keys_pressed);
                    this.rocket.draw();
                    
                    EventsManager.make_comet(this.asteroids, this.ctx);
                    EventsManager.move_key(this.keys, this.ctx);
                    EventsManager.collide(this.rocket, this.asteroids, this.keys, this.soundManager);
                    
                    // Planet phase
                    for (const planet of this.planets) {
                        planet.update();
                        planet.draw(this.ctx);
                    }
                    
                    EventsManager.collide_with_planet(this.rocket, this.planets, this.scores);
                    
                    // UI
                    this.scores.show_health(this.rocket);
                    this.scores.visited_departments();
                    this.scores.finish(this.rocket);
                    this.test_screen.draw();
                }
            } else {
                // Game over or win
                for (const planet of this.planets) {
                    planet.update();
                    planet.draw(this.ctx);
                }
                
                this.scores.show_health(this.rocket);
                this.scores.visited_departments();
                this.scores.finish(this.rocket);
                this.scores.draw_restart_button();
            }
            
            // Music control
            if (this.test_screen.quiz_active) {
                this.soundManager.pauseMusic();
            } else {
                this.soundManager.resumeMusic();
            }
        }
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when page loads and all scripts are ready
window.addEventListener('load', () => {
    // Wait a bit to ensure all scripts are parsed
    setTimeout(() => {
        if (typeof Departments === 'undefined') {
            console.error('Error: Departments is not defined. Check if departments_data.js loaded correctly.');
            document.body.innerHTML = '<div style="color: white; padding: 20px; text-align: center;"><h1>Error loading game</h1><p>Please refresh the page. If the problem persists, check the browser console (F12).</p></div>';
            return;
        }
        if (typeof CONFIG === 'undefined') {
            console.error('Error: CONFIG is not defined. Check if config.js loaded correctly.');
            return;
        }
        try {
            window.game = new Game();
        } catch (error) {
            console.error('Error initializing game:', error);
            document.body.innerHTML = '<div style="color: white; padding: 20px; text-align: center;"><h1>Error initializing game</h1><p>' + error.message + '</p><p>Check the browser console (F12) for details.</p></div>';
        }
    }, 100);
});

