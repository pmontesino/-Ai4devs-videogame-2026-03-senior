import BaseLevelScene from "./BaseLevelScene.js";
import BossDefense from "../entities/BossDefense.js";
import { GAME_HEIGHT } from "../data/constants.js";

const GROUND_TOP_Y = GAME_HEIGHT - 56;

export default class Level3ShipScene extends BaseLevelScene {
  constructor() {
    super({
      key: "Level3ShipScene",
      levelIndex: 2,
      levelName: "Interior de la nave",
      bg: 0x0f1022,
      enemyCount: 5,
      theme: "ship",
      worldWidth: 3000,
      goalType: "none",
    });
  }

  create() {
    super.create();

    // Wall boss at the right edge — replaces the goal zone for Level 3.
    const bossX = this.worldWidth - 90;
    this.boss = new BossDefense(this, bossX, GROUND_TOP_Y - 90);

    // Player bullets damage the boss.
    this.physics.add.overlap(this.weaponSystem.bullets, this.boss, (boss, bullet) => {
      if (!bullet || !bullet.active) return;
      if (!this.boss || !this.boss.active) return;
      bullet.disableBody(true, true);
      const dead = this.boss.receiveHit();
      if (dead) this.#defeatBoss();
    });
  }

  #defeatBoss() {
    if (this.levelCompleted) return;
    this.levelCompleted = true;
    if (this.boss && this.boss.destroyEffect) this.boss.destroyEffect();
    this.cameras.main.flash(380, 255, 255, 255);
    this.cameras.main.shake(420, 0.02);
    this.tweens.add({
      targets: this.player, alpha: 0, duration: 320,
      onComplete: () => this.onLevelObjectiveReached(),
    });
  }

  onLevelObjectiveReached() {
    super.onLevelObjectiveReached();
    this.scene.stop("HUDScene");
    this.scene.start("MissionResultScene", { reason: "victory", levelIndex: this.levelIndex });
  }
}
