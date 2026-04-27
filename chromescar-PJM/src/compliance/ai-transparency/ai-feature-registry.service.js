import AIFeatureRegistryItem from "../shared/ai-feature-registry-item.model.js";

const AI_KEY = "chromescar_ai_registry";

export default class AIFeatureRegistryService {
  static seedDefaults() {
    if (localStorage.getItem(AI_KEY)) {
      return;
    }

    const rows = [
      new AIFeatureRegistryItem({
        ai_item_id: "ai_001",
        feature_name: "Asistencia de ritmo adaptativo",
        ai_usage_flag: true,
        purpose: "Ajustar recomendaciones de ritmo de juego",
        risk_classification: "limited",
        owner_role: "product_owner",
      }),
      new AIFeatureRegistryItem({
        ai_item_id: "ai_002",
        feature_name: "Render de HUD base",
        ai_usage_flag: false,
        purpose: "UI tradicional",
        risk_classification: "none",
        owner_role: "frontend_dev",
      }),
    ];
    rows[1].markNonAI("Render deterministico sin inferencia");

    localStorage.setItem(AI_KEY, JSON.stringify(rows));
  }

  static list() {
    AIFeatureRegistryService.seedDefaults();
    try {
      return JSON.parse(localStorage.getItem(AI_KEY) || "[]");
    } catch {
      return [];
    }
  }
}
