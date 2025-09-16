import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MAT_PERSONA } from './constants';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { MatIcon, SettingsIcon, TrashIcon, FlowchartIcon, LinkIcon, SunIcon, MoonIcon, WhatsAppIcon, AcademicCapIcon } from './components/Icon';
import { useChat } from './hooks/useChat';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { FlowchartModal } from './components/FlowchartModal';
import { FreshmanGuideModal } from './components/FreshmanGuideModal';

const ApiKeyErrorScreen: React.FC = () => (
    <div className="h-screen w-screen flex flex-col items-center justify-center font-sans bg-red-50 text-red-800 p-4">
        <h1 className="text-2xl font-bold mb-2">Erro de Configuração</h1>
        <p className="text-center">A chave de API para o serviço de IA não foi encontrada.<br />Por favor, configure a variável de ambiente `API_KEY` para que o assistente funcione.</p>
    </div>
);

type Theme = 'light' | 'dark';

const App: React.FC = () => {
    if (!process.env.API_KEY) {
        return <ApiKeyErrorScreen />;
    }

    const [input, setInput] = useState('');
    const { messages, isLoading, error: chatError, sendMessage, clearChat, handleFeedback } = useChat();

    const onTranscript = useCallback((transcript: string) => {
        sendMessage(transcript);
    }, [sendMessage]);

    const { isListening, startListening, stopListening } = useSpeechRecognition(onTranscript);
    const { voices, selectedVoiceURI, setSelectedVoiceURI, speechRate, setSpeechRate, speak } = useSpeechSynthesis();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLinksOpen, setIsLinksOpen] = useState(false);
    const [isFlowchartVisible, setIsFlowchartVisible] = useState(false);
    const [isFreshmanGuideVisible, setIsFreshmanGuideVisible] = useState(false);
    const [theme, setTheme] = useState<Theme>('light');

    const settingsRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(storedTheme || (prefersDark ? 'dark' : 'light'));
    }, []);
    
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
            if (linksRef.current && !linksRef.current.contains(event.target as Node)) {
                setIsLinksOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;
        sendMessage(text);
        setInput('');
    };
    
    const handleMicrophoneClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };
    
    const handleClearChat = () => {
        if (window.confirm('Tem certeza de que deseja limpar o histórico desta conversa?')) {
            clearChat();
        }
    };

    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy text: ', err));
    }, []);

    return (
        <div className="h-screen w-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 bg-slate-50 dark:bg-gray-900">
            <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center space-x-3">
                <MatIcon className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{MAT_PERSONA.name}</h1>
              </div>
              <div className="flex items-center space-x-2">
                 <button 
                    onClick={() => setIsFreshmanGuideVisible(true)}
                    className="px-3 py-2 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/80 rounded-lg transition-colors flex items-center space-x-1"
                    aria-label="Ver Guia do Calouro"
                 >
                    <AcademicCapIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Guia do Calouro</span>
                 </button>
                 <button 
                    onClick={() => setIsFlowchartVisible(true)}
                    className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/80 rounded-lg transition-colors flex items-center space-x-1"
                    aria-label="Ver fluxograma do curso"
                 >
                    <FlowchartIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Fluxograma</span>
                 </button>
                 <a 
                    href="https://chat.whatsapp.com/IoEhJ15LwCEK8UTWtRNViG"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900/80 rounded-lg transition-colors flex items-center space-x-1"
                    aria-label="Entrar no grupo do WhatsApp"
                 >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Grupo Eng. Mat.</span>
                 </a>
                 <div className="relative" ref={linksRef}>
                     <button
                        onClick={() => setIsLinksOpen(prev => !prev)}
                        className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/80 rounded-lg transition-colors flex items-center space-x-1"
                        aria-label="Links úteis"
                     >
                        <LinkIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Links Úteis</span>
                     </button>
                     {isLinksOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 py-1">
                             <a 
                                href="https://sigaa.ufpb.br/sigaa/public/home.jsf" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Acessar o portal SIGAA"
                             >
                                Portal SIGAA
                             </a>
                             <a 
                                href="https://atendimento.ct.ufpb.br/index.php?a=add&catid=24" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Acessar o portal de atendimento da coordenação"
                             >
                                Atendimento Coordenação
                             </a>
                             <a 
                                href="https://sigeventos.ufpb.br/eventos/login.xhtml" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Acessar o SigEventos"
                             >
                                SigEventos
                             </a>
                             <a 
                                href="https://www.ufpb.br/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Acessar o site da UFPB"
                             >
                                Site UFPB
                             </a>
                        </div>
                     )}
                 </div>
                 <button 
                      onClick={handleClearChat}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-red-500 dark:hover:bg-gray-700 rounded-full transition-colors"
                      aria-label="Limpar conversa"
                  >
                      <TrashIcon className="w-6 h-6" />
                  </button>
                   <button 
                      onClick={toggleTheme}
                      className="p-2 text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                      aria-label="Alternar tema"
                  >
                      {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                  </button>
                  <div className="relative" ref={settingsRef}>
                      <button 
                          onClick={() => setIsSettingsOpen(prev => !prev)}
                          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-full transition-colors"
                          aria-label="Configurações de voz"
                      >
                          <SettingsIcon className="w-6 h-6" />
                      </button>
                      {isSettingsOpen && (
                          <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-72 bg-white dark:bg-gray-900 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Configurações de Voz</h3>
                              <div className="space-y-2">
                                  <label htmlFor="voice-select" className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Voz</label>
                                  <select 
                                      id="voice-select"
                                      value={selectedVoiceURI}
                                      onChange={(e) => setSelectedVoiceURI(e.target.value)}
                                      disabled={voices.length === 0}
                                      className="text-sm bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                  >
                                      {voices.length > 0 ? voices.map(voice => (
                                          <option key={voice.voiceURI} value={voice.voiceURI}>
                                              {voice.name}
                                          </option>
                                      )) : <option>Nenhuma voz encontrada</option>}
                                  </select>
                              </div>
                              <div className="space-y-2">
                                   <label htmlFor="rate-select" className="text-sm font-medium text-gray-600 dark:text-gray-400 block">Velocidade: <span className="font-bold">{speechRate.toFixed(1)}x</span></label>
                                  <input 
                                      id="rate-select" 
                                      type="range" 
                                      min="0.5" 
                                      max="2" 
                                      step="0.1" 
                                      value={speechRate}
                                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                  />
                              </div>
                          </div>
                      )}
                  </div>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-blue-100 dark:from-gray-900 dark:to-blue-900/30">
              <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} onFeedback={handleFeedback} onCopy={handleCopy} onSpeak={speak} />
              {chatError && <div className="px-6 py-2 text-center text-red-700 bg-red-100 border-t border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800">{chatError}</div>}
              <InputBar 
                  onSendMessage={handleSendMessage} 
                  isLoading={isLoading} 
                  placeholder={MAT_PERSONA.promptPlaceholder}
                  inputValue={input}
                  onInputChange={setInput}
                  isListening={isListening}
                  onMicrophoneClick={handleMicrophoneClick}
              />
            </main>
            {isFlowchartVisible && <FlowchartModal onClose={() => setIsFlowchartVisible(false)} />}
            {isFreshmanGuideVisible && <FreshmanGuideModal onClose={() => setIsFreshmanGuideVisible(false)} />}
        </div>
    );
};

export default App;