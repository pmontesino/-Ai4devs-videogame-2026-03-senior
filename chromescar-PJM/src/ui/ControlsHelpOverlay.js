export default class ControlsHelpOverlay extends Phaser.Scene {
  constructor() {
    super({ key: "ControlsHelpOverlay" });
  }

  create() {
    this.add.rectangle(480, 270, 820, 420, 0x000000, 0.85);
    this.add
      .text(
        480,
        230,
        [
          "CONTROLES",
          "Arriba: Saltar",
          "Abajo: Cuerpo a tierra",
          "Izquierda/Derecha: Mover",
          "A: Disparar",
          "S: Cambiar arma",
          "P: Pausar",
          "F1: Mostrar/Ocultar ayuda",
        ],
        { fontFamily: "monospace", fontSize: "28px", align: "center", color: "#ffffff" }
      )
      .setOrigin(0.5);
  }
}
