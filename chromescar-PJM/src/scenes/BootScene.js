import CompatibilityFallbacks from "../systems/CompatibilityFallbacks.js";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  create() {
    CompatibilityFallbacks.apply(this);
    this.scene.start("MenuScene");
  }
}
