import { Player,stringToDataUrl } from "textalive-app-api";

const API_TOKEN = import.meta.env.VITE_TEXTALIVE_API_TOKEN;

const metaEl = document.getElementById("meta");

export class PlayerManager 
{
    constructor(song){
        this._player = new Player({
            app:{
                token: API_TOKEN,   
            },
            mediaElement:document.getElementById("media")
        });
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
        })
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
        }
        if (! app.songUrl)
        {
      
        }
    }

    _onVideoReady (v)
    {
        document.getElementById("loading").style.display = "none";
        const song = this._player.data.song;
        metaEl.innerHTML = `<h2>${song.name}</h2><p>${song.artist.name}</p>`;
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
        console.log("play");
    }
    _onPause ()
    {
        this._controlChange(false);
        console.log("pause");
    }
    _onStop ()
    {
        this._controlChange(false);
        console.log("stop");
    }
    _onMediaSeek (position)
    {
        // console.log("seek", position);
    }
    _onTimeUpdate (position)
    {


    }
    _onThrottledTimeUpdate (position)
    {

    }
    _onAppMediaChange (url)
    {
        this._player.requestMediaSeek(0);
        this._player.requestPause();
    }
       
    destroy(){
        this._player.dispose();
    }
    
}