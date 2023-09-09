import {initGame, getRandomQuestion, timer} from '../utilities/gameFunctions'
import { useState, useRef, useEffect, useContext } from "react";
import '../styles/Game.css';
import {db, auth, uid} from '../firebase-config.js';
import {Intro} from "./Intro";
import {Outro} from "./Outro";
import { onValue,  getDatabase, ref, set, push, hasChild, exists,get,  serverTimestamp} from "firebase/database";


export const Game = ({isCreator, lives, rounds, time, playerNumber, setPlayerNumber, players, db, roomID}) => {
const [count, setCount] = useState(time);
const [round, setRound] = useState(0);
const [intro, setIntro] = useState(false);
const [outro, setOutro] = useState(false);
const [playerIsPlaying, setPlayerIsPlaying] = useState(1);
const [randomQuestion, setRandomQuestion] = useState("");
const [tmp, setTmp] = useState(0);
const [correctAnswer, setCorrectAnswer] = useState("");
const [myTurn, setMyTurn] = useState(false);
const [playerAnswer, setPlayerAnswer] = useState("");
const inputRef = useRef(null);
const [startedAt, setStartedAt] = useState(null);
let serverTimeOffset = 0;

//const [startedAt, setStartedAt] = useState(0);



    useEffect(() => {
      const timeOffListener = onValue( ref(db, ".info/serverTimeOffset"), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          serverTimeOffset = snapshot.val()
        }
      });

      const startAtRef = ref(db, 'rooms/' + roomID + '/status/startAt'); // Pfad zum ausgewählten Feld in der Realtime Database
      const startAtListener = onValue(startAtRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setStartedAt(data);
        }
      });
      
        initGame(roomID, lives, players, db);
        console.log("intro animation:" + "Spieler ist dran:" + "Frage");
        if(!isCreator){
          set(ref(db, 'rooms/' + roomID + '/status/startAt'), serverTimestamp());
        }

      /*
        const timeOffListener = onValue( ref(db, ".info/serverTimeOffset"), (snapshot) => {
            const data = snapshot.val();
            if (data) {
              serverTimeOffset = snapshot.val()
            }
          });
          const startAtRef = ref(db, 'rooms/' + roomID + '/status/startAt'); // Pfad zum ausgewählten Feld in der Realtime Database
          const startAtListener = onValue(startAtRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setStartedAt(data);
              console.log("DSAAAAAA")
            }
          });
          */
        const questionRef = ref(db, 'rooms/' + roomID + '/questions/question'); // Pfad zum ausgewählten Feld in der Realtime Database
        const questionListener = onValue(questionRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setRandomQuestion(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
          }
        });

        const correctAnswerRef = ref(db, 'rooms/' + roomID + '/questions/correctAnswer'); // Pfad zum ausgewählten Feld in der Realtime Database
        const correctAnswerListener = onValue(correctAnswerRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCorrectAnswer(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
          }
        });

        const playerAnswerRef = ref(db, 'rooms/' + roomID + '/questions/playerAnswer'); // Pfad zum ausgewählten Feld in der Realtime Database
        const playerAnswerListener = onValue(playerAnswerRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setPlayerAnswer(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
          }
        });

        // einfach jedes mal started ad aktuellisieren oder started ad -30
        const gameLoop = async () => {
/*
           for (let i = 1; i <= rounds; i++) {
                //console.log("RUNDE " + i);
                setRound(i);
                for(let j = 1; j <= playerNumber; j++){
                   // console.log("Player " + j);

                    setMyTurn(false);                        
                    setPlayerIsPlaying(j);
                    if(players[j-1].playerID === uid){                 
                        const tmp= getRandomQuestion();
                        await set(ref(db, 'rooms/' + roomID + '/questions/question'), tmp.frage);
                        await set(ref(db, 'rooms/' + roomID + '/questions/correctAnswer'), tmp.antwort);
                    }
                   // setIntro(true);
                    //await timer(5, setCount, startedAt, serverTimeOffset);

                    //setIntro(false);
                    //console.log("startedAt:" +startedAt + " serverTimeOffset: "+serverTimeOffset)
                    //await set(ref(db, 'rooms/' + roomID + '/status/startAt'), serverTimestamp());
                   // console.log( startedAt);
                    //await timer(time, setCount, startedAt, serverTimeOffset);
                    if(players[j-1].playerID === uid){
                        await set(ref(db, 'rooms/' + roomID + '/questions/playerAnswer'), inputRef.current.value);
                    }
                   set(ref(db, 'rooms/' + roomID + '/status/startAt'), serverTimestamp());

                    /*
                    await timer(5, setCount, startedAt, serverTimeOffset);
                    setOutro(true);
                    inputRef.current.value = "";
                    setPlayerAnswer("");
                    await timer(5, setCount, startedAt, serverTimeOffset);
                    setOutro(false);
                    
                }
            }
            */
         }
         
          
    }, []);

    useEffect(() => {
      const gameLoop = async () => {
        if (startedAt !== null) {
          console.log(round);
          setRound(round+1);
          await timer(time, setCount, startedAt, serverTimeOffset);
          console.log("outro animation:" + "Spieler ... gab ... Antwort")
          console.log("intro animation:" + "Spieler ist ... dran:" + "Frage: ...");
          if (!isCreator) {
            set(ref(db, 'rooms/' + roomID + '/status/startAt'), serverTimestamp());
          }
        }
      };
    
      gameLoop();
    }, [startedAt]);


    if(intro){
        return(<Intro player={players[playerIsPlaying-1]}  uid={uid} randomQuestion={randomQuestion}/>)
    }
    if(outro){
        return(<Outro randomQuestion={randomQuestion} correctAnswer={correctAnswer}/>)

    }

    if(!intro && !outro){
        return(
        <div>
            <div className = "InfoLeiste">
                <h1>{players[playerIsPlaying-1].playerName} is answering...</h1>
                <h1>{count}</h1>
                <h1>{round}/{rounds}</h1>
            </div>
            <div className="Players">
            {players.map((player, index) => (
                <div key={index}>
                    <h2>
                    Spieler{index + 1}:{" "}
                    {player.playerID === uid ? (
                        <span style={{ backgroundColor: "yellow" }}>
                        {player.playerName} (you){" "}
                        </span>
                    ) : (
                        player.playerName
                    )}
                    {index === playerIsPlaying - 1 && <span>←</span>}
                    <br />
                    {player.lives} Leben
                    </h2>
                </div>
                ))}
            </div>


            <div className="game">
                <h1>{randomQuestion}?</h1>
                <input type="text" value={playerAnswer} ref={inputRef} onChange={(e) => {setPlayerAnswer(e.target.value)}} ></input>
                <button >button</button>
            </div>
        </div>
        )}
    
    
}