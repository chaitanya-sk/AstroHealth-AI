import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAstraAI } from '../../context/AstraAIContext';

/**
 * SpeechBubble.jsx
 * Contextual, non-blocking thought/speech bubble for ASTRA AI.
 * Displays page tips and suggestions with quick dismiss and auto-fade.
 */

export default function SpeechBubble() {
  const { 
    showBubble, 
    bubbleMessage, 
    dismissBubble, 
    isOpen,
    isSpeaking,
    isListening,
    robotPosition
  } = useAstraAI();

  // Hide bubble if AI panel is open, or speaking/listening, or user dismissed it
  if (!showBubble || !bubbleMessage || isOpen || isSpeaking || isListening) {
    return null;
  }

  // Adjust anchor if robot is near top of screen
  const isNearTop = robotPosition && robotPosition.y < 200;
  const isNearRight = robotPosition && typeof window !== 'undefined' && robotPosition.x > window.innerWidth - 180;

  return (
    <div
      style={{
        position: 'absolute',
        top: isNearTop ? '102px' : '-82px',
        right: isNearRight ? '0' : 'auto',
        left: isNearRight ? 'auto' : '50%',
        transform: isNearRight ? 'none' : 'translateX(-50%)',
        width: 'max-content',
        maxWidth: '260px',
        padding: '10px 14px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.95) 0%, rgba(7, 21, 34, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(40, 184, 232, 0.4)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55), 0 0 16px rgba(40, 184, 232, 0.25)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        zIndex: 90,
        pointerEvents: 'auto',
        animation: 'bubblePopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ color: 'var(--cosmic-cyan)', marginTop: '2px', flexShrink: 0 }}>
        <Sparkles size={14} />
      </div>

      <div style={{
        fontSize: '0.78rem',
        color: 'var(--polar-white)',
        lineHeight: 1.35,
        fontFamily: 'var(--font-body)',
        fontWeight: 500
      }}>
        {bubbleMessage}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          dismissBubble();
        }}
        title="Dismiss message"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginLeft: '4px',
          opacity: 0.7,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        <X size={12} />
      </button>

      {/* Pointing triangle pointer towards the robot */}
      <div
        style={{
          position: 'absolute',
          bottom: isNearTop ? 'auto' : '-6px',
          top: isNearTop ? '-6px' : 'auto',
          left: isNearRight ? '80%' : '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '12px',
          height: '12px',
          background: 'rgba(7, 21, 34, 0.98)',
          borderRight: isNearTop ? 'none' : '1px solid rgba(40, 184, 232, 0.4)',
          borderBottom: isNearTop ? 'none' : '1px solid rgba(40, 184, 232, 0.4)',
          borderLeft: isNearTop ? '1px solid rgba(40, 184, 232, 0.4)' : 'none',
          borderTop: isNearTop ? '1px solid rgba(40, 184, 232, 0.4)' : 'none'
        }}
      />
    </div>
  );
}
