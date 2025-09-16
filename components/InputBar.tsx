import React from 'react';
import { SendIcon, MicrophoneIcon } from './Icon';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  isListening: boolean;
  onMicrophoneClick: () => void;
}

export const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading, placeholder, inputValue, onInputChange, isListening, onMicrophoneClick }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={isListening ? 'Ouvindo...' : placeholder}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-500 dark:placeholder-gray-400"
          autoComplete="off"
        />
        <button
            type="button"
            onClick={onMicrophoneClick}
            disabled={isLoading}
            className={`w-12 h-12 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 transition duration-200 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500'}`}
            aria-label={isListening ? 'Parar de ouvir' : 'Usar microfone'}
        >
            <MicrophoneIcon className="w-6 h-6" />
        </button>
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 transform hover:scale-105"
          aria-label="Enviar mensagem"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <SendIcon className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};