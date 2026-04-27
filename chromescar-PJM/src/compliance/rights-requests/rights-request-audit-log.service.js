import ComplianceEvidenceService from "../shared/compliance-evidence.service.js";

export default class RightsRequestAuditLogService {
  static logTransition(requestId, status, detail = "") {
    return ComplianceEvidenceService.saveRecord({
      evidence_id: `ev_rr_${Date.now()}_${requestId}`,
      evidence_type: "rights_request_log",
      linked_entity_id: requestId,
      created_by_role: "compliance_system",
      payload: { requestId, status, detail },
    });
  }
}
