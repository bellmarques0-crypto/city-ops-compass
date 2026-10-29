import { beforeEach, describe, expect, it } from 'vitest';
import { loadStoredRoads, loadStoredUrbanElements, loadStoredBuildings } from '@/services/storage';
import { INITIAL_ROADS } from '@/data/initialUrbanElements';
import { statusHigherIsBetter, statusLowerIsBetter, getIndicatorsForBuilding } from '@/data/operationalIndicators';

describe('storage empty lists', () => {
  beforeEach(() => localStorage.clear());

  it('loads demo roads when nothing is saved', () => {
    expect(loadStoredRoads()).toHaveLength(INITIAL_ROADS.length);
  });
  it('respects a saved empty road list', () => {
    localStorage.setItem('cidade_operacional_roads_v3', '[]');
    expect(loadStoredRoads()).toEqual([]);
  });
  it('respects a saved empty urban element list', () => {
    localStorage.setItem('cidade_operacional_urban_elements_v3', '[]');
    expect(loadStoredUrbanElements()).toEqual([]);
  });
  it('respects a saved empty building list', () => {
    localStorage.setItem('cidade_operacional_buildings_v3', '[]');
    expect(loadStoredBuildings()).toEqual([]);
  });
  it('falls back without overwriting corrupted content', () => {
    localStorage.setItem('cidade_operacional_roads_v3', '{bad');
    expect(loadStoredRoads()).toHaveLength(INITIAL_ROADS.length);
    expect(localStorage.getItem('cidade_operacional_roads_v3')).toBe('{bad');
  });
});

describe('indicator status', () => {
  it('is unclassified without a target', () => {
    expect(statusHigherIsBetter(90, null)).toBe('sem_meta');
  });
  it('service level 80 vs target 80 is ok, 77 attention, 70 out', () => {
    expect(statusHigherIsBetter(80, 80)).toBe('ok');
    expect(statusHigherIsBetter(77, 80)).toBe('atencao');
    expect(statusHigherIsBetter(70, 80)).toBe('fora');
  });
  it('TMA above target is not ok', () => {
    expect(statusLowerIsBetter(300, 240)).toBe('fora');
  });
  it('buildings without data show no numbers', () => {
    expect(getIndicatorsForBuilding('bld-pine').hcPlanned).toBeNull();
  });
});
