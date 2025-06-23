// UIManager.js
export class UIManager {
  constructor(root = document.body) {
    this.root = root;
    this.currentUI = null;
  }

  show(componentClass, props = {}) {
    this.clear();
    this.currentUI = new componentClass(this.root, props);
  }

  clear() {
    if (this.currentUI?.destroy) {
      this.currentUI.destroy();
    }
    this.currentUI = null;
  }
}
