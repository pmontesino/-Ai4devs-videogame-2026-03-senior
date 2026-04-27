export default class AITransparencyNotice {
  static show(container, item) {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.left = "16px";
    el.style.top = "16px";
    el.style.padding = "8px 12px";
    el.style.background = "rgba(33,33,33,0.92)";
    el.style.color = "#fff";
    el.style.fontFamily = "monospace";
    el.style.fontSize = "12px";
    el.style.border = "1px solid #29b6f6";
    el.style.zIndex = "9997";
    el.textContent = `Aviso IA: ${item.feature_name} (${item.purpose})`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 5500);
  }
}
