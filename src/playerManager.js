import { Player,stringToDataUrl } from "textalive-app-api";

const API_TOKEN = import.meta.env.VITE_TEXTALIVE_API_TOKEN;

const volEl = document.getElementById("volSlider");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const lyricEl = document.getElementById('lyricPlayer');
const viewEl = document.getElementById('view');

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
        console.log("app:", app);
        
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
        // console.log("stop");
    }
    _onMediaSeek (position)
    {
        // console.log("seek", position);
    }
    _onTimeUpdate (position)
    {
        // console.log("update",position)
        
        const char = this._player.video.findChar(position);
        if (char && char.parent) {
            // console.log(char.parent.text);
            lyricEl.innerHTML = `<h2>${char.parent.text}</h2>`;
        }

        const beats = this._player.findBeat(position);
        console.log(beats);
        if(beats) {
            for (let i = this.lastBeatIndex + 1; 1< beats.length; i++) {
                this.lastBeatIndex = 1;
                this.spawnStar();

            }
        }

    }
    _onThrottledTimeUpdate (position)
    {

    }
    _onAppMediaChange (url)
    {
        this._player.requestMediaSeek(0);
        this._player.requestPause();
    }

    _onVolumeUpdate(volume){
        console.log(volume);
    }
       
    destroy(){
        this._player.dispose();
    }

    spawnStar() {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${Math.random() * window.innerHeight}px`;
        viewEl.appendChild(star);
        setTimeout(() => document.body.removeChild(star), 500);
      }
    
}