/// <reference lib="matter" />
/// <reference lib="phaser" />
import * as MatterJS from "matter";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

declare module "phaser" {
  interface Scene {
    matterCollision: PhaserMatterCollisionPlugin;
  }
  namespace Scenes {
    interface Systems {
      matterCollision: PhaserMatterCollisionPlugin;
    }
  }
  namespace Physics.Matter.Matter {
    export class Body extends MatterJS.Body {
      static create(
        options: MatterJS.IChamferableBodyDefinition
      ): MatterJS.BodyType;
    }
    export class Bodies extends MatterJS.Bodies {}
  }
}
