export default class LevelState {
  constructor(levelKey, timerSeconds) {
    this.levelKey = levelKey;
    this.timerSeconds = timerSeconds;
    this.checkpoint = { x: 100, y: 380 };
    this.completed = false;
  }

  markCompleted() {
    this.completed = true;
  }

  setCheckpoint(x, y) {
    this.checkpoint = { x, y };
  }
}
