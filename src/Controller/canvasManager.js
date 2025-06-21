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

export class CanvasManager {
    constructor(canvasId, imageList) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.lyric = "";
        this.x = 100;
        this.y = 100;
        this.images = imageList;
        this.currentImage = null;
        this.loadRandomImage();
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

    draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.currentImage) {
        this.ctx.drawImage(this.currentImage, this.x, this.y, 100, 100);
    }
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px sans-serif";
    this.ctx.fillText(this.lyric, 100, 50);
    }
}