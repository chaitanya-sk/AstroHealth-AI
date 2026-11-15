import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#071522]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className={cn(
        "relative w-full max-w-2xl bg-[#112638] rounded-2xl border border-[#20394B] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200",
        className
      )}>
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-[#20394B] bg-[#0B1B2A]/80">
          <div>
            <h3 className="text-xl font-bold text-[#F2F7FA] font-mono tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-[#91A7B8] font-mono mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-[#20394B]/50 hover:bg-[#20394B] text-[#91A7B8] hover:text-[#F2F7FA] flex items-center justify-center border border-[#20394B] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

