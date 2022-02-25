import React from "react";
import MainGame from "../game";
import MainScene from "../scenes/GameScene";

const handleClick = () => {
  const scene = MainGame.scene.keys["GameScene"] as MainScene;
  scene.createEmitter();
};

function App() {
  return <div></div>;
}

export default App;
