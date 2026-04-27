import PrivacyPreference from "../shared/privacy-preference.model.js";

const CONSENT_KEY = "chromescar_consent_preferences";

export default class ConsentPreferencesService {
  static list() {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static upsertPreference({ userId, purposeId, consentState, channel }) {
    const rows = ConsentPreferencesService.list();
    const idx = rows.findIndex((item) => item.processing_purpose_id === purposeId);

    if (idx === -1) {
      const pref = new PrivacyPreference({
        preference_id: `pref_${Date.now()}_${purposeId}`,
        user_pseudonymous_id: userId,
        processing_purpose_id: purposeId,
        consent_state: consentState,
        capture_channel: channel,
      });
      rows.push(pref);
    } else {
      const pref = rows[idx];
      pref.consent_state = consentState;
      pref.updated_at = new Date().toISOString();
    }

    localStorage.setItem(CONSENT_KEY, JSON.stringify(rows));
    return rows;
  }
}
