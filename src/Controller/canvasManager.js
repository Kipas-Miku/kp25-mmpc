/* ToDo
- Increase the resolution
- Add the blinking stars
    + Randomize the size and the durantion
    Add a colour transition to make it nice
- Add a smooth transformation movement
- Add a create and delete module for the class
    + Create a json file of all the info
    + Create a randomize set of item in a scene
    + Add an onClick event that will reveal a info on a constellation
- Add an initail blur effect for the player
- Display the lyrics on line at a time
 */

import p5 from "p5";

export class CanvasManager {
    constructor(canvasId, imageList = []) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.images = imageList;
        this.currentImage = null;
        this.lyric = "";
        this.x = 1920;
        this.y = 1080;
        this.stars = [];
        // this.loadRandomImage();

        this.p = new p5((sketch) => this.sketch(sketch));
    }

    sketch(p) {
        this.p = p;
        p.preload = () => {
            this.imageElements = this.images.map((url) => p.loadImage(url));
        };

            p.setup = () => {
      p.createCanvas(1280, 720).parent("canvas-container");
      this.loadRandomImage();
    };

    p.draw = () => {
      p.clear();
      p.background(0);

      // Draw random image
      if (this.currentImage) {
        p.image(this.currentImage, this.x, this.y, 100, 100);
      }

      // Lyrics text
      if (this.lyric) {
        let fontSize = p.map(p.sin(p.frameCount * 0.1), -1, 1, 24, 36);
        let hue = p.frameCount % 360;
        p.colorMode(p.HSB);
        p.textSize(fontSize);
        p.fill(hue, 255, 255);
        p.textAlign(p.LEFT);
        p.text(this.lyric, 100, 50);
        p.colorMode(p.RGB);
      }

      // Star animation
      for (let i = this.stars.length - 1; i >= 0; i--) {
        const s = this.stars[i];
        s.update();
        s.show(p);
        if (s.isDead()) this.stars.splice(i, 1);
      }
    };

    }

    setLyrics(lyrics) {
        this._lyrics = lyrics;
    }

    loadRandomImage() {
        const url = this.images[Math.floor(Math.random() * this.images.length)];
        const img = new Image();
        img.onload = () => {
            this.currentImage = img;
            this.draw();
        };
        img.src = url;
    }

    updateLyric(text) {
        console.log(text);
        this.lyric = text;
        this.draw();
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.draw();
    
    }

}