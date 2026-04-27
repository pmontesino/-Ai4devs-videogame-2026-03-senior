import MissionFailSystem from "../systems/MissionFailSystem.js";

export default class MissionResultScene extends Phaser.Scene {
  constructor() {
    super({ key: "MissionResultScene" });
  }

  init(data) {
    this.reason = data.reason;
    this.levelIndex = data.levelIndex ?? 0;
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    const timeout = this.reason === "timeout";
    const success = this.reason === "success";

    const title = success ? "MISION COMPLETADA" : "GAME OVER";
    const subtitle = success
      ? "Inteligencia recuperada. La nave queda bajo control."
      : timeout
      ? "Integridad de nave irrecuperable: explosion confirmada"
      : "Derrota tactica en el nivel actual";

    if (timeout) {
      this.add
        .text(480, 140, "CINEMATICA: LA NAVE EXPLOTA", {
          fontFamily: "monospace",
          fontSize: "28px",
          color: "#ff6b6b",
        })
        .setOrigin(0.5);
    }

    this.add
      .text(480, 240, title, {
        fontFamily: "monospace",
        fontSize: "56px",
        color: success ? "#58d68d" : "#ff6b6b",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 300, subtitle, {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 420, success ? "ENTER: volver al menu" : "R: reintentar nivel actual", {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#dddddd",
      })
      .setOrigin(0.5);

    if (success) {
      this.input.keyboard.once("keydown-ENTER", () => {
        this.registry.remove("missionState");
        this.scene.start("MenuScene");
      });
      return;
    }

    this.input.keyboard.once("keydown-R", () => {
      const missionState = this.registry.get("missionState");
      if (missionState) {
        MissionFailSystem.resetForRetry(missionState);
      }
      this.restartCurrentLevel();
    });
  }

  restartCurrentLevel() {
    if (this.levelIndex === 0) {
      this.scene.start("Level1UrbanScene");
      return;
    }
    if (this.levelIndex === 1) {
      this.scene.start("Level2ForestScene");
      return;
    }
    this.scene.start("Level3ShipScene");
  }
}
