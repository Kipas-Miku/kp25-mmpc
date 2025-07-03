import p5 from "p5";
import { Star } from "../Model/Stars";
import { Lyric } from "../Model/Lyric";
import { SceneManager } from "./sceneManager";
import { TransitionManager } from "./transitionManager";

export class CanvasManager {
    constructor(canvasId, player) {
        // Initialization
        this.canvas = document.getElementById(canvasId);
        this.player = player;
        this.topHue = 172;
        this.currentTime = -1
        this.prevY = this.y / 2;
        
        // Declaration
        this.currentLyric = null;
        this.scene = null;
        this.transition = null;
        this.stars = [];
        this.oldLyrics = [];

        // Modular control values
        // Gradient Background
        this.hueSpeed = 0.01;        // how fast hue changes
        this.hueGap = 10;           // difference between top and bottom hue
        this.saturationTop = 80;
        this.brightnessTop = 10;
        this.saturationBottom = 100;
        this.brightnessBottom = 8;
        
        // Canvas Size
        this.x = window.innerWidth;
        this.y = window.innerHeight;

        // Initializing Canvas
        this.p = new p5((sketch) => this.sketch(sketch));
        
    }

    // main p5 initializer
    sketch(p) {
        this.p = p;

        p.setup = () => {
            p.createCanvas(this.x, this.y,this.canvas);
            this.scene = new SceneManager(p);

            this.transition = new TransitionManager(p, this.scene);

            p.textFont('Press+Start+2P')
        };

        p.draw = () => {
            p.clear();
            this.gradBg(p);

            // Star animation - Keep
            for (let i = this.stars.length - 1; i >= 0; i--) {
                const s = this.stars[i];
                s.update();
                s.show(p);
                if (s.isDead()) this.stars.splice(i, 1);
            }

            if(!this.scene){
                this.scene.draw();
            }
            
            if (this.currentLyric) {
                this.currentLyric.update(this.currentTime);
                this.currentLyric.draw();
            }

            // Draw and clean up old lyrics
            this.oldLyrics = this.oldLyrics.filter(lyric => {
                lyric.update(this.currentTime);
                lyric.draw();
            return !lyric.isDead;
            });

            this.transition.updateAndDraw();
        };

        p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
            this.scene.resize();
        };

        p.mousePressed = () => {
            let status = false;
            let response = this.scene.clickHandler(p.mouseX, p.mouseY);
            if(response) status = response.status;
            if (this.scene && this.scene.loaded && status) {
                const fact = response.data;
                console.log("⭐ Star clicked!");
                console.log(`💡 ${fact.name} (${fact.type}): ${fact.fact}`);
            }
        }

        p.keyPressed = () => {
            const keyMap = {
                ArrowLeft: 'left',
                ArrowRight: 'right',
                ArrowUp: 'up',
                ArrowDown: 'down',
            };
            const direction = keyMap[p.key];
            if (direction && !this.scene.isTransitioning) {
                console.log(direction);
                this.transition.startTransition(direction);
            }
        };

        p.easeInOutCubic = function(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
    }

    updateTime(position){
        this.currentTime=position;
    }
    updateLyrics(phrase) {
        if (this.currentLyric) {
            this.currentLyric.fadeOut();
            this.oldLyrics.push(this.currentLyric);
        }
        this.currentLyric = new Lyric(this.p, phrase);
    }

    // BACKDROP FUNCTION - Need work on
    gradBg(p){
       // Update top hue if playing
        if (this.player.isPlaying) {
            // this.topHue = (p.frameCount * this.hueSpeed) % 360;
            this.topHue = Math.abs((Math.sin(p.frameCount * this.hueSpeed)*51)+223) ;
        }

        const bottomHue = (this.topHue + this.hueGap) % 360;

        const topColor = p.color(`hsb(${this.topHue}, ${this.saturationTop}%, ${this.brightnessTop}%)`);
        const bottomColor = p.color(`hsb(${bottomHue}, ${this.saturationBottom}%, ${this.brightnessBottom}%)`);

        for (let y = 0; y < p.height; y++) {
            const inter = y / p.height;
            const c = p.lerpColor(topColor, bottomColor, inter);
            p.stroke(c);
            p.line(0, y, p.width, y);
        }
    }

    // BEATSTAR - Just Fine
    triggerBeat() {
        this.stars.push(new Star(this.p.random(this.p.width), this.p.random(this.p.height))); 
    }


    destroy() {
        if (this.p) {
            this.p.remove(); // Properly destroys the canvas and stops draw loop
            this.p = null;
        }
    }

}
