import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import {AppContext} from "../App"
import '../styles/Home.css';
import {Auth} from "./Auth";
import {Lobby} from "./Lobby";
import Cookies from 'universal-cookie';
import {Chat} from "./Chat";
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
      const newRoomRef = await push(ref(db, "rooms/"));
      const newRoomData = {
        players: {
          [uid]: {
            isCreator: true,
            playerName: auth.currentUser.displayName,
          },
        },
        hasStarted: false,
        playerNumber: 1,
        maxPlayerNumber: 12,
      };
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
        <label>Enter Room Name</label>
        <div className="button-group">
          <button onClick={createRoom}>Create Room</button>
        </div>
      </div>
    );
  }

  if(roomID !== null){
    return(
      <div><Lobby roomID={roomID}/></div>
    );
  }
}