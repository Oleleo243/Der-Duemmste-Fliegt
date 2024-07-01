import { signInAnonymously, updateProfile } from "firebase/auth";
import "../styles/Auth.css";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef, useEffect, useContext } from "react";
import { LastAnswer } from "./sections/LastAnswer";
import { avataaars, lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { db, auth, uid } from "../firebase-config.js";
import { renderBrains, waitForever, wait, avatars, getPlayerIndexById  } from "../utilities/helperFunctions.js";
import { FaHandPointLeft } from 'react-icons/fa'; // Importing the hand pointing left icon from FontAwesome
import { FaRegHandPointLeft } from "react-icons/fa6";
import { VotingPlayerAvatarTooltip } from "./sections/VotingPlayerAvatarTooltip";



import {
  onValue,
  getDatabase,
  onChildChanged,
  ref,
  set,
  update,
  push,
  hasChild,
  exists,
  get,
  serverTimestamp,
} from "firebase/database";
import { HoverHistory } from "./sections/HoverHistory.js";

import "../styles/Voting.css";

export const Voting = ({ players, votingNumber, roomID,   setPlayers, isCreator
}) => {
  const votingTime = 30;
  const [votingData, setVotingData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [intervalID, setIntervalID] = useState(0);
  const [count, setCount] = useState(votingTime);
  const [votingPhase, setVotingPhase] = useState("Voting Ends In: ");

  
  let serverTimeOffset = 0;




  const avatars = useMemo(() => {
    return players.map((player) =>
      createAvatar(avataaars, {
        size: 70,
        seed: player.playerName,
      }).toDataUriSync()
    );
  }, [players]);

  const timer = (time, setCount, startAt, serverTimeOffset) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setIntervalID(interval);
        //console.log("intervalid1: " + intervalID);
        const timeLeft =
          time * 1000 - (Date.now() - startAt - serverTimeOffset);
        if (timeLeft <= 0) {
          clearInterval(interval);
          setCount(0.0);
          resolve(); // Resolve the Promise when the timer completes
        } else {
          //setCount(parseFloat(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`));
          setCount(Math.floor(timeLeft / 1000)); // Zeile geändert
        }
      }, 100);
    });
  };

  
  useEffect(() => {
    const timeOffListener = onValue(
      ref(db, ".info/serverTimeOffset"),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          serverTimeOffset = snapshot.val();
        }
      }
    );

    const startAtRef = ref(db, "rooms/" + roomID + "/status/startAt"); // Pfad zum ausgewählten Feld in der Realtime Database
    const startAtListener = onValue(startAtRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStartedAt(data);
      }
    });

    if (!isCreator) {
      set(ref(db, "rooms/" + roomID + "/status/startAt"), serverTimestamp());
    }

    async function fetchVotingData() {
      try {
        const votingRef = ref(
          db,
          "rooms/" + roomID + "/history/Voting" + votingNumber
        );
        const snapshot = await get(votingRef);

        if (snapshot.exists()) {
          const votingData = snapshot.val();
          setVotingData(votingData);
        } else {
          console.log("Keine Daten für das angegebene Voting gefunden.");
        }
      } catch (error) {
        console.error("Fehler beim Lesen des Votings:", error);
      }
    }
      fetchVotingData();

      const playersRef = ref(db, "rooms/" + roomID + "/players");
      const playersListener = onValue(playersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const playersArray = Object.entries(data).map(([playerID, playerData]) => {
            const votedBy = playerData.votedBy ? Object.keys(playerData.votedBy) : [];
            return { playerID: playerID, ...playerData, votedBy: votedBy };
          });
          setPlayers(playersArray);
        }
      });
      
      // starts voting process
      set(ref(db, "rooms/" + roomID + "/status/startAt"), serverTimestamp());

  }, []);

  useEffect(() => {
    const votingProcess = async () => {
      await timer(votingTime, setCount, startedAt, serverTimeOffset);
      console.log("test");
      setVotingPhase("Proceeding In: ")
      await timer(5, setCount, startedAt, serverTimeOffset);

    }

    votingProcess();
  }, [startedAt]);

  const  voteForPlayer = async (playerID) => {
    
    setHasVoted(true);
    // add vote to database
    await set(ref(db, `rooms/${roomID}/players/${playerID}/votedBy/${uid}`), true);

  };

  return (
    <div className="Voting-container">
    <h1 className="Voting-time" >{votingPhase}{count}</h1>

    <div className="Voting-player-list">
    
    {players.map((player, index) => (
      <div className="Voting-player"key={player.playerName}>
        <div className="Voting-player-avatar-container">
              <img className="Voting-player-avatar" src={avatars[index]} alt="Avatar" />
              {votingData && (
                  <VotingPlayerAvatarTooltip votingData={votingData} playerID={player.playerID} />

              )}
              
                
            </div>
              <h3 className="Voting-player-name">
                {player.playerID === uid ? (
                  <span style={{ backgroundColor: "yellow" }}>
                    {player.playerName} {" "}
                  </span>
                ) : (
                  player.playerName
                )}
                <br />
                {renderBrains(player.lives)}
              </h3>
              {player.votedBy.length > 0 && (
              <div className="Voting-voters-list">
                {player.votedBy.map((voterID) => (
                  <span key={voterID} className="Voter-id">
                    
                     <img className="Voting-voted-by-avatar" src={avatars[getPlayerIndexById(voterID, players)]} alt="Avatar" /> 

                  </span>
                ))}
              </div>
            )}
              {player.playerID !== uid && (              
                <button      disabled={hasVoted} className="Voting-button" onClick={() => voteForPlayer(player.playerID)} >
                <FaRegHandPointLeft className="Voting-point-left-icon" />
              </button>
              )}
      </div>
    ))}
  </div>
  </div>

  )
  /*
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [votingData, setVotingData] = useState(null);

  const avatars = useMemo(() => {
    return players.map((player) =>
      createAvatar(avataaars, {
        size: 50,
        seed: player.playerName,
      }).toDataUriSync()
    );
  }, [players]);

  useEffect(() => {
    async function fetchVotingData() {
      try {
        const votingRef = ref(
          db,
          "rooms/" + roomID + "/history/Voting" + votingNumber
        );
        const snapshot = await get(votingRef);

        if (snapshot.exists()) {
          const votingData = snapshot.val();
          setVotingData(votingData);
        } else {
          console.log("Keine Daten für das angegebene Voting gefunden.");
        }
      } catch (error) {
        console.error("Fehler beim Lesen des Votings:", error);
      }
    }

    fetchVotingData();
  }, []);

  useEffect(() => {
    console.log(votingData);
  }, [votingData]);

  const initialPlayers = [
    { playerName: "Spieler 1", id: 1 },
    { playerName: "Spieler 2", id: 2 },
    { playerName: "Spieler 3", id: 3 },
    // Weitere Spieler hinzufügen
  ];

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleVote = (player) => {
    if (selectedPlayer === null) {
      setSelectedPlayer(player);
      // Hier die Logik für die Speicherung des Votings implementieren
      console.log(`Du hast für ${player.playerName} gestimmt.`);
    } else {
      console.log("Du hast bereits abgestimmt.");
    }
  };
  return (
    <div>
      {players.map((player, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <button>
            {player.playerName}
            <br />
            {player.lives} Leben
            <img src={avatars[index]} alt="Avatar" />
          </button>
          {hoveredIndex === index && (
            <div className="hovered-text">
              {/* player.playerID */}
              {/*votingData && votingData[player.playerID].question1.Answer*/}
              /*
              {votingData && (
                <HoverHistory data={votingData[player.playerID]} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
*/
