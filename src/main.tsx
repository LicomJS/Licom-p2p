import React from "react";
import ReactDOM from "react-dom/client";
import Gun from "gun";
import "gun/sea";
// import "gun/lib/webrtc";
import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/rindexed";
import "./app.scss";
import GunContext from "./context";
import Dashboard from "./components/Dashboard";

const gun = Gun();

gun.opt({
  peers:
    process.env.NODE_ENV === "development"
      ? ["http://localhost:8765/gun"]
      : [
          "https://grizzly.de1.hashbang.sh/gun",
          // "https://gun-manhattan.herokuapp.com/gun",
        ],
  localStorage: false,
});

// gun.opt({
//   peers: [
//     "http://localhost:8765/gun",
//     // "https://grizzly.de1.hashbang.sh/gun",
//     // "https://gun-manhattan.herokuapp.com/gun",
//   ],
//   localStorage: false,
// });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GunContext gun={gun}>
      <Dashboard />
    </GunContext>
  </React.StrictMode>
);
