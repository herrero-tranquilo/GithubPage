import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image(
      "_safari2",
      `${process.env.PUBLIC_URL}/assets/maps/source/safari2.png`
    );
    this.load.tilemapTiledJSON(
      "_map",
      `${process.env.PUBLIC_URL}/assets/maps/map.json`
    );
  }

  create() {
    this.scene.start("GameScene");
  }
}
