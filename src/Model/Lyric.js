export class Lyric {
  constructor(data, centerX, centerY) {
    this.text = data.text;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.duration = this.endTime - this.startTime;
    this.position = data.position;

    this.x = centerX;
    this.y = centerY;
    this.alpha = 0;
    this.state = "fadeIn"; // fadeIn → stay → fadeOut
    this.fadeInSpeed = 0.05;
    this.fadeOutSpeed = 0.05;
    this.isDead = false;
  }

  update(currentTime) {
    if (currentTime < this.startTime) {
      this.alpha = 0;
      return;
    }

    if (currentTime >= this.startTime && currentTime < this.endTime) {
      if (this.alpha < 1) {
        this.alpha += this.fadeInSpeed;
      } else {
        this.alpha = 1;
      }
    }

    if (currentTime >= this.endTime) {
      this.alpha -= this.fadeOutSpeed;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this.isDead = true;
      }
    }
  }

  draw(p) {
    if (!this.text) return;
    p.push();
    p.textAlign(p.CENTER);
    p.textSize(48);
    p.fill(255, this.alpha * 255);
    p.text(this.text, this.x, this.y);
    p.pop();
  }
}
