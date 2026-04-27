const REQUESTS_KEY = "chromescar_rights_requests";

export default class RightsRequestLifecycleService {
  static list() {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveAll(rows) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(rows));
  }

  static add(request) {
    const rows = RightsRequestLifecycleService.list();
    rows.push(request);
    RightsRequestLifecycleService.saveAll(rows);
    return request;
  }

  static updateStatus(requestId, status) {
    const rows = RightsRequestLifecycleService.list();
    const item = rows.find((r) => r.request_id === requestId);
    if (!item) {
      return null;
    }
    item.status = status;
    RightsRequestLifecycleService.saveAll(rows);
    return item;
  }

  static resolve(requestId, summary) {
    const rows = RightsRequestLifecycleService.list();
    const item = rows.find((r) => r.request_id === requestId);
    if (!item) {
      return null;
    }
    item.status = "completed";
    item.resolution_summary = summary;
    item.resolved_at = new Date().toISOString();
    RightsRequestLifecycleService.saveAll(rows);
    return item;
  }
}
