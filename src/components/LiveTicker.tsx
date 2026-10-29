/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Radio } from 'lucide-react';

export const LiveTicker: React.FC = () => {
  const news = [
    '★ Churn mensal recua para 2,8% com nova célula de Retenção',
    '★ "PINE Consignado" atinge recorde de 13.482 propostas na esteira digital',
    '★ T.I. atinge 99,98% de uptime nos ramais VoIP e telefonia preditiva',
    '★ Receita operacional mensal estimada atinge R$ 182,4 mi (+6,2%)',
    '★ BYX Fintech expande limite de crédito instantâneo via Pix',
    '★ AMIGOZ adiciona 18 novas redes credenciadas no clube de benefícios',
    '★ ORCREDI conclui esteira de aprovação com tempo médio de 18 minutos'
  ];

  return (
    <div className="absolute bottom-0 inset-x-0 h-8 bg-slate-950 text-white z-40 flex items-center overflow-hidden border-t border-slate-800 text-[11px] font-mono select-none">
      {/* Live Badge */}
      <div className="bg-rose-600 px-3 py-1 font-bold flex items-center gap-1.5 shrink-0 z-10 shadow-md">
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <span className="tracking-wider uppercase">AO VIVO</span>
      </div>

      {/* Scrolling Text Ribbon */}
      <div className="flex-1 overflow-hidden whitespace-nowrap relative">
        <div className="inline-block animate-marquee pl-4 text-slate-300">
          {news.map((item, idx) => (
            <span key={idx} className="mr-8">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
