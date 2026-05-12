import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Brain, Leaf, MessageSquare, BookOpen } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import JournalInterface from './components/JournalInterface';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'journal'>('chat');

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream" id="app-root">
      {/* Background/Hero Section */}
      <section className="relative h-[30vh] min-h-[250px] w-full flex items-center justify-center overflow-hidden" id="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1920" 
          alt="Espace de sérénité psychologique" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105"
          referrerPolicy="no-referrer"
          id="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/20 via-transparent to-brand-cream" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl" id="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl serif text-brand-ink font-light leading-tight mb-2" id="app-hero-title">
              Séléné &bull; <span className="italic">L'Ami Psy</span>
            </h1>
            <p className="text-stone-500 uppercase tracking-[0.3em] font-medium text-xs mb-8">Harmonie & Conscience</p>
            
            {/* Tab Navigation */}
            <nav className="flex items-center justify-center gap-2 p-1 bg-white/40 backdrop-blur-md rounded-full border border-stone-200 w-fit mx-auto shadow-sm" id="tab-nav">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'chat' ? 'bg-brand-olive text-white shadow-md' : 'text-stone-600 hover:bg-white/50'
                }`}
              >
                <MessageSquare size={16} />
                Discussion Live
              </button>
              <button 
                onClick={() => setActiveTab('journal')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'journal' ? 'bg-brand-olive text-white shadow-md' : 'text-stone-600 hover:bg-white/50'
                }`}
              >
                <BookOpen size={16} />
                Journal Intime
              </button>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-20 px-4 pb-20 flex-1 flex flex-col items-center" id="main-content">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8" id="grid-layout">
          {/* Sidebar / Context */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-6" id="sidebar">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-stone-100/40 backdrop-blur-sm p-6 rounded-[32px] border border-stone-200"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-olive text-white flex items-center justify-center mb-4">
                <Heart size={20} />
              </div>
              <h4 className="text-lg serif italic mb-2">Bienveillance</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                Chaque mot est accueilli avec respect. Séléné est là pour vous accompagner, pas pour vous juger.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-stone-100/40 backdrop-blur-sm p-6 rounded-[32px] border border-stone-200"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center text-stone-600 mb-4">
                <Leaf size={20} />
              </div>
              <h4 className="text-lg serif italic mb-2">Pleine Conscience</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                Utilisez le journal pour capturer vos émotions brutes et observer votre évolution au fil du temps.
              </p>
            </motion.div>
          </div>

          {/* Interface Display */}
          <div className="lg:col-span-9 w-full" id="interface-display">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {activeTab === 'chat' ? <ChatInterface /> : <JournalInterface />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-brand-olive/10 text-center" id="app-footer">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
           <h2 className="serif text-2xl" id="footer-logo">L'Ami Psy</h2>
           <p className="text-xs text-brand-ink/40 uppercase tracking-[0.2em]" id="footer-copyright">
             Art & Psychologie &bull; Conçu pour votre équilibre mental &bull; {new Date().getFullYear()}
           </p>
        </div>
      </footer>
    </div>
  );
}
