import React, { useState, useRef } from 'react';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { HealthSummaryCards } from '../components/dashboard/HealthSummaryCards';
import { AstronautProfileCard } from '../components/dashboard/AstronautProfileCard';
import { TelemetryProgressCard } from '../components/dashboard/TelemetryProgressCard';
import { CircularMeter } from '../components/ui/CircularMeter';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { QuickScheduleTimeline } from '../components/dashboard/QuickScheduleTimeline';
import { HealthDomainCards } from '../components/dashboard/HealthDomainCards';
import { IntelligenceCard } from '../components/dashboard/IntelligenceCard';
import { HealthTrendsChart } from '../components/dashboard/HealthTrendsChart';
import { DataProvenance } from '../components/dashboard/DataProvenance';
import { SELECTED_ASTRONAUT, ASTRONAUT_ROSTER, ACTIVE_ALERTS } from '../data/dashboardDemoData';
import { AstronautProfile, HealthDomain } from '../types/dashboard';
import { NavTabId } from '../components/layout/TopNavigation';

interface DashboardPageProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const Dashboard: React.FC<DashboardPageProps> = ({
  activeTab,
  onTabChange
}) => {
  const [currentAstronaut, setCurrentAstronaut] = useState<AstronautProfile>(SELECTED_ASTRONAUT);

  // Section references for smooth scrolling from top navigation
  const overviewRef = useRef<HTMLDivElement>(null);
  const domainsRef = useRef<HTMLDivElement>(null);
  const intelligenceRef = useRef<HTMLDivElement>(null);
  const trendsRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const provenanceRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: NavTabId) => {
    onTabChange(section);
    const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      overview: overviewRef,
      domains: domainsRef,
      intelligence: intelligenceRef,
      trends: trendsRef,
      alerts: alertsRef,
      provenance: provenanceRef,
      astronauts: overviewRef
    };

    const targetRef = refMap[section];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col space-y-7 pb-4">
      {/* 1. Welcome Section & Horizontal Metric Ratio Bar */}
      <div ref={overviewRef}>
        <WelcomeSection 
          selectedAstronaut={currentAstronaut}
          onAstronautSelect={() => scrollToSection('astronauts')}
          onStatClick={(statId) => {
            if (statId === 'active-alerts') scrollToSection('alerts');
            if (statId === 'health-assessments') scrollToSection('intelligence');
            if (statId === 'research-datasets') scrollToSection('provenance');
          }}
        />
      </div>

      {/* 2. Primary 4-Card Hero Grid (Direct Composition from Reference Screenshot) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4.5 w-full items-stretch">
        {/* Card 1: Astronaut Profile Card (Col 3.5) */}
        <div className="lg:col-span-3.5 flex flex-col">
          <AstronautProfileCard 
            astronaut={currentAstronaut}
            roster={ASTRONAUT_ROSTER}
            onSelectAstronaut={setCurrentAstronaut}
          />
        </div>

        {/* Card 2: Vitals & Workload Weekly Pill Bars (Col 3) */}
        <div className="lg:col-span-3 flex flex-col">
          <TelemetryProgressCard 
            onExpand={() => scrollToSection('trends')}
          />
        </div>

        {/* Card 3: Circular Dial & Recovery Meter (Col 2.5) */}
        <div className="lg:col-span-2.5 flex flex-col">
          <CircularMeter 
            title="Autonomic Score"
            value={currentAstronaut.recoveryPercentage}
            timeString={`${currentAstronaut.heartRateCurrent} bpm`}
            label="Recovery Index"
            onExpand={() => scrollToSection('trends')}
          />
        </div>

        {/* Card 4: Signature Dark Charcoal Alerts & Interventions Card (Col 3) */}
        <div className="lg:col-span-3 flex flex-col">
          <AlertsPanel 
            onViewAllAlerts={() => scrollToSection('alerts')}
          />
        </div>
      </section>

      {/* 3. Secondary Row: Expandable Systems & Daily Mission Schedule (Bottom of Reference Screenshot) */}
      <section>
        <QuickScheduleTimeline />
      </section>

      {/* 4. Four Large Health Summary Statistic Cards */}
      <section className="pt-2">
        <HealthSummaryCards 
          onSelectStat={(id) => {
            if (id === 'active-alerts') scrollToSection('alerts');
            if (id === 'health-assessments') scrollToSection('intelligence');
            if (id === 'research-datasets') scrollToSection('provenance');
          }}
        />
      </section>

      {/* 5. Six Health Domain Cards */}
      <div ref={domainsRef} className="pt-2">
        <HealthDomainCards />
      </div>

      {/* 6. Integrated Health Intelligence Card */}
      <div ref={intelligenceRef} className="pt-2">
        <IntelligenceCard />
      </div>

      {/* 7. Health Trends Chart (Interactive Recharts Area Visualization) */}
      <div ref={trendsRef} className="pt-2">
        <HealthTrendsChart />
      </div>

      {/* 8. Data Provenance & Terrestrial Isolation Section */}
      <div ref={provenanceRef} className="pt-2">
        <DataProvenance />
      </div>
    </div>
  );
};

