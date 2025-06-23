export class Lyric {
    constructor(text, x, y) {
        // this.text = data.text;
        // this.startTime = data.startTime;
        // this.endTime = data.endTime;
        // this.duration = data.duration;
        this.text = text;        
        this.x = x;
        this.y = y;
        this.alpha = 0;
        this.fadeInSpeed = 5;
        this.fadeOutSpeed = 4;
        this.maxAlpha = 255;
        this.isFadingOut = false;
        this.isDead = false;
        console.log(this.text);
    }

    update() {
        if (this.isFadingOut) {
            this.alpha -= this.fadeOutSpeed;
            if (this.alpha <= 0) {
                this.alpha = 0;
                this.isDead = true;
            }
        } else {
            if (this.alpha < this.maxAlpha) {
                this.alpha += this.fadeInSpeed;
            }
        }
    }

    draw(p) {
        p.push();
        p.textAlign(p.CENTER);
        p.textSize(48);
        p.fill(255, this.alpha);
        p.text(this.text, this.x, this.y);
        p.pop();
    }

    fadeOut() {
        this.isFadingOut = true;
    }
}