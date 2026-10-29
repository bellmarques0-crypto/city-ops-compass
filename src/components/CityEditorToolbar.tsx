/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UrbanElementType } from '../types/city';
import { 
  MousePointer, 
  Building2, 
  Trees, 
  Car, 
  Compass, 
  Undo2, 
  Redo2, 
  Save, 
  X, 
  Grid, 
  Layers, 
  Sparkles, 
  Plus, 
  Trash2, 
  RotateCw, 
  Copy, 
  Lock, 
  Unlock,
  ChevronDown,
  Maximize2,
  FolderPlus,
  Compass as RoadIcon
} from 'lucide-react';

interface CityEditorToolbarProps {
  onAddBuilding: () => void;
  onAddUrbanElement: (type: UrbanElementType) => void;
  onAddRoad: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  gridSnap: boolean;
  onToggleGridSnap: () => void;
  showGrid: boolean;
  onToggleShowGrid: () => void;
  onToggleLayersPanel: () => void;
  isLayersPanelOpen: boolean;
  onRotateSelected: () => void;
  onDuplicateSelected: () => void;
  onDeleteSelected: () => void;
  hasSelectedItem: boolean;
  isItemLocked: boolean;
  onToggleItemLock: () => void;
  onSave: () => void;
  onCancel: () => void;
  hasUnsavedChanges: boolean;
}

export const CityEditorToolbar: React.FC<CityEditorToolbarProps> = ({
  onAddBuilding,
  onAddUrbanElement,
  onAddRoad,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  gridSnap,
  onToggleGridSnap,
  showGrid,
  onToggleShowGrid,
  onToggleLayersPanel,
  isLayersPanelOpen,
  onRotateSelected,
  onDuplicateSelected,
  onDeleteSelected,
  hasSelectedItem,
  isItemLocked,
  onToggleItemLock,
  onSave,
  onCancel,
  hasUnsavedChanges
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'plazas' | 'furniture' | 'roads' | null>(null);
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  // Click outside and escape key handling to dismiss dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = (name: 'plazas' | 'furniture' | 'roads') => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const handleSelectElement = (type: UrbanElementType) => {
    onAddUrbanElement(type);
    setActiveDropdown(null);
  };

  return (
    <div 
      ref={toolbarRef}
      className="absolute top-20 left-1/2 -translate-x-1/2 z-50 select-none flex items-center justify-center p-1 pointer-events-auto max-w-[98vw] overflow-visible"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap overflow-visible relative">
        {/* Mode Indicator */}
        <div className="flex items-center gap-2 pr-2.5 border-r border-slate-700 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px] hidden sm:inline">
            Editor da Cidade
          </span>
        </div>

        {/* 1. Selecionar */}
        <button
          type="button"
          className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 flex items-center gap-1 transition-colors shadow-2xs shrink-0"
          title="Modo Seleção e Movimentação"
        >
          <MousePointer className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Selecionar</span>
        </button>

        {/* 2. + Prédio */}
        <button
          type="button"
          onClick={onAddBuilding}
          className="p-2 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1 transition-colors shrink-0"
          title="Criar novo prédio"
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>+ Prédio</span>
        </button>

        {/* 3. + Ruas Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('roads');
            }}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeDropdown === 'roads' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 ring-2 ring-amber-500/20' 
                : 'hover:bg-slate-800 text-slate-200 hover:text-white'
            }`}
          >
            <RoadIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Ruas</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'roads' ? 'rotate-180 text-amber-400' : ''}`} />
          </button>

          {activeDropdown === 'roads' && (
            <div 
              className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-600 rounded-xl shadow-2xl p-2 z-[100] text-xs flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 px-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Sistema Viário & Vias
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Quinas Vivas</span>
              </div>
              <button
                type="button"
                onClick={() => { onAddRoad(); setActiveDropdown(null); }}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-100 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 border border-slate-400 group-hover:bg-amber-400 transition-colors" />
                  <span className="font-semibold">Nova Via Asfaltada</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">+ Pista</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('faixa_pedestres')}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors"
              >
                <span className="font-mono text-xs text-slate-400 font-bold">|||</span>
                <span>Faixa de Pedestres</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('caminho_pedestres')}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-sm bg-stone-500" />
                <span>Caminho em Pedras</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('calcada')}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition-colors"
              >
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                <span>Calçada com Guia & Meio-fio</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. + Praças & Jardins */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('plazas');
            }}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeDropdown === 'plazas' 
                ? 'bg-lime-500/20 text-lime-300 border border-lime-500/40 ring-2 ring-lime-500/20' 
                : 'hover:bg-slate-800 text-slate-200 hover:text-white'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-lime-400" />
            <span>+ Praças</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'plazas' ? 'rotate-180 text-lime-400' : ''}`} />
          </button>

          {activeDropdown === 'plazas' && (
            <div 
              className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-600 rounded-xl shadow-2xl p-2 z-[100] text-xs flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 px-1">
                <span className="text-[10px] font-mono text-lime-400 uppercase tracking-wider font-bold">
                  Áreas de Convivência & Lazer
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSelectElement('praca_central')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-100 flex items-center justify-between transition-colors"
              >
                <span className="font-semibold">Praça Central</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">140x140</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('praca_pequena')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>Praça Pequena / Largo</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-1.5 py-0.5 rounded">90x90</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('jardim')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Jardim Floral & Canteiro
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('area_gramada')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Parque Gramado
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('arvores')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Palmeira Tropical
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('fonte')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Chafariz com Jatos D'água
              </button>
            </div>
          )}
        </div>

        {/* 5. + Mobiliário */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown('furniture');
            }}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeDropdown === 'furniture' 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 ring-2 ring-sky-500/20' 
                : 'hover:bg-slate-800 text-slate-200 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-sky-400" />
            <span>+ Mobiliário</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'furniture' ? 'rotate-180 text-sky-400' : ''}`} />
          </button>

          {activeDropdown === 'furniture' && (
            <div 
              className="absolute left-0 top-full mt-2 w-64 bg-slate-900 border border-slate-600 rounded-xl shadow-2xl p-2 z-[100] text-xs flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 px-1">
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold">
                  Mobiliário Urbano Individual
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSelectElement('bancos')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Banco de Madeira
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('area_descanso')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Pergolado Lounge
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('estacionamento')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Vagas de Estacionamento
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('bicicletario')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Bicicletário
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('iluminacao_urbana')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Poste LED Iluminação
              </button>
              <button
                type="button"
                onClick={() => handleSelectElement('ponto_encontro')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
              >
                Totem Ponto de Encontro
              </button>
            </div>
          )}
        </div>

        <div className="w-[1px] h-6 bg-slate-700 mx-1 shrink-0" />

        {/* Selected Item Quick Tools: Rotate, Duplicate, Lock, Delete */}
        {hasSelectedItem && (
          <div className="flex items-center gap-1 shrink-0 bg-slate-800/80 px-1 py-0.5 rounded-xl border border-slate-700">
            <button
              onClick={onRotateSelected}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200"
              title="Girar 90 graus"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDuplicateSelected}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200"
              title="Duplicar elemento"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleItemLock}
              className={`p-1.5 rounded-lg ${isItemLocked ? 'bg-amber-500 text-white' : 'hover:bg-slate-700 text-slate-200'}`}
              title={isItemLocked ? 'Desbloquear' : 'Bloquear'}
            >
              {isItemLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onDeleteSelected}
              className="p-1.5 rounded-lg hover:bg-rose-900/60 text-rose-400"
              title="Excluir elemento selecionado (Delete)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Layers Panel Toggle */}
        <button
          onClick={onToggleLayersPanel}
          className={`p-2 rounded-xl flex items-center gap-1 transition-colors shrink-0 ${
            isLayersPanelOpen ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Abrir painel de camadas da cidade"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden lg:inline">Camadas</span>
        </button>

        {/* Grid & Snap */}
        <button
          onClick={onToggleShowGrid}
          className={`p-2 rounded-xl flex items-center gap-1 transition-colors shrink-0 ${
            showGrid ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Exibir grade isométrica"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleGridSnap}
          className={`p-2 rounded-xl flex items-center gap-1 transition-colors shrink-0 ${
            gridSnap ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Ajuste magnético à grade (Snap)"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-6 bg-slate-700 mx-1 shrink-0" />

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-xl transition-colors shrink-0 ${
            canUndo ? 'hover:bg-slate-800 text-slate-200' : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Desfazer (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-xl transition-colors shrink-0 ${
            canRedo ? 'hover:bg-slate-800 text-slate-200' : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Refazer (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-6 bg-slate-700 mx-1 shrink-0" />

        {/* Save */}
        <button
          onClick={onSave}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-md active:scale-95 shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Salvar</span>
          {hasUnsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
          )}
        </button>

        {/* Cancel */}
        <button
          onClick={onCancel}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 transition-colors flex items-center gap-1 shrink-0"
          title="Descartar alterações e sair do editor"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
};
