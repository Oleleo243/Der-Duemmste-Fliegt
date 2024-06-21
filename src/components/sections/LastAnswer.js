import React, { useState, useEffect } from 'react';

export const LastAnswer = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayText(prevText => {
        if (currentIndex < text.length) {
          return prevText + text[currentIndex++];
        } else {
          clearInterval(interval);
          return prevText;
        }
      });
    }, 100); // Geschwindigkeit des Typewriter-Effekts anpassen (in Millisekunden)

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prevShowCursor => !prevShowCursor);
    }, 500); // Geschwindigkeit des Cursor-Blinkens anpassen (in Millisekunden)

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <h1 className="Game-question-area-player-answer">
      {displayText}
      {showCursor && <span>|</span>}
    </h1>
  );
}


/*import React, { useState, useEffect } from 'react';

export const LastAnswer = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayText(prevText => {
        if (currentIndex < text.length) {
          return prevText + text[currentIndex++];
        } else {
          clearInterval(interval);
          return prevText;
        }
      });
    }, 100); // Geschwindigkeit des Typewriter-Effekts anpassen (in Millisekunden)

    // Toggle des Cursors alle 500ms
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [text]);

  return (
    <h1>
      {displayText}
      {cursorVisible && '_'}
    </h1>
  );
}
*/
