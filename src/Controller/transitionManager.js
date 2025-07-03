import { SceneManager } from "./sceneManager";

export class TransitionManager {
  constructor(p, currentScene) {
    this.p = p;
    this.currentScene = currentScene;
    this.nextScene = null;
    this.transitioning = false;
    this.direction = null;
    this.progress = 0;
    this.duration = 60;
  }

  startTransition(direction) {
    if (this.transitioning) return;

    this.direction = direction;
    this.transitioning = true;
    this.progress = 0;

    this.nextScene = new SceneManager(this.p);
    // this.nextScene.loadAssets();

  }

  updateAndDraw() {
    const p = this.p;

    if (this.transitioning) {
      const t = this.progress / this.duration;
      const ease = this.easeInOut(t);
      const offset = this.calculateOffset(ease);

      p.push();
      p.translate(offset.old.x, offset.old.y);
      this.currentScene.draw();
      p.pop();

      p.push();
      p.translate(offset.new.x, offset.new.y);
      this.nextScene.draw();
      p.pop();

      this.progress++;
      if (this.progress >= this.duration) {
        this.currentScene = this.nextScene;
        this.nextScene = null;
        this.transitioning = false;
      }
    } else {
      this.currentScene.draw();
    }
  }

  calculateOffset(t) {
    const w = this.p.width;
    const h = this.p.height;
    let offset = { old: { x: 0, y: 0 }, new: { x: 0, y: 0 } };

    switch (this.direction) {
      case 'left':
        offset.old.x = -w * t;
        offset.new.x = w - w * t;
        break;
      case 'right':
        offset.old.x = w * t;
        offset.new.x = -w + w * t;
        break;
      case 'up':
        offset.old.y = -h * t;
        offset.new.y = h - h * t;
        break;
      case 'down':
        offset.old.y = h * t;
        offset.new.y = -h + h * t;
        break;
    }

    return offset;
  }

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }
}
