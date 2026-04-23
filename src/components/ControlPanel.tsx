
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, RotateCcw, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PageBlueprint } from '../types';

interface Props {
  onMorph: (instruction: string) => Promise<void>;
  isGenerating: boolean;
  onReset: () => void;
  hasBlueprint: boolean;
}

export function ControlPanel({ onMorph, isGenerating, onReset, hasBlueprint }: Props) {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onMorph(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
      <motion.div 
        layout
        className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              {isGenerating ? 'AI trabajando...' : hasBlueprint ? 'AutoMorph Activo' : 'Esperando Prompt'}
            </span>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-6"
            >
              {!hasBlueprint ? (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">¿Qué quieres crear hoy?</h2>
                  <p className="text-zinc-400 text-sm">Describe tu empresa, producto o idea y deja que la IA construya el sitio por ti.</p>
                </div>
              ) : (
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-300">Sugiere un cambio</h3>
                  <button 
                    onClick={onReset}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <RotateCcw size={12} />
                    Resetear
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={hasBlueprint ? "Ej: 'Hazlo modo oscuro y añade precios'..." : "Ej: 'Una app de entrenamiento personal con planes de suscripción'..."}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl px-6 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all pr-16"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-emerald-500 text-zinc-900 font-bold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>

              {!hasBlueprint && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Agencia Creativa', 'SaaS de Inversión', 'E-commerce de Ropa', 'Portfolio de Diseño'].map(hint => (
                    <button
                      key={hint}
                      onClick={() => setInput(hint)}
                      className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
