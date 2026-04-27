// WeaponPickup.js — Caja pickup pixel-art con glow pulsante.

export default class WeaponPickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = "burst") {
    super(scene, x, y, "pickup_burst");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.type = type;
    this.setOrigin(0.5, 0.5);
    this.body.allowGravity = false;
    this.body.setSize(16, 16);

    // Pulse animation
    scene.tweens.add({
      targets: this,
      scale: { from: 1.0, to: 1.15 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
}
