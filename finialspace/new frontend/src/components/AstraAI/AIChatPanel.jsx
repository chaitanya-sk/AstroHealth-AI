import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CornerDownLeft,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useAstraAI } from '../../context/AstraAIContext';
import VoiceAssistant from './VoiceAssistant';
import { useAIContext } from './useAIContext';

/**
 * AIChatPanel.jsx
 * Premium Glassmorphism Interaction Panel for ASTRA AI.
 * Combines conversational AI, voice recognition/synthesis controls,
 * and page-aware quick prompt actions.
 */

export default function AIChatPanel() {
  const { 
    isOpen, 
    closePanel, 
    messages, 
    sendMessage, 
    getQuickPrompts, 
    isSpeaking,
    setIsSpeaking,
    isListening,
    setIsListening,
    voiceEnabled,
    setVoiceEnabled
  } = useAstraAI();

  const { pageTitle, currentCategory, selectedPerson } = useAIContext();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPromptClick = (prompt) => {
    sendMessage(prompt);
  };

  const quickPrompts = getQuickPrompts ? getQuickPrompts() : [];

  return (
    <div
      role="dialog"
      aria-label="ASTRA AI Assistant Panel"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: 'min(420px, calc(100vw - 32px))',
        height: 'min(620px, calc(100vh - 80px))',
        borderRadius: '22px',
        background: 'linear-gradient(145deg, rgba(16, 42, 67, 0.95) 0%, rgba(7, 21, 34, 0.98) 100%)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: '1px solid rgba(40, 184, 232, 0.45)',
        boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7), 0 0 35px rgba(40, 184, 232, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 99,
        overflow: 'hidden',
        animation: 'panelSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* 1. TOP HEADER BAR */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid rgba(40, 184, 232, 0.25)',
        background: 'rgba(7, 21, 34, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mini Robot Avatar Glow Icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(40, 184, 232, 0.25) 0%, rgba(18, 59, 103, 0.45) 100%)',
            border: '1px solid rgba(40, 184, 232, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cosmic-cyan)',
            boxShadow: '0 0 12px rgba(40, 184, 232, 0.35)'
          }}>
            <Bot size={20} />
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.98rem',
                letterSpacing: '0.04em',
                color: 'var(--polar-white)'
              }}>
                ASTRA AI
              </span>
              <span className="badge-status badge-cyan" style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                VOICE & HEALTH
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: isSpeaking ? '#39D98A' : isListening ? '#FF4D4F' : 'var(--cosmic-cyan)',
              fontFamily: 'var(--font-tech)'
            }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isSpeaking ? '#39D98A' : isListening ? '#FF4D4F' : '#39D98A',
                  boxShadow: isListening ? '0 0 8px #FF4D4F' : '0 0 6px #39D98A'
                }}
              />
              <span>
                {isListening ? 'LISTENING TO VOICE' : isSpeaking ? 'SPEAKING' : 'READY • ONLINE'}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={closePanel}
          title="Close ASTRA AI"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'var(--polar-white)',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
        >
          <X size={16} />
        </button>
      </div>

      {/* 2. CONTEXT BANNER */}
      <div style={{
        padding: '6px 16px',
        background: 'rgba(18, 59, 103, 0.35)',
        borderBottom: '1px solid rgba(40, 184, 232, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-tech)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Compass size={12} color="var(--cosmic-cyan)" />
          <span style={{ color: 'var(--polar-white)', fontWeight: 600 }}>{pageTitle}</span>
          <span>•</span>
          <span>{currentCategory}</span>
        </div>
        {selectedPerson && (
          <span style={{ color: 'var(--cosmic-cyan)', fontWeight: 600, flexShrink: 0 }}>
            {selectedPerson.split(' ')[0]} Active
          </span>
        )}
      </div>

      {/* 3. VOICE ASSISTANT CONTROLS BAR */}
      <div style={{ padding: '8px 14px', flexShrink: 0 }}>
        <VoiceAssistant
          onSpeechInput={(spokenText) => {
            if (spokenText) sendMessage(spokenText);
          }}
          isSpeaking={isSpeaking}
          setIsSpeaking={setIsSpeaking}
          isListening={isListening}
          setIsListening={setIsListening}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
        />
      </div>

      {/* 4. CHAT MESSAGES LOG */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '4px'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-tech)'
              }}>
                {isUser ? (
                  <>
                    <span>YOU</span>
                    <User size={10} />
                  </>
                ) : (
                  <>
                    <Bot size={10} color="var(--cosmic-cyan)" />
                    <span style={{ color: 'var(--cosmic-cyan)' }}>ASTRA AI</span>
                  </>
                )}
              </div>

              <div
                style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isUser
                    ? 'linear-gradient(135deg, rgba(40, 184, 232, 0.3) 0%, rgba(18, 59, 103, 0.6) 100%)'
                    : 'rgba(7, 21, 34, 0.75)',
                  border: isUser 
                    ? '1px solid rgba(40, 184, 232, 0.45)' 
                    : '1px solid rgba(245, 249, 255, 0.1)',
                  color: 'var(--polar-white)',
                  fontSize: '0.84rem',
                  lineHeight: 1.45,
                  wordBreak: 'break-word',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 5. CONTEXT-AWARE QUICK PROMPT CHIPS */}
      {quickPrompts.length > 0 && (
        <div style={{
          padding: '8px 14px',
          borderTop: '1px solid rgba(40, 184, 232, 0.15)',
          background: 'rgba(7, 21, 34, 0.55)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPromptClick(prompt)}
              style={{
                background: 'rgba(40, 184, 232, 0.12)',
                border: '1px solid rgba(40, 184, 232, 0.35)',
                color: 'var(--polar-white)',
                padding: '5px 10px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-tech)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(40, 184, 232, 0.25)';
                e.currentTarget.style.borderColor = 'var(--cosmic-cyan)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(40, 184, 232, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(40, 184, 232, 0.35)';
              }}
            >
              <span>{prompt}</span>
              <ChevronRight size={10} color="var(--cosmic-cyan)" />
            </button>
          ))}
        </div>
      )}

      {/* 6. TEXT INPUT & SUBMIT BAR */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '10px 14px',
          background: 'rgba(7, 21, 34, 0.95)',
          borderTop: '1px solid rgba(40, 184, 232, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask ASTRA AI or click Speak..."
          style={{
            flex: 1,
            background: 'rgba(16, 42, 67, 0.55)',
            border: '1px solid rgba(40, 184, 232, 0.3)',
            borderRadius: '10px',
            padding: '8px 12px',
            color: 'var(--polar-white)',
            fontSize: '0.84rem',
            outline: 'none',
            fontFamily: 'var(--font-body)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--cosmic-cyan)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(40, 184, 232, 0.3)'}
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          title="Send message"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: inputText.trim() 
              ? 'linear-gradient(135deg, var(--cosmic-cyan) 0%, #123B67 100%)' 
              : 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            opacity: inputText.trim() ? 1 : 0.45,
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
