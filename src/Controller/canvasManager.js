/* ToDo
- Increase the resolution /
- Add the blinking stars /
    + Randomize the size and the durantion /
    Add a colour transition to make it nice
- Add a smooth transformation movement
- Add a create and delete module for the class
    + Create a json file of all the info
    + Create a randomize set of item in a scene
    + Add an onClick event that will reveal a info on a constellation
- Add an initail blur effect for the player
- Display the lyrics on line at a time
- 
 */

import p5 from "p5";
import { Star } from "../Model/Stars";
import { Lyric } from "../Model/Lyric";
import { Player } from "textalive-app-api";

export class CanvasManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        // this.images = imageList;
        this.currentImage = null;
        this.x = 1920;
        this.y = 1080;
        this.stars = [];
        // this.currentLyric = null;
        // this.lyrics = [];
        this.activeLyric = null;

        this.p = new p5((sketch) => this.sketch(sketch));
    }

    // main class initializer
    sketch(p) {
        this.p = p;

        p.setup = () => {
            p.createCanvas(1280, 720,this.canvas);
            // this.loadImages().then(()=> {
            //     this.loadRandomImage();
            // })
        };

        p.draw = () => {
            p.clear();
            this.gradBg(p);

            // Draw random image
            if (this.currentImage) {
                p.image(this.currentImage, this.x, this.y, 100, 100);
            }

            // Fade in current lyric
            // if (this.currentLyric) {
            //     if (this.lyricAlpha < 255) this.lyricAlpha += 5;

            //     this.p.fill(255, this.lyricAlpha);
            //     this.p.textAlign(this.p.CENTER);
            //     this.p.textSize(48);
            //     this.p.text(this.currentLyric, this.lyricPos.x, this.lyricPos.y);
            // }

            // for (let i = this.lyrics.length - 1; i >= 0; i--) {
            //     const lyric = this.lyrics[i];
            //     lyric.update();
            //     lyric.draw(this.p);

            //     if (lyric.isDead) this.lyrics.splice(i, 1);
            // }

            if (this.activeLyric) {
            this.activeLyric.update(Player.currentTime); // Pass player time
            this.activeLyric.draw(this.p);

            if (this.activeLyric.isDead) {
                this.activeLyric = null;
            }
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


    // LYRICS METHODS
    setLyrics(data) {
        const centerX = this.p.width / 2;
        const centerY = this.p.height / 2;

        // Only switch if it's a new line
        if (!this.activeLyric || this.activeLyric.text !== data.text) {
            this.activeLyric = new Lyric(data, centerX, centerY);
        }
    }

    updateLyric(text) {
        this.lyrics.forEach(lyric => lyric.fadeOut());
        const jitter = () => this.p.random(-50, 50);
        const x = this.p.width / 2 + jitter();
        const y = this.p.height / 2 + jitter();

        this.lyrics.push(new Lyric(text, x, y));
    }

    // EXPLORE FUNCTION
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.p._draw();
    }

    // BACKDROP FUNCTION
    gradBg(p){
        const topHue = (p.frameCount * 0.1) %360;
        const bottomHue = (topHue + 60) %360;

        const topColor = p.color(`hsb(${topHue},80%,10%)`);
        const bottomColor = p.color(`hsb(${bottomHue},90%,5%)`);

        for(let y=0; y < p.height;y++) {
            const inter = y /p.height;
            const c = p.lerpColor(topColor,bottomColor,inter);
            p.stroke(c);
            p.line(0,y,p.width,y);
        }
    }

    // STAR
    triggerBeat() {
        this.stars.push(new Star(this.p.random(this.p.width), this.p.random(this.p.height))); 
    }
    // IMAGES
    // async loadImages(){
    //     const promises = this.images.map(
    //         (url) =>
    //             new Promise((resolve) => {
    //                 this.p.loadImage(url, (img) =>resolve(img));
    //             })
    //     );
    //     this.imageElements = await Promise.all(promises);
    // }
    
    // loadRandomImage() {
    //     const url = this.images[Math.floor(Math.random() * this.images.length)];
    //     const img = new Image();
    //     img.onload = () => {
    //         this.currentImage = img;
    //         this.draw();
    //     };
    //     img.src = url;
    // }

    destroy() {
        if (this.p) {
            this.p.remove(); // Properly destroys the canvas and stops draw loop
            this.p = null;
        }
    }

}