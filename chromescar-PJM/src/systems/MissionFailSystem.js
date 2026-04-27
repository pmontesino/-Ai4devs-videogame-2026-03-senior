export default class MissionFailSystem {
  static failByTimeout(missionState) {
    missionState.shipIntegrity = "irrecoverable";
    missionState.missionResult = "timeout_fail";
  }

  static failByDefeat(missionState) {
    missionState.missionResult = "defeat";
  }

  static resetForRetry(missionState) {
    missionState.shipIntegrity = "stable";
    missionState.missionResult = null;
    missionState.player.health = 3;
  }
}
