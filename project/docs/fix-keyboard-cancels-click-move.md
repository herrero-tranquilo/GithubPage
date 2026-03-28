# fix: 키보드 입력 시 클릭 이동 취소

## 문제

클릭으로 경로 이동 중 키보드(WASD)를 입력하면 기존 클릭 이동이 취소되지 않는다.

### 원인

`update()` 흐름:
1. `this.move(this.keyEvents)` — 키보드 입력으로 이동
2. `if (this.moveToTarget)` — 클릭 경로가 남아있으면 다시 `move()` 호출하여 키보드 입력을 덮어씀

키보드 입력 시 `movePath`와 `moveToTarget`을 초기화하지 않기 때문에, 클릭 이동이 계속 진행된다.

## 해결 방안

`update()`에서 키보드 입력이 감지되면 클릭 이동 상태를 초기화한다.

### 변경 파일
- `src/characters/Player/index.tsx`

### 구현

```
update() {
  // 키보드 입력이 있으면 클릭 이동 취소
  if (키보드 아무 키 눌림) {
    this.movePath = [];
    this.moveToTarget = undefined;
  }

  this.move(this.keyEvents);

  if (this.moveToTarget) {
    // 기존 클릭 이동 로직 ...
  }
  this.animate();
}
```

키 입력 감지: `this.keyEvents`의 W/S/A/D 중 하나라도 `isDown`이면 클릭 이동 취소.
