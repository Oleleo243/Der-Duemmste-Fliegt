import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import {AppContext} from "../App"
import '../styles/Home.css';
import {Auth} from "./Auth";
import {Lobby} from "./Lobby";
import Cookies from 'universal-cookie';
import { getDatabase, ref, set, push, hasChild, exists,get } from "firebase/database";
import {getAuth,onAuthStateChanged, GoogleAuthProvider} from "firebase/auth"
import {db, auth, uid,} from '../firebase-config.js';


export const Home = () => {
  const {shouldJoin, setShouldJoin} = useContext(AppContext);
  const [isAuth, setIsAuth] = useState(false);
  const [roomID, setRoomID] = useState(null);
  const roomInputRef = useRef(null);
  let navigate = useNavigate();


//überprüfe ob es ein EInladungslink ist

// Generiere einen neuen Raum
async function createRoom() {
    try {
      // console.log("es amcht keinen sinn")
      const newRoomRef = await push(ref(db, "rooms/"));
      const newRoomData = {
        players: {
          [uid]: {
            isCreator: true,
            playerName: auth.currentUser.displayName,
            lives: 3,
          },
        },
        status: {
          hasStarted: false,
          playerNumber: 1,
        },
        settings: {
          maxPlayerNumber: 12,
          lives: 3,
          rounds: 4,
          time: 30,
        },
      };
      // console.log("es muss doch klappen")
      await set(newRoomRef, newRoomData);
      setRoomID(newRoomRef.key);
      setShouldJoin(false);
      navigate(`/room/${newRoomRef.key}`);
      
      return newRoomRef.key;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create room");
    }
  }




 if(!isAuth){
    return (
      <div>
        <Auth setIsAuth = {setIsAuth}/>
      </div>
    );
  }

  if(roomID === null){
    return(
      
      <div className="room">
          <a href="#" class="rainbow-button" alt="create room" onClick={createRoom}>
</a>
      </div>
    );
  }

  if(roomID !== null){
    return(
      <div><Lobby roomID={roomID}/></div>
    );
  }
}