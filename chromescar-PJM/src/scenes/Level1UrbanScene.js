import BaseLevelScene from "./BaseLevelScene.js";

export default class Level1UrbanScene extends BaseLevelScene {
  constructor() {
    super({
      key: "Level1UrbanScene",
      levelIndex: 0,
      levelName: "Madrid en ruinas",
      bg: 0x1a2238,
      enemyCount: 12,
      theme: "urban",
      worldWidth: 4200,
      goalType: "building",
    });
  }

  onLevelObjectiveReached() {
    super.onLevelObjectiveReached();
    this.scene.start("Level2ForestScene");
  }
}
