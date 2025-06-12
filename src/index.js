// Libraries
import { Player } from "textalive-app-api";
import { songs } from "../songs";


// Variable
const token = import.meta.env.VITE_TEXTALIVE_API_TOKEN;
const songListEl = document.getElementById("song-list");
const viewEl = document.getElementById("player-ui");
const metaEl = document.getElementById("meta");

// Main Class
class App
{
    constructor() {
        this.router = new Router();
        this._player = new Player({
            app:{
                token: token
            }
        });

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
            li.onclick = () => this.playSong(song);
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

    _onVideoReady (v)
    {

        document.getElementById("loading").style.display = "none";
        const song = this._player.data.song;
        metaEl.innerHTML = `<h2>${song.name}</h2><p>${song.artist.name}</p>`;
        document.getElementById("lsReturnMenu").onclick = () => this.router.navigate("mainMenu");
    
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



new App();