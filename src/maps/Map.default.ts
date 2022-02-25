import mapJSON from "./map.json";

export default class Map extends Phaser.Tilemaps.Tilemap {
  constructor({ scene }: { scene: Phaser.Scene }) {
    super(
      scene,
      Phaser.Tilemaps.Parsers.Tiled.ParseJSONTiled("_map", mapJSON, false)
    );
    const tileset = this.addTilesetImage("safari2", "_safari2");

    this.createLayer("land", [tileset], 0, 0);
    this.createLayer("collide", [tileset], 0, 0).setCollisionByProperty({
      collides: true,
    });
    this.createLayer("overlap", [tileset], 0, 0).setDepth(1);

    this.scene.matter.world.convertTilemapLayer(
      this.getLayer("collide").tilemapLayer
    );
    this.scene.matter.world.setBounds(
      0,
      0,
      this.widthInPixels,
      this.heightInPixels
    );
  }
  static preload(scene: Phaser.Scene) {
    scene.load.image(
      "_safari2",
      `${process.env.PUBLIC_URL}/assets/maps/source/safari2.png`
    );
    scene.load.tilemapTiledJSON(
      "_map",
      `${process.env.PUBLIC_URL}/assets/maps/map.json`
    );
  }
}
