import type { ReactElement } from 'react';

export type Role = 'user' | 'model';

export interface Message {
  id: number;
  role: Role;
  content: string;
  feedback?: 'up' | 'down' | null;
}

export interface Persona {
  id: string;
  name: string;
  systemInstruction: string;
  icon: ReactElement;
  promptPlaceholder: string;
}

// Web Speech API Types for TypeScript
export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}
export interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}
export interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}
export interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}