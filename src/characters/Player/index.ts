import Phaser from "phaser";
import findPath from "../../utils/findPath";

type Direction = "up" | "down" | "left" | "right";

interface KeyState {
  isDown: boolean;
}

interface DirectionKeys {
  W?: Phaser.Input.Keyboard.Key | KeyState;
  S?: Phaser.Input.Keyboard.Key | KeyState;
  A?: Phaser.Input.Keyboard.Key | KeyState;
  D?: Phaser.Input.Keyboard.Key | KeyState;
}

interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string | Phaser.Textures.Texture;
  frame?: string | number;
  map: Phaser.Tilemaps.Tilemap;
}

const SPEED = 6;
const ARRIVAL_THRESHOLD = 5;

export default class Player extends Phaser.Physics.Matter.Sprite {
  private vector = new Phaser.Math.Vector2();
  private direction: Direction = "down";
  private keys: DirectionKeys = {
    W: { isDown: false },
    S: { isDown: false },
    A: { isDown: false },
    D: { isDown: false },
  };
  private movePath: Phaser.Math.Vector2[] = [];
  private moveToTarget?: Phaser.Math.Vector2;

  constructor({ scene, x, y, texture, frame, map }: PlayerConfig) {
    super(scene.matter.world, x, y, texture, frame);
    this.setExistingBody(this.createBody());
    this.setFixedRotation();
    this.scene.add.existing(this);
    this.setupInput(scene, map);
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas(
      "_character",
      `${process.env.PUBLIC_URL}/assets/characters/player/source/character.png`,
      `${process.env.PUBLIC_URL}/assets/characters/player/character_atlas.json`
    );
    scene.load.animation(
      "_character_anim",
      `${process.env.PUBLIC_URL}/assets/characters/player/character_anim.json`
    );
  }

  update() {
    if (this.isKeyPressed()) {
      this.cancelPath();
    }

    this.applyMovement(this.keys);
    this.followPath();
    this.animate();
  }

  private isKeyPressed(): boolean {
    const { W, S, A, D } = this.keys;
    return !!(W?.isDown || S?.isDown || A?.isDown || D?.isDown);
  }

  private cancelPath() {
    this.movePath = [];
    this.moveToTarget = undefined;
  }

  private followPath() {
    if (!this.moveToTarget) return;

    let dx = this.moveToTarget.x - this.x;
    let dy = this.moveToTarget.y - this.y;
    if (Math.abs(dx) < ARRIVAL_THRESHOLD) dx = 0;
    if (Math.abs(dy) < ARRIVAL_THRESHOLD) dy = 0;

    if (dx === 0 && dy === 0) {
      if (this.movePath.length > 0) {
        this.moveToTarget = this.movePath.shift()!;
        return;
      }
      this.moveToTarget = undefined;
      return;
    }

    this.applyMovement({
      W: { isDown: dy < 0 },
      S: { isDown: dy > 0 },
      A: { isDown: dx < 0 },
      D: { isDown: dx > 0 },
    });
  }

  private applyMovement({ W, S, A, D }: DirectionKeys) {
    this.vector.x = 0;
    this.vector.y = 0;

    if (W?.isDown) {
      this.direction = "up";
      this.vector.y = -1;
    } else if (S?.isDown) {
      this.direction = "down";
      this.vector.y = 1;
    }
    if (A?.isDown) {
      this.direction = "left";
      this.vector.x = -1;
    } else if (D?.isDown) {
      this.direction = "right";
      this.vector.x = 1;
    }

    this.vector.normalize().scale(SPEED);
    this.setVelocity(this.vector.x, this.vector.y);
  }

  private animate() {
    const { x, y } = this.body.velocity;
    if (y > 0.1) {
      this.anims.play("_character_walk_down", true);
    } else if (x < 0) {
      this.anims.play("_character_walk_left", true);
    } else if (x > 0.1) {
      this.anims.play("_character_walk_right", true);
    } else if (y < 0) {
      this.anims.play("_character_walk_up", true);
    } else if (x === 0 && y === 0) {
      this.anims.play(`_character_idle_${this.direction}`, true);
    }
  }

  private createBody() {
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    return Body.create({
      parts: [
        Bodies.rectangle(this.x, this.y, 32, 52, { isSensor: false, label: "playerCollider" }),
        Bodies.circle(this.x, this.y, 32, { isSensor: true, label: "playerSensor" }),
      ],
      frictionAir: 0.35,
    });
  }

  private setupInput(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    this.keys = scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    });

    const onPointerUp = (pointer: Phaser.Input.Pointer) => {
      this.handleClickMove(map, pointer);
    };
    this.scene.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp);
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp);
    });
  }

  private handleClickMove(map: Phaser.Tilemaps.Tilemap, { worldX, worldY }: Phaser.Input.Pointer) {
    const groundLayer = (map.getLayer("land") || map.getLayer("floor")).tilemapLayer;
    const collideLayer = (map.getLayer("collide") || map.getLayer("furniture")).tilemapLayer;

    const start = groundLayer.worldToTileXY(this.x, this.y);
    const target = groundLayer.worldToTileXY(worldX, worldY);
    const path = findPath(start, target, groundLayer, collideLayer);

    if (path.length > 0) {
      this.movePath = path;
      this.moveToTarget = this.movePath.shift()!;
    }
  }
}
