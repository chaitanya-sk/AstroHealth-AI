import React, { useState } from 'react';
import { User, ArrowRight, ShieldCheck, MapPin, Compass, Award } from 'lucide-react';

export const CREW_MEMBERS = [
  {
    id: 'cernan',
    memberNumber: 'member-1',
    name: 'Eugene A. Cernan',
    shortName: 'Gene Cernan',
    rank: 'Captain, USN',
    role: 'Commander',
    roleBadge: 'MISSION COMMANDER',
    photo: '/cernan-portrait.jpg',
    specialty: 'Naval Aviator & Aeronautical Engineer',
    assignment: 'Commanded LM Challenger on lunar descent; led 3 lunar surface EVAs (22h 4m); traversed 35.7 km in Lunar Roving Vehicle.',
    keyStats: ['3 Surface EVAs (22h 04m)', '35.7 km Rover Traverse', '110.5 kg Samples Collected'],
    location: 'Lunar Surface (Taurus-Littrow Valley)'
  },
  {
    id: 'schmitt',
    memberNumber: 'member-2',
    name: 'Harrison H. Schmitt',
    shortName: 'Jack Schmitt',
    rank: 'Ph.D. Geologist (Civilian)',
    role: 'Lunar Module Pilot / Scientist-Astronaut',
    roleBadge: 'SCIENTIST-ASTRONAUT',
    photo: '/schmitt-portrait.jpg?v=2',
    specialty: 'Harvard Ph.D. Geologist & Planetary Scientist',
    assignment: 'First professional scientist on the Moon. Investigated Taurus-Littrow geology; discovered pyroclastic orange volcanic soil at Shorty Crater.',
    keyStats: ['First Geologist on Moon', 'Orange Soil Discovery', 'Heat Flow Experiment Emplaced'],
    location: 'Lunar Surface (Taurus-Littrow Valley)'
  },
  {
    id: 'evans',
    memberNumber: 'member-3',
    name: 'Ronald E. Evans',
    shortName: 'Ron Evans',
    rank: 'Captain, USN',
    role: 'Command Module Pilot',
    roleBadge: 'COMMAND MODULE PILOT',
    photo: '/evans-portrait.jpg',
    specialty: 'Naval Aviator & Orbital Combat Pilot',
    assignment: 'Orbited the Moon solo in CSM America for 147.7 hours; executed 1h 05m deep space EVA to retrieve mapping camera film canisters.',
    keyStats: ['147.7h Solo Lunar Orbit', '1h 05m Deep Space EVA', 'Metric Mapping Cameras'],
    location: 'Lunar Orbit (CSM America) • Deep Space'
  }
];

export default function CrewProfilesSection({ onSelectMember }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge-status badge-cyan">
              EXPEDITION PERSONNEL
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-tech)' }}>
              PRIMARY EXPLORATION CREW
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.03em',
            margin: 0
          }}>
            Crew Profiles
          </h2>
          <p style={{
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            marginTop: '4px',
            maxWidth: '680px',
            lineHeight: 1.5,
            margin: 0
          }}>
            Select any crew member to explore their individual mission responsibilities, operational activities, workload context, verified physiological records, and chronological timeline.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.74rem',
          color: 'var(--cosmic-cyan)',
          fontFamily: 'var(--font-tech)'
        }}>
          <span>3 VERIFIED ASTRONAUT DOSSIERS</span>
        </div>
      </div>

      {/* 3 Profile Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '22px'
      }}>
        {CREW_MEMBERS.map((member) => {
          const isHovered = hoveredId === member.id;

          return (
            <div
              key={member.id}
              onClick={() => onSelectMember && onSelectMember(member.id)}
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderRadius: '18px',
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(18, 59, 103, 0.65) 0%, rgba(10, 26, 47, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 42, 67, 0.45) 0%, rgba(7, 21, 34, 0.8) 100%)',
                border: isHovered
                  ? '1px solid rgba(40, 184, 232, 0.75)'
                  : '1px solid rgba(245, 249, 255, 0.12)',
                boxShadow: isHovered
                  ? '0 16px 38px rgba(40, 184, 232, 0.28), 0 0 20px rgba(40, 184, 232, 0.15)'
                  : '0 8px 24px rgba(0, 0, 0, 0.3)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Line on Hover */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: isHovered 
                  ? 'linear-gradient(90deg, transparent 0%, #28B8E8 50%, transparent 100%)' 
                  : 'transparent',
                boxShadow: isHovered ? '0 0 12px #28B8E8' : 'none',
                transition: 'all 0.25s ease'
              }} />

              {/* Card Body */}
              <div>
                {/* Large Portrait Image Container */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: '#071522',
                  border: isHovered ? '1px solid rgba(40, 184, 232, 0.5)' : '1px solid rgba(245, 249, 255, 0.08)',
                  marginBottom: '18px',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4)'
                }}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                      display: 'block',
                      transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      filter: 'contrast(1.04) brightness(0.98)'
                    }}
                  />

                  {/* Gradient Scrim for readable overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 21, 34, 0.85) 0%, rgba(7, 21, 34, 0.15) 50%, transparent 100%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Role Badge in Photo Corner */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-tech)',
                      fontWeight: 700,
                      color: 'var(--cosmic-cyan)',
                      background: 'rgba(7, 21, 34, 0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(40, 184, 232, 0.35)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.04em'
                    }}>
                      {member.roleBadge}
                    </span>

                    <span style={{
                      fontSize: '0.68rem',
                      color: 'var(--polar-white)',
                      fontFamily: 'var(--font-tech)',
                      background: 'rgba(7, 21, 34, 0.75)',
                      padding: '3px 7px',
                      borderRadius: '5px'
                    }}>
                      {member.rank.split(',')[0]}
                    </span>
                  </div>
                </div>

                {/* Astronaut Identity */}
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    color: isHovered ? 'var(--cosmic-cyan)' : '#FFFFFF',
                    margin: '0 0 4px 0',
                    transition: 'color 0.2s ease',
                    letterSpacing: '0.02em'
                  }}>
                    {member.name}
                  </h3>
                  <div style={{
                    fontSize: '0.80rem',
                    color: 'var(--cosmic-cyan)',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    {member.role}
                  </div>
                  <div style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-tech)'
                  }}>
                    {member.specialty}
                  </div>
                </div>

                {/* Location */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(7, 21, 34, 0.55)',
                  border: '1px solid rgba(40, 184, 232, 0.15)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-tech)',
                  marginBottom: '14px'
                }}>
                  <MapPin size={12} style={{ color: 'var(--cosmic-cyan)', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {member.location}
                  </span>
                </div>

                {/* Short Bio Assignment */}
                <p style={{
                  fontSize: '0.80rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  margin: '0 0 16px 0',
                  minHeight: '48px'
                }}>
                  {member.assignment}
                </p>

                {/* Quick Highlights */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '20px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(7, 21, 34, 0.45)',
                  border: '1px solid rgba(245, 249, 255, 0.06)'
                }}>
                  {member.keyStats.map((stat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)' }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--cosmic-cyan)' }} />
                      <span>{stat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Button */}
              <button
                className={isHovered ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-tech)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>VIEW PROFILE</span>
                <ArrowRight size={14} style={{ transform: isHovered ? 'translateX(3px)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

            </div>
          );
        })}
      </div>

    </section>
  );
}
