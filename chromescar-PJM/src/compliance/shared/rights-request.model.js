export default class RightsRequest {
  constructor({ request_id, user_identifier, request_type, dueDays = 30 }) {
    this.request_id = request_id;
    this.user_identifier = user_identifier;
    this.request_type = request_type;
    this.submitted_at = new Date().toISOString();
    this.status = "received";
    this.due_date = new Date(Date.now() + dueDays * 86400000).toISOString();
    this.resolved_at = null;
    this.resolution_summary = null;
  }

  transition(nextStatus) {
    this.status = nextStatus;
  }

  resolve(summary) {
    this.status = "completed";
    this.resolution_summary = summary;
    this.resolved_at = new Date().toISOString();
  }
}
