// Not in use

export default function(p) {
    p.setup = function() {
        p.createCanvas(800,600).parent('lyricsCanvas');
        p.background(0);
    }

    p.draw = function() {
        p.fill(255);
        p.ellipse(p.width / 2, p.height / 2, 50, 50);
  };
}