export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
  }

  create() {
    this.cameras.main.setBackgroundColor("#090909");
    this.add.text(480, 220, "DERROTA DE MISION", {
      fontFamily: "monospace",
      fontSize: "52px",
      color: "#ff6b6b",
    }).setOrigin(0.5);

    this.add.text(480, 300, "R: reintentar nivel actual", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#ffffff",
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-R", () => {
      if (this.levelIndex === 0) {
        this.scene.start("Level1UrbanScene");
        return;
      }
      if (this.levelIndex === 1) {
        this.scene.start("Level2ForestScene");
        return;
      }
      this.scene.start("Level3ShipScene");
    });
  }
}
