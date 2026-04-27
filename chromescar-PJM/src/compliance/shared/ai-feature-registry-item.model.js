export default class AIFeatureRegistryItem {
  constructor({ ai_item_id, feature_name, ai_usage_flag, purpose, risk_classification, owner_role }) {
    this.ai_item_id = ai_item_id;
    this.feature_name = feature_name;
    this.ai_usage_flag = !!ai_usage_flag;
    this.purpose = purpose;
    this.risk_classification = risk_classification;
    this.owner_role = owner_role;
    this.last_review_at = new Date().toISOString();
    this.transparency_notice_ref = null;
    this.non_ai_justification = null;
  }

  markNonAI(reason) {
    this.ai_usage_flag = false;
    this.risk_classification = "none";
    this.non_ai_justification = reason;
    this.last_review_at = new Date().toISOString();
  }
}
