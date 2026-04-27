// ParallaxBackground.js — Fondos pixel-art por tema:
//   urban  → Madrid en ruinas (edificios, Puerta de Alcala, Tio Pepe)
//   forest → Paisaje rural espanol (colinas, arboles, vallas, sin edificios)
//   ship   → Interior de la nave (paneles metalicos, tuberias, luces)

import { GAME_HEIGHT, GAME_WIDTH } from "../data/constants.js";

export default class ParallaxBackground {
  constructor(scene, worldWidth, theme = "urban") {
    this.scene = scene;
    this.worldWidth = worldWidth;
    this.theme = theme;
    this.layers = [];
    if (theme === "forest") this.#buildForest();
    else if (theme === "ship") this.#buildShip();
    else this.#buildUrban();
  }

  // ═══ URBAN ════════════════════════════════════════════════════════════════
  #buildUrban() {
    const s = this.scene;
    this.#drawSky(0x18103a, 0xa83048);
    this.#drawOrb(0xffd6a3, 0xff8844);

    // Far skyline
    const farLayer = s.add.container(0, 0).setDepth(-90);
    let x = -100;
    while (x < this.worldWidth + 200) {
      const w = 140 + Math.floor(Math.random() * 80);
      const h = 160 + Math.floor(Math.random() * 80);
      farLayer.add(s.add.image(x, GAME_HEIGHT - 80, "bg_building_far").setOrigin(0, 1).setDisplaySize(w, h));
      x += w - 20;
    }
    farLayer.setScrollFactor(0.2);
    this.layers.push({ go: farLayer, factor: 0.2 });

    // Mid buildings
    const midLayer = s.add.container(0, 0).setDepth(-50);
    x = -150;
    while (x < this.worldWidth + 200) {
      const w = 200 + Math.floor(Math.random() * 60);
      const h = 220 + Math.floor(Math.random() * 100);
      midLayer.add(s.add.image(x, GAME_HEIGHT - 60, "bg_building_mid").setOrigin(0, 1).setDisplaySize(w, h));
      x += w - 30 + Math.floor(Math.random() * 40);
    }
    midLayer.setScrollFactor(0.55);
    this.layers.push({ go: midLayer, factor: 0.55 });

    // Near props
    const nearLayer = s.add.container(0, 0).setDepth(-20);
    x = 80;
    while (x < this.worldWidth) {
      nearLayer.add(s.add.image(x, GAME_HEIGHT - 60, "bg_lamppost").setOrigin(0.5, 1));
      x += 280 + Math.floor(Math.random() * 160);
    }
    for (let i = 0; i < 28; i++) {
      const dx = 100 + Math.floor(Math.random() * (this.worldWidth - 200));
      nearLayer.add(s.add.image(dx, GAME_HEIGHT - 58, "bg_debris").setOrigin(0.5, 1));
    }
    nearLayer.setScrollFactor(0.92);
    this.layers.push({ go: nearLayer, factor: 0.92 });

    this.#drawGround(0x3a2818);

    // Landmarks every ~1500px so they spread across the longer level
    this.#drawAlcalaArch(s, 900, GAME_HEIGHT - 56);
    this.#drawTioPepeBillboard(s, 1800, GAME_HEIGHT - 56);
    if (this.worldWidth > 3000) this.#drawAlcalaArch(s, 3000, GAME_HEIGHT - 56);
  }

  // ═══ FOREST (rural) ═══════════════════════════════════════════════════════
  #buildForest() {
    const s = this.scene;
    this.#drawSky(0x10243a, 0xc28a55); // dawn over rural Spain
    this.#drawOrb(0xfff0b8, 0xffaa44);

    // Far hills (factor 0.2)
    const far = s.add.graphics();
    far.setDepth(-90);
    const drawHills = (g, baseY, color, amp, step) => {
      g.fillStyle(color, 1);
      g.beginPath();
      g.moveTo(-50, baseY);
      for (let hx = -50; hx <= this.worldWidth + 50; hx += step) {
        const yh = baseY - amp - Math.sin(hx * 0.005) * amp - Math.sin(hx * 0.013) * (amp * 0.5);
        g.lineTo(hx, yh);
      }
      g.lineTo(this.worldWidth + 50, baseY);
      g.closePath();
      g.fillPath();
    };
    drawHills(far, GAME_HEIGHT - 80, 0x3b3a55, 36, 14);
    far.setScrollFactor(0.2);
    this.layers.push({ go: far, factor: 0.2 });

    // Mid hills (factor 0.5) — more saturated
    const mid = s.add.graphics();
    mid.setDepth(-50);
    drawHills(mid, GAME_HEIGHT - 60, 0x2a4a26, 50, 10);
    mid.setScrollFactor(0.5);
    this.layers.push({ go: mid, factor: 0.5 });

    // Near layer: pine trees + olive trees + fences + Osborne bull
    const near = s.add.graphics();
    near.setDepth(-20);
    near.setScrollFactor(0.9);
    let tx = 60;
    while (tx < this.worldWidth) {
      const variant = Math.floor(Math.random() * 3);
      if (variant === 0) this.#drawPine(near, tx, GAME_HEIGHT - 56);
      else if (variant === 1) this.#drawOlive(near, tx, GAME_HEIGHT - 56);
      else this.#drawBush(near, tx, GAME_HEIGHT - 56);
      tx += 120 + Math.floor(Math.random() * 120);
    }
    // Wooden fences along ground
    let fx = 100;
    while (fx < this.worldWidth) {
      this.#drawFence(near, fx, GAME_HEIGHT - 56);
      fx += 220 + Math.floor(Math.random() * 80);
    }
    this.layers.push({ go: near, factor: 0.9 });

    // Osborne bull silhouette (every ~1800 px, big, mid layer)
    this.#drawOsborne(s, 1300, GAME_HEIGHT - 56);
    if (this.worldWidth > 2800) this.#drawOsborne(s, 3200, GAME_HEIGHT - 56);

    // Ground (rural earth/grass)
    this.#drawGroundFlat(0x6a3a18, 0x3a6a28);
  }

  // ═══ SHIP (interior) ══════════════════════════════════════════════════════
  #buildShip() {
    const s = this.scene;
    // Solid dark interior backdrop
    const bg = s.add.graphics();
    bg.fillStyle(0x080814, 1).fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    bg.setScrollFactor(0).setDepth(-100);

    // Far wall: vertical pipes & glow
    const far = s.add.graphics();
    far.setDepth(-90);
    far.setScrollFactor(0.3);
    for (let px = 40; px < this.worldWidth; px += 60) {
      far.fillStyle(0x10122a, 1).fillRect(px, 40, 6, GAME_HEIGHT - 110);
      far.fillStyle(0x2a2a4a, 1).fillRect(px + 2, 40, 1, GAME_HEIGHT - 110);
    }
    // Glowing horizontal cyan line
    far.fillStyle(0x00aaff, 0.4).fillRect(0, GAME_HEIGHT / 2 - 1, this.worldWidth, 2);
    this.layers.push({ go: far, factor: 0.3 });

    // Mid: panel sections with rivets, alarm strip
    const mid = s.add.graphics();
    mid.setDepth(-50);
    mid.setScrollFactor(0.6);
    for (let px = 0; px < this.worldWidth; px += 180) {
      mid.fillStyle(0x14182a, 1).fillRect(px + 6, 80, 168, GAME_HEIGHT - 160);
      mid.fillStyle(0x202840, 1).fillRect(px + 10, 84, 160, GAME_HEIGHT - 168);
      // Rivets
      mid.fillStyle(0x44486a, 1);
      for (let r = 0; r < 6; r++) {
        mid.fillCircle(px + 14 + r * 30, 90, 2);
        mid.fillCircle(px + 14 + r * 30, GAME_HEIGHT - 90, 2);
      }
      // Alarm strip flicker
      mid.fillStyle(0x882244, 0.9).fillRect(px + 10, GAME_HEIGHT - 110, 160, 4);
    }
    this.layers.push({ go: mid, factor: 0.6 });

    // Near: pipes, conduit, monitors with cyan glow
    const near = s.add.graphics();
    near.setDepth(-20);
    near.setScrollFactor(0.95);
    for (let px = 80; px < this.worldWidth; px += 280) {
      // Console
      near.fillStyle(0x0a0a18, 1).fillRect(px, GAME_HEIGHT - 86, 64, 30);
      near.fillStyle(0x00ddff, 0.8).fillRect(px + 6, GAME_HEIGHT - 80, 18, 14);
      near.fillStyle(0xff00aa, 0.8).fillRect(px + 28, GAME_HEIGHT - 80, 18, 14);
      near.fillStyle(0xffaa00, 0.8).fillRect(px + 50, GAME_HEIGHT - 80, 10, 4);
    }
    // Ceiling pipes
    for (let px = 0; px < this.worldWidth; px += 160) {
      near.fillStyle(0x3a3a55, 1).fillRect(px, 30, 160, 8);
      near.fillStyle(0x55557a, 1).fillRect(px, 30, 160, 2);
    }
    // Floor edge highlight
    near.fillStyle(0x222244, 1).fillRect(0, GAME_HEIGHT - 56, this.worldWidth, 4);
    this.layers.push({ go: near, factor: 0.95 });

    // Metallic floor
    this.#drawShipFloor();
  }

  // ─── Helpers comunes ──────────────────────────────────────────────────────

  #drawSky(topColor, botColor) {
    const s = this.scene;
    const sky = s.add.graphics().setScrollFactor(0).setDepth(-100);
    const bands = 16;
    const top = Phaser.Display.Color.IntegerToColor(topColor);
    const bot = Phaser.Display.Color.IntegerToColor(botColor);
    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1);
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(top, bot, 1, t);
      const col = Phaser.Display.Color.GetColor(c.r, c.g, c.b);
      sky.fillStyle(col, 1);
      sky.fillRect(0, Math.floor(i * GAME_HEIGHT / bands), GAME_WIDTH, Math.ceil(GAME_HEIGHT / bands));
    }
  }

  #drawOrb(color, halo) {
    const s = this.scene;
    s.add.circle(GAME_WIDTH * 0.78, 90, 38, color, 0.85).setScrollFactor(0).setDepth(-99);
    s.add.circle(GAME_WIDTH * 0.78, 90, 56, halo, 0.18).setScrollFactor(0).setDepth(-99);
  }

  #drawGround(stroke) {
    const s = this.scene;
    const groundLayer = s.add.container(0, 0).setDepth(-10);
    let gx = 0;
    while (gx < this.worldWidth) {
      groundLayer.add(s.add.image(gx, GAME_HEIGHT - 56, "ground_tile").setOrigin(0, 0));
      gx += 96;
    }
    this.layers.push({ go: groundLayer, factor: 1 });
  }

  #drawGroundFlat(earth, grass) {
    const s = this.scene;
    const g = s.add.graphics().setDepth(-10);
    g.fillStyle(earth, 1).fillRect(0, GAME_HEIGHT - 56, this.worldWidth, 56);
    g.fillStyle(grass, 1).fillRect(0, GAME_HEIGHT - 56, this.worldWidth, 4);
    // Tufts of grass
    g.fillStyle(grass, 1);
    for (let gx = 0; gx < this.worldWidth; gx += 18) {
      const h = 2 + Math.floor(Math.random() * 3);
      g.fillRect(gx + Math.floor(Math.random() * 6), GAME_HEIGHT - 56 - h, 2, h);
    }
    // Pebbles
    g.fillStyle(0x5a4028, 1);
    for (let i = 0; i < 60; i++) {
      const px = Math.floor(Math.random() * this.worldWidth);
      g.fillRect(px, GAME_HEIGHT - 50 + Math.floor(Math.random() * 30), 2 + Math.floor(Math.random() * 3), 2);
    }
    this.layers.push({ go: g, factor: 1 });
  }

  #drawShipFloor() {
    const s = this.scene;
    const g = s.add.graphics().setDepth(-10);
    g.fillStyle(0x1a1a2a, 1).fillRect(0, GAME_HEIGHT - 56, this.worldWidth, 56);
    g.fillStyle(0x2a2a44, 1).fillRect(0, GAME_HEIGHT - 56, this.worldWidth, 4);
    // Floor panel seams every 64px
    g.fillStyle(0x000010, 1);
    for (let fx = 0; fx < this.worldWidth; fx += 64) {
      g.fillRect(fx, GAME_HEIGHT - 56, 1, 56);
    }
    // Glowing strip
    g.fillStyle(0x00ddff, 0.5).fillRect(0, GAME_HEIGHT - 30, this.worldWidth, 1);
    this.layers.push({ go: g, factor: 1 });
  }

  // ─── Forest props ────────────────────────────────────────────────────────

  #drawPine(g, cx, baseY) {
    g.fillStyle(0x3a1a08, 1).fillRect(cx - 4, baseY - 28, 8, 28);  // trunk
    g.fillStyle(0x123c20, 1);
    g.fillTriangle(cx - 22, baseY - 28, cx + 22, baseY - 28, cx, baseY - 70);
    g.fillTriangle(cx - 18, baseY - 50, cx + 18, baseY - 50, cx, baseY - 86);
    g.fillTriangle(cx - 14, baseY - 70, cx + 14, baseY - 70, cx, baseY - 100);
    g.fillStyle(0x1f5a30, 1);
    g.fillTriangle(cx - 16, baseY - 32, cx + 12, baseY - 32, cx - 2, baseY - 60);
  }

  #drawOlive(g, cx, baseY) {
    g.fillStyle(0x3a2a14, 1).fillRect(cx - 3, baseY - 18, 6, 18);
    g.fillStyle(0x4a5a2a, 1);
    g.fillCircle(cx - 8, baseY - 26, 10);
    g.fillCircle(cx + 8, baseY - 26, 10);
    g.fillCircle(cx, baseY - 36, 12);
    g.fillStyle(0x6a7a38, 1).fillCircle(cx - 4, baseY - 40, 5);
  }

  #drawBush(g, cx, baseY) {
    g.fillStyle(0x2a4a1a, 1);
    g.fillCircle(cx, baseY - 8, 8);
    g.fillCircle(cx + 8, baseY - 6, 7);
    g.fillCircle(cx - 8, baseY - 6, 6);
  }

  #drawFence(g, cx, baseY) {
    g.fillStyle(0x6a4a2a, 1);
    g.fillRect(cx, baseY - 16, 2, 16);
    g.fillRect(cx + 14, baseY - 16, 2, 16);
    g.fillRect(cx + 28, baseY - 16, 2, 16);
    g.fillRect(cx, baseY - 12, 30, 2);
    g.fillRect(cx, baseY - 6, 30, 2);
  }

  /** Toro de Osborne reventado y remendado (silueta negra + parches) */
  #drawOsborne(s, cx, baseY) {
    const g = s.add.graphics();
    g.setDepth(-30);
    g.setScrollFactor(0.7);

    // Pole
    g.fillStyle(0x1a1a1a, 1).fillRect(cx - 2, baseY - 90, 4, 90);

    // Bull silhouette (simplified Osborne)
    g.fillStyle(0x000000, 1);
    // Body
    g.fillRect(cx - 50, baseY - 130, 100, 50);
    // Head
    g.fillRect(cx + 30, baseY - 150, 28, 30);
    // Horns
    g.fillRect(cx + 36, baseY - 158, 4, 12);
    g.fillRect(cx + 50, baseY - 158, 4, 12);
    // Legs
    g.fillRect(cx - 44, baseY - 80, 8, 28);
    g.fillRect(cx - 28, baseY - 80, 8, 28);
    g.fillRect(cx + 18, baseY - 80, 8, 28);
    g.fillRect(cx + 36, baseY - 80, 8, 28);
    // Tail
    g.fillRect(cx - 56, baseY - 124, 6, 18);

    // "Reventado" — hole punched through with sky visible
    g.fillStyle(0xc28a55, 1).fillRect(cx + 6, baseY - 116, 18, 22);
    g.fillStyle(0x1a1a1a, 1);
    // Patch repairs (lighter colour to suggest fabric)
    g.fillStyle(0x442222, 1).fillRect(cx - 30, baseY - 124, 14, 10);
    // Stitches
    g.fillStyle(0xaaaa66, 1);
    g.fillRect(cx - 30, baseY - 122, 1, 1);
    g.fillRect(cx - 26, baseY - 122, 1, 1);
    g.fillRect(cx - 22, baseY - 122, 1, 1);
    g.fillRect(cx - 18, baseY - 122, 1, 1);
    // Scratches
    g.fillStyle(0x222222, 1).fillRect(cx - 10, baseY - 110, 20, 1);
  }

  // ─── Urban landmarks ─────────────────────────────────────────────────────

  #drawAlcalaArch(s, cx, groundY) {
    const g = s.add.graphics();
    g.setDepth(-15);
    g.setScrollFactor(1);
    const stone   = 0xc7a675;
    const stoneHi = 0xdcc28e;
    const stoneLo = 0x8e7448;
    const shadow  = 0x4a3a20;
    const baseY = groundY;
    const archH = 200;
    const top = baseY - archH;
    const colW = 28;
    const innerSpan = 110;
    const sideSpan = 56;
    const xL2 = cx - innerSpan / 2 - colW;
    const xL1 = xL2 - sideSpan - colW;
    const xR1 = cx + innerSpan / 2;
    const xR2 = xR1 + colW + sideSpan;
    const drawColumn = (x, w, h, brokenTop = false) => {
      g.fillStyle(stoneLo, 1).fillRect(x, baseY - h, w, h);
      g.fillStyle(stone, 1).fillRect(x + 2, baseY - h, w - 4, h);
      g.fillStyle(stoneHi, 1).fillRect(x + 4, baseY - h, 3, h);
      g.fillStyle(stoneLo, 1).fillRect(x - 4, baseY - 12, w + 8, 12);
      if (brokenTop) {
        g.fillStyle(stone, 1).fillRect(x - 2, baseY - h - 6, w / 2 + 2, 6);
        g.fillStyle(shadow, 1).fillRect(x + w / 2, baseY - h - 4, w / 2, 4);
      } else {
        g.fillStyle(stone, 1).fillRect(x - 4, baseY - h - 8, w + 8, 8);
        g.fillStyle(stoneHi, 1).fillRect(x - 4, baseY - h - 8, w + 8, 2);
      }
    };
    drawColumn(xL1, colW, archH, true);
    drawColumn(xL2, colW, archH);
    drawColumn(xR1, colW, archH);
    drawColumn(xR2, colW, archH - 30, true);
    g.fillStyle(stoneLo, 1).fillRect(xL2, top - 18, xR1 + colW - xL2, 18);
    g.fillStyle(stone, 1).fillRect(xL2, top - 18, xR1 + colW - xL2, 4);
    g.fillStyle(0x000000, 1).fillRect(cx - 14, top - 18, 28, 18);
    g.fillStyle(stoneLo, 1).fillTriangle(cx - 18, top - 18, cx - 4, top - 18, cx - 12, top - 6);
    g.fillStyle(stoneLo, 1).fillTriangle(cx + 18, top - 18, cx + 4, top - 18, cx + 12, top - 6);
    g.fillStyle(shadow, 0.6);
    g.fillRect(xL2 + colW, top - 4, innerSpan, 6);
    g.fillRect(xL1 + colW, top + 30, sideSpan, 4);
    g.fillRect(xR1 + colW, top + 30, sideSpan, 4);
    g.fillStyle(stoneLo, 1);
    g.fillRect(xL1 - 14, baseY - 8, 12, 8);
    g.fillRect(xR2 + colW + 4, baseY - 6, 16, 6);
    g.fillRect(cx - 22, baseY - 6, 14, 6);
    g.fillRect(cx + 8, baseY - 5, 12, 5);
  }

  #drawTioPepeBillboard(s, baseX, groundY) {
    const g = s.add.graphics();
    g.setDepth(-45);
    g.setScrollFactor(0.7);
    const buildW = 130;
    const buildH = 320;
    const bx = baseX - buildW / 2;
    const by = groundY - buildH;
    g.fillStyle(0x141022, 1).fillRect(bx, by, buildW, buildH);
    g.fillStyle(0x261b3a, 1).fillRect(bx + 4, by + 4, buildW - 8, buildH - 8);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        const lit = Math.random() < 0.45;
        g.fillStyle(lit ? 0xffb050 : 0x0c0820, 0.85);
        g.fillRect(bx + 14 + col * 26, by + 24 + row * 36, 14, 22);
      }
    }
    const bbW = 110;
    const bbH = 90;
    const bbx = baseX - bbW / 2 + 8;
    const bby = by - bbH - 8;
    g.fillStyle(0x2a1a08, 1);
    g.fillRect(bbx + 6, by - 8, 4, 12);
    g.fillRect(bbx + bbW - 10, by - 8, 4, 12);
    g.fillStyle(0x6e1020, 1).fillRect(bbx, bby, bbW, bbH);
    g.fillStyle(0x4a0814, 1).fillRect(bbx + 2, bby + 2, bbW - 4, bbH - 4);
    g.fillStyle(0xffd24a, 1);
    const sunR = 26;
    const sunCx = bbx + bbW / 2;
    const sunCy = bby + bbH / 2 + 4;
    g.fillCircle(sunCx, sunCy, sunR);
    g.fillStyle(0xfff0a0, 1).fillCircle(sunCx - 4, sunCy - 4, sunR - 8);
    g.fillStyle(0x000000, 1);
    g.fillRect(sunCx - 6, sunCy - 22, 12, 18);
    g.fillRect(sunCx - 14, sunCy - 4, 28, 26);
    g.fillStyle(0x222222, 1).fillRect(sunCx - 14, sunCy + 18, 28, 6);
    g.fillStyle(0x000000, 1);
    g.fillRect(sunCx - 18, sunCy - 30, 36, 4);
    g.fillRect(sunCx - 10, sunCy - 38, 20, 8);
    g.fillStyle(0xff2a2a, 1).fillRect(sunCx - 10, sunCy - 32, 20, 2);
    g.fillStyle(0xc62828, 1);
    g.fillRect(sunCx + 6, sunCy + 4, 16, 4);
    g.fillCircle(sunCx + 22, sunCy + 6, 4);
    g.fillStyle(0x000000, 0.85);
    g.fillRect(bbx + 18, bby + bbH - 24, 70, 2);
    g.fillRect(bbx + 60, bby + 8, 2, 50);
    g.fillStyle(0x100612, 1);
    g.fillTriangle(bbx + bbW, bby, bbx + bbW, bby + 22, bbx + bbW - 22, bby);
  }
}
