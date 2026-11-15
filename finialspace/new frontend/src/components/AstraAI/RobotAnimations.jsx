import React from 'react';

/**
 * RobotAnimations.jsx
 * Reusable SVG definitions, gradients, glow filters, and animated visor states for ASTRA AI.
 */

export function RobotSvgDefs() {
  return (
    <defs>
      {/* 1. Metallic White/Platinum Ceramic Body */}
      <linearGradient id="astraBodyMetallic" x1="0" y1="0" x2="72" y2="88" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="28%" stopColor="#F5F9FF" />
        <stop offset="68%" stopColor="#D9E2EC" />
        <stop offset="100%" stopColor="#9FB3C8" />
      </linearGradient>

      {/* 2. Deep Space Navy Visor Glass */}
      <linearGradient id="astraVisorGlass" x1="14" y1="12" x2="58" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0E2238" />
        <stop offset="50%" stopColor="#071522" />
        <stop offset="100%" stopColor="#030A12" />
      </linearGradient>

      {/* 3. Visor Ambient Specular Glare */}
      <linearGradient id="astraVisorGlare" x1="16" y1="12" x2="52" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
        <stop offset="40%" stopColor="rgba(40, 184, 232, 0.18)" />
        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
      </linearGradient>

      {/* 4. Cosmic Cyan Glow Filters */}
      <filter id="astraCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="astraPropulsionGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      {/* 5. Audio Waveform Gradient for Speaking State */}
      <linearGradient id="astraWaveformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#39D98A" />
        <stop offset="50%" stopColor="#28B8E8" />
        <stop offset="100%" stopColor="#123B67" />
      </linearGradient>
    </defs>
  );
}

/**
 * VisorDisplay:
 * Handles Eye tracking (idle), Audio Equalizer waveform (speaking), Listening Beacon (listening).
 */
export function VisorDisplay({ mood, eyeOffset, isBlinking, isSpeaking, isListening }) {
  // 1. Speaking State: Animated dynamic audio equalizer wave bars
  if (isSpeaking || mood === 'speaking' || mood === 'talking') {
    return (
      <g transform="translate(19, 21)">
        <rect x="0" y="4" width="2.4" height="10" rx="1.2" fill="url(#astraWaveformGradient)">
          <animate attributeName="height" values="6;14;5;12;6" dur="0.45s" repeatCount="indefinite" />
          <animate attributeName="y" values="6;2;6.5;3;6" dur="0.45s" repeatCount="indefinite" />
        </rect>
        <rect x="5.5" y="2" width="2.4" height="14" rx="1.2" fill="url(#astraWaveformGradient)">
          <animate attributeName="height" values="12;6;16;4;12" dur="0.40s" repeatCount="indefinite" />
          <animate attributeName="y" values="3;6;1;7;3" dur="0.40s" repeatCount="indefinite" />
        </rect>
        <rect x="11" y="1" width="2.4" height="16" rx="1.2" fill="#28B8E8" filter="url(#astraCyanGlow)">
          <animate attributeName="height" values="16;8;15;6;16" dur="0.38s" repeatCount="indefinite" />
          <animate attributeName="y" values="1;5;1.5;6;1" dur="0.38s" repeatCount="indefinite" />
        </rect>
        <rect x="16.5" y="3" width="2.4" height="13" rx="1.2" fill="url(#astraWaveformGradient)">
          <animate attributeName="height" values="9;15;5;13;9" dur="0.42s" repeatCount="indefinite" />
          <animate attributeName="y" values="4.5;1.5;6.5;2.5;4.5" dur="0.42s" repeatCount="indefinite" />
        </rect>
        <rect x="22" y="2" width="2.4" height="14" rx="1.2" fill="url(#astraWaveformGradient)">
          <animate attributeName="height" values="14;5;13;7;14" dur="0.44s" repeatCount="indefinite" />
          <animate attributeName="y" values="2;6.5;2.5;5.5;2" dur="0.44s" repeatCount="indefinite" />
        </rect>
        <rect x="27.5" y="4" width="2.4" height="10" rx="1.2" fill="url(#astraWaveformGradient)">
          <animate attributeName="height" values="6;12;4;10;6" dur="0.48s" repeatCount="indefinite" />
          <animate attributeName="y" values="6;3;7;4;6" dur="0.48s" repeatCount="indefinite" />
        </rect>
      </g>
    );
  }

  // 2. Listening State: Pulsing cyan radio waves / audio sensor ring
  if (isListening || mood === 'listening') {
    return (
      <g transform="translate(34, 27)">
        {/* Pulsing Central Microphone Orb */}
        <circle cx="0" cy="0" r="4" fill="#28B8E8" filter="url(#astraCyanGlow)">
          <animate attributeName="r" values="3.2;5;3.2" dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="0.8s" repeatCount="indefinite" />
        </circle>
        {/* Expanding Echo Ripples */}
        <circle cx="0" cy="0" r="7" fill="none" stroke="#28B8E8" strokeWidth="1" opacity="0.6">
          <animate attributeName="r" values="5;12" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="10" fill="none" stroke="#39D98A" strokeWidth="0.8" opacity="0.4">
          <animate attributeName="r" values="8;15" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="1.2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
      </g>
    );
  }

  // 3. Normal / Idle State: Responsive dual digital eyes with smooth tracking and natural blink
  const leftEyeX = 26 + (eyeOffset?.x || 0);
  const leftEyeY = 27 + (eyeOffset?.y || 0);
  const rightEyeX = 42 + (eyeOffset?.x || 0);
  const rightEyeY = 27 + (eyeOffset?.y || 0);

  const eyeScaleY = isBlinking ? 0.1 : 1;

  return (
    <g>
      {/* Left Digital Eye */}
      <g transform={`translate(${leftEyeX}, ${leftEyeY}) scale(1, ${eyeScaleY})`}>
        <ellipse
          cx="0"
          cy="0"
          rx="4.2"
          ry="5.5"
          fill="#28B8E8"
          filter="url(#astraCyanGlow)"
        />
        {/* Inner Pupil Highlight */}
        <ellipse cx="1" cy="-1.4" rx="1.4" ry="1.8" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="-1.2" cy="1.6" rx="0.7" ry="0.7" fill="#F5F9FF" opacity="0.65" />
      </g>

      {/* Right Digital Eye */}
      <g transform={`translate(${rightEyeX}, ${rightEyeY}) scale(1, ${eyeScaleY})`}>
        <ellipse
          cx="0"
          cy="0"
          rx="4.2"
          ry="5.5"
          fill="#28B8E8"
          filter="url(#astraCyanGlow)"
        />
        {/* Inner Pupil Highlight */}
        <ellipse cx="1" cy="-1.4" rx="1.4" ry="1.8" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="-1.2" cy="1.6" rx="0.7" ry="0.7" fill="#F5F9FF" opacity="0.65" />
      </g>

      {/* Subtle HUD scanline reflection across visor */}
      <line
        x1="18"
        y1="23"
        x2="50"
        y2="23"
        stroke="rgba(40, 184, 232, 0.22)"
        strokeWidth="0.8"
        strokeDasharray="2 3"
      />
    </g>
  );
}
