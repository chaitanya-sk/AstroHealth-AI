import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  ArrowLeft, 
  ChevronRight, 
  Compass, 
  Activity, 
  Heart, 
  Clock, 
  Sparkles,
  Rocket,
  ShieldCheck,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';

import { CREW_MEMBERS } from '../components/CrewProfilesSection';
import AstronautProfile from '../components/apollo17/AstronautProfile';
import MissionActivities from '../components/apollo17/MissionActivities';
import PhysiologicalDataPanel from '../components/apollo17/PhysiologicalDataPanel';
import ScienceActivityFlow from '../components/apollo17/ScienceActivityFlow';
import MissionTimeline from '../components/apollo17/MissionTimeline';
import MissionInsights from '../components/apollo17/MissionInsights';
import { HistoricalDataNotice } from '../components/apollo17/DataAvailabilityState';

export default function IndividualProfile({
  memberId = 'cernan',
  onSelectMember,
  onReturnToDashboard,
  onNavigateToAnatomy
}) {
  const currentMember = CREW_MEMBERS.find(
    m => m.id === memberId || m.memberNumber === memberId
  ) || CREW_MEMBERS[0];

  const [activeSection, setActiveSection] = useState('profile');

  const sectionRefs = {
    profile: useRef(null),
    activities: useRef(null),
    physiological: useRef(null),
    science: useRef(null),
    timeline: useRef(null),
    insights: useRef(null)
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const target = sectionRefs[sectionId];
    if (target && target.current) {
      target.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const stages = [
    { id: 'profile', label: 'Profile & Duties', icon: User },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'physiological', label: 'Health Telemetry', icon: Heart },
    { id: 'science', label: 'Science & Geology', icon: Compass },
    { id: 'timeline', label: 'Personal Timeline', icon: Clock },
    { id: 'insights', label: 'Insights', icon: Sparkles }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      paddingBottom: '80px',
      maxWidth: '1440px',
      margin: '0 auto',
      position: 'relative'
    }}>
      
      {/* Top Header Bar: Back to Dashboard + Astronaut Switcher */}
      <div 
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '12px 20px',
          borderRadius: '14px',
          background: 'rgba(10, 26, 47, 0.75)',
          border: '1px solid rgba(40, 184, 232, 0.25)',
          position: 'sticky',
          top: '80px',
          zIndex: 40,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Back to Dashboard Button */}
        <button
          onClick={onReturnToDashboard}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            padding: '7px 14px',
            fontFamily: 'var(--font-tech)',
            fontWeight: 700
          }}
        >
          <ArrowLeft size={14} />
          <span>RETURN TO DASHBOARD</span>
        </button>

        {/* 3 Crew Quick Switcher Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(7, 21, 34, 0.75)',
          padding: '3px',
          borderRadius: '10px',
          border: '1px solid rgba(245, 249, 255, 0.1)'
        }}>
          {CREW_MEMBERS.map((m) => {
            const isSelected = m.id === currentMember.id;

            return (
              <button
                key={m.id}
                onClick={() => onSelectMember && onSelectMember(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: isSelected ? '1px solid rgba(40, 184, 232, 0.7)' : '1px solid transparent',
                  background: isSelected ? 'rgba(40, 184, 232, 0.25)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{m.shortName}</span>
                {isSelected && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--cosmic-cyan)' }} />}
              </button>
            );
          })}
        </div>

        {/* 3D Anatomy Shortcut */}
        {onNavigateToAnatomy && (
          <button
            onClick={onNavigateToAnatomy}
            className="btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              padding: '6px 12px',
              borderColor: 'rgba(40, 184, 232, 0.35)',
              color: 'var(--cosmic-cyan)'
            }}
          >
            <Compass size={13} />
            <span>3D ANATOMY</span>
          </button>
        )}
      </div>

      {/* Connected Section Jump Navigator */}
      <div 
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '12px',
          background: 'rgba(7, 21, 34, 0.65)',
          border: '1px solid rgba(245, 249, 255, 0.08)',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', fontWeight: 700, flexShrink: 0 }}>
          INFORMATION FLOW:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isActive = activeSection === stg.id;

            return (
              <React.Fragment key={stg.id}>
                <button
                  onClick={() => scrollToSection(stg.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: isActive ? '1px solid rgba(40, 184, 232, 0.6)' : '1px solid transparent',
                    background: isActive ? 'rgba(40, 184, 232, 0.18)' : 'transparent',
                    color: isActive ? 'var(--cosmic-cyan)' : 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={12} />
                  <span>{stg.label}</span>
                </button>
                {idx < stages.length - 1 && (
                  <ChevronRight size={10} style={{ color: 'rgba(245, 249, 255, 0.15)', flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Historical Data Notice */}
      <HistoricalDataNotice />

      {/* ================= STAGE 1: PERSONAL PROFILE & RESPONSIBILITIES ================= */}
      <section ref={sectionRefs.profile} style={{ scrollMarginTop: '160px' }}>
        <AstronautProfile
          astronautId={currentMember.id}
          onNavigateSection={(target) => scrollToSection(target)}
        />
      </section>

      {/* ================= STAGE 2: MISSION ACTIVITIES & WORKLOAD ================= */}
      <section ref={sectionRefs.activities} style={{ scrollMarginTop: '160px' }}>
        <MissionActivities
          astronautId={currentMember.id}
          onNavigateToPhysiology={() => scrollToSection('physiological')}
        />
      </section>

      {/* ================= STAGE 3: PHYSIOLOGICAL / HEALTH INFORMATION ================= */}
      <section ref={sectionRefs.physiological} style={{ scrollMarginTop: '160px' }}>
        <PhysiologicalDataPanel
          astronautId={currentMember.id}
          onNavigateToScience={() => scrollToSection('science')}
        />
      </section>

      {/* ================= STAGE 4: SCIENCE & GEOLOGICAL EXPEDITION ================= */}
      <section ref={sectionRefs.science} style={{ scrollMarginTop: '160px' }}>
        <ScienceActivityFlow
          onNavigateToTimeline={() => scrollToSection('timeline')}
        />
      </section>

      {/* ================= STAGE 5: PERSONAL TIMELINE ================= */}
      <section ref={sectionRefs.timeline} style={{ scrollMarginTop: '160px' }}>
        <MissionTimeline
          onNavigateToInsights={() => scrollToSection('insights')}
        />
      </section>

      {/* ================= STAGE 6: MISSION & HEALTH INSIGHTS ================= */}
      <section ref={sectionRefs.insights} style={{ scrollMarginTop: '160px' }}>
        <MissionInsights
          onReturnToOverview={onReturnToDashboard}
          onNavigateToAnatomy={onNavigateToAnatomy}
        />
      </section>

    </div>
  );
}
