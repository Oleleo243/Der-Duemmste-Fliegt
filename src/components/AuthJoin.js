
import { signInAnonymously, updateProfile } from "firebase/auth";
import '../styles/Auth.css';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from "react-router-dom";
import '../styles/Home.css';
import {Auth} from "./Auth";
import {Lobby} from "./Lobby";
import Cookies from 'universal-cookie';
import {Chat} from "./Chat";
import { getDatabase, ref, set, push, hasChild, exists,get, update  } from "firebase/database";
import {getAuth,onAuthStateChanged, GoogleAuthProvider} from "firebase/auth"
import {db, auth, uid,} from '../firebase-config.js';
import { useState, useRef, useEffect, useContext } from "react";
import {AppContext} from "../App"

export const AuthJoin = (props) => {
  const {shouldJoin, setShouldJoin} = useContext(AppContext);
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
    if (roomData.playerNumber >= roomData.maxPlayerNumber) {
      alert("Max player limit reached");
      throw new Error("Max player limit reached");
    }

    // Füge den Benutzer dem Raum hinzu
    await set(ref(db, `rooms/${props.roomID}/players/${uid}`), {
      isCreator: false,
      playerName: auth.currentUser.displayName,
    });

    // Aktualisiere die playerNumber im Raum
    const newPlayerNumber = roomData.playerNumber + 1;
    await update(ref(db, `rooms/${props.roomID}`), {
    playerNumber: newPlayerNumber,
    });
    // sage der ui das der Prozess fertig ist
    setShouldJoin(false);
  }

  const signIn = async (data) => {
    const result = await signInAnonymously(auth);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name
      })
      props.setIsAuth(true);
      joinRoom();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="auth" onSubmit={handleSubmit(signIn)}>
      <h1 className="auth-heading">DER DÜMMSTE FLIEGT! 😜🤪</h1> 
      <input maxLength="20" placeholder="type name..." {...register("name")} />
      <p>{errors.name?.message}</p>
      <button type="submit"> play</button>
    </form>
  );
}