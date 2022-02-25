import Player from "../characters/Player";

export default class BuildingScene extends Phaser.Scene {
  constructor(private player: Phaser.Physics.Matter.Sprite) {
    super("BuildingScene");
  }
  preload() {
    this.load.image(
      "_interior",
      `${process.env.PUBLIC_URL}/assets/maps/source/interior.png`
    );
    this.load.image(
      "_furniture",
      `${process.env.PUBLIC_URL}/assets/maps/source/furniture.png`
    );
    this.load.tilemapTiledJSON(
      "_map2",
      `${process.env.PUBLIC_URL}/assets/maps/map2.json`
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
    const map = this.make.tilemap({ key: "_map2" });
    const tilesetInterior = map.addTilesetImage("interior", "_interior");
    const tilesetFurniture = map.addTilesetImage("furniture", "_furniture");
    map.createLayer("floor", [tilesetInterior], 0, 0);
    map.createLayer("wall", [tilesetInterior], 0, 0);
    map.createLayer("furniture", [tilesetFurniture], 0, 0);
    map.createLayer("object", [tilesetFurniture], 0, 0);
    // this.matter.world.convertTilemapLayer(map.getLayer("collide").tilemapLayer);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player({
      scene: this,
      x: map.widthInPixels / 2,
      y: map.heightInPixels,
      texture: "_character",
      frame: "character_walk_down_2",
    });
    this.cameras.main.startFollow(this.player, true);
  }
}
