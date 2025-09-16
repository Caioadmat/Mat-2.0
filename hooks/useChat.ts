import { useState, useEffect, useCallback, useRef } from 'react';
import { Chat } from '@google/genai';
import type { Message } from '../types';
import { createChatSession } from '../services/geminiService';
import { MAT_PERSONA } from '../constants';

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatSessionRef = useRef<Chat | null>(null);

    // Carregar/salvar mensagens do/para localStorage
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem('chatHistory');
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error("Falha ao carregar mensagens do localStorage", error);
            setMessages([]);
        }
    }, []);

    useEffect(() => {
        try {
            if (messages.length > 0) {
                localStorage.setItem('chatHistory', JSON.stringify(messages));
            } else {
                localStorage.removeItem('chatHistory');
            }
        } catch (error) {
            console.error("Falha ao salvar mensagens no localStorage", error);
        }
    }, [messages]);
    
    const initializeChatSession = useCallback(() => {
        try {
            const session = createChatSession(MAT_PERSONA.systemInstruction);
            if (session) {
                chatSessionRef.current = session;
                setError(null);
            } else {
                setError('A chave de API não foi configurada. O assistente não pode ser inicializado.');
            }
        } catch (e) {
            setError('Ocorreu um erro inesperado ao inicializar o assistente.');
            console.error(e);
        }
    }, []);

    useEffect(() => {
        initializeChatSession();
    }, [initializeChatSession]);

    const sendMessage = useCallback(async (text: string) => {
        if (!chatSessionRef.current || !text.trim()) return;

        setIsLoading(true);
        setError(null);
        const userMessage: Message = { id: Date.now(), role: 'user', content: text };
        setMessages((prev) => [...prev, userMessage]);

        const modelMessageId = Date.now() + 1;
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: '', feedback: null }]);

        try {
            const stream = await chatSessionRef.current.sendMessageStream({ message: text });
            let modelResponse = '';

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => prev.map(m =>
                    m.id === modelMessageId ? { ...m, content: modelResponse } : m
                ));
            }

        } catch (e) {
            const errorMessage = 'Ocorreu um erro ao comunicar com a IA. Por favor, tente novamente.';
            setError(errorMessage);
            console.error(e);
            setMessages(prev => prev.map(m =>
                m.id === modelMessageId ? { ...m, content: errorMessage } : m
            ));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearChat = useCallback(() => {
        try {
            localStorage.removeItem('chatHistory');
            setMessages([]);
            initializeChatSession(); // Reinicia a sessão de chat para limpar o histórico do lado do servidor.
        } catch (error) {
            console.error("Falha ao limpar o histórico do chat", error);
        }
    }, [initializeChatSession]);

    const handleFeedback = useCallback((messageId: number, feedback: 'up' | 'down') => {
        setMessages(prev =>
            prev.map(m => (m.id === messageId ? { ...m, feedback } : m))
        );
    }, []);

    return { messages, isLoading, error, sendMessage, clearChat, handleFeedback };
}