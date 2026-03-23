import React, { useState, useEffect } from "react";
import MainGame from "../game";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const scene = MainGame.scene.keys["GameScene"] as any;
      if (scene?.player) {
        const map = scene.map as Phaser.Tilemaps.Tilemap;
        const land = map?.getLayer("land")?.tilemapLayer;
        if (land) {
          const tile = land.worldToTileXY(scene.player.x, scene.player.y);
          setCoords({ x: tile.x, y: tile.y });
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="coord-display">
        tile: {coords.x}, {coords.y}
      </div>
      <button className="profile-btn" onClick={() => setIsOpen(true)}>
        Profile
      </button>

      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2>Profile</h2>
          <button className="drawer-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>
        <div className="drawer-content">
          <div className="profile-avatar" />
          <p className="profile-name">Player</p>
        </div>
      </div>
    </>
  );
}

export default App;
