/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, RotateCcw, Building2, BarChart3, Search } from 'lucide-react';
import { CityMetrics } from '../types/city';

interface TopBarProps {
  metrics: CityMetrics;
  filterType: 'todos' | 'produto' | 'administrativo';
  onFilterChange: (type: 'todos' | 'produto' | 'administrativo') => void;
  onOpenAddModal: () => void;
  onResetDemo: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  metrics,
  filterType,
  onFilterChange,
  onOpenAddModal,
  onResetDemo,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 shrink-0 select-none z-30 shadow-xs">
      {/* Zone 1: Single text element brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="/" 
          onClick={e => { e.preventDefault(); onFilterChange('todos'); }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            CO
          </div>
          <span>Cidade Operacional 2D</span>
        </a>
      </div>

      {/* Zone 2: 4-5 clean single-line navigation links / filters */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 shrink-0">
        <button
          onClick={() => onFilterChange('todos')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            filterType === 'todos' ? 'text-slate-900 font-bold border-b-2 border-slate-900' : ''
          }`}
        >
          Todos os Prédios ({metrics.totalBuildings})
        </button>
        <button
          onClick={() => onFilterChange('produto')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            filterType === 'produto' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : ''
          }`}
        >
          Prédios dos Produtos ({metrics.productBuildings})
        </button>
        <button
          onClick={() => onFilterChange('administrativo')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            filterType === 'administrativo' ? 'text-blue-700 font-bold border-b-2 border-blue-600' : ''
          }`}
        >
          Área Administrativa ({metrics.adminBuildings})
        </button>
        
        {/* Unboxed inline metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono pl-2 border-l border-slate-200">
          <span>{metrics.totalPositions} PAs</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 font-semibold">{metrics.occupancyRate}% Ocupação</span>
          <span aria-hidden="true">·</span>
          <span>{metrics.inCallPositions} em Chamada</span>
        </div>
      </nav>

      {/* Zone 3: Primary Action & Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <div className="relative w-44 md:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar produto ou prédio..."
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Reset to Demo button */}
        <button
          onClick={onResetDemo}
          title="Restaurar dados padrão de demonstração"
          className="p-2 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Primary CTA: Adicionar Prédio */}
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Prédio</span>
        </button>
      </div>
    </header>
  );
};
