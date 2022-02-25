import Player from "../characters/Player";

export default class GameScene extends Phaser.Scene {
  constructor(private player: Player) {
    super("GameScene");
  }

  preload() {
    Player.preload(this);
  }

  create() {
    this.createEmitter();
  }
  createEmitter() {
    // this.physics.world.setBounds(, 0, 1904, 921);
    const map = this.make.tilemap({ key: "_map" });
    const tileset = map.addTilesetImage(
      "mountain_landscape",
      "_tiles",
      16,
      16,
      0,
      0
    );
    const miscSet = map.addTilesetImage("lpc_misc", "_misc", 16, 16, 0, 0);
    map.createLayer("land", tileset, 0, 0);
    map.createLayer("tile", tileset, 0, 0);
    map.createLayer("grass", tileset, 0, 0);
    map.createLayer("misc_top", miscSet, 0, 0).setDepth(1);
    const collideLayer = map
      .createLayer("misc_bottom", miscSet, 0, 0)
      .setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(collideLayer);
    this.initPlayer();
    this.cameras.main.startFollow(this.player, true);
  }
  initPlayer() {
    this.player = new Player({
      scene: this,
      x: 1000,
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
