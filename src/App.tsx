import React from "react";
import "./App.css";
import MainGame from "./games/MainGame";
import MainScene from "./scenes/MainScene";

const handleClick = () => {
  const scene = MainGame.scene.keys["MainScene"] as MainScene;
  scene.createEmitter();
};

function App() {
  return <div></div>;
}

export default App;
