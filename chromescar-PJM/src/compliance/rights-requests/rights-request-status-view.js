import RightsRequestLifecycleService from "./rights-request-lifecycle.service.js";

export default class RightsRequestStatusView {
  static render(container) {
    const rows = RightsRequestLifecycleService.list();
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.right = "16px";
    panel.style.top = "16px";
    panel.style.background = "rgba(0,0,0,0.85)";
    panel.style.color = "#fff";
    panel.style.padding = "10px";
    panel.style.fontFamily = "monospace";
    panel.style.fontSize = "12px";
    panel.style.border = "1px solid #4caf50";
    panel.style.zIndex = "9998";

    const head = rows.length
      ? rows.slice(-3).map((r) => `${r.request_id}: ${r.status}`).join("\n")
      : "Sin solicitudes GDPR registradas";

    panel.innerText = `Panel GDPR\n${head}`;
    container.appendChild(panel);

    setTimeout(() => panel.remove(), 6000);
  }
}
