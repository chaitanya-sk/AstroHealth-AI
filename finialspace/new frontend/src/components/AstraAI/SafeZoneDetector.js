/**
 * SafeZoneDetector.js
 * Intelligent Safe Screen Zone Detector for ASTRA AI.
 * Calculates dynamic, non-obtrusive anchor positions across different viewports and pages.
 */

export function getSafePositions({ width, height, activeTab = 'dashboard', currentRoute = '/' }) {
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  // Mobile: Restrict to safe bottom corners so user interactions are never blocked
  if (isMobile) {
    return [
      { id: 'mobile-br', x: width - 58, y: height - 76, label: 'Bottom Right', safeFor: ['all'] },
      { id: 'mobile-bl', x: 58, y: height - 76, label: 'Bottom Left', safeFor: ['all'] },
      { id: 'mobile-mr', x: width - 54, y: height * 0.62, label: 'Mid Right', safeFor: ['all'] }
    ];
  }

  // Tablet: Safe margins with moderate movement freedom
  if (isTablet) {
    return [
      { id: 'tablet-br', x: width - 85, y: height - 100, label: 'Bottom Right', safeFor: ['all'] },
      { id: 'tablet-mr', x: width - 80, y: Math.max(160, height * 0.48), label: 'Mid Right', safeFor: ['all'] },
      { id: 'tablet-bl', x: 80, y: height - 100, label: 'Bottom Left', safeFor: ['all'] },
      { id: 'tablet-ml', x: 80, y: Math.max(160, height * 0.52), label: 'Mid Left', safeFor: ['all'] }
    ];
  }

  // Desktop: Rich set of intelligent page-aware safe anchor positions
  const basePositions = [
    // 1. Primary Bottom Right (Default Home)
    { 
      id: 'desktop-br', 
      x: width - 105, 
      y: height - 110, 
      label: 'Bottom Right Deck',
      priority: 1,
      facing: 'left'
    },
    // 2. Middle Right Observation Gutter
    { 
      id: 'desktop-mr', 
      x: width - 95, 
      y: Math.max(180, Math.min(height * 0.45, height - 220)), 
      label: 'East Observation Margin',
      priority: 2,
      facing: 'left'
    },
    // 3. Bottom Left Operations Corner
    { 
      id: 'desktop-bl', 
      x: 95, 
      y: height - 110, 
      label: 'Bottom Left Deck',
      priority: 3,
      facing: 'right'
    },
    // 4. Middle Left Margin
    { 
      id: 'desktop-ml', 
      x: 85, 
      y: Math.max(180, Math.min(height * 0.52, height - 220)), 
      label: 'West Observation Margin',
      priority: 4,
      facing: 'right'
    },
    // 5. Upper Right Sub-Nav Gutter (Below fixed TopNav, safely outside center content)
    { 
      id: 'desktop-tr', 
      x: width - 115, 
      y: 135, 
      label: 'High Orbital Right',
      priority: 5,
      facing: 'left'
    },
    // 6. Upper Left Sub-Nav Gutter
    { 
      id: 'desktop-tl', 
      x: 105, 
      y: 135, 
      label: 'High Orbital Left',
      priority: 6,
      facing: 'right'
    }
  ];

  // Page-specific prioritization and filtering
  if (activeTab === 'dashboard' || currentRoute === '/' || currentRoute === '/dashboard') {
    // On Dashboard: Prioritize outer side gutters and bottom corners away from the 3 crew cards
    return basePositions.filter(p => p.id !== 'desktop-tl');
  }

  if (activeTab.startsWith('profile-') || currentRoute.startsWith('/profile/')) {
    // On Profile: Flank either side of the profile dossier
    return basePositions.filter(p => ['desktop-br', 'desktop-mr', 'desktop-bl', 'desktop-ml'].includes(p.id));
  }

  if (activeTab === 'anatomy' || currentRoute === '/anatomy') {
    // On 3D Anatomy: Stay strictly on outer margins away from center 3D viewport and top controls
    return basePositions.filter(p => ['desktop-br', 'desktop-bl', 'desktop-mr'].includes(p.id));
  }

  if (activeTab === 'health-monitoring' || activeTab === 'immune') {
    return basePositions.filter(p => ['desktop-br', 'desktop-bl', 'desktop-mr', 'desktop-tr'].includes(p.id));
  }

  return basePositions;
}

/**
 * Validates that a candidate screen coordinate does not overlap interactive elements.
 */
export function verifyCoordinateSafety(x, y, width, height) {
  // Never cover top navigation (height ~ 90px)
  if (y < 105) y = 115;
  // Never bleed outside viewport
  if (y > height - 85) y = height - 85;
  if (x < 50) x = 55;
  if (x > width - 50) x = width - 65;

  // Check if position directly hits any modal or button
  if (typeof document !== 'undefined') {
    try {
      const el = document.elementFromPoint(x, y);
      if (el) {
        const tagName = el.tagName.toLowerCase();
        const isInteractive = ['button', 'input', 'select', 'textarea', 'a'].includes(tagName) || 
                              el.closest('button, input, select, textarea, a, .glass-card');
        if (isInteractive && x > width / 2) {
          x = Math.max(50, x - 50);
        } else if (isInteractive) {
          x = Math.min(width - 65, x + 50);
        }
      }
    } catch {
      // Element detection fallback
    }
  }

  return { x, y };
}

/**
 * Returns the next safe position index, ensuring variety and smooth pacing.
 */
export function getNextSafePositionIndex(currentIndex, positionsLength) {
  if (positionsLength <= 1) return 0;
  // Cycle forward with slight randomization to avoid rigid predictable looping
  const step = Math.random() > 0.4 ? 1 : 2;
  return (currentIndex + step) % positionsLength;
}
