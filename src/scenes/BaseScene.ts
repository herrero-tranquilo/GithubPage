import Player from "../characters/Player";

interface TilesetConfig {
  name: string;
  key: string;
  path: string;
}

interface LayerConfig {
  name: string;
  tilesets: string[];
  collide?: boolean;
  overlap?: boolean;
}

export interface SceneMapConfig {
  mapKey: string;
  mapPath: string;
  tilesets: TilesetConfig[];
  layers: LayerConfig[];
  portalTarget: string;
}

export default abstract class BaseScene extends Phaser.Scene {
  protected player!: Player;
  protected map!: Phaser.Tilemaps.Tilemap;
  private spawnPoint!: Phaser.Types.Tilemaps.TiledObject;
  private wasOnPortal = false;

  protected abstract getMapConfig(): SceneMapConfig;

  preload() {
    const config = this.getMapConfig();
    for (const ts of config.tilesets) {
      this.load.image(ts.key, `${process.env.PUBLIC_URL}${ts.path}`);
    }
    this.load.tilemapTiledJSON(config.mapKey, `${process.env.PUBLIC_URL}${config.mapPath}`);
    Player.preload(this);
  }

  create() {
    this.wasOnPortal = false;
    this.renderMap();
    this.spawnPlayer();
  }

  update() {
    this.player.update();
    this.checkPortal();
  }

  private renderMap() {
    const config = this.getMapConfig();
    this.map = this.make.tilemap({ key: config.mapKey });

    const tilesetMap: Record<string, Phaser.Tilemaps.Tileset> = {};
    for (const ts of config.tilesets) {
      tilesetMap[ts.name] = this.map.addTilesetImage(ts.name, ts.key);
    }

    for (const layer of config.layers) {
      const tilesets = layer.tilesets.map((name) => tilesetMap[name]);
      const created = this.map.createLayer(layer.name, tilesets, 0, 0);
      if (layer.collide) {
        created.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(created);
      }
      if (layer.overlap) {
        created.setDepth(1);
      }
    }

    this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  private spawnPlayer() {
    this.spawnPoint = this.map.findObject("Objects", (obj) => obj.name === "Spawn Point");
    if (!this.spawnPoint?.x || !this.spawnPoint?.y) {
      throw new Error("Spawn Point not found");
    }
    this.player = new Player({
      scene: this,
      x: this.spawnPoint.x,
      y: this.spawnPoint.y,
      texture: "_character",
      frame: "character_walk_down_2",
      map: this.map,
    });
    this.cameras.main.startFollow(this.player, true);
  }

  private checkPortal() {
    const doorPoint = this.map.findObject("Potals", (obj) => obj.name === "Door Point");
    if (!doorPoint?.x || !doorPoint?.y) return;

    const isOnPortal = Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      new Phaser.Geom.Rectangle(doorPoint.x, doorPoint.y, doorPoint.width, doorPoint.height)
    );

    if (isOnPortal && !this.wasOnPortal) {
      this.registry.set("before-scene", this.scene);
      this.scene.switch(this.getMapConfig().portalTarget);
    }

    this.wasOnPortal = isOnPortal;
  }
}
