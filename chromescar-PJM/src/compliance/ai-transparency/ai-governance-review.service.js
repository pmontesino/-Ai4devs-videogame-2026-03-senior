import ComplianceEvidenceService from "../shared/compliance-evidence.service.js";

export default class AIGovernanceReviewService {
  static reviewItem(item) {
    const reviewed = {
      ...item,
      last_review_at: new Date().toISOString(),
    };

    ComplianceEvidenceService.saveRecord({
      evidence_id: `ev_ai_review_${Date.now()}_${item.ai_item_id}`,
      evidence_type: "ai_review",
      linked_entity_id: item.ai_item_id,
      created_by_role: item.owner_role || "compliance_owner",
      payload: reviewed,
    });

    return reviewed;
  }
}
