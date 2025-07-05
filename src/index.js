// Later for optimization
// import { UIManager } from "./Controller/uiManager";
// import { MenuUI  } from "./View/menuUI";


import { Router } from "./Controller/routerManager";
import Parallax from "parallax-js";


class Main {
    constructor() {
        this._router = new Router();
        // const uiManager = new UIManager();
        // uiManager.show(MenuUI, {
        // onSelectSong: () => {
        //     console.log("Go to Song List");
        //     // uiManager.show(SongSelectorUI);
        // },
        // onCredit: () => {
        //     console.log("Go to Credit");
        //     // uiManager.show(CreditUI);
        // },
        // onExit: () => {
        //     console.log("Exiting Game");
        // },
        // onSetting: () => {
        //     console.log("Go to Settings");
        // }
        // });
        var scene = document.getElementById('paraBg');
        new Parallax(scene, {
            relativeInput: true,
            clipRelativeInput: false,
            hoverOnly: false,
        });

    }

}

new Main();