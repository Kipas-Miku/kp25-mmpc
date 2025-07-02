// Vocastar Class
export class Vocastar {
    constructor(p, data, x, y, size = 200) {
        this.p = p;
        this.data = data;
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = null;
        this.loaded = false;

        // Adjustable Variable  

        this.loadImage();
    }

    async loadImage() {
        try {
        const img = await this.p.loadImage(this.data.image);
        this.image = img;
        this.loaded = true;
        } catch (err) {
        console.error("Error loading star image:", err);
        }
    }

    draw() {
        if (!this.loaded) return;
        const swing = Math.sin(this.p.frameCount * 0.05) * 0.2;

        this.p.push();
        this.p.imageMode(this.p.CENTER);
        this.p.translate(this.x, this.y);
        this.p.rotate(swing);
        this.p.image(this.image, 0, 0, this.size, this.size);
        this.p.pop();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    isClicked(mx, my) {
        return this.p.dist(mx, my, this.x, this.y) < this.size / 2;
    }
}