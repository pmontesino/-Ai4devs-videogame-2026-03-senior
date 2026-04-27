// NoraVidal.js — Personaje principal con sprite pixel-art y animaciones
// (idle / run / jump / shoot). Las texturas las genera PixelArtFactory.

export default class NoraVidal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "nora_idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.body.setSize(14, 32);
    this.body.setOffset(5, 4);
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    this.direction = 1;
    this.isShooting = false;
    this.shootEndTime = 0;

    NoraVidal.#ensureAnims(scene);
    this.play("nora-idle");
  }

  static #ensureAnims(scene) {
    if (scene.anims.exists("nora-idle")) return;
    scene.anims.create({
      key: "nora-idle",
      frames: [{ key: "nora_idle" }],
      frameRate: 1,
    });
    scene.anims.create({
      key: "nora-run",
      frames: [
        { key: "nora_run_0" },
        { key: "nora_run_1" },
        { key: "nora_run_2" },
        { key: "nora_run_3" },
      ],
      frameRate: 12,
      repeat: -1,
    });
    scene.anims.create({
      key: "nora-jump",
      frames: [{ key: "nora_jump" }],
      frameRate: 1,
    });
    scene.anims.create({
      key: "nora-shoot",
      frames: [{ key: "nora_shoot" }],
      frameRate: 1,
    });
  }

  moveLeft(isAirborne) {
    this.direction = -1;
    this.setFlipX(true);
    this.setVelocityX(isAirborne ? -130 : -200);
  }

  moveRight(isAirborne) {
    this.direction = 1;
    this.setFlipX(false);
    this.setVelocityX(isAirborne ? 130 : 200);
  }

  stop() {
    this.setVelocityX(0);
  }

  jump() {
    if (this.body.blocked.down) {
      this.setVelocityY(-340);
    }
  }

  triggerShootPose(durationMs = 220) {
    this.isShooting = true;
    this.shootEndTime = this.scene.time.now + durationMs;
  }

  /** Returns world-space muzzle position based on current direction & flip */
  getMuzzlePosition() {
    const offsetX = this.direction === 1 ? 12 : -12;
    return { x: this.x + offsetX, y: this.y - 22 };
  }

  /** Should be called every frame from the scene's update */
  updateAnimation() {
    const onGround = this.body.blocked.down;
    if (this.isShooting && this.scene.time.now > this.shootEndTime) {
      this.isShooting = false;
    }

    if (this.isShooting) {
      if (this.anims.currentAnim?.key !== "nora-shoot") this.play("nora-shoot");
    } else if (!onGround) {
      if (this.anims.currentAnim?.key !== "nora-jump") this.play("nora-jump");
    } else if (Math.abs(this.body.velocity.x) > 8) {
      if (this.anims.currentAnim?.key !== "nora-run") this.play("nora-run");
    } else {
      if (this.anims.currentAnim?.key !== "nora-idle") this.play("nora-idle");
    }
  }
}
