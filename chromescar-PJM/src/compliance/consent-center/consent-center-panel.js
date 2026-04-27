export default class ConsentCenterPanel {
  constructor(container) {
    this.container = container;
    this.root = null;
  }

  mount({ purposes, onSave }) {
    this.unmount();
    const root = document.createElement("div");
    root.id = "consent-center-panel";
    root.style.position = "fixed";
    root.style.top = "50%";
    root.style.left = "50%";
    root.style.transform = "translate(-50%, -50%)";
    root.style.width = "min(720px, 92vw)";
    root.style.maxHeight = "80vh";
    root.style.overflow = "auto";
    root.style.background = "#111";
    root.style.color = "#fff";
    root.style.border = "2px solid #f39c12";
    root.style.padding = "16px";
    root.style.zIndex = "10000";
    root.style.fontFamily = "monospace";

    root.innerHTML = `<h3>Centro de preferencias de privacidad</h3>`;

    purposes.forEach((purpose) => {
      const row = document.createElement("div");
      row.style.marginBottom = "8px";
      row.innerHTML = `
        <strong>${purpose.name}</strong> (${purpose.essential_flag ? "esencial" : "no esencial"})<br>
        <label><input type="radio" name="${purpose.processing_purpose_id}" value="granted" ${purpose.essential_flag ? "checked disabled" : ""}> Aceptar</label>
        <label style="margin-left:12px;"><input type="radio" name="${purpose.processing_purpose_id}" value="denied" ${purpose.essential_flag ? "disabled" : ""}> Rechazar</label>
      `;
      root.appendChild(row);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Guardar preferencias";
    saveButton.addEventListener("click", () => {
      const updates = purposes.map((purpose) => {
        if (purpose.essential_flag) {
          return { purposeId: purpose.processing_purpose_id, consentState: "granted" };
        }
        const checked = root.querySelector(`input[name='${purpose.processing_purpose_id}']:checked`);
        return { purposeId: purpose.processing_purpose_id, consentState: checked?.value || "denied" };
      });
      onSave(updates);
      this.unmount();
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "Cerrar";
    closeButton.style.marginLeft = "8px";
    closeButton.addEventListener("click", () => this.unmount());

    root.appendChild(saveButton);
    root.appendChild(closeButton);
    this.container.appendChild(root);
    this.root = root;
  }

  unmount() {
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }
}
