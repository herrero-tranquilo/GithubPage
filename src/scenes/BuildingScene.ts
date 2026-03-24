import BaseScene, { SceneMapConfig } from "./BaseScene";

export default class BuildingScene extends BaseScene {
  constructor() {
    super({ key: "BuildingScene" });
  }

  protected getMapConfig(): SceneMapConfig {
    return {
      mapKey: "_map2",
      mapPath: "/assets/maps/map2.json",
      tilesets: [
        { name: "interior", key: "_interior", path: "/assets/maps/source/interior.png" },
        { name: "furniture", key: "_furniture", path: "/assets/maps/source/furniture.png" },
      ],
      layers: [
        { name: "floor", tilesets: ["interior"] },
        { name: "wall", tilesets: ["interior"] },
        { name: "furniture", tilesets: ["furniture"], collide: true },
        { name: "overlap", tilesets: ["furniture"], overlap: true },
        { name: "object", tilesets: ["furniture"] },
      ],
      portalTarget: "GameScene",
    };
  }
}
