import React, { useState, useEffect, useMemo } from 'react';
import { XIcon, CalculatorIcon, PlusIcon, TrashIcon } from './Icon';

interface DisciplineRow {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const CRAACalculatorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentCRAA, setCurrentCRAA] = useLocalStorage('craa_currentCRAA', '');
  const [currentCredits, setCurrentCredits] = useLocalStorage('craa_currentCredits', '');
  const [disciplines, setDisciplines] = useLocalStorage<DisciplineRow[]>('craa_disciplines', [{ id: 1, name: '', credits: '', grade: '' }]);

  const handleDisciplineChange = (id: number, field: keyof DisciplineRow, value: string) => {
    setDisciplines(prev => prev.map(d => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const addDiscipline = () => {
    setDisciplines(prev => [...prev, { id: Date.now(), name: '', credits: '', grade: '' }]);
  };

  const removeDiscipline = (id: number) => {
    setDisciplines(prev => prev.filter(d => d.id !== id));
  };
  
  const calculatedCRAA = useMemo(() => {
    const numCurrentCRAA = parseFloat(currentCRAA);
    const numCurrentCredits = parseInt(currentCredits, 10);

    if (isNaN(numCurrentCRAA) || isNaN(numCurrentCredits) || numCurrentCredits < 0) {
      return null;
    }

    let semesterCredits = 0;
    let semesterWeightedSum = 0;
    let hasValidDiscipline = false;

    disciplines.forEach(d => {
      const credits = parseInt(d.credits, 10);
      const grade = parseFloat(d.grade);
      if (!isNaN(credits) && !isNaN(grade) && credits > 0 && grade >= 0 && grade <= 10) {
        semesterCredits += credits;
        semesterWeightedSum += credits * grade;
        hasValidDiscipline = true;
      }
    });

    if (!hasValidDiscipline) {
        return numCurrentCRAA.toFixed(4);
    }

    const totalCredits = numCurrentCredits + semesterCredits;
    const totalWeightedSum = (numCurrentCRAA * numCurrentCredits) + semesterWeightedSum;

    if (totalCredits === 0) return null;

    const newCRAA = totalWeightedSum / totalCredits;
    return newCRAA.toFixed(4);

  }, [currentCRAA, currentCredits, disciplines]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
      <div className="bg-slate-50 dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl h-full max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CalculatorIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Calculadora de CRAA
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">Seu CRAA projetado para o fim do período é:</p>
            <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">{calculatedCRAA ?? '---'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentCRAA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seu CRAA Atual</label>
              <input type="number" id="currentCRAA" value={currentCRAA} onChange={e => setCurrentCRAA(e.target.value)} placeholder="Ex: 8.5" className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="currentCredits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Créditos Cursados</label>
              <input type="number" id="currentCredits" value={currentCredits} onChange={e => setCurrentCredits(e.target.value)} placeholder="Ex: 120" className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Disciplinas do Período Atual</h3>
            <div className="space-y-3">
              {disciplines.map((d, index) => (
                <div key={d.id} className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <input 
                    type="text" 
                    placeholder={`Disciplina ${index + 1}`} 
                    value={d.name} 
                    onChange={e => handleDisciplineChange(d.id, 'name', e.target.value)} 
                    className="flex-grow w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mb-2 sm:mb-0" 
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input 
                      type="number" 
                      placeholder="Créditos" 
                      value={d.credits} 
                      onChange={e => handleDisciplineChange(d.id, 'credits', e.target.value)} 
                      className="w-24 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" 
                    />
                    <input 
                      type="number" 
                      placeholder="Nota" 
                      value={d.grade} 
                      onChange={e => handleDisciplineChange(d.id, 'grade', e.target.value)} 
                      className="w-24 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" 
                    />
                    <button 
                      onClick={() => removeDiscipline(d.id)} 
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500" 
                      aria-label="Remover disciplina" 
                      disabled={disciplines.length <= 1}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addDiscipline} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusIcon className="w-5 h-5" />
              Adicionar Disciplina
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};