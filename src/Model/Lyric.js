export class Lyric {
  constructor(p, phrase) {
    this.p = p;
    this.phrase = phrase;
    this.chars = [];
    this.alpha = 0;
    this.isFadingOut = false;
    this.isDead = false;
    this.fadeSpeed = 5;

    let char = phrase.firstChar;
    while (char) {
      this.chars.push({
        text: char.text,
        startTime: char.startTime,
        endTime: char.endTime,
        visible: false,
        alpha: 0
      });
      if(char==phrase.lastChar){
        break;
      }else{
        char = char.next;
      }
    }
  }

   update(position) {
    const now = this.p.millis();

    if (this.isFadingOut) {
      this.alpha -= this.fadeSpeed;
      if (this.alpha <= 0) {
        this.isDead = true;
      }
    } else {
      if (this.alpha < 255) {
        this.alpha += this.fadeSpeed;
      }
    }


    // Reveal characters one by one based on their start time
    for (let char of this.chars) {
      if (position >= char.startTime) {
        char.visible = true;
        if (char.alpha < 255) {
          char.alpha += 15;
        }
        console.log(char);
      }
    }
  }

  draw() {
    const p = this.p;
    p.push();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(255, this.alpha);

    const centerX = p.width / 2;
    const centerY = p.height / 2;
    const spacing = 36;

    let visibleChars = this.chars.filter(c => c.visible);
    const totalWidth = visibleChars.length * spacing;

    visibleChars.forEach((char, i) => {
      const x = centerX - totalWidth / 2 + i * spacing;
      p.fill(255, char.alpha * (this.alpha / 255));
      p.text(char.text, x, centerY);
    });

    p.pop();
  }

  fadeOut() {
    this.isFadingOut = true;
  }
}