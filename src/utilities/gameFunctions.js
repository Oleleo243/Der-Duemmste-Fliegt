import { set, ref, child, update } from 'firebase/database';
import FragenData from "../questions.json"

export const initGame = async (roomID, newLives, players, db) => {
      players.map(async (player)=>{
        await set(ref(db, 'rooms/' + roomID + '/players/' + player.playerID + '/lives'), newLives);
    })
}

// Funktion, um eine zufällige Frage und die dazugehörige Antwort auszuwählen
export const getRandomQuestion = () => {
  const fragen = FragenData.fragen;
  const zufaelligeIndex = Math.floor(Math.random() * 10);
  const zufaelligeFrage = fragen[zufaelligeIndex];
  return zufaelligeFrage;
}



let timerId; // Variable, um die ID des Intervals zu speichern
let startTime; // Variable, um den Startzeitpunkt des Timers zu speichern
export const timer = (time, setCount, startAt, serverTimeOffset) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const timeLeft = (time * 1000) - (Date.now() - startAt - serverTimeOffset);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCount(0.0);
        resolve(); // Resolve the Promise when the timer completes
      } else {
        setCount(parseFloat(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`));
      }
    }, 100);
  });
};


/*
export const timer = async (time, setCount, startAt, serverTimeOffset) => {
  const interval = setInterval(() => {
    const timeLeft = (time * 1000) - (Date.now() - startAt - serverTimeOffset);
    if (timeLeft < 0) {
      clearInterval(interval);
     setCount(0.0);
     return;
    }
    else {
      //console.log(parseFloat(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`));    
      setCount(parseFloat(`${Math.floor(timeLeft/1000)}.${timeLeft % 1000}`));
  }
  }, 100)
}




export const timer = async (time, setCount, startAt, serverTimeOffset) => {
  console.log("timer aufgerufen");
  await timer1(time, setCount, startAt, serverTimeOffset);
}*/




