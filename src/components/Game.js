import { initGame, getRandomQuestion, timer } from "../utilities/gameFunctions";
import { useState, useRef, useEffect, useContext } from "react";
import { renderBrains, waitForever, wait, avatars  } from "../utilities/helperFunctions.js";
import "../styles/Game.css";
import "../styles/Game-grid.css";
import { db, auth, uid } from "../firebase-config.js";
import {
  onValue,
  getDatabase,
  onChildChanged,
  ref,
  set,
  push,
  hasChild,
  exists,
  get,
  serverTimestamp,
} from "firebase/database";
import { Voting } from "./Voting";
import { createAvatar } from "@dicebear/core";
import { avataaars, lorelei } from "@dicebear/collection";
import { RandomQuestion } from "./sections/RandomQuestion";
import { LastAnswer } from "./sections/LastAnswer";
import { motion } from "framer-motion";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useMemo } from "react";

let dummyCounter = 0;
let firstGameInit = true;
//console.log("dummyCounter wird 0 gesetzt");

export const Game = ({
  isCreator,
  lives,
  rounds,
  questionTime,
  votingTime,
  playerNumber,
  players,
  db,
  roomID,
  setPlayers,
  setShowVoting,
  votingNumber,
  setVotingNumber,
}) => {
  const [count, setCount] = useState(questionTime);
  const [round, setRound] = useState(1);
  const [answerInDB, setAnswerInDB] = useState(0);
  const [voting, setVoting] = useState(false);
  const [playerIsPlaying, setPlayerIsPlaying] = useState(1);
  const [randomQuestion, setRandomQuestion] = useState("");
  const [tmp, setTmp] = useState(1);

  const [showLastAnswer, setShowLastAnswer] = useState(false);
  const [lastAnswer, setLastAnswer] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState("");
  const [myTurn, setMyTurn] = useState(false);
  const [playerAnswerInput, setPlayerAnswerInput] = useState("");
  const inputRef = useRef(null);
  const [startedAt, setStartedAt] = useState(null);
  const [listenerSet, setListenerSet] = useState(false); // State-Flag hinzugefügt
  let serverTimeOffset = 0;
  const [playerCounter, setPlayerCounter] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [intervalID, setIntervalID] = useState(0);

  //const [startedAt, setStartedAt] = useState(0);

  let timerId; // Variable, um die ID des Intervals zu speichern
  let startTime; // Variable, um den Startzeitpunkt des Timers zu speichern



  const avatars = useMemo(() => {
    return players.map((player) =>
      createAvatar(avataaars, {
        size: 50,
        seed: player.playerName,
      }).toDataUriSync()
    );
  }, [players]);

  const timer = (time, setCount, startAt, serverTimeOffset) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setIntervalID(interval);
        //console.log("intervalid1: " + intervalID);
        const timeLeft =
          time * 1000 - (Date.now() - startAt - serverTimeOffset);
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
    console.log("Seite Wird gerendert");
    const timeOffListener = onValue(
      ref(db, ".info/serverTimeOffset"),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          serverTimeOffset = snapshot.val();
        }
      }
    );

    const startAtRef = ref(db, "rooms/" + roomID + "/status/startAt"); // Pfad zum ausgewählten Feld in der Realtime Database
    const startAtListener = onValue(startAtRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStartedAt(data);
      }
    });

    //const AnswerInDBRef = ref(db, 'rooms/' + roomID + '/history'); // Pfad zum ausgewählten Feld in der Realtime Database
    const AnswerInDBRef = ref(
      db,
      "rooms/" + roomID + "/questions/playerAnswer"
    ); // Pfad zum ausgewählten Feld in der Realtime Database

    const AnswerInDBListener = onValue(AnswerInDBRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // erhöhe um andere useEffect zu triggern
        //console.log("empfangenen dummy: "+ data.dummy)
        // aktuellisiere damit nicht zwei mal das selbe in firebase database geschrieben wird und firebase onValueTriggered

        dummyCounter = data.dummy;

        setAnswerInDB((currentTmp) => {
          return currentTmp + 1;
        });
        setLastAnswer(data.Answer);
        setShowLastAnswer(true);
      }
    });
    //console.log("intro animation:" + "Spieler ist dran:" + "Frage");
    //setStartedAt(serverTimestamp());
    if (!isCreator) {
      initGame(roomID, lives, players, db);

      set(ref(db, "rooms/" + roomID + "/status/startAt"), serverTimestamp());
    }

    const questionRef = ref(db, "rooms/" + roomID + "/questions/question"); // Pfad zum ausgewählten Feld in der Realtime Database
    const questionListener = onValue(questionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const helperFunction1 = async () => {
          setRandomQuestion(""); // damit im neuen nicht kurz noch die alte frage steht
          await wait(1000);
          setRandomQuestion(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
        };
        helperFunction1();
      }
    });

    const correctAnswerRef = ref(
      db,
      "rooms/" + roomID + "/questions/correctAnswer"
    ); // Pfad zum ausgewählten Feld in der Realtime Database
    const correctAnswerListener = onValue(correctAnswerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCorrectAnswer(data); // Aktualisiere den Wert im State mit dem Wert aus der Datenbank
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
    const gameLoop = async () => {
      console.log("firstGameInit1 " + firstGameInit);
      if (!firstGameInit) {
        setShowLastAnswer(false);

        // manage wer dran ist und runden
        // das verursacht wahrscheinlich manchmal ein bug falls die timer zeit klein ist weil setPlayerCounter asynchron ist und deswegen nicht schnell genug aktuellisiert bevoir es wieder beim if statement ist. Der Bugg ewnsteht also durch das oberste if statement und lässt sich durch ein weiteres useEffect() verhindern
        if (playerNumber <= playerCounter + 1) {
          setPlayerCounter(0);
          if (round + 1 > rounds) {
            setShowVoting(true);
            return;
          } else {
            console.log("RUNDE ERHÖHT");

            setRound((currentRound) => {
              return currentRound + 1;
            });
          }
        } else {
          setPlayerCounter((currentPlayerCounter) => {
            return currentPlayerCounter + 1;
          });
        }
      }
      firstGameInit = false;
      console.log("firstGameInit2 " + firstGameInit);

      // sucht fragen raus
      if (!isCreator) {
        const tmp = getRandomQuestion(randomQuestion);
        await set(
          ref(db, "rooms/" + roomID + "/questions/question"),
          tmp.frage
        );
        await set(
          ref(db, "rooms/" + roomID + "/questions/correctAnswer"),
          tmp.antwort
        );
      }

      //console.log("intro animation:" + "Spieler ist ... dran:" + "Frage: ...");
      setLastAnswer("aaaaaaaaaaa")
      await timer(questionTime, setCount, startedAt, serverTimeOffset);
      console.log("game timer")
      sendAnswer();
    };
    // serverTimestamp() gibt 2 triggers vom listener mit der lokalen und mit der server Zeit deswegen braucht man das
    if (startedAt !== null) {
      if (!isCreator) {
        if (tmp === 2) {
          gameLoop();
          setTmp((currentTmp) => {
            return currentTmp + -1;
          });
        } else {
          setTmp((currentTmp) => {
            return currentTmp + 1;
          });
        }
      } else {
        //console.log("der gameloop wird gecalled");
        gameLoop();
      }
    }
  }, [startedAt]);

  useEffect(() => {
    // checkt ob ich dran bin
    setMyTurn(false);
    if (players[playerCounter].playerID === uid) {
      setMyTurn(true);
    }
    // aktuelisiere Spieler der dran sit
    setPlayerName(players[playerCounter].playerName);
  }, [playerCounter]);

  useEffect(() => {
    if (answerInDB !== 0) {
      const finishRound = async () => {
        setCount(0);

        // starte neuen loop
        clearInterval(intervalID);

        if (!isCreator) {
          // warte 5s bevor nächster spieler dran ist
          await wait(5000);

          await set(
            ref(db, "rooms/" + roomID + "/status/startAt"),
            serverTimestamp()
          );
        }
      };

      finishRound();
    }
  }, [answerInDB]);

  const sendAnswer = async () => {
    // später wird sich drum gekümmert wer dran ist nur hier erstmal sicherstellen das man nciht zweimal den button drücken kann
    let tmpAnswer = inputRef.current.value;
    setMyTurn(false);
    //console.log("send Answer Funktion wurde aufgerufen");
    const personalHistory = {
      Question: randomQuestion, // Passe den Nachrichtentext an
      Answer: tmpAnswer,
    };

    // history für voting hover
    const emptyPersonalHistory = {
      Question: randomQuestion, // Passe den Nachrichtentext an
      Answer: "nothing",
    };

    if (tmpAnswer === null || tmpAnswer === "") {
      await set(
        ref(
          db,
          "rooms/" +
            roomID +
            "/history/Voting" +
            votingNumber +
            "/" +
            uid +
            "/question" +
            round
        ),
        emptyPersonalHistory
      );
    } else {
      await set(
        ref(
          db,
          "rooms/" +
            roomID +
            "/history/Voting" +
            votingNumber +
            "/" +
            uid +
            "/question" +
            round
        ),
        personalHistory
      );
    }

    // erhöhe AnswerCounter
    //console.log("DummyCounter pre:" + dummyCounter);
    dummyCounter++;
    //console.log("DummyCounter post:" + dummyCounter);

    const currAnswer = {
      Answer: tmpAnswer,
      dummy: dummyCounter,
    };

    const currEmptyAnswer = {
      Answer: "nothing",
      dummy: dummyCounter,
    };
    if (tmpAnswer === null || tmpAnswer === "") {
      await set(
        ref(db, "rooms/" + roomID + "/questions/playerAnswer"),
        currEmptyAnswer
      );
    } else {
      await set(
        ref(db, "rooms/" + roomID + "/questions/playerAnswer"),
        currAnswer
      );
    }
    //delete answer from input field
    setPlayerAnswerInput("");
  };

  if (!voting) {
    return (
      <div className="game-container">
          <div className="Game-heads-up-display">
          <div className="Game-heads-up-display-valume"><VolumeUpIcon fontSize="large" /></div>
            <h1 className="Game-heads-up-display-time" >{count}</h1>
            <h1 className="Game-heads-up-display-rounds">
              {round}/{rounds}
            </h1>
        </div>
        <div className="Game-player-list">
          {players.map((player, index) => (
            <div className="Game-player-list-player" key={index}>
               <img src={avatars[index]} alt="Avatar" />
              <h3>
                {player.playerID === uid ? (
                  <span style={{ backgroundColor: "yellow" }}>
                    {player.playerName} {" "}
                  </span>
                ) : (
                  player.playerName
                )}
                {index === playerCounter && <span>←</span>}
                <br />
                {renderBrains(player.lives)}
              </h3>
            </div>
          ))}
        </div>

        <div className="Game-question-area">
          <  motion.h1
            className="Game-question-area-player-name"
            key={playerName}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 300 }}
          >
            {playerName}
          </motion.h1>
          <RandomQuestion question={randomQuestion} />

          {myTurn && (  
            <div  className="Game-question-area-input-div">
              <input
                type="text"
                id="meinInputFeld"
                value={playerAnswerInput}
                placeholder="schreib!"
                ref={inputRef}
                onChange={(e) => {
                  setPlayerAnswerInput(e.target.value);
                }}
              ></input>
               <button 
                onClick={sendAnswer}
                disabled={!myTurn}>

                send answer</button>
    
            </div>
          )}
           {showLastAnswer && ( 

            <>
              <LastAnswer text={lastAnswer} />
              <p className="Game-question-area-correct-answer">{correctAnswer}</p>
            </>
          )}
        </div>
      </div>
    );
  }
  /*
  if (voting) {
    return (
        <Voting votingTime={votingTime} isCreator={isCreator} players={players} votingNumber={votingNumber} roomID={roomID} setPlayers={setPlayers}
/>
    );
  }
    */
};
