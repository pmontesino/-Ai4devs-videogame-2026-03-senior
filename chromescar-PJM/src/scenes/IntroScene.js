// IntroScene — Cinematica narrativa Iron Remnant v0.1
// 4 slides pixel-art procedurales con monumentos destruidos y narrativa
// de la guerra contra los Yermos. Tipografia Press Start 2P.

const FONT = "'Press Start 2P', monospace";

const PALETTE = {
  WHITE:   "#ffffff",
  CYAN:    "#00ffff",
  MAGENTA: "#ff00ff",
  YELLOW:  "#f7d060",
  AMBER:   "#ff8844",
  DIM:     "#8888bb",
  HINT:    "#7fdbff",
};

// ─── Slides definition ───────────────────────────────────────────────────────
const SLIDES = [
  {
    locationLabel: "NUEVA YORK · 2071",
    skyTop: 0x2a0a1a, skyBot: 0xff3322,
    monument: "liberty",
    title: "LA PRIMERA OLEADA",
    body: [
      "Llegaron sin aviso. Sin mensaje.",
      "Sin demanda.",
      "",
      "En 72 horas la costa este era ceniza.",
      "Los llamamos LOS YERMOS.",
    ],
    accent: PALETTE.AMBER,
  },
  {
    locationLabel: "PARIS · 2098",
    skyTop: 0x1a0a2e, skyBot: 0x6a1a4a,
    monument: "eiffel",
    title: "CINCUENTA Y TRES ANOS DESPUES",
    body: [
      "Trece oleadas. Cero victorias.",
      "Las naciones han caido una a una.",
      "",
      "Solo quedan las BASES.",
      "500 millones de humanos en todo el mundo.",
    ],
    accent: PALETTE.MAGENTA,
  },
  {
    locationLabel: "LONDRES · 2118",
    skyTop: 0x0a1a2e, skyBot: 0x3a4a5a,
    monument: "bigben",
    title: "NO LOS ENTENDEMOS",
    body: [
      "Al morir se desintegran en 8 segundos.",
      "Sin residuo. Sin masa. Sin cuerpo.",
      "",
      "Pero emiten una senal de baja banda",
      "11 minutos antes de cada ataque.",
    ],
    accent: PALETTE.CYAN,
  },
  {
    locationLabel: "MADRID · BASE CIBELES · 2124 · 06:07",
    skyTop: 0x0a1a3a, skyBot: 0x2a6a8a,
    monument: "alcala",
    title: "OPERACION RAPTURE",
    body: [
      "NORA VIDAL · UNIDAD ATALAYA",
      "24 anos. 127 misiones. 0 fallidas.",
      "",
      "Hoy detectaste la senal 20 minutos",
      "antes que los sensores de la Base.",
      "",
      "MISION: Capturar una nave Yermo intacta.",
      "Por primera vez en 50 anos.",
      "",
      "VENTANA TACTICA: 11 MINUTOS.",
    ],
    accent: PALETTE.CYAN,
    isFinal: true,
  },
];

export default class IntroScene extends Phaser.Scene {
  #containers = [];
  #dots = [];
  #slideIndex = 0;
  #transitioning = false;

  constructor() {
    super({ key: "IntroScene" });
  }

  create() {
    // Continue-from-save: skip intro completely
    const save = this.registry.get("continueSave");
    if (save) {
      this.registry.set("startLevelIndex", save.levelIndex ?? 0);
      this.#startCampaign();
      return;
    }

    this.cameras.main.setBackgroundColor("#000000");

    // Build all 4 slides upfront, hide all but the first
    SLIDES.forEach((slide, idx) => {
      const c = this.#buildSlide(slide);
      c.setAlpha(idx === 0 ? 1 : 0);
      this.#containers.push(c);
    });

    this.#drawProgressDots();
    this.#drawFooterHints();

    // Input
    this.input.keyboard.on("keydown-SPACE", () => this.#advance());
    this.input.keyboard.on("keydown-ENTER", () => this.#startCampaign());
    this.input.on("pointerdown", () => this.#advance());
  }

  // ─── Slide builder ─────────────────────────────────────────────────────────

  #buildSlide(slide) {
    const c = this.add.container(0, 0);

    c.add(this.#buildSky(slide.skyTop, slide.skyBot));
    c.add(this.#buildSilhouettedSkyline(0x000000));

    // Monument illustration
    const monumentGfx = this.add.graphics();
    this.#drawMonument(monumentGfx, slide.monument, 480, 340);
    c.add(monumentGfx);

    // Smoke / fire ambient
    const fxLayer = this.add.graphics();
    this.#drawAmbientFx(fxLayer, slide);
    c.add(fxLayer);

    this.tweens.add({
      targets: fxLayer,
      alpha: { from: 0.55, to: 0.95 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Location label (top-left)
    c.add(this.add.text(40, 30, slide.locationLabel, {
      fontFamily: FONT,
      fontSize: "10px",
      color: PALETTE.MAGENTA,
      shadow: { offsetX: 0, offsetY: 0, color: "#ff00ff", blur: 6, fill: true },
    }));

    // Title
    c.add(this.add.text(480, 60, slide.title, {
      fontFamily: FONT,
      fontSize: "16px",
      color: slide.accent,
      shadow: { offsetX: 0, offsetY: 0, color: slide.accent, blur: 14, fill: true },
    }).setOrigin(0.5));

    // Body block — bottom panel
    const bodyText = slide.body.join("\n");
    const lines = slide.body.length;
    const panelH = 16 + lines * 18;
    const panelY = 540 - panelH - 56;

    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.55);
    panel.fillRect(60, panelY, 840, panelH);
    panel.lineStyle(1, this.#hexToInt(slide.accent), 0.6);
    panel.strokeRect(60, panelY, 840, panelH);
    c.add(panel);

    c.add(this.add.text(480, panelY + panelH / 2, bodyText, {
      fontFamily: FONT,
      fontSize: "11px",
      color: PALETTE.WHITE,
      align: "center",
      lineSpacing: 7,
    }).setOrigin(0.5));

    return c;
  }

  // ─── Backgrounds ───────────────────────────────────────────────────────────

  #buildSky(topInt, botInt) {
    const g = this.add.graphics();
    const bands = 18;
    const top = Phaser.Display.Color.IntegerToColor(topInt);
    const bot = Phaser.Display.Color.IntegerToColor(botInt);
    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1);
      const col = Phaser.Display.Color.Interpolate.ColorWithColor(top, bot, 1, t);
      const c = Phaser.Display.Color.GetColor(col.r, col.g, col.b);
      g.fillStyle(c, 1);
      g.fillRect(0, Math.floor(i * (540 / bands)), 960, Math.ceil(540 / bands));
    }
    return g;
  }

  #buildSilhouettedSkyline(color) {
    const g = this.add.graphics();
    g.fillStyle(color, 0.85);
    g.fillRect(0, 460, 960, 80);
    const buildings = [
      [40,  410, 60,  50], [110, 395, 50, 65], [170, 420, 70, 40],
      [250, 380, 45, 80], [305, 405, 60, 55], [380, 390, 35, 70],
      [560, 400, 55, 60], [625, 415, 70, 45], [705, 385, 40, 75],
      [755, 410, 65, 50], [830, 395, 50, 65], [890, 420, 60, 40],
    ];
    buildings.forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));
    return g;
  }

  #drawAmbientFx(g, slide) {
    g.fillStyle(0x444455, 0.55);
    [[80, 110], [220, 90], [780, 100], [880, 130]].forEach(([x, y]) => {
      this.#drawSmokePuff(g, x, y);
    });
    if (slide.monument !== "alcala") {
      g.fillStyle(0xff5522, 0.45);
      [[120, 470], [340, 478], [620, 472], [820, 476]].forEach(([x, y]) => {
        g.fillRect(x, y, 50, 8);
        g.fillRect(x + 8, y - 6, 34, 6);
      });
    }
  }

  #drawSmokePuff(g, x, y) {
    g.fillRect(x, y, 60, 14);
    g.fillRect(x + 8, y - 8, 50, 10);
    g.fillRect(x - 6, y + 8, 50, 10);
    g.fillRect(x + 14, y - 14, 36, 8);
  }

  // ─── Monument routing ──────────────────────────────────────────────────────

  #drawMonument(g, kind, cx, baseY) {
    switch (kind) {
      case "liberty": this.#drawLiberty(g, cx, baseY); break;
      case "eiffel":  this.#drawEiffel(g, cx, baseY); break;
      case "bigben":  this.#drawBigBen(g, cx, baseY); break;
      case "alcala":  this.#drawAlcala(g, cx, baseY); break;
    }
  }

  // ─── Statue of Liberty ─────────────────────────────────────────────────────
  #drawLiberty(g, cx, baseY) {
    const PED = 0x3a3a4a, PED_SH = 0x222230;
    const STONE = 0x6a8b78, STONE_SH = 0x3a5a4a;

    // Pedestal
    g.fillStyle(PED, 1);
    g.fillRect(cx - 50, baseY - 20, 100, 80);
    g.fillStyle(PED_SH, 1);
    g.fillRect(cx + 30, baseY - 20, 20, 80);

    // Lower body / robe
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 30, baseY - 90, 60, 70);
    g.fillStyle(STONE_SH, 1);
    g.fillRect(cx + 14, baseY - 90, 16, 70);

    // Break line at chest
    g.fillStyle(0x000000, 1);
    g.fillRect(cx - 32, baseY - 92, 64, 4);
    g.fillRect(cx - 18, baseY - 96, 8,  4);
    g.fillRect(cx + 6,  baseY - 96, 6,  4);

    // Fallen torso & head on the ground (right)
    g.fillStyle(STONE, 1);
    g.fillRect(cx + 60, baseY + 40, 90, 24);
    g.fillRect(cx + 130, baseY + 28, 28, 28);
    g.fillRect(cx + 132, baseY + 24, 4, 6);
    g.fillRect(cx + 140, baseY + 22, 4, 6);
    g.fillRect(cx + 148, baseY + 24, 4, 6);
    g.fillStyle(STONE_SH, 1);
    g.fillRect(cx + 60, baseY + 58, 90, 6);

    // Fallen torch (foreground left)
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 150, baseY + 50, 40, 10);
    g.fillRect(cx - 170, baseY + 30, 14, 24);
    g.fillStyle(0xff8844, 1);
    g.fillRect(cx - 174, baseY + 22, 22, 10);
    g.fillStyle(0xffd060, 1);
    g.fillRect(cx - 170, baseY + 24, 14, 4);
  }

  // ─── Eiffel Tower ──────────────────────────────────────────────────────────
  #drawEiffel(g, cx, baseY) {
    const IRON = 0x5a4a3a, IRON_SH = 0x2a1a0a;

    g.fillStyle(IRON, 1);
    // Splayed legs
    g.fillRect(cx - 90, baseY + 40, 18, 30);
    g.fillRect(cx - 50, baseY + 40, 14, 30);
    g.fillRect(cx + 36, baseY + 40, 14, 30);
    g.fillRect(cx + 72, baseY + 40, 18, 30);

    // Arches & platforms (intact lower section)
    g.fillRect(cx - 90, baseY + 30, 180, 12);
    g.fillRect(cx - 70, baseY,      140, 8);
    g.fillRect(cx - 50, baseY - 30, 100, 8);

    // Mid stub (broken off)
    g.fillRect(cx - 30, baseY - 80, 14, 50);
    g.fillRect(cx - 40, baseY - 88, 34, 8);

    // Collapsed shaft on the ground
    g.fillRect(cx + 30,  baseY + 36, 130, 10);
    g.fillRect(cx + 110, baseY + 22, 8,  18);
    g.fillRect(cx + 120, baseY + 14, 8,  10);
    g.fillRect(cx + 130, baseY + 6,  8,  10);
    g.fillRect(cx + 140, baseY - 4,  6,  10);
    g.fillRect(cx + 150, baseY - 14, 6,  10);
    g.fillStyle(0xff00ff, 1);
    g.fillRect(cx + 156, baseY - 18, 10, 6);

    // Shadow lattice details
    g.fillStyle(IRON_SH, 1);
    g.fillRect(cx - 84, baseY + 10, 8, 4);
    g.fillRect(cx + 76, baseY + 10, 8, 4);
    g.fillRect(cx - 60, baseY - 20, 6, 4);
    g.fillRect(cx + 54, baseY - 20, 6, 4);
  }

  // ─── Big Ben ───────────────────────────────────────────────────────────────
  #drawBigBen(g, cx, baseY) {
    const STONE = 0x8a7a5a, STONE_SH = 0x4a3a1a;
    const ROOF  = 0x3a5a3a;

    // Lower base
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 40, baseY - 30, 80, 90);
    g.fillStyle(STONE_SH, 1);
    g.fillRect(cx + 20, baseY - 30, 20, 90);

    // Tower shaft
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 28, baseY - 180, 56, 150);
    g.fillStyle(STONE_SH, 1);
    g.fillRect(cx + 14, baseY - 180, 14, 150);

    // Clock face
    g.fillStyle(0xeeeedd, 1);
    g.fillRect(cx - 20, baseY - 156, 40, 36);
    g.fillRect(cx - 24, baseY - 150, 48, 24);
    g.fillRect(cx - 22, baseY - 152, 44, 28);

    // Cracks
    g.fillStyle(0x000000, 1);
    g.fillRect(cx - 22, baseY - 138, 44, 2);
    g.fillRect(cx - 14, baseY - 154, 2, 28);
    g.fillRect(cx - 8,  baseY - 144, 14, 2);
    g.fillRect(cx + 6,  baseY - 148, 2, 12);
    // Clock hands frozen at ~03:17
    g.fillStyle(0x222222, 1);
    g.fillRect(cx,     baseY - 138, 12, 2);  // hour hand pointing right (3)
    g.fillRect(cx,     baseY - 140, 2, 18);  // minute hand pointing down

    // Roof / spire
    g.fillStyle(ROOF, 1);
    g.fillRect(cx - 22, baseY - 196, 44, 16);
    g.fillRect(cx - 14, baseY - 210, 28, 14);
    g.fillRect(cx - 6,  baseY - 222, 12, 12);
    // Snapped spire on the ground
    g.fillRect(cx + 60, baseY + 50, 30, 8);
    g.fillRect(cx + 78, baseY + 44, 16, 8);

    // Fog
    g.fillStyle(0xaaaadd, 0.18);
    g.fillRect(cx - 90, baseY - 60, 180, 18);
  }

  // ─── Puerta de Alcala + Nora ───────────────────────────────────────────────
  #drawAlcala(g, cx, baseY) {
    const STONE = 0xc4a868, STONE_SH = 0x6a4a1a, STONE_HI = 0xe8c890;

    // Facade
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 140, baseY - 100, 280, 130);
    g.fillStyle(STONE_HI, 1);
    g.fillRect(cx - 140, baseY - 100, 280, 6);

    // Five archway openings
    g.fillStyle(0x0a1228, 1);
    g.fillRect(cx - 122, baseY - 70, 28, 70);
    g.fillRect(cx - 82,  baseY - 84, 44, 84);
    g.fillRect(cx - 22,  baseY - 90, 44, 90);
    g.fillRect(cx + 38,  baseY - 84, 44, 84);
    g.fillRect(cx + 94,  baseY - 70, 28, 70);

    // Top cornice
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 150, baseY - 110, 300, 14);
    g.fillStyle(STONE_HI, 1);
    g.fillRect(cx - 150, baseY - 112, 300, 4);

    // Pediment (crown)
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 28, baseY - 130, 56, 22);
    g.fillRect(cx - 10, baseY - 142, 20, 14);

    // Cracks
    g.fillStyle(STONE_SH, 1);
    g.fillRect(cx + 12, baseY - 108, 2, 16);
    g.fillRect(cx + 14, baseY - 92,  2, 10);
    g.fillRect(cx - 60, baseY - 110, 2, 12);
    g.fillRect(cx - 58, baseY - 98,  2,  8);
    g.fillRect(cx + 80, baseY - 100, 2, 14);

    // Fallen chunks on ground
    g.fillStyle(STONE, 1);
    g.fillRect(cx - 200, baseY + 50, 18, 8);
    g.fillRect(cx + 188, baseY + 52, 22, 8);
    g.fillRect(cx + 214, baseY + 48, 12, 12);

    // Resistance flags
    g.fillStyle(0xff3344, 1);
    g.fillRect(cx - 80, baseY - 138, 4, 16);
    g.fillRect(cx - 78, baseY - 138, 14, 8);
    g.fillStyle(0xffd060, 1);
    g.fillRect(cx + 76, baseY - 138, 4, 16);
    g.fillRect(cx + 78, baseY - 138, 14, 8);

    // Nora silhouette
    this.#drawNoraSilhouette(g, cx + 230, baseY + 56);
  }

  #drawNoraSilhouette(g, footX, footY) {
    const BODY = 0x101018;
    const ARM = 0x00ffff, ARM_HI = 0xaaffff;

    // Legs
    g.fillStyle(BODY, 1);
    g.fillRect(footX - 8, footY - 36, 6, 36);
    g.fillRect(footX + 2, footY - 36, 6, 36);
    // Torso
    g.fillRect(footX - 12, footY - 76, 24, 42);
    // Head
    g.fillRect(footX - 8, footY - 92, 16, 16);
    // ARIA visor band
    g.fillStyle(0xff00ff, 1);
    g.fillRect(footX - 8, footY - 86, 16, 3);
    // Organic left arm
    g.fillStyle(BODY, 1);
    g.fillRect(footX - 16, footY - 72, 6, 32);

    // Mk.IV Ironhand chrome arm
    g.fillStyle(ARM, 1);
    g.fillRect(footX + 12, footY - 72, 8, 16);
    g.fillRect(footX + 18, footY - 56, 8, 18);
    g.fillRect(footX + 24, footY - 38, 12, 8);
    g.fillStyle(ARM_HI, 1);
    g.fillRect(footX + 14, footY - 72, 2, 16);
    g.fillRect(footX + 20, footY - 56, 2, 18);
  }

  // ─── Progress dots & footer ────────────────────────────────────────────────

  #drawProgressDots() {
    const total = SLIDES.length;
    const spacing = 18;
    const startX = 480 - ((total - 1) * spacing) / 2;
    const y = 510;
    for (let i = 0; i < total; i++) {
      const dot = this.add.rectangle(startX + i * spacing, y, 8, 8,
        i === 0 ? 0x00ffff : 0x444466);
      this.#dots.push(dot);
    }
  }

  #updateDots() {
    this.#dots.forEach((d, i) => {
      d.fillColor = (i === this.#slideIndex) ? 0x00ffff : 0x444466;
    });
  }

  #drawFooterHints() {
    this.add.text(40, 510, "[ESPACIO] siguiente", {
      fontFamily: FONT, fontSize: "8px", color: PALETTE.HINT,
    });
    this.add.text(920, 510, "[ENTER] saltar", {
      fontFamily: FONT, fontSize: "8px", color: PALETTE.HINT,
    }).setOrigin(1, 0);
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  #advance() {
    if (this.#transitioning) return;
    if (this.#slideIndex >= SLIDES.length - 1) {
      this.#startCampaign();
      return;
    }

    this.#transitioning = true;
    const current = this.#containers[this.#slideIndex];
    const next    = this.#containers[this.#slideIndex + 1];
    next.setAlpha(0);

    this.tweens.add({
      targets: current,
      alpha: 0,
      duration: 350,
      ease: "Linear",
      onComplete: () => {
        this.tweens.add({
          targets: next,
          alpha: 1,
          duration: 350,
          ease: "Linear",
          onComplete: () => {
            this.#slideIndex += 1;
            this.#updateDots();
            this.#transitioning = false;
          },
        });
      },
    });
  }

  #startCampaign() {
    this.registry.set("introSeen", true);
    this.scene.start("Level1UrbanScene");
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  #hexToInt(hex) {
    return parseInt(hex.replace("#", ""), 16);
  }
}
