export default class DamageRules {
  static canEnemyDieByContact() {
    return false;
  }

  static canEnemyDieByBullet() {
    return true;
  }

  static applyPlayerContactDamage(missionState) {
    missionState.player.health -= 1;
    if (missionState.player.health <= 0) {
      missionState.player.lives -= 1;
      missionState.player.health = 3;
      return { lostLife: true };
    }
    return { lostLife: false };
  }
}
