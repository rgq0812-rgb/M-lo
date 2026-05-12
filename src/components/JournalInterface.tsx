import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Send, Mic, MicOff } from 'lucide-react';
import AudioWave from './AudioWave';
import { useLiveChat } from '../hooks/useLiveChat';

export default function JournalInterface() {
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
    initialMessage: "C'est votre moment d'introspection. Qu'avez-vous appris sur vous-même aujourd'hui ?"
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-xl mx-auto bg-stone-50/50 rounded-[40px] shadow-lg overflow-hidden border border-stone-200" id="journal-container">
      {/* Header */}
      <div className="px-8 py-6 border-b border-stone-200/50 flex items-center gap-4" id="journal-header">
        <div className="w-12 h-12 rounded-2xl bg-stone-200/50 flex items-center justify-center text-stone-600">
          <Book size={20} />
        </div>
        <div>
          <h3 className="text-xl font-serif italic text-stone-800" id="journal-title">Mon Journal Intime</h3>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Réflexion guidée par l'IA</p>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8 chat-scroll-container bg-white/20" 
        id="journal-messages"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] ${
                msg.role === 'user' 
                  ? 'bg-stone-800 text-stone-50 px-6 py-4 rounded-[30px] rounded-tr-none shadow-md' 
                  : 'bg-white text-stone-800 px-6 py-4 rounded-[30px] rounded-tl-none border border-stone-200'
              }`}>
                <p className="font-serif text-lg leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white/50 px-6 py-2 rounded-full border border-stone-100 text-stone-400 text-sm italic font-serif">
                 Séléné vous écoute...
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-8 bg-white/30 backdrop-blur-sm" id="journal-audio-wave">
        <AudioWave isAnimating={isLoading || isListening || isSpeaking} />
      </div>

      {/* Input */}
      <div className="p-8 bg-white/50 border-t border-stone-200/30" id="journal-input-section">
        <div className="flex gap-4">
          <button
            onClick={toggleListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Parlez librement..." : "Une pensée..."}
              className="w-full h-14 bg-white border border-stone-200 rounded-full px-6 focus:outline-none focus:ring-2 focus:ring-stone-200 font-serif text-lg"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 w-10 h-10 rounded-full bg-stone-800 text-stone-50 flex items-center justify-center disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
