import React, { useState } from "react";
import "../game";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
