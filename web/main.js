// Main game loop and state management.
// Challenge condition + Pre Study + attention checks + Qualtrics continuation.

class Game {
    constructor() {
        if (typeof Departments === "undefined") {
            console.error(
                "Departments is not defined! Make sure departments_data.js is loaded."
            );
            return;
        }

        if (typeof CONFIG === "undefined") {
            console.error(
                "CONFIG is not defined! Make sure config.js is loaded."
            );
            return;
        }

        this.canvas =
            document.getElementById(
                "gameCanvas"
            );

        this.ctx =
            this.canvas.getContext("2d");

        this.canvas.width =
            CONFIG.WIDTH;

        this.canvas.height =
            CONFIG.HEIGHT;

        this.canvas.focus();

        // States:
        // menu, prestudy, rules, game, terminated
        this.state = "menu";

        this.prestudy_completed = false;
        this.rules_completed = false;

        this.running = true;
        this.paused = false;

        this.pause_show_rules = false;

        this.pause_rules_button = {
            x: CONFIG.WIDTH / 2 - 170,
            y: CONFIG.HEIGHT / 2 + 40,
            width: 340,
            height: 70
        };

        // Game objects
        this.background =
            new Background();

        this.rocket =
            new Spaceship(this.ctx);

        this.scores =
            new Scores(this.ctx);

        this.start_screen =
            new StartScreen(this.ctx);

        this.prestudy_screen =
            new PreStudyScreen(this.ctx);

        this.rules_screen =
            new RulesScreen(this.ctx);

        this.termination_screen =
            new TerminationScreen(this.ctx);

        this.test_screen =
            new Quiz(this.ctx);

        this.soundManager =
            new SoundManager();

        this.eventsManager =
            new EventsManager();

        // Music intentionally stays OFF on page load and during Pre Study.
        // It starts when Assessment Rules are opened.

        // Challenge entities
        this.asteroids = [];
        this.departments = [];
        this.keys = [];
        this.planets = [];
        this.active_house = null;

        // Input
        this.keys_pressed = {};
        this.mouse_x = 0;
        this.mouse_y = 0;

        this.setupEventListeners();

        this.lastTime =
            performance.now();

        this.gameLoop();
    }


    setupEventListeners() {
        document.addEventListener(
            "keydown",
            event => {
                this.keys_pressed[
                    event.key
                ] = true;

                if (
                    event.key === " " &&
                    this.state === "game" &&
                    this.scores.game &&
                    !this.test_screen.quiz_active &&
                    !this.paused
                ) {
                    event.preventDefault();
                    this.doPause();
                }
            }
        );

        document.addEventListener(
            "keyup",
            event => {
                this.keys_pressed[
                    event.key
                ] = false;
            }
        );

        this.canvas.addEventListener(
            "click",
            event => {
                event.preventDefault();

                const rect =
                    this.canvas
                        .getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                this.handleMouseClick(
                    x,
                    y
                );
            }
        );

        this.canvas.addEventListener(
            "mousemove",
            event => {
                const rect =
                    this.canvas
                        .getBoundingClientRect();

                this.mouse_x =
                    event.clientX -
                    rect.left;

                this.mouse_y =
                    event.clientY -
                    rect.top;
            }
        );
    }


    handleMouseClick(x, y) {
        const rect =
            this.canvas
                .getBoundingClientRect();

        const scaleX =
            this.canvas.width /
            rect.width;

        const scaleY =
            this.canvas.height /
            rect.height;

        const scaledX =
            x * scaleX;

        const scaledY =
            y * scaleY;


        // MENU
        if (this.state === "menu") {
            const action =
                this.start_screen
                    .handle_click(
                        scaledX,
                        scaledY,
                        this.prestudy_completed,
                        this.rules_completed
                    );

            if (action === "prestudy") {
                this.prestudy_screen.open();
                this.state = "prestudy";
            } else if (
                action === "rules"
            ) {
                this.rules_screen.open();

                // Music starts for the first time here.
                this.soundManager
                    .playMusic()
                    .catch(() => {});

                this.state = "rules";
            } else if (
                action === "start"
            ) {
                this.start_game_new_session();
                this.state = "game";
            }

            return;
        }


        // PRE STUDY
        if (
            this.state === "prestudy"
        ) {
            const result =
                this.prestudy_screen
                    .handle_click(
                        scaledX,
                        scaledY
                    );

            if (result === "passed") {
                this.prestudy_completed =
                    true;

                // Return silently to the menu.
                this.state = "menu";
            } else if (
                result === "attention_failed"
            ) {
                this.terminateParticipant(
                    "C1F917Z4"
                );
            } else if (
                result === "content_failed"
            ) {
                this.terminateParticipant(
                    "CT8ALQ35"
                );
            }

            return;
        }


        // RULES
        if (this.state === "rules") {
            const result =
                this.rules_screen
                    .handle_click(
                        scaledX,
                        scaledY
                    );

            if (result === "done") {
                this.rules_completed =
                    true;

                this.state = "menu";
            }

            return;
        }


        // TERMINATED
        if (
            this.state === "terminated"
        ) {
            return;
        }


        if (this.state !== "game") {
            return;
        }


        // Successful completion button.
        if (
            this.scores.reached_planet &&
            this.scores.handle_success_click(
                scaledX,
                scaledY
            )
        ) {
            return;
        }


        // Pause mode
        if (this.paused) {
            if (
                this.pause_show_rules
            ) {
                const result =
                    this.rules_screen
                        .handle_click(
                            scaledX,
                            scaledY
                        );

                if (
                    result === "done"
                ) {
                    this.pause_show_rules =
                        false;
                }

                return;
            }

            if (
                pointInRect(
                    scaledX,
                    scaledY,
                    this.pause_rules_button
                )
            ) {
                this.pause_show_rules =
                    true;

                this.rules_screen.open();
            }

            return;
        }


        // Challenge game-over repair button.
        if (this.scores.game_over) {
            if (
                this.scores.restart_clicked(
                    scaledX,
                    scaledY
                )
            ) {
                this.restart_run_keep_departments();
            }

            return;
        }


        // Quiz clicks
        if (
            this.test_screen.quiz_active
        ) {
            const result =
                this.test_screen
                    .handle_click(
                        scaledX,
                        scaledY
                    );

            // Department 3 attention check failed.
            if (
                result ===
                "attention_failed"
            ) {
                this.terminateParticipant(
                    "C1F917Z4"
                );
                return;
            }

            if (
                result === "finished" &&
                this.active_house
            ) {
                this.scores
                    .add_department_score(
                        this.test_screen
                            .get_score()
                    );

                this.scores
                    .completed_departments
                    .add(
                        this.active_house
                            .dept_id
                    );

                this.active_house
                    .start_fly_out();

                this.active_house =
                    null;

                this.eventsManager
                    .resume_after_quiz(
                        this.scores
                    );

                if (
                    this.scores
                        .completed_departments
                        .size >=
                    this.eventsManager
                        .Total_departments
                ) {
                    this.scores.to_planet =
                        true;

                    this.eventsManager
                        .pause_timers();

                    this.eventsManager
                        .schedule_planet_spawn();
                }
            }

            return;
        }


        // Department clicks
        if (!this.scores.to_planet) {
            const department =
                this.clicked_department(
                    scaledX,
                    scaledY
                );

            if (department) {
                const departmentData =
                    Departments.find(
                        item =>
                            item.id ===
                            department.dept_id
                    );

                if (departmentData) {
                    this.active_house =
                        department;

                    this.eventsManager
                        .pause_timers();

                    this.test_screen
                        .open_quiz(
                            departmentData
                        );

                    this.soundManager
                        .pauseMusic();
                }
            }
        }
    }


    clicked_department(x, y) {
        for (
            const department
            of this.departments
        ) {
            const rect =
                department.rect;

            if (
                x >= rect.x &&
                x <=
                    rect.x +
                    rect.width &&
                y >= rect.y &&
                y <=
                    rect.y +
                    rect.height
            ) {
                // Sound is replayed on EVERY department click.
                this.soundManager
                    .playClick();

                return department;
            }
        }

        return null;
    }


    terminateParticipant(
        prolificCode = "C1F917Z4"
    ) {
        this.eventsManager.pause_timers();
        this.soundManager.pauseMusic();
        this.test_screen.close_quiz();

        this.termination_screen.set_code(
            prolificCode
        );

        this.paused = false;
        this.pause_show_rules = false;
        this.active_house = null;

        this.state = "terminated";
    }


    reset_world() {
        this.asteroids = [];
        this.departments = [];
        this.keys = [];
        this.planets = [];

        this.rocket.health = 3;
        this.rocket.x = 600;
        this.rocket.y = 400;

        if (this.rocket.hitbox) {
            this.rocket.hitbox.x = 600;
            this.rocket.hitbox.y = 450;
        }

        this.test_screen.close_quiz();

        this.pause_show_rules = false;
        this.paused = false;
    }


    start_game_new_session() {
        this.reset_world();

        this.scores.game = true;
        this.scores.game_over = false;
        this.scores.to_planet = false;
        this.scores.reached_planet =
            false;

        this.scores
            .completed_departments
            .clear();

        this.scores
            .total_correct_answers = 0;

        this.active_house = null;

        // Music already started in Rules; continue it when the game begins.
        this.soundManager.resumeMusic();
        this.eventsManager.init_events();
    }


    restart_run_keep_departments() {
        this.reset_world();

        this.scores.game = true;
        this.scores.game_over = false;
        this.scores.reached_planet =
            false;

        this.scores.to_planet =
            (
                this.scores
                    .completed_departments
                    .size >=
                this.eventsManager
                    .Total_departments
            );

        this.active_house = null;

        this.soundManager.resumeMusic();
        this.eventsManager.init_events();

        if (this.scores.to_planet) {
            this.eventsManager.pause_timers();
            this.eventsManager.schedule_planet_spawn();
        }
    }


    spawnKey() {
        this.keys.push(
            new Key()
        );
    }


    spawnDepartment() {
        for (
            const department
            of this.departments
        ) {
            if (!department.fly_out) {
                return;
            }
        }

        for (
            const departmentData
            of Departments
        ) {
            if (
                !this.scores
                    .completed_departments
                    .has(
                        departmentData.id
                    )
            ) {
                this.departments.push(
                    new Border(
                        departmentData.stop_x,
                        departmentData.image,
                        departmentData.id,
                        departmentData.title,
                        departmentData.y
                    )
                );

                if (
                    this.eventsManager
                        .Department_fly_in
                ) {
                    clearTimeout(
                        this.eventsManager
                            .Department_fly_in
                    );
                }

                this.eventsManager
                    .Department_fly_in =
                    setTimeout(
                        () => {
                            if (
                                this.state ===
                                    "game" &&
                                !this.scores
                                    .to_planet &&
                                this.scores.game
                            ) {
                                this.spawnDepartment();
                            }
                        },
                        this.eventsManager
                            .Departments_between_time_distance
                    );

                return;
            }
        }
    }


    spawnPlanet() {
        if (
            this.planets.length === 0
        ) {
            this.planets.push(
                new Planet()
            );
        }
    }


    doPause() {
        this.paused = true;
        this.pause_show_rules = false;

        this.soundManager.pauseMusic();
        this.eventsManager.pause_timers();

        const handleKeyDown =
            event => {
                if (
                    event.key === " " &&
                    !this.pause_show_rules
                ) {
                    event.preventDefault();

                    this.paused = false;
                    this.pause_show_rules =
                        false;

                    this.soundManager
                        .resumeMusic();

                    this.eventsManager
                        .resume_after_quiz(
                            this.scores
                        );

                    document
                        .removeEventListener(
                            "keydown",
                            handleKeyDown
                        );
                }
            };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );
    }


    gameLoop() {
        if (!this.running) {
            return;
        }

        this.lastTime =
            performance.now();

        this.ctx.clearRect(
            0,
            0,
            CONFIG.WIDTH,
            CONFIG.HEIGHT
        );

        this.background.update();
        this.background.render(
            this.ctx
        );


        if (this.state === "menu") {
            this.start_screen.draw(
                this.prestudy_completed,
                this.rules_completed
            );
        } else if (
            this.state === "prestudy"
        ) {
            this.prestudy_screen.draw();
        } else if (
            this.state === "rules"
        ) {
            this.rules_screen.draw();
        } else if (
            this.state === "terminated"
        ) {
            this.termination_screen.draw();
        } else if (
            this.state === "game"
        ) {
            // Pause overlay
            if (this.paused) {
                if (
                    this.pause_show_rules
                ) {
                    this.rules_screen.draw();

                    requestAnimationFrame(
                        () =>
                            this.gameLoop()
                    );

                    return;
                }

                this.ctx.fillStyle =
                    "rgba(39, 44, 78, 0.78)";

                this.ctx.fillRect(
                    0,
                    0,
                    CONFIG.WIDTH,
                    CONFIG.HEIGHT
                );

                this.ctx.fillStyle =
                    "white";

                this.ctx.font =
                    "50px Comicsansms, Arial";

                this.ctx.textAlign =
                    "center";

                this.ctx.fillText(
                    "Pause",
                    CONFIG.WIDTH / 2,
                    CONFIG.HEIGHT / 2 -
                        60
                );

                this.ctx.font =
                    "30px Comicsansms, Arial";

                this.ctx.fillText(
                    "Press SPACE to continue",
                    CONFIG.WIDTH / 2,
                    CONFIG.HEIGHT / 2 -
                        5
                );

                this.ctx.fillStyle =
                    "rgb(39, 44, 78)";

                this._drawRoundedRect(
                    this.pause_rules_button.x,
                    this.pause_rules_button.y,
                    this.pause_rules_button.width,
                    this.pause_rules_button.height,
                    12
                );

                this.ctx.fill();

                this.ctx.strokeStyle =
                    "white";

                this.ctx.lineWidth = 2;

                this._drawRoundedRect(
                    this.pause_rules_button.x,
                    this.pause_rules_button.y,
                    this.pause_rules_button.width,
                    this.pause_rules_button.height,
                    12
                );

                this.ctx.stroke();

                this.ctx.fillStyle =
                    "white";

                this.ctx.font =
                    "28px Comicsansms, Arial";

                this.ctx.fillText(
                    "Review Rules",
                    this.pause_rules_button.x +
                        this.pause_rules_button.width /
                            2,
                    this.pause_rules_button.y +
                        this.pause_rules_button.height /
                            2 +
                        10
                );

                requestAnimationFrame(
                    () =>
                        this.gameLoop()
                );

                return;
            }


            // Update departments only while run is active.
            if (this.scores.game) {
                for (
                    const department
                    of this.departments
                ) {
                    department.update();
                }
            }

            for (
                const department
                of this.departments
            ) {
                department.draw(
                    this.ctx
                );
            }

            this.departments =
                this.departments.filter(
                    department =>
                        !department
                            .isOffScreen()
                );


            if (this.scores.game) {
                if (
                    this.test_screen
                        .quiz_active
                ) {
                    // Freeze challenge gameplay while answering.
                    this.scores
                        .show_health(
                            this.rocket
                        );

                    this.scores
                        .visited_departments();

                    this.test_screen
                        .draw();
                } else {
                    // Normal Challenge gameplay.
                    this.rocket.update(
                        this.keys_pressed
                    );

                    this.rocket.draw();

                    EventsManager
                        .make_comet(
                            this.asteroids,
                            this.ctx
                        );

                    EventsManager
                        .move_key(
                            this.keys,
                            this.ctx
                        );

                    EventsManager
                        .collide(
                            this.rocket,
                            this.asteroids,
                            this.keys,
                            this.soundManager
                        );

                    for (
                        const planet
                        of this.planets
                    ) {
                        planet.update();
                        planet.draw(
                            this.ctx
                        );
                    }

                    EventsManager
                        .collide_with_planet(
                            this.rocket,
                            this.planets,
                            this.scores
                        );

                    this.scores
                        .show_health(
                            this.rocket
                        );

                    this.scores
                        .visited_departments();

                    this.scores.finish(
                        this.rocket
                    );

                    this.test_screen.draw();
                }
            } else {
                // Game over or successful mission.
                for (
                    const planet
                    of this.planets
                ) {
                    planet.update();
                    planet.draw(
                        this.ctx
                    );
                }

                this.scores
                    .show_health(
                        this.rocket
                    );

                this.scores
                    .visited_departments();

                this.scores.finish(
                    this.rocket
                );

                // Only visible after loss.
                this.scores
                    .draw_restart_button();
            }


            if (
                this.test_screen
                    .quiz_active
            ) {
                this.soundManager
                    .pauseMusic();
            } else if (
                !this.paused &&
                this.scores.game
            ) {
                this.soundManager
                    .resumeMusic();
            }
        }


        requestAnimationFrame(
            () => this.gameLoop()
        );
    }


    _drawRoundedRect(
        x,
        y,
        width,
        height,
        radius
    ) {
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


window.addEventListener(
    "load",
    () => {
        setTimeout(
            () => {
                if (
                    typeof Departments ===
                    "undefined"
                ) {
                    console.error(
                        "Error: Departments is not defined. Check if departments_data.js loaded correctly."
                    );

                    document.body.innerHTML =
                        '<div style="color: white; padding: 20px; text-align: center;">' +
                        "<h1>Error loading game</h1>" +
                        "<p>Please refresh the page. If the problem persists, check the browser console (F12).</p>" +
                        "</div>";

                    return;
                }

                if (
                    typeof CONFIG ===
                    "undefined"
                ) {
                    console.error(
                        "Error: CONFIG is not defined. Check if config.js loaded correctly."
                    );

                    return;
                }

                try {
                    window.game =
                        new Game();
                } catch (error) {
                    console.error(
                        "Error initializing game:",
                        error
                    );

                    document.body.innerHTML =
                        '<div style="color: white; padding: 20px; text-align: center;">' +
                        "<h1>Error initializing game</h1>" +
                        "<p>" +
                        error.message +
                        "</p>" +
                        "<p>Check the browser console (F12) for details.</p>" +
                        "</div>";
                }
            },
            100
        );
    }
);
