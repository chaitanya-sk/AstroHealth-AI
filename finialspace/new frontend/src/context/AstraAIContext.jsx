import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { speakAstraText } from '../components/AstraAI/VoiceAssistant';

const AstraAIContext = createContext(null);

export const useAstraAI = () => {
  const context = useContext(AstraAIContext);
  if (!context) {
    throw new Error('useAstraAI must be used within an AstraAIProvider');
  }
  return context;
};

export function AstraAIProvider({ children, currentRoute = '/', activeTab = 'dashboard' }) {
  // Panel state
  const [isOpen, setIsOpen] = useState(false);

  // Robot State
  const [robotMood, setRobotMood] = useState('idle'); // 'idle' | 'moving' | 'listening' | 'speaking' | 'excited'
  const [robotPosition, setRobotPosition] = useState({ x: 1200, y: 700 });

  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Speech Bubble State
  const [bubbleMessage, setBubbleMessage] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const [hasDismissedCurrent, setHasDismissedCurrent] = useState(false);

  // Messages History
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Greetings, Astronaut! I am ASTRA AI, your space health and voice assistant. How can I assist your mission exploration today?",
      timestamp: 'Just now'
    }
  ]);

  // Context-aware speech bubbles based on active page
  useEffect(() => {
    let timeoutId;
    setHasDismissedCurrent(false);

    const getContextBubble = () => {
      if (activeTab === 'dashboard' || currentRoute === '/' || currentRoute === '/dashboard') {
        return "Choose a profile to explore more.";
      }
      if (activeTab.startsWith('profile-') || currentRoute.startsWith('/profile/')) {
        return "Ask me anything about this section.";
      }
      if (activeTab === 'anatomy' || currentRoute === '/anatomy') {
        return "Select a body part to learn more.";
      }
      if (activeTab === 'health-monitoring' || currentRoute === '/health-monitoring' || activeTab === 'immune' || activeTab === 'bone-health') {
        return "I can help explain this information.";
      }
      return "Need any help exploring ASTRA Health?";
    };

    // Show bubble after short delay on route switch
    timeoutId = setTimeout(() => {
      const msg = getContextBubble();
      setBubbleMessage(msg);
      setShowBubble(true);

      // Auto-fade bubble after 8 seconds
      const fadeTimeout = setTimeout(() => {
        setShowBubble(false);
      }, 8000);

      return () => clearTimeout(fadeTimeout);
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [activeTab, currentRoute]);

  const dismissBubble = () => {
    setShowBubble(false);
    setHasDismissedCurrent(true);
  };

  const toggleOpen = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        setShowBubble(false);
        setRobotMood('idle');
      } else {
        // When closing, silence any active speech
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }
        setRobotMood('idle');
      }
      return next;
    });
  };

  const closePanel = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setRobotMood('idle');
  };

  // Helper to extract active crew member name
  const getSelectedCrewMember = useCallback(() => {
    if (activeTab.includes('cernan') || currentRoute.includes('cernan') || currentRoute.includes('member-1')) {
      return { name: 'Eugene A. Cernan', role: 'Commander', duties: 'Lunar surface EVAs, Lunar Rover operations, LM descent' };
    }
    if (activeTab.includes('schmitt') || currentRoute.includes('schmitt') || currentRoute.includes('member-2')) {
      return { name: 'Harrison H. Schmitt', role: 'Scientist-Astronaut / Geologist', duties: 'Planetary geology, orange volcanic soil discovery at Shorty crater, ALSEP deployment' };
    }
    if (activeTab.includes('evans') || currentRoute.includes('evans') || currentRoute.includes('member-3')) {
      return { name: 'Ronald E. Evans', role: 'Command Module Pilot', duties: '147.7h solo lunar orbit, SIM bay panoramic camera mapping, trans-Earth EVA' };
    }
    return null;
  }, [activeTab, currentRoute]);

  // Context-aware quick prompt suggestions
  const getQuickPrompts = useCallback(() => {
    const selectedCrew = getSelectedCrewMember();

    if (activeTab === 'dashboard' || currentRoute === '/' || currentRoute === '/dashboard') {
      return [
        "Explain this page",
        "Help me explore profiles",
        "Explain the 3 crew profiles",
        "Where is the 3D Anatomy viewer?"
      ];
    }
    if (selectedCrew) {
      return [
        `Explain this person (${selectedCrew.name.split(' ')[0]})`,
        "Explain current information & activities",
        "What was their peak metabolic workload?",
        "Show historical data availability notice"
      ];
    }
    if (activeTab === 'anatomy' || currentRoute === '/anatomy') {
      return [
        "Explain selected body part",
        "How do I switch to the 3D Skeleton?",
        "Explain microgravity bone demineralization",
        "Why is renal filtration critical in space?"
      ];
    }
    if (activeTab === 'health-monitoring' || activeTab === 'bone-health') {
      return [
        "Explain this information",
        "Explain safe radiation threshold",
        "How does ARED exercise prevent bone loss?",
        "Why are some biomarkers marked unavailable?"
      ];
    }
    return [
      "Explain this page",
      "Help me explore profiles",
      "Who are the crew members?",
      "Take me to the Dashboard"
    ];
  }, [activeTab, currentRoute, getSelectedCrewMember]);

  // Generate intelligent space medicine and mission responses with context awareness
  const sendMessage = useCallback((userText) => {
    if (!userText || !userText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setRobotMood('listening');

    setTimeout(() => {
      const q = userText.toLowerCase();
      const selectedCrew = getSelectedCrewMember();
      let responseText = "";

      // 1. Context-Aware Queries: "Explain this person", "Explain activities"
      if (q.includes('this person') || q.includes('selected person') || q.includes('who is this')) {
        if (selectedCrew) {
          responseText = `${selectedCrew.name} served as Apollo 17's ${selectedCrew.role}. Primary duties: ${selectedCrew.duties}. You can review their full chronological timeline, workload history, and physiological telemetry right here in their dossier.`;
        } else {
          responseText = "You are currently on the Dashboard. Select any of the three Apollo 17 crew members—Eugene A. Cernan (Commander), Dr. Harrison H. Schmitt (Lunar Module Pilot & Geologist), or Ronald E. Evans (Command Module Pilot)—to explore their verified dossier!";
        }
      }
      else if (q.includes('activit') || q.includes('workload') || q.includes('duties')) {
        if (selectedCrew) {
          responseText = `For ${selectedCrew.name}: Responsibilities included ${selectedCrew.duties}. Peak metabolic workload reached 1,450–1,650 BTU/hr during intensive surface drilling and rover deployment, managed via the Liquid Cooling Garment.`;
        } else {
          responseText = "Apollo 17 activities spanned 3 lunar surface EVAs (22 hours total), 35.7 km traversed in the Lunar Roving Vehicle, and 147.7 hours of solo orbital scientific mapping in the Command Module.";
        }
      }
      // 2. Context-Aware Body Parts & Anatomy
      else if (q.includes('body part') || q.includes('anatomy') || q.includes('skeleton') || q.includes('spine') || q.includes('bone')) {
        responseText = "In microgravity, spinal elongation occurs up to 5–7 cm due to intervertebral disc unloading, while bone mineral density drops ~1% per month without resistive exercise countermeasures. The ASTRA 3D Anatomy Explorer allows you to inspect full musculoskeletal integrity and switch to the high-detail 3D Skeleton view!";
      }
      // 3. Page explanation queries
      else if (q.includes('explain this page') || q.includes('what is this page') || q.includes('help me explore')) {
        if (activeTab === 'dashboard' || currentRoute === '/' || currentRoute === '/dashboard') {
          responseText = "This is the ASTRA HEALTH Mission Dashboard. It gives you an executive overview of the Apollo 17 expedition crew. You can click any astronaut card to open their personal dossier, or use the bottom ribbon to access 3D Anatomy and Diagnostic Suites.";
        } else if (activeTab === 'anatomy') {
          responseText = "This is the 3D Anatomy & Skeletal Explorer. Click any body system on the left panel to isolate anatomical regions, or use the HUD button to switch to the 3D Skeleton.";
        } else if (selectedCrew) {
          responseText = `This is ${selectedCrew.name}'s verified crew profile. It details mission responsibilities, operational timeline, metabolic workload data, and verified physiological records.`;
        } else {
          responseText = `You are viewing the ${activeTab} suite. Here you can analyze biological parameters, environmental radiation dosimetry, and microgravity adaptation protocols.`;
        }
      }
      // 4. Crew-specific queries
      else if (q.includes('cernan')) {
        responseText = "Captain Eugene A. Cernan (USN) was Mission Commander of Apollo 17 and the eleventh human to walk on the Moon. He logged 22 hours and 4 minutes of lunar EVA time and drove the Lunar Roving Vehicle across the Taurus-Littrow Valley.";
      } else if (q.includes('schmitt') || q.includes('geologist') || q.includes('orange')) {
        responseText = "Dr. Harrison 'Jack' Schmitt was the first trained scientist-astronaut to walk on the Moon (Ph.D. in Geology from Harvard). At Shorty Crater (EVA-2), he discovered orange pyroclastic soil—volcanic glass droplets erupted 3.64 billion years ago.";
      } else if (q.includes('evans')) {
        responseText = "Captain Ronald E. Evans (USN) served as Command Module Pilot, spending 147.7 hours in solo lunar orbit inside CSM America. He completed a 1-hour 5-minute deep-space EVA between the Moon and Earth to retrieve scientific film cassettes.";
      }
      // 5. Radiation & Dosimetry
      else if (q.includes('radiation') || q.includes('msv') || q.includes('dose')) {
        responseText = "The NASA occupational career limit for astronauts is 600 mSv. Average deep-space lunar transit exposure is approximately 0.42 mSv/day inside shielded modules. Real-time dosimetry is monitored to ensure cumulative exposure stays well below safety ceilings.";
      }
      // 6. Data Integrity & Fake Data Rule
      else if (q.includes('fake') || q.includes('available') || q.includes('historical') || q.includes('real data')) {
        responseText = "ASTRA Health maintains strict NASA scientific authenticity. Unrecorded historical parameters from 1972 are explicitly displayed as 'HISTORICAL DATA NOT AVAILABLE'. No fabricated telemetry or synthetic vital signs are simulated.";
      }
      // 7. General fallback
      else {
        responseText = `Acknowledged! I have logged your query regarding "${userText}". As your mission health assistant on the ${activeTab} page, I'm ready to answer any questions about astronaut workload, space physiology, or Apollo 17 operations.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, aiMsg]);
      setRobotMood('speaking');

      // Voice output: Speak the response if voice is enabled
      if (voiceEnabled) {
        setIsSpeaking(true);
        speakAstraText(
          responseText,
          () => {
            setIsSpeaking(true);
            setRobotMood('speaking');
          },
          () => {
            setIsSpeaking(false);
            setRobotMood('idle');
          }
        );
      } else {
        setTimeout(() => setRobotMood('idle'), 1500);
      }
    }, 550);
  }, [activeTab, currentRoute, getSelectedCrewMember, voiceEnabled]);

  return (
    <AstraAIContext.Provider
      value={{
        isOpen,
        toggleOpen,
        closePanel,
        robotMood,
        setRobotMood,
        robotPosition,
        setRobotPosition,
        isListening,
        setIsListening,
        isSpeaking,
        setIsSpeaking,
        voiceEnabled,
        setVoiceEnabled,
        showBubble,
        bubbleMessage,
        dismissBubble,
        messages,
        sendMessage,
        getQuickPrompts,
        activeTab,
        currentRoute
      }}
    >
      {children}
    </AstraAIContext.Provider>
  );
}
