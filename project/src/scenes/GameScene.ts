import BaseScene, { SceneMapConfig } from "./BaseScene";

export default class GameScene extends BaseScene {
  constructor() {
    super({ key: "GameScene" });
  }

  protected getMapConfig(): SceneMapConfig {
    return {
      mapKey: "_map",
      mapPath: "/assets/maps/map.json",
      tilesets: [
        { name: "safari2", key: "_safari2", path: "/assets/maps/source/safari2.png" },
      ],
      layers: [
        { name: "land", tilesets: ["safari2"] },
        { name: "collide", tilesets: ["safari2"], collide: true },
        { name: "overlap", tilesets: ["safari2"], overlap: true },
      ],
      portalTarget: "BuildingScene",
    };
  }
}
