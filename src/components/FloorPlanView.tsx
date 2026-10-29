/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building, Workstation, WorkstationStatus } from '../types/city';
import { WorkstationDetailModal } from './WorkstationDetailModal';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Monitor, 
  Users, 
  PhoneCall, 
  Clock, 
  Coffee, 
  Server, 
  DoorOpen, 
  ShieldAlert, 
  UserCheck, 
  Sparkles, 
  Info
} from 'lucide-react';

interface FloorPlanViewProps {
  building: Building;
  workstations: Workstation[];
  onBackToCity: () => void;
  onUpdateWorkstation: (updated: Workstation) => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  building,
  workstations,
  onBackToCity,
  onUpdateWorkstation
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkstation, setSelectedWorkstation] = useState<Workstation | null>(null);

  // Filter workstations
  const filteredWorkstations = workstations.filter(w => {
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = w.code.toLowerCase().includes(q);
      const matchOp = w.operator?.name.toLowerCase().includes(q);
      const matchRamal = w.equipment.ramal.includes(q);
      return matchCode || !!matchOp || matchRamal;
    }
    return true;
  });

  const totalPositions = workstations.length;
  const inCall = workstations.filter(w => w.status === 'em_atendimento').length;
  const available = workstations.filter(w => w.status === 'disponivel').length;
  const inPause = workstations.filter(w => w.status === 'pausa').length;
  const offline = workstations.filter(w => w.status === 'offline').length;
  const activeCount = totalPositions - offline;
  const occupancyPercent = totalPositions > 0 ? Math.round((activeCount / totalPositions) * 100) : 0;

  // Format seconds to mm:ss
  const formatTime = (secs?: number) => {
    if (!secs) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] select-none">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-xs z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToCity}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Cidade Operacional</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-2.5">
            <span 
              className="w-3.5 h-3.5 rounded-md shrink-0 shadow-xs"
              style={{ backgroundColor: building.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {building.code}
                </span>
                <h1 className="text-base font-bold text-slate-900">
                  {building.name} — Planta Baixa de Posições (PAs)
                </h1>
                <span className="text-xs font-medium text-slate-500">
                  · {building.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI strip */}
        <div className="flex items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Ocupação:</span>
            <span className="font-bold text-slate-900 tabular-nums">{occupancyPercent}%</span>
            <span className="text-slate-400 text-[11px]">({activeCount}/{totalPositions})</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{inCall} em chamada</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-blue-700">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{available} disponíveis</span>
          </div>
        </div>
      </header>

      {/* Filter Toolbar */}
      <div className="bg-white/80 border-b border-slate-200 px-6 py-2 flex items-center justify-between gap-4 shrink-0 backdrop-blur-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({workstations.length})
          </button>
          <button
            onClick={() => setStatusFilter('em_atendimento')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              statusFilter === 'em_atendimento' ? 'bg-white text-emerald-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Em Atendimento ({inCall})
          </button>
          <button
            onClick={() => setStatusFilter('disponivel')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              statusFilter === 'disponivel' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Disponível ({available})
          </button>
          <button
            onClick={() => setStatusFilter('pausa')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              statusFilter === 'pausa' ? 'bg-white text-amber-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Pausa ({inPause})
          </button>
          <button
            onClick={() => setStatusFilter('offline')}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              statusFilter === 'offline' ? 'bg-white text-slate-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Offline ({offline})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por PA, operador ou ramal..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Main Floor Plan Blueprint Area */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
        {/* Architectural Building Interior Container */}
        <div 
          className="relative bg-white rounded-3xl border-4 border-slate-800 shadow-2xl p-6 min-w-[1080px] max-w-[1280px]"
          style={{
            backgroundImage: `
              radial-gradient(#e2e8f0 1.5px, transparent 1.5px),
              linear-gradient(to right, rgba(241, 245, 249, 0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(241, 245, 249, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 96px 96px, 96px 96px'
          }}
        >
          {/* Main Entrance (Porta de Entrada com Piso Tátil) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono font-bold px-4 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <DoorOpen className="w-3 h-3 text-emerald-400" />
            <span>PORTA PRINCIPAL · ENTRADA DO PAVIMENTO</span>
          </div>

          {/* Emergency Exit (Saída de Emergência) */}
          <div className="absolute -bottom-3 right-12 bg-rose-700 text-white text-[9px] font-mono font-bold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <ShieldAlert className="w-3 h-3" />
            <span>SAÍDA DE EMERGÊNCIA</span>
          </div>

          {/* Top Architectural Functional Rooms Strip */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* 1. Supervisor Station */}
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-start gap-3 shadow-xs">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: building.color }}
              >
                <Monitor className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                  Posto de Supervisão
                </span>
                <p className="font-bold text-xs text-slate-900 truncate">
                  {building.supervisor}
                </p>
                <p className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Monitoria Ativa em Tempo Real
                </p>
              </div>
            </div>

            {/* 2. Break Room / Lounge */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-700 uppercase tracking-wider block">
                  Copa & Descompressão
                </span>
                <p className="font-semibold text-xs text-amber-950">
                  Espaço de Convivência
                </p>
                <p className="text-[10px] text-amber-800 font-mono mt-0.5">
                  Capacidade: 12 pessoas simultâneas
                </p>
              </div>
            </div>

            {/* 3. Server & Telecom Rack */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3 flex items-start gap-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider block">
                  Rack de Telecom & Switch
                </span>
                <p className="font-semibold text-xs text-blue-950">
                  Central Telefônica VoIP
                </p>
                <p className="text-[10px] text-blue-800 font-mono mt-0.5">
                  Ramais 4000 a 4999 Operantes
                </p>
              </div>
            </div>

            {/* 4. Building Floor Specs */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>Layout Operacional:</span>
                <span className="font-bold text-slate-800">Ilhas Modulares 6x</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>Meta SLA do Produto:</span>
                <span className="font-bold text-emerald-700">{building.slaTargetPercentage || 95}%</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Clique em qualquer estação para editar ou realocar operador
              </div>
            </div>
          </div>

          {/* WORKSTATIONS CLUSTER MATRIX (Ilhas de Atendimento) */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/80">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Planta de Estações de Atendimento
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-slate-500">
                  Exibindo {filteredWorkstations.length} de {workstations.length} posições
                </span>
              </div>

              {/* Status color guide */}
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-xs" />
                  <span>Em Chamada</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500 shadow-xs" />
                  <span>Disponível</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 shadow-xs" />
                  <span>Pausa</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-purple-500 shadow-xs" />
                  <span>Treinamento</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-slate-300 shadow-xs" />
                  <span>Offline</span>
                </span>
              </div>
            </div>

            {/* Grid of Workstations */}
            <div className="grid grid-cols-6 gap-3.5">
              {filteredWorkstations.map((workstation) => {
                const isCall = workstation.status === 'em_atendimento';
                const isAvail = workstation.status === 'disponivel';
                const isPaused = workstation.status === 'pausa';
                const isTraining = workstation.status === 'treinamento';
                const isOff = workstation.status === 'offline';

                // Status border and screen colors
                const screenColor = 
                  isCall ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]' :
                  isAvail ? 'bg-blue-500' :
                  isPaused ? 'bg-amber-500' :
                  isTraining ? 'bg-purple-500' : 'bg-slate-400';

                const cardBorder = 
                  isCall ? 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/20' :
                  isAvail ? 'border-blue-300 hover:border-blue-500 bg-blue-50/20' :
                  isPaused ? 'border-amber-300 hover:border-amber-500 bg-amber-50/20' :
                  isTraining ? 'border-purple-300 hover:border-purple-500 bg-purple-50/20' :
                  'border-slate-200 bg-slate-100/50 opacity-70';

                return (
                  <div
                    key={workstation.id}
                    onClick={() => setSelectedWorkstation(workstation)}
                    className={`relative p-2.5 rounded-xl border-2 transition-all duration-150 cursor-pointer hover:shadow-md hover:-translate-y-0.5 bg-white ${cardBorder}`}
                  >
                    {/* Top PA Code and Ramal */}
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                      <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded">
                        {workstation.code}
                      </span>
                      <span className="text-slate-500 font-semibold">
                        R.{workstation.equipment.ramal}
                      </span>
                    </div>

                    {/* Desk Layout Illustration: Screen + Keyboard + Chair */}
                    <div className="flex items-center justify-center gap-2 my-1.5 bg-slate-100/80 p-2 rounded-lg border border-slate-200">
                      {/* Computer Monitor */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-5 rounded-[2px] border border-slate-700 flex items-center justify-center ${screenColor}`}>
                          {isCall && (
                            <PhoneCall className="w-3 h-3 text-white animate-pulse" />
                          )}
                        </div>
                        <div className="w-2.5 h-1 bg-slate-600 rounded-b-xs" />
                        <div className="w-4 h-0.5 bg-slate-400 rounded-full" />
                      </div>

                      {/* Ergonomic Desk Chair representation */}
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full border border-slate-400 bg-slate-200 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        </div>
                        <div className="w-3 h-1 bg-slate-300 rounded-full mt-0.5" />
                      </div>
                    </div>

                    {/* Operator Name and Status */}
                    <div className="min-w-0">
                      {workstation.operator ? (
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 truncate" title={workstation.operator.name}>
                            {workstation.operator.name}
                          </p>
                          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-0.5">
                            <span className="truncate">{workstation.operator.registration}</span>
                            {isCall && (
                              <span className="text-emerald-700 font-bold tabular-nums">
                                {formatTime(workstation.callDurationSeconds)}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[11px] font-medium text-slate-400 italic">
                            Estação Livre
                          </p>
                          <span className="text-[9px] font-mono text-slate-400">
                            Sem operador
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Workstation Detail Modal */}
      <WorkstationDetailModal
        workstation={selectedWorkstation}
        buildingName={building.name}
        onClose={() => setSelectedWorkstation(null)}
        onSaveWorkstation={onUpdateWorkstation}
      />
    </div>
  );
};
