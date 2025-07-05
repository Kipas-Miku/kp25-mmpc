import { Player } from "textalive-app-api";
import { CanvasManager } from "./canvasManager";

const API_TOKEN = import.meta.env.VITE_TEXTALIVE_API_TOKEN;

const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
const bar = document.querySelector("#bar");
const status = document.getElementById("status");
const factName = document.getElementById("fact-name");
const factType = document.getElementById("fact-type");
const factImg = document.getElementById("fact-img");
const factNo = document.getElementById("fact-no");
const factEntry = document.getElementById("fact-entry");
const factToggle = document.getElementById('fact-toggle');
const factCollapse = document.getElementById('fact');
const playbackTime = document.getElementById('timePlayback');
let lastTime = -1;


// ⬘
export class PlayerManager {
    constructor(song) {
        this._player = new Player({
            app: {
                token: 'sMxQv1t4xm4BLj1G',
            },
            mediaElement: document.querySelector("#media")
        });
        this.canvasMan = new CanvasManager(this._player);
        this.lastBeatIndex = -1;
        document.getElementById("loading").style.display = "flex"; // Remember to stylize this later
        this._player.createFromSongUrl(song.songUrl, { video: song.video })
        this._setupEvents();
    }

    _setupEvents() {
        this._player.addListener({
            onAppReady: (app) => this._onAppReady(app), // in use
            onVideoReady: (v) => this._onVideoReady(v), // in use
            onPlay: () => this._onPlay(), // in use
            onPause: () => this._onPause(), // in use
            onStop: () => this._onStop(), // in use
            onTimeUpdate: (pos) => this._onTimeUpdate(pos), // in use
            onAppParameterUpdate: (name, value) => this._onAppParameterUpdate(name, value), // not in use
            onAppMediaChange: (url) => this._onAppMediaChange(url), // in use but dont think code pass thru
        })

        document.getElementById("bt_play").addEventListener("click", () => this._player.requestPlay());
        document.getElementById("bt_pause").addEventListener("click", () => this._player.requestPause());
        document.getElementById("bt_rewind").addEventListener("click", () => this._player.requestStop());
        factCollapse.addEventListener("show.bs.collapse", event => {
            factToggle.innerHTML = `⬘`;
        })
        factCollapse.addEventListener("hide.bs.collapse", event => {
            factToggle.innerHTML = `⬙`;
        })
    }

    // Load interface
    _onAppReady(app) {
        status.innerHTML = `🔴 Status: Not Connected`;
    }

    _onVideoReady(v) {
        document.getElementById("loading").style.display = "none";
        const song = this._player.data.song;
        titleEl.innerHTML = `<span class='fs-6'>Observation </span>- ${song.name}`;
        artistEl.innerHTML = `<span >Supervising Observer </span>- ${song.artist.name}`;
        document.getElementById("control").style.display = "block";
        // Initialization
        status.innerHTML = `🟢 Status: Connected`;
        factName.innerHTML = `Select Target `
        factType.innerHTML = `Celestial Type: `
        factNo.innerHTML = `0000 `;
        playbackTime.innerHTML = `00:00`;
        document.getElementById('timeLength').innerHTML = this.formatTime(song.length,false);
        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Space":
                    console.log("Pause or Jump");
                    if (this._player.isPlaying) {
                        this._player.requestPause()
                    } else {
                        this._player.requestPlay()
                    }
                    break; 
                case "Escape":
                    console.log("Cancel or Exit");
                    break;
            }
        });
        
    }


    _onPlay() {
        this._controlChange(true);
        // console.log("play");
    }
    _onPause() {
        this._controlChange(false);
        // console.log("pause");
    }
    _onStop() {
        this._controlChange(false);
        if (this._player) {
            bar.className = "";
        }
        // console.log("stop");
    }
    _onTimeUpdate(position) {
        // Seekbar
        paintedSeekbar.style.width = `${parseInt((position * 1000) / this._player.video.duration) / 10
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

        playbackTime.innerHTML = this.formatTime(position);

        // Beat
        const beats = this._player.findBeatChange(lastTime, position);
        if (
            lastTime >= 0 &&
            beats.entered.length
        ) {
            this.canvasMan.triggerBeat();
        }

        // Lyrics Generation
        // pass the lyrics not sure which level to the lyric class
        if (!this._player.video.firstChar) {
            return;
        }
        if (lastTime > position + 1000) {
            // resetChars();
        } 
        const phrase = this._player.video.findPhrase(position);
        if (!this._lastPhrase || this._lastPhrase.startTime !== phrase?.startTime) {
            this._lastPhrase = phrase;
            if (phrase) {
                this.canvasMan.updateLyrics(phrase, position);  // Send phrase object
                this.logLyric(phrase);
            }
        }

        this.canvasMan.updateTime(position);
        lastTime = position;

    }

    // Not much use
    _onAppMediaChange(url) {
        this._player.requestMediaSeek(0);
        this._player.requestPause();
        const bar = document.querySelector("#bar");
    }

    _controlChange(playing) {
        if (playing) {
            document.getElementById("bt_play").style.display = "none";
            document.getElementById("bt_pause").style.display = "inline";
        }
        else {
            document.getElementById("bt_play").style.display = "inline";
            document.getElementById("bt_pause").style.display = "none";
        }
    }


    // Example logging functions
    logLyric(content) {
        const log = document.getElementById('lyricLog');
        const time = new Date().toLocaleString();
        log.innerHTML += `<div>${time} : ${content}</div>`;
        log.scrollTop = log.scrollHeight;
    }

    formatTime(value, isMS = true) {
        const totalSeconds = isMS ? Math.floor(value / 1000) : Math.floor(value);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    destroy() {
        this._player.dispose();
        this.canvasMan.destroy();
    }

}