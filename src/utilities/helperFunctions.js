// Zufälligen Boolean-Wert generieren
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GiBrain } from 'react-icons/gi'; // Importiere das Gehirn-Icon von FontAwesome


export const getRandomBoolean = () => {
    return Math.random() < 0.5;
  }
  
  export const renderBrains = (numLives) => {
    return Array.from({ length: numLives }, (_, i) => (
      <GiBrain key={i} style={{ color: 'gray', marginRight: '2px' }} />
    ));
  };

  export function waitForever() {
    return new Promise(() => {}); // Ein Promise, das niemals aufgelöst oder abgelehnt wird
  }
  export const wait = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds))

  export const getPlayerIndexById = (playerID, playersArray) => {
    for (let i = 0; i < playersArray.length; i++) {
      


      if (playersArray[i].playerID === playerID) {
        return i;
      }
    }
    return -1; // Return -1 if the playerID is not found
  }

