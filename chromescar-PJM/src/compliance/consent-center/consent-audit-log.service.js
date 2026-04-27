import ComplianceEvidenceService from "../shared/compliance-evidence.service.js";

export default class ConsentAuditLogService {
  static logPreferenceChange({ purposeId, consentState, userId }) {
    return ComplianceEvidenceService.saveRecord({
      evidence_id: `ev_consent_${Date.now()}_${purposeId}`,
      evidence_type: "consent_log",
      linked_entity_id: purposeId,
      created_by_role: "player",
      payload: { userId, purposeId, consentState },
    });
  }
}
