import Player from "../characters/Player";

export default class GameScene extends Phaser.Scene {
  constructor(private player: Phaser.Physics.Matter.Sprite) {
    super("GameScene");
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
    Player.preload(this);
  }
  create() {
    this.createEmitter();
  }
  update() {
    this.player.update();
  }
  createEmitter() {
    const map = this.make.tilemap({ key: "_map" });
    const tileset = map.addTilesetImage("safari2", "_safari2");
    map.createLayer("land", [tileset], 0, 0);
    map
      .createLayer("collide", [tileset], 0, 0)
      .setCollisionByProperty({ collides: true });
    map.createLayer("overlap", [tileset], 0, 0).setDepth(1);
    this.matter.world.convertTilemapLayer(map.getLayer("collide").tilemapLayer);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player({
      scene: this,
      x: 1000,
      y: 950,
      texture: "_character",
      frame: "character_walk_down_2",
    });
    this.cameras.main.startFollow(this.player, true);
  }
}
