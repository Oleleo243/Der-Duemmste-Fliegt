import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../App.js";
import { Lobby } from "./Lobby.js";
import Cookies from "universal-cookie";
import {
  getDatabase,
  ref,
  set,
  push,
  hasChild,
  exists,
  get,
} from "firebase/database";
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { db, auth, uid } from "../firebase-config.js";
import { signInAnonymously, updateProfile } from "firebase/auth";
import "../styles/Auth.css";
import '../styles/Auth-grid.css';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars, lorelei } from "@dicebear/collection";
import { getRandomBoolean } from "../utilities/helperFunctions.js";

export const Home = () => {
  const { shouldJoin, setShouldJoin } = useContext(AppContext);
  const [isAuth, setIsAuth] = useState(false);
  const [errorMessage, setIsErrorMessage] = useState(false);

  const [roomID, setRoomID] = useState(null);
  const roomInputRef = useRef(null);
  let navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup.string().required("Please write a Nickname"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const signIn = async (data) => {
    const result = await signInAnonymously(auth);
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
      });
      setIsAuth(true);
      createRoom();
    } catch (err) {
      console.error(err);
    }
  };

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
        questions: {
          question: "",
          correctAnswer: "",
          playerAnswer: "",
        },
        status: {
          hasStarted: false,
          playerNumber: 1,
        },
        settings: {
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



  if (!isAuth || roomID === null) {
    return (
      <form className="auth" onSubmit={handleSubmit(signIn)}>
      <h1 className="auth-heading">Kick the Fool</h1>
      <input className="auth-input" maxLength="12" placeholder="type name..." {...register("name")} />
      <p className="auth-error">{errors.name?.message}</p>
      <button className="auth-button"type="submit" >create Room</button>
    </form>
    )
  }

  if (roomID !== null) {
    return (
      <div>
        <Lobby roomID={roomID} />
      </div>
    );
  }
};
