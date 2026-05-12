import { useState, useRef, useEffect, useCallback } from 'react';
import { getGeminiResponse, Message } from '../services/geminiService';

interface UseLiveChatProps {
  initialMessage: string;
  onResponse?: (text: string) => void;
}

export function useLiveChat({ initialMessage }: UseLiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoListenTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- TTS Logic ---
  const speak = useCallback((text: string, onComplete?: () => void) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.1;
    utterance.pitch = 1.05;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (isListening) stopListening();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    };
    
    window.speechSynthesis.speak(utterance);
  }, [isListening]);

  // --- STT Logic ---
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      if (currentTranscript) {
        setInput(currentTranscript);
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(() => {
          handleSend(currentTranscript);
        }, 4000);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      setIsListening(false);
    }
  }, []);

  const handleSend = async (textToSend?: string) => {
    const finalInput = textToSend || input;
    if (!finalInput.trim() || isLoading) return;

    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (autoListenTimeoutRef.current) clearTimeout(autoListenTimeoutRef.current);
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    stopListening();

    const userMessage: Message = { role: 'user', text: finalInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(newMessages);
      setMessages([...newMessages, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-action after AI response
  useEffect(() => {
    if (!isLoading && messages.length > 1 && messages[messages.length - 1].role === 'model') {
      const lastMessage = messages[messages.length - 1].text;
      speak(lastMessage, () => {
        startListening();
        if (autoListenTimeoutRef.current) clearTimeout(autoListenTimeoutRef.current);
        autoListenTimeoutRef.current = setTimeout(() => {
          stopListening();
        }, 30000);
      });
    }
  }, [isLoading]); // Removed messages from deps to avoid double trigger if not careful, but isLoading toggle is enough

  return {
    messages,
    input,
    setInput,
    isLoading,
    isListening,
    isSpeaking,
    handleSend,
    startListening,
    stopListening,
    toggleListening: () => isListening ? stopListening() : startListening()
  };
}
