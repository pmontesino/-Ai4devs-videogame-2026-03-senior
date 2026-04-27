import { INVULNERABILITY_MS } from "../data/constants.js";

export default class RespawnSystem {
  constructor(scene) {
    this.scene = scene;
    this.invulnerableUntil = 0;
  }

  respawnPlayer(player, checkpoint) {
    player.setPosition(checkpoint.x, checkpoint.y);
    player.setVelocity(0, 0);
    this.invulnerableUntil = this.scene.time.now + INVULNERABILITY_MS;

    this.scene.tweens.add({
      targets: player,
      alpha: { from: 0.45, to: 1 },
      duration: 120,
      yoyo: true,
      repeat: INVULNERABILITY_MS / 120,
      onComplete: () => {
        player.setAlpha(1);
      },
    });
  }

  isInvulnerable() {
    return this.scene.time.now < this.invulnerableUntil;
  }
}
