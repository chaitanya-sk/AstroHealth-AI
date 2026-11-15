import React, { useState } from 'react';
import { 
  Orbit, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { TierBadge } from '../ui/Badge';

export type NavTabId = 'overview' | 'astronauts' | 'domains' | 'intelligence' | 'trends' | 'alerts' | 'provenance';

interface TopNavigationProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  activeAlertCount?: number;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  onTabChange,
  activeAlertCount = 3
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems: { id: NavTabId; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'astronauts', label: 'Astronauts' },
    { id: 'domains', label: 'Health Domains' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'trends', label: 'Trends' },
    { id: 'alerts', label: 'Alerts', badge: activeAlertCount },
    { id: 'provenance', label: 'Provenance' }
  ];

  return (
    <header className="relative w-full z-40">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {/* Left: Brand Logo Capsule */}
        <div className="flex items-center gap-2">
          <div className="bg-[#FFFDF5]/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200/70 shadow-soft flex items-center gap-2.5 transition-all hover:shadow-md">
            <div className="h-7 w-7 rounded-full bg-[#292929] flex items-center justify-center text-[#F7D85B] shadow-inner">
              <Orbit className="h-4 w-4 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-[#171717] flex items-center gap-1">
                AstroHealth <span className="text-[#8A6A00] bg-[#F7D85B]/50 px-1 rounded text-[10px] font-black uppercase">AI</span>
              </span>
            </div>
          </div>
          <TierBadge tier="SIMULATED" subtle className="hidden sm:inline-flex" />
        </div>

        {/* Center: Desktop Navigation Floating Pill Bar */}
        <nav className="hidden lg:flex items-center bg-[#FFFDF5]/80 backdrop-blur-md p-1.5 rounded-full border border-stone-200/70 shadow-soft">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5",
                  isActive
                    ? "bg-[#292929] text-white shadow-xs"
                    : "text-[#6E6E6E] hover:text-[#171717] hover:bg-[#F4F0E5]/60"
                )}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    "h-4 min-w-[16px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center",
                    isActive ? "bg-[#F7D85B] text-[#292929]" : "bg-[#D9534F] text-white"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-2">
          {/* Settings button */}
          <button 
            className="hidden sm:flex items-center gap-1.5 bg-[#FFFDF5]/90 hover:bg-white px-3.5 py-2 rounded-full border border-stone-200/70 text-xs font-semibold text-[#171717] transition-all shadow-soft"
            onClick={() => {}}
          >
            <Settings className="h-3.5 w-3.5 text-[#6E6E6E]" />
            <span>Settings</span>
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="h-9 w-9 rounded-full bg-[#FFFDF5]/90 hover:bg-white border border-stone-200/70 flex items-center justify-center text-[#171717] transition-all shadow-soft relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4 text-[#292929]" />
              {activeAlertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#D9534F] ring-2 ring-white" />
              )}
            </button>
          </div>

          {/* User Profile Avatar Pill */}
          <div className="flex items-center gap-2 bg-[#FFFDF5]/90 pl-1.5 pr-2.5 py-1 rounded-full border border-stone-200/70 shadow-soft cursor-pointer hover:bg-white transition-all">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
              alt="Flight Surgeon" 
              className="h-7 w-7 rounded-full object-cover border border-black/10"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-[#171717] leading-none">Dr. Lora P.</span>
              <span className="text-[10px] text-[#8E8E8E] leading-none mt-0.5">Surgeon</span>
            </div>
            <ChevronDown className="h-3 w-3 text-[#929292] hidden sm:block" />
          </div>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-full bg-[#FFFDF5]/90 border border-stone-200/70 flex items-center justify-center text-[#171717]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-3 bg-[#FFFDF5] rounded-2xl border border-stone-200/70 shadow-float flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={cn(
                "px-4 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between",
                activeTab === item.id 
                  ? "bg-[#292929] text-white" 
                  : "text-[#6E6E6E] hover:bg-[#F4F0E5]"
              )}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "h-4 px-1.5 rounded-full text-[10px] font-bold",
                  activeTab === item.id ? "bg-[#F7D85B] text-[#292929]" : "bg-[#D9534F] text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

