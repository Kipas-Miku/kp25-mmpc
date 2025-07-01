import vocaData from '../assets/voca.json'
import starData from '../assets/star.json'
import data from 'p5/data';

export class SceneManager {
  constructor(p) {
    this.p = p;
    this.image = null;
    this.loaded = false;
    this.assetData = this.getRandomVocaloidAssets();
    this.factData = this.getStarData();

    this.x = null;
    this.y = null;
    this.xChar = null;
    this.yChar = null;
    this.width = 200;
    this.height = 200;
    this.radius = 200;

    this.positions = [
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.5 }), // Center left
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.2 }), // Upper left
      () => ({ x: this.p.width * 0.2, y: this.p.height * 0.8 })  // Bottom left
    ];

    this.charPos = [
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.5 }), // Center right
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.2 }), // Upper right
      () => ({ x: this.p.width * 0.8, y: this.p.height * 0.8 })  // Bottom right
    ];


    this.load();
  }
    
  async load(){
    const path = new URL('./Star_Kaito.png',import.meta.url).href;

        try {
          const img = await this.p.loadImage(this.assetData.star.image);
          const char = await this.p.loadImage(this.assetData.character.image);
          this.image = img;
          this.imageChar = char;
          this.loaded = true;
          
          const starPos = this.positions[Math.floor(Math.random() * this.positions.length)]();
          const charPos = this.charPos[Math.floor(Math.random() * this.charPos.length)]();
          
          this.x = starPos.x;
          this.y = starPos.y;
          this.xChar = charPos.x;
          this.yChar = charPos.y;

          console.log('✅ Image loaded successfully');
      }  catch (err) {
        console.error('❌ Error loading image:', err);
      }
  }

  getRandomVocaloidAssets() {
    try {
      const data = vocaData;

      const randomChar = data.char[Math.floor(Math.random() * data.char.length)];
      const randomStar = data.star[Math.floor(Math.random() * data.star.length)];

      const charPose = randomChar.poses[Math.floor(Math.random() * randomChar.poses.length)];

      console.log("Random Character:", randomChar.name, "Pose:", charPose);
      console.log("Random Star:", randomStar.name, "Image:", randomStar.image);

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
    console.log("Clicked:", randomFact.name);
    console.log("Type:", randomFact.type);
    console.log("Fact:", randomFact.fact);
    // Optional: show modal or toast
  }

  setup() {
    // You can put any future setup logic here
  }

  draw() {
    if (!this.loaded || !this.image) return;
  
    const p = this.p;
    p.push();
    p.imageMode(p.CENTER);
    p.image(this.image, this.x, this.y, this.width, this.height);
    p.image(this.imageChar, this.xChar, this.yChar, this.width, this.height);
    p.pop();
  }

  isClicked(mx, my) {
    const d = this.p.dist(mx, my, this.x, this.y);
    return d < this.radius;
  }


}
//     this.p = p;
//     this.assetData = this.getRandomVocaloidAssets();

//     this.currentScene = this.generateScene();
//     this.nextScene = null;

//     console.log(this.currentScene);
//     this.transitionProgress = 0;
//     this.isTransitioning = false;
//     this.transitionDirection = null;
//   }

//   generateScene() {
//     const voca = this.assetData.character;
//     const star = this.assetData.star;

//     return {
//       elements: [
//         {
//           id: voca.name,
//           img: this.p.loadImage(voca.image),
//           x: this.p.width / 2,
//           y: this.p.height / 2,
//           size: 150,
//           clickable: false,
//           meta: voca,
//         },
//         {
//           id: star.name,
//           img: this.p.loadImage(star.image),
//           x: this.p.width * 0.8,
//           y: this.p.height * 0.5,
//           size: 100,
//           clickable: true,
//           meta: star,
//         },
//       ],
//       offsetX: 0,
//     };
//   }

//   draw() {
//     if (this.isTransitioning) {
//       this.transitionProgress += 0.04;
//       const ease = this.easeInOut(this.transitionProgress);

//       if (this.transitionDirection === "left") {
//         this.currentScene.offsetX = -ease * this.p.width;
//         this.nextScene.offsetX = this.p.width - ease * this.p.width;
//       } else if (this.transitionDirection === "right") {
//         this.currentScene.offsetX = ease * this.p.width;
//         this.nextScene.offsetX = -this.p.width + ease * this.p.width;
//       }

//       this.renderScene(p, this.nextScene);
//       this.renderScene(p, this.currentScene);

//       if (this.transitionProgress >= 1) {
//         this.currentScene = this.nextScene;
//         this.nextScene = null;
//         this.isTransitioning = false;
//         this.transitionProgress = 0;
//       }
//     } else {
//       if(this.currentScene){
//         this.currentScene.offsetX = 0;
//         this.renderScene(this.currentScene);

//       }
//     }
//   }

//   renderScene(scene) {
//     for (const el of scene.elements) {
//       const x = el.x + (scene.offsetX || 0);
//       this.p.imageMode(this.p.CENTER);
//       this.p.image(el.img, x, el.y, el.size, el.size);
//     }
//   }

//   handleClick(x, y) {
//     if (this.isTransitioning) return;

//     for (const el of this.currentScene.elements) {
//       const dx = x - el.x;
//       const dy = y - el.y;
//       const dist = Math.sqrt(dx * dx + dy * dy);

//       if (el.clickable && dist < el.size / 2) {
//         // Clicked object
//         this.popEffect(el);
//         this.fetchCelestialData();
//         break;
//       }
//     }
//   }

//   async fetchCelestialData() {
//     const data = starData;
//     const randomFact = data.stars[Math.floor(Math.random() * data.stars.length)];
//     console.log("Clicked:", randomFact.name);
//     console.log("Type:", randomFact.type);
//     console.log("Fact:", randomFact.fact);
//     // Optional: show modal or toast
//   }

//   triggerTransition(direction) {
//     if (this.isTransitioning) return;

//     this.isTransitioning = true;
//     this.transitionDirection = direction;
//     this.nextScene = this.generateScene();
//     this.nextScene.offsetX = direction === "left" ? this.this.p.width : -this.this.p.width;
//   }

//   popEffect(el) {
//     // Optional: animate scale/pop effect
//     console.log("Pop animation for:", el.id);
//   }

//   easeInOut(t) {
//     return t < 0.5
//       ? 2 * t * t
//       : -1 + (4 - 2 * t) * t;
//   }

//   getRandomVocaloidAssets() {
//   try {
//     const data = vocaData;

//     const randomChar = data.char[Math.floor(Math.random() * data.char.length)];
//     const randomStar = data.star[Math.floor(Math.random() * data.star.length)];

//     const charPose = randomChar.poses[Math.floor(Math.random() * randomChar.poses.length)];

//     // console.log("Random Character:", randomChar.name, "Pose:", charPose);
//     // console.log("Random Star:", randomStar.name, "Image:", randomStar.image);

//     return {
//       character: {
//         name: randomChar.name,
//         image: charPose
//       },
//       star: {
//         name: randomStar.name,
//         image: randomStar.image
//       }
//     };

//   } catch (err) {
//     console.error("Failed to load assets:", err);
//   }
// }
  
// }


