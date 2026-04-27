import DifficultyManager from "../systems/DifficultyManager.js";
import LevelState from "../systems/LevelState.js";
import InputHandler from "../systems/InputHandler.js";
import CollisionSystem from "../systems/CollisionSystem.js";
import WeaponSystem from "../systems/WeaponSystem.js";
import DamageRules from "../systems/DamageRules.js";
import RespawnSystem from "../systems/RespawnSystem.js";
import TimerSystem from "../systems/TimerSystem.js";
import PauseSystem from "../systems/PauseSystem.js";
import SaveSystem from "../systems/SaveSystem.js";
import MissionFailSystem from "../systems/MissionFailSystem.js";
import NoraVidal from "../entities/NoraVidal.js";
import YermoUnit from "../entities/YermoUnit.js";
import WeaponPickup from "../entities/WeaponPickup.js";
import MissionState from "../systems/MissionState.js";
import CulturalElementManager from "../systems/CulturalElementManager.js";
import PixelArtFactory from "../systems/PixelArtFactory.js";
import ParallaxBackground from "../systems/ParallaxBackground.js";
import { GAME_HEIGHT, GAME_WIDTH } from "../data/constants.js";

const GROUND_TOP_Y = GAME_HEIGHT - 56; // y where ground surface sits
const PLAYER_SPAWN_X = 120;
const PLAYER_SPAWN_Y = GROUND_TOP_Y;

export default class BaseLevelScene extends Phaser.Scene {
  constructor(config) {
    super({ key: config.key });
    this.levelIndex = config.levelIndex;
    this.levelName = config.levelName;
    this.bg = config.bg;
    this.enemyCount = config.enemyCount;
    this.theme = config.theme || "urban";
    this.worldWidth = config.worldWidth || 2880;
    this.goalType = config.goalType || "building"; // building | shipdoor | none
  }

  create() {
    PixelArtFactory.initAll(this);

    // Mission state init
    this.missionState = this.registry.get("missionState");
    if (!this.missionState) {
      this.missionState = new MissionState();
      const difficulty = this.registry.get("difficulty") || "easy";
      this.missionState.resetCampaign(difficulty);
      const save = this.registry.get("continueSave");
      if (save) SaveSystem.applyToMissionState(this.missionState, save);
      this.registry.set("missionState", this.missionState);
    }
    this.missionState.currentLevelIndex = this.levelIndex;
    this.registry.set("lives", this.missionState.player.lives);
    this.registry.set("health", this.missionState.player.health);
    this.registry.set("levelName", this.levelName);
    this.registry.set("objective", "");
    this.registry.set("weapon", "BASE");
    this.levelCompleted = false;

    // World & camera
    this.physics.world.setBounds(0, 0, this.worldWidth, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, this.worldWidth, GAME_HEIGHT);
    this.cameras.main.setBackgroundColor(this.bg);

    // Parallax background
    this.parallax = new ParallaxBackground(this, this.worldWidth, this.theme);

    // Ground (invisible collider — visible tiles already drawn by parallax)
    this.ground = this.add.rectangle(this.worldWidth / 2, GROUND_TOP_Y + 20, this.worldWidth, 40, 0x000000, 0);
    this.physics.add.existing(this.ground, true);

    // Player
    this.player = new NoraVidal(this, PLAYER_SPAWN_X, PLAYER_SPAWN_Y);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.1);
    this.cameras.main.setDeadzone(180, 100);

    // Enemies — spread along world
    this.enemies = this.physics.add.group();
    this.enemiesKilled = 0;
    this.enemiesSpawned = 0;
    this.#seedEnemies();

    // Pickup
    this.pickup = new WeaponPickup(this, 760, GROUND_TOP_Y - 24, "burst");
    this.pickup.setDepth(9);

    // Goal indicator (level-specific). Level 3 has no goal zone — the boss
    // wall handles the ending in its own scene.
    if (this.goalType === "building")      this.#createBuildingGoal();
    else if (this.goalType === "shipdoor") this.#createShipDoorGoal();

    // Systems
    this.weaponSystem = new WeaponSystem(this);
    this.inputHandler = new InputHandler(this);
    this.collisionSystem = new CollisionSystem(this);
    this.respawnSystem = new RespawnSystem(this);

    const difficultyManager = new DifficultyManager();
    difficultyManager.setDifficulty(this.missionState.difficulty);
    difficultyManager.lockCampaignDifficulty();
    this.levelState = new LevelState(this.levelName, difficultyManager.getTimerForCurrentDifficulty());
    this.levelState.checkpoint = { x: PLAYER_SPAWN_X, y: PLAYER_SPAWN_Y };

    this.timerSystem = new TimerSystem(this, this.levelState.timerSeconds, () => this.handleTimeoutFail());
    this.pauseSystem = new PauseSystem(this, this.timerSystem);

    this.bindInput();
    this.bindCollisions();

    this.culturalManager = new CulturalElementManager(this);
    this.culturalProfile = this.culturalManager.renderForLevel(this.levelIndex);

    if (!this.scene.isActive("HUDScene")) {
      this.scene.launch("HUDScene");
    }

    SaveSystem.save(this.missionState);
  }

  #seedEnemies() {
    // Spread enemies along the world so player encounters them progressively
    const usableStart = 500;
    const usableEnd = this.worldWidth - 250;
    const stride = (usableEnd - usableStart) / Math.max(1, this.enemyCount);
    for (let i = 0; i < this.enemyCount; i++) {
      const ex = usableStart + i * stride + (Math.random() * 80 - 40);
      const enemy = new YermoUnit(this, ex, GROUND_TOP_Y);
      this.enemies.add(enemy);
      this.enemiesSpawned += 1;
    }
  }

  #completeLevel() {
    if (this.levelCompleted) return;
    this.levelCompleted = true;
    this.cameras.main.flash(220, 0, 255, 255);
    this.tweens.add({
      targets: this.player, alpha: 0, duration: 260,
      onComplete: () => this.onLevelObjectiveReached(),
    });
  }

  #createBuildingGoal() {
    const goalX = this.worldWidth - 180;
    const groundY = GROUND_TOP_Y;

    const g = this.add.graphics();
    g.setDepth(6);
    const buildW = 200;
    const buildH = 260;
    const bx = goalX - buildW / 2;
    const by = groundY - buildH;
    g.fillStyle(0x1a1428, 1).fillRect(bx, by, buildW, buildH);
    g.fillStyle(0x2a1f3a, 1).fillRect(bx + 6, by + 6, buildW - 12, buildH - 12);
    g.fillStyle(0xff9944, 0.6);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        g.fillRect(bx + 24 + col * 40, by + 30 + row * 50, 16, 22);
      }
    }
    g.fillStyle(0x0e0918, 1);
    for (let i = 0; i < buildW; i += 16) g.fillRect(bx + i, by - 8, 8, 8);

    const doorW = 56;
    const doorH = 90;
    const dx = goalX - doorW / 2;
    const dy = groundY - doorH;
    g.fillStyle(0x00ffff, 1).fillRect(dx - 4, dy - 4, doorW + 8, doorH + 4);
    g.fillStyle(0x000010, 1).fillRect(dx, dy, doorW, doorH);
    g.fillStyle(0x00ffff, 0.35).fillRect(dx + 8, dy + 8, doorW - 16, doorH - 12);

    const arrow = this.add.graphics();
    arrow.fillStyle(0xffff00, 1).fillTriangle(-10, -8, 10, -8, 0, 8);
    arrow.x = goalX; arrow.y = dy - 30; arrow.setDepth(7);
    this.tweens.add({ targets: arrow, y: dy - 18, yoyo: true, repeat: -1, duration: 500, ease: "Sine.easeInOut" });

    this.goalZone = this.add.zone(goalX, groundY - doorH / 2, doorW + 40, doorH + 40);
    this.physics.add.existing(this.goalZone, true);
    this.physics.add.overlap(this.player, this.goalZone, () => this.#completeLevel());
    this.goalSafetyX = goalX - 20;
  }

  /** Spaceship hatch for Level 2 — a glowing airlock at the right edge */
  #createShipDoorGoal() {
    const goalX = this.worldWidth - 200;
    const groundY = GROUND_TOP_Y;

    const g = this.add.graphics();
    g.setDepth(6);

    // Landing strut platform
    g.fillStyle(0x222244, 1).fillRect(goalX - 110, groundY - 4, 220, 8);
    g.fillStyle(0x444466, 1).fillRect(goalX - 110, groundY - 4, 220, 2);

    // Ship hull
    const hullW = 220;
    const hullH = 200;
    const hx = goalX - hullW / 2;
    const hy = groundY - hullH;
    g.fillStyle(0x3a3a55, 1).fillRect(hx, hy, hullW, hullH);
    g.fillStyle(0x55557a, 1).fillRect(hx + 4, hy + 4, hullW - 8, hullH - 8);
    // Nose cone (pointing right)
    g.fillStyle(0x55557a, 1);
    g.fillTriangle(hx + hullW, hy + 20, hx + hullW + 60, hy + hullH / 2, hx + hullW, hy + hullH - 20);
    // Engine fins (left)
    g.fillStyle(0x222244, 1);
    g.fillRect(hx - 10, hy + 30, 12, 30);
    g.fillRect(hx - 10, hy + hullH - 60, 12, 30);
    // Portholes
    for (let i = 0; i < 4; i++) {
      g.fillStyle(0x000020, 1).fillCircle(hx + 30 + i * 38, hy + 40, 7);
      g.fillStyle(0x00ddff, 0.85).fillCircle(hx + 30 + i * 38, hy + 40, 5);
    }
    g.fillStyle(0x2a2a44, 1);
    for (let i = 0; i < 8; i++) g.fillCircle(hx + 16 + i * 24, hy + hullH - 12, 2);

    // Open hatch
    const doorW = 60;
    const doorH = 100;
    const ddx = goalX - doorW / 2;
    const ddy = groundY - doorH;
    g.fillStyle(0x00ffff, 1).fillRect(ddx - 4, ddy - 4, doorW + 8, doorH + 4);
    g.fillStyle(0x000018, 1).fillRect(ddx, ddy, doorW, doorH);
    g.fillStyle(0x00ddff, 0.3).fillRect(ddx + 8, ddy + 10, doorW - 16, doorH - 20);
    g.fillStyle(0xaaaacc, 1).fillRect(ddx - 6, groundY - 8, doorW + 12, 8);

    const arrow = this.add.graphics();
    arrow.fillStyle(0xffff00, 1).fillTriangle(-10, -8, 10, -8, 0, 8);
    arrow.x = goalX; arrow.y = ddy - 30; arrow.setDepth(7);
    this.tweens.add({ targets: arrow, y: ddy - 18, yoyo: true, repeat: -1, duration: 500, ease: "Sine.easeInOut" });

    this.goalZone = this.add.zone(goalX, groundY - doorH / 2, doorW + 40, doorH + 40);
    this.physics.add.existing(this.goalZone, true);
    this.physics.add.overlap(this.player, this.goalZone, () => this.#completeLevel());
    this.goalSafetyX = goalX - 20;
  }

  bindInput() {
    this.inputHandler.onSwapWeapon(() => {
      const w = this.weaponSystem.swapWeapon();
      this.registry.set("weapon", w);
    });

    this.inputHandler.onShoot(() => {
      const muzzle = this.player.getMuzzlePosition();
      this.weaponSystem.shoot(muzzle.x, muzzle.y, this.player.direction);
      this.player.triggerShootPose();
    });

    this.inputHandler.onPause(() => this.pauseSystem.toggle());

    this.inputHandler.onHelp(() => {
      if (this.scene.isActive("ControlsHelpOverlay")) {
        this.scene.stop("ControlsHelpOverlay");
      } else {
        this.scene.launch("ControlsHelpOverlay");
      }
    });
  }

  bindCollisions() {
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.enemies, this.ground);

    this.physics.add.overlap(this.player, this.pickup, () => {
      this.weaponSystem.setTemporaryWeapon(this.pickup.type);
      this.registry.set("weapon", this.pickup.type.toUpperCase());
      this.pickup.destroy();
    });

    // Player vs enemies (contact damage)
    this.collisionSystem.bindPlayerVsEnemies(this.player, this.enemies, () => this.#takeHit());

    // Player bullets vs enemies
    this.collisionSystem.bindBulletsVsEnemies(this.weaponSystem.bullets, this.enemies, (bullet, enemy) => {
      if (!bullet || !bullet.active) return;
      if (!enemy || !enemy.active || enemy.dead) return;
      bullet.disableBody(true, true);
      const dead = enemy.receiveBulletHit();
      if (dead) {
        this.enemiesKilled += 1;
        if (this.enemiesKilled >= this.enemyCount && !this.levelCompleted) {
          this.levelCompleted = true;
          this.onLevelObjectiveReached();
        }
      }
    });

    // Enemy bullets vs player
    this.physics.add.overlap(this.player, this.weaponSystem.enemyBullets, (player, bullet) => {
      if (!bullet || !bullet.active) return;
      bullet.disableBody(true, true);
      this.#takeHit();
    });
  }

  #takeHit() {
    if (this.respawnSystem.isInvulnerable()) return;
    const hit = DamageRules.applyPlayerContactDamage(this.missionState);
    this.registry.set("health", this.missionState.player.health);
    this.registry.set("lives", this.missionState.player.lives);

    // Knock-back & flash
    this.cameras.main.shake(120, 0.005);
    this.player.setTintFill(0xff2266);
    this.time.delayedCall(80, () => this.player.clearTint());
    this.player.setVelocity(this.player.direction * -180, -180);

    if (hit.lostLife) {
      this.weaponSystem.resetTemporaryWeapon();
      this.registry.set("weapon", "BASE");
      if (this.missionState.player.lives < 0) {
        this.handleDefeatFail();
        return;
      }
      this.respawnSystem.respawnPlayer(this.player, this.levelState.checkpoint);
    }
    SaveSystem.save(this.missionState);
  }

  handleTimeoutFail() {
    MissionFailSystem.failByTimeout(this.missionState);
    this.scene.stop("HUDScene");
    this.scene.start("MissionResultScene", { reason: "timeout", levelIndex: this.levelIndex });
  }

  handleDefeatFail() {
    MissionFailSystem.failByDefeat(this.missionState);
    this.scene.stop("HUDScene");
    this.scene.start("GameOverScene", { reason: "defeat", levelIndex: this.levelIndex });
  }

  onLevelObjectiveReached() {
    SaveSystem.save(this.missionState);
  }

  update() {
    if (this.pauseSystem.paused) return;
    if (this.levelCompleted) return;
    if (!this.player || !this.player.active || !this.player.body) return;

    try {
      // Safety net: ensure the level always completes when reaching the exit.
      if (this.goalSafetyX && this.player.x >= this.goalSafetyX) {
        this.levelCompleted = true;
        this.cameras.main.flash(220, 0, 255, 255);
        this.tweens.add({
          targets: this.player, alpha: 0, duration: 260,
          onComplete: () => this.onLevelObjectiveReached(),
        });
        return;
      }

      const movement = this.inputHandler.movement;
      const airborne = !this.player.body.blocked.down;

      if (movement.left)        this.player.moveLeft(airborne);
      else if (movement.right)  this.player.moveRight(airborne);
      else                      this.player.stop();

      if (movement.jump) this.player.jump();

      this.player.updateAnimation();

      // Tick enemies AI
      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.tick) return true;
        try {
          enemy.tick(this.player, (x, y, dir) => this.weaponSystem.enemyShoot(x, y, dir));
        } catch (err) {
          console.warn("Enemy tick error", err);
        }
        return true;
      });
    } catch (err) {
      console.error("Scene update error", err);
    }
  }
}
