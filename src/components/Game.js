import {initGame, getRandomQuestion, timer} from '../utilities/gameFunctions'
import { useState, useRef, useEffect, useContext } from "react";
import '../styles/Game.css';
import {db, auth, uid} from '../firebase-config.js';
import { onValue,  getDatabase, onChildChanged, ref, set, push, hasChild, exists,get,  serverTimestamp} from "firebase/database";
import { Voting } from "./Voting";
import { createAvatar } from '@dicebear/core';
import { avataaars, lorelei } from '@dicebear/collection';
import { useMemo } from 'react';

let dummyCounter = 0;
console.log("dummyCounter wird 0 gesetzt");


export const Game = ({isCreator, lives, rounds, time, playerNumber, setPlayerNumber, players, db, roomID}) => {
const [count, setCount] = useState(time);
const [round, setRound] = useState(1);
const [answerInDB, setAnswerInDB] = useState(0);
const penis = 12;
const [voting, setVoting] = useState(false);
const [votingNumber, setVotingNumber] = useState(1);
const [playerIsPlaying, setPlayerIsPlaying] = useState(1);
const [randomQuestion, setRandomQuestion] = useState("");
const [tmp, setTmp] = useState(1);

const [correctAnswer, setCorrectAnswer] = useState("");
const [myTurn, setMyTurn] = useState(false);
const [playerAnswerInput, setPlayerAnswerInput] = useState("");
const inputRef = useRef(null);
const [startedAt, setStartedAt] = useState(null);
const [listenerSet, setListenerSet] = useState(false); // State-Flag hinzugefügt
let serverTimeOffset = 0;
const [playerCounter, setPlayerCounter] = useState(0);
const [intervalID, setIntervalID] = useState(0);

//const [startedAt, setStartedAt] = useState(0);


let timerId; // Variable, um die ID des Intervals zu speichern
let startTime; // Variable, um den Startzeitpunkt des Timers zu speichern

const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

const avatars = useMemo(() => {
  return players.map(player => createAvatar(avataaars, {
    size: 50,
    seed: player.playerName,
  }).toDataUriSync());
}, [players]);

const timer = (time, setCount, startAt, serverTimeOffset) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      setIntervalID(interval);
      //console.log("intervalid1: " + intervalID);
      const timeLeft = (time * 1000) - (Date.now() - startAt - serverTimeOffset);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCount(0.0);
        resolve(); // Resolve the Promise when the timer completes
      } else {
        //setCount(parseFloat(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`));
        setCount(Math.floor(timeLeft / 1000)); // Zeile geändert
      }
    }, 100);
  });
};


    useEffect(() => {
      console.log("ain usefect anach oder daor?");
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
        }
      });

      
  
      //const AnswerInDBRef = ref(db, 'rooms/' + roomID + '/history'); // Pfad zum ausgewählten Feld in der Realtime Database
      const AnswerInDBRef = ref(db, 'rooms/' + roomID + '/questions/playerAnswer'); // Pfad zum ausgewählten Feld in der Realtime Database

      const AnswerInDBListener = onValue(AnswerInDBRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // erhöhe um andere useEffect zu triggern
            console.log("empfangenen dummy: "+ data.dummy)
                      // aktuellisiere damit nicht zwei mal das selbe in firebase database geschrieben wird und firebase onValueTriggered

            dummyCounter = data.dummy;

            setAnswerInDB(currentTmp => {
            return currentTmp +1
          });
          
          
        }
      });
        //console.log("intro animation:" + "Spieler ist dran:" + "Frage");
        //setStartedAt(serverTimestamp());
        if(!isCreator){
          initGame(roomID, lives, players, db);

          set(ref(db, 'rooms/' + roomID + '/status/startAt'), serverTimestamp());
        }



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
            //setPlayerAnswerInput(data.Answer); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
            setPlayerAnswerInput("");
          }
        });

        // einfach jedes mal started ad aktuellisieren oder started ad -30
       // const gameLoop = async () => {
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
        // }
         
          
    }, []);
    
    useEffect(() => {
      console.log("oleeeeee");
      const gameLoop = async () => {
        // checkt ob ich dran bin
        setMyTurn(false);                        
          if(players[playerCounter].playerID === uid){    
            setMyTurn(true);                                     
          }
    
        // sucht fragen raus                    
        if(!isCreator){                 
            const tmp= getRandomQuestion();
            await set(ref(db, 'rooms/' + roomID + '/questions/question'), tmp.frage);
            await set(ref(db, 'rooms/' + roomID + '/questions/correctAnswer'), tmp.antwort);
        }

        console.log("intro animation:" + "Spieler ist ... dran:" + "Frage: ...");
        await timer(time, setCount, startedAt, serverTimeOffset);
        console.log("send Answer wird im gameLoop aufgerufen")
        sendAnswer();      };
      // serverTimestamp() gibt 2 triggers vom listener mit der lokalen und mit der server Zeit deswegen braucht man das
      if(startedAt !== null){
          if (!isCreator) {
          if(tmp === 2){
            gameLoop();
            setTmp(currentTmp => {
              return currentTmp + -1
            });
          }
          else{
            setTmp(currentTmp => {
              return currentTmp +1
            });
          }
        }
        else{
          console.log("der gameloop wird gecalled");
          gameLoop();
        }
      }
    }, [startedAt]);

 
    useEffect(() => {
    if(answerInDB !== 0){
    const finishRound = async() => {
      console.log("finish Round wurde aufgerufen")
      clearInterval(intervalID);


      setCount(0);
      


      // manage wer dran ist und runden
      // das verursacht wahrscheinlich manchmal ein bug falls die timer zeit klein ist weil setPlayerCounter asynchron ist und deswegen nicht schnell genug aktuellisiert bevoir es wieder beim if statement ist. Der Bugg ewnsteht also durch das oberste if statement und lässt sich durch ein weiteres use effect verhindern 
      if(playerNumber <= (playerCounter + 1)){
       setPlayerCounter(0);
       if((round+1) > rounds){
         setVoting(true);
         return;
         console.log("Dinosaurier");
       }else{
         setRound(currentRound => {
           return currentRound + 1
         });
     }

     }else{
       setPlayerCounter(currentPlayerCounter => {
       return currentPlayerCounter + 1;
     });
      
     }
          // starte neuen loop

      if (!isCreator) {
        // warte 3s bevor nächster spieler dran ist
        await wait(3000);
        
        await set(ref(db, 'rooms/' + roomID + '/status/startAt'), serverTimestamp());
       }
    };
    
    console.log(answerInDB);
    finishRound();
  }
  }, [answerInDB]);

  const sendAnswer = async() => {
    console.log("send Answer Funktion wurde aufgerufen");
    const personalHistory = {
      Question: randomQuestion, // Passe den Nachrichtentext an
      Answer: inputRef.current.value,
    };
    //delete answer from input field

    // send to database
    await set(ref(db, 'rooms/' + roomID + '/history/Voting' + votingNumber + '/' + uid + '/question' + round), personalHistory);

    // erhöhe AnswerCounter
    console.log("DummyCounter pre:" + dummyCounter);
    dummyCounter ++;
    console.log("DummyCounter post:" + dummyCounter);

    const currAnswer = {
      Answer: inputRef.current.value,
      dummy: dummyCounter, 
    };

    const currEmptyAnswer = {
      Answer: "nothing",
      dummy: dummyCounter, 
    };
    if(inputRef.current.value === null || inputRef.current.value === ""){
      await set(ref(db, 'rooms/' + roomID + '/questions/playerAnswer'), currEmptyAnswer);
    }else{
      await set(ref(db, 'rooms/' + roomID + '/questions/playerAnswer'), currAnswer);
    }
    //delete answer from input field
    setPlayerAnswerInput("");

  }
  
    if(!voting){
        return(
        <div>
            <div className = "InfoLeiste">
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
                    {index === playerCounter && <span>←</span>}
                    <br />
                    {player.lives} Leben
                    <img src={avatars[index]} alt="Avatar" />

                    </h2>
                </div>
                ))}
            </div>


            <div className="game">
                <h1>{players[playerCounter].playerName}</h1>
                <h1>{randomQuestion}?</h1>
                {myTurn && (
                <div>
                    <input type="text" id="meinInputFeld" value={playerAnswerInput} placeholder="schreib!" ref={inputRef} onChange={(e) => {setPlayerAnswerInput(e.target.value)}} ></input>
                  <button onClick={sendAnswer} disabled={!(players[playerCounter].playerID === uid)}>button</button>
                </div>
)}

            </div>
        </div>
        )}
    if(voting){
      return(
        <div><Voting players={players}/></div>
      );
    }
    
}