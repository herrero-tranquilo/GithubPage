import Player from "../characters/Player";
import Map from "../maps/Map.default";

export default class GameScene extends Phaser.Scene {
  constructor(private player: Player, private map: Map) {
    super("GameScene");
  }
  preload() {
    Map.preload(this);
    Player.preload(this);
  }
  create() {
    this.createEmitter();
  }
  update() {
    this.player.update();
  }
  createEmitter() {
    this.map = new Map({
      scene: this,
    });
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
