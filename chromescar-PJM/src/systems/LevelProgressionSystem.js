export default class LevelProgressionSystem {
  static nextSceneKey(currentLevelKey) {
    if (currentLevelKey === "level1") {
      return "Level2ForestScene";
    }
    if (currentLevelKey === "level2") {
      return "Level3ShipScene";
    }
    return "MissionResultScene";
  }

  static markMissionSuccess(missionState) {
    missionState.missionResult = "success";
  }
}
