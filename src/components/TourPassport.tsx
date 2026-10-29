/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building } from '../types/city';
import { Bookmark, Award, Check } from 'lucide-react';

interface TourPassportProps {
  visitedBuildingIds: string[];
  totalBuildingsCount: number;
  buildings: Building[];
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
}

export const TourPassport: React.FC<TourPassportProps> = ({
  visitedBuildingIds,
  totalBuildingsCount,
  buildings,
  selectedBuilding,
  onSelectBuilding
}) => {
  const visitedCount = visitedBuildingIds.length;

  return (
    <div className="absolute bottom-12 left-6 z-30 select-none bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/80 w-56 hidden sm:block">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-3 bg-rose-500 rounded-xs" />
          Passaporte do Campus
        </span>
        <span className="font-mono text-slate-500 text-[11px]">
          {visitedCount}/{totalBuildingsCount}
        </span>
      </div>

      {/* Row of stamp badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {buildings.slice(0, 6).map((b) => {
          const isVisited = visitedBuildingIds.includes(b.id);
          const isCurrent = selectedBuilding?.id === b.id;

          return (
            <button
              key={b.id}
              onClick={() => onSelectBuilding(b)}
              title={`${b.name} (${isVisited ? 'Visitado' : 'Não visitado'})`}
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all border ${
                isCurrent 
                  ? 'ring-2 ring-slate-900 border-white shadow-sm scale-110 text-white' 
                  : isVisited
                  ? 'border-emerald-300 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-400 border-dashed border-slate-300 hover:border-slate-400'
              }`}
              style={{
                backgroundColor: isVisited || isCurrent ? b.color : undefined
              }}
            >
              {isVisited ? <Check className="w-3 h-3 text-white" /> : b.name.substring(0, 1)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
