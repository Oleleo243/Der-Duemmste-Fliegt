import React, { useState, useEffect } from 'react';

export const AnimatedPlayerName = ({ playerName }) => {
  const [animationTrigger, setAnimationTrigger] = useState(false);


  return (
    <h1 >{playerName}</h1>
  );
};

