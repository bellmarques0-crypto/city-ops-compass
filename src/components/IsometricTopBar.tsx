/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CityMetrics } from '../types/city';
import { Plus, Building2, Sparkles, RotateCcw, Edit3, Check } from 'lucide-react';

interface IsometricTopBarProps {
  metrics: CityMetrics;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenAddModal: () => void;
  onResetDemo: () => void;
}

export const IsometricTopBar: React.FC<IsometricTopBarProps> = ({
  metrics,
  isEditMode,
  onToggleEditMode,
  onOpenAddModal,
  onResetDemo
}) => {
  return (
    <header className="absolute top-4 left-6 right-6 z-40 flex items-center justify-between gap-4 pointer-events-none select-none">
      {/* Brand Lockup Pill (Left, like CineVille pill card in screenshot) */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm font-bold text-base">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
            Cidade Operacional
          </h1>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            Tour de métricas · Plataforma de Gestão
          </p>
        </div>
      </div>

      {/* Center High-Level KPI Strip (like CineVille in screenshot) */}
      <div className="pointer-events-auto hidden md:flex items-center gap-8 bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-lg border border-white/80 text-xs">
        {/* Metric 1 */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-semibold text-slate-500 flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Operadores Ativos
          </span>
          <span className="font-black text-slate-900 text-sm font-mono mt-0.5 tabular-nums">
            {metrics.activePositions || 284}
          </span>
        </div>

        <div className="w-[1px] h-7 bg-slate-200" />

        {/* Metric 2 */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">
            Atendimentos Hoje
          </span>
          <span className="font-black text-slate-900 text-sm font-mono mt-0.5 tabular-nums">
            14.856.775
          </span>
        </div>

        <div className="w-[1px] h-7 bg-slate-200" />

        {/* Metric 3 */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">
            SLA Geral Médio
          </span>
          <span className="font-black text-slate-900 text-sm font-mono mt-0.5 flex items-center gap-1">
            <span>97,4%</span>
            <span className="text-emerald-600 text-[10px] font-bold">▲ 1,2%</span>
          </span>
        </div>

        <div className="w-[1px] h-7 bg-slate-200" />

        {/* Metric 4 */}
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase flex items-center gap-1">
            Uptime 30D
          </span>
          <span className="font-black text-slate-900 text-sm font-mono mt-0.5 flex items-center gap-1">
            <span>99,97%</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </span>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Reset Demo button */}
        <button
          onClick={onResetDemo}
          title="Restaurar dados padrão de demonstração"
          className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-700 rounded-2xl shadow-lg border border-white/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* "Editar Cidade" button requested in Section 1 */}
        <button
          onClick={onToggleEditMode}
          className={`px-4 py-2.5 rounded-2xl shadow-lg font-bold text-xs flex items-center gap-2 transition-all active:scale-95 ${
            isEditMode
              ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-400 ring-offset-2'
              : 'bg-white/95 hover:bg-slate-100 text-slate-800 border border-slate-200'
          }`}
          title="Alternar Modo de Edição da Planta e Design Urbano"
        >
          <Edit3 className="w-4 h-4 text-amber-500" />
          <span>{isEditMode ? 'Editando Cidade' : 'Editar Cidade'}</span>
        </button>

        {/* Add Building button */}
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg font-bold text-xs flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Prédio</span>
        </button>
      </div>
    </header>
  );
};
