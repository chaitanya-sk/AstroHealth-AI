import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Orbit, 
  Bell, 
  ChevronDown, 
  Check, 
  Clock, 
  Menu, 
  X, 
  LogOut, 
  User, 
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAstronaut } from '../../contexts/AstronautContext';
import { TierBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface AppHeaderProps {
  onMobileMenuToggle?: () => void;
  lastUpdatedTimestamp?: string | null;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  onMobileMenuToggle,
  lastUpdatedTimestamp 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const { activeAstronaut, roster, setActiveAstronautId } = useAstronaut();

  const [astroDropdownOpen, setAstroDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = [
    { path: '/app/dashboard', label: 'Mission Overview' },
    { path: '/app/astronauts', label: 'Astronauts' },
    { path: '/app/domains/cardiovascular', label: 'Health Systems' },
    { path: '/app/intelligence', label: 'AI Intelligence' },
    { path: '/app/trends', label: 'Health Trends' },
    { path: '/app/research', label: 'Research' },
    { path: '/app/alerts', label: 'Investigation Queue' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getFreshnessLabel = () => {
    if (lastUpdatedTimestamp) {
      try {
        const d = new Date(lastUpdatedTimestamp);
        return `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC`;
      } catch {
        return `${lastUpdatedTimestamp}`;
      }
    }
    return 'Synchronized';
  };

  return (
    <header className="w-full max-w-[1680px] mx-auto select-none mb-3">
      {/* Top Floating Navigation Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E7E9E5] rounded-full px-4 sm:px-6 py-2.5 shadow-sm flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <Link 
          to="/app/dashboard"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="h-8 w-8 rounded-full bg-[#20272D] flex items-center justify-center text-[#E9C95A] shadow-sm">
            <Orbit className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-sm tracking-tight text-[#20272D]">
              AstroHealth
            </span>
            <span className="text-[11px] font-semibold text-[#78818A]">
              AI
            </span>
          </div>
        </Link>

        {/* Center: Desktop Horizontal Navigation Pills (Image 3 Style) */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs transition-all font-medium',
                  isActive 
                    ? 'bg-[#20272D] text-white shadow-pill font-semibold' 
                    : 'text-[#78818A] hover:text-[#20272D] hover:bg-[#F2F3F1]/80'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Crew Selector, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Astronaut / Subject Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setAstroDropdownOpen(!astroDropdownOpen)}
              className="flex items-center gap-2 bg-[#FAFAF7] hover:bg-[#F5F2E9] border border-[#E7E9E5] pl-1.5 pr-2.5 py-1 rounded-full text-xs text-[#20272D] transition-colors"
            >
              <img 
                src={activeAstronaut.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'} 
                alt={activeAstronaut.name} 
                className="h-5 w-5 rounded-full object-cover border border-[#E7E9E5] shrink-0" 
              />
              <span className="font-semibold text-xs max-w-[110px] sm:max-w-[140px] truncate">
                {activeAstronaut.name}
              </span>
              <ChevronDown className={cn("h-3.5 w-3.5 text-[#78818A] transition-transform", astroDropdownOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {astroDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E7E9E5] shadow-float p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-[#E7E9E5] mb-1">
                  <span className="text-[10px] font-mono font-bold text-[#78818A] uppercase tracking-wider block">
                    ACTIVE FLIGHT CREW & RESEARCH SUBJECTS
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                  {roster.map((astro) => {
                    const isSelected = astro.id === activeAstronaut.id;
                    return (
                      <button
                        key={astro.id}
                        onClick={() => {
                          setActiveAstronautId(astro.id);
                          setAstroDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-colors',
                          isSelected 
                            ? 'bg-[#FAFAF7] text-[#20272D] font-semibold border border-[#E7E9E5]' 
                            : 'hover:bg-[#F2F3F1] text-[#78818A]'
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img 
                            src={astro.avatarUrl} 
                            alt={astro.name} 
                            className="h-6 w-6 rounded-full object-cover border border-[#E7E9E5] shrink-0" 
                          />
                          <div className="min-w-0">
                            <span className="block truncate text-xs text-[#20272D] font-medium">
                              {astro.name}
                            </span>
                            <span className="block text-[10px] text-[#78818A] truncate font-mono">
                              {astro.role} • {astro.tier}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#32A889] shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Telemetry Status Indicator Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#FAFAF7] border border-[#E7E9E5] rounded-full text-[11px] font-mono text-[#78818A]">
            <span className="h-2 w-2 rounded-full bg-[#32A889] animate-pulse" />
            <span>{getFreshnessLabel()}</span>
          </div>

          {/* Notification Button */}
          <Link
            to="/app/alerts"
            className="h-8 w-8 rounded-full bg-[#FAFAF7] hover:bg-[#F2F3F1] border border-[#E7E9E5] flex items-center justify-center text-[#20272D] transition-colors relative"
            title="Investigation Queue"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#E9C95A]" />
          </Link>

          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="h-8 w-8 rounded-full bg-[#20272D] hover:bg-[#323D45] text-white flex items-center justify-center text-xs font-semibold shadow-sm transition-colors"
              title="Account Settings"
            >
              {profile?.name ? profile.name[0].toUpperCase() : 'A'}
            </button>

            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E7E9E5] shadow-float p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-[#E7E9E5] mb-1">
                  <p className="text-xs font-bold text-[#20272D] truncate">
                    {profile?.name || 'Medical Specialist'}
                  </p>
                  <p className="text-[10px] text-[#78818A] truncate font-mono">
                    {profile?.email || 'flight.surgeon@astrohealth.ai'}
                  </p>
                </div>

                <Link
                  to="/app/provenance"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#78818A] hover:text-[#20272D] hover:bg-[#F2F3F1] transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#32A889]" />
                  <span>Data Provenance Policy</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#D95C5C] hover:bg-[#FBEEEE] transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="xl:hidden h-8 w-8 rounded-full bg-[#FAFAF7] border border-[#E7E9E5] flex items-center justify-center text-[#20272D]"
            title="Toggle Menu"
          >
            {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileNavOpen && (
        <div className="xl:hidden mt-2 bg-white rounded-2xl border border-[#E7E9E5] p-3 shadow-float space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-xl text-xs font-medium transition-colors',
                  isActive 
                    ? 'bg-[#20272D] text-white font-semibold' 
                    : 'text-[#78818A] hover:bg-[#F2F3F1] hover:text-[#20272D]'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
