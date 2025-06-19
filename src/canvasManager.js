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