export default class CompatibilityFallbacks {
  static detect() {
    return {
      cookiesEnabled: navigator.cookieEnabled,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      webAudio: !!window.AudioContext || !!window.webkitAudioContext,
    };
  }

  static apply(scene) {
    const capabilities = CompatibilityFallbacks.detect();

    if (!capabilities.cookiesEnabled) {
      scene.registry.set("saveWarning", "Cookies deshabilitadas: progreso no persistente");
    }

    if (!capabilities.webAudio) {
      scene.registry.set("audioWarning", "Audio no disponible en este navegador");
    }
  }
}
