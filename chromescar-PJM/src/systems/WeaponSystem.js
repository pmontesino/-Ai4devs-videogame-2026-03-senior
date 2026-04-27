// WeaponSystem.js — Gestiona balas del jugador y de los enemigos.
// Las balas usan texturas pixel-art generadas por PixelArtFactory.

export default class WeaponSystem {
  constructor(scene) {
    this.scene = scene;
    this.activeWeapon = "base";
    this.secondaryWeapon = "burst";

    this.bullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 80,
      runChildUpdate: false,
      defaultKey: "bullet_player",
    });

    this.enemyBullets = scene.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 60,
      runChildUpdate: false,
      defaultKey: "bullet_enemy",
    });
  }

  swapWeapon() {
    const prev = this.activeWeapon;
    this.activeWeapon = this.secondaryWeapon;
    this.secondaryWeapon = prev;
    return this.activeWeapon;
  }

  setTemporaryWeapon(type) {
    this.secondaryWeapon = type;
  }

  resetTemporaryWeapon() {
    this.secondaryWeapon = "burst";
    this.activeWeapon = "base";
  }

  shoot(fromX, fromY, direction) {
    const bullet = this.bullets.get(fromX, fromY, "bullet_player");
    if (!bullet) return;

    // Re-enable body in case the bullet was recycled from the pool.
    bullet.enableBody(true, fromX, fromY, true, true);
    bullet.setOrigin(0.5, 0.5);
    bullet.body.allowGravity = false;
    bullet.body.setSize(12, 6);
    bullet.setDepth(12);
    bullet.setFlipX(direction === -1);

    const speed = this.activeWeapon === "burst" ? 620 : 480;
    bullet.setVelocityX(direction * speed);
    bullet.setVelocityY(0);

    // Spark FX at muzzle
    const spark = this.scene.add.rectangle(fromX, fromY, 8, 6, 0xffe060)
      .setDepth(13);
    this.scene.tweens.add({
      targets: spark,
      alpha: 0,
      scaleX: 1.6,
      scaleY: 1.6,
      duration: 90,
      onComplete: () => spark.destroy(),
    });

    // Auto-despawn after lifetime (token guards against pool reuse)
    const token = (bullet._token || 0) + 1;
    bullet._token = token;
    this.scene.time.delayedCall(1500, () => {
      if (bullet.active && bullet._token === token) bullet.disableBody(true, true);
    });
  }

  enemyShoot(fromX, fromY, direction) {
    const bullet = this.enemyBullets.get(fromX, fromY, "bullet_enemy");
    if (!bullet) return;

    bullet.enableBody(true, fromX, fromY, true, true);
    bullet.setOrigin(0.5, 0.5);
    bullet.body.allowGravity = false;
    bullet.body.setSize(8, 8);
    bullet.setDepth(11);

    bullet.setVelocityX(direction * 280);
    bullet.setVelocityY(0);

    const token = (bullet._token || 0) + 1;
    bullet._token = token;
    this.scene.time.delayedCall(1800, () => {
      if (bullet.active && bullet._token === token) bullet.disableBody(true, true);
    });
  }
}
