/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Cidade Operacional 2D' },
    { name: 'description', content: 'Planta interativa da Cidade Operacional com prédios de produtos, setor administrativo e posições de atendimento.' },
    { property: 'og:title', content: 'Cidade Operacional 2D' },
    { property: 'og:description', content: 'Explore o campus operacional, seus prédios e posições de atendimento.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: CidadeOperacional,
});
import { 
  Building, 
  Workstation, 
  CityMetrics, 
  BuildingStatus,
  UrbanElement, 
  RoadSegment,
  UrbanElementType,
  CityLayerKey,
  CityLayerConfig
} from '../types/city';
import { 
  loadStoredBuildings, 
  saveBuildings, 
  loadStoredWorkstations, 
  saveWorkstations, 
  loadStoredUrbanElements,
  saveUrbanElements,
  loadStoredRoads,
  saveRoads,
  resetToDemoData,
  createNewBuilding
} from '../services/storage';
import { 
  createDefaultUrbanElement, 
  createDefaultRoad, 
  DEFAULT_CITY_LAYERS 
} from '../data/initialUrbanElements';
import { IsometricTopBar } from '../components/IsometricTopBar';
import { IsometricCity } from '../components/IsometricCity';
import { MetricSidePanel } from '../components/MetricSidePanel';
import { BottomDock } from '../components/BottomDock';
import { TourPassport } from '../components/TourPassport';
import { LiveTicker } from '../components/LiveTicker';
import { BuildingModal } from '../components/BuildingModal';
import { FloorPlanView } from '../components/FloorPlanView';
import { CityEditorToolbar } from '../components/CityEditorToolbar';
import { ElementInspector } from '../components/ElementInspector';
import { LayersPanel } from '../components/LayersPanel';
import { DeleteBuildingModal } from '../components/DeleteBuildingModal';

function CidadeOperacional() {
  // Master state
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [workstationsMap, setWorkstationsMap] = useState<Record<string, Workstation[]>>({});
  const [urbanElements, setUrbanElements] = useState<UrbanElement[]>([]);
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  
  // Navigation & selection state
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedUrbanElement, setSelectedUrbanElement] = useState<UrbanElement | null>(null);
  const [selectedRoad, setSelectedRoad] = useState<RoadSegment | null>(null);
  const [activeFloorPlanBuildingId, setActiveFloorPlanBuildingId] = useState<string | null>(null);
  const [visitedBuildingIds, setVisitedBuildingIds] = useState<string[]>([]);
  
  // Editor mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [gridSnap, setGridSnap] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  // Layers state
  const [layers, setLayers] = useState<Record<CityLayerKey, CityLayerConfig>>(DEFAULT_CITY_LAYERS);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState<boolean>(false);

  // Delete modal state
  const [deleteModalBuilding, setDeleteModalBuilding] = useState<Building | null>(null);

  // Undo / Redo history stack
  const [history, setHistory] = useState<{
    buildings: Building[];
    urbanElements: UrbanElement[];
    roads: RoadSegment[];
  }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Snapshot before entering edit mode (for Cancel / Revert)
  const [savedSnapshot, setSavedSnapshot] = useState<{
    buildings: Building[];
    urbanElements: UrbanElement[];
    roads: RoadSegment[];
  } | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  
  // Filters
  const [filterType, setFilterType] = useState<'todos' | 'produto' | 'administrativo'>('todos');

  // Push state to undo/redo history
  const pushHistoryState = useCallback((
    newBuildings: Building[], 
    newElements: UrbanElement[], 
    newRoads: RoadSegment[]
  ) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, { 
        buildings: JSON.parse(JSON.stringify(newBuildings)), 
        urbanElements: JSON.parse(JSON.stringify(newElements)), 
        roads: JSON.parse(JSON.stringify(newRoads)) 
      }];
    });
    setHistoryIndex(prev => prev + 1);
    setHasUnsavedChanges(true);
  }, [historyIndex]);

  // Initial load
  useEffect(() => {
    const loadedBuildings = loadStoredBuildings();
    const loadedWorkstations = loadStoredWorkstations();
    const loadedElements = loadStoredUrbanElements();
    const loadedRoads = loadStoredRoads();

    setBuildings(loadedBuildings);
    setWorkstationsMap(loadedWorkstations);
    setUrbanElements(loadedElements);
    setRoads(loadedRoads);

    setHistory([{ 
      buildings: loadedBuildings, 
      urbanElements: loadedElements, 
      roads: loadedRoads 
    }]);
    setHistoryIndex(0);

    // Default select first product building so the side panel opens with data immediately
    if (loadedBuildings.length > 0) {
      const defaultBuilding = loadedBuildings.find(b => b.code === 'PRD-PIN') || loadedBuildings[0];
      if (!defaultBuilding) return;
      setSelectedBuilding(defaultBuilding);
      setVisitedBuildingIds([defaultBuilding.id]);
    }
  }, []);

  // Selection handlers
  const handleSelectBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setSelectedUrbanElement(null);
    setSelectedRoad(null);
    setVisitedBuildingIds(prev => {
      if (!prev.includes(building.id)) {
        return [...prev, building.id];
      }
      return prev;
    });
  };

  const handleSelectUrbanElement = (element: UrbanElement) => {
    setSelectedUrbanElement(element);
    setSelectedBuilding(null);
    setSelectedRoad(null);
  };

  const handleSelectRoad = (road: RoadSegment) => {
    setSelectedRoad(road);
    setSelectedBuilding(null);
    setSelectedUrbanElement(null);
  };

  // Toggle Edit Mode
  const handleToggleEditMode = () => {
    if (!isEditMode) {
      setSavedSnapshot({
        buildings: JSON.parse(JSON.stringify(buildings)),
        urbanElements: JSON.parse(JSON.stringify(urbanElements)),
        roads: JSON.parse(JSON.stringify(roads))
      });
      setIsEditMode(true);
    } else {
      if (hasUnsavedChanges) {
        if (window.confirm('Existem alterações não salvas no mapa da cidade. Deseja salvá-las agora?')) {
          handleSaveCityLayout();
        } else {
          handleCancelCityLayout();
        }
      } else {
        setIsEditMode(false);
      }
    }
  };

  // Save City Layout (Persist to storage)
  const handleSaveCityLayout = () => {
    saveBuildings(buildings);
    saveUrbanElements(urbanElements);
    saveRoads(roads);
    setHasUnsavedChanges(false);
    setSavedSnapshot(null);
    setIsEditMode(false);
  };

  // Cancel City Layout (Revert to snapshot)
  const handleCancelCityLayout = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('Deseja descartar todas as alterações não salvas na planta da cidade?');
      if (!confirmDiscard) return;
    }

    if (savedSnapshot) {
      setBuildings(savedSnapshot.buildings);
      setUrbanElements(savedSnapshot.urbanElements);
      setRoads(savedSnapshot.roads);
    }
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    setSelectedUrbanElement(null);
    setSelectedRoad(null);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const state = history[prevIdx];
      if (!state) return;
      setBuildings(state.buildings);
      setUrbanElements(state.urbanElements);
      setRoads(state.roads);
      setHistoryIndex(prevIdx);
      setHasUnsavedChanges(true);

      // Re-sync selected items if needed
      if (selectedBuilding) {
        setSelectedBuilding(state.buildings.find(b => b.id === selectedBuilding.id) || null);
      }
      if (selectedUrbanElement) {
        setSelectedUrbanElement(state.urbanElements.find(e => e.id === selectedUrbanElement.id) || null);
      }
      if (selectedRoad) {
        setSelectedRoad(state.roads.find(r => r.id === selectedRoad.id) || null);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const state = history[nextIdx];
      if (!state) return;
      setBuildings(state.buildings);
      setUrbanElements(state.urbanElements);
      setRoads(state.roads);
      setHistoryIndex(nextIdx);
      setHasUnsavedChanges(true);

      if (selectedBuilding) {
        setSelectedBuilding(state.buildings.find(b => b.id === selectedBuilding.id) || null);
      }
      if (selectedUrbanElement) {
        setSelectedUrbanElement(state.urbanElements.find(e => e.id === selectedUrbanElement.id) || null);
      }
      if (selectedRoad) {
        setSelectedRoad(state.roads.find(r => r.id === selectedRoad.id) || null);
      }
    }
  };

  // Drag Building Position
  const handleUpdateBuildingPos = (id: string, newX: number, newY: number) => {
    const updated = buildings.map(b => (b.id === id ? { ...b, isoX: newX, isoY: newY } : b));
    setBuildings(updated);
    setHasUnsavedChanges(true);
  };

  // Resize Building Dimensions (Width, Depth, Height)
  const handleUpdateBuildingDimensions = (id: string, width: number, depth: number, height: number) => {
    const updated = buildings.map(b => (b.id === id ? { 
      ...b, 
      customWidth: width, 
      customDepth: depth, 
      customHeight: height 
    } : b));
    setBuildings(updated);
    if (selectedBuilding?.id === id) {
      setSelectedBuilding(prev => prev ? { 
        ...prev, 
        customWidth: width, 
        customDepth: depth, 
        customHeight: height 
      } : null);
    }
    setHasUnsavedChanges(true);
  };

  // Drag Urban Element Position
  const handleUpdateUrbanElementPos = (id: string, newX: number, newY: number) => {
    const updated = urbanElements.map(el => (el.id === id ? { ...el, x: newX, y: newY } : el));
    setUrbanElements(updated);
    setHasUnsavedChanges(true);
  };

  // Drag Road Point Position
  const handleUpdateRoadPointPos = (roadId: string, pointIndex: number, newX: number, newY: number) => {
    const updated = roads.map(r => {
      if (r.id !== roadId) return r;
      const newPoints = r.points ? [...r.points] : [{ x: r.x1 || 300, y: r.y1 || 500 }, { x: r.x2 || 800, y: r.y2 || 700 }];
      if (pointIndex === -1) {
        return { ...r, points: newPoints.map(p => ({ x: p.x + newX, y: p.y + newY })) };
      }
      if (newPoints[pointIndex]) {
        newPoints[pointIndex] = { x: newX, y: newY };
      }
      return { ...r, points: newPoints };
    });
    setRoads(updated);
    if (selectedRoad?.id === roadId) {
      setSelectedRoad(updated.find(r => r.id === roadId) || null);
    }
    setHasUnsavedChanges(true);
  };

  // Add Point to Road
  const handleAddPointToRoad = (roadId: string, pointIndex: number, x: number, y: number) => {
    const updated = roads.map(r => {
      if (r.id !== roadId) return r;
      const newPoints = r.points ? [...r.points] : [{ x: r.x1 || 300, y: r.y1 || 500 }, { x: r.x2 || 800, y: r.y2 || 700 }];
      newPoints.splice(pointIndex + 1, 0, { x, y });
      return { ...r, points: newPoints };
    });
    setRoads(updated);
    if (selectedRoad?.id === roadId) {
      setSelectedRoad(updated.find(r => r.id === roadId) || null);
    }
    pushHistoryState(buildings, urbanElements, updated);
  };

  // Add Urban Element
  const handleAddUrbanElement = (type: UrbanElementType) => {
    const newElement = createDefaultUrbanElement(type, 850, 560);
    const updated = [...urbanElements, newElement];
    setUrbanElements(updated);
    setSelectedUrbanElement(newElement);
    setSelectedBuilding(null);
    setSelectedRoad(null);
    pushHistoryState(buildings, updated, roads);
  };

  // Add Road
  const handleAddRoad = () => {
    const newRoad = createDefaultRoad('rua', 'asfalto');
    const updated = [...roads, newRoad];
    setRoads(updated);
    setSelectedRoad(newRoad);
    setSelectedBuilding(null);
    setSelectedUrbanElement(null);
    pushHistoryState(buildings, urbanElements, updated);
  };

  // Update Building Properties (via Inspector)
  const handleUpdateBuildingProperties = (props: Partial<Building>) => {
    if (!selectedBuilding) return;
    const updated = buildings.map(b => (b.id === selectedBuilding.id ? { ...b, ...props } : b));
    setBuildings(updated);
    setSelectedBuilding(prev => prev ? { ...prev, ...props } : null);
    pushHistoryState(updated, urbanElements, roads);
  };

  // Update Urban Element Properties (via Inspector)
  const handleUpdateUrbanElementProperties = (props: Partial<UrbanElement>) => {
    if (!selectedUrbanElement) return;
    const updated = urbanElements.map(el => (el.id === selectedUrbanElement.id ? { ...el, ...props } : el));
    setUrbanElements(updated);
    setSelectedUrbanElement(prev => prev ? { ...prev, ...props } : null);
    pushHistoryState(buildings, updated, roads);
  };

  // Update Road Properties (via Inspector)
  const handleUpdateRoadProperties = (props: Partial<RoadSegment>) => {
    if (!selectedRoad) return;
    const updated = roads.map(r => (r.id === selectedRoad.id ? { ...r, ...props } : r));
    setRoads(updated);
    setSelectedRoad(prev => prev ? { ...prev, ...props } : null);
    pushHistoryState(buildings, urbanElements, updated);
  };

  // Rotate Selected Item (+90 deg)
  const handleRotateSelected = () => {
    if (selectedBuilding) {
      const nextRot = (((selectedBuilding.rotation || 0) + 90) % 360);
      handleUpdateBuildingProperties({ rotation: nextRot });
    } else if (selectedUrbanElement) {
      const nextRot = (((selectedUrbanElement.rotation || 0) + 90) % 360);
      handleUpdateUrbanElementProperties({ rotation: nextRot });
    }
  };

  // Duplicate Selected Item
  const handleDuplicateSelected = () => {
    if (selectedBuilding) {
      const dup: Building = {
        ...selectedBuilding,
        id: `bld-${Date.now().toString(36)}`,
        name: `${selectedBuilding.name} (Cópia)`,
        code: `${selectedBuilding.code}-C`,
        isoX: selectedBuilding.isoX + 60,
        isoY: selectedBuilding.isoY + 40
      };
      const updated = [...buildings, dup];
      setBuildings(updated);
      setSelectedBuilding(dup);
      pushHistoryState(updated, urbanElements, roads);
    } else if (selectedUrbanElement) {
      const dup: UrbanElement = {
        ...selectedUrbanElement,
        id: `elem-${Date.now().toString(36)}`,
        name: `${selectedUrbanElement.name} (Cópia)`,
        x: selectedUrbanElement.x + 40,
        y: selectedUrbanElement.y + 30
      };
      const updated = [...urbanElements, dup];
      setUrbanElements(updated);
      setSelectedUrbanElement(dup);
      pushHistoryState(buildings, updated, roads);
    } else if (selectedRoad) {
      const pts = selectedRoad.points ? selectedRoad.points.map(p => ({ x: p.x + 50, y: p.y + 50 })) : [];
      const dup: RoadSegment = {
        ...selectedRoad,
        id: `road-${Date.now().toString(36)}`,
        name: `${selectedRoad.name} (Cópia)`,
        points: pts
      };
      const updated = [...roads, dup];
      setRoads(updated);
      setSelectedRoad(dup);
      pushHistoryState(buildings, urbanElements, updated);
    }
  };

  // Bring Forward / Send Backward
  const handleBringForward = () => {
    if (selectedBuilding) {
      const currentZ = selectedBuilding.zIndex || 20;
      handleUpdateBuildingProperties({ zIndex: currentZ + 5 });
    } else if (selectedUrbanElement) {
      const currentZ = selectedUrbanElement.zIndex || 10;
      handleUpdateUrbanElementProperties({ zIndex: currentZ + 5 });
    } else if (selectedRoad) {
      const currentZ = selectedRoad.zIndex || 3;
      handleUpdateRoadProperties({ zIndex: currentZ + 1 });
    }
  };

  const handleSendBackward = () => {
    if (selectedBuilding) {
      const currentZ = selectedBuilding.zIndex || 20;
      handleUpdateBuildingProperties({ zIndex: Math.max(1, currentZ - 5) });
    } else if (selectedUrbanElement) {
      const currentZ = selectedUrbanElement.zIndex || 10;
      handleUpdateUrbanElementProperties({ zIndex: Math.max(1, currentZ - 5) });
    } else if (selectedRoad) {
      const currentZ = selectedRoad.zIndex || 3;
      handleUpdateRoadProperties({ zIndex: Math.max(1, currentZ - 1) });
    }
  };

  // Toggle Lock
  const handleToggleLock = () => {
    if (selectedBuilding) {
      handleUpdateBuildingProperties({ locked: !selectedBuilding.locked });
    } else if (selectedUrbanElement) {
      handleUpdateUrbanElementProperties({ locked: !selectedUrbanElement.locked });
    } else if (selectedRoad) {
      handleUpdateRoadProperties({ locked: !selectedRoad.locked });
    }
  };

  // Request Delete for Selected Item
  const handleDeleteRequest = () => {
    if (selectedBuilding) {
      setDeleteModalBuilding(selectedBuilding);
    } else if (selectedUrbanElement) {
      const updated = urbanElements.filter(el => el.id !== selectedUrbanElement.id);
      setUrbanElements(updated);
      setSelectedUrbanElement(null);
      pushHistoryState(buildings, updated, roads);
    } else if (selectedRoad) {
      const updated = roads.filter(r => r.id !== selectedRoad.id);
      setRoads(updated);
      setSelectedRoad(null);
      pushHistoryState(buildings, urbanElements, updated);
    }
  };

  // Safe Building Deletion Options
  const handleArchiveBuilding = (buildingId: string) => {
    const updated = buildings.map(b => b.id === buildingId ? { ...b, isArchived: true, status: 'inativo' as BuildingStatus } : b);
    setBuildings(updated);
    setSelectedBuilding(null);
    pushHistoryState(updated, urbanElements, roads);
  };

  const handleRemoveVisualOnly = (buildingId: string) => {
    const updated = buildings.map(b => b.id === buildingId ? { ...b, isArchived: true } : b);
    setBuildings(updated);
    setSelectedBuilding(null);
    pushHistoryState(updated, urbanElements, roads);
  };

  const handleDeletePermanently = (buildingId: string) => {
    const updatedBuildings = buildings.filter(b => b.id !== buildingId);
    const updatedWk = { ...workstationsMap };
    delete updatedWk[buildingId];
    setBuildings(updatedBuildings);
    setWorkstationsMap(updatedWk);
    saveWorkstations(updatedWk);
    setSelectedBuilding(null);
    pushHistoryState(updatedBuildings, urbanElements, roads);
  };

  // Toggle Layer Visibility & Lock
  const handleToggleLayerVisibility = (key: CityLayerKey) => {
    setLayers(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        visible: !prev[key].visible
      }
    }));
  };

  const handleToggleLayerLock = (key: CityLayerKey) => {
    setLayers(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        locked: !prev[key].locked
      }
    }));
  };

  // Keyboard Shortcuts: Undo / Redo / Delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (isEditMode && (selectedBuilding || selectedUrbanElement || selectedRoad)) {
          handleDeleteRequest();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, selectedBuilding, selectedUrbanElement, selectedRoad, historyIndex, history]);

  // Aggregated Campus Metrics
  const metrics: CityMetrics = useMemo(() => {
    const activeBlds = buildings.filter(b => !b.isArchived);
    const totalBuildings = activeBlds.length;
    const productBuildings = activeBlds.filter(b => b.type === 'produto').length;
    const adminBuildings = activeBlds.filter(b => b.type === 'administrativo').length;

    let totalPositions = 0;
    let activePositions = 0;
    let inCallPositions = 0;

    Object.values(workstationsMap).forEach(list => {
      list.forEach(w => {
        totalPositions++;
        if (w.status !== 'offline') activePositions++;
        if (w.status === 'em_atendimento') inCallPositions++;
      });
    });

    const occupancyRate = totalPositions > 0 ? Math.round((activePositions / totalPositions) * 100) : 0;

    return {
      totalBuildings,
      productBuildings,
      adminBuildings,
      totalPositions,
      activePositions,
      inCallPositions,
      occupancyRate,
      totalSubscribers: '11.613.782',
      callsHandledToday: '12.856.775',
      monthlyRevenue: 'R$ 182,4 mi',
      systemUptime: '99,97%'
    };
  }, [buildings, workstationsMap]);

  // Open floor plan
  const handleOpenFloorPlan = (building: Building) => {
    setActiveFloorPlanBuildingId(building.id);
  };

  // Return to city view
  const handleBackToCity = () => {
    setActiveFloorPlanBuildingId(null);
  };

  // Open Add Building modal
  const handleOpenAddModal = () => {
    setEditingBuilding(null);
    setIsModalOpen(true);
  };

  // Open Edit Building modal
  const handleOpenEditModal = (building: Building) => {
    setEditingBuilding(building);
    setIsModalOpen(true);
  };

  // Save building (Add new or Update existing)
  const handleSaveBuilding = (
    buildingData: Omit<Building, 'id'>, 
    isEditingId?: string
  ) => {
    if (isEditingId) {
      const updatedList = buildings.map(b => {
        if (b.id === isEditingId) {
          return {
            ...b,
            ...buildingData,
            id: isEditingId
          };
        }
        return b;
      });
      setBuildings(updatedList);
      saveBuildings(updatedList);
      if (selectedBuilding?.id === isEditingId) {
        setSelectedBuilding(updatedList.find(b => b.id === isEditingId) || null);
      }
    } else {
      const { newBuilding, updatedWorkstationsMap } = createNewBuilding(buildingData, workstationsMap);
      const updatedList = [...buildings, newBuilding];
      setBuildings(updatedList);
      setWorkstationsMap(updatedWorkstationsMap);
      saveBuildings(updatedList);
      saveWorkstations(updatedWorkstationsMap);
      setSelectedBuilding(newBuilding);
    }
    setIsModalOpen(false);
  };

  // Toggle active/inactive building status
  const handleToggleBuildingStatus = (buildingId: string) => {
    const target = buildings.find(b => b.id === buildingId);
    if (!target) return;
    const nextStatus: BuildingStatus = target.status === 'ativo' ? 'inativo' : 'ativo';

    const updatedList = buildings.map(b => {
      if (b.id === buildingId) {
        return { ...b, status: nextStatus };
      }
      return b;
    });

    setBuildings(updatedList);
    saveBuildings(updatedList);
    if (selectedBuilding?.id === buildingId) {
      setSelectedBuilding({ ...selectedBuilding, status: nextStatus });
    }
  };

  // Workstation updates inside floor plan
  const handleUpdateWorkstation = (updatedPA: Workstation) => {
    if (!activeFloorPlanBuildingId) return;
    const buildingId = activeFloorPlanBuildingId;
    setWorkstationsMap(prev => {
      const currentList = prev[buildingId] || [];
      const updatedList = currentList.map(pa => (pa.id === updatedPA.id ? updatedPA : pa));
      const nextMap = { ...prev, [buildingId]: updatedList };
      saveWorkstations(nextMap);
      return nextMap;
    });
  };

  // Reset to initial demo data
  const handleResetDemo = () => {
    if (window.confirm('Deseja redefinir todo o campus para o padrão original da demonstração?')) {
      const { 
        buildings: freshBuildings, 
        workstations: freshWorkstations, 
        urbanElements: freshElements, 
        roads: freshRoads 
      } = resetToDemoData();

      setBuildings(freshBuildings);
      setWorkstationsMap(freshWorkstations);
      setUrbanElements(freshElements);
      setRoads(freshRoads);
      
      const firstBld = freshBuildings[0] || null;
      setSelectedBuilding(firstBld);
      setSelectedUrbanElement(null);
      setSelectedRoad(null);
      setVisitedBuildingIds(firstBld ? [firstBld.id] : []);
      setActiveFloorPlanBuildingId(null);
      setIsEditMode(false);
      setHasUnsavedChanges(false);
    }
  };

  // If currently viewing a building's internal floor plan
  const currentFloorPlanBuilding = activeFloorPlanBuildingId 
    ? buildings.find(b => b.id === activeFloorPlanBuildingId) || null
    : null;

  if (currentFloorPlanBuilding) {
    const currentPAs = workstationsMap[currentFloorPlanBuilding.id] || [];
    return (
      <FloorPlanView
        building={currentFloorPlanBuilding}
        workstations={currentPAs}
        onBackToCity={handleBackToCity}
        onUpdateWorkstation={handleUpdateWorkstation}
      />
    );
  }

  const hasSelectedItem = !!(selectedBuilding || selectedUrbanElement || selectedRoad);
  const isSelectedItemLocked = !!(
    selectedBuilding?.locked || 
    selectedUrbanElement?.locked || 
    selectedRoad?.locked
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#bfe3eb]">
      {/* 1. Isometric Top Bar Header */}
      <IsometricTopBar
        metrics={metrics}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
        onOpenAddModal={handleOpenAddModal}
        onResetDemo={handleResetDemo}
      />

      {/* 2. City Editor Floating Toolbar (Only active when isEditMode is true) */}
      {isEditMode && (
        <CityEditorToolbar
          onAddBuilding={handleOpenAddModal}
          onAddUrbanElement={handleAddUrbanElement}
          onAddRoad={handleAddRoad}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          gridSnap={gridSnap}
          onToggleGridSnap={() => setGridSnap(prev => !prev)}
          showGrid={showGrid}
          onToggleShowGrid={() => setShowGrid(prev => !prev)}
          onToggleLayersPanel={() => setIsLayersPanelOpen(prev => !prev)}
          isLayersPanelOpen={isLayersPanelOpen}
          onRotateSelected={handleRotateSelected}
          onDuplicateSelected={handleDuplicateSelected}
          onDeleteSelected={handleDeleteRequest}
          hasSelectedItem={hasSelectedItem}
          isItemLocked={isSelectedItemLocked}
          onToggleItemLock={handleToggleLock}
          onSave={handleSaveCityLayout}
          onCancel={handleCancelCityLayout}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}

      {/* 3. Layers Management Panel */}
      <LayersPanel
        isOpen={isEditMode && isLayersPanelOpen}
        onClose={() => setIsLayersPanelOpen(false)}
        layers={layers}
        onToggleVisibility={handleToggleLayerVisibility}
        onToggleLock={handleToggleLayerLock}
      />

      {/* 4. Main 3D Isometric Diorama City Canvas */}
      <main className="w-full h-full">
        <IsometricCity
          buildings={buildings}
          workstationsMap={workstationsMap}
          urbanElements={urbanElements}
          roads={roads}
          selectedBuilding={selectedBuilding}
          selectedUrbanElement={selectedUrbanElement}
          selectedRoad={selectedRoad}
          onSelectBuilding={handleSelectBuilding}
          onSelectUrbanElement={handleSelectUrbanElement}
          onSelectRoad={handleSelectRoad}
          onOpenFloorPlan={handleOpenFloorPlan}
          filterType={filterType}
          isEditMode={isEditMode}
          showGrid={showGrid}
          gridSnap={gridSnap}
          onUpdateBuildingPos={handleUpdateBuildingPos}
          onUpdateBuildingDimensions={handleUpdateBuildingDimensions}
          onUpdateUrbanElementPos={handleUpdateUrbanElementPos}
          onUpdateRoadPointPos={handleUpdateRoadPointPos}
          onAddPointToRoad={handleAddPointToRoad}
          layers={layers}
        />
      </main>

      {/* 5. Element Inspector (Visible in Edit Mode when an item is selected) */}
      {isEditMode && hasSelectedItem && (
        <ElementInspector
          selectedBuilding={selectedBuilding}
          selectedUrbanElement={selectedUrbanElement}
          selectedRoad={selectedRoad}
          onUpdateBuilding={handleUpdateBuildingProperties}
          onUpdateUrbanElement={handleUpdateUrbanElementProperties}
          onUpdateRoad={handleUpdateRoadProperties}
          onDuplicate={handleDuplicateSelected}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onToggleLock={handleToggleLock}
          onDeleteRequest={handleDeleteRequest}
          onClose={() => {
            setSelectedBuilding(null);
            setSelectedUrbanElement(null);
            setSelectedRoad(null);
          }}
        />
      )}

      {/* 6. Safe Delete Building Modal */}
      <DeleteBuildingModal
        isOpen={!!deleteModalBuilding}
        building={deleteModalBuilding}
        workstations={deleteModalBuilding ? (workstationsMap[deleteModalBuilding.id] || []) : []}
        onClose={() => setDeleteModalBuilding(null)}
        onArchive={handleArchiveBuilding}
        onRemoveVisualOnly={handleRemoveVisualOnly}
        onDeletePermanently={handleDeletePermanently}
      />

      {/* 7. Bottom Quick Navigation Dock (Pills for each building, visible in browse mode) */}
      {!isEditMode && (
        <BottomDock
          buildings={buildings.filter(b => !b.isArchived)}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
        />
      )}

      {/* 8. Bottom-Left Tour Passport (Visible in browse mode) */}
      {!isEditMode && (
        <TourPassport
          visitedBuildingIds={visitedBuildingIds}
          totalBuildingsCount={buildings.filter(b => !b.isArchived).length}
          buildings={buildings.filter(b => !b.isArchived)}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
        />
      )}

      {/* 9. Bottom Breaking News Ticker ("AO VIVO") */}
      <LiveTicker />

      {/* 10. Right Side Metric Panel (Opens upon clicking any building in normal browse mode) */}
      {!isEditMode && selectedBuilding && (
        <MetricSidePanel
          building={selectedBuilding}
          allBuildings={buildings.filter(b => !b.isArchived)}
          workstations={workstationsMap[selectedBuilding.id] || []}
          onClose={() => setSelectedBuilding(null)}
          onSelectBuilding={handleSelectBuilding}
          onOpenFloorPlan={handleOpenFloorPlan}
          onEditBuilding={handleOpenEditModal}
          onToggleStatus={handleToggleBuildingStatus}
        />
      )}

      {/* 11. Add / Edit Building Modal */}
      <BuildingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBuilding}
        editingBuilding={editingBuilding}
        existingBuildings={buildings}
      />
    </div>
  );
}
