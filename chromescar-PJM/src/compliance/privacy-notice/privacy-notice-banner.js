export default class PrivacyNoticeBanner {
  constructor(container, content) {
    this.container = container;
    this.content = content;
  }

  render(onOpenCenter) {
    const root = document.createElement("div");
    root.id = "privacy-notice-banner";
    root.style.position = "fixed";
    root.style.left = "16px";
    root.style.right = "16px";
    root.style.bottom = "16px";
    root.style.padding = "12px 16px";
    root.style.background = "rgba(0,0,0,0.9)";
    root.style.color = "#fff";
    root.style.fontFamily = "monospace";
    root.style.zIndex = "9999";
    root.style.border = "2px solid #f39c12";

    root.innerHTML = `
      <strong>Aviso de privacidad</strong>
      <div style="margin:8px 0;">${this.content}</div>
      <button id="open-privacy-center" style="font-family:monospace;">Configurar preferencias</button>
    `;

    root.querySelector("#open-privacy-center").addEventListener("click", onOpenCenter);
    this.container.appendChild(root);
    return root;
  }
}
