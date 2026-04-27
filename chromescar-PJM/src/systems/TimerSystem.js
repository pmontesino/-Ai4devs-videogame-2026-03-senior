export default class TimerSystem {
  constructor(scene, seconds, onTimeout) {
    this.scene = scene;
    this.remaining = seconds;
    this.onTimeout = onTimeout;
    this.isPaused = false;

    this.event = scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.isPaused) {
          return;
        }

        this.remaining -= 1;
        scene.registry.set("timer", this.remaining);

        if (this.remaining <= 0) {
          this.remaining = 0;
          this.event.remove(false);
          this.onTimeout();
        }
      },
    });

    scene.registry.set("timer", this.remaining);
  }

  setPaused(value) {
    this.isPaused = value;
  }

  reset(seconds) {
    this.remaining = seconds;
    this.scene.registry.set("timer", this.remaining);
  }
}
