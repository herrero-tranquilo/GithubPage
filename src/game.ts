import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import BuildingScene from "./scenes/BuildingScene";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
const ZOOM = 1;
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#999999",
  parent: "",
  scene: [GameScene, BuildingScene],
  scale: {
    zoom: ZOOM,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth / ZOOM - 8,
    height: window.innerHeight / ZOOM - 8,
  },
  physics: {
    default: "matter",
    matter: {
      debug: process.env.NODE_ENV !== "production",
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
  loader: {
    maxParallelDownloads: 4,
  },
};
export default new Phaser.Game(config);
