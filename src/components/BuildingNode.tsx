/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building, Workstation } from '../types/city';
import { Users, PhoneCall, Layers, ShieldCheck, AlertTriangle } from 'lucide-react';

interface BuildingNodeProps {
  building: Building;
  workstations: Workstation[];
  isSelected: boolean;
  onSelect: (building: Building) => void;
  onOpenFloorPlan: (building: Building) => void;
  onStartDrag?: (e: React.MouseEvent, building: Building) => void;
}

export const BuildingNode: React.FC<BuildingNodeProps> = ({
  building,
  workstations,
  isSelected,
  onSelect,
  onOpenFloorPlan,
  onStartDrag
}) => {
  const activeCount = workstations.filter(w => w.status !== 'offline').length;
  const inCallCount = workstations.filter(w => w.status === 'em_atendimento').length;
  const totalCount = workstations.length || building.initialPositionsCount;
  const occupancyPercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;

  const isInactive = building.status === 'inativo';
  const isMaintenance = building.status === 'manutencao';

  return (
    <div
      onClick={() => onSelect(building)}
      className={`absolute cursor-pointer transition-all duration-200 group select-none ${
        isInactive ? 'opacity-60 grayscale-[0.7]' : ''
      }`}
      style={{
        left: `${building.position.x}px`,
        top: `${building.position.y}px`,
        width: `${building.size.width}px`,
        height: `${building.size.height}px`,
        zIndex: isSelected ? 30 : 20
      }}
    >
      {/* 2.5D Building Shadow on Ground */}
      <div 
        className="absolute inset-0 translate-x-2 translate-y-3 rounded-xl bg-slate-950/20 blur-[3px] transition-all group-hover:translate-x-3 group-hover:translate-y-4 group-hover:blur-[5px]"
        aria-hidden="true"
      />

      {/* Building 3D Shell / Extrusion Body */}
      <div 
        className={`relative w-full h-full rounded-xl flex flex-col justify-between overflow-hidden border-2 transition-transform duration-200 group-hover:-translate-y-1 ${
          isSelected 
            ? 'ring-4 ring-offset-2 ring-slate-900 shadow-2xl' 
            : 'shadow-md group-hover:shadow-xl'
        }`}
        style={{
          backgroundColor: '#ffffff',
          borderColor: building.color,
          boxShadow: isSelected 
            ? `0 14px 28px -6px ${building.color}33, 0 10px 10px -5px ${building.color}22` 
            : undefined
        }}
      >
        {/* Roof Structure / Top Parapet with Colored Banner */}
        <div 
          className="relative px-3 py-2 flex items-center justify-between text-white"
          style={{ 
            backgroundColor: building.color,
            backgroundImage: `linear-gradient(135deg, ${building.color} 0%, ${building.secondaryColor || building.color} 100%)`
          }}
        >
          {/* Subtle architectural roof detail dots/lines */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />

          <div className="flex items-center gap-1.5 z-10 min-w-0">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/25 text-white/95 shrink-0 tracking-wider">
              {building.code}
            </span>
            <h3 className="font-bold text-sm text-white tracking-wide truncate">
              {building.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 z-10 shrink-0">
            {building.type === 'produto' ? (
              <span className="text-[9px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                Produto
              </span>
            ) : (
              <span className="text-[9px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                Adm
              </span>
            )}
          </div>
        </div>

        {/* Building Facade & Interior Indicators (Windows & Layout Preview) */}
        <div className="p-2.5 flex-1 flex flex-col justify-between bg-slate-50/70">
          {/* Subtitle / Category */}
          <div className="min-w-0 mb-1">
            <p className="text-[11px] font-medium text-slate-700 truncate leading-snug">
              {building.category}
            </p>
            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              <span>{building.floors} {building.floors > 1 ? 'Pavimentos' : 'Pavimento'}</span>
              <span>·</span>
              <span>{totalCount} Posições</span>
            </p>
          </div>

          {/* Architectural Window Grid (Simulando fachadas de vidro iluminadas) */}
          <div className="grid grid-cols-6 gap-1 my-1 px-1 py-1.5 bg-slate-200/60 rounded-md border border-slate-300/60">
            {Array.from({ length: 12 }).map((_, wIdx) => {
              const isLit = wIdx < Math.ceil((occupancyPercent / 100) * 12);
              return (
                <div
                  key={wIdx}
                  className={`h-2 rounded-[2px] transition-colors duration-300 ${
                    isLit 
                      ? 'bg-amber-300 shadow-[0_0_4px_rgba(251,191,36,0.8)]' 
                      : 'bg-slate-300/80'
                  }`}
                  title={isLit ? 'Setor em Operação' : 'Desocupado'}
                />
              );
            })}
          </div>

          {/* Occupancy and Telemetry Bar */}
          <div className="mt-1 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>Ocupação</span>
              </span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {occupancyPercent}% ({activeCount}/{totalCount})
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${occupancyPercent}%`,
                  backgroundColor: occupancyPercent > 80 ? building.color : '#059669'
                }}
              />
            </div>

            {/* In-Call quick metric */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-2.5 h-2.5 text-emerald-600" />
                <span>{inCallCount} em ligação</span>
              </span>
              {building.isDemo && (
                <span className="text-[8px] bg-slate-200/80 px-1 py-0.2 rounded text-slate-500 uppercase">
                  Demonstração
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Building Ground Entrance / Canopy */}
        <div className="px-2 py-1.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate max-w-[120px]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: building.color }} />
            <span className="truncate">{building.supervisor.split('-')[0].trim()}</span>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFloorPlan(building);
            }}
            className="text-[10px] font-semibold text-white px-2 py-1 rounded transition-colors flex items-center gap-1 hover:brightness-110 shadow-xs"
            style={{ backgroundColor: building.color }}
          >
            Ver Posições
          </button>
        </div>

        {/* Inactive / Maintenance Warning Overlay */}
        {(isInactive || isMaintenance) && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-2 text-center z-20">
            <AlertTriangle className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isInactive ? 'Prédio Desativado' : 'Em Manutenção'}
            </span>
            <span className="text-[10px] text-slate-300">
              Clique para gerenciar ou reativar
            </span>
          </div>
        )}
      </div>

      {/* Building Entrance Walkway leading to the street */}
      <div 
        className="w-12 h-6 mx-auto -mt-0.5 border-x border-dashed border-slate-400/80 bg-[#e2e8f0] relative -z-10 shadow-xs"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      >
        <span className="text-[7px] font-mono text-slate-400 uppercase tracking-tighter block text-center pt-1">
          Acesso
        </span>
      </div>
    </div>
  );
};
