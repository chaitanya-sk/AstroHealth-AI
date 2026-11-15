import React, { createContext, useContext, useEffect, useState } from 'react';
import { astronautService } from '../services/api/astronautService';
import { AstronautResponse } from '../types/api';
import { ASTRONAUT_ROSTER, SELECTED_ASTRONAUT } from '../data/dashboardDemoData';
import { AstronautProfile } from '../types/dashboard';

interface AstronautContextType {
  activeAstronautId: string;
  setActiveAstronautId: (id: string) => void;
  activeAstronaut: AstronautProfile;
  roster: AstronautProfile[];
  apiAstronauts: AstronautResponse[];
  loading: boolean;
  refreshRoster: () => Promise<void>;
  registerNewAstronaut: (data: any) => Promise<AstronautResponse>;
}

const AstronautContext = createContext<AstronautContextType | undefined>(undefined);

export const AstronautProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAstronautId, setActiveAstronautId] = useState<string>('ASTRO-DOC-DEMO');
  const [apiAstronauts, setApiAstronauts] = useState<AstronautResponse[]>([]);
  const [roster, setRoster] = useState<AstronautProfile[]>(ASTRONAUT_ROSTER);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRoster = async () => {
    try {
      const data = await astronautService.list();
      setApiAstronauts(data);
      if (data && data.length > 0) {
        // Exclude MMASH terrestrial research participants from operational flight crew
        const operationalCrew = data.filter(
          item => item.mission_id !== 'MMASH_TERRESTRIAL_RESEARCH' &&
                  !item.astronaut_id.toUpperCase().startsWith('MMASH_')
        );

        if (operationalCrew.length > 0) {
          const merged: AstronautProfile[] = operationalCrew.map((item) => {
            const isDemo = item.astronaut_id === 'ASTRO-DOC-DEMO';
            return {
              id: item.astronaut_id,
              name: item.name,
              role: item.role || (isDemo ? 'Medical Specialist' : 'Astronaut Specialist'),
              callsign: isDemo ? 'Apollo-Lead' : `${item.astronaut_id}`,
              mission: item.mission_id || 'ARTEMIS-III',
              spacecraft: 'Orion Deep Space Vehicle (MPC-03)',
              flightDay: item.mission_day || 1,
              totalDaysInSpace: item.mission_day ? (isDemo ? 204 : item.mission_day) : 1,
              avatarUrl: isDemo 
                ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
              status: isDemo ? 'NORMAL' : 'INSUFFICIENT DATA',
              heartRateCurrent: item.resting_hr_baseline || (isDemo ? 76 : undefined),
              tier: isDemo ? 'SIMULATED' : 'SIMULATED'
            };
          });
          setRoster(merged);
          if (!merged.some(m => m.id === activeAstronautId)) {
            const preferred = merged.find(m => m.id === 'ASTRO-DOC-DEMO') || merged[0];
            setActiveAstronautId(preferred.id);
          }
        }
      }
    } catch (e) {
      // Backend offline or error -> use verified operational roster fallback
      setRoster(ASTRONAUT_ROSTER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const registerNewAstronaut = async (data: any): Promise<AstronautResponse> => {
    const res = await astronautService.create(data);
    await fetchRoster();
    setActiveAstronautId(res.astronaut_id);
    return res;
  };

  const activeAstronaut = roster.find(a => a.id === activeAstronautId) || roster[0] || SELECTED_ASTRONAUT;

  return (
    <AstronautContext.Provider
      value={{
        activeAstronautId,
        setActiveAstronautId,
        activeAstronaut,
        roster,
        apiAstronauts,
        loading,
        refreshRoster: fetchRoster,
        registerNewAstronaut,
      }}
    >
      {children}
    </AstronautContext.Provider>
  );
};

export const useAstronaut = () => {
  const context = useContext(AstronautContext);
  if (!context) {
    throw new Error('useAstronaut must be used within an AstronautProvider');
  }
  return context;
};
