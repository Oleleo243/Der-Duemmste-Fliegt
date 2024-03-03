import { signInAnonymously, updateProfile } from "firebase/auth";
import '../styles/Auth.css';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import { useState, useRef, useEffect, useContext } from "react";
import '../styles/Voting.css';



export const Voting = ({players}) => {

  useEffect(() => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa")
  }, []);

  
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
    <h1>Wähle einen Spieler zum Voten:</h1>
    {players.map((player) => (
      <div key={player.id}>
        <button onClick={() => handleVote(player)} disabled={selectedPlayer !== null}>
          {player.playerName}
        </button>
      </div>
    ))}
  </div>

  );
}