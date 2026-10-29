/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building, Workstation } from '../types/city';
import { AlertTriangle, Archive, EyeOff, Trash2, X, ShieldAlert, Check } from 'lucide-react';

interface DeleteBuildingModalProps {
  isOpen: boolean;
  building: Building | null;
  workstations: Workstation[];
  onClose: () => void;
  onArchive: (buildingId: string) => void;
  onRemoveVisualOnly: (buildingId: string) => void;
  onDeletePermanently: (buildingId: string) => void;
}

export const DeleteBuildingModal: React.FC<DeleteBuildingModalProps> = ({
  isOpen,
  building,
  workstations,
  onClose,
  onArchive,
  onRemoveVisualOnly,
  onDeletePermanently
}) => {
  const [selectedOption, setSelectedOption] = useState<'archive' | 'visual' | 'permanent'>('archive');
  const [confirmName, setConfirmName] = useState('');

  if (!isOpen || !building) return null;

  const totalPAs = workstations.length;
  const activeOps = workstations.filter(w => w.operator !== null).length;

  const handleConfirm = () => {
    if (selectedOption === 'archive') {
      onArchive(building.id);
    } else if (selectedOption === 'visual') {
      onRemoveVisualOnly(building.id);
    } else if (selectedOption === 'permanent') {
      if (confirmName.trim().toUpperCase() !== building.name.trim().toUpperCase()) {
        alert(`Para exclusão definitiva, digite o nome exato do prédio: "${building.name}"`);
        return;
      }
      onDeletePermanently(building.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-rose-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Gerenciamento de Exclusão do Prédio
              </h3>
              <p className="text-xs text-rose-800 font-medium">
                {building.name} ({building.code}) · {totalPAs} PAs · {activeOps} Operadores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Este prédio possui histórico de atendimento e operadores alocados. Selecione como deseja proceder com a remoção:
          </p>

          <div className="space-y-2.5">
            {/* Option 1: Archive */}
            <div
              onClick={() => setSelectedOption('archive')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedOption === 'archive'
                  ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 border-emerald-600 bg-white">
                  {selectedOption === 'archive' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Archive className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-xs text-slate-900">
                      1. Desativar / Arquivar Operação (Recomendado)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Mantém todos os operadores, ramais e métricas intactos no sistema. O prédio é marcado como desativado e pode ser reativado a qualquer momento.
                  </p>
                </div>
              </div>
            </div>

            {/* Option 2: Remove Visual Representation */}
            <div
              onClick={() => setSelectedOption('visual')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedOption === 'visual'
                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 border-blue-600 bg-white">
                  {selectedOption === 'visual' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-xs text-slate-900">
                      2. Remover Apenas a Representação Visual da Planta
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Remove a construção do mapa isométrico 3D liberando o espaço no terreno, preservando o cadastro e as posições salvas no banco de dados.
                  </p>
                </div>
              </div>
            </div>

            {/* Option 3: Delete Permanently */}
            <div
              onClick={() => setSelectedOption('permanent')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedOption === 'permanent'
                  ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 border-rose-600 bg-white">
                  {selectedOption === 'permanent' && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-rose-700" />
                    <span className="font-bold text-xs text-rose-900">
                      3. Excluir Definitivamente Prédio e Dados
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800 mt-1 leading-snug">
                    Ação irreversível! Apaga o prédio, desvincula os operadores e zera o histórico de posições.
                  </p>

                  {selectedOption === 'permanent' && (
                    <div className="mt-3 pt-2 border-t border-rose-200">
                      <label className="block text-[10px] font-bold text-rose-900 uppercase tracking-wider mb-1">
                        Digite "{building.name}" para confirmar:
                      </label>
                      <input
                        type="text"
                        value={confirmName}
                        onChange={e => setConfirmName(e.target.value)}
                        placeholder={building.name}
                        className="w-full px-2.5 py-1.5 text-xs border border-rose-300 rounded font-mono font-bold focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-colors ${
              selectedOption === 'permanent'
                ? 'bg-rose-600 hover:bg-rose-700'
                : selectedOption === 'visual'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {selectedOption === 'permanent' ? 'Excluir Definitivamente' : selectedOption === 'visual' ? 'Remover da Planta' : 'Arquivar Prédio'}
          </button>
        </div>
      </div>
    </div>
  );
};
