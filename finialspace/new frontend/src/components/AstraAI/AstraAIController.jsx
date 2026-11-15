import React from 'react';
import RobotMovement from './RobotMovement';
import AstraRobot from './AstraRobot';
import SpeechBubble from './SpeechBubble';
import AIChatPanel from './AIChatPanel';

/**
 * AstraAIController.jsx
 * Master Global Controller for ASTRA AI.
 * Orchestrates intelligent autonomous roaming between safe zones,
 * responsive speech bubbles, the 2.5D robot avatar, and the voice/chat panel.
 */

export default function AstraAIController() {
  return (
    <>
      {/* Moving Robot Assistant with attached Speech Bubble */}
      <RobotMovement>
        <SpeechBubble />
        <AstraRobot />
      </RobotMovement>

      {/* Interactive AI Chat & Voice Assistant Panel */}
      <AIChatPanel />
    </>
  );
}
