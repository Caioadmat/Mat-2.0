import React, { useState } from 'react';
import { XIcon, FlaskIcon } from './Icon';
import { labsData } from '../data/labsData';
import { Lab } from '../types';

const LabCard: React.FC<{ lab: Lab; onSelect: () => void }> = ({ lab, onSelect }) => (
  <button onClick={onSelect} className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
    <h3 className="font-bold text-blue-700 dark:text-blue-400">{lab.name}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
      <span className="font-semibold">Responsáveis:</span> {lab.professors.join(', ')}
    </p>
  </button>
);

const LabDetails: React.FC<{ lab: Lab }> = ({ lab }) => (
  <div className="p-6 h-full overflow-y-auto">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{lab.name}</h2>
    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">{lab.professors.join(' • ')}</p>
    
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <p>{lab.description}</p>
      
      <h4 className="font-semibold mt-6">Principais Linhas de Pesquisa:</h4>
      <ul>
        {lab.researchLines.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  </div>
);


export const LabsGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedLab, setSelectedLab] = useState<Lab | null>(labsData[0]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
      <div className="bg-slate-50 dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-5xl h-full max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FlaskIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Guia de Laboratórios de Pesquisa - DEMAT
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <aside className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4 space-y-3">
            {labsData.map(lab => (
              <LabCard key={lab.id} lab={lab} onSelect={() => setSelectedLab(lab)} />
            ))}
          </aside>
          <main className="flex-1 overflow-hidden">
            {selectedLab ? (
              <LabDetails lab={selectedLab} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>Selecione um laboratório para ver os detalhes.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
