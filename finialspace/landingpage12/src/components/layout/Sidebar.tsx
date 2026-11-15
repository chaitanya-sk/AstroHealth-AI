import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Orbit, 
  LayoutDashboard, 
  Users, 
  HeartPulse, 
  Sparkles, 
  LineChart, 
  AlertTriangle, 
  Database, 
  Layers, 
  Cpu,
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAstronaut } from '../../contexts/AstronautContext';
import { TierBadge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const { activeAstronaut } = useAstronaut();

  interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    sublabel?: string;
  }

  const navItems: NavItem[] = [
    { path: '/app/dashboard', label: 'Mission Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: '/app/astronauts', label: 'Astronaut Profiles', icon: <Users className="h-4 w-4" /> },
    { path: '/app/domains/cardiovascular', label: 'Health Systems', icon: <HeartPulse className="h-4 w-4" /> },
    { path: '/app/intelligence', label: 'AI Risk Intelligence', icon: <Sparkles className="h-4 w-4" /> },
    { path: '/app/trends', label: 'Health Trends', icon: <LineChart className="h-4 w-4" /> },
    { path: '/app/research', label: 'Research Data Explorer', icon: <Database className="h-4 w-4" /> },
    { path: '/app/alerts', label: 'Investigation Queue', icon: <AlertTriangle className="h-4 w-4" /> },
    { path: '/app/provenance', label: 'Data Provenance', icon: <Layers className="h-4 w-4" /> },
    { path: '/app/ml-insights', label: 'ML Telemetry Models', icon: <Cpu className="h-4 w-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B1B2A] border-r border-[#20394B] justify-between select-none">
      {/* 1. Aerospace Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#20394B] bg-[#0B1B2A]">
          <Link 
            to="/app/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-3 group"
          >
            <div className="h-9 w-9 rounded-xl bg-[#112638] border border-[#20394B] flex items-center justify-center text-[#45D6E8] shadow-soft group-hover:border-[#45D6E8]/40 transition-colors">
              <Orbit className="h-5 w-5 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-[#F2F7FA] leading-none flex items-center gap-1.5">
                ASTROHEALTH <span className="text-[#45D6E8] bg-[#45D6E8]/10 px-1 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider">AI</span>
              </span>
              <span className="text-[10px] text-[#91A7B8] font-mono leading-none mt-1">
                Deep Space Biosurveillance
              </span>
            </div>
          </Link>

          {onMobileClose && (
            <button 
              onClick={onMobileClose}
              className="lg:hidden h-8 w-8 rounded-lg bg-[#112638] border border-[#20394B] flex items-center justify-center text-[#91A7B8] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 2. Navigation Links */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[#91A7B8]/70 uppercase tracking-wider">
            Biomedical Workspace
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group relative",
                  isActive
                    ? "bg-[#112638] text-[#F2F7FA] border border-[#20394B] shadow-sm font-semibold"
                    : "text-[#91A7B8] hover:text-[#F2F7FA] hover:bg-[#112638]/60"
                )}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#45D6E8] rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  <span className={cn(
                    "transition-colors",
                    isActive ? "text-[#45D6E8]" : "text-[#91A7B8] group-hover:text-[#45D6E8]"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="h-4 min-w-[16px] px-1 rounded-full text-[10px] font-mono font-bold flex items-center justify-center bg-[#F06464] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Station Status & User Profile */}
      <div className="p-3 border-t border-[#20394B] bg-[#071522]/60 space-y-2.5">
        {/* Active Astronaut Quick Pill */}
        <div className="bg-[#112638] p-2.5 rounded-xl border border-[#20394B] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={activeAstronaut.avatarUrl} 
              alt={activeAstronaut.name} 
              className="h-7 w-7 rounded-lg object-cover border border-[#20394B] shrink-0" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#F2F7FA] truncate leading-tight">
                {activeAstronaut.name}
              </span>
              <span className="text-[10px] text-[#32C6A6] font-mono leading-tight mt-0.5">
                {activeAstronaut.id} â€¢ Sol {activeAstronaut.flightDay}
              </span>
            </div>
          </div>
          <TierBadge tier={activeAstronaut.tier} subtle className="text-[8px] py-0 px-1" />
        </div>

        {/* User Card with Sign Out */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            {profile?.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="h-7 w-7 rounded-full object-cover border border-[#20394B] shrink-0" 
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-[#112638] border border-[#20394B] text-[#45D6E8] flex items-center justify-center font-bold text-xs shrink-0">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'O'}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#F2F7FA] truncate leading-tight">
                {profile?.name || 'Medical Officer'}
              </span>
              <span className="text-[10px] text-[#91A7B8] truncate leading-tight">
                {profile?.role || 'Flight Surgeon'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="h-7 w-7 rounded-lg hover:bg-[#112638] text-[#91A7B8] hover:text-[#F06464] border border-transparent hover:border-[#20394B] flex items-center justify-center transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 h-full shrink-0 flex-col z-30">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={onMobileClose} 
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
