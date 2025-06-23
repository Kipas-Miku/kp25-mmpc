/* TODO
- Seperate the TextAlive API APP as its own Class file
- Add A lyric log and activity log
- Create window overlay for the app to make it more astrology like app


- Optional
    + Add a setting to set which kind of fact or space body to see
*/ 

import { Player,stringToDataUrl } from "textalive-app-api";
import { CanvasManager } from "./canvasManager";

const API_TOKEN = import.meta.env.VITE_TEXTALIVE_API_TOKEN;

const volEl = document.getElementById("volSlider");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const lyricEl = document.getElementById('lyricsCanvas');
const viewEl = document.getElementById('view');
const seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
const bar = document.querySelector("#bar");

let lastTime = -1;

export class PlayerManager 
{
    constructor(song){
        this._player = new Player({
            app:{
                token: API_TOKEN,
                parameters: [
                {
                    title: "フォントサイズ",
                    name: "fontSize",
                    className: "Slider",
                    params: [0, 100],
                    initialValue: 70,
                },
                {
                    title: "テキスト色",
                    name: "color",
                    className: "Color",
                    initialValue: { r: 31, g: 67, b: 145 },
                    // initialValue: "#1f4391" // 文字列でも動作します
                },
                {
                    title: "ダークモード",
                    name: "darkMode",
                    className: "Check",
                    initialValue: false,
                },
                {
                    title: "フォントのスタイル",
                    name: "fontStyle",
                    className: "Select",
                    params: [
                    ["sans-serif", "サンセリフ (ゴシック体)"],
                    ["serif", "セリフ (明朝体)"],
                    ],
                    initialValue: "sans-serif",
                },
                ],   
            },
            mediaElement:document.getElementById("media")
        });
        this.canvasMan = new CanvasManager("lyricsCanvas",[
            "assets/planet.jpeg",
        ]);
        this.lastBeatIndex = -1;
        document.getElementById("loading").style.display = "flex";

        this._player.createFromSongUrl(song.songUrl,{video : song.video})

        this._player.addListener({
            onAppReady  : (app) => this._onAppReady(app),
            onVideoReady: (v) => this._onVideoReady(v),
            onPlay : () => this._onPlay(),
            onPause: () => this._onPause(),
            onStop : () => this._onStop(),
            onMediaSeek : (pos) => this._onMediaSeek(pos),
            onTimeUpdate: (pos) => this._onTimeUpdate(pos),
            onThrottledTimeUpdate: (pos) => this._onThrottledTimeUpdate(pos),
            onAppParameterUpdate: (name, value) => this._onAppParameterUpdate(name, value),
            onAppMediaChange: (url) => this._onAppMediaChange(url),
            onVolumeUpdate: (volume) => this._onVolumeUpdate(volume),
        })
        // volEl.addEventListener('input',(event)=>{
        //     this._player.volume(23);
        // })
    }

    _onAppReady(app)
    {
        // console.log("app:", app);
        
        if (! app.managed)
        {
            
            document.getElementById("control").style.display = "block";
            document.getElementById("bt_play")  .addEventListener("click", () => this._player.requestPlay());
            document.getElementById("bt_pause") .addEventListener("click", () => this._player.requestPause());
            document.getElementById("bt_rewind").addEventListener("click", () => this._player.requestStop());
            // volEl.value = this._player.volume;
        }
        if (! app.songUrl)
        {
      
        }
    }

    _onVideoReady (v)
    {
        document.getElementById("loading").style.display = "none";
        const song = this._player.data.song;
        titleEl.innerHTML = `<span class='fs-6'>Observation </span>- ${song.name}`;
        artistEl.innerHTML = `${song.artist.name}`;

        document.getElementById("moveLeft").onclick = () => this.canvasMan.move(-10, 0);
        document.getElementById("moveRight").onclick = () => this.canvasMan.move(10, 0);
        document.getElementById("moveUp").onclick = () => this.canvasMan.move(0, -10);
        document.getElementById("moveDown").onclick = () => this.canvasMan.move(0, 10);
        document.addEventListener("keydown", (e) => {
              switch (e.code) {
                case "ArrowUp":
                case "KeyW":
                    console.log("Move Up");
                    this.canvasMan.move(0, -10);
                    break;
                case "ArrowDown":
                case "KeyS":
                    console.log("Move Down");
                    this.canvasMan.move(0, 10);
                    break;
                case "ArrowLeft":
                case "KeyA":
                    console.log("Move Left");
                    this.canvasMan.move(-10, 0);
                    break;
                case "ArrowRight":
                case "KeyD":
                    console.log("Move Right");  
                    this.canvasMan.move(10, 0);
                    break;
                case "Space":
                    console.log("Pause or Jump");
                    if (this._player.isPlaying){
                        this._player.requestPause()
                    }else{
                        this._player.requestPlay()
                    }
                    break;
                case "Escape":
                    console.log("Cancel or Exit");
                    break;
            }
            console.log("Key pressed:", e.key);       // Human-readable name, e.g., "a", "Enter"
            console.log("Key code:", e.code);         // Physical key on keyboard, e.g., "KeyA", "Enter"
            console.log("Is Ctrl pressed?", e.ctrlKey);
        });
    }

    _controlChange (playing)
    {
        if (playing)
        {
            document.getElementById("bt_play") .style.display = "none";
            document.getElementById("bt_pause").style.display = "inline";
        }
        else
        {
            document.getElementById("bt_play") .style.display = "inline";
            document.getElementById("bt_pause").style.display = "none";
        }
    }

    _onPlay ()
    {
        this._controlChange(true);
        // console.log("play");
    }
    _onPause ()
    {
        this._controlChange(false);
        // console.log("pause");
    }
    _onStop ()
    {
        this._controlChange(false);
        if (this_player) {
            bar.className = "";
        }
        // console.log("stop");
    }
    _onMediaSeek (position)
    {
        // console.log("seek", position);
    }
    _onTimeUpdate (position)
    {
        // Seekbar
        paintedSeekbar.style.width = `${
            parseInt((position * 1000) / this._player.video.duration) / 10
        }%`;

        seekbar.addEventListener("click", (e) => {
            e.preventDefault();
            if (this._player) {
                this._player.requestMediaSeek(
                (this._player.video.duration * e.offsetX) / seekbar.clientWidth
                );
            }
            e.preventDefault();
        if (this._player) {
            this._player.requestMediaSeek(
            (this._player.video.duration * e.offsetX) / seekbar.clientWidth
            );
        }
            return false;
        });

        // Beat bar
        const beats = this._player.findBeatChange(lastTime, position);
        if(
            lastTime >= 0 &&
            beats.entered.length
        ) {
            requestAnimationFrame(() => {
                bar.className = "active";
                requestAnimationFrame(() => {
                    bar.className = "active beat";
                })
                this.spawnStar();
            })
            // for (let i = this.lastTime + 1; 1< beats.length; i++) {
            //     this.lastTime = 1;
            // }
        }

        // Lyrics Generation
        const char = this._player.video.findChar(position);
        if (char && char.parent) {
            // console.log(char.parent.text);
            this.canvasMan.updateLyric(char.parent.text);
            // lyricEl.innerHTML = `<h2>${char.parent.text}</h2>`;
        }

        lastTime = position;

    }
    _onThrottledTimeUpdate (position)
    {

    }
    _onAppMediaChange (url)
    {
        this._player.requestMediaSeek(0);
        this._player.requestPause();
        const bar = document.querySelector("#bar");
    }

    _onVolumeUpdate(volume){
        console.log(volume);
    }
       
    destroy(){
        this._player.dispose();
    }


    // Insert this in the canvas manager

    spawnStar() {
        console.log("start")
        const star = document.createElement("div");
        
        star.position = "absolute";
        star.className = "star";
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${Math.random() * window.innerHeight}px`;
        viewEl.appendChild(star);
        setTimeout(() => viewEl.removeChild(star), 500);
      }
    
}