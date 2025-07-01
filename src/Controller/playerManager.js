import { Player } from "textalive-app-api";
import { CanvasManager } from "./canvasManager";

const API_TOKEN = import.meta.env.VITE_TEXTALIVE_API_TOKEN;

const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
const bar = document.querySelector("#bar");
const numChars = 10;

let lastTime = -1;

export class PlayerManager 
{
    constructor(song){
        this._player = new Player({
            app:{
                token: 'sMxQv1t4xm4BLj1G',
                // review later on
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
        this.canvasMan = new CanvasManager("lyricsCanvas", this._player);
        this.lastBeatIndex = -1;
        document.getElementById("loading").style.display = "flex"; // Remember to stylize this later
        this._player.createFromSongUrl(song.songUrl,{video : song.video})
        this._setupEvents();
    }

    _setupEvents() {
        this._player.addListener({
            onAppReady  : (app) => this._onAppReady(app), // in use
            onVideoReady: (v) => this._onVideoReady(v), // in use
            onPlay : () => this._onPlay(), // in use
            onPause: () => this._onPause(), // in use
            onStop : () => this._onStop(), // in use
            onMediaSeek : (pos) => this._onMediaSeek(pos), // not in use
            onTimeUpdate: (pos) => this._onTimeUpdate(pos), // in use
            onAppParameterUpdate: (name, value) => this._onAppParameterUpdate(name, value), // not in use
            onAppMediaChange: (url) => this._onAppMediaChange(url), // in use but dont think code pass thru
        })

        document.getElementById("bt_play")  .addEventListener("click", () => this._player.requestPlay());
        document.getElementById("bt_pause") .addEventListener("click", () => this._player.requestPause());
        document.getElementById("bt_rewind").addEventListener("click", () => this._player.requestStop());
    }

    // Load interface
    _onAppReady(app)
    {   
        
        // if (app.managed) {
        //     document.querySelector("#control").className = "disabled";
        // }
        // if (!app.songUrl) {
        //     document.querySelector("#media").className = "disabled";

        //     // ストリートライト / 加賀(ネギシャワーP)
        //     this._player.createFromSongUrl("https://piapro.jp/t/ULcJ/20250205120202", {
        //         video: {
        //         // 音楽地図訂正履歴
        //         beatId: 4694275,
        //         chordId: 2830730,
        //         repetitiveSegmentId: 2946478,
            
        //         // 歌詞URL: https://piapro.jp/t/DPXV
        //         // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FULcJ%2F20250205120202
        //         lyricId: 67810,
        //         lyricDiffId: 20654
        //         },
        //     });
        // }
    }

    _onVideoReady (v)
    {
        document.getElementById("loading").style.display = "none";
        const song = this._player.data.song;
        titleEl.innerHTML = `<span class='fs-6'>Observation </span>- ${song.name}`;
        artistEl.innerHTML = `${song.artist.name}`;
        document.getElementById("control").style.display = "block";

        document.addEventListener("keydown", (e) => {
              switch (e.code) {
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
        });
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
        if (this._player) {
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

        // Beat
        const beats = this._player.findBeatChange(lastTime, position);
        if(
            lastTime >= 0 &&
            beats.entered.length
        ) {
            this.canvasMan.triggerBeat();
        }

        // Lyrics Generation
        // pass the lyrics not sure which level to the lyric class
        // passing it 100 frame earlier would make it more karaoke like
        if (!this._player.video.firstChar) {
            return;
        }
        // if (lastTime > position + 1000) {
        //     // resetChars();
        // } 
        const phrase = this._player.video.findPhrase(position);
        if (!this._lastPhrase || this._lastPhrase.startTime !== phrase?.startTime) {
            this._lastPhrase = phrase;
            if (phrase) {
                this.canvasMan.updateLyrics(phrase,position);  // Send phrase object
            }
        }

        this.canvasMan.updateTime(position);
        lastTime = position;

    }

    // Not much use
    _onAppMediaChange (url)
    {
        this._player.requestMediaSeek(0);
        this._player.requestPause();
        const bar = document.querySelector("#bar");
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

    // resetChars() {
    //     lastTime = -1;
    //     while (textContainer.firstChild)
    //         textContainer.removeChild(textContainer.firstChild);
    // }
    
    destroy(){
        this._player.dispose();
        this.canvasMan.destroy();
    }
    
}