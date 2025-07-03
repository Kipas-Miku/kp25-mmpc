import vocaData from '../assets/voca.json'
import starData from '../assets/star.json'
import { Vocaloid } from '../Model/Vocaloid';
import { Vocastar } from '../Model/Vocastar';

export class SceneManager {
  constructor(p) {

    // Main object initialization
    this.p = p;
    this.loaded = false;
    this.fact = null;
    this.assetData = null;
    this.xStar = 0;
    this.yStar = 0;
    this.xChar = 0;
    this.yChar = 0;

    this.vocastar = null;
    this.vocaloid = null;

    this.setup();
  }

  setup() {
    this.loadAssets();
    // create instances
    this.vocastar = new Vocastar(this.p, this.assetData.star, this.xStar, this.yStar);
    this.vocaloid = new Vocaloid(this.p, this.assetData.character, this.xChar, this.yChar);

    this.loaded = true;
    console.log("✅ Scene initialized");
  }

  draw(){
    const p = this.p;

    // if(this.vocastar) this.vocastar.draw();
    // if(this.vocaloid) this.vocaloid.draw();
    this.vocastar?.draw();
    this.vocaloid?.draw();
  }

  async loadAssets(){
    this.assetData = this.getRandomVocaloidAssets();
    this.fact = this.getStarData();

    this.randomizePositions();
  }

  resize(){
    const p = this.p;
    this.randomizePositions();
    this.vocastar.setPosition(this.xStar, this.yStar);
    this.vocaloid.setPosition(this.xChar, this.yChar);
  }

  randomizePositions() {

    // Element Position
    const starPosList = [
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.5 }), // Center left
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.2 }), // Upper left
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.8 })  // Bottom left
    ];

    const vocaPosList = [
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.5 }), // Center right
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.2 }), // Upper right
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.8 })  // Bottom right
    ];

    const starPos = starPosList[Math.floor(Math.random() * starPosList.length)]();
    const vocaPos = vocaPosList[Math.floor(Math.random() * vocaPosList.length)]();

    this.xStar = starPos.x;
    this.yStar = starPos.y;
    this.xChar = vocaPos.x;
    this.yChar = vocaPos.y;
  }
  
  clickHandler(mx,my){
    if(this.vocastar && this.vocastar.isClicked(mx,my)){
      return {
        status: true,
        data: this.fact
      }
    }
  }

  getRandomVocaloidAssets() {
    try {
      const data = vocaData;

      const randomChar = data.char[Math.floor(Math.random() * data.char.length)];
      const randomStar = data.star[Math.floor(Math.random() * data.star.length)];

      const charPose = randomChar.poses[Math.floor(Math.random() * randomChar.poses.length)];

      console.log("✅ Random Character Selected:", randomChar.name, "Pose:", charPose);
      console.log("✅ Random Star Selected:", randomStar.name, "Image:", randomStar.image);

      return {
        character: {
          name: randomChar.name,
          image: charPose
        },
        star: {
          name: randomStar.name,
          image: randomStar.image
        }
      };

    } catch (err) {
      console.error("❌ Failed to load assets:", err);
    }
  }

  getStarData() {  
    const data = starData;
    const randomFact = data.stars[Math.floor(Math.random() * data.stars.length)];
    return {
      name: randomFact.name,
      type: randomFact.type,
      fact: randomFact.fact
    }
  }

}