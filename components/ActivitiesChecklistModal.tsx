import React, { useState, useMemo } from 'react';
import { XIcon, ClipboardListIcon, PlusIcon, TrashIcon, ExclamationTriangleIcon } from './Icon';

interface ActivityRow {
  id: number;
  description: string;
  hours: string;
  category: 'Ensino' | 'Pesquisa' | 'Extensão' | 'Outros';
}

// Re-using the useLocalStorage hook pattern
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
    } catch (error)
      {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const REQUIRED_HOURS = 180;

export const ActivitiesChecklistModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activities, setActivities] = useLocalStorage<ActivityRow[]>('activitiesChecklist', [
    { id: 1, description: '', hours: '', category: 'Ensino' }
  ]);

  const handleActivityChange = (id: number, field: keyof Omit<ActivityRow, 'id'>, value: string) => {
    setActivities(prev => prev.map(a => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const addActivity = () => {
    setActivities(prev => [...prev, { id: Date.now(), description: '', hours: '', category: 'Ensino' }]);
  };

  const removeActivity = (id: number) => {
    if (activities.length > 1) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  const totalHours = useMemo(() => {
    return activities.reduce((sum, activity) => {
      const hours = parseInt(activity.hours, 10);
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0);
  }, [activities]);

  const progressPercentage = Math.min((totalHours / REQUIRED_HOURS) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-2 sm:p-4" onClick={onClose}>
      <div className="bg-slate-50 dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ClipboardListIcon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Checklist de Atividades Complementares
          </h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700 dark:text-blue-300">Progresso</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{totalHours} / {REQUIRED_HOURS} horas</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ width: `${progressPercentage}%` }}>
                   {progressPercentage > 10 && `${progressPercentage.toFixed(0)}%`}
                </div>
            </div>
          </div>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Atenção</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Esta é uma ferramenta para <strong>controle pessoal</strong>. A validação oficial das horas e a elegibilidade de cada atividade dependem das regras do PPC e da análise da coordenação do curso.
                Consulte sempre as normas no <a href="https://sigaa.ufpb.br/sigaa/public/curso/portal.jsf?lc=pt_BR&id=1626809" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-yellow-800 dark:hover:text-yellow-200">Portal do Curso</a>.
              </p>
            </div>
          </div>

          <div>
            <div className="hidden sm:grid grid-cols-[1fr_120px_160px_60px] gap-2 mb-2 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
              <span>Descrição da Atividade</span>
              <span>Horas</span>
              <span>Categoria</span>
              <span>Ação</span>
            </div>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_160px_60px] gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 items-center">
                  <input 
                    type="text" 
                    placeholder="Ex: Semana de Engenharia 2024" 
                    value={activity.description} 
                    onChange={e => handleActivityChange(activity.id, 'description', e.target.value)} 
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" 
                    aria-label="Descrição da Atividade"
                  />
                  <input 
                    type="number" 
                    placeholder="Horas" 
                    value={activity.hours} 
                    onChange={e => handleActivityChange(activity.id, 'hours', e.target.value)} 
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" 
                    aria-label="Horas"
                  />
                   <select 
                      value={activity.category}
                      onChange={e => handleActivityChange(activity.id, 'category', e.target.value as ActivityRow['category'])}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                      aria-label="Categoria"
                   >
                      <option>Ensino</option>
                      <option>Pesquisa</option>
                      <option>Extensão</option>
                      <option>Outros</option>
                   </select>
                  <button 
                    onClick={() => removeActivity(activity.id)} 
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 rounded-full justify-self-center disabled:opacity-50" 
                    aria-label="Remover atividade" 
                    disabled={activities.length <= 1}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addActivity} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusIcon className="w-5 h-5" />
              Adicionar Nova Atividade
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
