// Libraries
import { Player,stringToDataUrl } from "textalive-app-api";
import { songs } from "../songs";
import { LyricsPlayer } from "./app.js";
import Parallax from "parallax-js";



var scene = document.getElementById('paraBg');
var parallaxInstance = new Parallax(scene,{
    relativeInput: true,
    invertX: true,
    invertY: true,
});

// Variable
const API_TOKEN = import.meta.env.VITE_TEXTALIVE_API_TOKEN;
const songListEl = document.getElementById("song-list");
const viewEl = document.getElementById("player-ui");
const metaEl = document.getElementById("meta");

// Main Class
class Main
{
    constructor() {
        this.router = new Router();
        this._player = new Player({
            app:{
                token: API_TOKEN
            }
        });

        this.lyrPlayer = new LyricsPlayer(this._player, this.router);

        this.mainMenu();
        this.setupCredit();
        this.setupSongSelector();
    }

    mainMenu() {

        document.getElementById("toSong").onclick = () => this.router.navigate("songSelector");
        document.getElementById("toCredit").onclick = () => this.router.navigate("creditView");


     }

    setupCredit(){
        document.getElementById("cdtReturnMenu").onclick = () => this.router.navigate("mainMenu");
     }

    setupSongSelector() {
        const ul = document.getElementById("songList");
        songs.forEach((song) => {
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action text-dark";
            li.textContent = `${song.title} / ${song.artist}`;
            li.onclick = () => this.lyrPlayer.loadAndPlay(song);
            // li.onclick = () => this.playSong(song);
            
            ul.appendChild(li);
        });
        document.getElementById("ssReturnMenu").onclick = () => this.router.navigate("mainMenu");
    }


    playSong(song) {
        this.router.navigate("player-ui");
        document.getElementById("loading").style.display = "flex";
        this._player.createFromSongUrl(song.songUrl, { video: song.video });
        this._player.addListener({
            onAppReady: (app) => console.log("App ready", app),
            onVideoReady: (v) => this._onVideoReady(v),
            onTimeUpdate: (pos) => {/* update lyric UI here */}
        });
    }

    _onAppReady(){
        if (!app.songUrl)
        {
            // インフォーマルダイブ / 99piano
            this._player.createFromSongUrl("https://piapro.jp/t/Ppc9/20241224135843", {
                video: {
                // 音楽地図訂正履歴
                beatId: 4694277,
                chordId: 2830732,
                repetitiveSegmentId: 2946480,
            
                // 歌詞URL: https://piapro.jp/t/77V2
                // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FPpc9%2F20241224135843
                lyricId: 67812,
                lyricDiffId: 20656
                },
            });
        }
        document.getElementById("playBtn").addEventListener("click", () => {
            this._player.requestPlay();
        })
    }

    _onVideoReady (v)
    {
        document.getElementById("loading").style.display = "none";
        const song = this._player.data.song;
        metaEl.innerHTML = `<h2>${song.name}</h2><p>${song.artist.name}</p>`;
      
    }

    _onTimeUpdate(){

    }


}

class App {
    constructor() {

    }



}

class Router
{
    constructor() {
        this.views = document.querySelectorAll(".view");
    }
    navigate(viewId) {
        this.views.forEach(view => view.classList.remove("active-view"));
        document.getElementById(viewId).classList.add("active-view");
    }

}



new Main();