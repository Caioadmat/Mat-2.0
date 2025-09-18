import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message as MessageType } from '../types';
import { UserIcon, MatIcon, ThumbsUpIcon, ThumbsDownIcon, CopyIcon, SpeakerIcon, ExportIcon, ShareIcon } from './Icon';

interface MessageProps {
  message: MessageType;
  isLastMessage: boolean;
  isLoading: boolean;
  onFeedback: (messageId: number, feedback: 'up' | 'down') => void;
  onCopy: (text: string) => void;
  onSpeak: (text: string) => void;
  onExport: (text: string) => void;
  onShare: (text: string) => void;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></div>
    </div>
);

const TypingCursor: React.FC = () => (
  <span className="w-3 h-5 bg-gray-800 dark:bg-gray-200 inline-block ml-1 animate-pulse"></span>
);

const MessageActions: React.FC<{ message: MessageType, onFeedback: MessageProps['onFeedback'], onCopy: MessageProps['onCopy'], onSpeak: MessageProps['onSpeak'], onExport: MessageProps['onExport'], onShare: MessageProps['onShare'] }> = ({ message, onFeedback, onCopy, onSpeak, onExport, onShare }) => {
    const [tooltipText, setTooltipText] = useState<string | null>(null);

    const showTooltip = (text: string) => {
        setTooltipText(text);
        setTimeout(() => setTooltipText(null), 2000);
    };

    const handleCopyClick = () => {
        onCopy(message.content);
        showTooltip('Copiado!');
    };
    
    const handleShareClick = () => {
        onShare(message.content);
        showTooltip('Pronto para colar!');
    };
    
    const handleExportClick = () => {
        onExport(message.content);
        showTooltip('Baixando...');
    };

    const hasFeedback = message.feedback === 'up' || message.feedback === 'down';

    return (
        <div className="flex justify-end items-center space-x-2 mt-2 text-gray-500 dark:text-gray-400">
            <style>{`
                @keyframes fade-in-up-subtle {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up-subtle { animation: fade-in-up-subtle 0.3s ease-out forwards; }
            `}</style>
            
            <div className="relative">
                {tooltipText && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800 text-xs font-semibold rounded-md shadow-lg animate-fade-in-up-subtle whitespace-nowrap pointer-events-none">
                        {tooltipText}
                    </div>
                )}
                <button onClick={handleCopyClick} className="p-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Copiar mensagem">
                    <CopyIcon className="w-4 h-4" />
                </button>
            </div>
             <button onClick={handleShareClick} className="p-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Compartilhar">
                <ShareIcon className="w-4 h-4" />
            </button>
            <button onClick={handleExportClick} className="p-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Exportar como .txt">
                <ExportIcon className="w-4 h-4" />
            </button>
            <div className="border-l h-4 border-gray-300 dark:border-gray-600 mx-1"></div>
            <button
                onClick={() => onFeedback(message.id, 'up')}
                className={`p-1 transition-colors ${message.feedback === 'up' ? 'text-blue-600 dark:text-blue-500' : 'hover:text-blue-600 dark:hover:text-blue-500'} disabled:text-gray-400 dark:disabled:text-gray-500 disabled:hover:text-gray-400`}
                aria-label="Gostei"
                disabled={hasFeedback}
            >
                <ThumbsUpIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => onFeedback(message.id, 'down')}
                className={`p-1 transition-colors ${message.feedback === 'down' ? 'text-red-600 dark:text-red-500' : 'hover:text-red-600 dark:hover:text-red-500'} disabled:text-gray-400 dark:disabled:text-gray-500 disabled:hover:text-gray-400`}
                aria-label="Não gostei"
                disabled={hasFeedback}
            >
                <ThumbsDownIcon className="w-4 h-4" />
            </button>
            <button onClick={() => onSpeak(message.content)} className="p-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors" aria-label="Ouvir"><SpeakerIcon className="w-4 h-4" /></button>
        </div>
    );
};

const MessageComponent: React.FC<MessageProps> = ({ message, isLastMessage, isLoading, onFeedback, onCopy, onSpeak, onExport, onShare }) => {
  const { role, content } = message;
  const isUser = role === 'user';
  const isTyping = content === 'loading';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-br-none'
    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
  const icon = isUser ? <UserIcon className="w-full h-full text-white" /> : <MatIcon className="w-full h-full text-gray-600 dark:text-gray-300" />;
  const iconContainerClasses = isUser ? 'bg-blue-600 ml-2 sm:ml-3 order-2' : 'bg-gray-200 dark:bg-gray-600 mr-2 sm:mr-3 order-1';

  const proseClasses = `prose max-w-none prose-p:my-2 ${isUser ? 'prose-invert' : 'dark:prose-invert'}`;

  return (
    <div className={`flex items-start my-4 ${containerClasses}`}>
      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${iconContainerClasses} flex-shrink-0`}>
        {icon}
      </div>
      <div className={`px-4 py-3 rounded-2xl max-w-[calc(100%-4rem)] sm:max-w-lg md:max-w-xl lg:max-w-2xl order-${isUser ? 1 : 2} ${bubbleClasses}`}>
        {isTyping ? <LoadingIndicator /> : (
          <div className={proseClasses}>
             <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={!isUser ? "text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-700" : "font-medium underline"}
                      />
                    ),
                }}
             >
                {content}
             </ReactMarkdown>
             {isLastMessage && isLoading && <TypingCursor />}
          </div>
        )}
        {!isUser && !isTyping && content && <MessageActions message={message} onFeedback={onFeedback} onCopy={onCopy} onSpeak={onSpeak} onExport={onExport} onShare={onShare} />}
      </div>
    </div>
  );
};

export const Message = React.memo(MessageComponent);