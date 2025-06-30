export class Lyric {
  constructor(p, phrase,  prevY) {
    this.p = p;
    this.phrase = phrase;
    this.chars = [];
    this.alpha = 0;
    this.isFadingOut = false;
    this.isDead = false;
    this.fadeSpeed = 5;

    const baseY = p.height / 2;
    let newY;
    const minDistance = 100;

    do {
      newY = baseY + p.random(-200,200)
    } while (Math.abs(newY - prevY) < minDistance);

    this.y = newY;

    let char = phrase.firstChar;
    while (char) {
      const word = char.parent;

      this.chars.push({
        text: char.text,
        startTime: char.startTime,
        endTime: char.endTime,
        visible: false,
        alpha: 0,
        pos: word.pos,
        isLastInPhrase: phrase.lastChar === char,
        isLastInWord: word.lastChar === char,
        isFirstInWord: word.firstChar === char,
        isEnglish: word.language === "en"
      });
      if (char == phrase.lastChar) {
        break;
      } else {
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
      }
    }
  }

  draw() {
    const p = this.p;
    p.push();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(48);
    p.fill(255, this.alpha);
    p.textFont("Noto Sans JP")

    const centerX = p.width / 2;
    const spacing = 45;
    
    let visibleChars = this.chars.filter(c => c.visible);
    const totalWidth = visibleChars.length * spacing;
    let currentX = centerX - totalWidth / 2;

    visibleChars.forEach((char, i) => {
      // const x = centerX - totalWidth / 2 + i * spacing;
      p.fill(255, char.alpha * (this.alpha / 255));
      p.text(char.text, currentX, this.y);

      currentX += spacing;

      if (
        char.pos === "N" ||    // Noun
        char.pos === "PN" ||   // Pronoun
        char.pos === "X"       // Other symbol-like words
      ) {
        currentX += spacing * 0.5;  // Add extra gap after these POS
      }

      // Also optionally: add a tiny space after English words
      if (char.isEnglish && char.isLastInWord) {
        currentX += spacing * 0.3;
      }
    });

    p.pop();
  }

  fadeOut() {
    this.isFadingOut = true;
  }
}