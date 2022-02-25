import Phaser from "phaser";

export default class Player extends Phaser.Physics.Matter.Sprite {
  direction = "down";
  inputKeys: {
    up?: Phaser.Input.Keyboard.Key;
    left?: Phaser.Input.Keyboard.Key;
    right?: Phaser.Input.Keyboard.Key;
    down?: Phaser.Input.Keyboard.Key;
  } = {
    up: undefined,
    left: undefined,
    right: undefined,
    down: undefined,
  };

  constructor({
    scene,
    x,
    y,
    texture,
    frame,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame?: string | number;
  }) {
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    let playerCollider = Bodies.rectangle(this.x, this.y, 32, 52, {
      isSensor: false,
      label: "playerCollider",
    });
    let PlayerSensor = Bodies.circle(this.x, this.y, 32, {
      isSensor: true,
      label: "playerSensor",
    });
    const compoundBody = Body.create({
      parts: [playerCollider, PlayerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
  }
  static preload(scene: Phaser.Scene) {
    scene.load.atlas(
      "_charactor",
      `${process.env.PUBLIC_URL}/assets/charctors/player2/source/charactor.png`,
      `${process.env.PUBLIC_URL}/assets/charctors/player2/charactor_atlas.json`
    );
    scene.load.animation(
      "_charactor_anim",
      `${process.env.PUBLIC_URL}/assets/charctors/player2/charactor_anim.json`
    );
  }
  get velocity() {
    return this.body.velocity;
  }
  update() {
    const speed = 6;
    let playerVelocity = new Phaser.Math.Vector2();
    if (this.inputKeys.left && this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys.right && this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    }
    if (this.inputKeys.up && this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down && this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);
    if (this.velocity.y > 0.1) {
      this.direction = "down";
      this.anims.play("_charactor_walk_down", true);
    } else if (this.velocity.x < 0) {
      this.direction = "left";
      this.anims.play("_charactor_walk_left", true);
    } else if (this.velocity.x > 0.1) {
      this.direction = "right";
      this.anims.play("_charactor_walk_right", true);
    } else if (this.velocity.y < 0) {
      this.direction = "up";
      this.anims.play("_charactor_walk_up", true);
    } else {
      this.anims.play(`_charactor_idle_${this.direction}`, true);
    }
  }
}
