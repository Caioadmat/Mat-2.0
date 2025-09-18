import React, { useState, useMemo, useEffect } from 'react';
import { flowchartData, optionalDisciplines, Discipline } from '../data/flowchartData';
import { XIcon, LinkIcon, CheckCircleIcon, ClockIcon, RefreshIcon, ClipboardListIcon, ExclamationTriangleIcon } from './Icon';

type DisciplineStatus = 'completed' | 'in_progress' | 'pending';

const allDisciplinesList = [...flowchartData.flat(), ...optionalDisciplines].filter((d): d is Discipline => d !== null);

const disciplineMap = new Map<string, Discipline>();
allDisciplinesList.forEach(d => disciplineMap.set(d.code, d));

const mandatoryDisciplines = flowchartData.flat().filter((d): d is Discipline => d !== null);
const totalMandatoryCredits = mandatoryDisciplines.reduce((sum, d) => sum + d.credits, 0);

interface DisciplineCellProps {
  discipline: Discipline | null;
  status?: DisciplineStatus;
  onClick: (discipline: Discipline) => void;
  onHover: (code: string | null) => void;
  isHovered: boolean;
  isPrerequisite: boolean;
  isSuccessor: boolean;
  isSelected: boolean;
  isPlanned: boolean;
}

const DisciplineCell: React.FC<DisciplineCellProps> = ({ discipline, status, onClick, onHover, isHovered, isPrerequisite, isSuccessor, isSelected, isPlanned }) => {
  if (!discipline) {
    return <div className="border border-gray-200 dark:border-gray-700 rounded-md min-h-[100px] bg-gray-50/50 dark:bg-gray-800/50"></div>;
  }

  const baseClasses = "border rounded-md p-2 flex flex-col justify-between min-h-[100px] transition-all duration-200 cursor-pointer shadow-sm relative";
  
  const statusClasses = {
      completed: 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700',
      in_progress: 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700',
      pending: discipline.type === 'demat' ? 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600' : 'bg-gray-100 border-gray-300 dark:bg-gray-800/70 dark:border-gray-600',
  };
  
  const typeClasses = status ? statusClasses[status] : statusClasses['pending'];
  
  const ringClasses = [
    isHovered && 'ring-4 ring-yellow-400 scale-105 shadow-lg z-10',
    isSelected && 'ring-4 ring-purple-500',
    isPrerequisite && 'ring-4 ring-blue-400',
    isSuccessor && 'ring-4 ring-green-400',
    isPlanned && 'ring-4 ring-orange-400'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`${baseClasses} ${typeClasses} ${ringClasses}`}
      onMouseEnter={() => onHover(discipline.code)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(discipline)}
      title={discipline.name}
    >
        <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight pr-3">{discipline.name}</p>
             <div className="flex-shrink-0">
                {status === 'completed' && <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-500" />}
                {status === 'in_progress' && <ClockIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />}
             </div>
        </div>
      <div className="flex justify-between items-end mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{discipline.code}</span>
        <span className="text-xs font-semibold text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-600 px-1.5 py-0.5 rounded">{discipline.credits} CR</span>
      </div>
    </div>
  );
};

const DisciplineDetails: React.FC<{ discipline: Discipline; status?: DisciplineStatus; onStatusChange: (status: DisciplineStatus) => void; onClose: () => void; onHover: (code: string | null) => void; }> = ({ discipline, status, onStatusChange, onClose, onHover }) => {
    const statusButtonStyle = (s: DisciplineStatus) => {
        const base = "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors w-full";
        if (s === status) {
            return `${base} bg-blue-600 text-white cursor-default`;
        }
        return `${base} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600`;
    };
    
    return (
        <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0 h-full">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Detalhes da Disciplina</h3>
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Fechar detalhes">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{discipline.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{discipline.code} &bull; {discipline.credits} Créditos</p>
                </div>

                <div>
                    <h5 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Meu Progresso</h5>
                    <div className="grid grid-cols-3 gap-2">
                        <button className={statusButtonStyle('completed')} onClick={() => onStatusChange('completed')}>✅ Concluída</button>
                        <button className={statusButtonStyle('in_progress')} onClick={() => onStatusChange('in_progress')}>🟡 Cursando</button>
                        <button className={statusButtonStyle('pending')} onClick={() => onStatusChange('pending')}>⚪ Pendente</button>
                    </div>
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

const ProgressTracker: React.FC<{ statuses: Record<string, DisciplineStatus>; onReset: () => void; }> = ({ statuses, onReset }) => {
    const completedCredits = useMemo(() => {
        return mandatoryDisciplines.reduce((sum, d) => {
            if (statuses[d.code] === 'completed') {
                return sum + d.credits;
            }
            return sum;
        }, 0);
    }, [statuses]);

    const percentage = totalMandatoryCredits > 0 ? (completedCredits / totalMandatoryCredits) * 100 : 0;

    return (
        <div className="flex-1 flex items-center gap-4 text-sm">
            <div className="flex-1">
                <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Progresso do Curso</span>
                    <span className="text-gray-600 dark:text-gray-400">{completedCredits} / {totalMandatoryCredits} créditos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
            <span className="font-bold text-lg text-blue-700 dark:text-blue-400">{percentage.toFixed(1)}%</span>
            <button
                onClick={onReset}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-500 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Limpar progresso"
            >
                <RefreshIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


export const FlowchartModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [statuses, setStatuses] = useState<Record<string, DisciplineStatus>>({});
  const [hoveredDisciplineCode, setHoveredDisciplineCode] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [isPlanningMode, setIsPlanningMode] = useState(false);
  const [plannedDisciplines, setPlannedDisciplines] = useState<Set<string>>(new Set());


  useEffect(() => {
    try {
        const savedStatuses = localStorage.getItem('flowchartProgress');
        if (savedStatuses) {
            setStatuses(JSON.parse(savedStatuses));
        }
    } catch (e) {
        console.error("Failed to load flowchart progress:", e);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('flowchartProgress', JSON.stringify(statuses));
    } catch (e) {
        console.error("Failed to save flowchart progress:", e);
    }
  }, [statuses]);

  const handleResetProgress = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o seu progresso? Esta ação não pode ser desfeita.')) {
        setStatuses({});
        setSelectedDiscipline(null);
    }
  };
  
  const handleDisciplineClick = (discipline: Discipline) => {
    if (isPlanningMode) {
      setPlannedDisciplines(prev => {
        const newSet = new Set(prev);
        if (newSet.has(discipline.code)) {
          newSet.delete(discipline.code);
        } else {
          newSet.add(discipline.code);
        }
        return newSet;
      });
    } else {
      setSelectedDiscipline(discipline);
    }
  };
  
  const planningSummary = useMemo(() => {
    if (!isPlanningMode) return null;

    const warnings: string[] = [];
    let totalCredits = 0;
    const plannedList: Discipline[] = [];

    plannedDisciplines.forEach(code => {
      const discipline = disciplineMap.get(code);
      if (discipline) {
        totalCredits += discipline.credits;
        plannedList.push(discipline);
        discipline.prerequisites.forEach(prereqCode => {
          if (statuses[prereqCode] !== 'completed') {
            const prereqDiscipline = disciplineMap.get(prereqCode);
            const prereqName = prereqDiscipline?.name || prereqCode;
            warnings.push(`'${discipline.name}' requer '${prereqName}', que não está marcada como concluída.`);
          }
        });
      }
    });

    return { warnings, totalCredits, plannedList };
  }, [isPlanningMode, plannedDisciplines, statuses]);

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
          <div className="flex-1 flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">Fluxograma</h2>
            <ProgressTracker statuses={statuses} onReset={handleResetProgress} />
             <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                <label htmlFor="planning-toggle" className="flex items-center cursor-pointer">
                    <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">Modo Planejamento</span>
                     <div className="relative">
                        <input type="checkbox" id="planning-toggle" className="sr-only peer" checked={isPlanningMode} onChange={() => setIsPlanningMode(!isPlanningMode)} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </div>
                </label>
            </div>
          </div>
          <button onClick={onClose} className="p-1 ml-4 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 flex flex-row overflow-hidden relative">
            <main className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-[40px_repeat(10,minmax(140px,1fr))] gap-2 text-center font-semibold text-gray-700 dark:text-gray-300">
                <div className="sticky top-0 bg-slate-50 dark:bg-gray-900 z-20"></div>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="sticky top-0 bg-slate-100 dark:bg-gray-800 p-2 rounded-md shadow-sm z-20 text-xs sm:text-sm">{i + 1}º Período</div>
                ))}

                {flowchartData.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <div className="flex items-center justify-center font-bold text-gray-500 dark:text-gray-400">{String.fromCharCode(65 + rowIndex)}</div>
                    {row.map((discipline, colIndex) => (
                      <DisciplineCell
                        key={discipline?.code || `${rowIndex}-${colIndex}`}
                        discipline={discipline}
                        status={statuses[discipline?.code || '']}
                        onClick={handleDisciplineClick}
                        onHover={setHoveredDisciplineCode}
                        isHovered={hoveredDisciplineCode === discipline?.code}
                        isPrerequisite={prerequisites.has(discipline?.code || '')}
                        isSuccessor={successors.has(discipline?.code || '')}
                        isSelected={selectedDiscipline?.code === discipline?.code}
                        isPlanned={plannedDisciplines.has(discipline?.code || '')}
                      />
                    ))}
                  </React.Fragment>
                ))}

                <div className="font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center">CR</div>
                {creditsPerSemester.map((credits, i) => (
                    <div key={i} className="p-2 mt-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 font-bold rounded-md">
                        {credits}
                    </div>
                ))}
              </div>

              <div className="mt-8">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">Conteúdos Complementares Optativos</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {optionalDisciplines.map((discipline) => (
                         <DisciplineCell
                           key={discipline.code}
                           discipline={discipline}
                           status={statuses[discipline.code]}
                           onClick={handleDisciplineClick}
                           onHover={setHoveredDisciplineCode}
                           isHovered={hoveredDisciplineCode === discipline.code}
                           isPrerequisite={prerequisites.has(discipline.code)}
                           isSuccessor={successors.has(discipline.code)}
                           isSelected={selectedDiscipline?.code === discipline.code}
                           isPlanned={plannedDisciplines.has(discipline.code || '')}
                         />
                    ))}
                 </div>
              </div>
            </main>
            {selectedDiscipline && !isPlanningMode && (
                <DisciplineDetails 
                    discipline={selectedDiscipline} 
                    status={statuses[selectedDiscipline.code] || 'pending'}
                    onStatusChange={(newStatus) => {
                        setStatuses(prev => {
                            const newStatuses = {...prev};
                            if (newStatus === 'pending') {
                                delete newStatuses[selectedDiscipline.code];
                            } else {
                                newStatuses[selectedDiscipline.code] = newStatus;
                            }
                            return newStatuses;
                        });
                    }}
                    onClose={() => setSelectedDiscipline(null)} 
                    onHover={setHoveredDisciplineCode}
                />
            )}
        </div>
         {isPlanningMode && planningSummary && (
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 shadow-lg">
                <div className="flex justify-between items-start gap-6">
                    <div className='w-1/2'>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                            <ClipboardListIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            Plano de Matrícula
                        </h3>
                         <div className="max-h-24 overflow-y-auto pr-2">
                             <ul className="list-disc list-inside text-sm space-y-1">
                                {planningSummary.plannedList.length > 0 ? (
                                    planningSummary.plannedList.map(d => <li key={d.code} className="text-gray-700 dark:text-gray-300">{d.name}</li>)
                                ) : (
                                    <li className="text-gray-500 dark:text-gray-400">Clique nas disciplinas para adicioná-las ao plano.</li>
                                )}
                            </ul>
                         </div>
                    </div>
                    <div className="w-1/2">
                        <div className="text-right mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Créditos: </span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{planningSummary.totalCredits}</span>
                        </div>
                         {planningSummary.warnings.length > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-md p-2 max-h-24 overflow-y-auto">
                                <h4 className="font-semibold text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-1 mb-1">
                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                    Avisos de Pré-requisitos
                                </h4>
                                <ul className="list-disc list-inside text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                                    {planningSummary.warnings.map(w => <li key={w}>{w}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </footer>
        )}
      </div>
    </div>
  );
};