import { useState, useRef, useEffect, createContext } from "react";
import { signOut } from "firebase/auth";
import { useParams } from "react-router-dom";

import { Lobby } from "./components/Lobby";
import { Auth } from "./components/Auth.js";
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
  const [showVoting, setShowVoting] = useState(false);
  const [inLobby, setInLobby] = useState(true); // Zustand, um zwischen Lobby und Spiel umzuschalten


  // window.addEventListener('beforeunload', () => { signOut(auth);});
  // console.log("ich hab kein Bock mehr")

  return (
    <div className="App">
      <AppContext.Provider value={{ shouldJoin, setShouldJoin }}>
        <Router>
          <Routes>
            <Route path="/" element={<Auth/>} />
            <Route path="/room/:id" element={<Room showVoting={showVoting} setShowVoting={setShowVoting} inLobby={inLobby} setInLobby={setInLobby} />} />
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

function Room({ showVoting, setShowVoting, inLobby, setInLobby }) {
  const url = window.location.pathname;

  const parts = url.split("/");
  const roomID = parts[2];
  //das gibt Lobby zu game
  isCreator={isCreator}
  lives={lives}
  rounds={rounds}
  questionTime={questionTime}
  votingTime={votingTime}
  db={db}
  playerNumber={playerNumber}
  roomID={roomID}
  setSlayerNumber={setPlayerNumber}
  players={players}
  setPlayers={setPlayers}

  return (
    <div>
      {inLobby ? (
        <Lobby setInLobby={setInLobby} /> // Übergabe der Prop zur Steuerung des Übergangs zum Spiel
      ) : showVoting ? (
        <Voting
          votingTime={votingTime}
          isCreator={isCreator}
          players={players}
          votingNumber={votingNumber}
          roomID={roomID}
          setPlayers={setPlayers}
        />
      ) : (
        <Game
          players={players}
          avatars={avatars}
          uid={'unique-id'}
          playerCounter={playerCounter}
          count={count}
          round={round}
          rounds={rounds}
          playerName={playerName}
          randomQuestion={randomQuestion}
          myTurn={myTurn}
          playerAnswerInput={playerAnswerInput}
          setPlayerAnswerInput={setPlayerAnswerInput}
          sendAnswer={sendAnswer}
          showLastAnswer={showLastAnswer}
          lastAnswer={lastAnswer}
          correctAnswer={correctAnswer}
          inputRef={inputRef}
          setShowVoting={setShowVoting} // Prop, um das Voting zu starten
        />
      )}
    </div>
  );
}

export default App;
