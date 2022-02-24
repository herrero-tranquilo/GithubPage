import React from "react";
import MainGame from "./TestGame";
import MainScene from "./TestGame/Scene";

const handleClick = () => {
  const scene = MainGame.scene.keys["MainScene"] as MainScene;
  scene.createEmitter();
};

function App() {
  return <div></div>;
}

export default App;
