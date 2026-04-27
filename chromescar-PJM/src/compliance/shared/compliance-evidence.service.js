import ComplianceEvidenceRecord from "./compliance-evidence-record.model.js";

const EVIDENCE_KEY = "chromescar_compliance_evidence";

export default class ComplianceEvidenceService {
  static list() {
    const raw = localStorage.getItem(EVIDENCE_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveRecord(input) {
    const record = new ComplianceEvidenceRecord(input);
    const records = ComplianceEvidenceService.list();
    records.push(record);
    localStorage.setItem(EVIDENCE_KEY, JSON.stringify(records));
    return record;
  }
}
