import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Users, 
  User, 
  Activity, 
  Heart, 
  Compass, 
  Clock, 
  Sparkles,
  ChevronDown,
  ArrowRight,
  Database
} from 'lucide-react';

import MissionFlowNavigator from '../components/apollo17/MissionFlowNavigator';
import MissionOverview from '../components/apollo17/MissionOverview';
import CrewSelection, { APOLLO17_CREW } from '../components/apollo17/CrewSelection';
import AstronautProfile from '../components/apollo17/AstronautProfile';
import MissionActivities from '../components/apollo17/MissionActivities';
import PhysiologicalDataPanel from '../components/apollo17/PhysiologicalDataPanel';
import ScienceActivityFlow from '../components/apollo17/ScienceActivityFlow';
import MissionTimeline from '../components/apollo17/MissionTimeline';
import MissionInsights from '../components/apollo17/MissionInsights';
import { HistoricalDataNotice } from '../components/apollo17/DataAvailabilityState';

export default function Apollo17({ onNavigateToAnatomy, onNavigateTab }) {
  const [activeStage, setActiveStage] = useState('overview');
  const [selectedAstronautId, setSelectedAstronautId] = useState('cernan');

  const selectedAstronaut = APOLLO17_CREW.find(c => c.id === selectedAstronautId) || APOLLO17_CREW[0];

  // Section Refs for smooth scrolling
  const sectionRefs = {
    overview: useRef(null),
    crew: useRef(null),
    profile: useRef(null),
    activities: useRef(null),
    physiological: useRef(null),
    science: useRef(null),
    timeline: useRef(null),
    insights: useRef(null)
  };

  const scrollToStage = (stageId) => {
    setActiveStage(stageId);
    const targetRef = sectionRefs[stageId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectAstronaut = (astronautId) => {
    setSelectedAstronautId(astronautId);
    scrollToStage('profile');
  };

  const handleOpenAnatomy = () => {
    if (onNavigateToAnatomy) {
      onNavigateToAnatomy();
    } else if (onNavigateTab) {
      onNavigateTab('apollo-17-anatomy');
    }
  };

  // Scroll listener to update active stage in navigator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      const stages = ['overview', 'crew', 'profile', 'activities', 'physiological', 'science', 'timeline', 'insights'];
      
      for (let i = stages.length - 1; i >= 0; i--) {
        const stage = stages[i];
        const ref = sectionRefs[stage];
        if (ref && ref.current) {
          const top = ref.current.offsetTop;
          if (scrollPos >= top) {
            setActiveStage(stage);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '36px',
      paddingBottom: '80px',
      maxWidth: '1440px',
      margin: '0 auto',
      position: 'relative'
    }}>

      {/* ================= STICKY MISSION FLOW NAVIGATOR ================= */}
      <MissionFlowNavigator
        activeStage={activeStage}
        onSelectStage={scrollToStage}
        selectedAstronaut={selectedAstronautId}
        astronautName={selectedAstronaut.name}
      />

      {/* Quick Access Bar for 3D Holographic Anatomy */}
      <div 
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 20px',
          borderRadius: '12px',
          background: 'rgba(10, 26, 47, 0.65)',
          border: '1px solid rgba(40, 184, 232, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cosmic-cyan)', boxShadow: '0 0 8px var(--cosmic-cyan)' }} />
          <span style={{ fontSize: '0.80rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600 }}>
            3D ANATOMICAL TOMOGRAPHY MODULE
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
            Inspect full-body biometric scan & 3D skeletal system mapped to Apollo 17 telemetry
          </span>
        </div>

        <button
          onClick={handleOpenAnatomy}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.76rem',
            padding: '6px 14px',
            borderColor: 'rgba(40, 184, 232, 0.4)',
            color: 'var(--cosmic-cyan)',
            fontFamily: 'var(--font-tech)',
            fontWeight: 700
          }}
        >
          <Compass size={14} />
          <span>LAUNCH 3D ANATOMY SCANNER</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* ================= 1. MISSION OVERVIEW ARCHIVE ================= */}
      <section ref={sectionRefs.overview} style={{ scrollMarginTop: '160px' }}>
        <MissionOverview onExploreCrew={() => scrollToStage('crew')} />
      </section>

      {/* ================= 2. CREW SELECTION ================= */}
      <section ref={sectionRefs.crew} style={{ scrollMarginTop: '160px' }}>
        <CrewSelection
          selectedId={selectedAstronautId}
          onSelectAstronaut={handleSelectAstronaut}
        />
      </section>

      {/* ================= 3. INDIVIDUAL ASTRONAUT PROFILE ================= */}
      <section ref={sectionRefs.profile} style={{ scrollMarginTop: '160px' }}>
        <AstronautProfile
          astronautId={selectedAstronautId}
          onNavigateSection={(target) => scrollToStage(target)}
        />
      </section>

      {/* ================= 4. MISSION ACTIVITIES ================= */}
      <section ref={sectionRefs.activities} style={{ scrollMarginTop: '160px' }}>
        <MissionActivities
          astronautId={selectedAstronautId}
          onNavigateToPhysiology={() => scrollToStage('physiological')}
        />
      </section>

      {/* ================= 5. PHYSIOLOGICAL / HEALTH INFORMATION ================= */}
      <section ref={sectionRefs.physiological} style={{ scrollMarginTop: '160px' }}>
        <PhysiologicalDataPanel
          astronautId={selectedAstronautId}
          onNavigateToScience={() => scrollToStage('science')}
        />
      </section>

      {/* ================= 6. SCIENCE & GEOLOGICAL EXPEDITION ================= */}
      <section ref={sectionRefs.science} style={{ scrollMarginTop: '160px' }}>
        <ScienceActivityFlow
          onNavigateToTimeline={() => scrollToStage('timeline')}
        />
      </section>

      {/* ================= 7. CHRONOLOGICAL MISSION TIMELINE ================= */}
      <section ref={sectionRefs.timeline} style={{ scrollMarginTop: '160px' }}>
        <MissionTimeline
          onNavigateToInsights={() => scrollToStage('insights')}
        />
      </section>

      {/* ================= 8. MISSION & HEALTH INSIGHTS ================= */}
      <section ref={sectionRefs.insights} style={{ scrollMarginTop: '160px' }}>
        <MissionInsights
          onReturnToOverview={() => scrollToStage('overview')}
          onNavigateToAnatomy={handleOpenAnatomy}
        />
      </section>

    </div>
  );
}
