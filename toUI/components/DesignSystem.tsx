
import React from 'react';
import { Icons } from '../constants';

const DesignSystem: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Colors */}
      <section>
        <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-6 underline">01_COLOR_PALETTE</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'BG_MAIN', hex: '#050505', desc: 'Main Dark' },
            { name: 'BG_SURFACE', hex: '#0a0a0a', desc: 'Card/Module' },
            { name: 'PRIMARY', hex: '#10B981', desc: 'Brand Accent' },
            { name: 'BORDER', hex: '#1a1a1a', desc: 'Default Line' },
            { name: 'TEXT_SEC', hex: '#9ca3af', desc: 'Labels' },
          ].map((c) => (
            <div key={c.name} className="space-y-2">
              <div className="h-16 rounded-sm border border-white/10" style={{ backgroundColor: c.hex }}></div>
              <p className="text-[10px] font-mono text-white">{c.name}</p>
              <p className="text-[9px] font-mono text-gray-500">{c.hex}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-6 underline">02_TYPOGRAPHY</h3>
        <div className="space-y-6 bg-[#0a0a0a] p-6 border border-[#1a1a1a]">
          <div>
            <p className="text-[10px] text-gray-600 font-mono mb-2">H1_PAGE_TITLE // 20PX BOLD</p>
            <h1 className="text-xl font-bold text-white tracking-tight">System Dashboard Intelligence</h1>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 font-mono mb-2">H2_MODULE_TITLE // 18PX SEMIBOLD</p>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-emerald-500 font-mono">/</span> Data Analysis
            </h2>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 font-mono mb-2">BODY_TEXT // 14PX REGULAR</p>
            <p className="text-sm text-gray-300">This is the standard body text used for reading data and insights across the platform.</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-600 font-mono mb-2">UI_LABEL // 10PX MONO UPPERCASE</p>
            <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">protocol_active_secure</p>
          </div>
        </div>
      </section>

      {/* Components */}
      <section>
        <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-6 underline">03_BUTTON_STATES</h3>
        <div className="flex flex-wrap gap-6 items-center">
          <button className="px-6 py-2 bg-emerald-500 text-black text-xs font-bold rounded-sm uppercase tracking-wider hover:bg-emerald-400 transition-all">
            Primary Action
          </button>
          <button className="px-6 py-2 border border-emerald-500/50 text-emerald-500 text-xs font-bold rounded-sm uppercase tracking-wider hover:bg-emerald-500/10 transition-all">
            Outline Action
          </button>
          <button className="px-6 py-2 border border-[#1a1a1a] text-gray-500 text-xs font-bold rounded-sm uppercase tracking-wider hover:text-white transition-all">
            Ghost Action
          </button>
        </div>
      </section>

      {/* Icons */}
      <section>
        <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-6 underline">04_ICONOGRAPHY</h3>
        <div className="flex gap-8 text-emerald-500">
          <Icons.Dashboard />
          <Icons.Mining />
          <Icons.Agents />
          <Icons.Key />
          <Icons.Settings />
          <div className="text-[10px] font-mono text-gray-600 mt-1">20x20px / 2px Stroke / Linear</div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;
