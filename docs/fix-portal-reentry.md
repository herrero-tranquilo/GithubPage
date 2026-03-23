# fix: 포탈 재진입 방지

## 문제

씬 전환 후 돌아왔을 때 포탈 위에 서 있는 상태에서 즉시 다시 씬 전환이 발생한다.

### 원인

포탈 충돌 감지가 매 프레임 `RectangleToRectangle`로 체크되므로, 플레이어가 포탈 영역 위에 있는 한 계속 전환이 트리거된다.

## 해결

`wasOnPortal` 플래그를 추가하여 포탈 진입 엣지를 감지한다. 포탈 위에 새로 올라섰을 때만 전환이 발생하고, 이미 위에 서 있는 상태에서는 발동하지 않는다.

### 변경 파일
- `src/scenes/GameScene.ts`
- `src/scenes/BuildingScene.ts`

### 구현

```typescript
private wasOnPortal: boolean = false;

// update() 내부
const isOnPortal = Phaser.Geom.Intersects.RectangleToRectangle(...);

if (isOnPortal && !this.wasOnPortal) {
  // 씬 전환 실행
}

this.wasOnPortal = isOnPortal;
```

기존에 전환 후 `setPosition`으로 플레이어를 밀어내던 코드는 더 이상 필요 없으므로 제거.
