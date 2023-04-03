import { useState, useRef } from "react";
import './App.css';
import {Auth} from "./components/Auth";
import Cookies from 'universal-cookie';
import {Chat} from "./components/Chat";


const cookies = new Cookies();


function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);
  
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
          <button onClick={() => setRoom(roomInputRef.current.value)}>Create Room</button>
          <button onClick={() => setRoom(roomInputRef.current.value)}>Join Room</button>
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
