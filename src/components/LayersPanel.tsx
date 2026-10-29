/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CityLayerConfig, CityLayerKey } from '../types/city';
import { Layers, Eye, EyeOff, Lock, Unlock, X } from 'lucide-react';

interface LayersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  layers: Record<CityLayerKey, CityLayerConfig>;
  onToggleVisibility: (key: CityLayerKey) => void;
  onToggleLock: (key: CityLayerKey) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  isOpen,
  onClose,
  layers,
  onToggleVisibility,
  onToggleLock
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-20 left-6 z-50 select-none w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200 text-xs">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h4 className="font-extrabold text-xs tracking-wide">
            Camadas da Cidade
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer List */}
      <div className="p-3 divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {(Object.values(layers) as CityLayerConfig[]).map((layer) => (
          <div
            key={layer.key}
            className={`py-2 px-1 flex items-center justify-between transition-colors ${
              !layer.visible ? 'opacity-40' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span 
                className={`w-2.5 h-2.5 rounded-full ${
                  layer.key === 'terreno' ? 'bg-lime-500' :
                  layer.key === 'ruas' ? 'bg-slate-700' :
                  layer.key === 'calcadas' ? 'bg-slate-400' :
                  layer.key === 'predios' ? 'bg-rose-500' :
                  layer.key === 'pracas' ? 'bg-emerald-500' :
                  layer.key === 'mobiliario' ? 'bg-amber-500' :
                  layer.key === 'placas' ? 'bg-sky-500' : 'bg-purple-500'
                }`}
              />
              <span className={`font-semibold ${layer.visible ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                {layer.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Visibility Toggle */}
              <button
                onClick={() => onToggleVisibility(layer.key)}
                className={`p-1.5 rounded-md transition-colors ${
                  layer.visible 
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
                    : 'text-slate-400 bg-slate-100'
                }`}
                title={layer.visible ? 'Ocultar camada' : 'Exibir camada'}
              >
                {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
              </button>

              {/* Lock Toggle */}
              <button
                onClick={() => onToggleLock(layer.key)}
                className={`p-1.5 rounded-md transition-colors ${
                  layer.locked 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={layer.locked ? 'Camada bloqueada (não editável)' : 'Bloquear edição desta camada'}
              >
                {layer.locked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
        Bloquear impede seleção acidental durante a edição.
      </div>
    </div>
  );
};
