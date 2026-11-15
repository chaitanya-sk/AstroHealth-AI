import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getSafePositions, verifyCoordinateSafety, getNextSafePositionIndex } from './SafeZoneDetector';
import { useAstraAI } from '../../context/AstraAIContext';

/**
 * RobotMovement.jsx
 * Intelligent Autonomous Screen Movement Controller for ASTRA AI.
 * Glides smoothly between safe screen zones, avoids interactive content,
 * reacts to route changes, and pauses on hover or interaction.
 */

export default function RobotMovement({ children }) {
  const { 
    currentRoute, 
    activeTab, 
    isOpen, 
    isListening, 
    isSpeaking,
    setRobotMood,
    robotPosition,
    setRobotPosition
  } = useAstraAI();

  const prefersReducedMotion = useReducedMotion();

  // Screen Dimensions State
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [coords, setCoords] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    return { x: w - 105, y: h - 110 };
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelTilt, setTravelTilt] = useState(0);

  const timerRef = useRef(null);
  const lastRouteRef = useRef(currentRoute);

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute safe candidate zones
  const safeZones = getSafePositions({
    width: windowSize.width,
    height: windowSize.height,
    activeTab,
    currentRoute
  });

  // Function to smoothly glide to the next safe zone
  const moveToSafeZone = useCallback((targetIndex = null) => {
    if (isOpen || isHovered || isListening || isSpeaking || document.hidden) {
      return; // Do not move if interacting, speaking, or tab is hidden
    }

    const nextIndex = targetIndex !== null 
      ? targetIndex 
      : getNextSafePositionIndex(currentZoneIndex, safeZones.length);

    const targetZone = safeZones[nextIndex] || safeZones[0];
    if (!targetZone) return;

    const validated = verifyCoordinateSafety(
      targetZone.x, 
      targetZone.y, 
      windowSize.width, 
      windowSize.height
    );

    // Compute travel tilt angle based on horizontal delta
    const deltaX = validated.x - coords.x;
    const tilt = deltaX > 30 ? 6 : deltaX < -30 ? -6 : 0;
    setTravelTilt(tilt);

    setIsTraveling(true);
    setRobotMood('moving');
    setCurrentZoneIndex(nextIndex);
    setCoords(validated);

    if (setRobotPosition) {
      setRobotPosition(validated);
    }

    // After glide finishes (2.2s), return to idle floating
    setTimeout(() => {
      setIsTraveling(false);
      setTravelTilt(0);
      setRobotMood('idle');
    }, 2200);
  }, [
    isOpen, 
    isHovered, 
    isListening, 
    isSpeaking, 
    currentZoneIndex, 
    safeZones, 
    windowSize, 
    coords.x, 
    setRobotMood, 
    setRobotPosition
  ]);

  // Autonomous Roaming Timer (Moves every 10–18 seconds when safe)
  useEffect(() => {
    // If motion is reduced, do not auto-roam
    if (prefersReducedMotion) return;

    const scheduleNextMove = () => {
      // Random delay between 9 and 16 seconds
      const delay = Math.floor(Math.random() * 7000) + 9000;
      timerRef.current = setTimeout(() => {
        moveToSafeZone();
        scheduleNextMove();
      }, delay);
    };

    scheduleNextMove();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [moveToSafeZone, prefersReducedMotion]);

  // Page-Aware Reaction: Smoothly reposition to best page zone on route change
  useEffect(() => {
    if (lastRouteRef.current !== currentRoute) {
      lastRouteRef.current = currentRoute;

      // When route changes, pick the top priority zone for that page
      const timeoutId = setTimeout(() => {
        const newZones = getSafePositions({
          width: windowSize.width,
          height: windowSize.height,
          activeTab,
          currentRoute
        });

        if (newZones && newZones.length > 0) {
          const bestZoneIndex = 0;
          const target = newZones[bestZoneIndex];
          const validated = verifyCoordinateSafety(target.x, target.y, windowSize.width, windowSize.height);
          
          setIsTraveling(true);
          setRobotMood('moving');
          setCurrentZoneIndex(bestZoneIndex);
          setCoords(validated);
          if (setRobotPosition) setRobotPosition(validated);

          setTimeout(() => {
            setIsTraveling(false);
            setRobotMood('idle');
          }, 2000);
        }
      }, 400);

      return () => clearTimeout(timeoutId);
    }
  }, [currentRoute, activeTab, windowSize, setRobotMood, setRobotPosition]);

  // Transition spring/ease config for premium physical gliding
  const transitionConfig = prefersReducedMotion
    ? { duration: 0 }
    : {
        type: 'spring',
        damping: 28,
        stiffness: 45,
        mass: 1.2
      };

  return (
    <motion.div
      id="astra-robot-movement-wrapper"
      animate={{
        x: coords.x - 36, // Center offset
        y: coords.y - 45,
        rotate: travelTilt
      }}
      transition={transitionConfig}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 85,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        pointerEvents: 'auto',
        willChange: 'transform'
      }}
    >
      {/* Robot with Floating Physics & Attached Speech Bubble */}
      {children}
    </motion.div>
  );
}
