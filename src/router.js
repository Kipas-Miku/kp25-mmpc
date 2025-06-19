import { songs } from "../assets/songs";
import { PlayerManager } from "./playerManager";

export class Router
{
    constructor() {
        this.views = document.querySelectorAll(".view");
        this.viewSetUp();
        this.songSetUp();
    }
    navigate(viewId) {
        this.views.forEach(view => view.classList.remove("active-view"));
        document.getElementById(viewId).classList.add("active-view");
    }
    
    viewSetUp() {
        document.getElementById("toSong").onclick = () => this.navigate("songSelector");
        document.getElementById("toCredit").onclick = () => this.navigate("creditView");
        document.getElementById("cdtReturnMenu").onclick = () => this.navigate("mainMenu");
    }

    songSetUp() {
        const ul = document.getElementById("songList");
                songs.forEach((song) => {
                    const li = document.createElement("li");
                    li.className = "list-group-item list-group-item-action text-dark";
                    li.textContent = `${song.title} / ${song.artist}`;
                    li.onclick = () => {
                        this._playerManager = new PlayerManager(song);
                        this.navigate("player-ui");
                    }
                    
                    
                    ul.appendChild(li);
                    document.getElementById("lsReturnMenu").onclick = () => {
                        this.navigate("songSelector");
                        this._playerManager.destroy();
                    }
                });
                document.getElementById("ssReturnMenu").onclick = () => this.navigate("mainMenu");
    
    }

}