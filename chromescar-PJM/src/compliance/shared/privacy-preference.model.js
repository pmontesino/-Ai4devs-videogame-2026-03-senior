export default class PrivacyPreference {
  constructor({ preference_id, user_pseudonymous_id, processing_purpose_id, consent_state, capture_channel }) {
    this.preference_id = preference_id;
    this.user_pseudonymous_id = user_pseudonymous_id;
    this.processing_purpose_id = processing_purpose_id;
    this.consent_state = consent_state;
    this.capture_channel = capture_channel;
    this.captured_at = new Date().toISOString();
    this.updated_at = this.captured_at;
  }

  updateState(state) {
    this.consent_state = state;
    this.updated_at = new Date().toISOString();
  }
}
