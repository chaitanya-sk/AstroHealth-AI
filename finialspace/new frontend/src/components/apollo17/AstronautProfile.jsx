import React from 'react';
import { 
  User, 
  Award, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  Activity, 
  Heart, 
  Clock, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  FileText
} from 'lucide-react';
import { APOLLO17_CREW } from './CrewSelection';
import { DataAvailabilityBadge } from './DataAvailabilityState';

const ASTRONAUT_DETAILS = {
  cernan: {
    officialRole: 'Commander (CDR)',
    militaryRank: 'Captain, United States Navy',
    callSign: 'America CDR',
    biography: 'Eugene A. "Gene" Cernan was a naval aviator, electrical engineer, aeronautical engineer, and fighter pilot. Apollo 17 was his third spaceflight (having previously flown Gemini 9A and Apollo 10). As Commander of Apollo 17, he remains the last human to date to walk on the lunar surface, leaving the final footprint on December 14, 1972.',
    primaryResponsibilities: [
      'Supreme operational command of spacecraft America (CSM-114) and Challenger (LM-12).',
      'Piloted the Lunar Module touchdown on the floor of Taurus-Littrow Valley next to South Massif.',
      'Primary driver of the Lunar Roving Vehicle (LRV-3) covering 35.7 km across boulder fields and crater rims.',
      'Led 3 surface EVAs totaling 22 hours and 4 minutes of strenuous lunar exploration.',
      'Conducted deep core drilling (deploying the ALSEP Heat Flow and Lunar Neutron Probe experiments).'
    ],
    missionLocation: 'Lunar Surface — Taurus-Littrow Valley floor (20.19° N, 30.77° E)',
    suitDesignation: 'Apollo A7LB Extravehicular Mobility Unit (EMU) with red Commander stripes'
  },
  schmitt: {
    officialRole: 'Lunar Module Pilot (LMP) / Scientist-Astronaut',
    militaryRank: 'Ph.D. Geologist (Civilian Scientist-Astronaut)',
    callSign: 'Challenger LMP',
    biography: 'Dr. Harrison Hagan "Jack" Schmitt earned his doctorate in geology from Harvard University. Selected in NASA Astronaut Group 4 (the "Scientist-Astronauts"), he spent years training other Apollo crews in field geology before being assigned to Apollo 17. He became the only professional scientist and geologist ever to step onto an extraterrestrial body.',
    primaryResponsibilities: [
      'Systems monitoring and navigation officer for Lunar Module Challenger descent and ascent stages.',
      'Primary scientific investigator for lunar field geology, rock sampling, and crater stratigraphy.',
      'Discovered pyroclastic orange volcanic glass soil at Shorty Crater, proving lunar volcanic history.',
      'Drilled and deployed the ALSEP Heat Flow Experiment (HFE) probes into the regolith.',
      'Cataloged over 700 individual geological specimens totaling 110.5 kg of lunar bedrock and breccia.'
    ],
    missionLocation: 'Lunar Surface — Taurus-Littrow Valley floor, Massifs & Graben',
    suitDesignation: 'Apollo A7LB Extravehicular Mobility Unit (EMU) — all white (no commander stripes)'
  },
  evans: {
    officialRole: 'Command Module Pilot (CMP)',
    militaryRank: 'Captain, United States Navy',
    callSign: 'America CMP',
    biography: 'Ronald E. Evans was a naval aviator and combat pilot with over 5,100 flight hours. Apollo 17 was his first spaceflight. While Cernan and Schmitt explored the surface, Evans remained alone in lunar orbit piloting the Command and Service Module America, holding the world record for time spent in solo lunar orbit (147 hours, 43 minutes).',
    primaryResponsibilities: [
      'Solo piloting and orbital navigation of CSM America in a 60-nautical-mile circular lunar orbit.',
      'Operated the Scientific Instrument Module (SIM) bay cameras (Panoramic, Mapping, Laser Altimeter).',
      'Tracked lunar surface landmarks, potential future landing sites, and sub-satellite launch.',
      'Maintained orbital rendezvous contingency readiness if Challenger required emergency early abort.',
      'Performed a 1-hour 5-minute deep space EVA between Earth and Moon (180,000 miles out) to retrieve film.'
    ],
    missionLocation: 'Lunar Orbit (CSM America) • Deep Space Trans-Earth Trajectory',
    suitDesignation: 'Apollo A7LB Command Module Pilot EVA suit (with SIM bay umbilical connection)'
  }
};

export default function AstronautProfile({
  astronautId = 'cernan',
  onNavigateSection
}) {
  const astronaut = APOLLO17_CREW.find(c => c.id === astronautId) || APOLLO17_CREW[0];
  const details = ASTRONAUT_DETAILS[astronautId] || ASTRONAUT_DETAILS.cernan;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Profile Header Banner */}
      <div 
        className="glass-card"
        style={{
          padding: '32px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(18, 59, 103, 0.6) 0%, rgba(7, 21, 34, 0.85) 100%)',
          border: '1px solid rgba(40, 184, 232, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Portrait Photo */}
          <div style={{
            width: '120px',
            height: '140px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(40, 184, 232, 0.5)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            background: '#071522',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {astronaut.photo ? (
              <img 
                src={astronaut.photo} 
                alt={astronaut.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
            ) : (
              <User size={60} style={{ color: 'var(--cosmic-cyan)' }} />
            )}
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-status badge-cyan">
                {details.officialRole.toUpperCase()}
              </span>
              <DataAvailabilityBadge status="available" label="HISTORICAL DOSSIER VERIFIED" />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.03em',
              margin: '0 0 4px 0'
            }}>
              {astronaut.name}
            </h1>

            <div style={{
              fontSize: '0.90rem',
              color: 'var(--cosmic-cyan)',
              fontFamily: 'var(--font-tech)',
              fontWeight: 600,
              marginBottom: '12px'
            }}>
              {details.militaryRank} • CALLSIGN: {details.callSign}
            </div>

            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '800px'
            }}>
              {details.biography}
            </p>
          </div>
        </div>

        {/* Location & Suit Badge */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(245, 249, 255, 0.08)'
        }}>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(7, 21, 34, 0.6)',
            borderRadius: '10px',
            border: '1px solid rgba(40, 184, 232, 0.2)'
          }}>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
              MISSION STATION / LOCATION
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600, marginTop: '2px' }}>
              {details.missionLocation}
            </div>
          </div>

          <div style={{
            padding: '12px 16px',
            background: 'rgba(7, 21, 34, 0.6)',
            borderRadius: '10px',
            border: '1px solid rgba(40, 184, 232, 0.2)'
          }}>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
              SPACESUIT CONFIGURATION
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--polar-white)', fontFamily: 'var(--font-tech)', fontWeight: 600, marginTop: '2px' }}>
              {details.suitDesignation}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Responsibilities Panel */}
      <div 
        className="glass-card"
        style={{
          padding: '28px',
          borderRadius: '16px',
          background: 'rgba(7, 21, 34, 0.75)',
          border: '1px solid rgba(245, 249, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <FileText size={18} style={{ color: 'var(--cosmic-cyan)' }} />
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: 0
          }}>
            Mission Responsibilities & Major Duties
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {details.primaryResponsibilities.map((resp, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(18, 59, 103, 0.25)',
                border: '1px solid rgba(40, 184, 232, 0.15)'
              }}
            >
              <span style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-tech)',
                color: 'var(--cosmic-cyan)',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(40, 184, 232, 0.15)',
                flexShrink: 0
              }}>
                DUTY 0{idx + 1}
              </span>
              <span style={{
                fontSize: '0.85rem',
                color: 'var(--polar-white)',
                lineHeight: 1.5
              }}>
                {resp}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Navigation to Activities & Health */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(245, 249, 255, 0.08)'
        }}>
          <button
            onClick={() => onNavigateSection('activities')}
            className="btn-secondary"
            style={{ fontSize: '0.80rem', padding: '8px 16px' }}
          >
            <span>VIEW ACTIVITIES</span>
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => onNavigateSection('physiological')}
            className="btn-primary"
            style={{ fontSize: '0.80rem', padding: '8px 18px' }}
          >
            <span>PHYSIOLOGICAL & HEALTH PROFILE</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
