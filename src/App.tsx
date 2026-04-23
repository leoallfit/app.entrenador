/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageBlueprint } from './types';
import { generateInitialBlueprint, morphBlueprint } from './lib/gemini';
import SectionRenderer from './components/SectionRenderer';
import { ControlPanel } from './components/ControlPanel';
import { Palette, Sparkles, Wand2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [blueprint, setBlueprint] = useState<PageBlueprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<PageBlueprint[]>([]);

  // Load from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('automorph_blueprint');
    if (saved) {
      try {
        setBlueprint(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved blueprint", e);
      }
    }
  }, []);

  // Save to localStorage when blueprint changes
  useEffect(() => {
    if (blueprint) {
      localStorage.setItem('automorph_blueprint', JSON.stringify(blueprint));
    }
  }, [blueprint]);

  const handleMorph = async (instruction: string) => {
    setIsGenerating(true);
    try {
      if (!blueprint) {
        const initial = await generateInitialBlueprint(instruction);
        setBlueprint(initial);
      } else {
        const updated = await morphBlueprint(instruction, blueprint);
        setHistory(prev => [...prev, blueprint]);
        setBlueprint(updated);
      }
    } catch (error) {
      console.error("Morph failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres borrar este diseño?')) {
      setBlueprint(null);
      setHistory([]);
      localStorage.removeItem('automorph_blueprint');
    }
  };

  const isBoldTypography = blueprint?.theme.mode === 'bold-typography';

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-1000",
      blueprint?.theme.mode === 'dark' || isBoldTypography ? "bg-[#000000]" : blueprint?.theme.mode === 'brutalist' ? "bg-white" : "bg-zinc-50"
    )}>
      {/* Navigation / Header */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between transition-all backdrop-blur-md",
        blueprint ? (isBoldTypography ? "bg-black border-b-4 border-white" : "bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800") : "bg-transparent"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20",
            isBoldTypography ? "bg-neon text-black rounded-none border-2 border-white" : "rounded-xl bg-emerald-500"
          )}>
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            {isBoldTypography && <span className="font-mono text-[8px] uppercase tracking-widest text-neon leading-none mb-1">AI-Engine // Prototype</span>}
            <span className={cn(
              "text-xl font-black tracking-tight uppercase leading-none",
              isBoldTypography ? "text-white italic" : (blueprint?.theme.mode === 'dark' ? "text-white" : "text-zinc-900")
            )}>
              {isBoldTypography ? (
                <>Auto<span className="text-neon">Morph</span></>
              ) : (
                <>AutoMorph <span className="text-emerald-500">AI</span></>
              )}
            </span>
          </div>
        </div>

        {blueprint && (
          <div className="hidden md:flex items-center gap-6">
             <div className="flex gap-2">
                {isBoldTypography && <div className="px-3 py-1 border-2 border-white text-[10px] uppercase font-black bg-white text-black">Live Process</div>}
                <span className={cn(
                  "text-sm font-medium px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700",
                  isBoldTypography ? "border-neon text-neon font-mono text-xs uppercase rounded-none px-3 py-1" : (blueprint?.theme.mode === 'dark' ? "text-zinc-400" : "text-zinc-600")
                )}>
                    {isBoldTypography ? "v0.8.4_STABLE" : `Estilo: ${blueprint.theme.mode}`}
                </span>
             </div>
          </div>
        )}
      </nav>

      <main className={cn("pt-20", isBoldTypography ? "pb-12" : "pb-40")}>
        <AnimatePresence mode="wait">
          {!blueprint ? (
            <motion.center 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="px-6 py-32 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-12 shadow-inner border border-zinc-200 dark:border-zinc-700">
                 <Wand2 size={48} className="text-emerald-500" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter mb-8 max-w-4xl">
                 Tus ideas se convierten en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Realidad Dynamic</span>
              </h1>
              <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
                Describe lo que necesitas y observa cómo nuestra IA diseña, escribe y programa un sitio web profesional en segundos.
              </p>
            </motion.center>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-0"
            >
              {blueprint.sections.map((section) => (
                // @ts-ignore
                <SectionRenderer 
                  key={section.id} 
                  section={section} 
                  blueprint={blueprint as any} 
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {isBoldTypography && blueprint && (
        <footer className="h-12 flex items-center border-t-4 border-white bg-black fixed bottom-0 left-0 right-0 z-40 overflow-hidden">
          <div className="bg-white text-black font-black px-4 h-full flex items-center mr-4 shrink-0 transition-all hover:bg-neon">DYNAMIC FEED</div>
          <div className="flex-1 overflow-hidden h-full flex items-center relative">
            <div className="whitespace-nowrap flex marquee-text">
              {[1, 2].map(i => (
                <span key={i} className="font-mono text-[10px] uppercase tracking-widest text-white inline-block px-4">
                  AI-Powered Dynamic Content Creator v1.0.8 // Processing instructions in real-time // Neural network optimized for creative synthesis // Design 'Bold_Typography' active // Neural link: stable // Status: Ready for instructions...
                </span>
              ))}
            </div>
          </div>
          <div className="hidden md:flex ml-4 font-mono text-[10px] opacity-60 gap-4 mr-6 shrink-0">
            <span>MEM: 12GB</span>
            <span>OS: AM_CORE_V1</span>
          </div>
        </footer>
      )}

      <div className={isBoldTypography ? "fixed bottom-14 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50" : ""}>
        <ControlPanel 
          onMorph={handleMorph} 
          isGenerating={isGenerating} 
          onReset={handleReset}
          hasBlueprint={!!blueprint}
        />
      </div>

      {/* Background Decor */}
      {!blueprint && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>
      )}

      {/* Success Indicator after morph */}
      <AnimatePresence>
         {isGenerating && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
           >
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 border border-zinc-200 dark:border-zinc-800">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold dark:text-white">Repensando el diseño...</h3>
                  <p className="text-sm text-zinc-500 mt-1 italic">"Ajustando las dimensiones de la creatividad"</p>
                </div>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

