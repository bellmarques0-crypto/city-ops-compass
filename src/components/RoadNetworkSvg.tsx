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
  onAddPointToRoad?: ((roadId: string, pointIndex: number, x: number, y: number) => void) | undefined;
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

  const styleOf = (road: RoadSegment) => {
    const pts = getRoadPoints(road);
    const pathD = getPointsPathD(pts);
    const pavingColor =
      road.color || (
        road.paving === 'paralelepipedo' ? '#475569' :
        road.paving === 'concreto' ? '#64748b' : '#334155'
      );
    const roadWidth = Math.max(16, road.width || 48);
    const sidewalkWidth = road.hasSidewalk ? (road.sidewalkWidth || 8) : 0;
    const totalPavedWidth = roadWidth + sidewalkWidth * 2;
    const linejoin: 'miter' | 'round' | 'bevel' =
      road.cornerType === 'arredondada' ? 'round' :
      road.cornerType === 'bisel' ? 'bevel' : 'miter';
    const linecap: 'butt' | 'round' | 'square' =
      road.capType === 'arredondada' ? 'round' :
      road.capType === 'quadrada' ? 'square' : 'butt';
    let length = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1]!, b = pts[i]!;
      length += Math.hypot(b.x - a.x, b.y - a.y);
    }
    return { pts, pathD, pavingColor, roadWidth, sidewalkWidth, totalPavedWidth, linejoin, linecap, length };
  };

  const styled = roads.map((road) => ({ road, ...styleOf(road) }));

  // Detect crossings between segments of different roads
  type Crossing = { x: number; y: number; color: string; size: number; dirs: { angle: number; half: number; width: number }[] };
  const crossings: Crossing[] = [];
  for (let i = 0; i < styled.length; i++) {
    for (let j = i + 1; j < styled.length; j++) {
      const A = styled[i]!, B = styled[j]!;
      for (let a = 0; a < A.pts.length - 1; a++) {
        for (let b = 0; b < B.pts.length - 1; b++) {
          const p1 = A.pts[a]!, p2 = A.pts[a + 1]!, p3 = B.pts[b]!, p4 = B.pts[b + 1]!;
          const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
          if (Math.abs(d) < 1e-6) continue;
          const t = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
          const u = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
          if (t < 0 || t > 1 || u < 0 || u > 1) continue;
          const angA = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const angB = Math.atan2(p4.y - p3.y, p4.x - p3.x);
          const sin = Math.max(0.3, Math.abs(Math.sin(angA - angB)));
          crossings.push({
            x: p1.x + t * (p2.x - p1.x),
            y: p1.y + t * (p2.y - p1.y),
            color: A.pavingColor,
            size: Math.max(A.roadWidth, B.roadWidth),
            dirs: [
              { angle: angA, half: B.roadWidth / 2 / sin, width: A.roadWidth },
              { angle: angB, half: A.roadWidth / 2 / sin, width: B.roadWidth },
            ],
          });
        }
      }
    }
  }

  const CAR_TYPES = [
    { body: '#ef4444', len: 18, wid: 10 },
    { body: '#facc15', len: 18, wid: 10, taxi: true },
    { body: '#3b82f6', len: 18, wid: 10 },
    { body: '#f97316', len: 34, wid: 12, bus: true },
    { body: '#f8fafc', len: 24, wid: 11, truck: true },
    { body: '#10b981', len: 18, wid: 10 },
  ];
  const SHIRTS = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

  const renderCar = (type: typeof CAR_TYPES[number], lane: number) => (
    <g transform={`translate(0, ${lane})`}>
      <rect x={-type.len / 2 + 1} y={-type.wid / 2 + 2} width={type.len} height={type.wid} rx="3" fill="#020617" opacity="0.3" />
      <rect x={-type.len / 2} y={-type.wid / 2} width={type.len} height={type.wid} rx={type.bus ? 2 : 3.5} fill={type.body} stroke="#0f172a" strokeWidth="0.6" />
      {type.bus ? (
        Array.from({ length: 5 }, (_, i) => <rect key={i} x={-type.len / 2 + 3 + i * 6} y={-type.wid / 2 + 1.5} width="4" height={type.wid - 3} rx="1" fill="#bae6fd" opacity="0.85" />)
      ) : type.truck ? (
        <rect x={type.len / 2 - 7} y={-type.wid / 2 + 1} width="6" height={type.wid - 2} rx="1.5" fill="#1d4ed8" />
      ) : (
        <rect x={-type.len / 2 + 5} y={-type.wid / 2 + 1.5} width={type.len - 9} height={type.wid - 3} rx="2" fill="#0f172a" opacity="0.55" />
      )}
      {type.taxi && <rect x="-2" y="-2" width="4" height="4" fill="#ffffff" stroke="#0f172a" strokeWidth="0.5" />}
      <circle cx={type.len / 2} cy={-type.wid / 2 + 2} r="1.6" fill="#fef9c3" />
      <circle cx={type.len / 2} cy={type.wid / 2 - 2} r="1.6" fill="#fef9c3" />
      <circle cx={-type.len / 2} cy={-type.wid / 2 + 2} r="1.2" fill="#dc2626" />
      <circle cx={-type.len / 2} cy={type.wid / 2 - 2} r="1.2" fill="#dc2626" />
    </g>
  );

  const renderPerson = (shirt: string, side: number) => (
    <g transform={`translate(0, ${side})`}>
      <ellipse cx="0" cy="1" rx="3" ry="1.5" fill="#020617" opacity="0.3" />
      <g transform="rotate(90)">
        <rect x="-2.2" y="-9" width="4.4" height="7" rx="2" fill={shirt} />
        <circle cx="0" cy="-11" r="2.2" fill="#fcd9b6" stroke="#78350f" strokeWidth="0.4" />
      </g>
    </g>
  );

  return (
    <g id="road-network">
      {/* Unified paving layers so crossing roads merge instead of cutting each other */}
      <g clipPath="url(#island-surface-clip)" pointerEvents="none">
        {styled.filter((r) => r.road.hasSidewalk).map(({ road, pathD, totalPavedWidth, linejoin, linecap }) => (
          <g key={`sw-${road.id}`}>
            <path d={pathD} fill="none" stroke="#94a3b8" strokeWidth={totalPavedWidth + 2} strokeLinecap={linecap} strokeLinejoin={linejoin} strokeMiterlimit={5} opacity="0.5" />
            <path d={pathD} fill="none" stroke="#cbd5e1" strokeWidth={totalPavedWidth} strokeLinecap={linecap} strokeLinejoin={linejoin} strokeMiterlimit={5} />
          </g>
        ))}
        {styled.map(({ road, pathD, pavingColor, roadWidth, linejoin, linecap }) => (
          <path key={`as-${road.id}`} d={pathD} fill="none" stroke={pavingColor} strokeWidth={roadWidth} strokeLinecap={linecap} strokeLinejoin={linejoin} strokeMiterlimit={5} />
        ))}
      </g>

      {styled.map(({ road, pts, pathD, roadWidth, linejoin, linecap }) => {
        return (
          <g key={`mk-${road.id}`} pointerEvents="none">
            <g clipPath="url(#island-surface-clip)">
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
                    if (!p2) return null;
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

          </g>
        );
      })}

      {/* Intersection patches with automatic zebra crossings */}
      <g clipPath="url(#island-surface-clip)" pointerEvents="none">
        {crossings.map((c, ci) => (
          <g key={`x-${ci}`} transform={`translate(${c.x}, ${c.y})`}>
            {c.dirs.map((d, di) => (
              <rect key={`p-${di}`} x={-d.half} y={-d.width / 2} width={d.half * 2} height={d.width} fill={c.color} transform={`rotate(${(d.angle * 180) / Math.PI})`} />
            ))}
            {c.dirs.map((d, di) => (
              <g key={`z-${di}`} transform={`rotate(${(d.angle * 180) / Math.PI})`}>
                {[-1, 1].map((side) => (
                  <g key={side} transform={`translate(${side * (d.half + 7)}, 0)`}>
                    {Array.from({ length: Math.max(3, Math.floor(d.width / 7)) }, () => Math.max(3, Math.floor(d.width / 7))).map((n, k) => (
                      <rect key={k} x="-4" y={-d.width / 2 + 2 + k * ((d.width - 4) / n)} width="8" height={(d.width - 4) / n - 2.5} fill="#ffffff" opacity="0.92" rx="0.5" />
                    ))}
                  </g>
                ))}
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* Animated traffic and pedestrians */}
      <g clipPath="url(#island-surface-clip)" pointerEvents="none">
        {styled.map(({ road, pathD, roadWidth, sidewalkWidth, length }, ri) => {
          if (length < 60) return null;
          const carCount = Math.min(4, Math.max(1, Math.floor(length / 220)));
          const lane = Math.max(4, roadWidth / 4);
          const carDur = length / 55;
          const walkDur = length / 12;
          return (
            <g key={`tr-${road.id}`}>
              {Array.from({ length: carCount * 2 }, (_, i) => {
                const reverse = i % 2 === 1;
                const type = CAR_TYPES[(ri * 3 + i) % CAR_TYPES.length]!;
                return (
                  <g key={`car-${i}`}>
                    {renderCar(type, lane)}
                    <animateMotion dur={`${carDur}s`} begin={`-${((carDur * (i + ri * 0.37)) / (carCount * 2)).toFixed(2)}s`} repeatCount="indefinite" path={pathD} rotate={reverse ? 'auto-reverse' : 'auto'} {...(reverse ? { keyPoints: '1;0', keyTimes: '0;1', calcMode: 'linear' } : {})} />
                  </g>
                );
              })}
              {sidewalkWidth > 0 && Array.from({ length: Math.min(6, Math.max(2, Math.floor(length / 120))) }, (_, i) => {
                const reverse = i % 2 === 1;
                const side = (roadWidth / 2 + sidewalkWidth / 2) * (i % 4 < 2 ? 1 : -1) * (reverse ? -1 : 1);
                return (
                  <g key={`ped-${i}`}>
                    {renderPerson(SHIRTS[(ri + i) % SHIRTS.length]!, side)}
                    <animateMotion dur={`${walkDur}s`} begin={`-${((walkDur * i) / 6 + ri).toFixed(2)}s`} repeatCount="indefinite" path={pathD} rotate={reverse ? 'auto-reverse' : 'auto'} {...(reverse ? { keyPoints: '1;0', keyTimes: '0;1', calcMode: 'linear' } : {})} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>

      {/* Interaction layer (selection, dragging, control points) */}
      {styled.map(({ road, pts, pathD, roadWidth, totalPavedWidth, linejoin, linecap }) => {
        const isSelected = selectedRoadId === road.id;
        return (
          <g
            key={road.id}
            onClick={(e) => {
              if (isEditMode && onSelectRoad) {
                e.stopPropagation();
                onSelectRoad(road);
              }
            }}
            onMouseDown={(e) => {
              if (isEditMode && isSelected && !road.locked && onStartDragRoadPoint) {
                e.stopPropagation();
                onStartDragRoadPoint(e, road.id, -1);
              }
            }}
            className={isEditMode ? (isSelected ? 'cursor-move' : 'cursor-pointer') : 'pointer-events-none'}
          >
            <path d={pathD} fill="none" stroke="transparent" strokeWidth={totalPavedWidth} strokeLinecap={linecap} strokeLinejoin={linejoin} pointerEvents="stroke" />

            {isSelected && isEditMode && (
              <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={roadWidth + 14} strokeDasharray="8 6" strokeLinecap={linecap} strokeLinejoin={linejoin} strokeMiterlimit={5} opacity="0.75" />
            )}

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
                        if (onStartDragRoadPoint) onStartDragRoadPoint(e, road.id, pIdx);
                      }}
                      className="cursor-move group"
                    >
                      {isEnd && <circle cx="0" cy="0" r="16" fill="#3b82f6" opacity="0.3" className="animate-ping" />}
                      <circle cx="0" cy="0" r={isEnd ? 11 : 8.5} fill={isEnd ? '#2563eb' : '#059669'} stroke="#ffffff" strokeWidth="2.5" filter="url(#shadowDiorama)" className="group-hover:scale-110 transition-transform" />
                      <text x="0" y={isEnd ? 3.5 : 3} fill="#ffffff" fontSize={isEnd ? '10' : '8.5'} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                        {isEnd ? '⇄' : (pIdx + 1)}
                      </text>
                      {isEnd && (
                        <g transform="translate(0, -22)" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <rect x="-42" y="-10" width="84" height="18" rx="4" fill="#0f172a" opacity="0.9" />
                          <text x="0" y="2" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Comprimento ⇄</text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {pts.slice(0, -1).map((p1, idx) => {
                  const p2 = pts[idx + 1];
                  if (!p2) return null;
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  return (
                    <g
                      key={`add-pt-${idx}`}
                      transform={`translate(${midX}, ${midY})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddPointToRoad) onAddPointToRoad(road.id, idx + 1, midX, midY);
                      }}
                      className="cursor-pointer group"
                    >
                      <circle cx="0" cy="0" r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="group-hover:scale-125 transition-transform" />
                      <text x="0" y="3.5" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">+</text>
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
