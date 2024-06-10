import { useState, useRef, useEffect, createContext } from "react";
import { signOut } from "firebase/auth";

import { Lobby } from "./components/Lobby";
import { Home } from "./components/Auth.js";
import Cookies from "universal-cookie";
import { db, auth, uid } from "./firebase-config.js";
import {
  getDatabase,
  ref,
  set,
  push,
  hasChild,
  exists,
  get,
} from "firebase/database";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const AppContext = createContext();

function App() {
  const [shouldJoin, setShouldJoin] = useState(true);

  // window.addEventListener('beforeunload', () => { signOut(auth);});
  // console.log("ich hab kein Bock mehr")

  return (
    <div className="App">
      <AppContext.Provider value={{ shouldJoin, setShouldJoin }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<Lobby />} />
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
