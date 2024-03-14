import React, { useState, useEffect } from 'react';

export const AnimatedPlayerName = ({ playerName }) => {
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    setAnimationTrigger(true);

    const timeout = setTimeout(() => {
      setAnimationTrigger(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [playerName]);

  const style = {
    animation: animationTrigger ? 'fadeIn 1s ease' : '',
    opacity: animationTrigger ? 0 : 1,
  };

  return (
    <h1 style={style}>
      {playerName}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </h1>
  );
};

