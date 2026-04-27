import ComplianceEvidenceService from "../shared/compliance-evidence.service.js";

export default class AIComplianceEvidenceService {
  static logNoticeShown(item) {
    return ComplianceEvidenceService.saveRecord({
      evidence_id: `ev_ai_notice_${Date.now()}_${item.ai_item_id}`,
      evidence_type: "policy_notice",
      linked_entity_id: item.ai_item_id,
      created_by_role: "game_runtime",
      payload: {
        ai_item_id: item.ai_item_id,
        feature_name: item.feature_name,
        shown_at: new Date().toISOString(),
      },
    });
  }
}
