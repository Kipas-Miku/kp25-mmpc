// LyricsPlayer.js
export class LyricsPlayer {
  constructor(player, router) {
    this.player = player;
    this.router = router;

    this.seekSlider = document.getElementById("seekSlider");
    this.playBtn = document.getElementById("playBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.stopBtn = document.getElementById("stopBtn");
    this.exitBtn = document.getElementById("lsReturnMenu");
    this.songTitle = document.getElementById("meta");
    this.textaliveApp = document.getElementById("view");

    this._setupControls();
  }

  _setupControls() {
    this.playBtn.addEventListener("click", () => {
      this.player.requestPlay();
    });

    this.pauseBtn.addEventListener("click", () => {
      this.player.requestPause();
    });

    this.stopBtn.addEventListener("click", () => {
      this.player.requestStop();
    });

    this.seekSlider.addEventListener("input", (e) => {
      const percent = e.target.value;
      if (this.player.isPlaying()) {
        this.player.requestMediaSeek((percent / 100) * this.player.media.duration);
      }
    });

    this.exitBtn.onclick = () => {
      this.player.requestStop();
      this.seekSlider.value = 0;
      this.router.navigate("mainMenu");

      // clear or reset if needed
      this.textaliveApp.innerHTML = '';
    };
  }

  loadAndPlay(song) {

    this.router.navigate("player-ui");
    console.log(song.url, { video: song.video })
    this.player.createFromSongUrl(song.url, { video: song.video });

    this.player.addListener({ 
      onAppReady: (app) => console.log("App ready", app),
      onVideoReady: () => console.log("Video ready"),
      onTimeUpdate: (pos) => {
        const percent = (pos.position / pos.duration) * 100;
        this.seekSlider.value = percent;
      },
    });
  }
}
