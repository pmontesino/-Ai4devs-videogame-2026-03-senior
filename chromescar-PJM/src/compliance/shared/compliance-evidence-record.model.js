export default class ComplianceEvidenceRecord {
  constructor({ evidence_id, evidence_type, linked_entity_id, created_by_role, payload }) {
    this.evidence_id = evidence_id;
    this.evidence_type = evidence_type;
    this.linked_entity_id = linked_entity_id;
    this.created_at = new Date().toISOString();
    this.created_by_role = created_by_role;
    this.payload = payload;
    this.integrity_hash = this.#hash(JSON.stringify(payload) + this.created_at);
    this.storage_location_ref = "localStorage:chromescar_compliance_evidence";
  }

  #hash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return `h${Math.abs(hash)}`;
  }
}
