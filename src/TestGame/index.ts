import Phaser from "phaser";
import MainScene from "./Scene";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

const config: Phaser.Types.Core.GameConfig = {
  width: 2048,
  height: 2048,
  backgroundColor: "#999999",
  type: Phaser.AUTO,
  parent: "",
  scene: [MainScene],
  scale: {
    zoom: 2,
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
