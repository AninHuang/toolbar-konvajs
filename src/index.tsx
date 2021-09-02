import * as React from "react";
import { render } from "react-dom";

import "./styles.css";

import { CanvasWithToolbar } from "./Canvas";

function App() {
  return (
    <div
      className="App"
      style={{ minHeight: "100vh", minWidth: "100vw", display: "flex" }}
    >
      <CanvasWithToolbar
        drawable
        backgroundImageSource="https://sscportal.in/sites/default/files/SSC-CGL-Tier-1-Exam-Paper-9-8-2015-morning%20(1).jpeg"
      />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
