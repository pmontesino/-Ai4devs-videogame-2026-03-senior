import PrivacyNoticeBanner from "./privacy-notice-banner.js";
import PurposeDisclosure from "./purpose-disclosure.js";
import ConsentCenterPanel from "../consent-center/consent-center-panel.js";
import ConsentPreferencesService from "../consent-center/consent-preferences.service.js";
import ConsentAuditLogService from "../consent-center/consent-audit-log.service.js";
import NonEssentialGatingGuard from "../consent-center/non-essential-gating.guard.js";
import RightsRequestForm from "../rights-requests/rights-request-form.js";
import RightsRequestReceiptService from "../rights-requests/rights-request-receipt.service.js";
import RightsRequestLifecycleService from "../rights-requests/rights-request-lifecycle.service.js";
import RightsRequestAuditLogService from "../rights-requests/rights-request-audit-log.service.js";
import RightsRequestResolutionService from "../rights-requests/rights-request-resolution.service.js";
import RightsRequestStatusView from "../rights-requests/rights-request-status-view.js";
import RightsRequest from "../shared/rights-request.model.js";
import RightsRequestPortabilityService from "../rights-requests/rights-request-portability.service.js";
import AIFeatureRegistryService from "../ai-transparency/ai-feature-registry.service.js";
import AIRiskClassificationService from "../ai-transparency/ai-risk-classification.service.js";
import AIGovernanceReviewService from "../ai-transparency/ai-governance-review.service.js";
import AITransparencyNotice from "../ai-transparency/ai-transparency-notice.js";
import NonAIFlowRegisterService from "../ai-transparency/non-ai-flow-register.service.js";
import AIComplianceEvidenceService from "../ai-transparency/ai-compliance-evidence.service.js";
import ComplianceEvidenceService from "../shared/compliance-evidence.service.js";

const BOOTSTRAP_KEY = "chromescar_compliance_bootstrap_done";

export default class PrivacyBootstrap {
  static async init(scene) {
    const container = document.body;
    const purposes = await PrivacyBootstrap.#loadPurposes();

    PrivacyBootstrap.#renderPrivacyEntryButton(container, scene, purposes);
    PrivacyBootstrap.#renderRightsButton(container);
    PrivacyBootstrap.#renderAIButton(container);

    if (!localStorage.getItem(BOOTSTRAP_KEY)) {
      const disclosure = PurposeDisclosure.formatPurposes(purposes);
      const banner = new PrivacyNoticeBanner(container, disclosure);
      const panel = new ConsentCenterPanel(container);

      banner.render(() => {
        panel.mount({
          purposes,
          onSave: (updates) => {
            updates.forEach((u) => {
              ConsentPreferencesService.upsertPreference({
                userId: "guest_user",
                purposeId: u.purposeId,
                consentState: u.consentState,
                channel: "settings-center",
              });
              ConsentAuditLogService.logPreferenceChange({
                purposeId: u.purposeId,
                consentState: u.consentState,
                userId: "guest_user",
              });
            });
            localStorage.setItem(BOOTSTRAP_KEY, "1");
          },
        });
      });

      ComplianceEvidenceService.saveRecord({
        evidence_id: `ev_policy_notice_${Date.now()}`,
        evidence_type: "policy_notice",
        linked_entity_id: "privacy_first_notice",
        created_by_role: "game_runtime",
        payload: { disclosure },
      });
    }

    PrivacyBootstrap.#syncAIGovernance(container);
    scene.registry.set("coreGameplayAllowed", NonEssentialGatingGuard.isCoreGameplayAllowed());
  }

  static async #loadPurposes() {
    const res = await fetch("./src/compliance/privacy-notice/purposes-config.json");
    if (!res.ok) {
      return [];
    }
    return res.json();
  }

  static #renderPrivacyEntryButton(container, scene, purposes) {
    if (document.getElementById("privacy-center-entry")) {
      return;
    }
    const btn = document.createElement("button");
    btn.id = "privacy-center-entry";
    btn.textContent = "Privacidad";
    btn.style.position = "fixed";
    btn.style.bottom = "16px";
    btn.style.right = "16px";
    btn.style.zIndex = "9997";
    btn.style.fontFamily = "monospace";
    btn.onclick = () => {
      const panel = new ConsentCenterPanel(container);
      panel.mount({
        purposes,
        onSave: (updates) => {
          updates.forEach((u) => {
            ConsentPreferencesService.upsertPreference({
              userId: "guest_user",
              purposeId: u.purposeId,
              consentState: u.consentState,
              channel: "settings-center",
            });
            ConsentAuditLogService.logPreferenceChange({
              purposeId: u.purposeId,
              consentState: u.consentState,
              userId: "guest_user",
            });
          });
          scene.registry.set("coreGameplayAllowed", NonEssentialGatingGuard.isCoreGameplayAllowed());
        },
      });
    };
    container.appendChild(btn);
  }

  static #renderRightsButton(container) {
    if (document.getElementById("rights-request-entry")) {
      return;
    }

    const btn = document.createElement("button");
    btn.id = "rights-request-entry";
    btn.textContent = "Derechos GDPR";
    btn.style.position = "fixed";
    btn.style.bottom = "16px";
    btn.style.right = "106px";
    btn.style.zIndex = "9997";
    btn.style.fontFamily = "monospace";

    btn.onclick = () => {
      const form = new RightsRequestForm(container);
      form.mount(({ user, type }) => {
        const requestId = RightsRequestReceiptService.generateRequestId();
        const request = new RightsRequest({
          request_id: requestId,
          user_identifier: user,
          request_type: type,
        });

        RightsRequestLifecycleService.add(request);
        RightsRequestAuditLogService.logTransition(requestId, "received", "request_created");

        if (RightsRequestPortabilityService.isApplicable(type)) {
          const exportData = RightsRequestPortabilityService.exportStructuredData(user);
          RightsRequestResolutionService.resolveInSLA(requestId, `Portabilidad preparada: ${exportData.schema}`);
        }

        const receipt = RightsRequestReceiptService.createReceipt(request);
        alert(`${receipt.message}. ID: ${receipt.request_id}`);
        RightsRequestStatusView.render(container);
      });
    };

    container.appendChild(btn);
  }

  static #renderAIButton(container) {
    if (document.getElementById("ai-registry-entry")) {
      return;
    }

    const btn = document.createElement("button");
    btn.id = "ai-registry-entry";
    btn.textContent = "Registro IA";
    btn.style.position = "fixed";
    btn.style.bottom = "16px";
    btn.style.right = "226px";
    btn.style.zIndex = "9997";
    btn.style.fontFamily = "monospace";

    btn.onclick = () => {
      const rows = AIFeatureRegistryService.list();
      const text = rows
        .map((r) => `${r.feature_name}: ${AIRiskClassificationService.classify(r)}`)
        .join("\n");
      alert(`Inventario IA/no-IA\n${text}`);
    };

    container.appendChild(btn);
  }

  static #syncAIGovernance(container) {
    const rows = AIFeatureRegistryService.list();
    rows.forEach((item) => {
      const reviewed = AIGovernanceReviewService.reviewItem(item);
      if (reviewed.ai_usage_flag) {
        AITransparencyNotice.show(container, reviewed);
        AIComplianceEvidenceService.logNoticeShown(reviewed);
      } else {
        NonAIFlowRegisterService.register(reviewed.feature_name, reviewed.non_ai_justification || "no_aplica");
      }
    });
  }
}
