import ComplianceEvidenceService from "../shared/compliance-evidence.service.js";

export default class NonAIFlowRegisterService {
  static register(flowName, justification) {
    return ComplianceEvidenceService.saveRecord({
      evidence_id: `ev_non_ai_${Date.now()}`,
      evidence_type: "policy_notice",
      linked_entity_id: flowName,
      created_by_role: "compliance_system",
      payload: { flowName, ai_usage_flag: false, justification },
    });
  }
}
