import React from 'react';
import { 
  Rocket, 
  Users, 
  User, 
  Activity, 
  Heart, 
  Compass, 
  Clock, 
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';

export const FLOW_STAGES = [
  { id: 'overview', label: 'Overview', fullLabel: 'Mission Overview', icon: Rocket },
  { id: 'crew', label: 'Crew', fullLabel: 'Crew Selection', icon: Users },
  { id: 'profile', label: 'Profile', fullLabel: 'Astronaut Profile', icon: User, requiresAstronaut: true },
  { id: 'activities', label: 'Activities', fullLabel: 'Mission Activities', icon: Activity, requiresAstronaut: true },
  { id: 'physiological', label: 'Physiology', fullLabel: 'Physiological Data', icon: Heart, requiresAstronaut: true },
  { id: 'science', label: 'Science', fullLabel: 'Science & Geology', icon: Compass },
  { id: 'timeline', label: 'Timeline', fullLabel: 'Mission Timeline', icon: Clock },
  { id: 'insights', label: 'Insights', fullLabel: 'Health Insights', icon: Sparkles }
];

export default function MissionFlowNavigator({
  activeStage = 'overview',
  onSelectStage,
  selectedAstronaut,
  astronautName
}) {
  const currentIndex = FLOW_STAGES.findIndex(s => s.id === activeStage);

  return (
    <div style={{
      position: 'sticky',
      top: '80px',
      zIndex: 40,
      marginBottom: '24px',
      width: '100%'
    }}>
      <div 
        className="glass-card"
        style={{
          padding: '8px 14px',
          background: 'linear-gradient(135deg, rgba(10, 26, 47, 0.85) 0%, rgba(7, 21, 34, 0.92) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(40, 184, 232, 0.22)',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {/* Left: Mission Journey Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          paddingRight: '12px',
          borderRight: '1px solid rgba(245, 249, 255, 0.1)'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--cosmic-cyan)',
            boxShadow: '0 0 8px var(--cosmic-cyan)'
          }} />
          <span style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-tech)',
            fontWeight: 700,
            color: 'var(--cosmic-cyan)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            MISSION FLOW
          </span>
          {selectedAstronaut && (
            <span style={{
              fontSize: '0.70rem',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(40, 184, 232, 0.15)',
              border: '1px solid rgba(40, 184, 232, 0.3)',
              color: 'var(--polar-white)',
              fontFamily: 'var(--font-tech)',
              fontWeight: 600
            }}>
              {astronautName ? astronautName.split(' ').pop().toUpperCase() : 'SELECTED'}
            </span>
          )}
        </div>

        {/* Center: Interactive Stepper Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flex: 1,
          justifyContent: 'flex-start',
          minWidth: 'max-content'
        }}>
          {FLOW_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = stage.id === activeStage;
            const isCompleted = idx < currentIndex;
            const isDisabled = stage.requiresAstronaut && !selectedAstronaut;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => !isDisabled && onSelectStage(stage.id)}
                  disabled={isDisabled}
                  title={isDisabled ? 'Select an astronaut first' : stage.fullLabel}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 11px',
                    borderRadius: '8px',
                    border: isActive 
                      ? '1px solid rgba(40, 184, 232, 0.7)' 
                      : isCompleted 
                        ? '1px solid rgba(57, 217, 138, 0.3)' 
                        : '1px solid transparent',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(40, 184, 232, 0.22) 0%, rgba(18, 59, 103, 0.35) 100%)' 
                      : isCompleted
                        ? 'rgba(57, 217, 138, 0.08)'
                        : 'transparent',
                    color: isActive 
                      ? '#FFFFFF' 
                      : isCompleted 
                        ? 'var(--status-healthy)' 
                        : isDisabled 
                          ? 'rgba(140, 150, 165, 0.4)' 
                          : 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-tech)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 0 14px rgba(40, 184, 232, 0.35)' : 'none',
                    opacity: isDisabled ? 0.45 : 1
                  }}
                >
                  {isCompleted ? (
                    <Check size={12} style={{ color: 'var(--status-healthy)' }} />
                  ) : (
                    <Icon size={12} style={{ color: isActive ? 'var(--cosmic-cyan)' : 'inherit' }} />
                  )}
                  <span>{stage.label}</span>
                </button>

                {idx < FLOW_STAGES.length - 1 && (
                  <ChevronRight 
                    size={11} 
                    style={{ 
                      color: idx < currentIndex ? 'rgba(57, 217, 138, 0.4)' : 'rgba(245, 249, 255, 0.15)',
                      flexShrink: 0
                    }} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Stage Index Counter */}
        <div style={{
          fontSize: '0.70rem',
          fontFamily: 'var(--font-tech)',
          color: 'var(--text-secondary)',
          paddingLeft: '12px',
          borderLeft: '1px solid rgba(245, 249, 255, 0.1)',
          flexShrink: 0
        }}>
          STAGE <strong style={{ color: 'var(--cosmic-cyan)' }}>{currentIndex + 1}</strong> / {FLOW_STAGES.length}
        </div>
      </div>
    </div>
  );
}
