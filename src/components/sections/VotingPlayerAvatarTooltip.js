import React from 'react';

export const VotingPlayerAvatarTooltip = ({ votingData, playerID }) => {
  const playerData = votingData[playerID];
  let formattedOutput = "";

  // Durchlaufe alle Fragen und Antworten
  const questionKeys = Object.keys(playerData);
  questionKeys.forEach((questionKey, index) => {
    const questionData = playerData[questionKey];
    // Extrahiere die Zahl aus dem Schlüssel
    const questionNumber = questionKey.replace(/\D/g, '');
    formattedOutput += `${questionNumber}: ${questionData.Question}\nAnswer: ${questionData.Answer}`;
    if (index < questionKeys.length - 1) {
      formattedOutput += "\n\n";
    }
  });

  return (
    <div className="Voting-player-avatar-tooltip">
      {formattedOutput.split('\n').map((line, index) => (
        <div key={index}>{line === "" ? <br /> : line}</div>
      ))}
    </div>
  );
};