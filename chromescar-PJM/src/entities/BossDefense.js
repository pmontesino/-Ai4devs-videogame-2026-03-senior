/**
 * BossDefense — Pared de la nave que defiende la sala final del Nivel 3.
 *
 * Es un muro pixel-art con torretas que disparan aleatoriamente contra la
 * jugadora. Tiene una barra de vida visible sobre la cabeza. Cuando la barra
 * llega a cero, dispara `destroyEffect()` y la escena lanza el final.
 */
export default class BossDefense extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = 24;
    this.hp = this.maxHp;
    this.dead = false;

    // Hit-box dimensions (the wall is tall and narrow)
    this.bodyW = 90;
    this.bodyH = 200;
    this.body.setSize(this.bodyW, this.bodyH);
    this.body.setOffset(-this.bodyW / 2, -this.bodyH / 2);
    this.body.allowGravity = false;
    this.body.immovable = true;

    this.turretYs = [-70, -20, 30, 80];
    this.#drawWall();
    this.#drawHpBar();
    this.setDepth(8);

    // Random shooting AI — fires every 1.2s from a random turret port.
    this.shootEvent = scene.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => this.#fire(),
    });
  }

  #drawWall() {
    const g = this.scene.add.graphics();
    g.fillStyle(0x2a2a3e, 1).fillRect(-45, -100, 90, 200);
    g.fillStyle(0x44445e, 1).fillRect(-43, -98, 86, 196);
    g.fillStyle(0x1a1a2a, 1).fillRect(-2, -98, 4, 196);
    g.fillStyle(0x88889a, 1);
    for (let yy = -90; yy <= 90; yy += 18) {
      g.fillCircle(-36, yy, 2);
      g.fillCircle(36, yy, 2);
    }
    g.fillStyle(0x1f1f30, 1);
    g.fillRect(-43, -52, 86, 4);
    g.fillRect(-43, 0, 86, 4);
    g.fillRect(-43, 52, 86, 4);
    this.turretYs.forEach((ty) => {
      g.fillStyle(0x101018, 1).fillRect(-45, ty - 6, 14, 12);
      g.fillStyle(0xff2266, 1).fillCircle(-38, ty, 4);
      g.fillStyle(0xffaacc, 0.7).fillCircle(-38, ty, 2);
    });
    g.fillStyle(0x55557a, 1).fillRect(-4, -120, 8, 22);
    g.fillStyle(0xff3344, 1).fillCircle(0, -124, 5);
    g.fillStyle(0xffcccc, 0.8).fillCircle(0, -124, 2);
    this.add(g);
    this.wallGfx = g;

    this.scene.tweens.add({
      targets: g, alpha: { from: 1, to: 0.85 },
      yoyo: true, repeat: -1, duration: 360,
    });
  }

  #drawHpBar() {
    const w = 110;
    const h = 10;
    this.hpBarW = w;
    this.hpBarH = h;
    this.hpBarY = -150;

    this.hpBarBg = this.scene.add.graphics();
    this.hpBarBg.fillStyle(0x000000, 0.85).fillRect(-w / 2 - 2, this.hpBarY - 2, w + 4, h + 4);
    this.hpBarBg.fillStyle(0x222233, 1).fillRect(-w / 2, this.hpBarY, w, h);
    this.add(this.hpBarBg);

    this.hpBarFill = this.scene.add.graphics();
    this.add(this.hpBarFill);
    this.#refreshHpBar();

    const label = this.scene.add.text(0, -168, "MURO DE DEFENSA", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#ff4477",
      stroke: "#000000",
      strokeThickness: 2,
    }).setOrigin(0.5, 0.5);
    this.add(label);
  }

  #refreshHpBar() {
    if (!this.hpBarFill) return;
    this.hpBarFill.clear();
    const ratio = Math.max(0, this.hp / this.maxHp);
    const fillW = Math.floor(this.hpBarW * ratio);
    const color = ratio > 0.5 ? 0x00ff88 : ratio > 0.25 ? 0xffcc33 : 0xff3344;
    this.hpBarFill.fillStyle(color, 1)
      .fillRect(-this.hpBarW / 2, this.hpBarY, fillW, this.hpBarH);
  }

  #fire() {
    if (this.dead || !this.scene || !this.active) return;
    const player = this.scene.player;
    if (!player || !player.active) return;

    const ty = this.turretYs[Math.floor(Math.random() * this.turretYs.length)];
    const fromX = this.x - 45;
    const fromY = this.y + ty;

    const bullets = this.scene.weaponSystem && this.scene.weaponSystem.enemyBullets;
    if (!bullets) return;
    const bullet = bullets.get(fromX, fromY, "bullet_enemy");
    if (!bullet) return;

    bullet.enableBody(true, fromX, fromY, true, true);
    bullet.setOrigin(0.5, 0.5);
    bullet.body.allowGravity = false;
    bullet.body.setSize(8, 8);
    bullet.setDepth(11);
    bullet.setTint(0xff4488);

    const dx = player.x - fromX;
    const dy = player.y - fromY;
    const len = Math.max(1, Math.hypot(dx, dy));
    const speed = 320;
    bullet.setVelocityX((dx / len) * speed);
    bullet.setVelocityY((dy / len) * speed);

    const token = (bullet._token || 0) + 1;
    bullet._token = token;
    this.scene.time.delayedCall(2400, () => {
      if (bullet.active && bullet._token === token) bullet.disableBody(true, true);
    });

    const flash = this.scene.add.circle(fromX, fromY, 6, 0xffaacc).setDepth(12);
    this.scene.tweens.add({
      targets: flash, alpha: 0, scale: 2,
      duration: 160, onComplete: () => flash.destroy(),
    });
  }

  receiveHit() {
    if (this.dead) return false;
    this.hp -= 1;
    this.#refreshHpBar();
    if (this.wallGfx) {
      this.wallGfx.setAlpha(0.4);
      this.scene.time.delayedCall(80, () => {
        if (this.wallGfx) this.wallGfx.setAlpha(1);
      });
    }
    if (this.hp <= 0) {
      this.dead = true;
      if (this.shootEvent) this.shootEvent.remove(false);
      return true;
    }
    return false;
  }

  destroyEffect() {
    if (!this.scene) return;
    for (let i = 0; i < 18; i++) {
      const px = this.x + (Math.random() * 80 - 40);
      const py = this.y + (Math.random() * 180 - 90);
      const piece = this.scene.add.rectangle(px, py, 6, 6, 0xff8844).setDepth(10);
      this.scene.tweens.add({
        targets: piece,
        x: px + (Math.random() * 200 - 100),
        y: py + (Math.random() * 200 - 100),
        alpha: 0,
        duration: 600 + Math.random() * 300,
        onComplete: () => piece.destroy(),
      });
    }
    this.scene.time.delayedCall(50, () => this.destroy());
  }
}
