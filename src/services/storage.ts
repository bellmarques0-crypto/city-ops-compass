/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Building, Workstation, UrbanElement, RoadSegment } from '../types/city';
import { 
  INITIAL_BUILDINGS, 
  generateAllInitialWorkstations, 
  generateWorkstationsForBuilding 
} from '../data/initialData';
import { INITIAL_URBAN_ELEMENTS, INITIAL_ROADS } from '../data/initialUrbanElements';

const BUILDINGS_STORAGE_KEY = 'cidade_operacional_buildings_v3';
const WORKSTATIONS_STORAGE_KEY = 'cidade_operacional_workstations_v3';
const URBAN_ELEMENTS_STORAGE_KEY = 'cidade_operacional_urban_elements_v3';
const ROADS_STORAGE_KEY = 'cidade_operacional_roads_v3';

export function loadStoredBuildings(): Building[] {
  try {
    const raw = localStorage.getItem(BUILDINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((b: Building) => ({
          ...b,
          cornerStyle: b.cornerStyle || 'curvo',
          isCurved: b.isCurved !== false
        }));
      }
    }
  } catch (err) {
    console.error('Falha ao carregar prédios salvos:', err);
  }
  return INITIAL_BUILDINGS.map((b: Building) => ({
    ...b,
    cornerStyle: b.cornerStyle || 'curvo',
    isCurved: b.isCurved !== false
  }));
}

export function saveBuildings(buildings: Building[]): void {
  try {
    localStorage.setItem(BUILDINGS_STORAGE_KEY, JSON.stringify(buildings));
  } catch (err) {
    console.error('Falha ao salvar prédios:', err);
  }
}

export function loadStoredUrbanElements(): UrbanElement[] {
  try {
    const raw = localStorage.getItem(URBAN_ELEMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Falha ao carregar elementos urbanos:', err);
  }
  return INITIAL_URBAN_ELEMENTS;
}

export function saveUrbanElements(elements: UrbanElement[]): void {
  try {
    localStorage.setItem(URBAN_ELEMENTS_STORAGE_KEY, JSON.stringify(elements));
  } catch (err) {
    console.error('Falha ao salvar elementos urbanos:', err);
  }
}

export function loadStoredRoads(): RoadSegment[] {
  try {
    const raw = localStorage.getItem(ROADS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Falha ao carregar malha viária:', err);
  }
  return INITIAL_ROADS;
}

export function saveRoads(roads: RoadSegment[]): void {
  try {
    localStorage.setItem(ROADS_STORAGE_KEY, JSON.stringify(roads));
  } catch (err) {
    console.error('Falha ao salvar malha viária:', err);
  }
}

export function loadStoredWorkstations(): Record<string, Workstation[]> {
  try {
    const raw = localStorage.getItem(WORKSTATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Falha ao carregar posições salvas:', err);
  }
  return generateAllInitialWorkstations();
}

export function saveWorkstations(workstations: Record<string, Workstation[]>): void {
  try {
    localStorage.setItem(WORKSTATIONS_STORAGE_KEY, JSON.stringify(workstations));
  } catch (err) {
    console.error('Falha ao salvar posições:', err);
  }
}

export function resetToDemoData(): { 
  buildings: Building[]; 
  workstations: Record<string, Workstation[]>;
  urbanElements: UrbanElement[];
  roads: RoadSegment[];
} {
  localStorage.removeItem(BUILDINGS_STORAGE_KEY);
  localStorage.removeItem(WORKSTATIONS_STORAGE_KEY);
  localStorage.removeItem(URBAN_ELEMENTS_STORAGE_KEY);
  localStorage.removeItem(ROADS_STORAGE_KEY);
  
  const buildings = INITIAL_BUILDINGS;
  const workstations = generateAllInitialWorkstations();
  const urbanElements = INITIAL_URBAN_ELEMENTS;
  const roads = INITIAL_ROADS;

  saveBuildings(buildings);
  saveWorkstations(workstations);
  saveUrbanElements(urbanElements);
  saveRoads(roads);

  return { buildings, workstations, urbanElements, roads };
}

export function calculateNextBuildingPosition(
  type: 'produto' | 'administrativo',
  existingBuildings: Building[]
): { x: number; y: number; isoX: number; isoY: number } {
  const targetBuildings = existingBuildings.filter(b => b.type === type);
  
  if (type === 'produto') {
    const startIsoX = 400;
    const startIsoY = 320;
    const offset = targetBuildings.length * 90;
    return {
      x: 70 + targetBuildings.length * 270,
      y: 70,
      isoX: Math.min(1000, startIsoX + offset),
      isoY: Math.min(600, startIsoY + (targetBuildings.length % 2 === 0 ? -40 : 50))
    };
  } else {
    const startIsoX = 850;
    const startIsoY = 450;
    const offset = targetBuildings.length * 80;
    return {
      x: 100 + targetBuildings.length * 270,
      y: 520,
      isoX: Math.min(1300, startIsoX + offset),
      isoY: Math.min(700, startIsoY + (targetBuildings.length % 2 === 0 ? -30 : 60))
    };
  }
}

export function createNewBuilding(
  buildingData: Omit<Building, 'id'>,
  workstationsMap: Record<string, Workstation[]>
): { newBuilding: Building; updatedWorkstationsMap: Record<string, Workstation[]> } {
  const newId = `bld-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newBuilding: Building = {
    ...buildingData,
    id: newId,
    scale: 1,
    rotation: 0,
    zIndex: 20,
    locked: false,
    isDemo: false
  };

  const newPAs = generateWorkstationsForBuilding(newBuilding);
  const updatedWorkstationsMap = {
    ...workstationsMap,
    [newId]: newPAs
  };

  return { newBuilding, updatedWorkstationsMap };
}
