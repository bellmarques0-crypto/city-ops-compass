/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Building, 
  Workstation, 
  UrbanElement, 
  RoadSegment, 
  CityLayerKey, 
  CityLayerConfig 
} from '../types/city';
import { IsometricBuildingSvg } from './IsometricBuildingSvg';
import { UrbanElementSvg } from './UrbanElementSvg';
import { RoadNetworkSvg } from './RoadNetworkSvg';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw
} from 'lucide-react';

interface IsometricCityProps {
  buildings: Building[];
  workstationsMap: Record<string, Workstation[]>;
  urbanElements: UrbanElement[];
  roads: RoadSegment[];
  selectedBuilding: Building | null;
  selectedUrbanElement: UrbanElement | null;
  selectedRoad: RoadSegment | null;
  onSelectBuilding: (building: Building) => void;
  onSelectUrbanElement: (element: UrbanElement) => void;
  onSelectRoad: (road: RoadSegment) => void;
  onOpenFloorPlan: (building: Building) => void;
  filterType: 'todos' | 'produto' | 'administrativo';
  isEditMode: boolean;
  showGrid: boolean;
  gridSnap: boolean;
  onUpdateBuildingPos: (id: string, x: number, y: number) => void;
  onUpdateBuildingDimensions: (id: string, width: number, depth: number, height: number) => void;
  onUpdateUrbanElementPos: (id: string, x: number, y: number) => void;
  onUpdateRoadPointPos: (roadId: string, pointIndex: number, x: number, y: number) => void;
  onAddPointToRoad?: (roadId: string, pointIndex: number, x: number, y: number) => void;
  layers?: Record<CityLayerKey, CityLayerConfig>;
}

export const IsometricCity: React.FC<IsometricCityProps> = ({
  buildings,
  urbanElements,
  roads,
  selectedBuilding,
  selectedUrbanElement,
  selectedRoad,
  onSelectBuilding,
  onSelectUrbanElement,
  onSelectRoad,
  filterType,
  isEditMode,
  showGrid,
  gridSnap,
  onUpdateBuildingPos,
  onUpdateBuildingDimensions,
  onUpdateUrbanElementPos,
  onUpdateRoadPointPos,
  onAddPointToRoad,
  layers
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 10 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Dragging states for buildings and urban elements
  const [draggingItem, setDraggingItem] = useState<{
    id: string;
    type: 'building' | 'element';
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Road point dragging state
  const [draggingRoadPoint, setDraggingRoadPoint] = useState<{
    roadId: string;
    pointIndex: number;
  } | null>(null);

  // Building resizing state
  const [resizingBuilding, setResizingBuilding] = useState<{
    id: string;
    handleType: 'width' | 'depth' | 'height';
    startCoord: { x: number; y: number };
    initW: number;
    initD: number;
    initH: number;
  } | null>(null);

  const [dragPreview, setDragPreview] = useState<{ x: number; y: number } | null>(null);
  const [isInvalidOverlap, setIsInvalidOverlap] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Layer check helpers
  const isLayerVisible = (key: CityLayerKey): boolean => {
    if (!layers) return true;
    return layers[key]?.visible !== false;
  };

  const isLayerLocked = (key: CityLayerKey): boolean => {
    if (!layers) return false;
    return layers[key]?.locked === true;
  };

  // Check if position is within 3D island terrain boundary
  const isInsideTerrain = (x: number, y: number): boolean => {
    const cx = 850;
    const cy = 560;
    const rx = 680;
    const ry = 380;
    const normDist = Math.abs(x - cx) / rx + Math.abs(y - cy) / ry;
    return normDist <= 0.95;
  };

  // Check for collision with other buildings
  const checkBuildingCollision = (bId: string, testX: number, testY: number): boolean => {
    if (!isInsideTerrain(testX, testY)) return true;
    for (const b of buildings) {
      if (b.id === bId || b.isArchived) continue;
      const dist = Math.hypot(b.isoX - testX, b.isoY - testY);
      if (dist < 90) {
        return true;
      }
    }
    return false;
  };

  // Convert mouse screen coordinates to SVG stage space with true isometric grid alignment
  const screenToSvgCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    const rawX = (clientX - pan.x) / zoom;
    const rawY = (clientY - pan.y) / zoom;

    if (gridSnap) {
      // True Isometric (U, V) lattice aligned with Island vertices (850, 160)
      const dx = rawX - 850;
      const dy = rawY - 160;

      // Project onto the two 4/7 isometric axes
      const u = 0.5 * (dx / 700 + dy / 400);
      const v = 0.5 * (dy / 400 - dx / 700);

      // Fine step divisions along the isometric diamond
      const N = 28;
      const snappedU = Math.round(u * N) / N;
      const snappedV = Math.round(v * N) / N;

      const snappedX = 850 + 700 * (snappedU - snappedV);
      const snappedY = 160 + 400 * (snappedU + snappedV);

      return {
        x: Math.round(snappedX),
        y: Math.round(snappedY)
      };
    }
    return { x: Math.round(rawX), y: Math.round(rawY) };
  };

  // Handle Pan & Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;

    if (
      target === e.currentTarget || 
      target.id === 'city-ground' || 
      target.id === 'island-surface' ||
      target.tagName === 'svg'
    ) {
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
      return;
    }

    // 1. Dragging road point handle
    if (draggingRoadPoint && isEditMode) {
      const coords = screenToSvgCoords(e.clientX, e.clientY);
      onUpdateRoadPointPos(draggingRoadPoint.roadId, draggingRoadPoint.pointIndex, coords.x, coords.y);
      return;
    }

    // 2. Resizing building dimensions
    if (resizingBuilding && isEditMode) {
      const coords = screenToSvgCoords(e.clientX, e.clientY);
      const deltaX = coords.x - resizingBuilding.startCoord.x;
      const deltaY = coords.y - resizingBuilding.startCoord.y;

      if (resizingBuilding.handleType === 'height') {
        const newH = Math.max(50, Math.min(320, Math.round(resizingBuilding.initH - deltaY * 1.2)));
        onUpdateBuildingDimensions(resizingBuilding.id, resizingBuilding.initW, resizingBuilding.initD, newH);
      } else if (resizingBuilding.handleType === 'width') {
        const newW = Math.max(70, Math.min(260, Math.round(resizingBuilding.initW - deltaX)));
        onUpdateBuildingDimensions(resizingBuilding.id, newW, resizingBuilding.initD, resizingBuilding.initH);
      } else if (resizingBuilding.handleType === 'depth') {
        const newD = Math.max(60, Math.min(240, Math.round(resizingBuilding.initD + deltaX)));
        onUpdateBuildingDimensions(resizingBuilding.id, resizingBuilding.initW, newD, resizingBuilding.initH);
      }
      return;
    }

    // 3. Dragging building or urban element
    if (draggingItem && isEditMode) {
      const coords = screenToSvgCoords(e.clientX, e.clientY);
      const newX = coords.x - draggingItem.offsetX;
      const newY = coords.y - draggingItem.offsetY;

      setDragPreview({ x: newX, y: newY });

      if (draggingItem.type === 'building') {
        const hasCollision = checkBuildingCollision(draggingItem.id, newX, newY);
        setIsInvalidOverlap(hasCollision);
        onUpdateBuildingPos(draggingItem.id, newX, newY);
      } else {
        const outOfBounds = !isInsideTerrain(newX, newY);
        setIsInvalidOverlap(outOfBounds);
        onUpdateUrbanElementPos(draggingItem.id, newX, newY);
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (draggingItem) {
      setDraggingItem(null);
      setDragPreview(null);
      setIsInvalidOverlap(false);
    }
    if (draggingRoadPoint) {
      setDraggingRoadPoint(null);
    }
    if (resizingBuilding) {
      setResizingBuilding(null);
    }
  };

  // Start dragging a building
  const handleStartDragBuilding = (e: React.MouseEvent, building: Building) => {
    if (!isEditMode || building.locked || isLayerLocked('predios')) return;
    e.stopPropagation();
    const coords = screenToSvgCoords(e.clientX, e.clientY);
    setDraggingItem({
      id: building.id,
      type: 'building',
      offsetX: coords.x - building.isoX,
      offsetY: coords.y - building.isoY,
      startX: building.isoX,
      startY: building.isoY
    });
  };

  // Start resizing building
  const handleStartResizeBuilding = (e: React.MouseEvent, buildingId: string, handleType: 'width' | 'depth' | 'height') => {
    if (!isEditMode || isLayerLocked('predios')) return;
    e.stopPropagation();
    const b = buildings.find(b => b.id === buildingId);
    if (!b || b.locked) return;
    const coords = screenToSvgCoords(e.clientX, e.clientY);
    setResizingBuilding({
      id: buildingId,
      handleType,
      startCoord: coords,
      initW: b.customWidth || 140,
      initD: b.customDepth || 100,
      initH: b.customHeight || 110
    });
  };

  // Start dragging a road point
  const handleStartDragRoadPoint = (e: React.MouseEvent, roadId: string, pointIndex: number) => {
    if (!isEditMode || isLayerLocked('ruas')) return;
    e.stopPropagation();
    setDraggingRoadPoint({ roadId, pointIndex });
  };

  // Start dragging an urban element
  const handleStartDragElement = (e: React.MouseEvent, element: UrbanElement) => {
    const isPlaza = element.type === 'praca_central' || element.type === 'praca_pequena' || element.type === 'jardim' || element.type === 'area_gramada';
    const layerKey: CityLayerKey = isPlaza ? 'pracas' : 'mobiliario';
    if (!isEditMode || element.locked || isLayerLocked(layerKey)) return;
    e.stopPropagation();
    const coords = screenToSvgCoords(e.clientX, e.clientY);
    setDraggingItem({
      id: element.id,
      type: 'element',
      offsetX: coords.x - element.x,
      offsetY: coords.y - element.y,
      startX: element.x,
      startY: element.y
    });
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(1.5, Math.max(0.6, +(prev + delta).toFixed(2))));
  };

  const handleReset = () => {
    setZoom(0.95);
    setPan({ x: 30, y: 10 });
  };

  // Filter visible buildings by type and layer visibility
  const visibleBuildings = buildings.filter(b => {
    if (b.isArchived) return false;
    if (!isLayerVisible('predios')) return false;
    if (filterType === 'todos') return true;
    return b.type === filterType;
  });

  // Filter visible urban elements by layer
  const visibleUrbanElements = urbanElements.filter(el => {
    const isPlaza = el.type === 'praca_central' || el.type === 'praca_pequena' || el.type === 'jardim' || el.type === 'area_gramada';
    const isSidewalkOrCrosswalk = el.type === 'calcada' || el.type === 'faixa_pedestres' || el.type === 'caminho_pedestres';
    const isPlaca = el.type === 'ponto_encontro';
    const isDeco = el.type === 'arvores' || el.type === 'canteiros';

    if (isPlaza && !isLayerVisible('pracas')) return false;
    if (isSidewalkOrCrosswalk && !isLayerVisible('calcadas')) return false;
    if (isPlaca && !isLayerVisible('placas')) return false;
    if (isDeco && !isLayerVisible('decoracoes')) return false;
    if (!isPlaza && !isSidewalkOrCrosswalk && !isPlaca && !isDeco && !isLayerVisible('mobiliario')) return false;

    return true;
  });

  // Sort objects by Y position to handle 2.5D visual depth layering correctly
  const sortedRenderItems = [
    ...visibleUrbanElements.map(e => ({ type: 'element' as const, data: e, y: e.y, zIndex: e.zIndex || 5 })),
    ...visibleBuildings.map(b => ({ type: 'building' as const, data: b, y: b.isoY, zIndex: b.zIndex || 20 }))
  ].sort((a, b) => {
    if (a.zIndex !== b.zIndex) return a.zIndex - b.zIndex;
    return a.y - b.y;
  });

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none ${
        isEditMode ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 20%, #e0f2fe 0%, #bae6fd 60%, #93c5fd 100%)'
      }}
    >
      {/* Zoom and Navigation Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
          title="Aumentar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono font-bold text-slate-500 px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
          title="Diminuir zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-4 h-[1px] bg-slate-200 my-0.5" />
        <button
          onClick={handleReset}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
          title="Centralizar mapa"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Status Indicator / Orientation */}
      <div className="absolute top-4 left-6 z-20 pointer-events-none flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/80 shadow-xs text-xs font-semibold text-slate-800">
        <Compass className="w-4 h-4 text-emerald-600" />
        <span>Campus Operacional 2.5D</span>
        <span className="text-slate-300">|</span>
        {isEditMode ? (
          <span className="text-amber-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Modo de Edição Ativo: Selecione e edite prédios, ruas e mobiliário livremente
          </span>
        ) : (
          <span className="text-[11px] font-mono text-slate-500">
            Clique em qualquer prédio para ver métricas e posições
          </span>
        )}
      </div>

      {/* Main SVG Isometric Stage */}
      <div
        className="absolute top-0 left-0 origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '1800px',
          height: '1100px'
        }}
      >
        <svg
          id="city-ground"
          viewBox="0 0 1700 1050"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="50%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>

            <linearGradient id="waterPool" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <filter id="shadowDiorama" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="15" dy="25" stdDeviation="18" floodColor="#0f172a" floodOpacity="0.25" />
            </filter>

            {/* Island boundary clipping path so roads and sidewalks never stick out past the island edge */}
            <clipPath id="island-surface-clip">
              <polygon points="850,160 1550,560 850,960 150,560" />
            </clipPath>
          </defs>

          {/* 1. 3D FLOATING ISLAND BASE SLICE (Terreno) */}
          {isLayerVisible('terreno') && (
            <g filter="url(#shadowDiorama)">
              {/* Cut earth sides */}
              <polygon points="150,560 850,960 850,1010 150,610" fill="#523214" />
              <polygon points="850,960 1550,560 1550,610 850,1010" fill="#3a200a" />

              <polygon points="150,570 850,970 850,990 150,590" fill="#78350f" opacity="0.6" />
              <polygon points="850,970 1550,570 1550,590 850,990" fill="#58240a" opacity="0.6" />

              {/* Top Green Isometric Diamond Plane */}
              <polygon
                id="island-surface"
                points="850,160 1550,560 850,960 150,560"
                fill="url(#grassGrad)"
                stroke="#4d7c0f"
                strokeWidth="3"
              />
            </g>
          )}

          {/* 2. TRUE ISOMETRIC ARCHITECTURAL GRID OVERLAY (Aligned with island surface 4/7 slope) */}
          {showGrid && (
            <g id="isometric-grid-layer" className="pointer-events-none opacity-45">
              {/* Diamond border outline */}
              <polygon
                points="850,160 1550,560 850,960 150,560"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeDasharray="6 4"
                opacity="0.8"
              />

              {/* Grid lines along Axis U (Top-Left to Bottom-Right, slope 4/7) */}
              {Array.from({ length: 14 }).map((_, i) => {
                if (i === 0) return null;
                const frac = i / 14;
                const x1 = 850 - 700 * frac;
                const y1 = 160 + 400 * frac;
                const x2 = 1550 - 700 * frac;
                const y2 = 560 + 400 * frac;
                return (
                  <line
                    key={`grid-u-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.65"
                  />
                );
              })}

              {/* Grid lines along Axis V (Top-Right to Bottom-Left, slope -4/7) */}
              {Array.from({ length: 14 }).map((_, j) => {
                if (j === 0) return null;
                const frac = j / 14;
                const x1 = 850 + 700 * frac;
                const y1 = 160 + 400 * frac;
                const x2 = 150 + 700 * frac;
                const y2 = 560 + 400 * frac;
                return (
                  <line
                    key={`grid-v-${j}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    opacity="0.65"
                  />
                );
              })}
            </g>
          )}

          {/* North Hillside Elevation (Colinas verdes e casinhas de fundo) */}
          {isLayerVisible('terreno') && (
            <g className="pointer-events-none">
              <polygon points="600,300 850,160 1000,245 750,385" fill="#65a30d" opacity="0.85" />
              <polygon points="720,240 760,218 800,240 760,262" fill="#fed7aa" />
              <polygon points="720,240 760,262 760,285 720,263" fill="#ea580c" />
              <polygon points="760,262 800,240 800,263 760,285" fill="#c2410c" />

              <polygon points="860,200 900,178 940,200 900,222" fill="#bae6fd" />
              <polygon points="860,200 900,222 900,240 860,218" fill="#0284c7" />
              <polygon points="900,222 940,200 940,218 900,240" fill="#0369a1" />
            </g>
          )}

          {/* 3. ROAD NETWORK (Asfalto, faixas, alamedas, calçadas e cruzamentos vetoriais) */}
          {isLayerVisible('ruas') && (
            <RoadNetworkSvg 
              roads={roads}
              selectedRoadId={selectedRoad?.id || null}
              isEditMode={isEditMode && !isLayerLocked('ruas')}
              onSelectRoad={onSelectRoad}
              onStartDragRoadPoint={handleStartDragRoadPoint}
              onAddPointToRoad={onAddPointToRoad}
            />
          )}

          {/* 4. DYNAMIC 2.5D RENDER LAYER (Prédios e Elementos Urbanos ordenados por profundidade Y) */}
          {sortedRenderItems.map(item => {
            if (item.type === 'element') {
              const el = item.data;
              const isSelected = selectedUrbanElement?.id === el.id;
              const isDragging = draggingItem?.id === el.id;

              return (
                <g
                  key={el.id}
                  onMouseDown={(e) => handleStartDragElement(e, el)}
                >
                  <UrbanElementSvg
                    element={el}
                    isSelected={isSelected}
                    isDragging={isDragging}
                    isEditMode={isEditMode}
                    onClick={(e) => {
                      if (isEditMode) {
                        e.stopPropagation();
                        onSelectUrbanElement(el);
                      }
                    }}
                  />
                </g>
              );
            } else {
              const bld = item.data;
              const isSelected = selectedBuilding?.id === bld.id;
              const isDragging = draggingItem?.id === bld.id;
              const isOverlap = isDragging && isInvalidOverlap;

              return (
                <g
                  key={bld.id}
                  onMouseDown={(e) => handleStartDragBuilding(e, bld)}
                >
                  <IsometricBuildingSvg
                    building={bld}
                    isSelected={isSelected}
                    isHovered={hoveredId === bld.id}
                    isDragging={isDragging}
                    isInvalidOverlap={isOverlap}
                    isEditMode={isEditMode}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBuilding(bld);
                    }}
                    onMouseEnter={() => setHoveredId(bld.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onStartResize={handleStartResizeBuilding}
                  />

                  {/* Floating Pin Label Badge above building (Placas & Indicadores) */}
                  {!isDragging && isLayerVisible('placas') && (
                    <g
                      className="cursor-pointer transition-transform duration-200"
                      transform={`translate(${bld.isoX}, ${bld.isoY - (bld.customHeight || 110) - 20})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBuilding(bld);
                      }}
                    >
                      <rect
                        x="-60"
                        y="-13"
                        width="120"
                        height="26"
                        rx="13"
                        fill="#ffffff"
                        stroke={isSelected ? '#0f172a' : bld.color}
                        strokeWidth={isSelected ? '2.5' : '1.5'}
                        filter="url(#shadowDiorama)"
                      />
                      <circle cx="-45" cy="0" r="7" fill={bld.color} />
                      <text
                        x="-32"
                        y="4"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="800"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {bld.name}
                      </text>
                      <text x="44" y="4" fill={bld.color} fontSize="10" fontWeight="bold">
                        ✓
                      </text>
                    </g>
                  )}
                </g>
              );
            }
          })}

          {/* 5. FLOATING DIRIGIBLE ZEPPELIN (Decorações) */}
          {isLayerVisible('decoracoes') && (
            <g className="animate-pulse duration-1000 pointer-events-none">
              <ellipse cx="880" cy="90" rx="64" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" filter="url(#shadowDiorama)" />
              <polygon points="940,90 956,76 950,90 956,104" fill="#ef4444" />
              <rect x="850" y="82" width="60" height="16" rx="4" fill="#ef4444" />
              <text x="880" y="93" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                CIDADE OP +
              </text>
              <rect x="870" y="106" width="20" height="7" rx="2" fill="#475569" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
