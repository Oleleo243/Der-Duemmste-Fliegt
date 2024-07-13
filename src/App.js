import { useState, useRef, useEffect, createContext } from "react";
import { signOut } from "firebase/auth";
import { useParams } from "react-router-dom";

import { Lobby } from "./components/Lobby";
import { Voting } from "./components/Voting";
import { Game } from "./components/Game";

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
      <AppContext.Provider >
        <Router>
          <Routes>
            <Route path="/" element={<Auth shouldJoin={shouldJoin} setShouldJoin={setShouldJoin} />} />
          <Route path="/room/:id" element={<Room showVoting={showVoting}  shouldJoin={shouldJoin} setShouldJoin={setShouldJoin} setShowVoting={setShowVoting} inLobby={inLobby} setInLobby={setInLobby}/> } />
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

function Room({ showVoting, setShowVoting, inLobby, setInLobby, shouldJoin, setShouldJoin, }) {
  const url = window.location.pathname;

  const parts = url.split("/");
  const roomID = parts[2];
  const [isCreator, setIsCreator] = useState(false);
  const [lives, setLives] = useState(3);
  const [rounds, setRounds] = useState(4);
  const [questionTime, setQuestionTime] = useState(30);
  const [votingTime, setVotingTime] = useState(20);
  const [playerNumber, setPlayerNumber] = useState(0);
  const [players, setPlayers] = useState([]);
  const [language, setLanguage] = useState("german");
  const [votingNumber, setVotingNumber] = useState(1);


  return (
    <div>
      {inLobby ? (
        <Lobby setInLobby={setInLobby}
        isCreator={isCreator}
        setIsCreator={setIsCreator}
        lives={lives}
        setLives={setLives}
        rounds={rounds}
        setRounds={setRounds}
        questionTime={questionTime}
        setQuestionTime={setQuestionTime}
        votingTime={votingTime}
        setVotingTime={setVotingTime}
        playerNumber={playerNumber}
        roomID={roomID}
        setSlayerNumber={setPlayerNumber}
        players={players}
        setPlayers={setPlayers}
        shouldJoin={shouldJoin}
        setShouldJoin={setShouldJoin}
        language={language}
         setLanguage={setLanguage}
        /> // Übergabe der Prop zur Steuerung des Übergangs zum Spiel
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
        setShowVoting={setShowVoting}
        isCreator={isCreator}
        lives={lives}
        rounds={rounds}
        questionTime={questionTime}
        votingTime={votingTime}
        playerNumber={questionTime}
        players={players}
        db={db}
        roomID={roomID}
        setPlayers={setPlayers}
        votingNumber={votingNumber}
        setVotingNumber={setVotingNumber}
        />
      )}
    </div>
  );
}

export default App;
