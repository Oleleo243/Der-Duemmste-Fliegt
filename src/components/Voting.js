import { signInAnonymously, updateProfile } from "firebase/auth";
import '../styles/Auth.css';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import { useState, useRef, useEffect, useContext } from "react";
import { LastAnswer } from "./sections/LastAnswer";
import { avataaars, lorelei } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { useMemo } from 'react';
import {db, auth, uid} from '../firebase-config.js';
import { onValue,  getDatabase, onChildChanged, ref, set, push, hasChild, exists,get,  serverTimestamp} from "firebase/database";
import { HoverHistory } from "./sections/HoverHistory.js";

import '../styles/Voting.css';



export const Voting = ({players, votingNumber, roomID}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [votingData, setVotingData] = useState(null);

  const avatars = useMemo(() => {
    return players.map(player => createAvatar(avataaars, {
      size: 50,
      seed: player.playerName,
    }).toDataUriSync());
  }, [players]);


  useEffect(() => {
    async function fetchVotingData() {
      try {
        const votingRef = ref(db, 'rooms/' + roomID + '/history/Voting' + votingNumber);
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
    { playerName: 'Spieler 1', id: 1 },
    { playerName: 'Spieler 2', id: 2 },
    { playerName: 'Spieler 3', id: 3 },
    // Weitere Spieler hinzufügen
  ];

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleVote = (player) => {
    if (selectedPlayer === null) {
      setSelectedPlayer(player);
      // Hier die Logik für die Speicherung des Votings implementieren
      console.log(`Du hast für ${player.playerName} gestimmt.`);
    } else {
      console.log('Du hast bereits abgestimmt.');
    }
  };
  return (
    <div>
      {players.map((player, index) => (
        <div key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
          <button>
            {player.playerName}
            <br />
            {player.lives} Leben
            <img src={avatars[index]} alt="Avatar" />
          </button>
          {hoveredIndex === index && (
            <div className="hovered-text">
              {/* player.playerID */ }
               {/*votingData && votingData[player.playerID].question1.Answer*/} 
              {votingData && <HoverHistory data = {votingData[player.playerID]}/>} 

            </div>
          )}
        </div>
      ))}
    </div>
  );
  
}