import { set, ref } from 'firebase/database';

export const initGame = async (roomID, lives, players, db) => {
      players.map(async (player)=>{
         await set(ref(db, 'rooms/' + roomID + '/players/' + player.playerID + '/lives'), lives)
    })
}



