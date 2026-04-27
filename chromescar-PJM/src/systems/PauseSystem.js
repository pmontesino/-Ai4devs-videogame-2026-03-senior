export default class PauseSystem {
  constructor(scene, timerSystem) {
    this.scene = scene;
    this.timerSystem = timerSystem;
    this.paused = false;
    this.overlay = scene.add
      .rectangle(480, 270, 960, 540, 0x000000, 0.65)
      .setDepth(100)
      .setVisible(false);
    this.label = scene.add
      .text(480, 270, "PAUSADO", {
        fontFamily: "monospace",
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(101)
      .setVisible(false);
  }

  toggle() {
    this.paused = !this.paused;
    this.timerSystem.setPaused(this.paused);

    this.scene.physics.world.isPaused = this.paused;
    this.overlay.setVisible(this.paused);
    this.label.setVisible(this.paused);
  }
}
