import {db, auth, uid,} from '../firebase-config.js';
import { onValue,  getDatabase, ref, set, push, hasChild, exists,get } from "firebase/database";
import { AuthJoin } from "./AuthJoin";
import { useState, useRef, useEffect, useContext } from "react";
import {AppContext} from "../App"




export const Lobby = () => {
   
    const {shouldJoin, setShouldJoin} = useContext(AppContext);
    const [players, setPlayers] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const url = window.location.pathname;
    const parts = url.split('/');
    const roomID = parts[2];

   
    useEffect(() => {
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
      }, []);
      


    // bei release das davor packen https://
    const copyToClipboard = () => {
        const copyText = `${window.location.hostname}:3000/room/${roomID}`;
        navigator.clipboard.writeText(copyText);
      };

      // mit uid anstat isAuth ist eigentlic besser 
      if(  (shouldJoin)){
        return (
          <div>
            <AuthJoin roomID={roomID} setIsAuth = {setIsAuth}/>
          </div>
        );
      }

      if(!shouldJoin){
        return (<div>

          <h1>Game Settings</h1>
          <form id="gameSettingsForm">
            <label for="livesInput">Lives:</label>
            <select id="livesInput" name="lives" required disabled={isCreator} >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3" selected>3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>

            {/* Füge hier weitere Optionen hinzu */}
            </select>
            <br />
            <label for="roundsInput">Rounds untill Voting:</label>
            <select id="roundsInput" name="rounds" required  disabled={isCreator}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4" selected>4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>


            {/* Füge hier weitere Optionen hinzu */}
            </select>
            <br />
            <label for="timePerQuestionInput">Time per Question:</label>
            <select id="timePerQuestionInput" name="timePerQuestion" required disabled={isCreator} >
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="20">20s</option>
            <option value="30" selected>30s</option>
            <option value="40">40s</option>
            <option value="50">50s</option>
            <option value="60">60s</option>
            <option value="90">90s</option>
            <option value="120">120s</option>
            <option value="150">150s</option>
            <option value="180">180s</option>




            {/* Füge hier weitere Optionen hinzu */}
            </select>
            <br />
            <button type="submit" disabled={isCreator} >Start</button >
          </form>

            <h2>Folgende Spieler sind in der Lobby:</h2>
            {players.map((players) => 
                <h3 key ={uid}>{players.playerName}</h3>
            )}
            <p>Sende dien Code an andere Benutzer, damit sie dem Raum beitreten können:</p>
            <p>Einaldungslink: {window.location.hostname}:3000/room/{roomID}</p>
            <button onClick={copyToClipboard}>Link kopieren</button>
            </div>);
      }
        }

