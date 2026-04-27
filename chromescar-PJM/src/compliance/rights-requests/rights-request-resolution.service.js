import RightsRequestLifecycleService from "./rights-request-lifecycle.service.js";
import RightsRequestAuditLogService from "./rights-request-audit-log.service.js";

export default class RightsRequestResolutionService {
  static resolveInSLA(requestId, summary) {
    const resolved = RightsRequestLifecycleService.resolve(requestId, summary);
    if (!resolved) {
      return null;
    }

    RightsRequestAuditLogService.logTransition(requestId, "completed", "resolved_within_30_days_target");
    return {
      request_id: requestId,
      message: "Resolucion comunicada en plazo objetivo de 30 dias naturales",
      summary,
    };
  }
}
