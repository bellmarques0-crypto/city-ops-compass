/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface CentralAvenueProps {
  totalWidth: number;
}

export const CentralAvenue: React.FC<CentralAvenueProps> = ({ totalWidth }) => {
  const width = Math.max(totalWidth, 1800);
  const crosswalkPositions = [220, 500, 770, 1040, 1310, 1580];

  return (
    <div 
      className="absolute left-0 top-[310px] w-full pointer-events-none select-none z-10"
      style={{ width: `${width}px`, height: '170px' }}
    >
      {/* North Sidewalk (Calçada Norte com Guia) */}
      <div className="w-full h-7 bg-[#d6dbdf] border-t-2 border-b-2 border-slate-400/80 flex items-center justify-between px-6 relative shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
        <span className="text-[10px] font-mono tracking-widest text-slate-600 font-semibold uppercase flex items-center gap-1.5 z-10">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
          Acesso Setor de Produtos & Operações (Norte)
        </span>
        <div className="flex items-center gap-6 z-10 text-[9px] font-mono text-slate-500">
          <span>Ciclovia Integrada</span>
          <span>·</span>
          <span>Calçada Acessível</span>
        </div>
      </div>

      {/* Main Asphalt Road (Pista Asfáltica com Faixas) */}
      <div className="w-full h-[116px] bg-[#1a202c] relative flex flex-col justify-between overflow-hidden shadow-inner border-y border-slate-900">
        {/* Subtle asphalt noise texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />

        {/* Top White Edge Line */}
        <div className="w-full h-1 bg-white/70 shadow-sm" />

        {/* Central Lanes with Yellow Divider Line */}
        <div className="w-full h-10 flex items-center justify-between relative px-4">
          {/* Street Name Signage in middle of asphalt */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded px-2.5 py-1 text-[11px] font-mono text-amber-300 font-medium tracking-wider shadow">
            <span className="text-slate-400">VIA PRINCIPAL:</span>
            <span>AV. CENTRAL DAS OPERAÇÕES</span>
            <span className="text-slate-500 text-[9px]">⇄ VEL. MÁX 30 KM/H</span>
          </div>

          {/* Yellow Dashed Center Line */}
          <div 
            className="w-full h-[3px]"
            style={{
              backgroundImage: 'repeating-linear-gradient(to right, #facc15 0px, #facc15 36px, transparent 36px, transparent 64px)',
            }}
          />
        </div>

        {/* Pedestrian Crosswalks (Faixas de Pedestre) */}
        {crosswalkPositions.map((pos) => (
          <div 
            key={`crosswalk-${pos}`}
            className="absolute top-0 bottom-0 flex flex-col justify-between py-1 z-10"
            style={{ left: `${pos}px`, width: '48px' }}
          >
            {Array.from({ length: 9 }).map((_, idx) => (
              <div 
                key={idx} 
                className="w-full h-2 bg-white/95 rounded-[1px] shadow-sm"
              />
            ))}
          </div>
        ))}

        {/* Traffic Arrows (Sinalização Horizontal) */}
        <div className="absolute left-[360px] top-4 text-white/40 text-xs font-mono font-bold tracking-widest pointer-events-none">
          → SENTIDO LESTE
        </div>
        <div className="absolute left-[880px] bottom-3 text-white/40 text-xs font-mono font-bold tracking-widest pointer-events-none">
          ← SENTIDO OESTE
        </div>

        {/* Bottom White Edge Line */}
        <div className="w-full h-1 bg-white/70 shadow-sm" />
      </div>

      {/* South Sidewalk (Calçada Sul com Guia e Acesso Administrativo) */}
      <div className="w-full h-7 bg-[#d6dbdf] border-t-2 border-b-2 border-slate-400/80 flex items-center justify-between px-6 relative shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
        <span className="text-[10px] font-mono tracking-widest text-slate-600 font-semibold uppercase flex items-center gap-1.5 z-10">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
          Acesso Setor Administrativo & T.I. (Sul)
        </span>
        <div className="flex items-center gap-6 z-10 text-[9px] font-mono text-slate-500">
          <span>Estacionamento Operacional</span>
          <span>·</span>
          <span>Praça de Convivência</span>
        </div>
      </div>
    </div>
  );
};
