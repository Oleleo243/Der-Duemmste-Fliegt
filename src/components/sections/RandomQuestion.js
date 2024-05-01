import React, { useState, useEffect } from 'react';

export const RandomQuestion = ({ question }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText("");
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayText(prevText => {
        if (currentIndex < question.length) {
          return prevText + question[currentIndex++];
        } else {
          clearInterval(interval);
          return prevText;
        }
      });
    }, 25); // Geschwindigkeit des Typewriter-Effekts anpassen (in Millisekunden)

    return () => clearInterval(interval);
  }, [question]);

  return (
    <h1>{displayText}</h1>
  );
}