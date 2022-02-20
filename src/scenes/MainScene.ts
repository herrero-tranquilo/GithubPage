import Player from "../entities/Player";

export default class MainScene extends Phaser.Scene {
  constructor(private player: Player) {
    super("MainScene");
  }

  preload() {
    Player.preload(this);
    this.load.image(
      "_tiles",
      `${process.env.PUBLIC_URL}/assets/images/rpg_nature_tileset.png`
    );
    this.load.tilemapTiledJSON(
      "_map",
      `${process.env.PUBLIC_URL}/assets/images/map.json`
    );
  }

  create() {
    this.createEmitter();
  }
  createEmitter() {
    const map = this.make.tilemap({ key: "_map" });
    const tileset = map.addTilesetImage(
      "rpg_nature_tileset",
      "_tiles",
      32,
      32,
      0,
      0
    );
    const layer1 = map.createLayer("Tile Layer 1", tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
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
