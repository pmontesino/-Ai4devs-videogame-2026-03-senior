export default class SaveGameState {
  constructor() {
    this.levelIndex = 0;
    this.lives = 5;
    this.health = 3;
    this.difficulty = "easy";
    this.introSeen = false;
  }

  static fromMissionState(missionState) {
    const save = new SaveGameState();
    save.levelIndex = missionState.currentLevelIndex;
    save.lives = missionState.player.lives;
    save.health = missionState.player.health;
    save.difficulty = missionState.difficulty;
    save.introSeen = missionState.introSeen;
    return save;
  }
}
