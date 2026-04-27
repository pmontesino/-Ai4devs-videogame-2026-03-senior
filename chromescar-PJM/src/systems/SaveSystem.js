import { SAVE_COOKIE } from "../data/constants.js";
import SaveGameState from "./SaveGameState.js";

export default class SaveSystem {
  static save(missionState) {
    if (!navigator.cookieEnabled) {
      return false;
    }

    const payload = encodeURIComponent(JSON.stringify(SaveGameState.fromMissionState(missionState)));
    document.cookie = `${SAVE_COOKIE}=${payload};path=/;max-age=${60 * 60 * 24 * 30}`;
    return true;
  }

  static load() {
    const all = document.cookie.split(";").map((entry) => entry.trim());
    const pair = all.find((entry) => entry.startsWith(`${SAVE_COOKIE}=`));
    if (!pair) {
      return null;
    }

    try {
      const value = decodeURIComponent(pair.split("=")[1]);
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  static applyToMissionState(missionState, raw) {
    if (!raw) {
      return;
    }

    missionState.currentLevelIndex = Number.isInteger(raw.levelIndex) ? raw.levelIndex : 0;
    missionState.player.lives = raw.lives ?? 5;
    missionState.player.health = raw.health ?? 3;
    missionState.difficulty = raw.difficulty ?? "easy";
    missionState.introSeen = !!raw.introSeen;
  }
}
