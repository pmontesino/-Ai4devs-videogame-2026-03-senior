export default class DataProcessingPurpose {
  constructor(data) {
    this.processing_purpose_id = data.processing_purpose_id;
    this.name = data.name;
    this.legal_basis = data.legal_basis;
    this.essential_flag = !!data.essential_flag;
    this.data_categories = data.data_categories ?? [];
    this.retention_policy_ref = data.retention_policy_ref;
  }

  isValid() {
    if (!this.essential_flag && !this.legal_basis) {
      return false;
    }
    return Array.isArray(this.data_categories) && this.data_categories.length > 0;
  }
}
