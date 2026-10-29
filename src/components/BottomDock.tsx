/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building } from '../types/city';
import { 
  CreditCard, 
  Tv, 
  Cpu, 
  Sparkles, 
  PhoneCall, 
  Users, 
  Headphones, 
  Award, 
  Building2,
  Briefcase
} from 'lucide-react';

interface BottomDockProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  buildings,
  selectedBuilding,
  onSelectBuilding
}) => {
  // Mapping of category icon
  const getDockIcon = (building: Building) => {
    const code = building.code;
    if (code.includes('PIN')) return <CreditCard className="w-4 h-4" />;
    if (code.includes('BYX')) return <Tv className="w-4 h-4" />;
    if (code.includes('AMG')) return <Briefcase className="w-4 h-4" />;
    if (code.includes('RET')) return <PhoneCall className="w-4 h-4" />;
    if (code.includes('ORC')) return <Award className="w-4 h-4" />;
    if (code.includes('TI')) return <Cpu className="w-4 h-4" />;
    if (code.includes('01')) return <Users className="w-4 h-4" />;
    if (code.includes('02')) return <Building2 className="w-4 h-4" />;
    return <Headphones className="w-4 h-4" />;
  };

  return (
    <nav className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-1 overflow-x-auto max-w-[92vw]">
        {buildings.map((b) => {
          const isSelected = selectedBuilding?.id === b.id;

          return (
            <button
              key={b.id}
              onClick={() => onSelectBuilding(b)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              style={{
                backgroundColor: isSelected ? (b.color || '#f97316') : 'transparent'
              }}
            >
              <span className={isSelected ? 'text-white' : 'text-slate-500'}>
                {getDockIcon(b)}
              </span>
              <span>{b.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
