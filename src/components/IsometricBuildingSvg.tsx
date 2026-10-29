/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Building, BuildingRoofType } from '../types/city';

interface IsometricBuildingSvgProps {
  building: Building;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  isDragging?: boolean;
  isInvalidOverlap?: boolean;
  isEditMode?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onStartResize?: (e: React.MouseEvent, buildingId: string, handleType: 'width' | 'depth' | 'height') => void;
}

export const IsometricBuildingSvg: React.FC<IsometricBuildingSvgProps> = ({
  building,
  x = building.isoX,
  y = building.isoY,
  scale = building.scale || 1,
  rotation = building.rotation || 0,
  isSelected = false,
  isHovered = false,
  isDragging = false,
  isInvalidOverlap = false,
  isEditMode = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onStartResize
}) => {
  const model = building.model || 'corporate-hotel';
  const roofType: BuildingRoofType = building.roofType || (
    model === 'corporate-hotel' ? 'pool' :
    model === 'glass-tower' ? 'antennas' :
    model === 'neon-billboard' ? 'billboard' :
    model === 'classic-auditorium' ? 'cornice' :
    model === 'executive-palace' ? 'cornice' : 'standard'
  );

  const primaryColor = building.color;
  const secondaryColor = building.secondaryColor || building.color;

  // Real geometric parameters
  const w = Math.max(70, Math.min(260, building.customWidth || 140)) / 2;
  const d = Math.max(50, Math.min(220, building.customDepth || 100)) / 2;
  const h = Math.max(50, Math.min(260, building.customHeight || 110));

  // Shading helper
  const shadeColor = (hex: string, percent: number) => {
    let num = parseInt(hex.replace('#', ''), 16);
    if (isNaN(num)) num = 0x2563eb;
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const leftWallColor = shadeColor(primaryColor, -40);
  const rightWallColor = primaryColor;
  const roofColor = shadeColor(primaryColor, 35);
  const isInactive = building.status === 'inativo';

  // Exact 4/7 slope matching the island diamond and grid
  const k = 400 / 700; // ~0.5714

  // Centered isometric base vertices (Ground level y = 0)
  const gFrontX = (d - w) * 0.5;
  const gFrontY = (w + d) * k * 0.5;

  const gLeftX = -w;
  const gLeftY = (d - w) * k * 0.5;

  const gRightX = d;
  const gRightY = (w - d) * k * 0.5;

  const gBackX = (w - d) * 0.5;
  const gBackY = -(w + d) * k * 0.5;

  // Foundation Plinth pad (8px margin around building)
  const padW = w + 10;
  const padD = d + 10;
  const curbHeight = 6;

  const plinthFrontX = (padD - padW) * 0.5;
  const plinthFrontY = (padW + padD) * k * 0.5;

  const plinthLeftX = -padW;
  const plinthLeftY = (padD - padW) * k * 0.5;

  const plinthRightX = padD;
  const plinthRightY = (padW - padD) * k * 0.5;

  const plinthBackX = (padW - padD) * 0.5;
  const plinthBackY = -(padW + padD) * k * 0.5;

  // Roof vertices (elevated by h)
  const rFrontX = gFrontX;
  const rFrontY = gFrontY - h;

  const rLeftX = gLeftX;
  const rLeftY = gLeftY - h;

  const rRightX = gRightX;
  const rRightY = gRightY - h;

  const rBackX = gBackX;
  const rBackY = gBackY - h;

  // Number of window rows
  const windowRows = Math.max(2, Math.floor(h / 24));

  // Determine if building should render with curved architecture
  const isCurvedStyle = building.cornerStyle === 'curvo' || building.isCurved || model === 'soundstage-hangar' || model === 'corporate-hotel';

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotation})`}
      className={`cursor-pointer transition-transform duration-100 ${
        isDragging ? 'opacity-85 pointer-events-none' : ''
      } ${isInactive ? 'opacity-65 grayscale-[0.6]' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 1. EXTENDED AMBIENT CONTACT OCCLUSION SHADOW (Ground Contact) */}
      <ellipse
        cx={(d - w) * 0.3}
        cy={(w + d) * k * 0.4 + 4}
        rx={padW + 18}
        ry={(padW + padD) * k * 0.55}
        fill="#020617"
        opacity={isHovered || isSelected ? 0.38 : 0.28}
        filter="url(#shadowDiorama)"
      />

      {/* 2. RAISED CONCRETE FOUNDATION SLAB (Calçada / Base de Encaixe no Chão) */}
      <g id="building-foundation-slab">
        {/* Left curb face */}
        <polygon
          points={`
            ${plinthLeftX},${plinthLeftY} 
            ${plinthFrontX},${plinthFrontY} 
            ${plinthFrontX},${plinthFrontY + curbHeight} 
            ${plinthLeftX},${plinthLeftY + curbHeight}
          `}
          fill="#64748b"
          stroke="#475569"
          strokeWidth="0.8"
        />

        {/* Right curb face */}
        <polygon
          points={`
            ${plinthFrontX},${plinthFrontY} 
            ${plinthRightX},${plinthRightY} 
            ${plinthRightX},${plinthRightY + curbHeight} 
            ${plinthFrontX},${plinthFrontY + curbHeight}
          `}
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />

        {/* Top walking surface of the foundation pad */}
        <polygon
          points={`
            ${plinthLeftX},${plinthLeftY} 
            ${plinthBackX},${plinthBackY} 
            ${plinthRightX},${plinthRightY} 
            ${plinthFrontX},${plinthFrontY}
          `}
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1.2"
        />

        {/* Front Entrance Step / Doorway mat */}
        <polygon
          points={`
            ${gFrontX - 16},${gFrontY - 2} 
            ${gFrontX + 16},${gFrontY + 2} 
            ${gFrontX + 16},${gFrontY + curbHeight + 2} 
            ${gFrontX - 16},${gFrontY + curbHeight - 2}
          `}
          fill="#334155"
        />
      </g>

      {/* 3. Collision / Overlap Warning Glow */}
      {isInvalidOverlap && (
        <polygon
          points={`
            ${plinthLeftX - 6},${plinthLeftY} 
            ${plinthBackX},${plinthBackY - 4} 
            ${plinthRightX + 6},${plinthRightY} 
            ${plinthFrontX},${plinthFrontY + 6}
          `}
          fill="#ef4444"
          opacity="0.6"
          className="animate-pulse"
        />
      )}

      {/* 4. Selection Outline */}
      {isSelected && isEditMode && (
        <polygon
          points={`
            ${plinthLeftX - 4},${plinthLeftY} 
            ${plinthFrontX},${plinthFrontY + 4} 
            ${rFrontX},${rFrontY} 
            ${rRightX + 4},${rRightY} 
            ${rBackX},${rBackY - 4} 
            ${rLeftX - 4},${rLeftY}
          `}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />
      )}

      {/* 5. ARCHITECTURAL BUILDING BODY */}

      {/* === VARIANT A: CURVED SOUNDSTAGE HANGAR (Curved barrel vault arch) === */}
      {model === 'soundstage-hangar' ? (
        <g id="curved-hangar">
          {/* Left Wall */}
          <polygon
            points={`
              ${gLeftX},${gLeftY} 
              ${gFrontX},${gFrontY} 
              ${rFrontX},${rFrontY} 
              ${rLeftX},${rLeftY}
            `}
            fill={leftWallColor}
            stroke={leftWallColor}
            strokeWidth="1"
          />

          {/* Curved Arched Front Facade */}
          <path
            d={`
              M ${gFrontX} ${gFrontY} 
              L ${gRightX} ${gRightY} 
              L ${rRightX} ${rRightY} 
              Q ${(rFrontX + rRightX) / 2} ${rFrontY - 28} ${rFrontX} ${rFrontY} 
              Z
            `}
            fill={rightWallColor}
            stroke={rightWallColor}
            strokeWidth="1"
          />

          {/* Curved Barrel Roof with cylindrical highlight */}
          <path
            d={`
              M ${rLeftX} ${rLeftY} 
              Q ${(rLeftX + rFrontX) / 2} ${rLeftY - 28} ${rFrontX} ${rFrontY} 
              L ${(rFrontX + rRightX) / 2} ${rFrontY - 28} 
              L ${(rBackX + rRightX) / 2} ${rBackY - 28} 
              L ${rLeftX} ${rLeftY} 
              Z
            `}
            fill={roofColor}
            opacity="0.95"
          />

          {/* Barrel Vault Rib Lines */}
          <path
            d={`
              M ${(rLeftX + rFrontX) * 0.75} ${(rLeftY + rFrontY) * 0.75 - 15}
              L ${(rBackX + rRightX) * 0.75} ${(rBackY + rRightY) * 0.75 - 15}
            `}
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Large Curved Stage Door */}
          <path
            d={`
              M ${gFrontX + 8} ${gFrontY - 2} 
              L ${gRightX - 8} ${gRightY - 2} 
              L ${gRightX - 8} ${gRightY - h * 0.5} 
              Q ${(gFrontX + gRightX) / 2} ${gFrontY - h * 0.65} ${gFrontX + 8} ${gFrontY - h * 0.5} 
              Z
            `}
            fill="#1e293b"
            stroke="#f97316"
            strokeWidth="1.5"
          />
          <text
            x={(gFrontX + gRightX) / 2}
            y={(gFrontY + gRightY) / 2 - h * 0.25}
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            STAGE
          </text>
        </g>
      ) : (
        /* === VARIANT B: STANDARD & CURVED RESORT / TOWERS / OFFICES === */
        <g id="building-walls">
          {/* Left Wall (Face Sombreada) */}
          <polygon
            points={`
              ${gLeftX},${gLeftY} 
              ${gFrontX},${gFrontY} 
              ${rFrontX},${rFrontY} 
              ${rLeftX},${rLeftY}
            `}
            fill={leftWallColor}
            stroke={leftWallColor}
            strokeWidth="1"
          />

          {/* Right Wall (Face Iluminada) */}
          <polygon
            points={`
              ${gFrontX},${gFrontY} 
              ${gRightX},${gRightY} 
              ${rRightX},${rRightY} 
              ${rFrontX},${rFrontY}
            `}
            fill={rightWallColor}
            stroke={rightWallColor}
            strokeWidth="1"
          />

          {/* Optional Curved Corner Bevel (when curved style is enabled) */}
          {isCurvedStyle && (
            <path
              d={`
                M ${gFrontX - 8} ${gFrontY - 4} 
                Q ${gFrontX} ${gFrontY + 4} ${gFrontX + 8} ${gFrontY + 2} 
                L ${rFrontX + 8} ${rFrontY + 2} 
                Q ${rFrontX} ${rFrontY - 6} ${rFrontX - 8} ${rFrontY - 4} 
                Z
              `}
              fill={shadeColor(primaryColor, -15)}
              opacity="0.85"
            />
          )}

          {/* Top Roof Plane */}
          <polygon
            points={`
              ${rLeftX},${rLeftY} 
              ${rBackX},${rBackY} 
              ${rRightX},${rRightY} 
              ${rFrontX},${rFrontY}
            `}
            fill={model === 'support-campus' ? '#4d7c0f' : roofColor}
            stroke={leftWallColor}
            strokeWidth="1.5"
          />

          {/* ============================================================== */}
          {/* MODEL-SPECIFIC FACADE ARCHITECTURE & GEOMETRY LAYOUTS          */}
          {/* ============================================================== */}

          {/* 1. CORPORATE HOTEL: Curved Wrap-around Balconies with Ocean Glass */}
          {model === 'corporate-hotel' && (
            <g id="hotel-balconies">
              {Array.from({ length: windowRows }).map((_, rIdx) => {
                const rowProgress = (rIdx + 1) / (windowRows + 1);
                const startX = gFrontX + (rFrontX - gFrontX) * rowProgress + 8;
                const startY = gFrontY + (rFrontY - gFrontY) * rowProgress;
                const endX = gRightX + (rRightX - gRightX) * rowProgress - 8;
                const endY = gRightY + (rRightY - gRightY) * rowProgress;

                return (
                  <g key={`curved-balcony-${rIdx}`}>
                    <rect
                      x={startX - 2}
                      y={startY - 6}
                      width={Math.max(16, endX - startX + 4)}
                      height="7"
                      rx="3.5"
                      fill="#ffffff"
                      opacity="0.95"
                      stroke="#0284c7"
                      strokeWidth="0.8"
                    />
                    <line
                      x1={startX}
                      y1={startY - 10}
                      x2={endX}
                      y2={endY - 10}
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* 2. NEON BILLBOARD: Giant Angled Illuminated Billboard & Neon Louvers */}
          {model === 'neon-billboard' && (
            <g id="neon-billboard-facade">
              {/* Pink Horizontal Louver Blinds */}
              {Array.from({ length: windowRows }).map((_, rIdx) => {
                const rowProgress = (rIdx + 1) / (windowRows + 1);
                const startX = gFrontX + (rFrontX - gFrontX) * rowProgress + 6;
                const startY = gFrontY + (rFrontY - gFrontY) * rowProgress;
                const endX = gRightX + (rRightX - gRightX) * rowProgress - 6;
                const endY = gRightY + (rRightY - gRightY) * rowProgress;
                return (
                  <line
                    key={`neon-louv-${rIdx}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                );
              })}

              {/* Giant 3D Angled Neon Billboard Board on Front Wall */}
              <g transform={`translate(${gFrontX + (gRightX - gFrontX) * 0.45}, ${gFrontY + (rFrontY - gFrontY) * 0.45})`}>
                <polygon
                  points="-42,-22 42,-8 42,22 -42,8"
                  fill="#090d16"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  filter="url(#shadowDiorama)"
                />
                <polygon
                  points="-40,-20 40,-6 40,20 -40,6"
                  fill="#f43f5e"
                  opacity="0.25"
                />
                <text
                  x="0"
                  y="-4"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="900"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  letterSpacing="0.5"
                >
                  NOVA SÉRIE
                </text>
                <text
                  x="0"
                  y="7"
                  fill="#facc15"
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  ▶ SERTÃO NEON
                </text>
              </g>
            </g>
          )}

          {/* 3. GLASS TOWER: Sky-High Cyan Curtain Wall Mullions & Glass Canopy */}
          {model === 'glass-tower' && (
            <g id="glass-tower-facade">
              {/* Vertical Mullion Lines */}
              {Array.from({ length: 7 }).map((_, mIdx) => {
                const frac = (mIdx + 1) / 8;
                const bx = gFrontX + (gRightX - gFrontX) * frac;
                const by = gFrontY + (gRightY - gFrontY) * frac;
                const tx = rFrontX + (rRightX - rFrontX) * frac;
                const ty = rFrontY + (rRightY - rFrontY) * frac;
                return (
                  <line
                    key={`mullion-${mIdx}`}
                    x1={bx}
                    y1={by}
                    x2={tx}
                    y2={ty}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.65"
                  />
                );
              })}

              {/* Horizontal Floor Reflective Bands */}
              {Array.from({ length: windowRows + 2 }).map((_, rIdx) => {
                const rowProgress = (rIdx + 1) / (windowRows + 3);
                const startX = gFrontX + (rFrontX - gFrontX) * rowProgress + 4;
                const startY = gFrontY + (rFrontY - gFrontY) * rowProgress;
                const endX = gRightX + (rRightX - gRightX) * rowProgress - 4;
                const endY = gRightY + (rRightY - gRightY) * rowProgress;
                return (
                  <line
                    key={`glass-band-${rIdx}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#7dd3fc"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                );
              })}

              {/* Ground Entrance Glass Canopy */}
              <polygon
                points={`
                  ${gFrontX + 10},${gFrontY - 12} 
                  ${gRightX - 10},${gRightY - 12} 
                  ${gRightX - 4},${gRightY + 4} 
                  ${gFrontX + 16},${gFrontY + 4}
                `}
                fill="#38bdf8"
                opacity="0.75"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* 4. CLASSIC AUDITORIUM: Regal Cinema with 4 Columns, Red Carpet & Stanchions */}
          {model === 'classic-auditorium' && (
            <g id="auditorium-facade">
              {/* Entablature / Architrave below roof */}
              <polygon
                points={`
                  ${rFrontX},${rFrontY + 8} 
                  ${rRightX},${rRightY + 8} 
                  ${rRightX},${rRightY + 16} 
                  ${rFrontX},${rFrontY + 16}
                `}
                fill="#eab308"
                stroke="#ca8a04"
                strokeWidth="1"
              />

              {/* 4 Classical Golden/White Columns */}
              {[0.18, 0.40, 0.62, 0.84].map((colFrac, cIdx) => {
                const bx = gFrontX + (gRightX - gFrontX) * colFrac;
                const by = gFrontY + (gRightY - gFrontY) * colFrac;
                const tx = rFrontX + (rRightX - rFrontX) * colFrac;
                const ty = rFrontY + (rRightY - rFrontY) * colFrac + 16;
                return (
                  <g key={`column-${cIdx}`}>
                    {/* Capital */}
                    <rect x={tx - 4} y={ty} width="8" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                    {/* Column Shaft */}
                    <line x1={bx} y1={by} x2={tx} y2={ty + 4} stroke="#ffffff" strokeWidth="4.5" strokeLinecap="butt" />
                    <line x1={bx} y1={by} x2={tx} y2={ty + 4} stroke="#ca8a04" strokeWidth="1" />
                    {/* Column Base */}
                    <rect x={bx - 4} y={by - 4} width="8" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                  </g>
                );
              })}

              {/* Red VIP Carpet Rolling out to the street */}
              <polygon
                points={`
                  ${gFrontX + (gRightX - gFrontX) * 0.35},${gFrontY + (gRightY - gFrontY) * 0.35 - 2}
                  ${gFrontX + (gRightX - gFrontX) * 0.65},${gFrontY + (gRightY - gFrontY) * 0.65 - 2}
                  ${gFrontX + (gRightX - gFrontX) * 0.65 + 16},${gFrontY + (gRightY - gFrontY) * 0.65 + 24}
                  ${gFrontX + (gRightX - gFrontX) * 0.35 + 16},${gFrontY + (gRightY - gFrontY) * 0.35 + 24}
                `}
                fill="#dc2626"
                stroke="#b91c1c"
                strokeWidth="1"
              />

              {/* Golden Stanchion Posts & Velvet Rope along Carpet */}
              {[
                { x: gFrontX + (gRightX - gFrontX) * 0.35 + 2, y: gFrontY + (gRightY - gFrontY) * 0.35 + 4 },
                { x: gFrontX + (gRightX - gFrontX) * 0.35 + 14, y: gFrontY + (gRightY - gFrontY) * 0.35 + 20 },
                { x: gFrontX + (gRightX - gFrontX) * 0.65 + 4, y: gFrontY + (gRightY - gFrontY) * 0.65 + 4 },
                { x: gFrontX + (gRightX - gFrontX) * 0.65 + 16, y: gFrontY + (gRightY - gFrontY) * 0.65 + 20 }
              ].map((pos, pIdx) => (
                <g key={`stanchion-${pIdx}`}>
                  <circle cx={pos.x} cy={pos.y - 12} r="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.6" />
                  <line x1={pos.x} y1={pos.y} x2={pos.x} y2={pos.y - 12} stroke="#ca8a04" strokeWidth="1.5" />
                </g>
              ))}
            </g>
          )}

          {/* 5. EXECUTIVE PALACE: Classical Administrative HQ (ADM 1) with Portico */}
          {model === 'executive-palace' && (
            <g id="palace-facade">
              {/* Classical Triangular Pediment on Front Roof */}
              <polygon
                points={`
                  ${rFrontX + (rRightX - rFrontX) * 0.25},${rFrontY + (rRightY - rFrontY) * 0.25}
                  ${rFrontX + (rRightX - rFrontX) * 0.75},${rFrontY + (rRightY - rFrontY) * 0.75}
                  ${(rFrontX + rRightX) / 2},${(rFrontY + rRightY) / 2 - 20}
                `}
                fill="#f8fafc"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Classical Pillars */}
              {[0.25, 0.42, 0.58, 0.75].map((colFrac, cIdx) => {
                const bx = gFrontX + (gRightX - gFrontX) * colFrac;
                const by = gFrontY + (gRightY - gFrontY) * colFrac;
                const tx = rFrontX + (rRightX - rFrontX) * colFrac;
                const ty = rFrontY + (rRightY - rFrontY) * colFrac;
                return (
                  <line
                    key={`palace-col-${cIdx}`}
                    x1={bx}
                    y1={by}
                    x2={tx}
                    y2={ty}
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="butt"
                  />
                );
              })}

              {/* Grand Double Wooden Door */}
              <polygon
                points={`
                  ${gFrontX + (gRightX - gFrontX) * 0.44},${gFrontY + (gRightY - gFrontY) * 0.44 - 1}
                  ${gFrontX + (gRightX - gFrontX) * 0.56},${gFrontY + (gRightY - gFrontY) * 0.56 - 1}
                  ${gFrontX + (gRightX - gFrontX) * 0.56},${gFrontY + (gRightY - gFrontY) * 0.56 - 22}
                  ${gFrontX + (gRightX - gFrontX) * 0.44},${gFrontY + (gRightY - gFrontY) * 0.44 - 22}
                `}
                fill="#78350f"
                stroke="#451a03"
                strokeWidth="1"
              />
            </g>
          )}

          {/* 6. MODERN FINTECH: Cyber Cube with Electric Cyan Traces */}
          {model === 'modern-fintech' && (
            <g id="fintech-cyber-facade">
              {/* Electric Cyan Edge Circuit Traces */}
              <line x1={gFrontX} y1={gFrontY} x2={rFrontX} y2={rFrontY} stroke="#06b6d4" strokeWidth="2.5" />
              <line x1={rFrontX} y1={rFrontY} x2={rRightX} y2={rRightY} stroke="#06b6d4" strokeWidth="2.5" />
              <line x1={gRightX} y1={gRightY} x2={rRightX} y2={rRightY} stroke="#06b6d4" strokeWidth="2" />

              {/* Dark Tinted Tech Windows with Status LEDs */}
              {Array.from({ length: windowRows }).map((_, rIdx) => {
                const rowProgress = (rIdx + 1) / (windowRows + 1);
                const startX = gFrontX + (rFrontX - gFrontX) * rowProgress + 10;
                const startY = gFrontY + (rFrontY - gFrontY) * rowProgress;
                const endX = gRightX + (rRightX - gRightX) * rowProgress - 10;
                const endY = gRightY + (rRightY - gRightY) * rowProgress;
                return (
                  <g key={`fintech-win-${rIdx}`}>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="#0284c7"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <circle cx={startX + 4} cy={startY} r="1.8" fill="#10b981" />
                    <circle cx={endX - 4} cy={endY} r="1.8" fill="#38bdf8" />
                  </g>
                );
              })}
            </g>
          )}

          {/* 7. FINANCE VAULT: Heavy Reinforced Armored Security Building (ADM 2) */}
          {model === 'finance-vault' && (
            <g id="vault-facade">
              {/* Armored Slit Windows */}
              {Array.from({ length: windowRows }).map((_, rIdx) => {
                const rowProgress = (rIdx + 1) / (windowRows + 1);
                const startX = gFrontX + (rFrontX - gFrontX) * rowProgress + 12;
                const startY = gFrontY + (rFrontY - gFrontY) * rowProgress;
                const endX = gRightX + (rRightX - gRightX) * rowProgress - 12;
                const endY = gRightY + (rRightY - gRightY) * rowProgress;
                return (
                  <line
                    key={`vault-slit-${rIdx}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#1e1b4b"
                    strokeWidth="3.5"
                    strokeLinecap="square"
                  />
                );
              })}

              {/* Circular Vault Portal Door */}
              <g transform={`translate(${(gFrontX + gRightX) / 2}, ${(gFrontY + gRightY) / 2 - 12})`}>
                <circle cx="0" cy="0" r="10" fill="#334155" stroke="#facc15" strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#facc15" />
                <line x1="-8" y1="0" x2="8" y2="0" stroke="#facc15" strokeWidth="1.5" />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#facc15" strokeWidth="1.5" />
              </g>
            </g>
          )}

          {/* 8. SUPPORT CAMPUS: Modular Training Pavilion with Timber Louvers & Eco-Roof */}
          {model === 'support-campus' && (
            <g id="support-campus-facade">
              {/* Horizontal Timber Slat Brise-Soleil */}
              {Array.from({ length: windowRows + 1 }).map((_, rIdx) => {
                const rowProgress = (rIdx + 1) / (windowRows + 2);
                const startX = gFrontX + (rFrontX - gFrontX) * rowProgress + 6;
                const startY = gFrontY + (rFrontY - gFrontY) * rowProgress;
                const endX = gRightX + (rRightX - gRightX) * rowProgress - 6;
                const endY = gRightY + (rRightY - gRightY) * rowProgress;
                return (
                  <line
                    key={`timber-${rIdx}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#b45309"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Glass Panoramic Classroom Windows */}
              <polygon
                points={`
                  ${gFrontX + 12},${gFrontY - 14} 
                  ${gRightX - 12},${gRightY - 14} 
                  ${gRightX - 12},${gRightY - 32} 
                  ${gFrontX + 12},${gFrontY - 32}
                `}
                fill="#38bdf8"
                opacity="0.75"
                stroke="#0284c7"
                strokeWidth="1"
              />
            </g>
          )}
        </g>
      )}

      {/* 6. MODEL-SPECIFIC ROOF ACCESSORIES */}

      {/* A. Corporate Hotel Pool & Solarium */}
      {roofType === 'pool' && (
        <g transform={`translate(${rFrontX + (rBackX - rFrontX) * 0.4}, ${rFrontY + (rBackY - rFrontY) * 0.4})`}>
          <ellipse cx="0" cy="0" rx={w * 0.4} ry={d * 0.25} fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx={w * 0.35} ry={d * 0.2} fill="#38bdf8" opacity="0.8" />
          <circle cx={w * 0.2} cy="-4" r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
        </g>
      )}

      {/* B. Glass Tower Antennas & Dome */}
      {roofType === 'antennas' && (
        <g transform={`translate(${rFrontX + (rBackX - rFrontX) * 0.5}, ${rFrontY + (rBackY - rFrontY) * 0.5})`}>
          {/* Curved communication dome */}
          <ellipse cx="0" cy="-2" rx={w * 0.3} ry={d * 0.18} fill="#e2e8f0" stroke="#0284c7" strokeWidth="1.5" />
          <line x1="0" y1="-2" x2="0" y2="-42" stroke="#0284c7" strokeWidth="3" />
          <circle cx="0" cy="-44" r="4" fill="#ef4444" className="animate-ping" />
          <circle cx="0" cy="-44" r="3" fill="#ef4444" />
        </g>
      )}

      {/* C. Billboard with Curved Marquee */}
      {roofType === 'billboard' && (
        <g transform={`translate(${rFrontX + (rBackX - rFrontX) * 0.5}, ${rFrontY - 14})`}>
          <rect
            x={-w * 0.65}
            y="-18"
            width={w * 1.3}
            height="26"
            rx="8"
            fill="#0f172a"
            stroke="#f43f5e"
            strokeWidth="2.5"
            filter="url(#shadowDiorama)"
          />
          <text
            x="0"
            y="-2"
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans, sans-serif"
            textAnchor="middle"
          >
            {building.name}
          </text>
        </g>
      )}

      {/* D. Classic Auditorium Dome (Curved Neoclassic Cupola) */}
      {(roofType === 'cornice' || model === 'classic-auditorium') && (
        <g transform={`translate(${rFrontX + (rBackX - rFrontX) * 0.5}, ${rFrontY + (rBackY - rFrontY) * 0.5})`}>
          {/* Curved central gold dome */}
          <ellipse cx="0" cy="-8" rx={w * 0.35} ry={d * 0.22} fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          <path
            d={`
              M ${-w * 0.32} -8 
              Q 0 ${-d * 0.4 - 24} ${w * 0.32} -8 
              Z
            `}
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="1.5"
          />
          <circle cx="0" cy={-d * 0.4 - 24} r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        </g>
      )}

      {/* E. Helipad */}
      {roofType === 'helipad' && (
        <g transform={`translate(${rFrontX + (rBackX - rFrontX) * 0.5}, ${rFrontY + (rBackY - rFrontY) * 0.5})`}>
          <ellipse cx="0" cy="0" rx={w * 0.42} ry={d * 0.26} fill="#1e293b" stroke="#facc15" strokeWidth="2.5" />
          <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
            H
          </text>
        </g>
      )}

      {/* F. Solar Panels Grid */}
      {roofType === 'solar' && (
        <g transform={`translate(${rFrontX + (rBackX - rFrontX) * 0.5}, ${rFrontY + (rBackY - rFrontY) * 0.5})`}>
          {[-15, 0, 15].map((offset, sIdx) => (
            <rect
              key={`solar-${sIdx}`}
              x={offset - 6}
              y="-10"
              width="12"
              height="20"
              rx="1.5"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      {/* 7. BUILDING NAME BADGE ON FACADE */}
      <g transform={`translate(${(gFrontX + gRightX) * 0.5}, ${(gFrontY + gRightY) * 0.5 - h * 0.4})`}>
        <rect
          x="-32"
          y="-9"
          width="64"
          height="18"
          rx="5"
          fill="#0f172a"
          stroke="#ffffff"
          strokeWidth="1.2"
          opacity="0.95"
          filter="url(#shadowDiorama)"
        />
        <text
          x="0"
          y="3.5"
          fill="#ffffff"
          fontSize="8.5"
          fontWeight="bold"
          fontFamily="Plus Jakarta Sans, sans-serif"
          textAnchor="middle"
        >
          {building.name}
        </text>
      </g>

      {/* 8. INTERACTIVE RESIZE & ROTATION HANDLES (When selected in Edit Mode) */}
      {isSelected && isEditMode && (
        <g className="select-none">
          {/* Height Handle (Topo vertical) */}
          <g
            transform={`translate(${rFrontX}, ${rFrontY - 22})`}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (onStartResize) onStartResize(e, building.id, 'height');
            }}
            className="cursor-ns-resize group"
          >
            <circle cx="0" cy="0" r="8.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" className="group-hover:scale-125 transition-transform" />
            <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">↕</text>
          </g>

          {/* Width Handle (Extremidade Esquerda) */}
          <g
            transform={`translate(${gLeftX - 10}, ${gLeftY - h * 0.5})`}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (onStartResize) onStartResize(e, building.id, 'width');
            }}
            className="cursor-ew-resize group"
          >
            <circle cx="0" cy="0" r="8.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="group-hover:scale-125 transition-transform" />
            <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">↔</text>
          </g>

          {/* Depth Handle (Extremidade Direita) */}
          <g
            transform={`translate(${gRightX + 10}, ${gRightY - h * 0.5})`}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (onStartResize) onStartResize(e, building.id, 'depth');
            }}
            className="cursor-ew-resize group"
          >
            <circle cx="0" cy="0" r="8.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="group-hover:scale-125 transition-transform" />
            <text x="0" y="3" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">↔</text>
          </g>
        </g>
      )}
    </g>
  );
};
