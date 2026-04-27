export default class RightsRequestForm {
  constructor(container) {
    this.container = container;
    this.root = null;
  }

  mount(onSubmit) {
    this.unmount();
    const root = document.createElement("div");
    root.id = "rights-request-form";
    root.style.position = "fixed";
    root.style.top = "50%";
    root.style.left = "50%";
    root.style.transform = "translate(-50%, -50%)";
    root.style.background = "#101010";
    root.style.border = "2px solid #4caf50";
    root.style.padding = "16px";
    root.style.color = "#fff";
    root.style.fontFamily = "monospace";
    root.style.zIndex = "10001";

    root.innerHTML = `
      <h3>Solicitud de derechos GDPR</h3>
      <label>Identificador usuario: <input id="rr-user" value="guest_user"/></label><br><br>
      <label>Tipo:
        <select id="rr-type">
          <option value="access">Acceso</option>
          <option value="rectification">Rectificacion</option>
          <option value="erasure">Supresion</option>
          <option value="restriction">Limitacion</option>
          <option value="objection">Oposicion</option>
          <option value="portability">Portabilidad</option>
        </select>
      </label><br><br>
      <button id="rr-send">Enviar</button>
      <button id="rr-close">Cerrar</button>
    `;

    root.querySelector("#rr-send").addEventListener("click", () => {
      const user = root.querySelector("#rr-user").value;
      const type = root.querySelector("#rr-type").value;
      onSubmit({ user, type });
      this.unmount();
    });
    root.querySelector("#rr-close").addEventListener("click", () => this.unmount());

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
