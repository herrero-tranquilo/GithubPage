# fix: 경로 탐색 벽 끼임 개선

## 문제

클릭 이동 시 플레이어가 벽 근처에서 끼여서 멈추는 현상이 발생한다.

### 원인

1. BFS 경로 탐색이 벽에 인접한 타일을 허용하여, 물리 충돌체가 있는 플레이어가 벽에 걸림
2. 끼였을 때 빠져나오는 로직이 없어 플레이어가 영구적으로 멈춤

## 해결

### 1. 벽 인접 타일 회피 경로 탐색 (`src/utils/findPath.ts`)

- `isAdjacentToCollide()` 함수 추가: 상하좌우에 충돌 타일이 있는지 체크
- `bfs()` 함수로 분리하여 `avoidWallAdjacent` 옵션 추가
- `findPath()`에서 벽 회피 BFS를 먼저 시도하고, 경로가 없으면 기본 BFS로 fallback
- `console.log(path)` 제거

### 2. stuck 감지 (`src/characters/Player/index.tsx`)

- `stuckFrames`, `lastPosition` 프로퍼티 추가
- 매 프레임 이동 거리가 0.5 미만이면 `stuckFrames` 증가
- 30프레임 동안 stuck이면 다음 경유지로 건너뛰거나 경로 취소
