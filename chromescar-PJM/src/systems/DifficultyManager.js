import { DIFFICULTY_TIMERS } from "../data/constants.js";

export default class DifficultyManager {
  constructor() {
    this.locked = false;
    this.current = "easy";
  }

  setDifficulty(value) {
    if (this.locked) {
      return this.current;
    }
    if (Object.hasOwn(DIFFICULTY_TIMERS, value)) {
      this.current = value;
    }
    return this.current;
  }

  lockCampaignDifficulty() {
    this.locked = true;
  }

  unlockDifficulty() {
    this.locked = false;
  }

  getTimerForCurrentDifficulty() {
    return DIFFICULTY_TIMERS[this.current];
  }
}
