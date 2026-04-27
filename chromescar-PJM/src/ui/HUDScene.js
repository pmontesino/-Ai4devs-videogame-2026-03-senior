// HUDScene.js — HUD pixel-art con 5 puños (vidas), reloj neon central y
// indicador de arma a la derecha. Independiente de la cámara del nivel.

import PixelArtFactory from "../systems/PixelArtFactory.js";

const FONT = "'Press Start 2P', monospace";

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: "HUDScene" });
  }

  create() {
    PixelArtFactory.initAll(this);

    this.fists = [];
    this.#drawLives(20, 16);
    this.#drawClock(480, 32);
    this.#drawWeapon(820, 24);
    this.#drawObjective(480, 60);

    this._refreshHandler = () => this.#refresh();
    this.registry.events.on("changedata", this._refreshHandler);
    this._refreshHandler();

    // Detach the registry listener when this HUD instance is shut down so it
    // does not keep firing against destroyed text objects between levels.
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.registry.events.off("changedata", this._refreshHandler);
    });
    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.registry.events.off("changedata", this._refreshHandler);
    });

    // Pulse the clock
    this.tweens.add({
      targets: this.clockText,
      alpha: { from: 1, to: 0.7 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  #drawLives(x, y) {
    // Background panel
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.55);
    panel.fillRect(x - 6, y - 6, 5 * 22 + 12, 28);
    panel.lineStyle(1, 0x00ffff, 0.6);
    panel.strokeRect(x - 6, y - 6, 5 * 22 + 12, 28);

    for (let i = 0; i < 5; i++) {
      const fx = x + i * 22 + 9;
      const fy = y + 8;
      const fist = this.add.image(fx, fy, "hud_fist").setOrigin(0.5);
      this.fists.push(fist);
    }
  }

  #drawClock(cx, y) {
    // Frame around clock
    const w = 120, h = 36;
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.65);
    panel.fillRect(cx - w/2, y - h/2, w, h);
    panel.lineStyle(2, 0xff00ff, 0.85);
    panel.strokeRect(cx - w/2, y - h/2, w, h);
    // Inner cyan rim
    panel.lineStyle(1, 0x00ffff, 0.7);
    panel.strokeRect(cx - w/2 + 3, y - h/2 + 3, w - 6, h - 6);

    this.clockText = this.add.text(cx, y, "00:00", {
      fontFamily: FONT,
      fontSize: "18px",
      color: "#00ffff",
      shadow: { offsetX: 0, offsetY: 0, color: "#00ffff", blur: 14, fill: true },
    }).setOrigin(0.5);

    // Tiny TIEMPO label above
    this.add.text(cx, y - 30, "TIEMPO", {
      fontFamily: FONT,
      fontSize: "8px",
      color: "#ff66cc",
    }).setOrigin(0.5);
  }

  #drawWeapon(x, y) {
    this.add.text(x, y - 8, "ARMA", {
      fontFamily: FONT, fontSize: "8px", color: "#ff66cc",
    });
    this.weaponText = this.add.text(x, y + 4, "BASE", {
      fontFamily: FONT,
      fontSize: "12px",
      color: "#ffd060",
      shadow: { offsetX: 0, offsetY: 0, color: "#ffd060", blur: 10, fill: true },
    });
  }

  #drawObjective(cx, y) {
    // Reservado: actualmente no se muestra texto de objetivo en HUD.
    this.objectiveText = this.add.text(cx, y, "", {
      fontFamily: FONT,
      fontSize: "9px",
      color: "#bbbbdd",
    }).setOrigin(0.5).setVisible(false);
  }

  #refresh() {
    // Hard guards: the registry listener is global and can fire in the frame
    // between scene.stop and the actual SHUTDOWN being processed, so verify
    // that this HUD instance is still alive and its display objects exist.
    if (!this.sys || !this.sys.isActive()) return;
    if (!this.clockText || !this.clockText.scene || !this.clockText.active) return;
    if (!this.weaponText || !this.objectiveText) return;

    try {
      const lives = this.registry.get("lives") ?? 5;
      const timer = this.registry.get("timer") ?? 0;
      const weapon = (this.registry.get("weapon") ?? "BASE").toString().toUpperCase();
      const objective = this.registry.get("objective") ?? "";

      // Lives: dim/hide fists beyond current count
      const visible = Math.max(0, Math.min(5, lives));
      this.fists.forEach((f, i) => {
        if (!f || !f.scene) return;
        if (i < visible) {
          f.setAlpha(1);
          f.clearTint();
        } else {
          f.setAlpha(0.18);
          f.setTint(0x222244);
        }
      });

      // Format timer mm:ss
      const m = Math.floor(timer / 60);
      const s = timer % 60;
      const formatted = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      this.clockText.setText(formatted);

      // Color shift when timer is low
      if (timer <= 30) {
        this.clockText.setColor("#ff3366");
        this.clockText.setShadow(0, 0, "#ff3366", 14, false, true);
      } else if (timer <= 90) {
        this.clockText.setColor("#ffd060");
        this.clockText.setShadow(0, 0, "#ffd060", 14, false, true);
      } else {
        this.clockText.setColor("#00ffff");
        this.clockText.setShadow(0, 0, "#00ffff", 14, false, true);
      }

      this.weaponText.setText(weapon);
      this.objectiveText.setText(objective);
    } catch (err) {
      console.warn("HUD refresh skipped", err);
    }
  }
}
