import SceneRouter from "./scenes/SceneRouter.js";
import { GAME_HEIGHT, GAME_WIDTH } from "./data/constants.js";

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game-container",
  backgroundColor: "#000000",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: SceneRouter,
};

// Esperar a que la fuente pixel-art esté disponible antes de inicializar Phaser.
// Sin esto el canvas dibuja el texto antes de que la fuente cargue y usa el fallback.
document.fonts.load('1em "Press Start 2P"').finally(() => {
  window.game = new Phaser.Game(config);
});
