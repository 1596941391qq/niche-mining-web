
import React from 'react';
import { COLORS } from '../constants';

interface TerminalWidgetProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const TerminalWidget: React.FC<TerminalWidgetProps> = ({ title, subtitle, children, icon, className = "" }) => {
  return (
    <div className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-sm overflow-hidden flex flex-col group transition-all duration-300 hover:border-[#10B981]/30 ${className}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0d] border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-2">sys_module // {title}</span>
        </div>
        {icon && <div className="text-emerald-500/60 group-hover:text-emerald-500 transition-colors">{icon}</div>}
      </div>
      
      {/* Widget Content */}
      <div className="p-4 flex-1 relative">
        {(title || subtitle) && (
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-emerald-500 font-mono">/</span> {title}
            </h3>
            {subtitle && <p className="text-xs text-gray-500 font-mono uppercase mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
      
      {/* Footer Decoration */}
      <div className="h-[2px] w-full bg-[#1a1a1a] relative">
        <div className="absolute top-0 left-0 h-full w-0 group-hover:w-full bg-[#10B981] transition-all duration-700 ease-out"></div>
      </div>
    </div>
  );
};

export default TerminalWidget;
