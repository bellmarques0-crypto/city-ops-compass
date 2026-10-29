/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  Building, 
  UrbanElement, 
  RoadSegment,
  BuildingArchitectureModel, 
  BuildingRoofType,
  RoadPavingType,
  RoadMarkingType
} from '../types/city';
import { 
  X, 
  RotateCw, 
  Copy, 
  Lock, 
  Unlock, 
  Trash2, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Palette, 
  Sliders, 
  Building2,
  Compass,
  Check,
  Maximize2
} from 'lucide-react';

interface ElementInspectorProps {
  selectedBuilding: Building | null;
  selectedUrbanElement: UrbanElement | null;
  selectedRoad: RoadSegment | null;
  onUpdateBuilding: (updated: Partial<Building>) => void;
  onUpdateUrbanElement: (updated: Partial<UrbanElement>) => void;
  onUpdateRoad: (updated: Partial<RoadSegment>) => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onToggleLock: () => void;
  onDeleteRequest: () => void;
  onClose: () => void;
}

const ARCHITECTURE_MODELS: { value: BuildingArchitectureModel; label: string }[] = [
  { value: 'corporate-hotel', label: 'Hotel & Resort Corporativo (PINE)' },
  { value: 'modern-fintech', label: 'Cubo Moderno Fintech (BYX)' },
  { value: 'soundstage-hangar', label: 'Hangar Arqueado / Soundstage (AMIGOZ)' },
  { value: 'neon-billboard', label: 'Comercial com Outdoor Neon (RETENÇÃO)' },
  { value: 'classic-auditorium', label: 'Auditório Neoclássico (ORCREDI)' },
  { value: 'glass-tower', label: 'Torre de Vidro & Antena T.I.' },
  { value: 'executive-palace', label: 'Palácio Executivo & Colunas (ADM 1)' },
  { value: 'finance-vault', label: 'Bloco Financeiro & Compliance (ADM 2)' },
  { value: 'support-campus', label: 'Pavilhão de Apoio & Treinamento' }
];

const ROOF_TYPES: { value: BuildingRoofType; label: string }[] = [
  { value: 'pool', label: 'Piscina & Lounge Solarium' },
  { value: 'helipad', label: 'Heliponto Operacional (H)' },
  { value: 'antennas', label: 'Mastro de Telecom & NOC' },
  { value: 'billboard', label: 'Outdoor Letreiro Neon' },
  { value: 'solar', label: 'Painéis Fotovoltaicos Solares' },
  { value: 'cornice', label: 'Cornija & Cúpula Dourada' },
  { value: 'standard', label: 'Cobertura Padrão' }
];

export const ElementInspector: React.FC<ElementInspectorProps> = ({
  selectedBuilding,
  selectedUrbanElement,
  selectedRoad,
  onUpdateBuilding,
  onUpdateUrbanElement,
  onUpdateRoad,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onToggleLock,
  onDeleteRequest,
  onClose
}) => {
  if (!selectedBuilding && !selectedUrbanElement && !selectedRoad) return null;

  const isBuilding = !!selectedBuilding;
  const isRoad = !!selectedRoad;
  const isElement = !!selectedUrbanElement;

  const isLocked = isBuilding 
    ? selectedBuilding.locked 
    : isRoad 
    ? selectedRoad.locked 
    : selectedUrbanElement?.locked;

  const currentRotation = (isBuilding ? selectedBuilding.rotation : isElement ? selectedUrbanElement?.rotation : 0) || 0;
  const currentScale = (isBuilding ? selectedBuilding.scale : isElement ? selectedUrbanElement?.scale : 1) || 1;

  const roadLength = useMemo(() => {
    if (!selectedRoad?.points || selectedRoad.points.length < 2) return 0;
    let len = 0;
    for (let i = 0; i < selectedRoad.points.length - 1; i++) {
      len += Math.hypot(
        selectedRoad.points[i + 1].x - selectedRoad.points[i].x,
        selectedRoad.points[i + 1].y - selectedRoad.points[i].y
      );
    }
    return Math.round(len);
  }, [selectedRoad?.points]);

  const handleAdjustRoadLength = (newTargetLength: number) => {
    if (!selectedRoad?.points || selectedRoad.points.length < 2) return;
    const currentLen = roadLength;
    if (currentLen <= 0) return;
    const target = Math.max(80, Math.min(1600, newTargetLength));
    const ratio = target / currentLen;

    const startPt = selectedRoad.points[0];
    const newPoints = [{ ...startPt }];

    for (let i = 1; i < selectedRoad.points.length; i++) {
      const prevOrig = selectedRoad.points[i - 1];
      const currOrig = selectedRoad.points[i];
      const prevNew = newPoints[i - 1];

      const dx = (currOrig.x - prevOrig.x) * ratio;
      const dy = (currOrig.y - prevOrig.y) * ratio;

      newPoints.push({
        x: Math.round(prevNew.x + dx),
        y: Math.round(prevNew.y + dy)
      });
    }

    onUpdateRoad({ points: newPoints });
  };

  const handleRotate = () => {
    const nextRotation = (currentRotation + 90) % 360;
    if (isBuilding) {
      onUpdateBuilding({ rotation: nextRotation });
    } else if (isElement) {
      onUpdateUrbanElement({ rotation: nextRotation });
    }
  };

  const handleScaleChange = (newScale: number) => {
    const clamped = Math.min(2.5, Math.max(0.5, +newScale.toFixed(2)));
    if (isBuilding) {
      onUpdateBuilding({ scale: clamped });
    } else if (isElement) {
      onUpdateUrbanElement({ scale: clamped });
    }
  };

  return (
    <div className="absolute top-20 right-6 z-50 select-none w-84 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200 text-xs flex flex-col max-h-[82vh]">
      {/* Header */}
      <div 
        className="px-4 py-3 text-white flex items-center justify-between shrink-0"
        style={{
          backgroundColor: selectedBuilding ? selectedBuilding.color : selectedRoad ? '#334155' : '#0f172a'
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {isBuilding ? <Building2 className="w-4 h-4 shrink-0" /> : isRoad ? <Compass className="w-4 h-4 shrink-0" /> : <Sliders className="w-4 h-4 shrink-0" />}
          <div className="truncate">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-85 block">
              {isBuilding ? 'Prédio' : isRoad ? 'Via Urbana / Rua' : 'Mobiliário & Paisagismo'}
            </span>
            <h4 className="font-extrabold text-sm truncate">
              {selectedBuilding ? selectedBuilding.name : selectedRoad ? selectedRoad.name : selectedUrbanElement?.name}
            </h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-black/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* ================= 1. BUILDING INSPECTOR ================= */}
        {isBuilding && selectedBuilding && (
          <>
            {/* Dimensions: Width, Depth, Height */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Dimensões Arquitetônicas Reais
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Largura (px)</label>
                  <input
                    type="number"
                    min="80"
                    max="300"
                    step="10"
                    value={selectedBuilding.customWidth || 140}
                    onChange={e => onUpdateBuilding({ customWidth: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Profundidade</label>
                  <input
                    type="number"
                    min="60"
                    max="240"
                    step="10"
                    value={selectedBuilding.customDepth || 100}
                    onChange={e => onUpdateBuilding({ customDepth: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Altura Visual</label>
                  <input
                    type="number"
                    min="60"
                    max="280"
                    step="10"
                    value={selectedBuilding.customHeight || 110}
                    onChange={e => onUpdateBuilding({ customHeight: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono font-bold bg-white"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5 font-mono">Posição X</label>
                  <input
                    type="number"
                    value={selectedBuilding.isoX}
                    onChange={e => onUpdateBuilding({ isoX: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5 font-mono">Posição Y</label>
                  <input
                    type="number"
                    value={selectedBuilding.isoY}
                    onChange={e => onUpdateBuilding({ isoY: Number(e.target.value) })}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Architecture Model Layout Presets */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  Layout & Estilo Arquitetônico
                </label>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-mono">
                  9 Modelos
                </span>
              </div>

              {/* Quick Model Layout Buttons Grid (1-click layout switch) */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {[
                  { id: 'corporate-hotel', label: 'Hotel Resort', icon: '🏨' },
                  { id: 'glass-tower', label: 'Torre Tech', icon: '🏢' },
                  { id: 'neon-billboard', label: 'Neon Ads', icon: '📺' },
                  { id: 'soundstage-hangar', label: 'Estúdio Stage', icon: '🎬' },
                  { id: 'classic-auditorium', label: 'Cine Clássico', icon: '🎭' },
                  { id: 'modern-fintech', label: 'Fintech Cube', icon: '💳' },
                  { id: 'executive-palace', label: 'Palácio ADM 1', icon: '🏛️' },
                  { id: 'finance-vault', label: 'Cofre ADM 2', icon: '🏦' },
                  { id: 'support-campus', label: 'Campus Apoio', icon: '🌿' }
                ].map(item => {
                  const isCurrent = (selectedBuilding.model || 'corporate-hotel') === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const m = item.id as BuildingArchitectureModel;
                        const defaults: Record<string, { r: BuildingRoofType; w: number; d: number; h: number; c: 'curvo' | 'reto'; curved: boolean }> = {
                          'corporate-hotel': { r: 'pool', w: 150, d: 110, h: 110, c: 'curvo', curved: true },
                          'glass-tower': { r: 'antennas', w: 120, d: 90, h: 180, c: 'reto', curved: false },
                          'neon-billboard': { r: 'billboard', w: 160, d: 100, h: 120, c: 'curvo', curved: true },
                          'soundstage-hangar': { r: 'standard', w: 170, d: 120, h: 95, c: 'curvo', curved: true },
                          'classic-auditorium': { r: 'cornice', w: 150, d: 110, h: 115, c: 'reto', curved: false },
                          'modern-fintech': { r: 'helipad', w: 130, d: 110, h: 130, c: 'reto', curved: false },
                          'executive-palace': { r: 'cornice', w: 170, d: 110, h: 105, c: 'reto', curved: false },
                          'finance-vault': { r: 'solar', w: 140, d: 100, h: 110, c: 'reto', curved: false },
                          'support-campus': { r: 'solar', w: 160, d: 90, h: 85, c: 'curvo', curved: true }
                        };
                        const conf = defaults[m];
                        onUpdateBuilding({
                          model: m,
                          roofType: conf.r,
                          customWidth: conf.w,
                          customDepth: conf.d,
                          customHeight: conf.h,
                          cornerStyle: conf.c,
                          isCurved: conf.curved
                        });
                      }}
                      className={`p-1.5 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-400/30'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="text-sm leading-none">{item.icon}</span>
                      <span className="text-[10px] font-bold leading-tight truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dropdown Alternative */}
              <div className="pt-1 border-t border-slate-200">
                <label className="block text-[10px] text-slate-600 mb-1 font-semibold">
                  Lista Completa de Modelos:
                </label>
                <select
                  value={selectedBuilding.model || 'corporate-hotel'}
                  onChange={e => {
                    const m = e.target.value as BuildingArchitectureModel;
                    const defaults: Record<string, { r: BuildingRoofType; w: number; d: number; h: number; c: 'curvo' | 'reto'; curved: boolean }> = {
                      'corporate-hotel': { r: 'pool', w: 150, d: 110, h: 110, c: 'curvo', curved: true },
                      'glass-tower': { r: 'antennas', w: 120, d: 90, h: 180, c: 'reto', curved: false },
                      'neon-billboard': { r: 'billboard', w: 160, d: 100, h: 120, c: 'curvo', curved: true },
                      'soundstage-hangar': { r: 'standard', w: 170, d: 120, h: 95, c: 'curvo', curved: true },
                      'classic-auditorium': { r: 'cornice', w: 150, d: 110, h: 115, c: 'reto', curved: false },
                      'modern-fintech': { r: 'helipad', w: 130, d: 110, h: 130, c: 'reto', curved: false },
                      'executive-palace': { r: 'cornice', w: 170, d: 110, h: 105, c: 'reto', curved: false },
                      'finance-vault': { r: 'solar', w: 140, d: 100, h: 110, c: 'reto', curved: false },
                      'support-campus': { r: 'solar', w: 160, d: 90, h: 85, c: 'curvo', curved: true }
                    };
                    const conf = defaults[m] || { r: 'standard' as BuildingRoofType, w: 140, d: 100, h: 110, c: 'curvo' as const, curved: true };
                    onUpdateBuilding({
                      model: m,
                      roofType: conf.r,
                      customWidth: conf.w,
                      customDepth: conf.d,
                      customHeight: conf.h,
                      cornerStyle: conf.c,
                      isCurved: conf.curved
                    });
                  }}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white font-medium text-xs focus:ring-2 focus:ring-slate-900"
                >
                  {ARCHITECTURE_MODELS.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roof Type Customization */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Acessório de Cobertura (Teto)
              </label>
              <select
                value={selectedBuilding.roofType || 'standard'}
                onChange={e => onUpdateBuilding({ roofType: e.target.value as BuildingRoofType })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-xs focus:ring-2 focus:ring-slate-900"
              >
                {ROOF_TYPES.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Corner Curvature & Facade Style */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Curvatura Arquitetônica
              </label>
              <select
                value={selectedBuilding.cornerStyle || (selectedBuilding.isCurved ? 'curvo' : 'curvo')}
                onChange={e => {
                  const isC = e.target.value === 'curvo';
                  onUpdateBuilding({ cornerStyle: e.target.value as 'curvo' | 'reto', isCurved: isC });
                }}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-xs focus:ring-2 focus:ring-slate-900"
              >
                <option value="curvo">Curvo & Arredondado (Estilo Diorama / CineVille)</option>
                <option value="reto">Reto Tradicional (Arestas Vivas)</option>
              </select>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>Cores da Fachada</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="color"
                    value={selectedBuilding.color}
                    onChange={e => onUpdateBuilding({ color: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-[10px] font-mono text-slate-600">Primária</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <input
                    type="color"
                    value={selectedBuilding.secondaryColor || selectedBuilding.color}
                    onChange={e => onUpdateBuilding({ secondaryColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-[10px] font-mono text-slate-600">Secundária</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= 2. ROAD INSPECTOR ================= */}
        {isRoad && selectedRoad && (
          <div className="space-y-3">
            {/* Road Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Identificação da Via
              </label>
              <input
                type="text"
                value={selectedRoad.name}
                onChange={e => onUpdateRoad({ name: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-xs"
              />
            </div>

            {/* Paving Type */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Pavimentação</label>
                <select
                  value={selectedRoad.paving}
                  onChange={e => onUpdateRoad({ paving: e.target.value as RoadPavingType })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="asfalto">Asfalto Urbano</option>
                  <option value="paralelepipedo">Paralelepípedo</option>
                  <option value="concreto">Concreto / Blocos</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Faixa Central</label>
                <select
                  value={selectedRoad.markingType || 'amarela_tracejada'}
                  onChange={e => onUpdateRoad({ markingType: e.target.value as RoadMarkingType })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="amarela_tracejada">Amarela Tracejada</option>
                  <option value="branca_tracejada">Branca Tracejada</option>
                  <option value="continua">Branca Contínua</option>
                  <option value="dupla_amarela">Dupla Contínua</option>
                  <option value="nenhuma">Sem Marcação</option>
                </select>
              </div>
            </div>

            {/* Road Width & Sidewalk Width */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Largura da Pista:</span>
                <span className="font-mono font-bold text-slate-900">{selectedRoad.width}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="120"
                step="4"
                value={selectedRoad.width}
                onChange={e => onUpdateRoad({ width: Number(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                <label className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedRoad.hasSidewalk !== false}
                    onChange={e => onUpdateRoad({ hasSidewalk: e.target.checked })}
                    className="rounded text-slate-900"
                  />
                  <span>Calçadas Laterais</span>
                </label>
                <span className="font-mono text-slate-600 text-[11px]">{selectedRoad.sidewalkWidth || 8}px</span>
              </div>
            </div>

            {/* Quinas e Terminações da Via */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                Geometria das Quinas e Pontas
              </span>

              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Cantos e Curvas (Quinas):
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateRoad({ cornerType: 'quina' })}
                      className={`py-1 px-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                        (selectedRoad.cornerType || 'quina') === 'quina'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Quinas Vivas
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateRoad({ cornerType: 'bisel' })}
                      className={`py-1 px-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                        selectedRoad.cornerType === 'bisel'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Chanfrada
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateRoad({ cornerType: 'arredondada' })}
                      className={`py-1 px-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                        selectedRoad.cornerType === 'arredondada'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Arredondada
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Terminação das Extremidades:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateRoad({ capType: 'reta' })}
                      className={`py-1 px-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                        (selectedRoad.capType || 'reta') === 'reta'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Corte Reto
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateRoad({ capType: 'quadrada' })}
                      className={`py-1 px-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                        selectedRoad.capType === 'quadrada'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Projetada
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateRoad({ capType: 'arredondada' })}
                      className={`py-1 px-1.5 rounded text-[11px] font-medium border text-center transition-all ${
                        selectedRoad.capType === 'arredondada'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Arredondada
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Road Length (Comprimento da Rua) */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Comprimento da Via:</span>
                </span>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {roadLength}px
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="1400"
                step="20"
                value={roadLength}
                onChange={e => handleAdjustRoadLength(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />

              {/* Quick Length Adjust Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleAdjustRoadLength(roadLength - 60)}
                  className="py-1 px-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 text-center"
                  title="Encurtar via em 60px"
                >
                  -60px
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustRoadLength(roadLength + 60)}
                  className="py-1 px-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 text-center"
                  title="Esticar via em 60px"
                >
                  +60px
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustRoadLength(Math.round(roadLength * 0.8))}
                  className="py-1 px-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-700 text-center"
                  title="Reduzir comprimento em 20%"
                >
                  -20%
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustRoadLength(Math.round(roadLength * 1.25))}
                  className="py-1 px-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[10px] font-bold text-blue-600 text-center"
                  title="Esticar comprimento em 25%"
                >
                  +25%
                </button>
              </div>
            </div>

            {/* Control points info */}
            <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Pontos de Controle:</span>
                <span>{selectedRoad.points?.length || 2} vértices</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Arraste os pinos coloridos no mapa para alterar curvas e extremidades. Clique no botão (+) para adicionar vértices.
              </p>
            </div>
          </div>
        )}

        {/* ================= 3. URBAN ELEMENT INSPECTOR ================= */}
        {isElement && selectedUrbanElement && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nome do Elemento</label>
              <input
                type="text"
                value={selectedUrbanElement.name}
                onChange={e => onUpdateUrbanElement({ name: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-medium text-xs"
              />
            </div>

            {/* Position */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5 font-mono">Posição X</label>
                <input
                  type="number"
                  value={selectedUrbanElement.x}
                  onChange={e => onUpdateUrbanElement({ x: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5 font-mono">Posição Y</label>
                <input
                  type="number"
                  value={selectedUrbanElement.y}
                  onChange={e => onUpdateUrbanElement({ y: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-mono bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Transform Controls: Rotate & Scale (For Buildings and Elements) */}
        {!isRoad && (
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Giro & Proporção
            </span>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleRotate}
                className="flex-1 py-1.5 px-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs"
                title="Girar 90 graus"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Girar ({currentRotation}°)</span>
              </button>

              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => handleScaleChange(currentScale - 0.1)}
                  className="w-6 h-6 rounded hover:bg-slate-100 font-bold text-slate-600 flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-mono font-bold text-slate-800 text-[11px] px-1">
                  {Math.round(currentScale * 100)}%
                </span>
                <button
                  onClick={() => handleScaleChange(currentScale + 0.1)}
                  className="w-6 h-6 rounded hover:bg-slate-100 font-bold text-slate-600 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Layer Ordering (Forward / Backward) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Ordem de Sobreposição
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBringForward}
              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 flex items-center justify-center gap-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Para Frente</span>
            </button>
            <button
              onClick={onSendBackward}
              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 flex items-center justify-center gap-1"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>Para Trás</span>
            </button>
          </div>
        </div>

        {/* Actions: Duplicate, Lock, Delete */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
          {!isRoad && (
            <button
              onClick={onDuplicate}
              className="flex-1 py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-1 text-xs"
              title="Duplicar elemento"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicar</span>
            </button>
          )}

          <button
            onClick={onToggleLock}
            className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1 ${
              isLocked
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isLocked ? 'Desbloquear movimentação' : 'Bloquear posição'}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onDeleteRequest}
            className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold flex items-center justify-center gap-1"
            title="Excluir elemento"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
