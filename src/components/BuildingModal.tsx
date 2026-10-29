/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  BuildingType, 
  BuildingStatus,
  BuildingArchitectureModel,
  BuildingRoofType,
  BuildingFacadeModel
} from '../types/city';
import { X, Building2, Palette, MapPin, Sliders, Shield, AlertCircle } from 'lucide-react';
import { calculateNextBuildingPosition } from '../services/storage';

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (buildingData: Omit<Building, 'id'>, isEditingId?: string) => void;
  editingBuilding?: Building | null;
  existingBuildings: Building[];
}

const COLOR_PRESETS = [
  { name: 'Esmeralda', hex: '#059669', sec: '#10b981' },
  { name: 'Índigo', hex: '#4f46e5', sec: '#6366f1' },
  { name: 'Âmbar', hex: '#d97706', sec: '#f59e0b' },
  { name: 'Rubi', hex: '#e11d48', sec: '#f43f5e' },
  { name: 'Turquesa', hex: '#0891b2', sec: '#06b6d4' },
  { name: 'Violeta', hex: '#7c3aed', sec: '#8b5cf6' },
  { name: 'Ardósia', hex: '#334155', sec: '#475569' },
  { name: 'Teal', hex: '#0f766e', sec: '#0d9488' },
  { name: 'Azul Real', hex: '#1d4ed8', sec: '#2563eb' },
];

export const BuildingModal: React.FC<BuildingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBuilding,
  existingBuildings
}) => {
  const [type, setType] = useState<BuildingType>('produto');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#059669');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [status, setStatus] = useState<BuildingStatus>('ativo');
  const [initialPositionsCount, setInitialPositionsCount] = useState(30);
  const [width, setWidth] = useState(230);
  const [height, setHeight] = useState(190);
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(70);
  const [floors, setFloors] = useState(2);
  const [notes, setNotes] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [model, setModel] = useState<BuildingArchitectureModel>('corporate-hotel');
  const [roofType, setRoofType] = useState<BuildingRoofType>('standard');
  const [facadeModel, setFacadeModel] = useState<BuildingFacadeModel>('modern-glass');

  // Sync state when opening in edit mode vs create mode
  useEffect(() => {
    if (editingBuilding) {
      setType(editingBuilding.type);
      setName(editingBuilding.name);
      setCode(editingBuilding.code);
      setCategory(editingBuilding.category);
      setColor(editingBuilding.color);
      setSecondaryColor(editingBuilding.secondaryColor || editingBuilding.color);
      setStatus(editingBuilding.status);
      setModel(editingBuilding.model || (editingBuilding.type === 'produto' ? 'corporate-hotel' : 'executive-palace'));
      setRoofType(editingBuilding.roofType || 'standard');
      setFacadeModel(editingBuilding.facadeModel || 'modern-glass');
      setInitialPositionsCount(editingBuilding.initialPositionsCount);
      setWidth(editingBuilding.size.width);
      setHeight(editingBuilding.size.height);
      setPosX(editingBuilding.position.x);
      setPosY(editingBuilding.position.y);
      setFloors(editingBuilding.floors || 2);
      setNotes(editingBuilding.notes || '');
      setSupervisor(editingBuilding.supervisor || '');
      setError(null);
    } else {
      // Auto-assign clean non-overlapping coordinates for new building
      const nextPos = calculateNextBuildingPosition('produto', existingBuildings);
      setType('produto');
      setName('');
      setCode(`PRD-${Math.floor(100 + Math.random() * 899)}`);
      setCategory('Operações de Atendimento');
      setColor('#059669');
      setSecondaryColor('#10b981');
      setStatus('ativo');
      setModel('corporate-hotel');
      setRoofType('pool');
      setFacadeModel('modern-glass');
      setInitialPositionsCount(30);
      setWidth(230);
      setHeight(190);
      setPosX(nextPos.x);
      setPosY(nextPos.y);
      setFloors(2);
      setNotes('');
      setSupervisor('Supervisão Operacional');
      setError(null);
    }
  }, [editingBuilding, isOpen, existingBuildings]);

  // Recalculate auto position when user toggles type in create mode
  const handleTypeChange = (newType: BuildingType) => {
    setType(newType);
    if (!editingBuilding) {
      const nextPos = calculateNextBuildingPosition(newType, existingBuildings);
      setPosX(nextPos.x);
      setPosY(nextPos.y);
      if (newType === 'produto') {
        setCode(`PRD-${Math.floor(100 + Math.random() * 899)}`);
        setColor('#059669');
      } else {
        setCode(`ADM-${Math.floor(10 + Math.random() * 89)}`);
        setColor('#334155');
      }
    } else {
      // If editing and changing type, adjust Y to remain in safe zone
      if (newType === 'produto' && posY > 300) {
        setPosY(70);
      } else if (newType === 'administrativo' && posY < 480) {
        setPosY(520);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Por favor, informe o nome do prédio.');
      return;
    }

    if (!code.trim()) {
      setError('Por favor, informe o código único do prédio.');
      return;
    }

    // Verify code uniqueness (exclude self when editing)
    const duplicate = existingBuildings.find(
      b => b.code.toUpperCase() === code.trim().toUpperCase() && b.id !== editingBuilding?.id
    );
    if (duplicate) {
      setError(`O código "${code.toUpperCase()}" já está em uso pelo prédio "${duplicate.name}". Escolha outro.`);
      return;
    }

    // Validate coordinates to keep the central avenue clear
    let finalY = posY;
    if (type === 'produto') {
      if (finalY > 280) finalY = 70; // North zone clamp
    } else {
      if (finalY < 490) finalY = 520; // South zone clamp
    }

    onSave(
      {
        name: name.trim().toUpperCase(),
        code: code.trim().toUpperCase(),
        type,
        category: category.trim() || (type === 'produto' ? 'Operações & Negócios' : 'Administração Corporativa'),
        color,
        secondaryColor: secondaryColor || color,
        status,
        isoX: editingBuilding?.isoX || posX * 1.5,
        isoY: editingBuilding?.isoY || posY * 1.2,
        model,
        roofType,
        facadeModel,
        position: { x: posX, y: finalY },
        size: { width: Math.max(180, width), height: Math.max(150, height) },
        customWidth: Math.max(90, Math.min(260, editingBuilding?.customWidth || Math.round(width * 0.65))),
        customDepth: Math.max(60, Math.min(200, editingBuilding?.customDepth || Math.round(height * 0.55))),
        customHeight: Math.max(60, Math.min(260, floors * 40)),
        floors: Math.max(1, floors),
        initialPositionsCount: Math.max(6, initialPositionsCount),
        notes: notes.trim(),
        supervisor: supervisor.trim() || 'Gestão da Área',
        slaTargetPercentage: 95,
        tags: [type === 'produto' ? 'Operacional' : 'Corporativo', category.split(' ')[0]]
      },
      editingBuilding?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {editingBuilding ? 'Editar Prédio Operacional' : 'Adicionar Novo Prédio à Cidade'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure especificações, posições de atendimento e alocação no campus
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Tipo do Prédio: Produto vs Administrativo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo & Zona do Campus
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('produto')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  type === 'produto'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Prédio de Produto</span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Setor Norte (acima da Av. Central). Atendimento e operações.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('administrativo')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  type === 'administrativo'
                    ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Ambiente Administrativo</span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Setor Sul (abaixo da Av. Central). T.I., diretoria e apoio.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Nome e Código Único */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Prédio *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: NOVO BANCO, BYX, AMIGOZ, RETENÇÃO"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código Único *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="PRD-01"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono font-bold uppercase"
              />
            </div>
          </div>

          {/* 3. Categoria e Liderança */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria Operacional
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Ex: Crédito Consignado, Cartões, Suporte"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supervisão / Responsável
              </label>
              <input
                type="text"
                value={supervisor}
                onChange={e => setSupervisor(e.target.value)}
                placeholder="Ex: Mariana Silva - Coordenação"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* 4. Cor do Prédio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>Cor Temática do Prédio</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => {
                    setColor(preset.hex);
                    setSecondaryColor(preset.sec);
                  }}
                  className={`w-7 h-7 rounded-lg border-2 transition-transform ${
                    color === preset.hex 
                      ? 'scale-110 ring-2 ring-offset-2 ring-slate-900 border-white shadow-md' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                />
              ))}
              <div className="flex items-center gap-1.5 ml-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => {
                    setColor(e.target.value);
                    setSecondaryColor(e.target.value);
                  }}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-300 p-0"
                />
                <span className="text-[11px] font-mono text-slate-500">{color}</span>
              </div>
            </div>
          </div>

          {/* 4.5. Modelo Arquitetônico e Tipo de Cobertura */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Modelo Arquitetônico
              </label>
              <select
                value={model}
                onChange={e => setModel(e.target.value as BuildingArchitectureModel)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="corporate-hotel">Hotel Corporativo / Resort (PINE)</option>
                <option value="modern-fintech">Cubo Tecnológico Fintech (BYX)</option>
                <option value="soundstage-hangar">Hangar Arqueado / Soundstage (AMIGOZ)</option>
                <option value="neon-billboard">Comercial com Outdoor Neon (RETENÇÃO)</option>
                <option value="classic-auditorium">Auditório Neoclássico (ORCREDI)</option>
                <option value="glass-tower">Torre de Vidro & NOC (T.I.)</option>
                <option value="executive-palace">Palácio Executivo & Colunatas (ADM 1)</option>
                <option value="finance-vault">Bloco Financeiro & Compliance (ADM 2)</option>
                <option value="support-campus">Pavilhão de Apoio & Treinamento</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo de Cobertura / Telhado
              </label>
              <select
                value={roofType}
                onChange={e => setRoofType(e.target.value as BuildingRoofType)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value="standard">Cobertura Padrão</option>
                <option value="pool">Piscina & Lounge Solarium</option>
                <option value="helipad">Heliponto Operacional (H)</option>
                <option value="antennas">Mastro de Telecomunicações & NOC</option>
                <option value="billboard">Outdoor Letreiro Neon</option>
                <option value="solar">Painéis Solares Fotovoltaicos</option>
                <option value="cornice">Cornija & Cúpula Dourada</option>
              </select>
            </div>
          </div>

          {/* 5. Quantidade de Posições e Pavimentos */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantidade Inicial de PAs
              </label>
              <input
                type="number"
                min="6"
                max="80"
                step="2"
                value={initialPositionsCount}
                onChange={e => setInitialPositionsCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono font-bold"
              />
              <span className="text-[10px] text-slate-500 font-mono">
                Cria automaticamente as estações na planta
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pavimentos (Andares)
              </label>
              <select
                value={floors}
                onChange={e => setFloors(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
              >
                <option value={1}>1 Pavimento (Térreo)</option>
                <option value={2}>2 Pavimentos</option>
                <option value={3}>3 Pavimentos</option>
                <option value={4}>4 Pavimentos</option>
              </select>
            </div>
          </div>

          {/* 6. Dimensões e Coordenadas no Mapa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Dimensões e Coordenadas na Planta (Pixels)</span>
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Largura (px):</span>
                <input
                  type="number"
                  min="180"
                  max="350"
                  step="10"
                  value={width}
                  onChange={e => setWidth(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Altura (px):</span>
                <input
                  type="number"
                  min="150"
                  max="260"
                  step="10"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Posição X:</span>
                <input
                  type="number"
                  min="20"
                  max="3000"
                  step="10"
                  value={posX}
                  onChange={e => setPosX(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono">Posição Y:</span>
                <input
                  type="number"
                  min="20"
                  max="800"
                  step="10"
                  value={posY}
                  onChange={e => setPosY(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Dica: Prédios de produtos ficam seguros em Y: 70px. Administrativos em Y: 520px (a Avenida Central ocupa Y: 310 a 480px).
            </p>
          </div>

          {/* 7. Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações Operacionais
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Descreva detalhes específicos do produto, fila de atendimento, horários especiais..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            {editingBuilding ? 'Salvar Alterações' : 'Salvar e Inserir na Planta'}
          </button>
        </div>
      </div>
    </div>
  );
};
