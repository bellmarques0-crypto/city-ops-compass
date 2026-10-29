/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Building, Workstation, Operator, WorkstationStatus } from '../types/city';

export const MOCK_OPERATOR_NAMES = [
  'Lucas Silveira', 'Mariana Albuquerque', 'Rodrigo Fagundes', 'Camila Santos',
  'Bruno Guimarães', 'Fernanda Lima', 'Gabriel Nogueira', 'Juliana Rocha',
  'Matheus Carvalho', 'Beatriz Menezes', 'Felipe Barreto', 'Larissa Duarte',
  'Thiago Fontes', 'Amanda Meireles', 'Vinicius Castro', 'Patrícia Prado',
  'Diego Ramos', 'Carolina Farias', 'André Vasconcellos', 'Aline Ribeiro',
  'Rafael Sampaio', 'Natália Gusmão', 'Danilo Pinho', 'Letícia Borges',
  'Guilherme Torres', 'Sabrina Vianna', 'Marcelo Antunes', 'Renata Correia',
  'Alexandre Peixoto', 'Tatiane Rezende', 'Eduardo Paiva', 'Vanessa Lemos',
  'Carlos Eduardo', 'Helena Portela', 'Leandro Chaves', 'Isabela Monteiro'
];

export const INITIAL_BUILDINGS: Building[] = [
  // 1. PINE - Emerald Hotel / Corporate Resort style with pool and palm trees
  {
    id: 'bld-pine',
    code: 'PRD-PIN',
    name: 'PINE',
    type: 'produto',
    category: 'Crédito Consignado & Financiamentos',
    color: '#059669', // Emerald
    secondaryColor: '#10b981',
    status: 'ativo',
    isoX: 380,
    isoY: 370,
    model: 'corporate-hotel',
    roofType: 'pool',
    customWidth: 150,
    customDepth: 110,
    customHeight: 110,
    cornerStyle: 'curvo',
    isCurved: true,
    position: { x: 70, y: 70 },
    size: { width: 230, height: 190 },
    floors: 5,
    initialPositionsCount: 36,
    notes: 'Operação de Crédito Consignado PINE e antecipação FGTS com alta demanda no fechamento de mês.',
    supervisor: 'Ricardo Medeiros - Coordenação Geral',
    slaTargetPercentage: 96.5,
    tags: ['Consignado', 'FGTS', 'Alta Prioridade'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '24.890',
      activeAgentsToday: 32,
      slaPercent: 96.5,
      averageHandleTime: '3m 48s',
      growthRate: '+6,2%',
      kpiCards: [
        { label: 'Propostas no mês', value: '13.482', subValue: '+312 no mês', trend: 'up', sparkline: [20, 24, 28, 26, 32, 38, 44] },
        { label: 'Aprovações Hoje', value: '46', subValue: '+9 vs ontem', trend: 'up', sparkline: [12, 18, 14, 22, 28, 36, 46] },
        { label: 'Conversão Consignado', value: '38%', subValue: '+4 p.p.', trend: 'up', sparkline: [30, 31, 33, 34, 35, 37, 38] },
        { label: 'Ticket Médio', value: 'R$ 1.180', subValue: '-3,0%', trend: 'down', sparkline: [1400, 1320, 1280, 1250, 1210, 1180] }
      ],
      topIssues: [
        { rank: 1, title: 'Antecipação Saque-Aniversário FGTS', volume: '18,4k', percent: 92 },
        { rank: 2, title: 'Margem Consignável SIAPE / INSS', volume: '15,1k', percent: 78 },
        { rank: 3, title: 'Refinanciamento de Contrato Ativo', volume: '12,7k', percent: 64 },
        { rank: 4, title: 'Dúvidas de Portabilidade Bancária', volume: '9,8k', percent: 48 },
        { rank: 5, title: 'Liberação de Saldo em Conta', volume: '8,2k', percent: 40 }
      ],
      channelDistribution: [
        { label: 'WhatsApp', value: 85 },
        { label: 'Telefonia', value: 62 },
        { label: 'App PINE', value: 48 },
        { label: 'Correspondentes', value: 34 },
        { label: 'Chat Web', value: 24 }
      ]
    }
  },

  // 2. BYX - Modern Indigo Fintech Glass Cube
  {
    id: 'bld-byx',
    code: 'PRD-BYX',
    name: 'BYX',
    type: 'produto',
    category: 'Fintech & Cartões Digitais',
    color: '#4f46e5', // Indigo
    secondaryColor: '#6366f1',
    status: 'ativo',
    isoX: 520,
    isoY: 480,
    model: 'modern-fintech',
    roofType: 'helipad',
    customWidth: 130,
    customDepth: 110,
    customHeight: 130,
    cornerStyle: 'reto',
    isCurved: false,
    position: { x: 340, y: 70 },
    size: { width: 230, height: 190 },
    floors: 3,
    initialPositionsCount: 32,
    notes: 'Atendimento Omnichannel para a base de cartões BYX Platinum e contas digitais.',
    supervisor: 'Camila Peixoto - Líder Operacional',
    slaTargetPercentage: 94.8,
    tags: ['Cartões', 'Fintech', 'Chat/Voz'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '31.200',
      activeAgentsToday: 29,
      slaPercent: 94.8,
      averageHandleTime: '2m 55s',
      growthRate: '+11,4%',
      kpiCards: [
        { label: 'Transações Cartão', value: '84.210', subValue: '+14% no mês', trend: 'up', sparkline: [40, 48, 55, 62, 70, 78, 84] },
        { label: 'Novas Contas Abertas', value: '1.240', subValue: '+85 hoje', trend: 'up', sparkline: [10, 15, 14, 20, 25, 29, 35] },
        { label: 'Aprovação de Limite', value: '42%', subValue: '+2 p.p.', trend: 'up', sparkline: [36, 38, 39, 40, 41, 42] },
        { label: 'Tempo Médio Resposta', value: '42s', subValue: '-8s', trend: 'up', sparkline: [58, 52, 49, 46, 44, 42] }
      ],
      topIssues: [
        { rank: 1, title: 'Aumento de Limite Cartão BYX', volume: '14,2k', percent: 88 },
        { rank: 2, title: 'Desbloqueio de Cartão Virtual', volume: '11,5k', percent: 72 },
        { rank: 3, title: 'Contestação de Compra Pix', volume: '9,1k', percent: 56 },
        { rank: 4, title: 'Parcelamento de Fatura', volume: '7,4k', percent: 45 },
        { rank: 5, title: 'Programa de Pontos & Cashback', volume: '5,9k', percent: 36 }
      ],
      channelDistribution: [
        { label: 'App BYX', value: 92 },
        { label: 'Chatbot AI', value: 78 },
        { label: 'WhatsApp', value: 45 },
        { label: 'Voz 0800', value: 30 },
        { label: 'E-mail', value: 15 }
      ]
    }
  },

  // 3. AMIGOZ - Amber Industrial Soundstage & Partnership Hangar
  {
    id: 'bld-amigoz',
    code: 'PRD-AMG',
    name: 'AMIGOZ',
    type: 'produto',
    category: 'Benefícios & Clube de Vantagens',
    color: '#d97706', // Amber
    secondaryColor: '#f59e0b',
    status: 'ativo',
    isoX: 350,
    isoY: 260,
    model: 'soundstage-hangar',
    roofType: 'standard',
    customWidth: 170,
    customDepth: 120,
    customHeight: 95,
    cornerStyle: 'curvo',
    isCurved: true,
    position: { x: 610, y: 70 },
    size: { width: 230, height: 190 },
    floors: 2,
    initialPositionsCount: 28,
    notes: 'Operação receptiva e ativa de adesão a convênios corporativos e parceiros AMIGOZ.',
    supervisor: 'Sérgio Ramos - Gestor de Campanhas',
    slaTargetPercentage: 92.0,
    tags: ['Benefícios', 'Parcerias', 'Comercial'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '16.450',
      activeAgentsToday: 24,
      slaPercent: 92.0,
      averageHandleTime: '4m 10s',
      growthRate: '+4,8%',
      kpiCards: [
        { label: 'Resgates no Clube', value: '42.890', subValue: '+8% vs mês ant.', trend: 'up', sparkline: [22, 28, 31, 35, 38, 42] },
        { label: 'Parceiros Ativos', value: '540', subValue: '+18 novas redes', trend: 'up', sparkline: [480, 495, 510, 525, 540] },
        { label: 'Taxa de Retenção', value: '91%', subValue: '+1 p.p.', trend: 'up', sparkline: [88, 89, 89, 90, 91] },
        { label: 'NPS Membros', value: '88', subValue: '+4 pts', trend: 'up', sparkline: [78, 80, 82, 85, 88] }
      ],
      topIssues: [
        { rank: 1, title: 'Ativação de Cupom de Farmácia', volume: '12,5k', percent: 84 },
        { rank: 2, title: 'Inclusão de Dependentes no Plano', volume: '9,8k', percent: 65 },
        { rank: 3, title: 'Desconto em Combustível Shell/Ipiranga', volume: '8,4k', percent: 55 },
        { rank: 4, title: 'Renovação de Convênio Empresa', volume: '6,1k', percent: 40 },
        { rank: 5, title: 'Transferência de Pontos', volume: '4,5k', percent: 30 }
      ],
      channelDistribution: [
        { label: 'App Parceiro', value: 80 },
        { label: 'Telefonia Receptiva', value: 50 },
        { label: 'WhatsApp', value: 65 },
        { label: 'Portal B2B', value: 38 },
        { label: 'Presencial', value: 12 }
      ]
    }
  },

  // 4. RETENÇÃO - Pink Building with Glowing Neon Billboard
  {
    id: 'bld-retencao',
    code: 'PRD-RET',
    name: 'RETENÇÃO',
    type: 'produto',
    category: 'Relacionamento & Retenção Crítica',
    color: '#e11d48', // Rose / Pink
    secondaryColor: '#f43f5e',
    status: 'ativo',
    isoX: 230,
    isoY: 340,
    model: 'neon-billboard',
    roofType: 'billboard',
    customWidth: 160,
    customDepth: 100,
    customHeight: 120,
    cornerStyle: 'curvo',
    isCurved: true,
    position: { x: 880, y: 70 },
    size: { width: 240, height: 190 },
    floors: 4,
    initialPositionsCount: 40,
    notes: 'Núcleo especializado em reversão de cancelamentos, renegociação e ouvidoria nível 2.',
    supervisor: 'Tatiane Mendonça - Gerência de Retenção',
    slaTargetPercentage: 98.2,
    tags: ['Crítico', 'Ouvidoria', 'Negociação'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '18.730',
      activeAgentsToday: 38,
      slaPercent: 98.2,
      averageHandleTime: '5m 32s',
      growthRate: '-2,8% Churn',
      kpiCards: [
        { label: 'Contatos Retidos', value: '8.450', subValue: '+680 este mês', trend: 'up', sparkline: [15, 18, 22, 28, 34, 40] },
        { label: 'Taxa de Reversão', value: '74,2%', subValue: '+5,1 p.p.', trend: 'up', sparkline: [62, 65, 68, 70, 72, 74] },
        { label: 'Redução de Churn', value: '2,8%', subValue: 'Melhor do ano', trend: 'up', sparkline: [4.5, 4.1, 3.8, 3.4, 3.0, 2.8] },
        { label: 'Satisfação Pós-Retenção', value: '92%', subValue: '+6 pts', trend: 'up', sparkline: [80, 82, 85, 88, 90, 92] }
      ],
      topIssues: [
        { rank: 1, title: 'Proposta de Desconto em Taxa', volume: '16,2k', percent: 94 },
        { rank: 2, title: 'Renegociação de Dívida / Parcelamento', volume: '14,0k', percent: 82 },
        { rank: 3, title: 'Upgrade de Benefícios Sem Custo', volume: '10,5k', percent: 61 },
        { rank: 4, title: 'Esclarecimento de Cobrança / Dúvida', volume: '8,2k', percent: 48 },
        { rank: 5, title: 'Mediação Ouvidoria Bacen/Procon', volume: '3,8k', percent: 22 }
      ],
      channelDistribution: [
        { label: 'Telefonia Prioritária', value: 95 },
        { label: 'WhatsApp VIP', value: 72 },
        { label: 'Chat Especialista', value: 48 },
        { label: 'Ouvidoria Direta', value: 25 },
        { label: 'Portal Negociação', value: 35 }
      ]
    }
  },

  // 5. ORCREDI - Classical Purple & Gold Auditorium with Red Carpet entrance
  {
    id: 'bld-orcredi',
    code: 'PRD-ORC',
    name: 'ORCREDI',
    type: 'produto',
    category: 'Crédito Pessoal & Refinanciamento',
    color: '#7c3aed', // Purple / Gold
    secondaryColor: '#8b5cf6',
    status: 'ativo',
    isoX: 620,
    isoY: 410,
    model: 'classic-auditorium',
    roofType: 'cornice',
    customWidth: 150,
    customDepth: 110,
    customHeight: 115,
    cornerStyle: 'reto',
    isCurved: false,
    position: { x: 1160, y: 70 },
    size: { width: 230, height: 190 },
    floors: 3,
    initialPositionsCount: 30,
    notes: 'Mesa de operações e esteira de aprovação cadastral dos clientes ORCREDI.',
    supervisor: 'Fernando Batista - Supervisão de Mesa',
    slaTargetPercentage: 95.0,
    tags: ['Crédito', 'Aprovação', 'Esteira'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '21.400',
      activeAgentsToday: 27,
      slaPercent: 95.0,
      averageHandleTime: '3m 15s',
      growthRate: '+8,6%',
      kpiCards: [
        { label: 'Contratos Emitidos', value: '9.320', subValue: '+410 no mês', trend: 'up', sparkline: [18, 22, 26, 30, 34, 38] },
        { label: 'Tempo Médio Análise', value: '18min', subValue: '-4min vs anterior', trend: 'up', sparkline: [32, 28, 24, 22, 20, 18] },
        { label: 'Inadimplência 90D', value: '1,8%', subValue: '-0,3 p.p.', trend: 'up', sparkline: [2.5, 2.3, 2.1, 2.0, 1.9, 1.8] },
        { label: 'Volume Liberado', value: 'R$ 48 mi', subValue: '+12,4%', trend: 'up', sparkline: [35, 38, 40, 42, 45, 48] }
      ],
      topIssues: [
        { rank: 1, title: 'Assinatura Digital de Cédula (CCB)', volume: '14,8k', percent: 90 },
        { rank: 2, title: 'Envio de Comprovante de Renda', volume: '11,2k', percent: 68 },
        { rank: 3, title: 'Liberação de TED/Pix de Empréstimo', volume: '9,5k', percent: 58 },
        { rank: 4, title: 'Segunda Via de Boleto Mensal', volume: '7,1k', percent: 43 },
        { rank: 5, title: 'Simulação de Novo Limite', volume: '6,2k', percent: 38 }
      ],
      channelDistribution: [
        { label: 'Mesa de Crédito', value: 88 },
        { label: 'WhatsApp', value: 70 },
        { label: 'Portal Parceiros', value: 55 },
        { label: 'Telefonia Ativa', value: 42 },
        { label: 'Agências Físicas', value: 20 }
      ]
    }
  },

  // 6. T.I. - Giant Blue Glass Technology Skyscraper (CV TECH)
  {
    id: 'bld-ti',
    code: 'ADM-TI',
    name: 'T.I.',
    type: 'administrativo',
    category: 'Tecnologia da Informação & NOC 24/7',
    color: '#0284c7', // Sky / Cobalt Blue
    secondaryColor: '#38bdf8',
    status: 'ativo',
    isoX: 620,
    isoY: 260,
    model: 'glass-tower',
    roofType: 'antennas',
    customWidth: 120,
    customDepth: 90,
    customHeight: 180,
    cornerStyle: 'reto',
    isCurved: false,
    position: { x: 640, y: 520 },
    size: { width: 240, height: 190 },
    floors: 8,
    initialPositionsCount: 24,
    notes: 'Data center local, suporte a telefonia IP/VoIP, gestão de ramais, servidores e NOC 24/7.',
    supervisor: 'Otávio Silveira - Gerente de Infra & NOC',
    slaTargetPercentage: 99.9,
    tags: ['Infra', 'NOC', 'Suporte Técnico'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '4.820',
      activeAgentsToday: 22,
      slaPercent: 99.98,
      averageHandleTime: '8m 40s',
      growthRate: '99,99% Uptime',
      kpiCards: [
        { label: 'Chamados Resolvidos', value: '4.780', subValue: '99,2% no prazo', trend: 'up', sparkline: [30, 34, 38, 42, 46, 50] },
        { label: 'Uptime Servidores', value: '99,98%', subValue: 'Zero indisponibilidade', trend: 'up', sparkline: [99.9, 99.92, 99.95, 99.97, 99.98] },
        { label: 'Tempo Médio Resolução', value: '14min', subValue: '-3min', trend: 'up', sparkline: [22, 20, 18, 16, 15, 14] },
        { label: 'Ramais VoIP Conectados', value: '380', subValue: '100% ativos', trend: 'up', sparkline: [340, 350, 360, 370, 380] }
      ],
      topIssues: [
        { rank: 1, title: 'Configuração de Softphone & Ramal', volume: '3,2k', percent: 86 },
        { rank: 2, title: 'Reset de Senha Active Directory/VPN', volume: '2,8k', percent: 75 },
        { rank: 3, title: 'Instalação de Headset / Periféricos', volume: '1,9k', percent: 52 },
        { rank: 4, title: 'Acesso a CRM & Discador Preditivo', volume: '1,4k', percent: 38 },
        { rank: 5, title: 'Manutenção de Hardware da PA', volume: '0,9k', percent: 24 }
      ],
      channelDistribution: [
        { label: 'Jira Service Desk', value: 94 },
        { label: 'Slack T.I.', value: 68 },
        { label: 'Ramal 4000 NOC', value: 45 },
        { label: 'Presencial PAs', value: 32 },
        { label: 'E-mail Suporte', value: 18 }
      ]
    }
  },

  // 7. ADM 1 - Executive Headquarters & People / HR
  {
    id: 'bld-adm1',
    code: 'ADM-01',
    name: 'ADM 1',
    type: 'administrativo',
    category: 'Diretoria Executiva & Recursos Humanos',
    color: '#334155', // Slate
    secondaryColor: '#475569',
    status: 'ativo',
    isoX: 740,
    isoY: 340,
    model: 'executive-palace',
    roofType: 'cornice',
    customWidth: 170,
    customDepth: 110,
    customHeight: 105,
    cornerStyle: 'reto',
    isCurved: false,
    position: { x: 100, y: 520 },
    size: { width: 230, height: 190 },
    floors: 3,
    initialPositionsCount: 20,
    notes: 'Escritórios da diretoria executiva, gestão de pessoas, recrutamento & seleção e departamento pessoal.',
    supervisor: 'Dra. Valéria Andrade - Diretoria RH',
    slaTargetPercentage: 99.0,
    tags: ['Diretoria', 'RH', 'Gestão'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '2.140',
      activeAgentsToday: 18,
      slaPercent: 99.0,
      averageHandleTime: '12m 10s',
      growthRate: '98,4% Retenção',
      kpiCards: [
        { label: 'Contratações no Mês', value: '42', subValue: '+8 no prazo', trend: 'up', sparkline: [10, 15, 22, 28, 35, 42] },
        { label: 'Turnover Operacional', value: '2,1%', subValue: '-0,8 p.p.', trend: 'up', sparkline: [3.8, 3.4, 3.0, 2.6, 2.3, 2.1] },
        { label: 'Clima Organizacional', value: '89 pts', subValue: '+5 pts GPTW', trend: 'up', sparkline: [76, 79, 82, 85, 87, 89] },
        { label: 'Horas Treinadas', value: '1.280h', subValue: '+15%', trend: 'up', sparkline: [800, 920, 1050, 1180, 1280] }
      ],
      topIssues: [
        { rank: 1, title: 'Espelho de Ponto & Banco de Horas', volume: '1,8k', percent: 88 },
        { rank: 2, title: 'Benefício Vale Alimentação / Refeição', volume: '1,4k', percent: 70 },
        { rank: 3, title: 'Plano de Saúde & Odontológico', volume: '1,1k', percent: 55 },
        { rank: 4, title: 'Adiantamento 13º Salário', volume: '0,8k', percent: 40 },
        { rank: 5, title: 'Atestados Médicos & Homologação', volume: '0,5k', percent: 25 }
      ],
      channelDistribution: [
        { label: 'Portal do Colaborador', value: 90 },
        { label: 'WhatsApp RH', value: 75 },
        { label: 'Atendimento Balcão', value: 40 },
        { label: 'E-mail RH', value: 30 },
        { label: 'Teams', value: 20 }
      ]
    }
  },

  // 8. ADM 2 - Financial & Compliance Vault Block
  {
    id: 'bld-adm2',
    code: 'ADM-02',
    name: 'ADM 2',
    type: 'administrativo',
    category: 'Financeiro, Controladoria & Compliance',
    color: '#6d28d9', // Deep Purple
    secondaryColor: '#7c3aed',
    status: 'ativo',
    isoX: 480,
    isoY: 210,
    model: 'finance-vault',
    roofType: 'solar',
    customWidth: 140,
    customDepth: 100,
    customHeight: 110,
    cornerStyle: 'reto',
    isCurved: false,
    position: { x: 370, y: 520 },
    size: { width: 230, height: 190 },
    floors: 2,
    initialPositionsCount: 16,
    notes: 'Central de faturamento, conciliação bancária, auditoria jurídica e controles de compliance.',
    supervisor: 'Marcos Vinicius - Controladoria',
    slaTargetPercentage: 99.5,
    tags: ['Financeiro', 'Compliance', 'Auditoria'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '1.890',
      activeAgentsToday: 15,
      slaPercent: 99.5,
      averageHandleTime: '15m 30s',
      growthRate: '100% Conciliado',
      kpiCards: [
        { label: 'Notas Fiscais Emitidas', value: '18.420', subValue: '100% integradas', trend: 'up', sparkline: [12, 14, 15, 16, 17, 18] },
        { label: 'Auditorias Concluídas', value: '28', subValue: 'Sem ressalvas', trend: 'up', sparkline: [4, 8, 12, 18, 22, 28] },
        { label: 'Prazo Médio Contas', value: '2,4 dias', subValue: '-1 dia', trend: 'up', sparkline: [4.5, 4.0, 3.5, 3.0, 2.7, 2.4] },
        { label: 'Índice de Conformidade', value: '99,8%', subValue: '+0,2 p.p.', trend: 'up', sparkline: [99.2, 99.4, 99.5, 99.7, 99.8] }
      ],
      topIssues: [
        { rank: 1, title: 'Conciliação de Comissões de Vendas', volume: '1,2k', percent: 85 },
        { rank: 2, title: 'Envio de Informe de Rendimentos', volume: '0,9k', percent: 64 },
        { rank: 3, title: 'Liberação de Adiantamento Fornecedor', volume: '0,7k', percent: 50 },
        { rank: 4, title: 'Análise de Contrato Jurídico', volume: '0,5k', percent: 35 },
        { rank: 5, title: 'Certidões Negativas de Débitos (CND)', volume: '0,3k', percent: 21 }
      ],
      channelDistribution: [
        { label: 'ERP Protheus / SAP', value: 92 },
        { label: 'E-mail Controladoria', value: 65 },
        { label: 'Teams Corporativo', value: 45 },
        { label: 'Workflow Aprovações', value: 80 },
        { label: 'Telefonia', value: 15 }
      ]
    }
  },

  // 9. Salas de Apoio - Modular Training & Wellbeing Campus Pavilion
  {
    id: 'bld-apoio',
    code: 'ADM-SAP',
    name: 'Salas de Apoio',
    type: 'administrativo',
    category: 'Treinamento, Qualidade & Apoio',
    color: '#0f766e', // Teal
    secondaryColor: '#0d9488',
    status: 'ativo',
    isoX: 220,
    isoY: 210,
    model: 'support-campus',
    roofType: 'solar',
    customWidth: 160,
    customDepth: 90,
    customHeight: 85,
    cornerStyle: 'curvo',
    isCurved: true,
    position: { x: 920, y: 520 },
    size: { width: 240, height: 190 },
    floors: 1,
    initialPositionsCount: 16,
    notes: 'Salas de treinamento para novos operadores, monitoria de qualidade, ambulatório e sala de descompressão.',
    supervisor: 'Juliana Paes - Coordenação de Treinamento',
    slaTargetPercentage: 95.0,
    tags: ['Treinamento', 'Qualidade', 'Apoio'],
    isDemo: true,
    metricsExtended: {
      totalCallsMonth: '890',
      activeAgentsToday: 14,
      slaPercent: 95.0,
      averageHandleTime: '22m 00s',
      growthRate: '+18% Capacitados',
      kpiCards: [
        { label: 'Turmas de Integração', value: '14 turmas', subValue: '280 formados', trend: 'up', sparkline: [2, 4, 6, 8, 11, 14] },
        { label: 'Nota Média Avaliações', value: '9,4 / 10', subValue: '+0,4 pts', trend: 'up', sparkline: [8.6, 8.8, 9.0, 9.1, 9.3, 9.4] },
        { label: 'Monitorias de Qualidade', value: '2.450', subValue: '96% aderência', trend: 'up', sparkline: [1800, 1950, 2100, 2280, 2450] },
        { label: 'Atendimentos no Ambulatório', value: '84', subValue: 'Bem-estar ativo', trend: 'neutral', sparkline: [70, 75, 80, 82, 84] }
      ],
      topIssues: [
        { rank: 1, title: 'Agendamento de Sala de Treinamento', volume: '0,8k', percent: 88 },
        { rank: 2, title: 'Feedback de Monitoria de Qualidade', volume: '0,6k', percent: 66 },
        { rank: 3, title: 'Simulado de Atendimento ao Cliente', volume: '0,5k', percent: 55 },
        { rank: 4, title: 'Certificados de Capacitação NR-17', volume: '0,4k', percent: 44 },
        { rank: 5, title: 'Apoio Psicológico / Ergonômico', volume: '0,2k', percent: 22 }
      ],
      channelDistribution: [
        { label: 'Presencial Salas', value: 95 },
        { label: 'LMS E-learning', value: 85 },
        { label: 'Teams Treinamento', value: 60 },
        { label: 'WhatsApp Instrutores', value: 40 },
        { label: 'Chamados Qualidade', value: 30 }
      ]
    }
  }
];

// Helper to generate workstations with realistic statuses and operators
export function generateWorkstationsForBuilding(building: Building): Workstation[] {
  const workstations: Workstation[] = [];
  const count = building.initialPositionsCount;
  const cols = 6;
  const statuses: WorkstationStatus[] = [
    'em_atendimento', 'em_atendimento', 'em_atendimento', 'disponivel', 
    'em_atendimento', 'pausa', 'treinamento', 'disponivel'
  ];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const paNumber = (i + 1).toString().padStart(2, '0');
    const paCode = `PA-${paNumber}`;

    const statusIndex = (i * 3 + building.name.length) % statuses.length;
    const isOffline = i === count - 1 || (count > 20 && i === count - 2);
    const status: WorkstationStatus = isOffline ? 'offline' : statuses[statusIndex];

    const hasOperator = status !== 'offline' && status !== 'disponivel';
    const operatorName = MOCK_OPERATOR_NAMES[(i + building.name.charCodeAt(0)) % MOCK_OPERATOR_NAMES.length];
    
    let operator: Operator | null = null;
    if (hasOperator || status === 'disponivel') {
      const regId = 8000 + (i * 17) % 1999;
      operator = {
        id: `op-${building.id}-${i + 1}`,
        name: operatorName,
        registration: `MAT-${regId}`,
        email: `${operatorName.toLowerCase().replace(/\s+/g, '.')}@operacional.com.br`,
        role: building.type === 'produto' ? 'Operador de Atendimento' : 'Analista Administrativo',
        shift: i % 2 === 0 ? 'Manhã (08h - 14h)' : 'Tarde (14h - 20h)',
        npsScore: +(85 + (i * 3.7) % 15).toFixed(1),
        callsToday: Math.floor(18 + (i * 4) % 35)
      };
    }

    const ramalNumber = 4000 + (building.code.charCodeAt(0) * 10) + i;

    workstations.push({
      id: `${building.id}-pa-${paNumber}`,
      buildingId: building.id,
      code: paCode,
      row,
      col,
      status,
      operator,
      equipment: {
        monitor: 'Dell 24" P2419H',
        headset: 'Jabra Evolve 20 USB',
        ramal: `${ramalNumber}`
      },
      callDurationSeconds: status === 'em_atendimento' ? Math.floor(45 + (i * 37) % 520) : undefined,
      queue: building.type === 'produto' ? `Fila Atendimento ${building.name}` : `Chamados ${building.name}`
    });
  }

  return workstations;
}

export function generateAllInitialWorkstations(): Record<string, Workstation[]> {
  const map: Record<string, Workstation[]> = {};
  for (const bld of INITIAL_BUILDINGS) {
    map[bld.id] = generateWorkstationsForBuilding(bld);
  }
  return map;
}
