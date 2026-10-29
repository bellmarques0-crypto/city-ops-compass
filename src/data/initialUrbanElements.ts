/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UrbanElement, UrbanElementType, RoadSegment, CityLayerKey, CityLayerConfig } from '../types/city';

export const DEFAULT_CITY_LAYERS: Record<CityLayerKey, CityLayerConfig> = {
  terreno: { key: 'terreno', label: 'Terreno & Ilha 3D', visible: true, locked: false },
  ruas: { key: 'ruas', label: 'Ruas & Vias Urbanas', visible: true, locked: false },
  calcadas: { key: 'calcadas', label: 'Calçadas & Faixas', visible: true, locked: false },
  predios: { key: 'predios', label: 'Prédios Operacionais & ADM', visible: true, locked: false },
  pracas: { key: 'pracas', label: 'Praças & Jardins', visible: true, locked: false },
  mobiliario: { key: 'mobiliario', label: 'Mobiliário Urbano & Postes', visible: true, locked: false },
  placas: { key: 'placas', label: 'Placas & Pins Indicadores', visible: true, locked: false },
  decoracoes: { key: 'decoracoes', label: 'Decorações & Efeitos', visible: true, locked: false }
};

export const INITIAL_ROADS: RoadSegment[] = [
  {
    id: 'road-central-avenue',
    name: 'Avenida Central das Operações',
    type: 'avenida',
    paving: 'asfalto',
    color: '#334155',
    points: [
      { x: 280, y: 485 },
      { x: 580, y: 640 },
      { x: 920, y: 800 },
      { x: 1200, y: 890 }
    ],
    width: 68,
    sidewalkWidth: 10,
    markingType: 'amarela_tracejada',
    hasCrosswalk: true,
    crosswalkCount: 3,
    hasSidewalk: true,
    cornerType: 'quina',
    capType: 'reta',
    locked: false,
    zIndex: 3
  },
  {
    id: 'road-cross-axis',
    name: 'Alameda Transversal de Integração',
    type: 'rua',
    paving: 'asfalto',
    color: '#334155',
    points: [
      { x: 560, y: 340 },
      { x: 920, y: 550 },
      { x: 1280, y: 750 }
    ],
    width: 48,
    sidewalkWidth: 8,
    markingType: 'branca_tracejada',
    hasCrosswalk: true,
    crosswalkCount: 2,
    hasSidewalk: true,
    cornerType: 'quina',
    capType: 'reta',
    locked: false,
    zIndex: 3
  }
];

export const INITIAL_URBAN_ELEMENTS: UrbanElement[] = [
  // 1. Praça Central (Base do Piso)
  {
    id: 'elem-central-plaza',
    type: 'praca_central',
    name: 'Praça Central de Convivência',
    x: 920,
    y: 560,
    width: 140,
    height: 140,
    rotation: 0,
    scale: 1,
    color: '#f8fafc',
    secondaryColor: '#38bdf8',
    zIndex: 5,
    locked: false
  },
  // 2. Chafariz / Fonte Central (Objeto individual)
  {
    id: 'elem-central-fountain',
    type: 'fonte',
    name: 'Fonte das Águas Operacionais',
    x: 920,
    y: 560,
    width: 60,
    height: 40,
    rotation: 0,
    scale: 1,
    color: '#0284c7',
    secondaryColor: '#38bdf8',
    zIndex: 7,
    locked: false
  },
  // 3. Bancos individuais da Praça
  {
    id: 'elem-bench-plaza-1',
    type: 'bancos',
    name: 'Banco da Praça (Lado Norte)',
    x: 880,
    y: 535,
    width: 45,
    height: 25,
    rotation: 0,
    scale: 1,
    color: '#92400e',
    zIndex: 8,
    locked: false
  },
  {
    id: 'elem-bench-plaza-2',
    type: 'bancos',
    name: 'Banco da Praça (Lado Sul)',
    x: 960,
    y: 585,
    width: 45,
    height: 25,
    rotation: 0,
    scale: 1,
    color: '#92400e',
    zIndex: 8,
    locked: false
  },
  // 4. Pergolado / Lounge de Descanso (Objeto individual)
  {
    id: 'elem-rest-gazebo',
    type: 'area_descanso',
    name: 'Pergolado & Lounge Externo PINE',
    x: 740,
    y: 690,
    width: 70,
    height: 50,
    rotation: 0,
    scale: 1,
    color: '#78350f',
    secondaryColor: '#fef3c7',
    zIndex: 10,
    locked: false
  },
  // 5. Jardins Florais individuais
  {
    id: 'elem-flower-garden-1',
    type: 'jardim',
    name: 'Canteiro Floral de Orquídeas',
    x: 820,
    y: 450,
    width: 75,
    height: 45,
    rotation: 0,
    scale: 1,
    color: '#ec4899',
    secondaryColor: '#16a34a',
    zIndex: 8,
    locked: false
  },
  {
    id: 'elem-flower-garden-2',
    type: 'jardim',
    name: 'Jardim de Azaleias Leste',
    x: 1040,
    y: 620,
    width: 70,
    height: 40,
    rotation: 0,
    scale: 1,
    color: '#fbbf24',
    secondaryColor: '#16a34a',
    zIndex: 8,
    locked: false
  },
  // 6. Canteiros de Arbustos individuais
  {
    id: 'elem-hedges-1',
    type: 'canteiros',
    name: 'Canteiro Arbustivo Verde 01',
    x: 480,
    y: 430,
    width: 65,
    height: 25,
    rotation: 0,
    scale: 1,
    color: '#15803d',
    zIndex: 8,
    locked: false
  },
  {
    id: 'elem-hedges-2',
    type: 'canteiros',
    name: 'Canteiro Arbustivo Verde 02',
    x: 680,
    y: 520,
    width: 65,
    height: 25,
    rotation: 0,
    scale: 1,
    color: '#15803d',
    zIndex: 8,
    locked: false
  },
  // 7. Bosque / Área gramada
  {
    id: 'elem-grass-park-1',
    type: 'area_gramada',
    name: 'Parque Verde da Inovação',
    x: 1020,
    y: 430,
    width: 100,
    height: 70,
    rotation: 0,
    scale: 1,
    color: '#84cc16',
    zIndex: 4,
    locked: false
  },
  // 8. Palmeiras individuais (Cada uma é um item selecionável e deletável)
  {
    id: 'elem-palm-tree-1',
    type: 'arvores',
    name: 'Palmeira Nobre 01 (Alameda Oeste)',
    x: 320,
    y: 390,
    width: 55,
    height: 55,
    rotation: 0,
    scale: 1,
    color: '#16a34a',
    zIndex: 15,
    locked: false
  },
  {
    id: 'elem-palm-tree-2',
    type: 'arvores',
    name: 'Palmeira Nobre 02 (Praça)',
    x: 840,
    y: 500,
    width: 55,
    height: 55,
    rotation: 0,
    scale: 1,
    color: '#16a34a',
    zIndex: 15,
    locked: false
  },
  {
    id: 'elem-palm-tree-3',
    type: 'arvores',
    name: 'Palmeira Nobre 03 (Boulevard Leste)',
    x: 1220,
    y: 650,
    width: 55,
    height: 55,
    rotation: 0,
    scale: 1,
    color: '#16a34a',
    zIndex: 15,
    locked: false
  },
  // 9. Estacionamento Operacional (Objeto individual)
  {
    id: 'elem-parking-lot',
    type: 'estacionamento',
    name: 'Estacionamento Administrativo',
    x: 1320,
    y: 440,
    width: 120,
    height: 70,
    rotation: 0,
    scale: 1,
    color: '#475569',
    secondaryColor: '#facc15',
    zIndex: 7,
    locked: false
  },
  // 10. Bicicletário Corporativo
  {
    id: 'elem-bike-rack',
    type: 'bicicletario',
    name: 'Estação de Bicicletas Sustentáveis',
    x: 640,
    y: 470,
    width: 50,
    height: 30,
    rotation: 0,
    scale: 1,
    color: '#059669',
    secondaryColor: '#e2e8f0',
    zIndex: 10,
    locked: false
  },
  // 11. Postes de Iluminação individuais
  {
    id: 'elem-lamp-post-1',
    type: 'iluminacao_urbana',
    name: 'Poste LED Boulevard 01',
    x: 770,
    y: 590,
    width: 35,
    height: 35,
    rotation: 0,
    scale: 1,
    color: '#1e293b',
    secondaryColor: '#fef08a',
    zIndex: 18,
    locked: false
  },
  {
    id: 'elem-lamp-post-2',
    type: 'iluminacao_urbana',
    name: 'Poste LED Boulevard 02',
    x: 1080,
    y: 720,
    width: 35,
    height: 35,
    rotation: 0,
    scale: 1,
    color: '#1e293b',
    secondaryColor: '#fef08a',
    zIndex: 18,
    locked: false
  },
  // 12. Faixa de Pedestres individual
  {
    id: 'elem-crosswalk-1',
    type: 'faixa_pedestres',
    name: 'Faixa de Travessia Segura Praça',
    x: 780,
    y: 640,
    width: 50,
    height: 35,
    rotation: 25,
    scale: 1,
    color: '#ffffff',
    secondaryColor: '#334155',
    zIndex: 6,
    locked: false
  },
  // 13. Ponto de Encontro / Brigada
  {
    id: 'elem-meeting-point',
    type: 'ponto_encontro',
    name: 'Ponto de Encontro 01 (Brigada & CIPA)',
    x: 880,
    y: 640,
    width: 40,
    height: 40,
    rotation: 0,
    scale: 1,
    color: '#16a34a',
    secondaryColor: '#ffffff',
    zIndex: 14,
    locked: false
  }
];

export function createDefaultUrbanElement(
  type: UrbanElementType,
  x: number = 850,
  y: number = 550
): UrbanElement {
  const id = `elem-${type}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
  
  const defaultsMap: Record<UrbanElementType, { name: string; width: number; height: number; color: string; secColor?: string }> = {
    praca_central: { name: 'Nova Praça Central', width: 140, height: 140, color: '#f8fafc', secColor: '#38bdf8' },
    praca_pequena: { name: 'Largo das Palmeiras', width: 90, height: 90, color: '#f1f5f9', secColor: '#cbd5e1' },
    jardim: { name: 'Jardim Botânico Ornamental', width: 80, height: 50, color: '#ec4899', secColor: '#16a34a' },
    area_gramada: { name: 'Gramado Integrado', width: 90, height: 60, color: '#84cc16' },
    arvores: { name: 'Palmeira Tropical Individual', width: 55, height: 55, color: '#15803d' },
    canteiros: { name: 'Canteiro Arbustivo Verde', width: 60, height: 25, color: '#166534' },
    bancos: { name: 'Banco de Madeira Individual', width: 45, height: 25, color: '#92400e' },
    caminho_pedestres: { name: 'Passeio de Pedestres em Pedras', width: 100, height: 30, color: '#e2e8f0' },
    calcada: { name: 'Calçada Acessível com Guia', width: 110, height: 25, color: '#cbd5e1' },
    fonte: { name: 'Chafariz Luminoso com Jatos', width: 60, height: 40, color: '#0284c7', secColor: '#7dd3fc' },
    espelho_dagua: { name: 'Espelho d\'Água & Carpas', width: 80, height: 45, color: '#0369a1', secColor: '#38bdf8' },
    area_descanso: { name: 'Quiosque & Lounge de Descompressão', width: 65, height: 50, color: '#78350f', secColor: '#fef3c7' },
    estacionamento: { name: 'Vagas de Estacionamento', width: 110, height: 65, color: '#475569', secColor: '#facc15' },
    bicicletario: { name: 'Estação de Bicicletas e Patinetes', width: 50, height: 30, color: '#059669', secColor: '#f1f5f9' },
    faixa_pedestres: { name: 'Faixa de Travessia Individual', width: 50, height: 35, color: '#ffffff', secColor: '#334155' },
    iluminacao_urbana: { name: 'Poste de Iluminação LED Individual', width: 35, height: 35, color: '#1e293b', secColor: '#fef08a' },
    ponto_encontro: { name: 'Ponto de Encontro de Segurança', width: 40, height: 40, color: '#16a34a', secColor: '#ffffff' }
  };

  const def = defaultsMap[type] || { name: 'Elemento Urbano', width: 60, height: 40, color: '#10b981' };

  return {
    id,
    type,
    name: def.name,
    x,
    y,
    width: def.width,
    height: def.height,
    rotation: 0,
    scale: 1,
    color: def.color,
    secondaryColor: def.secColor,
    zIndex: 10,
    locked: false
  };
}

export function createDefaultRoad(
  type: 'avenida' | 'rua' = 'rua',
  paving: 'asfalto' | 'paralelepipedo' | 'concreto' = 'asfalto'
): RoadSegment {
  const id = `road-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
  return {
    id,
    name: type === 'avenida' ? 'Nova Avenida Principal' : 'Nova Rua Conectora',
    type,
    paving,
    color: paving === 'paralelepipedo' ? '#475569' : paving === 'concreto' ? '#64748b' : '#334155',
    points: [
      { x: 600, y: 500 },
      { x: 900, y: 700 }
    ],
    width: type === 'avenida' ? 64 : 44,
    sidewalkWidth: 8,
    markingType: type === 'avenida' ? 'amarela_tracejada' : 'branca_tracejada',
    hasCrosswalk: true,
    crosswalkCount: 1,
    hasSidewalk: true,
    cornerType: 'quina',
    capType: 'reta',
    locked: false,
    zIndex: 3
  };
}
