import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Radio, Mic, MicOff, Info } from 'lucide-react';
import AudioWave from './AudioWave';
import { useLiveChat } from '../hooks/useLiveChat';

export default function ChatInterface() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isListening,
    isSpeaking,
    handleSend,
    toggleListening
  } = useLiveChat({
    initialMessage: "Bonjour. Je suis Séléné, votre compagne de réflexion. Comment vous sentez-vous dans votre corps et votre esprit en ce moment ?"
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[700px] w-full max-w-2xl mx-auto bg-white rounded-[32px] shadow-2xl overflow-hidden border border-stone-200" id="chat-outer-container">
      {/* Header */}
      <div className="px-8 py-6 bg-white/40 border-b border-stone-100 flex items-center justify-between backdrop-blur-md" id="chat-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-olive flex items-center justify-center text-white font-serif italic text-xl shadow-inner">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold serif text-stone-900" id="app-title-header">Séléné</h3>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-olive/5 rounded-full border border-brand-olive/10">
                <Radio size={8} className="text-brand-olive animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-brand-olive">Live</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em] font-bold">Session d'accompagnement</p>
          </div>
        </div>
        <button className="text-stone-300 hover:text-stone-500 transition-colors" title="Informations">
          <Info size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 chat-scroll-container bg-white/50" 
        id="messages-container"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`px-6 py-4 rounded-[32px] text-lg leading-relaxed font-serif ${
                  msg.role === 'user' 
                    ? 'bg-brand-olive text-white rounded-tr-none shadow-sm italic' 
                    : 'bg-stone-50 text-stone-800 rounded-tl-none border border-stone-100 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-stone-50 px-6 py-3 rounded-[32px] rounded-tl-none border border-stone-100 italic font-serif text-stone-400">
                Séléné réfléchit...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Onde Audio Live Area */}
      <div className="px-8 border-t border-stone-50 bg-stone-50/20" id="audio-wave-section">
        <AudioWave isAnimating={isLoading || isListening || isSpeaking} />
      </div>

      {/* Input */}
      <div className="p-8 bg-white" id="input-container">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-50 text-red-500 border border-red-200 animate-pulse' 
                : 'bg-stone-50 text-stone-400 border border-stone-200 hover:bg-stone-100'
            }`}
            title={isListening ? "Arrêter le micro" : "Activer le micro"}
            id="mic-button"
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Je vous écoute..." : "Écrivez ici vos pensées..."}
              className="w-full bg-stone-50 border border-stone-200 rounded-[28px] px-6 py-4 text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-olive/10 focus:border-brand-olive transition-all placeholder:text-stone-400 font-serif text-lg"
              id="chat-input-field"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-14 h-14 rounded-full bg-brand-olive text-white flex items-center justify-center shadow-lg shadow-brand-olive/20 hover:scale-105 transition-transform disabled:opacity-30 disabled:hover:scale-100"
            id="send-button"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="mt-4 text-[10px] text-center text-stone-400 uppercase tracking-[0.1em] font-medium" id="professional-disclaimer">
          Séléné est une IA d'écoute et ne remplace pas un avis médical professionnel.
        </p>
      </div>
    </div>
  );
}
