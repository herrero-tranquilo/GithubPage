import React from "react";
import MainGame from "../game";
import MainScene from "../scenes/GameScene";

const handleClick = () => {
  const scene = MainGame.scene.keys["GameScene"] as MainScene;
};

function App() {
  return (
    <div>
      <button onClick={handleClick}>Profile</button>
    </div>
  );
}

export default App;
