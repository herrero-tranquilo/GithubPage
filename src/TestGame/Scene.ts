import { Console } from "console";
import Player from "./entities/Player";

export default class MainScene extends Phaser.Scene {
  constructor(private player: Player) {
    super("MainScene");
  }

  preload() {
    Player.preload(this);
    this.load.image(
      "_tiles",
      `${process.env.PUBLIC_URL}/assets/maps/source/mountain_landscape.png`
    );
    this.load.tilemapTiledJSON(
      "_map",
      `${process.env.PUBLIC_URL}/assets/maps/map.json`
    );
  }

  create() {
    this.createEmitter();
  }
  createEmitter() {
    const map = this.make.tilemap({ key: "_map" });
    const tileset = map.addTilesetImage(
      "mountain_landscape",
      "_tiles",
      16,
      16,
      0,
      0
    );
    const layer1 = map.createLayer("land", tileset, 0, 0);
    const layer2 = map.createLayer("tile", tileset, 0, 0);
    const layer3 = map.createLayer("grass", tileset, 0, 0);
    layer3.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer3);
    this.player = new Player({
      scene: this,
      x: 900,
      y: 950,
      texture: "_charactor",
      frame: "ranger_idle_1",
    });
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }
  update() {
    this.player.update();
  }
}
