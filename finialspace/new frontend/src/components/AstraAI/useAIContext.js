import { useMemo } from 'react';
import { useAstraAI } from '../../context/AstraAIContext';

/**
 * useAIContext.js
 * Extracts rich, accurate contextual information from the current route, page, and user selection.
 */

export function useAIContext() {
  const { currentRoute = '/', activeTab = 'dashboard' } = useAstraAI();

  return useMemo(() => {
    // 1. Identify Selected Person
    let selectedPerson = null;
    let selectedPersonRole = null;

    if (activeTab.includes('cernan') || currentRoute.includes('cernan') || currentRoute.includes('member-1')) {
      selectedPerson = 'Eugene A. Cernan';
      selectedPersonRole = 'Mission Commander (Captain, USN)';
    } else if (activeTab.includes('schmitt') || currentRoute.includes('schmitt') || currentRoute.includes('member-2')) {
      selectedPerson = 'Harrison H. Schmitt';
      selectedPersonRole = 'Lunar Module Pilot / Geologist (Ph.D.)';
    } else if (activeTab.includes('evans') || currentRoute.includes('evans') || currentRoute.includes('member-3')) {
      selectedPerson = 'Ronald E. Evans';
      selectedPersonRole = 'Command Module Pilot (Captain, USN)';
    }

    // 2. Identify Current Section / Page
    let pageTitle = 'Dashboard';
    let currentCategory = 'Crew Overview';

    if (activeTab === 'dashboard' || currentRoute === '/' || currentRoute === '/dashboard') {
      pageTitle = 'Mission Dashboard';
      currentCategory = 'Apollo 17 Crew Profiles';
    } else if (selectedPerson) {
      pageTitle = `Crew Dossier: ${selectedPerson}`;
      currentCategory = 'Operational Activities & Workload History';
    } else if (activeTab === 'anatomy' || currentRoute === '/anatomy') {
      pageTitle = '3D Anatomy Explorer';
      currentCategory = 'Human Biometric Systems & 3D Skeletal Structure';
    } else if (activeTab === 'health-monitoring' || currentRoute === '/health-monitoring') {
      pageTitle = 'Health & Biometric Monitoring';
      currentCategory = 'Continuous Telemetry & Countermeasures';
    } else if (activeTab === 'immune' || currentRoute === '/immune') {
      pageTitle = 'Immune & Deep Space Defense';
      currentCategory = 'Cellular Surveillance & Radiation Risks';
    } else if (activeTab === 'bone-health') {
      pageTitle = 'Musculoskeletal & Bone Density';
      currentCategory = 'ARED Exercise & Osteopenia Countermeasures';
    } else if (activeTab === 'radiation') {
      pageTitle = 'Radiation Monitoring';
      currentCategory = 'Deep Space Dosimetry';
    } else if (activeTab === 'alerts') {
      pageTitle = 'Mission Alerts';
      currentCategory = 'Operational Notifications';
    }

    return {
      currentRoute,
      activeTab,
      pageTitle,
      currentCategory,
      selectedPerson,
      selectedPersonRole,
      hasCrewSelected: Boolean(selectedPerson),
      isAnatomyPage: activeTab === 'anatomy' || currentRoute === '/anatomy',
      isDashboard: activeTab === 'dashboard' || currentRoute === '/' || currentRoute === '/dashboard'
    };
  }, [currentRoute, activeTab]);
}
