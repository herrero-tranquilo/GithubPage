import Phaser from "phaser";

interface TilePosition {
  x: number;
  y: number;
}

const toKey = (x: number, y: number) => `${x}x${y}`;

const findNearestWalkable = (
  pos: Phaser.Math.Vector2,
  groundLayer: Phaser.Tilemaps.TilemapLayer,
  collideLayer: Phaser.Tilemaps.TilemapLayer
): Phaser.Math.Vector2 | null => {
  // BFS로 가장 가까운 walkable 타일 탐색
  const visited = new Set<string>();
  const queue = [{ x: pos.x, y: pos.y }];
  visited.add(toKey(pos.x, pos.y));

  while (queue.length > 0) {
    const { x, y } = queue.shift()!;
    const neighbors = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
    for (const n of neighbors) {
      const key = toKey(n.x, n.y);
      if (visited.has(key)) continue;
      visited.add(key);
      if (!groundLayer.getTileAt(n.x, n.y)) continue;
      if (!collideLayer.getTileAt(n.x, n.y)) {
        return new Phaser.Math.Vector2(n.x, n.y);
      }
      queue.push(n);
    }
  }
  return null;
};

const findPath = (
  start: Phaser.Math.Vector2,
  target: Phaser.Math.Vector2,
  groundLayer: Phaser.Tilemaps.TilemapLayer,
  collideLayer: Phaser.Tilemaps.TilemapLayer
) => {
  if (!groundLayer.getTileAt(target.x, target.y)) {
    return [];
  }
  if (collideLayer.getTileAt(target.x, target.y)) {
    const nearest = findNearestWalkable(target, groundLayer, collideLayer);
    if (!nearest) return [];
    target = nearest;
  }

  // 시작 위치가 collide 타일 위일 때 (나무 가지 뒤 등) 인접 walkable 타일로 보정
  if (collideLayer.getTileAt(start.x, start.y)) {
    const nearest = findNearestWalkable(start, groundLayer, collideLayer);
    if (!nearest) return [];
    start = nearest;
  }

  const queue: TilePosition[] = [];
  const parentForKey: {
    [key: string]: { key: string; position: TilePosition };
  } = {};

  const startKey = toKey(start.x, start.y);
  const targetKey = toKey(target.x, target.y);

  parentForKey[startKey] = {
    key: "",
    position: { x: -1, y: -1 },
  };

  queue.push(start);

  while (queue.length > 0) {
    const { x, y } = queue.shift()!;
    const currentKey = toKey(x, y);

    if (currentKey === targetKey) {
      break;
    }

    const neighbors = [
      { x, y: y - 1 }, // top
      { x: x + 1, y }, // right
      { x, y: y + 1 }, // bottom
      { x: x - 1, y }, // left
    ];

    for (let i = 0; i < neighbors.length; ++i) {
      const neighbor = neighbors[i];
      const tile = groundLayer.getTileAt(neighbor.x, neighbor.y);

      if (!tile) {
        continue;
      }

      if (collideLayer.getTileAt(neighbor.x, neighbor.y)) {
        continue;
      }

      const key = toKey(neighbor.x, neighbor.y);

      if (key in parentForKey) {
        continue;
      }

      parentForKey[key] = {
        key: currentKey,
        position: { x, y },
      };

      queue.push(neighbor);
    }
  }

  if (!(targetKey in parentForKey)) {
    return [];
  }

  const path: Phaser.Math.Vector2[] = [];

  let currentKey = targetKey;
  let currentPos = parentForKey[targetKey].position;

  while (currentKey !== startKey) {
    const pos = groundLayer.tileToWorldXY(currentPos.x, currentPos.y);
    pos.x += groundLayer.tilemap.tileWidth * 0.5;
    pos.y += groundLayer.tilemap.tileHeight * 0.5;

    path.push(pos);

    const { key, position } = parentForKey[currentKey];
    currentKey = key;
    currentPos = position;
  }
  return path.reverse();
};

export default findPath;
