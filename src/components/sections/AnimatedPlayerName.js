import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

export const AnimatedPlayerName = ({ playerName }) => {
  const [animatedProps, setAnimatedProps] = useState({
    opacity: 0,
    transform: 'translate3d(0, -50px, 0)'
  });

  const springProps = useSpring({
    ...animatedProps,
    config: { tension: 300, friction: 10 }
  });

  useEffect(() => {
    setAnimatedProps({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    });
  }, [playerName]);

  return (
    <animated.h1 style={springProps}>
      {playerName}
    </animated.h1>
  );
}

