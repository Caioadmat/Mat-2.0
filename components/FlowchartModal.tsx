import React, { useState, useMemo } from 'react';
import { flowchartData, optionalDisciplines, Discipline } from '../data/flowchartData';
import { XIcon, LinkIcon } from './Icon';

const allDisciplinesList = [...flowchartData.flat(), ...optionalDisciplines].filter((d): d is Discipline => d !== null);

const disciplineMap = new Map<string, Discipline>();
allDisciplinesList.forEach(d => disciplineMap.set(d.code, d));

interface DisciplineCellProps {
  discipline: Discipline | null;
  onClick: (discipline: Discipline) => void;
  onHover: (code: string | null) => void;
  isHovered: boolean;
  isPrerequisite: boolean;
  isSuccessor: boolean;
  isSelected: boolean;
}

const DisciplineCell: React.FC<DisciplineCellProps> = ({ discipline, onClick, onHover, isHovered, isPrerequisite, isSuccessor, isSelected }) => {
  if (!discipline) {
    return <div className="border border-gray-200 dark:border-gray-700 rounded-md min-h-[100px] bg-gray-50/50 dark:bg-gray-800/50"></div>;
  }

  const baseClasses = "border rounded-md p-2 flex flex-col justify-between min-h-[100px] transition-all duration-200 cursor-pointer shadow-sm relative";
  const typeClasses = discipline.type === 'demat' ? 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600' : 'bg-gray-100 border-gray-300 dark:bg-gray-800/70 dark:border-gray-600';
  
  const ringClasses = [
    isHovered && 'ring-4 ring-yellow-400 scale-105 shadow-lg z-10',
    isSelected && 'ring-4 ring-purple-500',
    isPrerequisite && 'ring-4 ring-blue-400',
    isSuccessor && 'ring-4 ring-green-400'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`${baseClasses} ${typeClasses} ${ringClasses}`}
      onMouseEnter={() => onHover(discipline.code)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(discipline)}
      title={discipline.name}
    >
      {discipline.prerequisites.length > 0 && (
        <div className="absolute top-1.5 right-1.5" title="Possui pré-requisitos">
          <LinkIcon className="w-3 h-3 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight pr-3">{discipline.name}</p>
      <div className="flex justify-between items-end mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{discipline.code}</span>
        <span className="text-xs font-semibold text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-600 px-1.5 py-0.5 rounded">{discipline.credits} CR</span>
      </div>
    </div>
  );
};

const DisciplineDetails: React.FC<{ discipline: Discipline; onClose: () => void; onHover: (code: string | null) => void; }> = ({ discipline, onClose, onHover }) => {
    return (
        <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 h-full">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Detalhes da Disciplina</h3>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Fechar detalhes">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{discipline.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{discipline.code} &bull; {discipline.credits} Créditos</p>
                </div>

                <div>
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Pré-requisitos</h5>
                    {discipline.prerequisites.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {discipline.prerequisites.map(code => (
                                <li key={code} onMouseEnter={() => onHover(code)} onMouseLeave={() => onHover(null)} className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                    {disciplineMap.get(code)?.name || code}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum pré-requisito.</p>
                    )}
                </div>
                 <a 
                    href="https://sigaa.ufpb.br/sigaa/public/curso/portal.jsf?lc=pt_BR&id=1626809" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                    <LinkIcon className="w-4 h-4" />
                    Ver no Portal do Curso (SIGAA)
                </a>
            </div>
        </aside>
    );
};

const FlowchartLegend: React.FC = () => (
    <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"></div><span>DEMAT</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/70"></div><span>Outros Deptos.</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3"><LinkIcon className="w-full h-full text-gray-400 dark:text-gray-500" /></div><span>Possui Pré-requisitos</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded ring-2 ring-blue-400"></div><span>Pré-requisito</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded ring-2 ring-green-400"></div><span>Dependência</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded ring-2 ring-purple-500"></div><span>Selecionada</span></div>
    </div>
);


export const FlowchartModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [hoveredDisciplineCode, setHoveredDisciplineCode] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);

  const { prerequisites, successors } = useMemo(() => {
    if (!hoveredDisciplineCode) return { prerequisites: new Set(), successors: new Set() };
    
    const hovered = disciplineMap.get(hoveredDisciplineCode);
    const successorsList = allDisciplinesList.filter(d => d.prerequisites.includes(hoveredDisciplineCode)).map(d => d.code);
    
    return {
      prerequisites: new Set(hovered?.prerequisites || []),
      successors: new Set(successorsList),
    };
  }, [hoveredDisciplineCode]);

  const creditsPerSemester = useMemo(() => {
    return Array.from({ length: 10 }, (_, semesterIndex) => 
        flowchartData.reduce((total, row) => {
            const discipline = row[semesterIndex];
            return total + (discipline ? discipline.credits : 0);
        }, 0)
    );
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-screen-2xl h-full max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Fluxograma - Engenharia de Materiais</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 flex flex-row overflow-hidden">
            <main className="flex-1 overflow-auto p-4">
              {/* Main Flowchart Grid */}
              <div className="grid grid-cols-[40px_repeat(10,minmax(140px,1fr))] gap-2 text-center font-semibold text-gray-700 dark:text-gray-300">
                {/* Header Row */}
                <div className="sticky top-0 bg-slate-50 dark:bg-gray-900 z-20"></div>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="sticky top-0 bg-slate-100 dark:bg-gray-800 p-2 rounded-md shadow-sm z-20">{i + 1}º Período</div>
                ))}

                {/* Discipline Rows */}
                {flowchartData.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <div className="flex items-center justify-center font-bold text-gray-500 dark:text-gray-400">{String.fromCharCode(65 + rowIndex)}</div>
                    {row.map((discipline, colIndex) => (
                      <DisciplineCell
                        key={discipline?.code || `${rowIndex}-${colIndex}`}
                        discipline={discipline}
                        onClick={(d) => setSelectedDiscipline(d)}
                        onHover={setHoveredDisciplineCode}
                        isHovered={hoveredDisciplineCode === discipline?.code}
                        isPrerequisite={prerequisites.has(discipline?.code || '')}
                        isSuccessor={successors.has(discipline?.code || '')}
                        isSelected={selectedDiscipline?.code === discipline?.code}
                      />
                    ))}
                  </React.Fragment>
                ))}

                {/* Footer Row - Credits */}
                <div className="font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center">CR</div>
                {creditsPerSemester.map((credits, i) => (
                    <div key={i} className="p-2 mt-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-bold rounded-md">
                        {credits}
                    </div>
                ))}
              </div>

              {/* Optional Disciplines Section */}
              <div className="mt-8">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">Conteúdos Complementares Optativos</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {optionalDisciplines.map((discipline) => (
                         <DisciplineCell
                           key={discipline.code}
                           discipline={discipline}
                           onClick={(d) => setSelectedDiscipline(d)}
                           onHover={setHoveredDisciplineCode}
                           isHovered={hoveredDisciplineCode === discipline.code}
                           isPrerequisite={prerequisites.has(discipline.code)}
                           isSuccessor={successors.has(discipline.code)}
                           isSelected={selectedDiscipline?.code === discipline.code}
                         />
                    ))}
                 </div>
              </div>
            </main>
            {selectedDiscipline && <DisciplineDetails discipline={selectedDiscipline} onClose={() => setSelectedDiscipline(null)} onHover={setHoveredDisciplineCode} />}
        </div>
        <FlowchartLegend />
      </div>
    </div>
  );
};