import {initGame} from '../utilities/gameFunctions'
import { useState, useRef, useEffect, useContext } from "react";

export const Game = ({lives, rounds, time, playerNumber, setSlayerNumber, players, db, roomID}) => {
    useEffect(() => {
        initGame(roomID, lives, players, db);
        console.log(players);
    }, []);
    
    return(
    <div>
        <h1>test</h1>
    </div>
    )}