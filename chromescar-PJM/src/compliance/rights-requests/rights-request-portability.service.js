import RightsRequestAuditLogService from "./rights-request-audit-log.service.js";

export default class RightsRequestPortabilityService {
  static isApplicable(requestType) {
    return requestType === "portability";
  }

  static exportStructuredData(userId) {
    const payload = {
      user_identifier: userId,
      exported_at: new Date().toISOString(),
      schema: "chromescar.portability.v1",
      data: {
        preferences: "available",
        progress: "available",
        rights_requests: "available",
      },
    };

    RightsRequestAuditLogService.logTransition(`portability_${userId}`, "completed", "structured_export_generated");
    return payload;
  }
}
