/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UrbanElement } from '../types/city';

interface UrbanElementSvgProps {
  element: UrbanElement;
  isSelected?: boolean;
  isDragging?: boolean;
  isEditMode?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const UrbanElementSvg: React.FC<UrbanElementSvgProps> = ({
  element,
  isSelected = false,
  isDragging = false,
  isEditMode = false,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const { type, x, y, scale = 1, rotation = 0, color, secondaryColor } = element;

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}
      className={`cursor-pointer transition-transform duration-100 ${
        isDragging ? 'opacity-80 pointer-events-none' : ''
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Selection Box in Edit Mode */}
      {isSelected && isEditMode && (
        <rect
          x="-50"
          y="-35"
          width="100"
          height="70"
          rx="6"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />
      )}

      {/* 1. PRAÇA CENTRAL */}
      {type === 'praca_central' && (
        <g>
          {/* Diamond Plaza Base */}
          <polygon
            points="-70,0 0,-40 70,0 0,40"
            fill={color || '#f8fafc'}
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {/* Paving concentric stones */}
          <polygon
            points="-50,0 0,-28 50,0 0,28"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          {/* Circular inner planter */}
          <ellipse cx="0" cy="0" rx="30" ry="16" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
        </g>
      )}

      {/* 2. PRAÇA PEQUENA */}
      {type === 'praca_pequena' && (
        <g>
          <polygon points="-45,0 0,-25 45,0 0,25" fill={color || '#f1f5f9'} stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="-30,0 0,-16 30,0 0,16" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        </g>
      )}

      {/* 3. JARDIM */}
      {type === 'jardim' && (
        <g>
          <polygon points="-40,0 0,-22 40,0 0,22" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          {/* Colorful flowers */}
          {[-20, -10, 0, 10, 20].map((fx, i) => (
            <circle
              key={i}
              cx={fx}
              cy={((i % 2 === 0 ? -5 : 5))}
              r="3.5"
              fill={i % 3 === 0 ? '#f43f5e' : i % 3 === 1 ? '#fbbf24' : '#c084fc'}
            />
          ))}
        </g>
      )}

      {/* 4. ÁREA GRAMADA */}
      {type === 'area_gramada' && (
        <g>
          <polygon points="-45,0 0,-26 45,0 0,26" fill={color || '#84cc16'} stroke="#4d7c0f" strokeWidth="1.5" opacity="0.9" />
          <polygon points="-25,0 0,-14 25,0 0,14" fill="#a3e635" opacity="0.6" />
        </g>
      )}

      {/* 5. ÁRVORES (Palmeiras Tropicais) */}
      {type === 'arvores' && (
        <g>
          {/* Drop shadows */}
          <ellipse cx="-15" cy="5" rx="10" ry="4" fill="#0f172a" opacity="0.25" />
          <ellipse cx="15" cy="8" rx="10" ry="4" fill="#0f172a" opacity="0.25" />
          {/* Palm 1 */}
          <path d="M -15 5 Q -10 -15 -14 -32" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <ellipse cx="-24" cy="-34" rx="12" ry="5" fill="#15803d" transform="rotate(-25, -24, -34)" />
          <ellipse cx="-4" cy="-32" rx="12" ry="5" fill="#16a34a" transform="rotate(25, -4, -32)" />
          <ellipse cx="-14" cy="-38" rx="12" ry="5" fill="#22c55e" />
          {/* Palm 2 */}
          <path d="M 15 8 Q 20 -12 16 -28" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="8" cy="-30" rx="10" ry="4" fill="#15803d" transform="rotate(-25, 8, -30)" />
          <ellipse cx="24" cy="-28" rx="10" ry="4" fill="#16a34a" transform="rotate(25, 24, -28)" />
          <ellipse cx="16" cy="-34" rx="10" ry="4" fill="#22c55e" />
        </g>
      )}

      {/* 6. CANTEIROS */}
      {type === 'canteiros' && (
        <g>
          <polygon points="-30,0 0,-15 30,0 0,15" fill="#166534" stroke="#14532d" strokeWidth="1.5" />
          <polygon points="-25,-3 0,-16 25,-3 0,10" fill="#22c55e" opacity="0.7" />
        </g>
      )}

      {/* 7. BANCOS */}
      {type === 'bancos' && (
        <g>
          <ellipse cx="0" cy="5" rx="20" ry="8" fill="#0f172a" opacity="0.2" />
          {/* Wooden Bench */}
          <polygon points="-18,-5 18,-5 18,-1 -18,-1" fill="#92400e" stroke="#451a03" strokeWidth="1" />
          <polygon points="-18,-12 18,-12 18,-8 -18,-8" fill="#b45309" stroke="#451a03" strokeWidth="1" />
          {/* Metal legs */}
          <line x1="-14" y1="-1" x2="-14" y2="5" stroke="#334155" strokeWidth="2" />
          <line x1="14" y1="-1" x2="14" y2="5" stroke="#334155" strokeWidth="2" />
        </g>
      )}

      {/* 8. CAMINHO PEDESTRES */}
      {type === 'caminho_pedestres' && (
        <g>
          <polygon points="-45,-5 45,-5 35,10 -55,10" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="-35" y1="2" x2="25" y2="2" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
        </g>
      )}

      {/* 9. CALÇADA */}
      {type === 'calcada' && (
        <g>
          <polygon points="-50,-8 50,-8 40,8 -60,8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
          <line x1="-50" y1="-8" x2="-60" y2="8" stroke="#475569" strokeWidth="2" />
        </g>
      )}

      {/* 10. FONTE */}
      {type === 'fonte' && (
        <g>
          {/* Base Pool */}
          <ellipse cx="0" cy="4" rx="28" ry="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <ellipse cx="0" cy="2" rx="18" ry="10" fill="#7dd3fc" />
          {/* Water Spout */}
          <line x1="0" y1="2" x2="0" y2="-16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="-18" r="3.5" fill="#ffffff" />
        </g>
      )}

      {/* 11. ESPELHO D'ÁGUA */}
      {type === 'espelho_dagua' && (
        <g>
          <polygon points="-40,0 0,-20 40,0 0,20" fill="#0369a1" stroke="#0284c7" strokeWidth="2" />
          <polygon points="-32,0 0,-16 32,0 0,16" fill="#38bdf8" opacity="0.8" />
        </g>
      )}

      {/* 12. ÁREA DE DESCANSO (Gazebo / Pergolado) */}
      {type === 'area_descanso' && (
        <g>
          <ellipse cx="0" cy="8" rx="28" ry="14" fill="#0f172a" opacity="0.25" />
          {/* Wooden Deck */}
          <polygon points="-28,0 0,-14 28,0 0,14" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          {/* 4 Posts */}
          <line x1="-20" y1="0" x2="-20" y2="-20" stroke="#92400e" strokeWidth="2.5" />
          <line x1="20" y1="0" x2="20" y2="-20" stroke="#92400e" strokeWidth="2.5" />
          <line x1="0" y1="-10" x2="0" y2="-30" stroke="#92400e" strokeWidth="2.5" />
          <line x1="0" y1="10" x2="0" y2="-10" stroke="#92400e" strokeWidth="2.5" />
          {/* Canvas Roof Pergola */}
          <polygon points="-24,-20 0,-32 24,-20 0,-8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        </g>
      )}

      {/* 13. ESTACIONAMENTO */}
      {type === 'estacionamento' && (
        <g>
          <polygon points="-50,-10 50,-10 40,25 -60,25" fill="#334155" stroke="#475569" strokeWidth="2" />
          {/* Parking Bay Lines */}
          {[-40, -20, 0, 20, 40].map((px, i) => (
            <line key={i} x1={px} y1="-10" x2={px - 6} y2="25" stroke="#facc15" strokeWidth="1.5" />
          ))}
          {/* Mini parked cars */}
          <rect x="-34" y="-2" width="10" height="18" rx="2" fill="#ef4444" transform="rotate(-15, -34, -2)" />
          <rect x="6" y="-2" width="10" height="18" rx="2" fill="#3b82f6" transform="rotate(-15, 6, -2)" />
        </g>
      )}

      {/* 14. BICICLETÁRIO */}
      {type === 'bicicletario' && (
        <g>
          <polygon points="-25,-5 25,-5 20,12 -30,12" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          {/* Bike racks */}
          {[-15, -5, 5, 15].map((bx, i) => (
            <g key={i}>
              <line x1={bx} y1="-3" x2={bx} y2="-12" stroke="#059669" strokeWidth="2" />
              <circle cx={bx} cy="-12" r="2" fill="#059669" />
            </g>
          ))}
        </g>
      )}

      {/* 15. FAIXA DE PEDESTRES */}
      {type === 'faixa_pedestres' && (
        <g>
          {[-20, -10, 0, 10, 20].map((fx, i) => (
            <polygon
              key={i}
              points={`${fx},-10 ${fx+6},-10 ${fx+2},12 ${fx-4},12`}
              fill="#ffffff"
              opacity="0.95"
            />
          ))}
        </g>
      )}

      {/* 16. ILUMINAÇÃO URBANA (Postes) */}
      {type === 'iluminacao_urbana' && (
        <g>
          {/* Drop shadow */}
          <ellipse cx="0" cy="5" rx="6" ry="3" fill="#0f172a" opacity="0.3" />
          {/* Post */}
          <line x1="0" y1="5" x2="0" y2="-32" stroke="#1e293b" strokeWidth="2.5" />
          {/* Lantern Head */}
          <ellipse cx="0" cy="-33" rx="5" ry="3" fill="#fef08a" stroke="#1e293b" strokeWidth="1" />
          <circle cx="0" cy="-33" r="10" fill="#fef08a" opacity="0.3" />
        </g>
      )}

      {/* 17. PONTO DE ENCONTRO */}
      {type === 'ponto_encontro' && (
        <g>
          <ellipse cx="0" cy="5" rx="8" ry="3" fill="#0f172a" opacity="0.3" />
          <line x1="0" y1="5" x2="0" y2="-26" stroke="#475569" strokeWidth="2.5" />
          {/* Green Totem Board */}
          <rect x="-10" y="-38" width="20" height="14" rx="2" fill="#16a34a" stroke="#ffffff" strokeWidth="1" />
          <text x="0" y="-28" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
            PE-01
          </text>
        </g>
      )}
    </g>
  );
};
