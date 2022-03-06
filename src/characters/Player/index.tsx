import Phaser from "phaser";
import findPath from "../../utils/findPath";

type EnableKeys = "W" | "S" | "A" | "D";
type EnableKeyEvents = {
  [key in EnableKeys]?: Phaser.Input.Keyboard.Key | { isDown: boolean };
};
type Direction = "up" | "down" | "left" | "right";

export default class Player extends Phaser.Physics.Matter.Sprite {
  private SPEED = 6;
  private vector = new Phaser.Math.Vector2();
  private direction: Direction = "down";
  private keyEvents: EnableKeyEvents = {
    W: { isDown: false },
    S: { isDown: false },
    A: { isDown: false },
    D: { isDown: false },
  };

  private movePath: Phaser.Math.Vector2[] = [];
  private moveToTarget?: Phaser.Math.Vector2;

  constructor({
    scene,
    x,
    y,
    texture,
    frame,
    map,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame?: string | number;
    map: Phaser.Tilemaps.Tilemap;
  }) {
    super(scene.matter.world, x, y, texture, frame);
    this.setExistingBody(this.makeBody());
    this.setFixedRotation();
    this.scene.add.existing(this);
    this.bindInteraction(scene, map);
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
    this.move(this.keyEvents);

    let dx = 0;
    let dy = 0;
    if (this.moveToTarget) {
      dx = this.moveToTarget.x - this.x;
      dy = this.moveToTarget.y - this.y;
      if (Math.abs(dx) < 5) {
        dx = 0;
      }
      if (Math.abs(dy) < 5) {
        dy = 0;
      }

      if (dx === 0 && dy === 0) {
        if (this.movePath.length > 0) {
          this.moveTo(this.movePath.shift()!);
          return;
        }

        this.moveToTarget = undefined;
      }
      this.move({
        W: { isDown: dy < 0 },
        S: { isDown: dy > 0 },
        A: { isDown: dx < 0 },
        D: { isDown: dx > 0 },
      });
    }
    this.animate();
  }
  move({ W, S, A, D }: EnableKeyEvents) {
    this.vector.y = 0;
    this.vector.x = 0;

    if (W && W.isDown) {
      this.direction = "up";
      this.vector.y = -1;
    } else if (S && S.isDown) {
      this.direction = "down";
      this.vector.y = 1;
    }
    if (A && A.isDown) {
      this.direction = "left";
      this.vector.x = -1;
    } else if (D && D.isDown) {
      this.direction = "right";
      this.vector.x = 1;
    }

    this.vector.normalize().scale(this.SPEED);
    this.setVelocity(this.vector.x, this.vector.y);
  }
  makeBody() {
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const playerCollider = Bodies.rectangle(this.x, this.y, 32, 52, {
      isSensor: false,
      label: "playerCollider",
    });
    const PlayerSensor = Bodies.circle(this.x, this.y, 32, {
      isSensor: true,
      label: "playerSensor",
    });
    const compoundBody = Body.create({
      parts: [playerCollider, PlayerSensor],
      frictionAir: 0.35,
    });
    return compoundBody;
  }
  bindInteraction(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    this.keyEvents = scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.scene.input.on(
      Phaser.Input.Events.POINTER_UP,
      (pointer: Phaser.Input.Pointer) => {
        this.setMovePoint(map, pointer);
      }
    );
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, (e: any) => {
      this.scene.input.off(Phaser.Input.Events.POINTER_UP);
    });
  }
  animate() {
    const velocity = this.body.velocity;
    const isWalkDown = velocity.y > 0.1;
    const isWalkLeft = velocity.x < 0;
    const isWalkRight = velocity.x > 0.1;
    const isWalkUp = velocity.y < 0;
    const isIdle = velocity.y === 0 && velocity.x === 0;

    if (isWalkDown) {
      this.anims.play("_character_walk_down", true);
    } else if (isWalkLeft) {
      this.anims.play("_character_walk_left", true);
    } else if (isWalkRight) {
      this.anims.play("_character_walk_right", true);
    } else if (isWalkUp) {
      this.anims.play("_character_walk_up", true);
    } else if (isIdle) {
      this.anims.play(`_character_idle_${this.direction}`, true);
    }
  }
  moveFromCursor() {
    let dx = 0;
    let dy = 0;
    if (this.moveToTarget) {
      dx = this.moveToTarget.x - this.x;
      dy = this.moveToTarget.y - this.y;
      if (Math.abs(dx) < 5) {
        dx = 0;
      }
      if (Math.abs(dy) < 5) {
        dy = 0;
      }

      if (dx === 0 && dy === 0) {
        if (this.movePath.length > 0) {
          this.moveTo(this.movePath.shift()!);
          return;
        }

        this.moveToTarget = undefined;
      }
      this.move({
        W: { isDown: dy < 0 },
        S: { isDown: dy > 0 },
        A: { isDown: dx < 0 },
        D: { isDown: dx > 0 },
      });
    }
  }
  setMovePoint(
    map: Phaser.Tilemaps.Tilemap,
    { worldX, worldY }: Phaser.Input.Pointer
  ) {
    const landLayer = map.getLayer("land").tilemapLayer;
    const collideLayer = map.getLayer("collide").tilemapLayer;

    const startVec = landLayer.worldToTileXY(this.x, this.y);
    const targetVec = landLayer.worldToTileXY(worldX, worldY);
    const path = findPath(startVec, targetVec, landLayer, collideLayer);
    this.moveAlong(path);
  }
  moveTo(target: Phaser.Math.Vector2) {
    this.moveToTarget = target;
  }
  moveAlong(path: Phaser.Math.Vector2[]) {
    if (!path || path.length <= 0) {
      return;
    }

    this.movePath = path;
    this.moveTo(this.movePath.shift()!);
  }
}
