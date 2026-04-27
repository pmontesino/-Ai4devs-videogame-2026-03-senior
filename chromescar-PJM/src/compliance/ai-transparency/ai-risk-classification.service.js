export default class AIRiskClassificationService {
  static classify(item) {
    if (!item.ai_usage_flag) {
      return "none";
    }

    if (item.purpose?.toLowerCase().includes("perfilado")) {
      return "high";
    }

    return item.risk_classification || "limited";
  }
}
