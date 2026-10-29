/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Building, Workstation } from '../types/city';
import { BuildingNode } from './BuildingNode';
import { CentralAvenue } from './CentralAvenue';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Compass, 
  Trees, 
  Car, 
  MapPin, 
  Layers,
  Sparkles
} from 'lucide-react';

interface CityCanvasProps {
  buildings: Building[];
  workstationsMap: Record<string, Workstation[]>;
  selectedBuilding: Building | null;
  onSelectBuilding: (building: Building) => void;
  onOpenFloorPlan: (building: Building) => void;
  onUpdateBuildingPosition: (buildingId: string, position: { x: number; y: number }) => void;
  filterType: 'todos' | 'produto' | 'administrativo';
  searchQuery: string;
}

export const CityCanvas: React.FC<CityCanvasProps> = ({
  buildings,
  workstationsMap,
  selectedBuilding,
  onSelectBuilding,
  onOpenFloorPlan,
  onUpdateBuildingPosition,
  filterType,
  searchQuery
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 10 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Dragging individual buildings
  const [draggingBuildingId, setDraggingBuildingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [repositionMode, setRepositionMode] = useState<boolean>(false);

  // Compute total canvas width dynamically based on buildings
  const maxX = Math.max(1600, ...buildings.map(b => b.position.x + b.size.width + 120));
  const canvasWidth = Math.max(1800, maxX);
  const canvasHeight = 850;

  // Filter buildings by category / search
  const visibleBuildings = buildings.filter(b => {
    if (filterType !== 'todos' && b.type !== filterType) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchCode = b.code.toLowerCase().includes(q);
      const matchCategory = b.category.toLowerCase().includes(q);
      return matchName || matchCode || matchCategory;
    }
    return true;
  });

  // Handle Canvas Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    // If clicking on empty canvas space, start panning
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-background')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggingBuildingId && repositionMode) {
      const building = buildings.find(b => b.id === draggingBuildingId);
      if (building) {
        // Calculate new X, Y clamped to valid zones
        let newX = Math.max(20, Math.min(canvasWidth - building.size.width - 20, Math.round((e.clientX - dragOffset.x - pan.x) / zoom)));
        let newY = Math.max(20, Math.min(canvasHeight - building.size.height - 20, Math.round((e.clientY - dragOffset.y - pan.y) / zoom)));
        
        // Prevent dropping inside the central street (Y: 300 to 470)
        if (building.type === 'produto') {
          newY = Math.min(270, Math.max(40, newY));
        } else {
          newY = Math.max(500, Math.min(650, newY));
        }

        onUpdateBuildingPosition(draggingBuildingId, { x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingBuildingId(null);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(1.5, Math.max(0.5, +(prev + delta).toFixed(2))));
  };

  const handleResetView = () => {
    setZoom(0.95);
    setPan({ x: 20, y: 10 });
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      handleZoom(delta);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden bg-[#e5e9ec] select-none cursor-grab active:cursor-grabbing border-b border-slate-300"
    >
      {/* Floating Canvas Navigation Toolbar */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-lg shadow-md border border-slate-200">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-slate-600 px-1 font-semibold tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
        <button
          onClick={handleResetView}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Centralizar Visão"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
        <button
          onClick={() => setRepositionMode(!repositionMode)}
          className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
            repositionMode 
              ? 'bg-amber-500 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Permitir arrastar e reposicionar prédios"
        >
          <Move className="w-3.5 h-3.5" />
          <span>{repositionMode ? 'Arrastar Ativo' : 'Reposicionar'}</span>
        </button>
      </div>

      {/* Floating Compass and Campus Legend */}
      <div className="absolute bottom-4 left-4 z-30 pointer-events-none flex items-center gap-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-sm text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-800">Campus Operacional</span>
        </div>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
          <span className="text-[11px] text-slate-600">Prédios de Produtos (Norte)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600" />
          <span className="text-[11px] text-slate-600">Área Administrativa (Sul)</span>
        </div>
        <span className="text-slate-300">|</span>
        <span className="text-[10px] font-mono text-slate-400">
          Role com Ctrl para zoom · Arraste para mover
        </span>
      </div>

      {/* World Transform Container */}
      <div
        className="canvas-background absolute top-0 left-0 origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`
        }}
      >
        {/* City Grass & Urban Parcel Ground with Subtle Grid */}
        <div 
          className="canvas-background absolute inset-0 bg-[#e4e9ed]"
          style={{
            backgroundImage: `
              radial-gradient(#cbd5e1 1.5px, transparent 1.5px),
              linear-gradient(to right, rgba(203, 213, 225, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(203, 213, 225, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px, 120px 120px, 120px 120px'
          }}
        />

        {/* NORTH ZONE: PRODUCT BUILDINGS AREA */}
        <div className="absolute top-4 left-6 pointer-events-none select-none flex items-center gap-2 z-0">
          <div className="bg-emerald-900/10 border border-emerald-700/20 px-3 py-1 rounded text-emerald-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Setor de Operações & Prédios de Produtos
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Atendimento Ativo, Receptivo & Mesas de Negociação
          </span>
        </div>

        {/* Landscaping / Tree Planters between Product Buildings */}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div 
            key={`tree-north-${idx}`}
            className="absolute top-[268px] flex items-center gap-2 pointer-events-none"
            style={{ left: `${260 + idx * 260}px` }}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-700/80 border-2 border-emerald-900/40 shadow-sm flex items-center justify-center">
              <Trees className="w-3 h-3 text-emerald-200" />
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-600/70 border border-emerald-800/40 shadow-xs" />
          </div>
        ))}

        {/* CENTRAL STREET (AVENIDA CENTRAL) */}
        <CentralAvenue totalWidth={canvasWidth} />

        {/* SOUTH ZONE: ADMINISTRATIVE & IT AREA */}
        <div className="absolute top-[490px] left-6 pointer-events-none select-none flex items-center gap-2 z-0">
          <div className="bg-blue-900/10 border border-blue-700/20 px-3 py-1 rounded text-blue-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Setor Administrativo, Diretoria & Infraestrutura T.I.
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Gestão Corporativa, NOC 24/7, Recursos Humanos & Salas de Apoio
          </span>
        </div>

        {/* Landscaping / Parking Lot Decor South Zone */}
        <div className="absolute top-[720px] left-[60px] pointer-events-none flex items-center gap-4 bg-slate-300/40 border border-slate-300 px-4 py-2 rounded-lg">
          <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
            <Car className="w-3.5 h-3.5" />
            <span>Estacionamento Administrativo Vagas A1 - A24</span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-6 h-8 border-x border-dashed border-slate-400 bg-slate-200/50 rounded-xs flex items-center justify-center text-[8px] font-mono text-slate-400">
                P{i+1}
              </div>
            ))}
          </div>
        </div>

        {/* BUILDINGS RENDER LAYER */}
        {visibleBuildings.map((building) => {
          const buildingWorkstations = workstationsMap[building.id] || [];
          const isSelected = selectedBuilding?.id === building.id;

          return (
            <BuildingNode
              key={building.id}
              building={building}
              workstations={buildingWorkstations}
              isSelected={isSelected}
              onSelect={onSelectBuilding}
              onOpenFloorPlan={onOpenFloorPlan}
              onStartDrag={(e) => {
                if (repositionMode) {
                  e.stopPropagation();
                  setDraggingBuildingId(building.id);
                  setDragOffset({
                    x: e.clientX - pan.x - building.position.x * zoom,
                    y: e.clientY - pan.y - building.position.y * zoom
                  });
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
