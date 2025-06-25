class SpaceScene {
  constructor(p, assets) {
    this.p = p;
    this.assets = assets; // {planets: [...], stars: [...]}
    this.images = [];
    this.generate();
  }

  generate() {
    const center = this.p.createVector(this.p.width / 2, this.p.height / 2);
    const centerImg = this.randomImage(this.assets.planets);
    this.images.push({
      img: centerImg,
      pos: center,
      size: 100,
      clickable: true
    });

    for (let i = 0; i < 3; i++) {
      const angle = this.p.random(this.p.TWO_PI);
      const dist = this.p.random(120, 200);
      const x = center.x + this.p.cos(angle) * dist;
      const y = center.y + this.p.sin(angle) * dist;
      const img = this.randomImage(this.assets.stars);
      this.images.push({ img, pos: this.p.createVector(x, y), size: 60, clickable: false });
    }
  }

  randomImage(list) {
    const entry = list[Math.floor(Math.random() * list.length)];
    const img = this.p.loadImage(entry.image); // must preload
    return { img, meta: entry };
  }

  draw() {
    for (const item of this.images) {
      this.p.imageMode(this.p.CENTER);
      this.p.image(item.img.img, item.pos.x, item.pos.y, item.size, item.size);
    }
  }

  getClickableAt(x, y) {
    return this.images.find(
      i =>
        i.clickable &&
        this.p.dist(i.pos.x, i.pos.y, x, y) < i.size / 2
    );
  }
}
