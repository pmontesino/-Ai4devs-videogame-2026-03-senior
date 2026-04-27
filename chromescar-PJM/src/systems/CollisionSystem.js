export default class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
  }

  bindPlayerVsEnemies(player, enemies, onHit) {
    this.scene.physics.add.overlap(player, enemies, () => onHit(), null, this.scene);
  }

  bindBulletsVsEnemies(bullets, enemies, onBulletHit) {
    this.scene.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
      onBulletHit(bullet, enemy);
    });
  }

  bindWorldCollisions(sprite, worldLayer) {
    this.scene.physics.add.collider(sprite, worldLayer);
  }
}
