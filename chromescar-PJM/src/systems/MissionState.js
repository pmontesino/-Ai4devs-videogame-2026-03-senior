import { DEFAULT_PLAYER_STATE, LEVELS } from "../data/constants.js";

export default class MissionState {
  constructor() {
    this.resetCampaign("easy");
  }

  resetCampaign(difficulty) {
    this.difficulty = difficulty;
    this.currentLevelIndex = 0;
    this.shipIntegrity = "stable";
    this.player = { ...DEFAULT_PLAYER_STATE };
    this.missionResult = null;
    this.introSeen = false;
  }

  get currentLevel() {
    return LEVELS[this.currentLevelIndex];
  }

  advanceLevel() {
    if (this.currentLevelIndex < LEVELS.length - 1) {
      this.currentLevelIndex += 1;
      return true;
    }
    return false;
  }
}
