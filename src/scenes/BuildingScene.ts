import Player from "../characters/Player";

export default class BuildingScene extends Phaser.Scene {
  constructor(
    private player: Phaser.Physics.Matter.Sprite,
    private map: Phaser.Tilemaps.Tilemap,
    private spawnPoint: Phaser.Types.Tilemaps.TiledObject
  ) {
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
    const doorPoint = this.map.findObject(
      "Potals",
      (obj) => obj.name === "Door Point"
    );
    if (doorPoint && doorPoint.x && doorPoint.y) {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.player.getBounds(),
          new Phaser.Geom.Rectangle(
            doorPoint.x,
            doorPoint.y,
            doorPoint.width,
            doorPoint.height
          )
        )
      ) {
        this.scene.scene.registry.set("before-scene", this.scene);
        this.scene.switch("GameScene");
        this.player.setPosition(
          this.player.x,
          this.player.y - this.player.height / 3
        );
      }
    }
  }
  createEmitter() {
    this.renderMap();
    this.setSpawnPoint();
    this.spawnPlayer();
  }
  private renderMap() {
    this.map = this.make.tilemap({ key: "_map2" });
    const tilesetInterior = this.map.addTilesetImage("interior", "_interior");
    const tilesetFurniture = this.map.addTilesetImage(
      "furniture",
      "_furniture"
    );
    this.map.createLayer("floor", [tilesetInterior], 0, 0);
    this.map.createLayer("wall", [tilesetInterior], 0, 0);
    this.map
      .createLayer("furniture", [tilesetFurniture], 0, 0)
      .setCollisionByProperty({ collides: true });
    this.map.createLayer("overlap", [tilesetFurniture], 0, 0).setDepth(1);
    this.map.createLayer("object", [tilesetFurniture], 0, 0);
    this.matter.world.convertTilemapLayer(
      this.map.getLayer("furniture").tilemapLayer
    );
    this.matter.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }
  setSpawnPoint() {
    this.spawnPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );
  }
  private spawnPlayer() {
    if (this.spawnPoint.x && this.spawnPoint.y) {
      this.player = new Player({
        scene: this,
        x: this.spawnPoint.x,
        y: this.spawnPoint.y,
        texture: "_character",
        frame: "character_walk_down_2",
      });
      this.cameras.main.startFollow(this.player, true);
    } else {
      throw Error();
    }
  }
}
