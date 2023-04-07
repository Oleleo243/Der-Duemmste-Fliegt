import { useState, useRef } from "react";
import './App.css';
import {Auth} from "./components/Auth";
import Cookies from 'universal-cookie';
import {Chat} from "./components/Chat";
import {db, auth, uid,} from './firebase-config.js';
import { getDatabase, ref, set, push, hasChild, exists,get } from "firebase/database";



function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);
  const playerID = 1234;

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
    };
    await set(newRoomRef, newRoomData);
    setRoom(newRoomRef.key);
    return newRoomRef.key;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create room");
  }
}

async function joinRoom(roomName) {
  // Überprüfe, ob der Raum existiert
  const roomRef = ref(db, `rooms/${roomName}`);
  const roomSnapshot = await get(roomRef);
  if (roomSnapshot.val() === null) {
    throw new Error("Room does not exist");
  }

  // Überprüfe, ob der Benutzer bereits im Raum ist
  const playersRef = ref(db, `rooms/${roomName}/players`);
  const playersSnapshot = await get(playersRef);
  if (playersSnapshot.hasChild(uid)) {
    throw new Error("Already in room");
  }

  // Füge den Benutzer dem Raum hinzu
  await set(ref(db, `rooms/${roomName}/players/${uid}`), {
    isCreator: false,
    playerName: auth.currentUser.displayName,
  });

  setRoom(roomName);
}

  if(!isAuth){
    return (
      <div>
        <Auth setIsAuth = {setIsAuth}/>
      </div>
    );
  }

  if(room === null){
    return(
      <div className="room">
        <label>Enter Room Name</label>
        <input placeholder="Na los . . ." ref={roomInputRef}/>
        <div className="button-group">
          <button onClick={createRoom}>Create Room</button>
          <button onClick={() => joinRoom(roomInputRef.current.value)}>Join Room</button>       
        </div>
      </div>
    );
  }

  if(room !== null){
    return(
      <div><Chat room={room}/></div>
    );
  }
}

export default App;
