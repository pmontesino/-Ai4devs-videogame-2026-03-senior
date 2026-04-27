// YermoUnit.js — Enemigo con sprite pixel-art, animaciones y IA básica:
// camina hacia el jugador, salta ocasionalmente, dispara cuando lo tiene
// en línea. Se desintegra al morir (8s lore-friendly, abreviado a ~600ms).

export default class YermoUnit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "yermo_idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1);
    this.body.setSize(14, 30);
    this.body.setOffset(5, 4);
    this.setCollideWorldBounds(false);
    this.setDepth(8);

    this.hp = 2;
    this.dead = false;
    this.shootCooldown = 1200 + Math.floor(Math.random() * 1500);
    this.lastShootTime = 0;
    this.jumpCooldown = 2200 + Math.floor(Math.random() * 1800);
    this.lastJumpTime = 0;

    YermoUnit.#ensureAnims(scene);
    this.play("yermo-run");
    this.facing = -1;
  }

  static #ensureAnims(scene) {
    if (scene.anims.exists("yermo-run")) return;
    scene.anims.create({
      key: "yermo-idle", frames: [{ key: "yermo_idle" }], frameRate: 1,
    });
    scene.anims.create({
      key: "yermo-run",
      frames: [{ key: "yermo_run_0" }, { key: "yermo_run_1" }],
      frameRate: 6,
      repeat: -1,
    });
    scene.anims.create({
      key: "yermo-jump", frames: [{ key: "yermo_jump" }], frameRate: 1,
    });
    scene.anims.create({
      key: "yermo-shoot", frames: [{ key: "yermo_shoot" }], frameRate: 1,
    });
  }

  /** Called by scene.update — needs ref to player and a shoot callback */
  tick(player, onShoot) {
    if (this.dead || !this.active || !this.body || !this.body.enable) return;
    if (!player || !player.active) return;

    const dx = player.x - this.x;
    const distance = Math.abs(dx);

    // Detection range: only chase when player is reasonably close.
    // Outside the detection radius the enemy patrols slowly back-and-forth
    // around its spawn position so it does not converge on Nora across the
    // entire world at once.
    const DETECT_RANGE = 520;
    if (distance > DETECT_RANGE) {
      // Patrol around spawn x
      if (this.spawnX === undefined) this.spawnX = this.x;
      const patrolDx = this.x - this.spawnX;
      if (patrolDx > 80) this.facing = -1;
      else if (patrolDx < -80) this.facing = 1;
      this.setVelocityX(this.facing * 25);
      this.setFlipX(this.facing === -1);
      if (this.body.blocked.down && Math.abs(this.body.velocity.x) > 4) {
        if (this.anims.currentAnim?.key !== "yermo-run") this.play("yermo-run");
      }
      return;
    }

    this.facing = dx >= 0 ? 1 : -1;
    // Sprite faces right by default; flip when target is to the left
    this.setFlipX(this.facing === -1);

    const now = this.scene.time.now;

    // Movement: walk toward player when far, slow down when close,
    // and back off slightly when too close to avoid stacking on top of Nora.
    if (distance > 200) {
      this.setVelocityX(this.facing * 60);
    } else if (distance > 110) {
      this.setVelocityX(this.facing * 35);
    } else if (distance < 70) {
      // Too close → back away so enemies do not pile up on the player
      this.setVelocityX(-this.facing * 40);
    } else {
      this.setVelocityX(0);
    }

    // Random jump
    if (this.body.blocked.down && now - this.lastJumpTime > this.jumpCooldown) {
      if (Math.random() < 0.45) {
        this.setVelocityY(-300);
      }
      this.lastJumpTime = now;
    }

    // Shoot when in line-of-sight (horizontal, similar Y)
    if (distance < 380 && distance > 60 && Math.abs(player.y - this.y) < 40
        && now - this.lastShootTime > this.shootCooldown
        && this.body.blocked.down) {
      onShoot(this.x + this.facing * 14, this.y - 16, this.facing);
      this.lastShootTime = now;
      this.play("yermo-shoot", true);
      this.scene.time.delayedCall(220, () => {
        if (this.active && !this.dead) this.play("yermo-run", true);
      });
      return;
    }

    // Animation state
    const onGround = this.body.blocked.down;
    if (!onGround) {
      if (this.anims.currentAnim?.key !== "yermo-jump") this.play("yermo-jump");
    } else if (Math.abs(this.body.velocity.x) > 4) {
      if (this.anims.currentAnim?.key !== "yermo-run") this.play("yermo-run");
    } else {
      if (this.anims.currentAnim?.key !== "yermo-idle") this.play("yermo-idle");
    }
  }

  receiveBulletHit() {
    if (this.dead || !this.active) return false;
    this.hp -= 1;
    // Hit flash
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(60, () => {
      if (this.active) this.clearTint();
    });
    if (this.hp <= 0) {
      this.disintegrate();
      return true;
    }
    return false;
  }

  disintegrate() {
    this.dead = true;
    this.setVelocity(0, 0);
    if (this.body) this.body.enable = false;
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.3,
      scaleY: 0.3,
      duration: 600,
      onComplete: () => this.destroy(),
    });
  }
}
