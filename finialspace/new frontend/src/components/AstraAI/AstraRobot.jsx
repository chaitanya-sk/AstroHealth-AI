import React, { useState, useEffect, useRef } from 'react';
import { useAstraAI } from '../../context/AstraAIContext';
import { RobotSvgDefs, VisorDisplay } from './RobotAnimations';

/**
 * AstraRobot.jsx
 * Handcrafted 2.5D Living AI Space Health & Voice Assistant Avatar for ASTRA AI.
 * Responds to cursor proximity, animates visor equalizers during speech,
 * pulses propulsion fields, and triggers the AI Assistant panel.
 */

export default function AstraRobot() {
  const { 
    toggleOpen, 
    isOpen, 
    robotMood, 
    isSpeaking, 
    isListening 
  } = useAstraAI();

  const [isHovered, setIsHovered] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [clickBounce, setClickBounce] = useState(false);

  const robotRef = useRef(null);

  // Mouse Tracking: Calculate eye offset & subtle head tilt towards cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!robotRef.current) return;
      const rect = robotRef.current.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - robotCenterX;
      const deltaY = e.clientY - robotCenterY;
      const distance = Math.hypot(deltaX, deltaY);

      // React when cursor is within 450px
      if (distance < 450) {
        const maxEyeOffset = 3.2;
        const angle = Math.atan2(deltaY, deltaX);
        setEyeOffset({
          x: Math.cos(angle) * maxEyeOffset,
          y: Math.sin(angle) * (maxEyeOffset * 0.7)
        });

        // Slight head tilt towards cursor (-5deg to +5deg)
        const tilt = Math.max(-5, Math.min(5, (deltaX / 300) * 5));
        setHeadTilt(tilt);
      } else {
        setEyeOffset({ x: 0, y: 0 });
        setHeadTilt(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodic Natural Blinking Effect (every 3.8 to 5.2 seconds)
  useEffect(() => {
    let blinkTimeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
      const nextDelay = Math.random() * 2000 + 3500;
      blinkTimeout = setTimeout(triggerBlink, nextDelay);
    };

    blinkTimeout = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Click Handler with feedback bounce
  const handleClick = (e) => {
    e.stopPropagation();
    setClickBounce(true);
    setTimeout(() => setClickBounce(false), 350);
    toggleOpen();
  };

  return (
    <div
      ref={robotRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      title="ASTRA AI — Click to speak or chat"
      aria-label="Open ASTRA AI Voice and Health Assistant"
      style={{
        width: '74px',
        height: '92px',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        filter: isHovered 
          ? 'drop-shadow(0 0 18px rgba(40, 184, 232, 0.75)) drop-shadow(0 10px 22px rgba(0, 0, 0, 0.5))' 
          : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 10px rgba(40, 184, 232, 0.3))',
        transform: clickBounce 
          ? 'scale(0.92)' 
          : isHovered 
          ? 'scale(1.06)' 
          : 'scale(1)',
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), filter 0.22s ease',
        animation: !isHovered && !isSpeaking ? 'robotBobFloat 3.8s ease-in-out infinite' : 'none'
      }}
    >
      <svg
        width="74"
        height="92"
        viewBox="0 0 74 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          transform: `rotate(${headTilt}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Gradients, Filters & Definitions */}
        <RobotSvgDefs />

        {/* 1. TOP ANTENNA & STATUS BEACON */}
        <g transform="translate(37, 7)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#D9E2EC" strokeWidth="2.2" strokeLinecap="round" />
          {/* Beacon Orb */}
          <circle
            cx="0"
            cy="0"
            r={isSpeaking || isListening ? 3.4 : 2.4}
            fill={isListening ? '#FF4D4F' : isSpeaking ? '#39D98A' : '#28B8E8'}
            filter="url(#astraCyanGlow)"
          >
            {(isSpeaking || isListening) && (
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="0.6s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>

        {/* 2. CHASSIS HEAD & TORSO (Single Seamless Capsule) */}
        {/* Main Body Silhouette */}
        <path
          d="M37 13
             C53 13, 62 23, 62 39
             C62 57, 56 70, 37 70
             C18 70, 12 57, 12 39
             C12 23, 21 13, 37 13 Z"
          fill="url(#astraBodyMetallic)"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.2"
        />

        {/* Torso Side Aerospace Seam Accents */}
        <path d="M14 42 C16 52, 22 62, 30 66" stroke="rgba(18, 59, 103, 0.4)" strokeWidth="1" fill="none" />
        <path d="M60 42 C58 52, 52 62, 44 66" stroke="rgba(18, 59, 103, 0.4)" strokeWidth="1" fill="none" />

        {/* 3. VISOR (Curved Oval Display Screen) */}
        <g>
          {/* Visor Frame Outer Bezel */}
          <rect
            x="16"
            y="17"
            width="42"
            height="27"
            rx="13.5"
            fill="#050C15"
            stroke="rgba(40, 184, 232, 0.45)"
            strokeWidth="1.4"
          />

          {/* Visor Deep Space Glass */}
          <rect
            x="17.5"
            y="18.5"
            width="39"
            height="24"
            rx="12"
            fill="url(#astraVisorGlass)"
          />

          {/* Specular Curved Reflection Arc */}
          <path
            d="M21 21 C28 19, 46 19, 53 21 C48 24, 26 24, 21 21 Z"
            fill="url(#astraVisorGlare)"
          />

          {/* Dynamic Visor Display: Eyes / Audio Equalizer Waveform / Listening Beacon */}
          <VisorDisplay
            mood={robotMood}
            eyeOffset={eyeOffset}
            isBlinking={isBlinking}
            isSpeaking={isSpeaking}
            isListening={isListening}
          />
        </g>

        {/* 4. CHEST / MEDICAL INSIGNIA & CORE SENSOR */}
        <g transform="translate(37, 53)">
          {/* Subtle Heartbeat / Vital Arc */}
          <circle cx="0" cy="0" r="4.2" fill="#0B1C2D" stroke="rgba(40, 184, 232, 0.4)" strokeWidth="0.8" />
          <path
            d="M-2.5 0 L-1 -1.5 L0 1.5 L1 -1 L2.5 0"
            fill="none"
            stroke={isSpeaking ? '#39D98A' : '#28B8E8'}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 5. FLOATING ANTI-GRAVITY PROPULSION RING (Underneath) */}
        <g transform="translate(37, 76)">
          {/* Outer Cyan Ring */}
          <ellipse
            cx="0"
            cy="0"
            rx="19"
            ry="4.5"
            fill="none"
            stroke="#28B8E8"
            strokeWidth="1.8"
            filter="url(#astraPropulsionGlow)"
            opacity={isHovered || isSpeaking ? 0.95 : 0.75}
          />
          {/* Inner Ion Core */}
          <ellipse
            cx="0"
            cy="0"
            rx="12"
            ry="2.6"
            fill="rgba(40, 184, 232, 0.35)"
            filter="url(#astraCyanGlow)"
          />
          {/* Vertical Ion Stream Particles */}
          <line x1="-8" y1="2" x2="-8" y2="7" stroke="#28B8E8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="0" y1="3" x2="0" y2="10" stroke="#39D98A" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="8" y1="2" x2="8" y2="7" stroke="#28B8E8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
