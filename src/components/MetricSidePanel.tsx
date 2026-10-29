/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building, Workstation } from '../types/city';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Edit3, 
  Power, 
  Sparkles, 
  Building2,
  TrendingUp,
  TrendingDown,
  Layers,
  PhoneCall,
  Clock,
  Users
} from 'lucide-react';

interface MetricSidePanelProps {
  building: Building;
  allBuildings: Building[];
  workstations: Workstation[];
  onClose: () => void;
  onSelectBuilding: (building: Building) => void;
  onOpenFloorPlan: (building: Building) => void;
  onEditBuilding: (building: Building) => void;
  onToggleStatus: (buildingId: string) => void;
}

export const MetricSidePanel: React.FC<MetricSidePanelProps> = ({
  building,
  allBuildings,
  workstations,
  onClose,
  onSelectBuilding,
  onOpenFloorPlan,
  onEditBuilding,
  onToggleStatus
}) => {
  const [period, setPeriod] = useState<'3M' | '6M' | '12M'>('12M');

  const currentIndex = allBuildings.findIndex(b => b.id === building.id);
  const totalCount = allBuildings.length;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + totalCount) % totalCount;
    onSelectBuilding(allBuildings[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % totalCount;
    onSelectBuilding(allBuildings[nextIdx]);
  };

  const ext = building.metricsExtended;
  const isInactive = building.status === 'inativo';

  // Render SVG Sparkline
  const renderSparkline = (data: number[], color: string) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 64;
    const height = 24;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg className="w-16 h-6 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Top issues data
  const topIssues = ext?.topIssues || [
    { rank: 1, title: 'Atendimento Geral de Contratos', volume: '18,4k', percent: 90 },
    { rank: 2, title: 'Dúvidas Cadastrais e Documentos', volume: '15,1k', percent: 75 },
    { rank: 3, title: 'Emissão de Segunda Via', volume: '12,7k', percent: 62 },
    { rank: 4, title: 'Renovação e Ajustes de Limite', volume: '9,8k', percent: 48 },
    { rank: 5, title: 'Suporte a Aplicativo e Portal', volume: '8,2k', percent: 40 },
  ];

  // Channel bar data
  const channelData = ext?.channelDistribution || [
    { label: 'WhatsApp', value: 85 },
    { label: 'Telefonia', value: 65 },
    { label: 'App Mobile', value: 50 },
    { label: 'Chat Web', value: 35 },
    { label: 'Portal B2B', value: 25 },
    { label: 'E-mail', value: 18 }
  ];

  return (
    <aside className="fixed inset-y-0 right-0 w-[420px] max-w-full bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      {/* 1. Header Banner (Stylized like CineVille reference) */}
      <div 
        className="p-5 text-white relative transition-colors duration-300"
        style={{
          backgroundColor: building.color,
          backgroundImage: `linear-gradient(135deg, ${building.color} 0%, ${building.secondaryColor || building.color} 100%)`
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner font-bold font-mono text-sm border border-white/30">
              {building.code.substring(0, 3)}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-white/90 uppercase font-semibold block">
                {building.type === 'produto' ? 'PRODUTO' : 'ADMINISTRATIVO'}
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                {building.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/15 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
            title="Fechar painel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Previous / Next Building Carousel Controls */}
        <div className="mt-4 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <span className="text-white/90 font-mono text-[11px] tracking-wide">
            Prédio {currentIndex + 1} de {totalCount}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-white"
          >
            <span>Próximo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fafbfc]">
        {/* Period Selector Tabs */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Período
          </span>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {(['3M', '6M', '12M'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  period === p
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Metric Cards (2x2 Grid with Sparklines) */}
        <div className="grid grid-cols-2 gap-3">
          {(ext?.kpiCards || [
            { label: 'Posições Ativas', value: `${workstations.filter(w => w.status !== 'offline').length}/${workstations.length}`, subValue: '+4 no mês', trend: 'up', sparkline: [10, 15, 20, 25, 28, 32] },
            { label: 'Chamadas Hoje', value: '1.482', subValue: '+9 vs ontem', trend: 'up', sparkline: [12, 14, 18, 22, 30, 46] },
            { label: 'Taxa Ocupação', value: '88%', subValue: '+4 p.p.', trend: 'up', sparkline: [75, 78, 80, 84, 86, 88] },
            { label: 'Tempo Médio (TMA)', value: '3m 48s', subValue: '-3,0%', trend: 'down', sparkline: [4.5, 4.2, 4.0, 3.9, 3.8] }
          ]).map((kpi, idx) => (
            <div
              key={idx}
              className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-medium text-slate-500 block truncate">
                  {kpi.label}
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tight block mt-0.5 font-mono">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                <span className={`text-[10px] font-semibold font-mono ${
                  kpi.trend === 'up' ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  {kpi.subValue}
                </span>
                {renderSparkline(kpi.sparkline, building.color)}
              </div>
            </div>
          ))}
        </div>

        {/* Primary Action Button: Visualizar Posições na Planta Interna */}
        <button
          onClick={() => onOpenFloorPlan(building)}
          className="w-full py-3 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.99] transition-all"
          style={{ 
            backgroundColor: building.color,
            boxShadow: `0 6px 14px -3px ${building.color}40`
          }}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Visualizar Posições na Planta Interna</span>
        </button>

        {/* Top 5 Motivos / Demandas da Semana (Horizontal Progress Bars) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Top 5 demandas da semana
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              vol. de chamados
            </span>
          </div>

          <div className="space-y-2.5">
            {topIssues.map((issue) => (
              <div key={issue.rank} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 font-medium truncate max-w-[240px]">
                    {issue.rank}. {issue.title}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-[10px]">
                    {issue.volume}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${issue.percent}%`,
                      backgroundColor: building.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volume de Atendimentos por Canal / Horário (Vertical Bar Chart) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Volume por canal de atendimento
            </h4>
            <span className="text-[10px] font-mono text-slate-400">
              índice
            </span>
          </div>

          <div className="flex items-end justify-between h-32 pt-4 px-2 border-b border-slate-200">
            {channelData.map((item, idx) => {
              const maxVal = Math.max(...channelData.map(c => c.value)) || 100;
              const heightPercent = Math.round((item.value / maxVal) * 100);

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-10">
                  <span className="text-[9px] font-mono font-bold text-slate-600">
                    {item.value}
                  </span>
                  <div className="w-6 bg-slate-100 rounded-t-sm flex items-end h-24 overflow-hidden">
                    <div
                      className="w-full rounded-t-sm transition-all duration-500 hover:brightness-110"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: building.color
                      }}
                      title={`${item.label}: ${item.value}`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 truncate w-12 text-center">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparativo Atendimento Humano x IA / Digital */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Atendimento Humano x Bot</span>
            <span className="font-mono text-slate-400 text-[10px]">% últimos 12 meses</span>
          </div>

          <div className="h-16 flex items-end gap-1 pt-2">
            {[64, 68, 71, 74, 76, 78, 81, 84, 85, 87, 89, 91].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-slate-200 rounded-t-xs hover:bg-slate-300 transition-colors"
                  style={{ height: `${val * 0.55}px` }}
                  title={`Mês ${i + 1}: ${val}%`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100">
            <span>Início: 64% automação</span>
            <span className="text-emerald-700 font-bold">Atual: 91% automação</span>
          </div>
        </div>

        {/* Building Technical Details */}
        <div className="bg-slate-100/70 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Supervisão Responsável:</span>
            <span className="font-medium text-slate-800">{building.supervisor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Capacidade da Planta:</span>
            <span className="font-mono font-semibold text-slate-800">{workstations.length} posições</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Meta SLA:</span>
            <span className="font-mono font-semibold text-emerald-700">{building.slaTargetPercentage}%</span>
          </div>
          {building.notes && (
            <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 leading-snug">
              {building.notes}
            </p>
          )}
        </div>
      </div>

      {/* 3. Footer Action Controls */}
      <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
        <button
          onClick={() => onEditBuilding(building)}
          className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
          <span>Editar Prédio</span>
        </button>

        <button
          onClick={() => onToggleStatus(building.id)}
          className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border ${
            isInactive 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
              : 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isInactive ? 'Reativar' : 'Desativar'}</span>
        </button>
      </div>
    </aside>
  );
};
