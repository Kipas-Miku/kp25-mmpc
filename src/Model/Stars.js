export class Star {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.r = Math.random() * 3 + 2;
        this.alpha =255;
        this.speed = Math.random() * 1 + 0/5;
    }

    update(){
        this.y -= this.speed;
        this.alpha -= 2;
    }

    show(p){
        p.noStroke();
        p.fill(255, this.alpha);
        p.ellipse(this.x, this.y, this.r);
    }

    isDead(){
        return this.alpha <= 0;
    }
}