/**
 * Operational indicators per building, keyed by the building's stable `id`
 * (never by name). No real data source is connected yet: every value is
 * `null` until real numbers are filled in or an integration is built.
 */

export interface IndicatorHistoryPoint {
  date: string; // ISO date
  value: number;
}

export interface OperationalIndicators {
  buildingId: string;
  referenceDate: string | null; // ISO date of the data
  source: 'sem_fonte' | 'demonstrativo' | 'real';
  hcPlanned: number | null;
  hcDelivered: number | null;
  positionsPlanned: number | null;
  positionsDelivered: number | null;
  operatorsExpected: number | null;
  operatorsActive: number | null;
  operatorsUnavailable: number | null;
  absenteeismPercent: number | null;
  absences: number | null;
  absenteeismTargetPercent: number | null; // max acceptable
  tmaSeconds: number | null;
  tmaTargetSeconds: number | null; // max acceptable
  serviceLevelPercent: number | null;
  serviceLevelTargetPercent: number | null; // min acceptable
  history?: {
    serviceLevel?: IndicatorHistoryPoint[];
    tma?: IndicatorHistoryPoint[];
    absenteeism?: IndicatorHistoryPoint[];
  };
}

export function emptyIndicators(buildingId: string): OperationalIndicators {
  return {
    buildingId,
    referenceDate: null,
    source: 'sem_fonte',
    hcPlanned: null,
    hcDelivered: null,
    positionsPlanned: null,
    positionsDelivered: null,
    operatorsExpected: null,
    operatorsActive: null,
    operatorsUnavailable: null,
    absenteeismPercent: null,
    absences: null,
    absenteeismTargetPercent: null,
    tmaSeconds: null,
    tmaTargetSeconds: null,
    serviceLevelPercent: null,
    serviceLevelTargetPercent: null,
  };
}

/** Fill real indicators here (or replace with a data source) keyed by building id. */
export const OPERATIONAL_INDICATORS: Record<string, OperationalIndicators> = {};

export function getIndicatorsForBuilding(buildingId: string): OperationalIndicators {
  return OPERATIONAL_INDICATORS[buildingId] ?? emptyIndicators(buildingId);
}

export type IndicatorStatus = 'ok' | 'atencao' | 'fora' | 'sem_meta';

/** Attention band: within 5% of the target on the wrong side. */
const ATTENTION_BAND = 0.05;

/** Higher is better (e.g. service level, attainment). */
export function statusHigherIsBetter(value: number | null, target: number | null): IndicatorStatus {
  if (value === null || target === null) return 'sem_meta';
  if (value >= target) return 'ok';
  if (value >= target * (1 - ATTENTION_BAND)) return 'atencao';
  return 'fora';
}

/** Lower is better (e.g. TMA, absenteeism). */
export function statusLowerIsBetter(value: number | null, target: number | null): IndicatorStatus {
  if (value === null || target === null) return 'sem_meta';
  if (value <= target) return 'ok';
  if (value <= target * (1 + ATTENTION_BAND)) return 'atencao';
  return 'fora';
}

export function attainmentPercent(delivered: number | null, planned: number | null): number | null {
  if (delivered === null || planned === null || planned === 0) return null;
  return (delivered / planned) * 100;
}

export function formatSeconds(total: number | null): string | null {
  if (total === null) return null;
  const m = Math.floor(total / 60);
  const s = Math.round(total % 60);
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}
