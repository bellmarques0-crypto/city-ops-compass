import React from 'react';
import { CalendarDays, Info } from 'lucide-react';
import {
  attainmentPercent,
  formatSeconds,
  getIndicatorsForBuilding,
  statusHigherIsBetter,
  statusLowerIsBetter,
  type IndicatorStatus,
} from '../data/operationalIndicators';

const NO_DATA = 'Sem dados disponíveis';

const STATUS_STYLE: Record<IndicatorStatus, { dot: string; label: string; text: string }> = {
  ok: { dot: 'bg-emerald-500', label: 'Meta atingida', text: 'text-emerald-700' },
  atencao: { dot: 'bg-amber-400', label: 'Atenção', text: 'text-amber-700' },
  fora: { dot: 'bg-red-500', label: 'Fora do limite', text: 'text-red-700' },
  sem_meta: { dot: 'bg-slate-300', label: 'Sem meta configurada', text: 'text-slate-500' },
};

const fmt = (n: number | null, suffix = '') =>
  n === null ? null : `${n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}${suffix}`;

const Card: React.FC<{
  title: string;
  value: string | null;
  lines?: Array<string | null>;
  status?: IndicatorStatus;
}> = ({ title, value, lines = [], status }) => {
  const st = status ? STATUS_STYLE[status] : null;
  const shown = lines.filter((l): l is string => !!l);
  return (
    <div className="p-3 bg-white rounded-xl border border-slate-200/90 flex flex-col gap-1">
      <span className="text-[11px] font-medium text-slate-500">{title}</span>
      {value === null ? (
        <span className="text-xs font-semibold text-slate-400 italic">{NO_DATA}</span>
      ) : (
        <span className="text-xl font-black text-slate-900 font-mono tracking-tight">{value}</span>
      )}
      {shown.map((l) => (
        <span key={l} className="text-[10px] text-slate-500 font-mono">{l}</span>
      ))}
      {st && value !== null && (
        <span className={`flex items-center gap-1 text-[10px] font-semibold ${st.text}`}>
          <span className={`w-2 h-2 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      )}
    </div>
  );
};

export const OperationalIndicatorsSection: React.FC<{ buildingId: string }> = ({ buildingId }) => {
  const d = getIndicatorsForBuilding(buildingId);
  const hcAtt = attainmentPercent(d.hcDelivered, d.hcPlanned);
  const posGap =
    d.positionsPlanned !== null && d.positionsDelivered !== null
      ? d.positionsDelivered - d.positionsPlanned
      : null;
  const tmaDiff =
    d.tmaSeconds !== null && d.tmaTargetSeconds !== null ? d.tmaSeconds - d.tmaTargetSeconds : null;
  const slDiff =
    d.serviceLevelPercent !== null && d.serviceLevelTargetPercent !== null
      ? d.serviceLevelPercent - d.serviceLevelTargetPercent
      : null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Indicadores operacionais</h3>
        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
          <CalendarDays className="w-3 h-3" />
          {d.referenceDate ? new Date(d.referenceDate).toLocaleDateString('pt-BR') : 'Sem data de referência'}
        </span>
      </div>

      {d.source !== 'real' && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            {d.source === 'demonstrativo'
              ? 'Dados demonstrativos — não representam a operação real.'
              : 'Nenhuma fonte de dados conectada para este prédio ainda.'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card title="HC planejado" value={fmt(d.hcPlanned)} />
        <Card
          title="HC entregue"
          value={fmt(d.hcDelivered)}
          lines={[hcAtt !== null ? `Atingimento: ${fmt(hcAtt, '%')}` : null]}
          status={statusHigherIsBetter(d.hcDelivered, d.hcPlanned)}
        />
        <Card
          title="Posições de atendimento"
          value={
            d.positionsDelivered !== null || d.positionsPlanned !== null
              ? `${fmt(d.positionsDelivered) ?? '—'} / ${fmt(d.positionsPlanned) ?? '—'}`
              : null
          }
          lines={['entregues / planejadas', posGap !== null ? `Diferença: ${posGap > 0 ? '+' : ''}${posGap}` : null]}
        />
        <Card
          title="Operadores ativos"
          value={fmt(d.operatorsActive)}
          lines={[
            d.operatorsExpected !== null ? `Previstos: ${d.operatorsExpected}` : null,
            d.operatorsUnavailable !== null ? `Indisponíveis: ${d.operatorsUnavailable}` : null,
          ]}
        />
        <Card
          title="Absenteísmo"
          value={fmt(d.absenteeismPercent, '%')}
          lines={[
            d.absences !== null ? `Ausências: ${d.absences}` : null,
            d.absenteeismTargetPercent !== null ? `Meta: até ${fmt(d.absenteeismTargetPercent, '%')}` : null,
          ]}
          status={statusLowerIsBetter(d.absenteeismPercent, d.absenteeismTargetPercent)}
        />
        <Card
          title="TMA"
          value={formatSeconds(d.tmaSeconds)}
          lines={[
            d.tmaTargetSeconds !== null ? `Meta: ${formatSeconds(d.tmaTargetSeconds)}` : null,
            tmaDiff !== null ? `Diferença: ${tmaDiff > 0 ? '+' : '-'}${formatSeconds(Math.abs(tmaDiff))}` : null,
          ]}
          status={statusLowerIsBetter(d.tmaSeconds, d.tmaTargetSeconds)}
        />
        <Card
          title="Nível de serviço"
          value={fmt(d.serviceLevelPercent, '%')}
          lines={[
            d.serviceLevelTargetPercent !== null ? `Meta: ${fmt(d.serviceLevelTargetPercent, '%')}` : null,
            slDiff !== null ? `Diferença: ${slDiff > 0 ? '+' : ''}${fmt(slDiff, ' p.p.')}` : null,
          ]}
          status={statusHigherIsBetter(d.serviceLevelPercent, d.serviceLevelTargetPercent)}
        />
      </div>
    </section>
  );
};
