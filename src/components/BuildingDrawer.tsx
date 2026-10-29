/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building, Workstation } from '../types/city';
import { 
  X, 
  LayoutGrid, 
  Users, 
  PhoneCall, 
  Clock, 
  PauseCircle, 
  UserCheck, 
  PowerOff, 
  Edit3, 
  Power, 
  Sliders, 
  ShieldCheck, 
  MapPin, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface BuildingDrawerProps {
  building: Building | null;
  workstations: Workstation[];
  onClose: () => void;
  onOpenFloorPlan: (building: Building) => void;
  onEditBuilding: (building: Building) => void;
  onToggleStatus: (buildingId: string) => void;
}

export const BuildingDrawer: React.FC<BuildingDrawerProps> = ({
  building,
  workstations,
  onClose,
  onOpenFloorPlan,
  onEditBuilding,
  onToggleStatus
}) => {
  if (!building) return null;

  const totalPositions = workstations.length;
  const inCall = workstations.filter(w => w.status === 'em_atendimento').length;
  const available = workstations.filter(w => w.status === 'disponivel').length;
  const inPause = workstations.filter(w => w.status === 'pausa').length;
  const inTraining = workstations.filter(w => w.status === 'treinamento').length;
  const offline = workstations.filter(w => w.status === 'offline').length;
  const activeCount = totalPositions - offline;
  const occupancyPercent = totalPositions > 0 ? Math.round((activeCount / totalPositions) * 100) : 0;

  const isInactive = building.status === 'inativo';

  return (
    <div className="fixed inset-y-0 right-0 w-96 max-w-full bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col transition-transform duration-300">
      {/* Drawer Header */}
      <div 
        className="px-5 py-4 text-white relative flex items-start justify-between"
        style={{ 
          backgroundColor: building.color,
          backgroundImage: `linear-gradient(135deg, ${building.color} 0%, ${building.secondaryColor || building.color} 100%)`
        }}
      >
        <div className="min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/25 text-white">
              {building.code}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              {building.type === 'produto' ? 'Prédio Operacional' : 'Ambiente Administrativo'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight truncate">
            {building.name}
          </h2>
          <p className="text-xs text-white/80 truncate mt-0.5">
            {building.category}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/20 transition-colors"
          aria-label="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Primary Floor Plan CTA */}
        <div>
          <button
            onClick={() => onOpenFloorPlan(building)}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.99] transition-all text-sm"
            style={{ backgroundColor: building.color }}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Visualizar Posições na Planta Interna</span>
          </button>
          <p className="text-[11px] text-slate-500 text-center mt-1.5 font-mono">
            Visualize o mapa de mesas, ramais e operadores alocados
          </p>
        </div>

        {/* Status Alert if Inactive */}
        {isInactive && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Prédio Desativado</p>
              <p className="text-amber-700">Este prédio está temporariamente fora de operação. Você pode reativá-lo nas ações abaixo.</p>
            </div>
          </div>
        )}

        {/* Operational Occupancy Overview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Taxa de Ocupação Atual
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
              {occupancyPercent}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${occupancyPercent}%`,
                backgroundColor: building.color
              }}
            />
          </div>

          {/* Breakdown Stat Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-emerald-600" />
                Em Ligação:
              </span>
              <span className="font-bold text-slate-800">{inCall}</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-blue-600" />
                Disponíveis:
              </span>
              <span className="font-bold text-slate-800">{available}</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <PauseCircle className="w-3 h-3 text-amber-600" />
                Em Pausa:
              </span>
              <span className="font-bold text-slate-800">{inPause}</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1">
                <PowerOff className="w-3 h-3 text-slate-400" />
                Offline:
              </span>
              <span className="font-bold text-slate-800">{offline}</span>
            </div>
          </div>
        </div>

        {/* Building Technical Specs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            Parâmetros do Ambiente
          </h4>

          <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div className="p-2.5 flex items-center justify-between">
              <span className="text-slate-500">Liderança / Supervisão:</span>
              <span className="font-medium text-slate-800 truncate max-w-[180px]">{building.supervisor}</span>
            </div>
            <div className="p-2.5 flex items-center justify-between">
              <span className="text-slate-500">Capacidade Total de PAs:</span>
              <span className="font-mono font-semibold text-slate-800">{totalPositions} posições</span>
            </div>
            <div className="p-2.5 flex items-center justify-between">
              <span className="text-slate-500">Dimensões na Planta:</span>
              <span className="font-mono text-slate-800">{building.size.width}px × {building.size.height}px</span>
            </div>
            <div className="p-2.5 flex items-center justify-between">
              <span className="text-slate-500">Coordenadas no Campus:</span>
              <span className="font-mono text-slate-800">X: {building.position.x} | Y: {building.position.y}</span>
            </div>
            <div className="p-2.5 flex items-center justify-between">
              <span className="text-slate-500">Meta de SLA Operacional:</span>
              <span className="font-mono text-emerald-700 font-semibold">{building.slaTargetPercentage || 95}%</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {building.notes && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Observações Operacionais</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {building.notes}
            </p>
          </div>
        )}

        {/* Demo Data Tag Notice */}
        {building.isDemo && (
          <div className="text-[11px] text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-700">Dados de Demonstração:</span> Os operadores, ramais e métricas acima são demonstrativos até a sincronização de dados reais da central telefônica.
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
        <button
          onClick={() => onEditBuilding(building)}
          className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Editar Prédio</span>
        </button>

        <button
          onClick={() => onToggleStatus(building.id)}
          className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border shadow-xs ${
            isInactive 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isInactive ? 'Reativar' : 'Desativar'}</span>
        </button>
      </div>
    </div>
  );
};
