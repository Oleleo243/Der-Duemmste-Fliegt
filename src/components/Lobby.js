import { db, auth, uid } from "../firebase-config.js";
import {
  onValue,
  getDatabase,
  ref,
  set,
  push,
  hasChild,
  exists,
  get,
  serverTimestamp,
} from "firebase/database";
import { AuthJoin } from "./AuthJoin";

import { Game } from "./Game";
import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../App";
import "../styles/Lobby.css";
import "../styles/Lobby-grid.css";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import { timer } from "../utilities/gameFunctions";
import { createAvatar } from "@dicebear/core";
import { avataaars, lorelei } from "@dicebear/collection";
import { useMemo } from "react";

export const Lobby = (roomID, setInLobby, isCreator, lives, rounds,setRounds, setIsCreator, questionTime,votingTime,playerNumber,setPlayerNumber, players ,setPlayers, shouldJoin, setShouldJoin, language, setLanguage, setLives, setQuestionTime, setVotingTime
) => {

  //const { shouldJoin, setShouldJoin } = useContext(AppContext);
  const [isAuth, setIsAuth] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [count, setCount] = useState(6.0);
  const [startedAt, setStartedAt] = useState(null);
  let timeLeft = 3;

  useEffect(() => {
    //console.log(count);
    //console.log(shouldJoin);
    // join Prozess
    if (shouldJoin) {
      setIsCreator(true);
      // console.log("jetzt aber ich will schlafen")
    }

      const playersRef = ref(db, "rooms/" + roomID + "/players");
      const playersListener = onValue(playersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const playersArray = Object.entries(data).map(([playerID, playerData]) => {
            const votedBy = playerData.votedBy ? Object.keys(playerData.votedBy) : [];
            return { playerID: playerID, ...playerData, votedBy: votedBy };
          });
          setPlayers(playersArray);
          setPlayerNumber(playersArray.length);

        }
      });

    // sync game Settings
    const livesRef = ref(db, "rooms/" + roomID + "/settings/lives"); // Pfad zum ausgewählten Feld in der Realtime Database
    const livesListener = onValue(livesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLives(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
      }
    });
    const roundsRef = ref(db, "rooms/" + roomID + "/settings/rounds"); // Pfad zum ausgewählten Feld in der Realtime Database
    const roundsListener = onValue(roundsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRounds(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
      }
    });
    const questionTimeRef = ref(db, "rooms/" + roomID + "/settings/questionTime"); // Pfad zum ausgewählten Feld in der Realtime Database
    const questionTimeListener = onValue(questionTimeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuestionTime(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank

      }
    });
    const votingTimeRef = ref(db, "rooms/" + roomID + "/settings/votingTime"); // Pfad zum ausgewählten Feld in der Realtime Database
    const votingTimeListener = onValue(votingTimeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setVotingTime(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank

      }
    });
    const hasStartedRef = ref(db, "rooms/" + roomID + "/status/hasStarted"); // Pfad zum ausgewählten Feld in der Realtime Database
    const hasStartedListener = onValue(hasStartedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setInLobby(false); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
      }
    });
  }, []);

  // erstelle avatare
  // https://www.dicebear.com/styles/avataaars/
  const avatars = useMemo(() => {
    return players ? players.map((player) =>
      createAvatar(avataaars, {
        size: 50,
        seed: player.playerName,
      }).toDataUriSync()
    ) : [];
  }, [players]);


  useEffect(() => {
    if(playerNumber > 1){
      set(ref(db, "rooms/" + roomID + "/status/playerNumber"), playerNumber);
    }
  }, [playerNumber]);

  // bei release das davor packen https://
  const copyToClipboard = () => {
    const copyText = `https://${window.location.hostname}/room/${roomID}`;
    navigator.clipboard.writeText(copyText);
  };

  const handleLivesChange = (e) => {
    set(ref(db, "rooms/" + roomID + "/settings/lives"), e.target.value);
    setLives(e.target.value);
  };

  const handleRoundsChange = (e) => {
    set(ref(db, "rooms/" + roomID + "/settings/rounds"), e.target.value);
    setRounds(e.target.value);
  };

  const handleQuestionTimeChange = (e) => {
    set(ref(db, "rooms/" + roomID + "/settings/questionTime"), e.target.value);
    setQuestionTime(e.target.value);
  };

  const handleVotingTimeChange = (e) => {
    set(ref(db, "rooms/" + roomID + "/settings/votingTime"), e.target.value);
    setVotingTime(e.target.value);
  };

  const handleLangugeChange = (e) => {
    // to do
  };

  const handleGameStart = (e) => {
    set(ref(db, "rooms/" + roomID + "/status/hasStarted"), true);
  };

  // mit uid anstat isAuth ist eigentlic besser
  if (shouldJoin) {
    return (
      <div>
        <AuthJoin roomID={roomID} setIsAuth={setIsAuth} />
      </div>
    );
  }

  if (!shouldJoin) {
    return (
      <div className="lobby-container">
        <div className="Lobby-settings-box">
          <h1 className="lobby-title">Game Settings</h1>
          {count < 4 && <h1>{count}</h1>}{" "}
          <form id="gameSettingsForm">
            <label>Lives:</label>
            <select
              id="livesInput"
              name="lives"
              required
              disabled={isCreator}
              value={lives}
              onChange={handleLivesChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <br />
            <label>Rounds until Voting:</label>
            <select
              id="roundsInput"
              name="rounds"
              required
              disabled={isCreator}
              value={rounds}
              onChange={handleRoundsChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <br />
            <label>Time per Question:</label>
            <select
              id="timePerQuestionInput"
              name="timePerQuestion"
              required
              disabled={isCreator}
              value={questionTime}
              onChange={handleQuestionTimeChange}
            >
              <option value="5">5s</option>
              <option value="10">10s</option>
              <option value="20">20s</option>
              <option value="30">30s</option>
              <option value="40">40s</option>
              <option value="50">50s</option>
              <option value="60">60s</option>
              <option value="90">90s</option>
              <option value="120">120s</option>
              <option value="150">150s</option>
              <option value="180">180s</option>
            </select>
            <br />
            <label>Voting Time:</label>
            <select
              id="Voting Time Input"
              name="Voting Time"
              required
              disabled={isCreator}
              value={votingTime}
              onChange={handleVotingTimeChange}
            >
              <option value="10">10s</option>
              <option value="20">20s</option>
              <option value="30">30s</option>
              <option value="40">40s</option>
              <option value="50">50s</option>
              <option value="60">60s</option>
              <option value="90">90s</option>
              <option value="120">120s</option>
              <option value="150">150s</option>
              <option value="180">180s</option>
            </select>
            <br />
            <label>Languge:</label>
            <select
              id="langugeInput"
              name="langugeInput"
              required
              disabled={isCreator}
              value={language}
              onChange={handleLangugeChange}
            >
       
            </select>
            <br />
          </form>
                  {!isCreator && (
          <button
            className="lobby-start-button"
            onClick={handleGameStart}
            disabled={isCreator || playerNumber < 3}
          >
            Start
          </button>
)}
        </div>
        <p className="Lobby-playernumber">{playerNumber}/12</p>
          {playerNumber < 3 && (
          <p className="Lobby-minimal-playernumber">You need at least 3 players to start the game.</p>
        )}
        <div className="Lobby-player-list">

          {players.map((player, index) => (
            <div className="Lobby-player"key={player.playerName}>
              <img src={avatars[index]} alt="Avatar" />
              {player.playerID === uid ? (
                  <h3 className="Lobby-player-name">
                  <span style={{ backgroundColor: "yellow", display: "inline-block", padding: "0 5px" }}>
                    {player.playerName}
                  </span>
                  </h3>
                ) : (
                  <h3 className="Lobby-player-name">{player.playerName}</h3>
                )}
              
            </div>
          ))}
        </div>
        <div className="Lobby-invitation-link">
          <p>
            Einaldungslink: https://{window.location.hostname}:3000/room/
            {roomID}
          </p>
          <button onClick={copyToClipboard}>Link kopieren</button>
        </div>
      </div>
    );
  }

};
