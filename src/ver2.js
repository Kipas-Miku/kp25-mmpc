// Libraries
import { Player, stringToDataUrl } from "textalive-app-api";
import { songs } from "../songs.js";

// Variable
const token = import.meta.env.VITE_TEXTALIVE_API_TOKEN;
const songListEl = document.getElementById("song-list");
const viewEl = document.getElementById("player-ui");
const metaEl = document.getElementById("meta");

// Test
// console.log(import.meta.env.VITE_TEXTALIVE_API_TOKEN);

// Main Class
class Main
{
  constructor ()
  {
    var canMng = new CanvasManager ();
    this._canMng = canMng;

    this._initPlayer();

    window.addEventListener("resize", ()=> this.resize());
    this._update();
  }

  _initPlayer ()
  {
    var player = new Player({
      app: {
        token: token
      },
      mediaElement:document.querySelector("#media")
    });

    player.addListener({
      onAppReady: (app) => this._onAppReady(app),
      onVideoReady: (v) => this._onVideoReady(v),
      onTimeUpdate: (pos) => this._onTimeUpdate(pos),
    });
    this._player = player;

    songs.forEach((song)=> {
        const btn = document.createElement("button");
        btn.textContent  = `${song.title} / ${song.artist}`;
        btn.onClick = () => {
            songListEl.style.display = "none";
            viewEl.style.display = "block";
            
            this._player.createFromSongUrl(song.songUrl,{video:song.video});
        
        }
        songListEl.appendChild(btn);
    })
  }

  
 _onAppReady (app) {
    if (!app.managed) {
      // ストリートライト / 加賀(ネギシャワーP)
      this._player.createFromSongUrl("https://piapro.jp/t/ULcJ/20250205120202", {
        video: {
          // 音楽地図訂正履歴
          beatId: 4694275,
          chordId: 2830730,
          repetitiveSegmentId: 2946478,
      
          // 歌詞URL: https://piapro.jp/t/DPXV
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FULcJ%2F20250205120202
          lyricId: 67810,
          lyricDiffId: 20654
        },
      });

    // //   アリフレーション / 雨良 Amala
    //   Player.createFromSongUrl("https://piapro.jp/t/SuQO/20250127235813", {
    //     video: {
    //       // 音楽地図訂正履歴
    //       beatId: 4694276,
    //       chordId: 2830731,
    //       repetitiveSegmentId: 2946479,
      
    //       // 歌詞URL: https://piapro.jp/t/GbYz
    //       // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FSuQO%2F20250127235813
    //       lyricId: 67811,
    //       lyricDiffId: 20655
    //     },
    //   });

    // //   インフォーマルダイブ / 99piano
    //   player.createFromSongUrl("https://piapro.jp/t/Ppc9/20241224135843", {
    //     video: {
    //       // 音楽地図訂正履歴
    //       beatId: 4694277,
    //       chordId: 2830732,
    //       repetitiveSegmentId: 2946480,
      
    //       // 歌詞URL: https://piapro.jp/t/77V2
    //       // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FPpc9%2F20241224135843
    //       lyricId: 67812,
    //       lyricDiffId: 20656
    //     },
    //   });

    // //   ハロー、フェルミ。 / ど～ぱみん
    //   player.createFromSongUrl("https://piapro.jp/t/oTaJ/20250204234235", {
    //     video: {
    //       // 音楽地図訂正履歴
    //       beatId: 4694278,
    //       chordId: 2830733,
    //       repetitiveSegmentId: 2946481,
      
    //       // 歌詞URL: https://piapro.jp/t/lbO1
    //       // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FoTaJ%2F20250204234235
    //       lyricId: 67813,
    //       lyricDiffId: 20657
    //     },
    //   });

    // //   パレードレコード / きさら
    //   player.createFromSongUrl("https://piapro.jp/t/GCgy/20250202202635", {
    //     video: {
    //       // 音楽地図訂正履歴
    //       beatId: 4694279,
    //       chordId: 2830734,
    //       repetitiveSegmentId: 2946482,
      
    //       // 歌詞URL: https://piapro.jp/t/FJ5N
    //       // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FGCgy%2F20250202202635
    //       lyricId: 67814,
    //       lyricDiffId: 20658
    //     },
    //   });

    // //   ロンリーラン / 海風太陽
    //   player.createFromSongUrl("https://piapro.jp/t/CyPO/20250128183915", {
    //     video: {
    //       // 音楽地図訂正履歴
    //       beatId: 4694280,
    //       chordId: 2830735,
    //       repetitiveSegmentId: 2946483,
      
    //       // 歌詞URL: https://piapro.jp/t/jn89
    //       // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FCyPO%2F20250128183915
    //       lyricId: 67815,
    //       lyricDiffId: 20659
    //     },
    //   });
    }


    document.getElementById("view").addEventListener("click", ()=> function(p){
      if (p.isPlaying)  p.requestPause();
      else              p.requestPlay();
    }(this._player));
  }

  _onVideoReady (v)
  {
    const song = this._player.data.song;
    console.log(song);
    var lyrics = [];

    metaEl.innerHTML = `<h2>${song.name}</h2><p>${song.artist.name}</p>`;
    if (v.firstChar)
    {
        var c = v.firstChar;
        while (c)
        {
            lyrics.push(new Lyric(c));
            c = c.next;
        }
    }
    this._canMng.setLyrics(lyrics);
  }

  _onTimeUpdate (position)
  {
      this._position   = position;
      this._updateTime = Date.now();

      this._canMng.update(position);
  }

  _update ()
  {
    if (this._player.isPlaying && 0 <= this._updateTime && 0 <= this._position)
        {
            var t = (Date.now() - this._updateTime) + this._position;
            this._canMng.update(t);
        }
        window.requestAnimationFrame(() => this._update());
  }

  _resize ()
  {
      this._canMng.resize();
  }
}

class Lyric
{
  constructor (data)
  {
    this.text       = data.text;
    this.startTime  = data.startTime;
    this.endTime    = data.endTime
    this.duration   = data.duration;
 
    if (data.next && data.next.startTime - this.endTime < 500) this.endTime = data.next.startTime;
        else this.endTime += 500;
  }
}

class CanvasManager
{
    constructor ()
    {
        // Number of grid on the short side of the screen
        this._size = 32;

        // キャンバス（歌詞の文字のピクセルを走査して、塗りの密度を調べる用）| Canvas (to scan the pixel of lyric text to find the fill density)
        this._tcan;
        this._tctx;
        
        // キャンバス生成（描画エリア）| Canvas creation (Drawing Area)
        this._can = document.createElement("canvas");
        this._ctx = this._can.getContext("2d");
        document.getElementById("view").append(this._can);

        this.resize();
    }

    // 歌詞の更新
    setLyrics (lyrics)
    {
        this._lyrics = lyrics;

        var size = this._size;
        var can = this._tcan = (!this._tcan) ? document.createElement("canvas") : this._tcan;
        var ctx = this._tctx = (!this._tctx) ? can.getContext("2d") : this._tctx;
        can.width = can.height = size;
        
        var fontSize = size * 0.9;

        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "" + fontSize + "px sans-serif";

        var len = lyrics.length;
        var lyricsObj = {};
        var lyricsArr = [];

        // 歌詞の全文字列に対して走査 | Scan all lyrics
        for (var i = 0; i < len; i ++)
        {
            var text = lyrics[i].text;
            if (lyricsObj[text]) continue;

            lyricsObj[text] = this._getLyricObj(text, size, fontSize);
            lyricsArr.push(lyricsObj[text]);
        }

        // 歌詞の文字数が少ない場合に、追加で固定の文字列を加える
        if (lyricsArr.length < 10)
        {
            var str = "てきすとあらいぶテキストアライブ産業技術総合研究所";
            for (var i = 0; i < str.length; i ++)
            {
                var text = str.charAt(i);
                if (lyricsObj[text]) continue;

                lyricsObj[text] = this._getLyricObj(text, size, fontSize);
                lyricsArr.push(lyricsObj[text]);
            }
        }
        // 塗りの密度の低い順に並び替え
        lyricsArr = lyricsArr.sort(function(a,b) { return (a.ave < b.ave) ? -1:1; });
        
        this.lyricsObj = lyricsObj;
        this.lyricsArr = lyricsArr;
    }
    // 再生位置アップデート
    update (position)
    {
        if (! this._lyrics) return;

        // モザイク描画の更新頻度を調整（35ms毎）
        var tt = Math.floor(position / 35);
        if (this._tt == tt) return;
        this._tt = tt;

        for (var i = 0, l = this._lyrics.length; i < l; i ++)
        {
            var lyric = this._lyrics[i];
            // 開始タイム < 再生位置 && 再生位置 < 終了タイム
            if (lyric.startTime <= position && position < lyric.endTime)
            {
                this._draw(lyric.text);
                return;
            }
        }
        this._draw(null);
    }
    // リサイズ
    resize ()
    {
        this._can.width  = this._stw = document.documentElement.clientWidth;
        this._can.height = this._sth = document.documentElement.clientHeight;
    }

    // 指定の文字ピクセルを走査し、塗りの密度を調べる
    _getLyricObj (text, size, fontSize)
    {
        var ctx = this._tctx;

        ctx.clearRect(0, 0, size, size);
        ctx.fillText(text, size/2, size/2 + fontSize * 0.37);

        var image = ctx.getImageData(0, 0, size, size);
        var data  = image.data;

        var obj = {text: text, data: [], sum: 0, ave: 0, min: 255, max: 0};

        for (var n = 0, l = data.length; n < l; n += 4)
        {
            var alp = data[n+3];
            if (alp < obj.min) obj.min = alp;
            if (obj.max < alp) obj.max = alp;
            obj.sum += alp;
            obj.data.push(alp);
        }
        obj.ave = obj.sum / (size * size);

        return obj;
    }
    // 描画
    _draw (tx)
    {
        var size = this._size;

        var blockSize = Math.min(this._stw, this._sth) / size;
        var fontSize = blockSize * 0.9;

        var ctx = this._ctx;
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.font = "bold " + fontSize + "px sans-serif";
        
        ctx.clearRect(0, 0, this._stw, this._sth);

        var lyricsObj = this.lyricsObj;
        var lyricsArr = this.lyricsArr;

        var len = lyricsArr.length;

        var startX = 0, startY = 0, // 文字の描画位置
            numX = size, numY = size, // グリッド数
            offX = 0, offY = 0; // オフセット [px]

        if (this._sth < this._stw)
        {
            numX   = Math.floor(this._stw / blockSize) + 2;
            offX   = - (this._stw % blockSize) / 2;
            startX = Math.floor((numX - size) / 2);
        }
        else
        {
            numY   = Math.floor(this._sth / blockSize) + 2;
            offX   = - (this._sth % blockSize) / 2;
            startY = Math.floor((numY - size) / 2);
        }

        var randomNum = Math.round(len/8);

        // 文字のモザイク描画
        for (var y = 0; y < numY; y ++)
        {
            for (var x = 0; x < numX; x ++)
            {
                var n = 0;
                
                if (tx && lyricsObj[tx] && startX <= x && x < startX + size && startY <= y && y < startY + size)
                {
                    var dn = (y - startY) * size + (x - startX);
                    var alp = lyricsObj[tx].data[dn];
                    n = Math.floor((alp / lyricsObj[tx].max) * (len - 1));
                }
                var numFront = Math.min(n, randomNum);
                var numBack  = Math.min(len - 1 - n, randomNum);
                n += Math.round(Math.random() * (numFront + numBack) - numFront);

                var text = lyricsArr[n].text;
                var px = x * blockSize + blockSize / 2 + offX;
                var py = y * blockSize + blockSize / 2 + offY + fontSize * 0.37;

                ctx.fillText(text, px, py);
            }
        }
    }
}

new Main()


