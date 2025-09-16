import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpeechRecognition } from '../types';

type SpeechRecognitionHook = {
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
    hasRecognitionSupport: boolean;
};

export function useSpeechRecognition(onTranscript: (transcript: string) => void): SpeechRecognitionHook {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const hasRecognitionSupport = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    useEffect(() => {
        if (!hasRecognitionSupport) {
            return;
        }

        const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionApi();
        recognition.continuous = false;
        recognition.lang = 'pt-BR';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            setIsListening(false);
        };
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            if (transcript) {
                onTranscript(transcript);
            }
        };
        recognitionRef.current = recognition;
    }, [hasRecognitionSupport, onTranscript]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return { isListening, startListening, stopListening, hasRecognitionSupport };
}
