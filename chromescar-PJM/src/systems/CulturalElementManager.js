import { CULTURAL_PLACEHOLDERS, LEVEL_IDENTITY_PROFILES } from "../data/levelIdentityProfiles.js";

export default class CulturalElementManager {
  constructor(scene) {
    this.scene = scene;
    this.rendered = [];
  }

  static getProfileByIndex(levelIndex) {
    if (levelIndex === 0) {
      return LEVEL_IDENTITY_PROFILES.level1;
    }
    if (levelIndex === 1) {
      return LEVEL_IDENTITY_PROFILES.level2;
    }
    return LEVEL_IDENTITY_PROFILES.level3;
  }

  clear() {
    this.rendered.forEach((item) => item.destroy());
    this.rendered = [];
  }

  renderForLevel(levelIndex) {
    this.clear();
    const profile = CulturalElementManager.getProfileByIndex(levelIndex);

    this.scene.registry.set("culturalIdentityLevel", profile.levelName);
    this.scene.registry.set("spanishIdentityRequired", profile.spanishIdentityRequired);

    if (!profile.spanishIdentityRequired) {
      this.scene.registry.set("culturalStatus", "Nivel 3: excepcion narrativa sin referencia espanola directa");
      return profile;
    }

    profile.elements.forEach((element) => {
      const text = this.createElementText(element);
      this.rendered.push(text);
    });

    this.scene.registry.set("culturalStatus", "Catalogo cultural activo (visual+narrativo+senalizacion)");
    return profile;
  }

  createElementText(element) {
    const failedLoad = !!this.scene.registry.get(`forceFail_${element.id}`);
    const label = failedLoad ? CULTURAL_PLACEHOLDERS[element.type] : element.label;

    // Decoracion en zona superior para evitar conflicto con enemigos/proyectiles.
    return this.scene.add
      .text(element.position.x, element.position.y, label, {
        fontFamily: "monospace",
        fontSize: element.type === "narrative" ? "18px" : "16px",
        color: element.style.color,
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setAlpha(element.style.alpha)
      .setOrigin(0.5)
      .setDepth(5);
  }
}
