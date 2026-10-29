/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Workstation, WorkstationStatus, Operator } from '../types/city';
import { X, User, PhoneCall, Headphones, Monitor, Hash, CheckCircle, Clock, Award } from 'lucide-react';

interface WorkstationDetailModalProps {
  workstation: Workstation | null;
  buildingName: string;
  onClose: () => void;
  onSaveWorkstation: (updated: Workstation) => void;
}

export const WorkstationDetailModal: React.FC<WorkstationDetailModalProps> = ({
  workstation,
  buildingName,
  onClose,
  onSaveWorkstation
}) => {
  if (!workstation) return null;

  const [status, setStatus] = useState<WorkstationStatus>(workstation.status);
  const [operatorName, setOperatorName] = useState(workstation.operator?.name || '');
  const [operatorShift, setOperatorShift] = useState(workstation.operator?.shift || 'Manhã (08h - 14h)');
  const [ramal, setRamal] = useState(workstation.equipment.ramal);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let updatedOperator: Operator | null = workstation.operator;
    if (operatorName.trim()) {
      updatedOperator = {
        id: workstation.operator?.id || `op-${Date.now()}`,
        name: operatorName.trim(),
        registration: workstation.operator?.registration || `MAT-${Math.floor(1000 + Math.random() * 8999)}`,
        email: workstation.operator?.email || `${operatorName.toLowerCase().replace(/\s+/g, '.')}@operacional.com.br`,
        role: workstation.operator?.role || 'Operador de Atendimento',
        shift: operatorShift,
        npsScore: workstation.operator?.npsScore || 92.4,
        callsToday: workstation.operator?.callsToday || 12
      };
    } else {
      updatedOperator = null;
    }

    const updated: Workstation = {
      ...workstation,
      status,
      operator: updatedOperator,
      equipment: {
        ...workstation.equipment,
        ramal
      }
    };

    onSaveWorkstation(updated);
    onClose();
  };

  const statusOptions: { label: string; value: WorkstationStatus; color: string }[] = [
    { label: 'Em Atendimento', value: 'em_atendimento', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    { label: 'Disponível', value: 'disponivel', color: 'text-blue-700 bg-blue-50 border-blue-300' },
    { label: 'Pausa Regulamentar', value: 'pausa', color: 'text-amber-700 bg-amber-50 border-amber-300' },
    { label: 'Em Treinamento', value: 'treinamento', color: 'text-purple-700 bg-purple-50 border-purple-300' },
    { label: 'Estação Desconectada (Offline)', value: 'offline', color: 'text-slate-600 bg-slate-100 border-slate-300' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm bg-slate-900 text-white px-2 py-0.5 rounded">
                {workstation.code}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Posição de Atendimento
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ambiente: <span className="font-semibold text-slate-700">{buildingName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Status da Estação
            </label>
            <div className="space-y-1.5">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                    status === opt.value
                      ? `${opt.color} ring-2 ring-slate-900/10 font-bold`
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        opt.value === 'em_atendimento' ? 'bg-emerald-500' :
                        opt.value === 'disponivel' ? 'bg-blue-500' :
                        opt.value === 'pausa' ? 'bg-amber-500' :
                        opt.value === 'treinamento' ? 'bg-purple-500' : 'bg-slate-400'
                      }`}
                    />
                    <span>{opt.label}</span>
                  </span>
                  {status === opt.value && <CheckCircle className="w-4 h-4" />}
                </label>
              ))}
            </div>
          </div>

          {/* Operator Information */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Operador Alocado
              </span>
              {workstation.operator && (
                <span className="text-[10px] font-mono text-slate-500">
                  {workstation.operator.registration}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 mb-1">Nome Completo</label>
              <input
                type="text"
                value={operatorName}
                onChange={e => setOperatorName(e.target.value)}
                placeholder="Ex: Matheus Carvalho (Deixe vazio para desocupar)"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Turno de Trabalho</label>
                <select
                  value={operatorShift}
                  onChange={e => setOperatorShift(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                >
                  <option value="Manhã (08h - 14h)">Manhã (08h - 14h)</option>
                  <option value="Tarde (14h - 20h)">Tarde (14h - 20h)</option>
                  <option value="Integral (09h - 18h)">Integral (09h - 18h)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Ramal Telefônico</label>
                <input
                  type="text"
                  value={ramal}
                  onChange={e => setRamal(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                />
              </div>
            </div>

            {/* Operator Telemetry stats if existing */}
            {workstation.operator && (
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" />
                  <span>NPS: {workstation.operator.npsScore}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-emerald-500" />
                  <span>Atendimentos: {workstation.operator.callsToday}</span>
                </div>
              </div>
            )}
          </div>

          {/* Equipment Specs */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 truncate">
              <Monitor className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{workstation.equipment.monitor}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Headphones className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{workstation.equipment.headset}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 shadow-sm"
            >
              Salvar Posição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
