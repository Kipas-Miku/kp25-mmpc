// Vocaloid Class
export class Vocaloid {
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
      console.error("Error loading vocaloid image:", err);
    }
  }

  draw() {
    if (!this.loaded) return;
    const float = Math.cos(this.p.frameCount * 0.03) * 10;

    this.p.push();
    this.p.imageMode(this.p.CENTER);
    this.p.translate(this.x, this.y + float);
    this.p.image(this.image, 0, 0, this.size, this.size);
    this.p.pop();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
