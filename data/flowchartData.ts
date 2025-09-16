export interface Discipline {
  id: string; // Grid position e.g. A1
  code: string; // Academic code e.g. MAT0001
  name: string;
  credits: number;
  prerequisites: string[]; // List of academic codes
  corequisites?: string[];
  type: 'demat' | 'other';
}

const grid: (Discipline | null)[][] = [
  // A
  [
    { id: 'A1', code: 'MAT0101', name: 'Cálculo Diferencial e Integral I', credits: 4, prerequisites: [], type: 'other' },
    { id: 'A2', code: 'MAT0102', name: 'Cálculo Diferencial e Integral II', credits: 4, prerequisites: ['MAT0101', 'MAT0103'], type: 'other' },
    { id: 'A3', code: 'MAT0104', name: 'Cálculo Diferencial e Integral III', credits: 4, prerequisites: ['MAT0102'], type: 'other' },
    { id: 'A4', code: 'EST0101', name: 'Cálculo das Probabilidades e Estatística I', credits: 4, prerequisites: ['MAT0101'], type: 'other' },
    { id: 'A5', code: 'DEMAT0101', name: 'Fenômenos de Transporte', credits: 4, prerequisites: ['DEMAT0102'], type: 'demat' },
    { id: 'A6', code: 'DEMAT0103', name: 'Termodinâmica', credits: 4, prerequisites: [], type: 'demat' },
    { id: 'A7', code: 'DEMAT0104', name: 'Transformações de Fases', credits: 4, prerequisites: ['DEMAT0103'], type: 'demat' },
    { id: 'A8', code: 'ECO0101', name: 'Introdução à Economia', credits: 4, prerequisites: [], type: 'other' },
    { id: 'A9', code: 'ADM0101', name: 'Administração para Engenharia', credits: 3, prerequisites: [], type: 'other' },
    { id: 'A10', code: 'DEMAT0105', name: 'Estágio Supervisionado em Engenharia de Materiais', credits: 19, prerequisites: [], type: 'demat' },
  ],
  // B
  [
    { id: 'B1', code: 'MAT0103', name: 'Cálculo Vetorial e Geometria Analítica', credits: 4, prerequisites: [], type: 'other' },
    { id: 'B2', code: 'MAT0105', name: 'Introdução à Álgebra Linear', credits: 4, prerequisites: ['MAT0103'], type: 'other' },
    { id: 'B3', code: 'MAT0106', name: 'Séries e Equações Diferencias Ordinárias', credits: 4, prerequisites: ['MAT0102', 'MAT0105'], type: 'other' },
    { id: 'B4', code: 'DEMAT0102', name: 'Mecânica dos Materiais I', credits: 4, prerequisites: ['MAT0104', 'MAT0106', 'FIS0102'], type: 'demat' },
    { id: 'B5', code: 'DEMAT0106', name: 'Mecânica dos Materiais II', credits: 4, prerequisites: ['DEMAT0102'], type: 'demat' },
    { id: 'B6', code: 'DEMAT0107', name: 'Propriedades Físicas dos Materiais', credits: 4, prerequisites: [], type: 'demat' },
    { id: 'B7', code: 'DEMAT0108', name: 'Materiais e Dispositivos Eletroeletrônicos', credits: 4, prerequisites: ['DEMAT0107'], type: 'demat' },
    { id: 'B8', code: 'DEMAT0109', name: 'Materiais Compósitos', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0123', 'DEMAT0128'], type: 'demat' },
    { id: 'B9', code: 'DEMAT0110', name: 'Trabalho de Conclusão de Curso', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0123', 'DEMAT0128'], type: 'demat' },
    null,
  ],
  // C
  [
    { id: 'C1', code: 'QUI0101', name: 'Química Básica - Estrutura', credits: 4, prerequisites: [], type: 'other' },
    { id: 'C2', code: 'FIS0101', name: 'Física Geral I', credits: 4, prerequisites: [], corequisites: ['MAT0101', 'MAT0103'], type: 'other' },
    { id: 'C3', code: 'FIS0102', name: 'Física Geral II', credits: 4, prerequisites: ['FIS0101'], type: 'other' },
    { id: 'C4', code: 'FIS0103', name: 'Física Geral III', credits: 4, prerequisites: ['FIS0102'], type: 'other' },
    { id: 'C5', code: 'DEMAT0111', name: 'Propriedades Mecânicas dos Materiais', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0123', 'DEMAT0128'], type: 'demat' },
    { id: 'C6', code: 'DEMAT0112', name: 'Tratamentos Térmicos', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0123', 'DEMAT0128'], type: 'demat' },
    { id: 'C7', code: 'DEMAT0113', name: 'Biomateriais', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0123', 'DEMAT0128'], type: 'demat' },
    { id: 'C8', code: 'DEMAT0114', name: 'Conformação Plástica dos Metais', credits: 4, prerequisites: ['DEMAT0107', 'DEMAT0124'], type: 'demat' },
    { id: 'C9', code: 'UCE0004', name: 'UCE em Engenharia IV', credits: 4, prerequisites: [], type: 'demat' },
    null,
  ],
  // D
  [
    { id: 'D1', code: 'QUI0102', name: 'Química Básica - Transformações', credits: 4, prerequisites: [], type: 'other' },
    { id: 'D2', code: 'QUI0103', name: 'Química Básica Experimental', credits: 4, prerequisites: [], type: 'other' },
    { id: 'D3', code: 'FIS0104', name: 'Física Experimental I', credits: 2, prerequisites: ['FIS0101'], type: 'other' },
    { id: 'D4', code: 'DEMAT0115', name: 'Meio Ambiente e Reciclagem dos Materiais', credits: 4, prerequisites: ['DEMAT0120'], type: 'demat' },
    { id: 'D5', code: 'FIS0105', name: 'Física Experimental II', credits: 2, prerequisites: ['FIS0103'], type: 'other' },
    { id: 'D6', code: 'DEMAT0116', name: 'Caracterização Mecânica dos Materiais', credits: 4, prerequisites: ['DEMAT0111'], type: 'demat' },
    { id: 'D7', code: 'DEMAT0117', name: 'Fundição de Metais', credits: 4, prerequisites: ['DEMAT0107'], type: 'demat' },
    { id: 'D8', code: 'DEMAT0130', name: 'Soldagem de Metais', credits: 4, prerequisites: ['DEMAT0107'], type: 'demat' },
    { id: 'D9', code: 'UCE0005', name: 'UCE em Engenharia V', credits: 4, prerequisites: [], type: 'demat' },
    null,
  ],
  // E
  [
    { id: 'E1', code: 'CI0101', name: 'Introdução à Programação', credits: 4, prerequisites: [], type: 'other' },
    { id: 'E2', code: 'QUI0104', name: 'Química Orgânica Teórica A', credits: 4, prerequisites: ['QUI0101'], type: 'other' },
    { id: 'E3', code: 'GEO0101', name: 'Geologia e Mineralogia', credits: 4, prerequisites: ['DEMAT0120'], type: 'other' },
    { id: 'E4', code: 'DEMAT0118', name: 'Materiais Cerâmicos', credits: 4, prerequisites: ['GEO0101'], type: 'demat' },
    { id: 'E5', code: 'DEMAT0119', name: 'Caracterização Microestrutural dos Materiais', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0123', 'DEMAT0128'], type: 'demat' },
    { id: 'E6', code: 'DEMAT0120', name: 'Corrosão e Degradação dos Materiais', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0123', 'DEMAT0128'], type: 'demat' },
    { id: 'E7', code: 'DEMAT0131', name: 'Processamento de Materiais Cerâmicos', credits: 4, prerequisites: ['DEMAT0118'], type: 'demat' },
    { id: 'E8', code: 'DEMAT0132', name: 'Produtos Cerâmicos Industriais', credits: 4, prerequisites: ['DEMAT0131'], type: 'demat' },
    { id: 'E9', code: 'UCE0006', name: 'UCE em Engenharia VI', credits: 4, prerequisites: [], type: 'demat' },
    null,
  ],
  // F
  [
    { id: 'F1', code: 'DEMAT0121', name: 'Introdução à Engenharia de Materiais', credits: 2, prerequisites: [], type: 'demat' },
    { id: 'F2', code: 'DEMAT0122', name: 'Introdução à Ciência dos Materiais', credits: 4, prerequisites: ['QUI0101'], type: 'demat' },
    { id: 'F3', code: 'DEMAT0123', name: 'Materiais Poliméricos I', credits: 4, prerequisites: ['QUI0104', 'DEMAT0122'], type: 'demat' },
    { id: 'F4', code: 'DEMAT0124', name: 'Materiais Poliméricos II', credits: 4, prerequisites: ['DEMAT0123'], type: 'demat' },
    { id: 'F5', code: 'DEMAT0125', name: 'Reologia dos Materiais', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0124', 'DEMAT0128'], corequisites:['DEMAT0106'], type: 'demat' },
    { id: 'F6', code: 'DEMAT0126', name: 'Processamento de Elastômeros e Termofixos', credits: 4, prerequisites: ['DEMAT0125'], type: 'demat' },
    { id: 'F7', code: 'DEMAT0127', name: 'Processamento de Termoplásticos', credits: 4, prerequisites: ['DEMAT0125'], type: 'demat' },
    { id: 'F8', code: 'DEMAT0133', name: 'Cerâmicas Avançadas', credits: 4, prerequisites: ['DEMAT0107'], type: 'demat' },
    { id: 'F9', code: 'UCE0007', name: 'UCE em Engenharia VII', credits: 2, prerequisites: [], type: 'demat' },
    null,
  ],
  // G
  [
    { id: 'G1', code: 'EDU0101', name: 'Metodologia do Trabalho Científico', credits: 4, prerequisites: [], type: 'other' },
    { id: 'G2', code: 'UCE0001', name: 'UCE em Engenharia I', credits: 4, prerequisites: [], type: 'demat' },
    { id: 'G3', code: 'ENG0101', name: 'Desenho Técnico para Engenharia de Materiais', credits: 4, prerequisites: [], type: 'other' },
    { id: 'G4', code: 'DEMAT0128', name: 'Materiais Metálicos', credits: 4, prerequisites: ['DEMAT0122'], type: 'demat' },
    { id: 'G5', code: 'DEMAT0129', name: 'Pesquisa Aplicada à Engenharia dos Materiais', credits: 4, prerequisites: ['MAT0102', 'EST0101'], type: 'demat' },
    { id: 'G6', code: 'UCE0003', name: 'UCE em Engenharia III', credits: 4, prerequisites: [], type: 'demat' },
    { id: 'G7', code: 'OPT0001', name: 'Optativa A', credits: 4, prerequisites: [], type: 'demat' },
    { id: 'G8', code: 'OPT0002', name: 'Optativa B', credits: 4, prerequisites: [], type: 'demat' },
    { id: 'G9', code: 'UCE0008', name: 'UCE em Engenharia VIII', credits: 2, prerequisites: [], type: 'demat' },
    null,
  ],
  // H
  [
    null,
    null,
    { id: 'H3', code: 'UCE0002', name: 'UCE em Engenharia II', credits: 2, prerequisites: [], type: 'demat' },
    { id: 'H4', code: 'DH0101', name: 'Relações Étnico-Raciais e Direitos Humanos no Brasil', credits: 2, prerequisites: [], type: 'other' },
    null,
    null,
    null,
    null,
    { id: 'H9', code: 'OPT0003', name: 'Optativa C', credits: 4, prerequisites: [], type: 'demat' },
    null,
  ],
];


export const flowchartData = grid;

export const optionalDisciplines: Discipline[] = [
    { id: 'OP1', code: 'DEMAT0201', name: 'Mecânica dos Materiais III', credits: 4, prerequisites: ['DEMAT0106'], type: 'demat'},
    { id: 'OP2', code: 'DEMAT0202', name: 'Cerâmicas Refratárias', credits: 4, prerequisites: ['DEMAT0118'], type: 'demat'},
    { id: 'OP3', code: 'DEMAT0203', name: 'Usinagem de Metais', credits: 4, prerequisites: ['DEMAT0107'], type: 'demat'},
    { id: 'OP4', code: 'DEMAT0204', name: 'Blendas Poliméricas', credits: 4, prerequisites: ['DEMAT0124'], type: 'demat'},
    { id: 'OP5', code: 'DEMAT0205', name: 'Modelagem de Materiais', credits: 4, prerequisites: ['DEMAT0101', 'DEMAT0106'], type: 'demat'},
    { id: 'OP6', code: 'DEMAT0206', name: 'Materiais Cimentícios', credits: 4, prerequisites: ['DEMAT0118'], type: 'demat'},
    { id: 'OP7', code: 'DEMAT0207', name: 'Siderurgia', credits: 4, prerequisites: ['DEMAT0107'], type: 'demat'},
    { id: 'OP8', code: 'DEMAT0208', name: 'Nanotecnologia de Polímeros', credits: 4, prerequisites: ['DEMAT0124'], type: 'demat'},
    { id: 'OP9', code: 'DEMAT0209', name: 'Seleção de Materiais', credits: 4, prerequisites: ['DEMAT0111', 'DEMAT0107'], type: 'demat'},
    { id: 'OP10', code: 'DEMAT0210', name: 'Tecnologia dos vidros', credits: 4, prerequisites: ['DEMAT0118'], type: 'demat'},
    { id: 'OP11', code: 'DEMAT0211', name: 'Metalurgia do Pó', credits: 4, prerequisites: ['DEMAT0107'], type: 'demat'},
    { id: 'OP12', code: 'SEG0101', name: 'Segurança do trabalho', credits: 4, prerequisites: [], type: 'other'},
    { id: 'OP13', code: 'GES0101', name: 'Gestão da Qualidade', credits: 4, prerequisites: ['DEMAT0118', 'DEMAT0124', 'DEMAT0128'], type: 'other'},
    { id: 'OP14', code: 'LIB0101', name: 'Libras', credits: 4, prerequisites: [], type: 'other'},
    { id: 'OP15', code: 'FIS0201', name: 'Laboratório de Instrumentação Científica II', credits: 4, prerequisites: ['DEMAT0108', 'FIS0105'], type: 'other'},
    { id: 'OP16', code: 'DEMAT0212', name: 'Técnicas Espectroscópicas para Polímeros', credits: 4, prerequisites: ['DEMAT0124'], type: 'demat'},
];
