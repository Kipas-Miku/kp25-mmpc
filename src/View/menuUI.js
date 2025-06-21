// MenuUI.js
export class MenuUI {
  constructor(root = document.body, callbacks = {}) {
    this.root = root;
    this.callbacks = callbacks;
    this.menuElement = null;
    this.bgElement = null;
    this.render();
  }

  render() {
    // Main Menu
    const menuElement = document.createElement("div");
    menuElement.className = "gameMenu";
    menuElement.innerHTML = `
      <h1>Star Gazing Procon</h1>
      <ul class="list-group">
        <li class="list-group-item" id="toSong">Song Selection</li>
        <li class="list-group-item" id="toSetting">Setting</li>
        <li class="list-group-item" id="toCredit">Credit</li>
        <li class="list-group-item" id="toExit">Exit</li>
      </ul>
    `;

    // Parallax Background
    const bgElement = document.createElement("div");
    bgElement.id = "paraBg";
    bgElement.innerHTML = `
      <div data-depth="0.1" class="layer stars"></div>
      <div data-depth="0.5" class="layer clouds"></div>
      <div data-depth="0.3" class="layer mountains"></div>
      <div data-depth="0.8" class="layer tower"></div>
    `;

    this.root.appendChild(menuElement);
    this.root.appendChild(bgElement);

    this.attachListeners();
  }

  attachListeners(){
    const{ onSongSelect, onCredit, onExit, onSetting} = this.callbacks;
    this.menuElement.querySelector("#toSong")?.addEventListener("click", () => onSelectSong?.());
    this.menuElement.querySelector("#toCredit")?.addEventListener("click", () => onCredit?.());
    this.menuElement.querySelector("#toExit")?.addEventListener("click", () => onExit?.());
    this.menuElement.querySelector("#toSetting")?.addEventListener("click", () => onSetting?.());
  }

  destroy(){
    this.menuElement?.remove();
    this.bgElement?.remove();
  }
}
