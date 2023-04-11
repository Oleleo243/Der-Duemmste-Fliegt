import {db, auth, uid,} from '../firebase-config.js';
import { onValue,  getDatabase, ref, set, push, hasChild, exists,get } from "firebase/database";
import { AuthJoin } from "./AuthJoin";
import { useState, useRef, useEffect, useContext } from "react";
import {AppContext} from "../App"
import '../styles/Lobby.css';





export const Lobby = () => {
    const [lives, setLives] = useState(3);
    const [rounds, setRounds] = useState(4);
    const [time, setTime] = useState(30);
    const {shouldJoin, setShouldJoin} = useContext(AppContext);
    const [players, setPlayers] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const url = window.location.pathname;
    const parts = url.split('/');
    const roomID = parts[2];

   
    useEffect(() => {
        // join Prozess
        if(shouldJoin){
          setIsCreator(true);
        }
        const playersRef = ref(db, 'rooms/' + roomID + '/players');
        const playersListener = onValue(playersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const playersArray = Object.entries(data).map(([playerID, playerData]) => {
              return { playerID: playerID, ...playerData };
            });
            setPlayers(playersArray);
          }
        });
        
        // sync game Settings
        const livesRef = ref(db, 'rooms/' + roomID + '/settings/lives'); // Pfad zum ausgewählten Feld in der Realtime Database
        const livesListener = onValue(livesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setLives(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
          }
        });
        const roundsRef = ref(db, 'rooms/' + roomID + '/settings/rounds'); // Pfad zum ausgewählten Feld in der Realtime Database
        const roundsListener = onValue(roundsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setRounds(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
          }
        });
        const timeRef = ref(db, 'rooms/' + roomID + '/settings/time'); // Pfad zum ausgewählten Feld in der Realtime Database
        const timeListener = onValue(timeRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setTime(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
          }
        });
        
      }, []);
      


    // bei release das davor packen https://
    const copyToClipboard = () => {
        const copyText = `${window.location.hostname}:3000/room/${roomID}`;
        navigator.clipboard.writeText(copyText);
      };

      const handleLivesChange = (e) => {
        set(ref(db, 'rooms/' + roomID + '/settings/lives'), e.target.value);
        setLives(e.target.value);
      };

      const handleRoundsChange = (e) => {
        set(ref(db, 'rooms/' + roomID + '/settings/rounds'), e.target.value);
        setRounds(e.target.value);
      };

      const handleTimeChange = (e) => {
        set(ref(db, 'rooms/' + roomID + '/settings/time'), e.target.value);
        setTime(e.target.value);
      };
      
      // mit uid anstat isAuth ist eigentlic besser 
      if(  (shouldJoin)){
        return (
          <div>
            <AuthJoin roomID={roomID} setIsAuth = {setIsAuth}/>
          </div>
        );
      }



      if (!shouldJoin) {
        return (
          <div className="lobby-container" >
            <div className="lobby-box">
            <h1 className="lobby-title" >Game Settings</h1>
            
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
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
              <br />
              <label>Time per Question:</label>
              <select
                id="timePerQuestionInput"
                name="timePerQuestion"
                required
                disabled={isCreator}
                value={time}
                onChange={handleTimeChange}
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
              <button className="lobby-start-button" type="submit" disabled={isCreator}>
                Start
              </button>
            </form>
            </div>

            <div className="Players">
            <h2>Spielerliste:</h2>
             {players.map((player, index) => (
              <h3 key={index}>{player.playerName}</h3>
            ))}
            </div>
            <div>
            <p>Einaldungslink: {window.location.hostname}:3000/room/{roomID}</p>
            <button onClick={copyToClipboard}>Link kopieren</button>
            </div>
          </div>

          
              
        );
      }
      
      
        }

