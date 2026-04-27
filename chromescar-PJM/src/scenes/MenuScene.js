import SaveSystem from "../systems/SaveSystem.js";
import PrivacyBootstrap from "../compliance/privacy-notice/privacy-bootstrap.js";

// ─── Palette ────────────────────────────────────────────────────────────────
const FONT = "'Press Start 2P', monospace";
const CLR = {
  BG:       "#07071a",
  CYAN:     "#00ffff",
  MAGENTA:  "#ff00ff",
  YELLOW:   "#f7d060",
  WHITE:    "#ffffff",
  HINT:     "#7fdbff",
  DIM:      "#666699",
  SUB:      "#8888bb",
  // Integer versions for Phaser Graphics API
  iCYAN:    0x00ffff,
  iMAGENTA: 0xff00ff,
  iYELLOW:  0xf7d060,
  iGRID:    0x1a1a4a,
};

// ─── Difficulty config ───────────────────────────────────────────────────────
const DIFFICULTIES = [
  { key: "easy",   label: "Fácil",       color: CLR.CYAN,    iColor: CLR.iCYAN    },
  { key: "medium", label: "Intermedio",  color: CLR.YELLOW,  iColor: CLR.iYELLOW  },
  { key: "hard",   label: "Difícil",     color: CLR.MAGENTA, iColor: CLR.iMAGENTA },
];

export default class MenuScene extends Phaser.Scene {
  #gridOffset = 0;
  #gridGfx = null;

  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    this.cameras.main.setBackgroundColor(CLR.BG);
    this.#gridOffset = 0;
    this.#gridGfx = this.#buildGrid();
    this.#drawNeonTitle(480, 98);
    this.#drawDifficultySection(480, 278);
    this.#drawContinueHint(480, 455);
    this.#drawControlsHint(480, 502);
    this.#registerKeys();
    PrivacyBootstrap.init(this).catch((err) => {
      console.warn("Compliance bootstrap failed", err);
    });
  }

  // ─── Builders ──────────────────────────────────────────────────────────────

  /** Builds a Graphics object with one extra column on each side for seamless scroll */
  #buildGrid() {
    const STEP = 40;
    const g = this.add.graphics();
    g.lineStyle(1, CLR.iGRID, 0.3);
    // Extra columns left (-STEP) and right (960+STEP) so edges never go blank
    for (let x = -STEP; x <= 960 + STEP; x += STEP) g.lineBetween(x, 0, x, 540);
    for (let y = 0; y <= 540; y += STEP) g.lineBetween(-STEP, y, 960 + STEP, y);
    return g;
  }

  update(time, delta) {
    const STEP  = 40;
    const SPEED = 30; // px per second
    this.#gridOffset = (this.#gridOffset + SPEED * (delta / 1000)) % STEP;
    this.#gridGfx.x = this.#gridOffset;
  }

  #drawNeonTitle(cx, y) {
    const base = { fontFamily: FONT, fontSize: "62px" };

    // Outer magenta glow layer
    const outerGlow = this.add.text(cx, y, "CHROME SCAR", {
      ...base,
      color: CLR.MAGENTA,
      shadow: { offsetX: 0, offsetY: 0, color: CLR.MAGENTA, blur: 36, fill: true },
    }).setOrigin(0.5).setAlpha(0.38);

    // Inner purple glow layer
    const innerGlow = this.add.text(cx, y, "CHROME SCAR", {
      ...base,
      color: "#cc44ff",
      shadow: { offsetX: 0, offsetY: 0, color: "#cc44ff", blur: 18, fill: true },
    }).setOrigin(0.5).setAlpha(0.6);

    // Main text: white core with cyan outline
    this.add.text(cx, y, "CHROME SCAR", {
      ...base,
      color: CLR.WHITE,
      stroke: CLR.CYAN,
      strokeThickness: 2,
      shadow: { offsetX: 0, offsetY: 0, color: CLR.CYAN, blur: 20, fill: true },
    }).setOrigin(0.5);

    // Neon pulse tween on glow layers
    this.tweens.add({
      targets: [outerGlow, innerGlow],
      alpha: { from: 0.22, to: 0.58 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  #drawSubtitle(cx, y) {
    this.add.text(cx, y, "OPERACIÓN ESPEJO ROTO", {
      fontFamily: FONT,
      fontSize: "11px",
      color: CLR.SUB,
    }).setOrigin(0.5);

    // Decorative rule
    const rule = this.add.graphics();
    rule.lineStyle(1, CLR.iCYAN, 0.28);
    rule.lineBetween(140, y + 24, 820, y + 24);
  }

  #drawDifficultySection(cx, startY) {
    this.add.text(cx, startY - 36, "— DIFICULTAD —", {
      fontFamily: FONT,
      fontSize: "9px",
      color: CLR.DIM,
    }).setOrigin(0.5);

    DIFFICULTIES.forEach((opt, i) => {
      this.#createButton(cx, startY + i * 58, opt);
    });
  }

  #createButton(cx, y, opt) {
    const bw = 310;
    const bh = 44;
    const bx = cx - bw / 2;
    const by = y  - bh / 2;

    // Background + border
    const border = this.add.graphics();
    border.fillStyle(0x000000, 0.55);
    border.fillRect(bx, by, bw, bh);
    border.lineStyle(2, opt.iColor, 0.75);
    border.strokeRect(bx, by, bw, bh);
    this.#pixelCorners(border, bx, by, bw, bh, opt.iColor);

    // Hover highlight (drawn once, alpha toggled)
    const hover = this.add.graphics().setAlpha(0);
    hover.fillStyle(opt.iColor, 0.16);
    hover.fillRect(bx + 2, by + 2, bw - 4, bh - 4);

    // Label
    const label = this.add.text(cx, y, opt.label, {
      fontFamily: FONT,
      fontSize: "16px",
      color: opt.color,
      shadow: { offsetX: 0, offsetY: 0, color: opt.color, blur: 12, fill: true },
    }).setOrigin(0.5);

    // Interactive hit zone
    const zone = this.add.zone(cx, y, bw, bh).setInteractive({ useHandCursor: true });
    zone.on("pointerover",  () => { hover.setAlpha(1); label.setColor(CLR.WHITE); });
    zone.on("pointerout",   () => { hover.setAlpha(0); label.setColor(opt.color); });
    zone.on("pointerdown",  () => this.startNew(opt.key));
  }

  /** Draws pixel-art corner accents on a graphics object */
  #pixelCorners(gfx, x, y, w, h, color) {
    const s = 10;
    gfx.lineStyle(3, color, 1);
    gfx.lineBetween(x,     y,     x + s,  y    );
    gfx.lineBetween(x,     y,     x,      y + s);
    gfx.lineBetween(x + w, y,     x+w-s,  y    );
    gfx.lineBetween(x + w, y,     x + w,  y + s);
    gfx.lineBetween(x,     y + h, x + s,  y + h);
    gfx.lineBetween(x,     y + h, x,      y+h-s);
    gfx.lineBetween(x + w, y + h, x+w-s,  y + h);
    gfx.lineBetween(x + w, y + h, x + w,  y+h-s);
  }

  #drawContinueHint(cx, y) {
    const txt = this.add.text(cx, y, "[ C ]  CONTINUAR PARTIDA", {
      fontFamily: FONT,
      fontSize: "10px",
      color: CLR.HINT,
      shadow: { offsetX: 0, offsetY: 0, color: "#006688", blur: 8, fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    txt.on("pointerover",  () => txt.setColor(CLR.WHITE));
    txt.on("pointerout",   () => txt.setColor(CLR.HINT));
    txt.on("pointerdown",  () => this.continueFromSave());
  }

  #drawControlsHint(cx, y) {
    this.add.text(cx, y, "[ F1 ] CONTROLES", {
      fontFamily: FONT,
      fontSize: "8px",
      color: "#3a3a66",
    }).setOrigin(0.5);
  }

  #registerKeys() {
    this.input.keyboard.on("keydown-ONE",   () => this.startNew("easy"));
    this.input.keyboard.on("keydown-TWO",   () => this.startNew("medium"));
    this.input.keyboard.on("keydown-THREE", () => this.startNew("hard"));
    this.input.keyboard.on("keydown-C",     () => this.continueFromSave());
  }

  // ─── Game Flow ─────────────────────────────────────────────────────────────

  startNew(difficulty) {
    if (this.registry.get("coreGameplayAllowed") === false) return;
    this.registry.set("difficulty", difficulty);
    this.registry.set("isNewCampaign", true);
    this.scene.start("IntroScene");
  }

  continueFromSave() {
    if (this.registry.get("coreGameplayAllowed") === false) return;
    const save = SaveSystem.load();
    if (!save) return;
    this.registry.set("difficulty", save.difficulty ?? "easy");
    this.registry.set("continueSave", save);
    this.scene.start("IntroScene");
  }
}
