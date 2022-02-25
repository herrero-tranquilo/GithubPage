import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image(
      "_tiles",
      `${process.env.PUBLIC_URL}/assets/maps/source/mountain_landscape.png`
    );
    this.load.image(
      "_misc",
      `${process.env.PUBLIC_URL}/assets/maps/source/lpc_misc.png`
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
