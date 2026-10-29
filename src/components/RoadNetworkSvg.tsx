/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoadSegment, RoadPoint, RoadMarkingType } from '../types/city';

interface RoadNetworkSvgProps {
  roads: RoadSegment[];
  selectedRoadId: string | null;
  isEditMode: boolean;
  onSelectRoad?: (road: RoadSegment) => void;
  onStartDragRoadPoint?: (e: React.MouseEvent, roadId: string, pointIndex: number) => void;
  onAddPointToRoad?: (roadId: string, pointIndex: number, x: number, y: number) => void;
}

export const RoadNetworkSvg: React.FC<RoadNetworkSvgProps> = ({
  roads,
  selectedRoadId,
  isEditMode,
  onSelectRoad,
  onStartDragRoadPoint,
  onAddPointToRoad
}) => {
  // Ensure road points array is valid
  const getRoadPoints = (road: RoadSegment): RoadPoint[] => {
    if (road.points && road.points.length >= 2) {
      return road.points;
    }
    if (road.x1 !== undefined && road.y1 !== undefined && road.x2 !== undefined && road.y2 !== undefined) {
      return [{ x: road.x1, y: road.y1 }, { x: road.x2, y: road.y2 }];
    }
    return [{ x: 300, y: 500 }, { x: 900, y: 700 }];
  };

  const getPointsPathD = (pts: RoadPoint[]): string => {
    if (pts.length < 2) return '';
    return pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  };

  return (
    <g id="road-network">
      {roads.map((road) => {
        const pts = getRoadPoints(road);
        const pathD = getPointsPathD(pts);
        const isSelected = selectedRoadId === road.id;

        // Paving colors
        const pavingColor = 
          road.color || (
            road.paving === 'paralelepipedo' ? '#475569' :
            road.paving === 'concreto' ? '#64748b' : '#334155'
          );

        const roadWidth = Math.max(16, road.width || 48);
        const sidewalkWidth = road.hasSidewalk ? (road.sidewalkWidth || 8) : 0;
        const totalPavedWidth = roadWidth + sidewalkWidth * 2;

        // Quinas: sharp miter corners by default ('quina' -> 'miter', 'reta' -> 'butt')
        const linejoin: 'miter' | 'round' | 'bevel' = 
          road.cornerType === 'arredondada' ? 'round' :
          road.cornerType === 'bisel' ? 'bevel' : 'miter';

        const linecap: 'butt' | 'round' | 'square' = 
          road.capType === 'arredondada' ? 'round' :
          road.capType === 'quadrada' ? 'square' : 'butt';

        return (
          <g
            key={road.id}
            onClick={(e) => {
              if (isEditMode && onSelectRoad) {
                e.stopPropagation();
                onSelectRoad(road);
              }
            }}
            className={isEditMode ? 'cursor-pointer' : 'pointer-events-none'}
          >
            {/* Paved road geometry clipped to the island diamond perimeter */}
            <g clipPath="url(#island-surface-clip)">
              {/* 1. Sidewalk Border Underlay (Calçadas com guia e quinas de concreto) */}
              {road.hasSidewalk && (
                <>
                  {/* Exterior curb edge */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={totalPavedWidth + 2}
                    strokeLinecap={linecap}
                    strokeLinejoin={linejoin}
                    strokeMiterlimit={5}
                    opacity="0.5"
                  />
                  {/* Sidewalk surface */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth={totalPavedWidth}
                    strokeLinecap={linecap}
                    strokeLinejoin={linejoin}
                    strokeMiterlimit={5}
                    opacity="0.95"
                  />
                </>
              )}

              {/* 2. Main Paved Roadway Surface (Pista Asfáltica com Quinas Vivas) */}
              <path
                d={pathD}
                fill="none"
                stroke={pavingColor}
                strokeWidth={roadWidth}
                strokeLinecap={linecap}
                strokeLinejoin={linejoin}
                strokeMiterlimit={5}
              />

              {/* 3. White Shoulder Lines (Linhas laterais brancas) */}
              <path
                d={pathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth={roadWidth}
                strokeDasharray={`2 ${roadWidth}`}
                strokeLinecap={linecap}
                strokeLinejoin={linejoin}
                strokeMiterlimit={5}
                opacity="0.25"
              />

              {/* 4. Center Lane Markings (Faixa Central Editável) */}
              {road.markingType !== 'nenhuma' && (
                <>
                  {road.markingType === 'amarela_tracejada' && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="3.5"
                      strokeDasharray="18 14"
                      strokeLinecap="butt"
                      strokeLinejoin={linejoin}
                      strokeMiterlimit={5}
                    />
                  )}

                  {road.markingType === 'branca_tracejada' && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeDasharray="14 10"
                      strokeLinecap="butt"
                      strokeLinejoin={linejoin}
                      strokeMiterlimit={5}
                      opacity="0.85"
                    />
                  )}

                  {road.markingType === 'continua' && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap={linecap}
                      strokeLinejoin={linejoin}
                      strokeMiterlimit={5}
                      opacity="0.9"
                    />
                  )}

                  {road.markingType === 'dupla_amarela' && (
                    <>
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth="2"
                        strokeLinecap={linecap}
                        strokeLinejoin={linejoin}
                        strokeMiterlimit={5}
                        transform="translate(-2, -1)"
                      />
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth="2"
                        strokeLinecap={linecap}
                        strokeLinejoin={linejoin}
                        strokeMiterlimit={5}
                        transform="translate(2, 1)"
                      />
                    </>
                  )}
                </>
              )}

              {/* 5. Crosswalks (Faixas de pedestre decorativas nos pontos médios) */}
              {road.hasCrosswalk && pts.length >= 2 && (
                <g opacity="0.95">
                  {pts.slice(0, -1).map((p1, idx) => {
                    const p2 = pts[idx + 1];
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;
                    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

                    return (
                      <g key={`cw-${idx}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
                        {[-18, -9, 0, 9, 18].map((offset, sIdx) => (
                          <rect
                            key={sIdx}
                            x="-12"
                            y={offset - 2.5}
                            width="24"
                            height="5"
                            fill="#ffffff"
                            rx="1"
                          />
                        ))}
                      </g>
                    );
                  })}
                </g>
              )}
            </g>

            {/* 6. Selection Highlight Outline */}
            {isSelected && isEditMode && (
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth={roadWidth + 14}
                strokeDasharray="8 6"
                strokeLinecap={linecap}
                strokeLinejoin={linejoin}
                strokeMiterlimit={5}
                opacity="0.75"
              />
            )}

            {/* 7. Interactive Control Point Handles (Only in Edit Mode when selected) */}
            {isSelected && isEditMode && (
              <g className="select-none">
                {pts.map((pt, pIdx) => {
                  const isEnd = pIdx === 0 || pIdx === pts.length - 1;
                  return (
                    <g
                      key={`handle-${pIdx}`}
                      transform={`translate(${pt.x}, ${pt.y})`}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        if (onStartDragRoadPoint) {
                          onStartDragRoadPoint(e, road.id, pIdx);
                        }
                      }}
                      className="cursor-move group"
                    >
                      {/* Pulse ring for end points */}
                      {isEnd && (
                        <circle cx="0" cy="0" r="16" fill="#3b82f6" opacity="0.3" className="animate-ping" />
                      )}
                      {/* Outer handle pin */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isEnd ? 11 : 8.5}
                        fill={isEnd ? '#2563eb' : '#059669'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        filter="url(#shadowDiorama)"
                        className="group-hover:scale-110 transition-transform"
                      />
                      {/* Inner label / Stretch icon */}
                      <text
                        x="0"
                        y={isEnd ? 3.5 : 3}
                        fill="#ffffff"
                        fontSize={isEnd ? '10' : '8.5'}
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {isEnd ? '⇄' : (pIdx + 1)}
                      </text>

                      {/* Tooltip badge on hover for end handles */}
                      {isEnd && (
                        <g transform="translate(0, -22)" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <rect x="-42" y="-10" width="84" height="18" rx="4" fill="#0f172a" opacity="0.9" />
                          <text x="0" y="2" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                            Comprimento ⇄
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Add Midpoint Control Handle (+) */}
                {pts.slice(0, -1).map((p1, idx) => {
                  const p2 = pts[idx + 1];
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;

                  return (
                    <g
                      key={`add-pt-${idx}`}
                      transform={`translate(${midX}, ${midY})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddPointToRoad) {
                          onAddPointToRoad(road.id, idx + 1, midX, midY);
                        }
                      }}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r="8"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="group-hover:scale-125 transition-transform"
                      />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                        +
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
