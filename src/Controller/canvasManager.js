import p5 from "p5";
import { Star } from "../Model/Stars";
import { Lyric } from "../Model/Lyric";
import { SceneManager } from "./sceneManager";

export class CanvasManager {
    constructor(canvasId, player) {
        this.canvas = document.getElementById(canvasId);
        this.player = player;
        
        this.currentLyric = null;
        this.oldLyrics = [];
        
        this.scene = null;
        this.currentTime = -1
        
        this.stars = [];
        this.p = new p5((sketch) => this.sketch(sketch));
        
        // this.currentScene = new Scene()
        this.currentImage = null;
        this.x = window.innerWidth;
        this.y = window.innerHeight;
        this.prevY = this.y / 2;
    }

    // main p5 initializer
    sketch(p) {
        this.p = p;

        p.setup = () => {
            p.createCanvas(this.x, this.y,this.canvas);
            this.scene = new SceneManager(p);

            p.textFont('Press+Start+2P')
        };

        p.draw = () => {
            p.clear();
            this.gradBg(p, this.player);

            // Star animation - Keep
            for (let i = this.stars.length - 1; i >= 0; i--) {
                const s = this.stars[i];
                s.update();
                s.show(p);
                if (s.isDead()) this.stars.splice(i, 1);
            }

            if(this.scene){
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

        };

        p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
        };

        p.mousePressed = () => {
            let response = this.scene.clickHandler(p.mouseX, p.mouseY);
            if (this.scene && this.scene.loaded && response.status) {
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
            if (direction) {
                console.log(direction);
                this.sceneManager.triggerTransition(direction);
            }
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
        console.log(phrase)
        this.currentLyric = new Lyric(this.p, phrase);
    }

    // BACKDROP FUNCTION - Need work on
    gradBg(p){
        if(this.player.isPlaying){
            
            const topHue = (p.frameCount * 0.1) %360;
            const bottomHue = (topHue + 60) %360;

            const topColor = p.color(`hsb(${topHue},80%,10%)`);
            const bottomColor = p.color(`hsb(${bottomHue},90%,5%)`);
    
            for(let y=0; y < p.height;y++) {
                const inter = y /p.height;
                const c = p.lerpColor(topColor,bottomColor,inter);
                p.stroke(c);
                p.line(0,y,p.width,y);
            }
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
// document.getElementById("moveLeft").onclick = () => this.canvasMan.move(-10, 0);
// document.getElementById("moveRight").onclick = () => this.canvasMan.move(10, 0);
// document.getElementById("moveUp").onclick = () => this.canvasMan.move(0, -10);
// document.getElementById("moveDown").onclick = () => this.canvasMan.move(0, 10);
