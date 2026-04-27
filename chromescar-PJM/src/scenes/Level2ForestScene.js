import BaseLevelScene from "./BaseLevelScene.js";

export default class Level2ForestScene extends BaseLevelScene {
  constructor() {
    super({
      key: "Level2ForestScene",
      levelIndex: 1,
      levelName: "Ruta rural",
      bg: 0x1a2818,
      enemyCount: 14,
      theme: "forest",
      worldWidth: 4500,
      goalType: "shipdoor",
    });
  }

  onLevelObjectiveReached() {
    super.onLevelObjectiveReached();
    this.scene.start("Level3ShipScene");
  }
}
