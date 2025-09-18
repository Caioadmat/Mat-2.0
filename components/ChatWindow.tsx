import React, { useRef, useEffect } from 'react';
import type { Message as MessageType } from '../types';
import { Message } from './Message';
import { MatIcon, AcademicCapIcon, ChatBubbleIcon, BriefcaseIcon, StarIcon, LinkIcon, SettingsIcon } from './Icon';

const QUICK_MENU_ITEMS = [
    {
        title: 'Currículo e PPC',
        prompt: 'Me fale sobre o fluxograma e o PPC do curso',
        icon: <AcademicCapIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
    },
    {
        title: 'Campo de Atuação',
        prompt: 'Qual o campo de atuação para um engenheiro de materiais?',
        icon: <SettingsIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
    },
    {
        title: 'Contatos',
        prompt: 'Como posso entrar em contato com o CAEMAT ou a coordenação?',
        icon: <ChatBubbleIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
    },
    {
        title: 'Estágio e TCC',
        prompt: 'Quais são as regras para estágio e TCC?',
        icon: <BriefcaseIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
    },
    {
        title: 'Atividades Comp.',
        prompt: 'Como funcionam as atividades complementares?',
        icon: <StarIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
    },
    {
        title: 'Portal SIGAA',
        prompt: 'O que é o SIGAA e como acessá-lo?',
        icon: <LinkIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
    }
];

const WelcomeScreen: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
        <div className="p-4 bg-white dark:bg-gray-700 rounded-full shadow-md mb-6">
            <MatIcon className="w-16 h-16 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Olá! Eu sou o Mat.</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">Seu assistente do CAEMAT para o curso de Engenharia de Materiais. Como posso te auxiliar hoje?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {QUICK_MENU_ITEMS.map((item) => (
                <button
                    key={item.prompt}
                    onClick={() => onPromptClick(item.prompt)}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
                    aria-label={`Perguntar sobre ${item.title}`}
                >
                    {item.icon}
                    <span>{item.title}</span>
                </button>
            ))}
        </div>
    </div>
);


interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onFeedback: (messageId: number, feedback: 'up' | 'down') => void;
  onCopy: (text: string) => void;
  onSpeak: (text: string) => void;
  onExport: (text: string) => void;
  onShare: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage, onFeedback, onCopy, onSpeak, onExport, onShare }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showWelcomeScreen = messages.length === 0 && !isLoading;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {showWelcomeScreen ? (
            <WelcomeScreen onPromptClick={onSendMessage} />
        ) : (
            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <Message
                        key={msg.id}
                        message={msg}
                        isLastMessage={index === messages.length - 1}
                        isLoading={isLoading}
                        onFeedback={onFeedback}
                        onCopy={onCopy}
                        onSpeak={onSpeak}
                        onExport={onExport}
                        onShare={onShare}
                    />
                ))}
            </div>
        )}
        <div ref={endOfMessagesRef} />
    </div>
  );
};