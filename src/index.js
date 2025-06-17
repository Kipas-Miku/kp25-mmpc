import { Router } from "./route.js";
import Parallax from "parallax-js";


class Main
{
    constructor() {
        this._router = new Router();

        var scene = document.getElementById('paraBg');
        var parallaxInstance = new Parallax(scene,{
            relativeInput: true,
            invertX: true,
            invertY: true,
        });
    }

}

new Main();