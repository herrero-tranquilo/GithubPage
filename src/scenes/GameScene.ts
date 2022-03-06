import Player from "../characters/Player";

export default class GameScene extends Phaser.Scene {
  constructor(
    private player: Phaser.Physics.Matter.Sprite,
    private map: Phaser.Tilemaps.Tilemap,
    private spawnPoint: Phaser.Types.Tilemaps.TiledObject
  ) {
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
        this.scene.switch("BuildingScene");

        this.player.setPosition(
          this.player.x,
          this.player.y + this.player.height / 3
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
    this.map = this.make.tilemap({ key: "_map" });

    const tileset = this.map.addTilesetImage("safari2", "_safari2");
    this.map.createLayer("land", [tileset], 0, 0);
    this.map
      .createLayer("collide", [tileset], 0, 0)
      .setCollisionByProperty({ collides: true });
    this.map.createLayer("overlap", [tileset], 0, 0).setDepth(1);
    this.matter.world.convertTilemapLayer(
      this.map.getLayer("collide").tilemapLayer
    );
    this.matter.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // const portals = map.createFromObjects("portal", {});
    // portals.forEach((portal) => {
    //   portal.
    //   // this.matter.world.c(portal);
    // });

    // this.matter.world.on("collisionstart", this.handlePlayerPortalCollision);
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
  // private handlePlayerPortalCollision(
  //   event: any,
  //   obj1: Phaser.GameObjects.GameObject,
  //   obj2: Phaser.GameObjects.GameObject
  // ) {
  //   console.log(obj1, obj2);
  // }
}
