
import { signInAnonymously,signOut, updateProfile } from "firebase/auth";
import '../styles/Auth.css';
import '../styles/Auth-grid.css';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from "react-router-dom";
import {Auth} from "./Auth";
import {Lobby} from "./Lobby";
import Cookies from 'universal-cookie';
import { getDatabase, ref, set, push, hasChild, exists,get, update  } from "firebase/database";
import {getAuth,onAuthStateChanged, GoogleAuthProvider} from "firebase/auth"
import {db, auth, uid,} from '../firebase-config.js';
import { useState, useRef, useEffect, useContext } from "react";
import {AppContext} from "../App"

export const AuthJoin = (props) => {
  const maxPlayerNumber = 12;

  //const {shouldJoin, setShouldJoin} = useContext(AppContext);
  const schema = yup.object().shape({
    name: yup.string().required("Please write a Nickname"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  async function joinRoom() {
    // Überprüfe, ob der Raum existiert
    const roomRef = ref(db, `rooms/${props.roomID}`);
    const roomSnapshot = await get(roomRef);
    if (roomSnapshot.val() === null) {
        // console.log("wenn es jetzt klappt gibt es einen Gott")
      alert("Room does not exist");
      throw new Error("Room does not exist");
    }
    // Überprüfe, ob der Benutzer bereits im Raum ist
    const playersRef = ref(db, `rooms/${props.roomID}/players`);
    const playersSnapshot = await get(playersRef);

    
    if (playersSnapshot.hasChild(uid)) {
      alert("Already in room");
      throw new Error("Already in room");
    }
    

    // Überprüfe, ob die maximale Anzahl von Spielern erreicht ist
    const roomData = roomSnapshot.val();
    if (roomData.status.playerNumber >= maxPlayerNumber) {
      alert("Max player limit reached");
      throw new Error("Max player limit reached");
    }

    // Überprüfe, ob das Spiel bereits gestartet wurde
    if (roomData.status.hasStarted) {
      alert("Game already started");
      throw new Error("Game already started");
    }

    // Füge den Benutzer dem Raum hinzu
    await set(ref(db, `rooms/${props.roomID}/players/${uid}`), {
      isCreator: false,
      playerName: auth.currentUser.displayName,
      lives: 3,
    });

    // Aktualisiere die playerNumber im Raum
    const newPlayerNumber = roomData.status.playerNumber + 1;
    await update(ref(db, `rooms/${props.roomID}/settings`), {
    playerNumber: newPlayerNumber,
    });
    // sage der ui das der Prozess fertig ist
    props.setShouldJoin(false);
  }

  
  const signIn = async (data) => {
    try {
      const result = await signInAnonymously(auth);
      console.log('Signed in anonymously with UID:', result.user.uid);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name
      })
              // console.log("ich will dochn ur schlafen")

      props.setIsAuth(true);
      joinRoom();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="auth" onSubmit={handleSubmit(signIn)}>
      <h1 className="auth-heading">DER DÜMMSTE FLIEGT! 😜🤪</h1> 
      <input className="auth-input"maxLength="14" placeholder="type name..." {...register("name")} />
      <p className="auth-error">{errors.name?.message}</p>
      <button className="auth-button" type="submit">join</button>
    </form>
  );
}