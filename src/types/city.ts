/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BuildingType = 'produto' | 'administrativo';

export type BuildingStatus = 'ativo' | 'inativo' | 'manutencao';

export type WorkstationStatus = 
  | 'disponivel' 
  | 'em_atendimento' 
  | 'pausa' 
  | 'treinamento' 
  | 'offline';

export type BuildingArchitectureModel = 
  | 'glass-tower'         // Modern skyscraper (CV TECH / T.I.)
  | 'corporate-hotel'     // Emerald luxury building with pool & palm trees (PINE)
  | 'neon-billboard'      // Pink commercial building with animated banner (RETENÇÃO)
  | 'soundstage-hangar'   // Curved arched hangar / stage (AMIGOZ)
  | 'classic-auditorium'  // Purple/gold architectural building with columns & red carpet (ORCREDI)
  | 'modern-fintech'      // Indigo high-tech cube block (BYX)
  | 'executive-palace'    // Slate administrative headquarters (ADM 1)
  | 'finance-vault'       // Violet financial block (ADM 2)
  | 'support-campus';     // Teal modular training pavilion (Salas de Apoio)

export type BuildingRoofType = 
  | 'helipad' 
  | 'pool' 
  | 'antennas' 
  | 'terrace' 
  | 'cornice' 
  | 'billboard' 
  | 'solar'
  | 'standard';

export type BuildingFacadeModel = 
  | 'modern-glass' 
  | 'neoclassic' 
  | 'brick-industrial' 
  | 'tech-grid' 
  | 'minimal-concrete';

export type UrbanElementType = 
  | 'praca_central'       // Grand central plaza with fountain & paving
  | 'praca_pequena'       // Small square with pavers & benches
  | 'jardim'              // Flower garden bed
  | 'area_gramada'        // Green grassy park / lawn
  | 'arvores'             // Palm trees or shady tree cluster
  | 'canteiros'           // Low trimmed hedges
  | 'bancos'              // Park benches & meeting tables
  | 'caminho_pedestres'   // Pedestrian cobblestone walkway
  | 'calcada'             // Urban sidewalk with curb
  | 'fonte'               // Water fountain
  | 'espelho_dagua'       // Reflecting pool / pond
  | 'area_descanso'       // Wooden gazebo / pergola
  | 'estacionamento'      // Parking lot with bays
  | 'bicicletario'        // Corporate bike rack
  | 'faixa_pedestres'     // Pedestrian zebra crosswalk
  | 'iluminacao_urbana'   // Classic street lamp posts
  | 'ponto_encontro';     // Emergency assembly / meeting point totem

export interface UrbanElement {
  id: string;
  type: UrbanElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
  scale: number;
  color?: string;
  secondaryColor?: string;
  zIndex: number;
  locked?: boolean;
}

export interface RoadPoint {
  x: number;
  y: number;
}

export type RoadMarkingType = 
  | 'amarela_tracejada' 
  | 'branca_tracejada' 
  | 'continua' 
  | 'dupla_amarela' 
  | 'nenhuma';

export type RoadPavingType = 'asfalto' | 'paralelepipedo' | 'concreto';
export type RoadCornerType = 'quina' | 'arredondada' | 'bisel';
export type RoadCapType = 'reta' | 'arredondada' | 'quadrada';

export interface RoadSegment {
  id: string;
  name: string;
  type: 'avenida' | 'rua' | 'alameda' | 'caminho';
  paving: RoadPavingType;
  color?: string;
  points: RoadPoint[]; // Editable polyline control points
  width: number; // Real roadway width in pixels
  sidewalkWidth?: number; // Real sidewalk width in pixels (default: 8)
  markingType?: RoadMarkingType;
  hasCrosswalk?: boolean;
  crosswalkCount?: number;
  hasSidewalk?: boolean;
  cornerType?: RoadCornerType; // Quinas vivas (miter), arredondada ou bisel
  capType?: RoadCapType; // Terminação reta (butt), arredondada (round) ou quadrada (square)
  locked?: boolean;
  zIndex?: number;
  // Legacy coordinates for backward-compatibility
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export interface Operator {
  id: string;
  name: string;
  registration: string; // Matrícula
  email: string;
  avatar?: string;
  role: string;
  shift: string;
  npsScore: number;
  callsToday: number;
}

export interface Workstation {
  id: string;
  buildingId: string;
  code: string; // e.g. PA-01
  row: number;
  col: number;
  status: WorkstationStatus;
  operator: Operator | null;
  equipment: {
    monitor: string;
    headset: string;
    ramal: string;
  };
  callDurationSeconds?: number;
  queue?: string;
}

export interface MetricCardData {
  label: string;
  value: string;
  subValue: string;
  trend: 'up' | 'down' | 'neutral';
  sparkline: number[];
}

export interface TopIssueData {
  rank: number;
  title: string;
  volume: string;
  percent: number;
}

export interface ChannelChartData {
  label: string;
  value: number;
}

export interface BuildingMetricsExtended {
  totalCallsMonth: string;
  activeAgentsToday: number;
  slaPercent: number;
  averageHandleTime: string;
  kpiCards: MetricCardData[];
  topIssues: TopIssueData[];
  channelDistribution: ChannelChartData[];
  growthRate: string;
}

export interface Building {
  id: string;
  code: string;
  name: string;
  type: BuildingType;
  category: string;
  color: string;
  secondaryColor?: string;
  status: BuildingStatus;
  
  // Isometric map position (grid coordinate in isometric space)
  isoX: number;
  isoY: number;
  model: BuildingArchitectureModel;
  
  // Enhanced 2.5D visual design properties & real geometric dimensions
  customWidth?: number;  // Real architectural width (default: 140)
  customDepth?: number;  // Real architectural depth (default: 100)
  customHeight?: number; // Real architectural height (default: 110)
  scale?: number;
  rotation?: number; // 0, 90, 180, 270
  zIndex?: number;
  locked?: boolean;
  roofType?: BuildingRoofType;
  facadeModel?: BuildingFacadeModel;
  cornerStyle?: 'curvo' | 'reto'; // Curved vs sharp architectural corners
  isCurved?: boolean; // Enable rounded curved facade/barrel arches
  heightScale?: number; // Visual floors multiplier
  isArchived?: boolean; // When archived without losing data
  
  // Legacy / 2D coordinates for compatibility
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  
  floors: number;
  initialPositionsCount: number;
  notes: string;
  supervisor: string;
  slaTargetPercentage?: number;
  tags: string[];
  isDemo?: boolean;
  
  // Extended metrics for the side panel (from screenshot)
  metricsExtended?: BuildingMetricsExtended;
}

export interface CityMetrics {
  totalBuildings: number;
  productBuildings: number;
  adminBuildings: number;
  totalPositions: number;
  activePositions: number;
  inCallPositions: number;
  occupancyRate: number;
  totalSubscribers: string;
  callsHandledToday: string;
  monthlyRevenue: string;
  systemUptime: string;
}

export type CityLayerKey = 
  | 'terreno' 
  | 'ruas' 
  | 'calcadas' 
  | 'predios' 
  | 'pracas' 
  | 'mobiliario' 
  | 'placas' 
  | 'decoracoes';

export interface CityLayerConfig {
  key: CityLayerKey;
  label: string;
  visible: boolean;
  locked: boolean;
}
