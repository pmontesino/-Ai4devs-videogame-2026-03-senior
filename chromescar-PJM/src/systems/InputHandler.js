import { INPUT_KEYS } from "../data/constants.js";

export default class InputHandler {
  constructor(scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys({
      left: INPUT_KEYS.left,
      right: INPUT_KEYS.right,
      up: INPUT_KEYS.up,
      down: INPUT_KEYS.down,
      shoot: INPUT_KEYS.shoot,
      swapWeapon: INPUT_KEYS.swapWeapon,
      pause: INPUT_KEYS.pause,
      help: INPUT_KEYS.help,
    });
  }

  get movement() {
    return {
      left: this.keys.left.isDown,
      right: this.keys.right.isDown,
      jump: Phaser.Input.Keyboard.JustDown(this.keys.up),
      crouch: this.keys.down.isDown,
    };
  }

  onSwapWeapon(callback) {
    this.scene.input.keyboard.on(`keydown-${INPUT_KEYS.swapWeapon}`, callback);
  }

  onShoot(callback) {
    this.scene.input.keyboard.on(`keydown-${INPUT_KEYS.shoot}`, callback);
  }

  onPause(callback) {
    this.scene.input.keyboard.on(`keydown-${INPUT_KEYS.pause}`, callback);
  }

  onHelp(callback) {
    this.scene.input.keyboard.on(`keydown-${INPUT_KEYS.help}`, (event) => {
      event.preventDefault();
      callback();
    });
  }
}
