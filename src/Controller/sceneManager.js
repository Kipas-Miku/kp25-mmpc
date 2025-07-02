import vocaData from '../assets/voca.json'
import starData from '../assets/star.json'
import { Vocaloid } from '../Model/Vocaloid';
import { Vocastar } from '../Model/Vocastar';

export class SceneManager {
  constructor(p) {

    // Main object initialization
    this.p = p;
    this.loaded = false;

    // Element Position
    this.starPos = [
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.5 }), // Center left
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.2 }), // Upper left
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.8 })  // Bottom left
    ];

    this.charPos = [
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.5 }), // Center right
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.2 }), // Upper right
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.8 })  // Bottom right
    ];

    this.vocastar = null;
    this.vocaloid = null;

    this.setup();

    // Tranistion
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.transitionSpeed = 0.02;

    this.currentScene = null;
    this.nextScene = null;
  }

  setup() {
    const assetData = this.getRandomVocaloidAssets();

    const starPos = this.starPos[Math.floor(Math.random() * this.starPos.length)]();
    const vocaPos = this.charPos[Math.floor(Math.random() * this.charPos.length)]();

    // create instances
    this.vocastar = new Vocastar(this.p, assetData.star, starPos.x, starPos.y);
    this.vocaloid = new Vocaloid(this.p, assetData.character, vocaPos.x, vocaPos.y);

    this.loaded = true;
    console.log("✅ Scene initialized");
  }

  draw(){
    const p = this.p;
    if (this.isTransitioning) {
    this.transitionProgress += this.transitionSpeed;
    const ease = p.easeInOutCubic(this.transitionProgress);

    const offset = ease * p.width;

    // Draw old scene sliding left
    p.push();
    p.translate(-offset, 0);
    this.currentScene.star.draw();
    this.currentScene.vocaloid.draw();
    p.pop();

    // Draw new scene sliding in from the right
    p.push();
    p.translate(p.width - offset, 0);
    this.nextScene.star.draw();
    this.nextScene.vocaloid.draw();
    p.pop();

    if (this.transitionProgress >= 1) {
      this.isTransitioning = false;
      this.currentScene = null;
      this.nextScene = null;
    }

  } else {
    this.star?.draw();
    this.vocaloid?.draw();
  }

    if(this.vocastar) this.vocastar.draw();
    if(this.vocaloid) this.vocaloid.draw();
  }

  resize(){
    const p = this.p;

    // Update star position
    const newStarPos = this.starPos[Math.floor(Math.random() * this.starPos.length)]();
    this.vocastar.setPosition(newStarPos.x, newStarPos.y);

    // Update vocaloid position
    const newVocaPos = this.vocaPos[Math.floor(Math.random() * this.vocaPos.length)]();
    this.vocaloid.setPosition(newVocaPos.x, newVocaPos.y);
  }

  startTransits(dir) {
    this.isTransitioning = true;
    this.transitionProgress = 0;

    this.currentScene = {
      star: this.vocastar,
      vocaloid: this.vocaloid,
    };

    // Generate new Scene 
    const newAsset = this.getRandomVocaloidAssets();

    
    this.vocastar = new Vocastar(this.p, newAsset.star);
    this.vocaloid = new Vocaloid(this.p, newAsset.character);

    this.nextScene = {
      star: this.vocastar,
      vocaloid: this.vocaloid,
    }
  }

  clickHandler(mx,my){
    if(this.vocastar && this.vocastar.isClicked(mx,my)){
      const fact = this.getStarData();
      return {
        status: true,
        data: fact
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
      console.error("Failed to load assets:", err);
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