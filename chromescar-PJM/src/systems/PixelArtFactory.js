// PixelArtFactory.js — Genera texturas pixel-art procedurales para sprites
// del juego. Sin assets externos. Estética 16-bit estilo Ninja Gaiden NES
// con paleta neon de los 80.

const COL = {
  // Nora
  SKIN:      0xf2c79f,
  HAIR:      0x2a1a3a,
  EXO:       0x202030,
  EXO_HI:    0x3a3a55,
  CHROME:    0x00d8ff,
  CHROME_HI: 0xaaffff,
  VISOR:     0xff00ff,
  WEAPON:    0x444455,
  WEAPON_HI: 0x888899,
  MUZZLE:    0xffe060,
  // Yermo
  YERMO:     0x4a1230,
  YERMO_HI:  0x882a55,
  YERMO_DK:  0x180510,
  YERMO_EYE: 0xff2266,
  YERMO_LIMB:0x2a0818,
  // Bullets
  BULLET_P:  0x00ffff,
  BULLET_PG: 0xaaffff,
  BULLET_E:  0xff2266,
  BULLET_EG: 0xffaadd,
  // HUD
  FIST_DK:   0x202030,
  FIST_MID:  0x4a4a66,
  FIST_HI:   0x8a8aaa,
  FIST_RIM:  0x00ffff,
};

export default class PixelArtFactory {
  /** Genera todas las texturas. Llamar una vez por escena de juego. */
  static initAll(scene) {
    if (scene.textures.exists("nora_idle")) return; // idempotent
    this.#nora(scene);
    this.#yermo(scene);
    this.#bullets(scene);
    this.#fist(scene);
    this.#environment(scene);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  static #draw(scene, key, w, h, drawFn) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    drawFn(g);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  static #px(g, color, x, y, w = 1, h = 1) {
    g.fillStyle(color, 1);
    g.fillRect(x, y, w, h);
  }

  // ═══ NORA VIDAL — 24w x 36h ═══════════════════════════════════════════════
  // Layout vertical (y):
  //   0-2  hair top
  //   3-7  head + visor
  //   8-9  neck
  //  10-22 torso + arms
  //  23-35 legs

  static #drawNoraBase(g, armsCfg) {
    // Hair (back)
    this.#px(g, COL.HAIR,   8, 0, 10, 4);
    this.#px(g, COL.HAIR,   7, 2, 12, 4);
    // Head
    this.#px(g, COL.SKIN,   9, 4,  8, 5);
    // Visor (magenta band)
    this.#px(g, COL.VISOR,  9, 5,  8, 1);
    // Hair side fringe
    this.#px(g, COL.HAIR,   7, 4,  2, 3);
    this.#px(g, COL.HAIR,  17, 4,  2, 3);
    // Neck
    this.#px(g, COL.EXO,   10, 9,  6, 1);

    // Torso (exoskeleton)
    this.#px(g, COL.EXO,    8, 10, 10, 10);
    this.#px(g, COL.EXO_HI, 8, 10, 10,  1);  // top highlight
    this.#px(g, COL.EXO_HI,16, 10,  2, 10);  // right edge highlight
    // Chest emblem
    this.#px(g, COL.CHROME, 12, 13,  2, 2);

    // Belt
    this.#px(g, COL.CHROME, 8, 19, 10, 1);

    // Legs (default standing)
    this.#px(g, COL.EXO,    9, 20,  3, 12);
    this.#px(g, COL.EXO,   14, 20,  3, 12);
    this.#px(g, COL.EXO_HI, 9, 20,  1,  4);
    this.#px(g, COL.EXO_HI,14, 20,  1,  4);
    // Boots
    this.#px(g, COL.CHROME, 9, 32, 3, 2);
    this.#px(g, COL.CHROME,14, 32, 3, 2);

    // Arms via callback for poses
    armsCfg(g);
  }

  static #armsIdle(g) {
    // Left organic arm (player's left = on screen's right when facing right)
    this.#px(g, COL.EXO,    6, 11, 2, 9);
    this.#px(g, COL.SKIN,   6, 18, 2, 2);
    // Right CHROME arm hangs
    this.#px(g, COL.CHROME,    18, 11, 2, 9);
    this.#px(g, COL.CHROME_HI, 18, 11, 1, 9);
    this.#px(g, COL.CHROME,    18, 19, 3, 2); // hand
  }

  static #armsRun(g, swing) {
    // swing: -1 forward, +1 back
    if (swing > 0) {
      this.#px(g, COL.EXO,    5, 12, 2, 7);
      this.#px(g, COL.CHROME, 19, 10, 2, 8);
      this.#px(g, COL.CHROME_HI, 19, 10, 1, 8);
    } else {
      this.#px(g, COL.EXO,    7, 10, 2, 8);
      this.#px(g, COL.CHROME, 17, 12, 2, 8);
      this.#px(g, COL.CHROME_HI, 17, 12, 1, 8);
    }
  }

  static #armsShoot(g) {
    // Left organic arm steady at side
    this.#px(g, COL.EXO,    6, 11, 2, 9);
    // Right CHROME arm extended forward holding weapon
    this.#px(g, COL.CHROME,    18, 13, 4, 3);
    this.#px(g, COL.CHROME_HI, 18, 13, 4, 1);
    // Weapon barrel
    this.#px(g, COL.WEAPON,    21, 13, 2, 3);
    this.#px(g, COL.WEAPON_HI, 21, 13, 2, 1);
    // Muzzle flash
    this.#px(g, COL.MUZZLE,    23, 13, 1, 3);
  }

  static #legsRun(g, step) {
    // Replace default legs (already drawn) — over-paint
    this.#px(g, COL.EXO,  9, 20, 8, 12); // erase area
    if (step === 0) {
      this.#px(g, COL.EXO,    9, 20, 3, 11);
      this.#px(g, COL.EXO,   15, 22, 3, 10);
      this.#px(g, COL.CHROME, 9, 31, 3, 2);
      this.#px(g, COL.CHROME,15, 32, 3, 2);
    } else if (step === 1) {
      this.#px(g, COL.EXO,   10, 20, 3, 12);
      this.#px(g, COL.EXO,   14, 20, 3, 12);
      this.#px(g, COL.CHROME,10, 32, 3, 2);
      this.#px(g, COL.CHROME,14, 32, 3, 2);
    } else if (step === 2) {
      this.#px(g, COL.EXO,    9, 22, 3, 10);
      this.#px(g, COL.EXO,   15, 20, 3, 11);
      this.#px(g, COL.CHROME, 9, 32, 3, 2);
      this.#px(g, COL.CHROME,15, 31, 3, 2);
    } else {
      this.#px(g, COL.EXO,   10, 20, 3, 12);
      this.#px(g, COL.EXO,   14, 20, 3, 12);
      this.#px(g, COL.CHROME,10, 32, 3, 2);
      this.#px(g, COL.CHROME,14, 32, 3, 2);
    }
  }

  static #legsJump(g) {
    this.#px(g, COL.EXO,  9, 20, 8, 12); // erase
    // Tucked legs
    this.#px(g, COL.EXO,    8, 20, 4, 8);
    this.#px(g, COL.EXO,   13, 20, 4, 8);
    this.#px(g, COL.CHROME, 8, 27, 4, 2);
    this.#px(g, COL.CHROME,13, 27, 4, 2);
  }

  static #nora(scene) {
    // Idle
    this.#draw(scene, "nora_idle", 24, 36, (g) => {
      this.#drawNoraBase(g, () => this.#armsIdle(g));
    });

    // Run frames (4)
    for (let i = 0; i < 4; i++) {
      this.#draw(scene, `nora_run_${i}`, 24, 36, (g) => {
        this.#drawNoraBase(g, () => this.#armsRun(g, i % 2 === 0 ? -1 : 1));
        this.#legsRun(g, i);
      });
    }

    // Jump
    this.#draw(scene, "nora_jump", 24, 36, (g) => {
      this.#drawNoraBase(g, () => this.#armsRun(g, -1));
      this.#legsJump(g);
    });

    // Shoot (standing)
    this.#draw(scene, "nora_shoot", 24, 36, (g) => {
      this.#drawNoraBase(g, () => this.#armsShoot(g));
    });
  }

  // ═══ YERMO — 24w x 34h ════════════════════════════════════════════════════
  // Forma humanoide oscura con miembros largos, ojo rojo brillante.

  static #drawYermoBase(g, armCfg, legCfg) {
    // Head (cracked dome)
    this.#px(g, COL.YERMO,    8, 0, 10, 6);
    this.#px(g, COL.YERMO_DK, 7, 1,  1, 5);
    this.#px(g, COL.YERMO_HI,15, 1,  3, 1);
    // Eye (single bright)
    this.#px(g, COL.YERMO_EYE, 11, 3, 4, 2);
    // Neck
    this.#px(g, COL.YERMO_LIMB, 11, 6, 4, 2);

    // Torso
    this.#px(g, COL.YERMO,     8, 8, 10, 12);
    this.#px(g, COL.YERMO_HI, 16, 8,  2, 12);
    this.#px(g, COL.YERMO_DK,  8, 8,  1, 12);
    // Plate seam
    this.#px(g, COL.YERMO_DK,  9, 13, 8, 1);

    armCfg(g);
    legCfg(g);
  }

  static #yermoArmsIdle(g) {
    this.#px(g, COL.YERMO_LIMB,  6, 9, 2, 9);
    this.#px(g, COL.YERMO_LIMB, 18, 9, 2, 9);
    this.#px(g, COL.YERMO,       6, 18, 3, 2);
    this.#px(g, COL.YERMO,      17, 18, 3, 2);
  }

  static #yermoArmsShoot(g) {
    this.#px(g, COL.YERMO_LIMB,  6, 9, 2, 9);
    // Right arm extended
    this.#px(g, COL.YERMO_LIMB, 18, 12, 5, 3);
    this.#px(g, COL.YERMO,      22, 12, 2, 3);
    this.#px(g, COL.MUZZLE,     23, 12, 1, 3);
  }

  static #yermoLegsIdle(g) {
    this.#px(g, COL.YERMO_LIMB,  9, 20, 3, 12);
    this.#px(g, COL.YERMO_LIMB, 14, 20, 3, 12);
    this.#px(g, COL.YERMO_DK,    9, 32, 3, 2);
    this.#px(g, COL.YERMO_DK,   14, 32, 3, 2);
  }

  static #yermoLegsRun(g, step) {
    if (step === 0) {
      this.#px(g, COL.YERMO_LIMB,  9, 20, 3, 11);
      this.#px(g, COL.YERMO_LIMB, 15, 22, 3, 10);
      this.#px(g, COL.YERMO_DK,    9, 31, 3, 2);
      this.#px(g, COL.YERMO_DK,   15, 32, 3, 2);
    } else {
      this.#px(g, COL.YERMO_LIMB,  9, 22, 3, 10);
      this.#px(g, COL.YERMO_LIMB, 15, 20, 3, 11);
      this.#px(g, COL.YERMO_DK,    9, 32, 3, 2);
      this.#px(g, COL.YERMO_DK,   15, 31, 3, 2);
    }
  }

  static #yermoLegsJump(g) {
    this.#px(g, COL.YERMO_LIMB,  8, 20, 4, 8);
    this.#px(g, COL.YERMO_LIMB, 13, 20, 4, 8);
    this.#px(g, COL.YERMO_DK,    8, 27, 4, 2);
    this.#px(g, COL.YERMO_DK,   13, 27, 4, 2);
  }

  static #yermo(scene) {
    this.#draw(scene, "yermo_idle", 24, 34, (g) => {
      this.#drawYermoBase(g, (gg) => this.#yermoArmsIdle(gg), (gg) => this.#yermoLegsIdle(gg));
    });
    this.#draw(scene, "yermo_run_0", 24, 34, (g) => {
      this.#drawYermoBase(g, (gg) => this.#yermoArmsIdle(gg), (gg) => this.#yermoLegsRun(gg, 0));
    });
    this.#draw(scene, "yermo_run_1", 24, 34, (g) => {
      this.#drawYermoBase(g, (gg) => this.#yermoArmsIdle(gg), (gg) => this.#yermoLegsRun(gg, 1));
    });
    this.#draw(scene, "yermo_jump", 24, 34, (g) => {
      this.#drawYermoBase(g, (gg) => this.#yermoArmsIdle(gg), (gg) => this.#yermoLegsJump(gg));
    });
    this.#draw(scene, "yermo_shoot", 24, 34, (g) => {
      this.#drawYermoBase(g, (gg) => this.#yermoArmsShoot(gg), (gg) => this.#yermoLegsIdle(gg));
    });
  }

  // ═══ BULLETS ══════════════════════════════════════════════════════════════
  static #bullets(scene) {
    // Player: cyan glow elongated
    this.#draw(scene, "bullet_player", 12, 6, (g) => {
      this.#px(g, COL.BULLET_PG, 0, 1, 12, 4);
      this.#px(g, COL.BULLET_P,  2, 2,  9, 2);
      this.#px(g, COL.BULLET_PG, 1, 2,  1, 2);
      this.#px(g, 0xffffff,      9, 2,  3, 2);
    });
    // Enemy: magenta orb
    this.#draw(scene, "bullet_enemy", 8, 8, (g) => {
      this.#px(g, COL.BULLET_EG, 1, 1, 6, 6);
      this.#px(g, COL.BULLET_E,  2, 2, 4, 4);
      this.#px(g, 0xffffff,      3, 3, 2, 2);
    });
  }

  // ═══ FIST (HUD life icon) — 18 x 16 ═══════════════════════════════════════
  static #fist(scene) {
    this.#draw(scene, "hud_fist", 18, 16, (g) => {
      // Knuckle silhouette
      this.#px(g, COL.FIST_DK,  3,  2, 12, 12);
      this.#px(g, COL.FIST_MID, 4,  3, 11,  2);  // top highlight band
      // Knuckles bumps
      this.#px(g, COL.FIST_HI,  4,  4, 2, 1);
      this.#px(g, COL.FIST_HI,  7,  4, 2, 1);
      this.#px(g, COL.FIST_HI, 10,  4, 2, 1);
      this.#px(g, COL.FIST_HI, 13,  4, 2, 1);
      // Knuckle separations
      this.#px(g, 0x000000,     6,  4, 1, 4);
      this.#px(g, 0x000000,     9,  4, 1, 4);
      this.#px(g, 0x000000,    12,  4, 1, 4);
      // Wrist band cyan
      this.#px(g, COL.FIST_RIM, 3, 13, 12, 1);
      this.#px(g, COL.FIST_RIM, 4, 14,  2, 2);  // glow corner
      this.#px(g, COL.FIST_RIM,12, 14,  2, 2);
      // Outer dark border
      this.#px(g, 0x000000, 2,  2, 1, 12);
      this.#px(g, 0x000000,15,  2, 1, 12);
      this.#px(g, 0x000000, 3,  1, 12, 1);
      this.#px(g, 0x000000, 3, 14, 12, 1);
    });
  }

  // ═══ ENVIRONMENT — Madrid destroyed buildings ═════════════════════════════
  static #environment(scene) {    // Weapon pickup crate (20 x 20)
    this.#draw(scene, "pickup_burst", 20, 20, (g) => {
      g.fillStyle(0x000000, 1);
      g.fillRect(2, 2, 16, 16);
      g.fillStyle(0xff8844, 1);
      g.fillRect(4, 4, 12, 12);
      g.fillStyle(0xffd060, 1);
      g.fillRect(4, 4, 12, 2);
      g.fillRect(4, 4, 2, 12);
      g.fillStyle(0xffffff, 1);
      g.fillRect(8, 8, 4, 4);
      g.fillStyle(0x000000, 1);
      g.fillRect(9, 9, 2, 2);
      // Glow border
      g.fillStyle(0x00ffff, 1);
      g.fillRect(1, 1, 18, 1);
      g.fillRect(1, 18, 18, 1);
      g.fillRect(1, 1, 1, 18);
      g.fillRect(18, 1, 1, 18);
    });
    // Far building silhouette (160 x 240, very dark)
    this.#draw(scene, "bg_building_far", 160, 240, (g) => {
      const COL_FAR = 0x141430;
      const COL_FAR_HI = 0x1c1c44;
      g.fillStyle(COL_FAR, 1);
      g.fillRect(0, 60, 160, 180);
      // Broken top profile
      g.fillRect(0, 40, 40, 20);
      g.fillRect(50, 30, 30, 30);
      g.fillRect(90, 50, 30, 10);
      g.fillRect(130, 20, 30, 40);
      // Some highlights
      g.fillStyle(COL_FAR_HI, 1);
      g.fillRect(0, 60, 4, 180);
      // Window glow dots (occasional)
      g.fillStyle(0xff8866, 1);
      [[18, 90], [56, 130], [104, 160], [136, 100], [78, 200]].forEach(([x, y]) => g.fillRect(x, y, 4, 4));
    });

    // Mid building (200 x 320, more detail)
    this.#draw(scene, "bg_building_mid", 200, 320, (g) => {
      const C = 0x2a2a48, CH = 0x3a3a60, CD = 0x18182c;
      g.fillStyle(C, 1);
      g.fillRect(0, 80, 200, 240);
      // Jagged broken top
      g.fillRect(0, 60, 60, 20);
      g.fillRect(70, 30, 50, 50);
      g.fillRect(130, 70, 30, 10);
      g.fillRect(170, 40, 30, 40);
      // Highlight
      g.fillStyle(CH, 1);
      g.fillRect(0, 80, 6, 240);
      // Shadow side
      g.fillStyle(CD, 1);
      g.fillRect(190, 80, 10, 240);
      // Windows (grid)
      g.fillStyle(0x000000, 1);
      for (let r = 0; r < 8; r++) {
        for (let cc = 0; cc < 7; cc++) {
          g.fillRect(20 + cc * 24, 110 + r * 28, 12, 16);
        }
      }
      // Random lit windows
      g.fillStyle(0xffaa44, 1);
      [[44, 138], [116, 194], [164, 222], [68, 250], [140, 110]].forEach(([x, y]) => g.fillRect(x, y, 12, 16));
      // Big crack
      g.fillStyle(0x000000, 1);
      g.fillRect(98, 100, 4, 60);
      g.fillRect(102, 156, 6, 40);
      g.fillRect(94, 196, 6, 50);
    });

    // Near street prop: lamppost (12 x 96)
    this.#draw(scene, "bg_lamppost", 12, 96, (g) => {
      g.fillStyle(0x202028, 1);
      g.fillRect(5, 0, 2, 96);
      g.fillRect(2, 6, 8, 4);   // lamp head
      g.fillRect(0, 0, 12, 6);
      // Broken lamp glow
      g.fillStyle(0xffa030, 0.8);
      g.fillRect(3, 2, 6, 4);
    });

    // Debris pile (32 x 16)
    this.#draw(scene, "bg_debris", 32, 16, (g) => {
      const C = 0x3a3a4a, CD = 0x1a1a24;
      g.fillStyle(C, 1);
      g.fillRect(2, 8, 28, 8);
      g.fillRect(6, 4, 8, 4);
      g.fillRect(18, 6, 10, 2);
      g.fillStyle(CD, 1);
      g.fillRect(2, 14, 28, 2);
      // Twisted rebar
      g.fillStyle(0x6a3a1a, 1);
      g.fillRect(11, 0, 1, 8);
      g.fillRect(12, 2, 4, 1);
    });

    // Ground tile (96 x 24): cracked asphalt
    this.#draw(scene, "ground_tile", 96, 24, (g) => {
      const ASPHALT = 0x18181f, ASPH_HI = 0x2a2a36, CRACK = 0x000000;
      g.fillStyle(ASPHALT, 1);
      g.fillRect(0, 0, 96, 24);
      g.fillStyle(ASPH_HI, 1);
      g.fillRect(0, 0, 96, 2);
      // Cracks
      g.fillStyle(CRACK, 1);
      g.fillRect(12, 6, 14, 1);
      g.fillRect(40, 12, 18, 1);
      g.fillRect(70, 8, 12, 1);
      g.fillRect(56, 18, 10, 1);
    });
  }
}
