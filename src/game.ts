import Phaser from "phaser";
import Preloader from "./scenes/Preloader";
import GameScene from "./scenes/GameScene";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#999999",
  parent: "",
  scene: [Preloader, GameScene],
  scale: {
    zoom: 2,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth / 2 - 8,
    height: window.innerHeight / 2 - 8,
  },
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision",
      },
    ],
  },
};

export default new Phaser.Game(config);
