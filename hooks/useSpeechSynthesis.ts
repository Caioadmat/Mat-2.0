import { useState, useEffect, useCallback } from 'react';

export function useSpeechSynthesis() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
    const [speechRate, setSpeechRate] = useState(1);

    const populateVoiceList = useCallback(() => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) return;

        const ptVoices = availableVoices.filter(voice => voice.lang.startsWith('pt'));
        setVoices(ptVoices);
        const googleVoice = ptVoices.find(v => v.name.includes('Google'));
        if (googleVoice) {
            setSelectedVoiceURI(googleVoice.voiceURI);
        } else if (ptVoices.length > 0) {
            setSelectedVoiceURI(ptVoices[0].voiceURI);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }
        populateVoiceList(); // Chamar uma vez para o caso de as vozes já estarem carregadas.
    }, [populateVoiceList]);

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window && text) {
            window.speechSynthesis.cancel(); // Cancelar qualquer fala anterior
            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.lang = 'pt-BR';
            utterance.rate = speechRate;
            window.speechSynthesis.speak(utterance);
        } else if (!('speechSynthesis' in window)) {
            alert('Seu navegador não suporta a funcionalidade de leitura de texto.');
        }
    }, [voices, selectedVoiceURI, speechRate]);

    return { voices, selectedVoiceURI, setSelectedVoiceURI, speechRate, setSpeechRate, speak };
}