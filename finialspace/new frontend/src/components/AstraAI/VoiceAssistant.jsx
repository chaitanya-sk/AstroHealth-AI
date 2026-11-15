import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Square, Loader2 } from 'lucide-react';

/**
 * VoiceAssistant.jsx
 * Native Browser Voice Assistant engine for ASTRA AI.
 * Handles Speech Recognition (Voice-to-Text) and Speech Synthesis (Text-to-Speech).
 */

export default function VoiceAssistant({
  onSpeechInput,
  isSpeaking,
  setIsSpeaking,
  isListening,
  setIsListening,
  voiceEnabled,
  setVoiceEnabled
}) {
  const [speechSupported, setSpeechSupported] = useState(false);
  const [synthesisSupported, setSynthesisSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('ready'); // 'ready' | 'listening' | 'processing' | 'speaking' | 'unsupported' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize Speech Capabilities
  useEffect(() => {
    // Check Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceStatus('listening');
          setErrorMessage(null);
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event) => {
          console.warn('ASTRA AI Speech Recognition event:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone access blocked. Allow mic in browser settings.');
            setVoiceStatus('error');
          } else if (event.error === 'no-speech') {
            setVoiceStatus('ready');
          } else {
            setVoiceStatus('ready');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setTranscript((finalText) => {
            if (finalText && finalText.trim().length > 0) {
              setVoiceStatus('processing');
              if (onSpeechInput) {
                onSpeechInput(finalText.trim());
              }
              setTimeout(() => {
                setVoiceStatus('ready');
              }, 1200);
            } else {
              setVoiceStatus('ready');
            }
            return '';
          });
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }

    // Check Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSynthesisSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onSpeechInput, setIsListening]);

  // Sync Voice Status with Speaking state
  useEffect(() => {
    if (isSpeaking) {
      setVoiceStatus('speaking');
    } else if (!isListening && voiceStatus === 'speaking') {
      setVoiceStatus('ready');
    }
  }, [isSpeaking, isListening, voiceStatus]);

  // Handle Start / Stop Microphone
  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      setErrorMessage('Speech Recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
      setVoiceStatus('ready');
    } else {
      // If AI is currently speaking, silence it before listening
      if (synthRef.current && isSpeaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      setTranscript('');
      setErrorMessage(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Failed to start recognition:', e);
        setIsListening(false);
      }
    }
  };

  // Stop currently playing speech
  const handleStopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setVoiceStatus('ready');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '10px 14px',
      background: 'rgba(7, 21, 34, 0.75)',
      borderRadius: '12px',
      border: '1px solid rgba(40, 184, 232, 0.25)'
    }}>
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isListening 
              ? '#FF4D4F' 
              : isSpeaking 
              ? '#39D98A' 
              : voiceStatus === 'processing'
              ? '#FFB020'
              : '#28B8E8',
            boxShadow: isListening ? '0 0 8px #FF4D4F' : '0 0 6px rgba(40, 184, 232, 0.6)'
          }} />

          <span style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.78rem',
            letterSpacing: '0.04em',
            color: isListening 
              ? '#FF4D4F' 
              : isSpeaking 
              ? '#39D98A' 
              : 'var(--polar-white)',
            fontWeight: 600
          }}>
            {isListening && '● LISTENING...'}
            {isSpeaking && '🔊 ASTRA AI SPEAKING...'}
            {voiceStatus === 'processing' && 'PROCESSING SPEECH...'}
            {!isListening && !isSpeaking && voiceStatus !== 'processing' && (speechSupported ? 'VOICE ASSISTANT READY' : 'VOICE ENGINE READY')}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Stop Speaking Button (visible when speaking) */}
          {isSpeaking && (
            <button
              onClick={handleStopSpeaking}
              title="Stop speaking"
              style={{
                background: 'rgba(255, 77, 79, 0.2)',
                border: '1px solid rgba(255, 77, 79, 0.5)',
                color: '#FF4D4F',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Square size={10} fill="#FF4D4F" /> STOP
            </button>
          )}

          {/* Voice Output Audio Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={voiceEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
            style={{
              background: voiceEnabled ? 'rgba(40, 184, 232, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${voiceEnabled ? 'rgba(40, 184, 232, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: voiceEnabled ? 'var(--cosmic-cyan)' : 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* Microphone Push-to-Talk Toggle */}
          <button
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Start voice input'}
            style={{
              background: isListening 
                ? 'rgba(255, 77, 79, 0.25)' 
                : 'rgba(40, 184, 232, 0.18)',
              border: `1px solid ${isListening ? 'rgba(255, 77, 79, 0.6)' : 'rgba(40, 184, 232, 0.5)'}`,
              color: isListening ? '#FF4D4F' : 'var(--cosmic-cyan)',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '0.74rem',
              fontWeight: 700,
              fontFamily: 'var(--font-tech)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: isListening ? '0 0 12px rgba(255, 77, 79, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {isListening ? (
              <>
                <MicOff size={13} />
                <span>STOP</span>
              </>
            ) : (
              <>
                <Mic size={13} />
                <span>SPEAK</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Transcript / Error feedback banner */}
      {(transcript || errorMessage) && (
        <div style={{
          fontSize: '0.74rem',
          color: errorMessage ? '#FF4D4F' : 'var(--cosmic-cyan)',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontFamily: 'var(--font-tech)',
          lineHeight: 1.3
        }}>
          {errorMessage || `"${transcript}"`}
        </div>
      )}
    </div>
  );
}

/**
 * Global text-to-speech helper that reads text aloud using window.speechSynthesis
 */
export function speakAstraText(text, onStart, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior speech

    // Clean markdown stars, code markers, or technical brackets for natural speech
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/#/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/`/g, '')
      .slice(0, 320); // Cap length for conversational brevity

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.02;
    utterance.pitch = 1.05;

    // Try finding an English female / robotic voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}
