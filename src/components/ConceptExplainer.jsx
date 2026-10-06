import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Cpu, Lightbulb } from 'lucide-react';

export const ConceptExplainer = ({ title, concept, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-900/80 rounded-xl border border-cyan-500/30 overflow-hidden shadow-sm shadow-cyan-950/20 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                ADS Concept: {concept}
              </span>
              <span className="text-xs font-semibold text-white">{title}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <span className="text-xs hidden sm:inline">{isOpen ? 'Hide Explanation' : 'How it works'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-300 leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};
