
import React from 'react';
import { motion } from 'motion/react';
import { Section, PageBlueprint } from '../types';
import { 
  Check, 
  ArrowRight, 
  Star, 
  Smartphone, 
  Zap, 
  Shield, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  Briefcase,
  Users
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  section: Section;
  blueprint: PageBlueprint;
}

const ICON_MAP: Record<string, any> = {
  smartphone: Smartphone,
  zap: Zap,
  shield: Shield,
  star: Star,
  trending: TrendingUp,
  briefcase: Briefcase,
  users: Users,
  mail: Mail,
  phone: Phone,
  map: MapPin,
};

export default function SectionRenderer(props: any) {
  const { section, blueprint } = props;
  const { type, data, config } = section;
  const { theme } = blueprint;

  const isDarkMode = theme.mode === 'dark' || theme.mode === 'bold-typography';
  const isBrutalist = theme.mode === 'brutalist';
  const isBoldTypography = theme.mode === 'bold-typography';
  
  const textClass = cn(
    isDarkMode ? 'text-white' : 'text-zinc-900',
    isBoldTypography ? 'font-sans uppercase' : (theme.fontFamily === 'serif' ? 'font-serif' : theme.fontFamily === 'mono' ? 'font-mono' : 'font-sans')
  );

  const containerPadding = cn(
    config?.padding === 'small' ? 'py-8' : config?.padding === 'large' ? 'py-32' : 'py-16',
    isBoldTypography && "grid-pattern border-x-4 border-white/10"
  );

  const renderHero = () => (
    <section className={cn(containerPadding, "relative overflow-hidden")}>
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {isBoldTypography && <span className="font-mono text-xs uppercase tracking-[0.5em] text-neon mb-4 block">System // Initialize</span>}
          <h1 className={cn(
            "text-5xl md:text-8xl font-black mb-6 leading-[0.9]",
            isBrutalist ? "uppercase tracking-tighter" : isBoldTypography ? "uppercase italic tracking-tighter" : "tracking-tight",
            textClass
          )}>
            {(data.title || "").split(' ').map((word: string, i: number) => (
               <span key={i} className={i % 2 === 1 && isBoldTypography ? "text-neon" : ""}>{word} </span>
            ))}
          </h1>
          <p className={cn("text-xl mb-8 opacity-80 max-w-lg", textClass, isBoldTypography && "font-mono text-sm tracking-widest")}>
            {data.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className={cn(
              "px-8 py-4 font-bold rounded-lg transition-all",
              isBrutalist ? "brutalist-button" : isBoldTypography ? "bg-neon text-black skew-box font-black uppercase text-xl hover:bg-white" : "bg-zinc-900 text-white hover:scale-105"
            )} style={!isBrutalist && !isBoldTypography ? { backgroundColor: theme.accentColor } : {}}>
              {data.ctaText}
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </button>
          </div>
        </motion.div>
        
        {data.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {isBoldTypography && <div className="absolute -top-4 -left-4 bg-white text-black px-4 py-2 font-black uppercase skew-box z-10">Live_Seed</div>}
            <img 
              src={data.imageUrl} 
              alt="Hero" 
              className={cn(
                "w-full rounded-2xl shadow-2xl object-cover aspect-video md:aspect-square",
                (isBrutalist || isBoldTypography) && "brutalist-border rounded-none border-4 border-white"
              )}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </div>
    </section>
  );

  const renderFeatures = () => (
    <section className={cn(containerPadding, isBoldTypography ? "bg-zinc-900/30" : isDarkMode ? "bg-zinc-900/50" : "bg-zinc-100/50")}>
      <div className="container mx-auto px-6">
        <div className={cn("mb-16 px-6", isBoldTypography ? "border-l-8 border-neon pl-12" : "text-center")}>
          <h2 className={cn("text-4xl md:text-6xl font-black mb-4 uppercase", textClass)}>{data.title}</h2>
          <p className={cn("opacity-60 max-w-2xl", isBoldTypography ? "font-mono uppercase text-sm" : "mx-auto", textClass)}>{data.description}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 px-6">
          {data.items?.map((item: any, i: number) => {
            const Icon = ICON_MAP[item.icon?.toLowerCase()] || Star;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "p-8 rounded-2xl transition-all",
                  (isBrutalist || isBoldTypography) ? "border-2 border-white bg-black/50 hover:border-neon" : isDarkMode ? "bg-white/5 hover:bg-white/10" : "bg-white hover:shadow-xl shadow-sm",
                  isBoldTypography && "rounded-none"
                )}
              >
                <div className="w-12 h-12 rounded-lg mb-6 flex items-center justify-center text-white" style={isBoldTypography ? { backgroundColor: '#CCFF00', color: 'black' } : { backgroundColor: theme.accentColor }}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={cn("text-xl font-black mb-3 italic uppercase", textClass)}>{item.title}</h3>
                <p className={cn("opacity-70", textClass, isBoldTypography && "text-sm lowercase font-mono")}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderPrices = () => (
    <section className={cn(containerPadding)}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={cn("text-5xl font-black uppercase italic", textClass)}>{data.title || 'Planes y Precios'}</h2>
          {isBoldTypography && <p className="font-mono text-neon mt-2 uppercase tracking-widest text-xs">// Subscription Matrix //</p>}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {data.plans?.map((plan: any, i: number) => (
            <div key={i} className={cn(
              "p-8 rounded-3xl relative overflow-hidden transition-all",
              plan.popular ? "ring-2 scale-105 z-10" : "",
              (isBrutalist || isBoldTypography) ? "border-4 border-white bg-zinc-900 rounded-none shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)]" : isDarkMode ? "bg-zinc-800" : "bg-white shadow-lg",
              isBoldTypography && plan.popular && "border-neon shadow-[10px_10px_0px_0px_rgba(204,255,0,0.2)]"
            )} style={plan.popular && !isBrutalist && !isBoldTypography ? { ringColor: theme.accentColor } : {}}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-zinc-900 text-white px-4 py-1 text-xs font-bold uppercase rounded-bl-xl" style={isBoldTypography ? { backgroundColor: '#CCFF00', color: 'black' } : { backgroundColor: theme.accentColor }}>
                  Popular
                </div>
              )}
              <h3 className={cn("text-2xl font-black mb-2 uppercase", textClass)}>{plan.name}</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className={cn("text-5xl font-black italic", textClass, isBoldTypography && "text-neon")}>{plan.price}</span>
                <span className={cn("opacity-50 font-mono text-xs uppercase", textClass)}>/month</span>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features?.map((f: string, fi: number) => (
                  <li key={fi} className={cn("flex items-center gap-3", textClass)}>
                    <Check className={cn("w-5 h-5", isBoldTypography ? "text-neon" : "text-emerald-500")} />
                    <span className="opacity-80 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <button className={cn(
                "w-full py-4 rounded-xl font-black transition-all uppercase",
                isBrutalist ? "brutalist-button" : isBoldTypography ? "bg-white text-black skew-box hover:bg-neon" : plan.popular ? "bg-zinc-900 text-white" : "border-2 border-zinc-200 hover:border-zinc-900",
                isBoldTypography && "rounded-none h-14"
              )} style={plan.popular && !isBrutalist && !isBoldTypography ? { backgroundColor: theme.accentColor } : {}}>
                Elegir Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderGallery = () => (
    <section className={cn(containerPadding)}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.images?.map((img: string, i: number) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "overflow-hidden aspect-square",
                (isBrutalist || isBoldTypography) ? "border-4 border-white rounded-none" : "rounded-2xl shadow-md"
              )}
            >
              <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderCTA = () => (
    <section className={cn(containerPadding, "container mx-auto px-6")}>
      <div className={cn(
        "p-12 md:p-24 rounded-3xl text-center relative overflow-hidden",
        isBrutalist ? "brutalist-border bg-zinc-900 text-white" : isBoldTypography ? "bg-neon text-black skew-box rounded-none border-t-8 border-white" : "bg-zinc-900 text-white"
      )} style={!isBrutalist && !isBoldTypography ? { backgroundColor: theme.accentColor } : {}}>
        <h2 className={cn("text-4xl md:text-8xl font-black mb-6 uppercase", isBoldTypography ? "italic" : "")}>{data.title}</h2>
        <p className={cn("text-xl opacity-80 mb-10 max-w-2xl mx-auto", isBoldTypography && "font-mono uppercase text-sm")}>{data.subtitle}</p>
        <button className={cn(
          "px-12 py-5 font-black uppercase tracking-widest text-lg transition-transform",
          isBrutalist ? "bg-white text-black border-2 border-black" : isBoldTypography ? "bg-black text-white border-2 border-white hover:bg-zinc-800" : "bg-white text-zinc-900 hover:scale-105"
        )}>
          {data.buttonText}
        </button>
      </div>
    </section>
  );

  const renderContent = () => (
    <section className={cn(containerPadding)}>
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className={cn("text-3xl md:text-5xl font-black mb-8 uppercase italic border-b-4 border-neon inline-block pb-2", textClass)}>{data.title}</h2>
        <div className={cn("prose prose-lg max-w-none opacity-80 leading-relaxed", textClass && "prose-zinc", isBoldTypography && "font-mono text-sm leading-loose")}>
          {data.text?.split('\n')?.map((p: string, i: number) => (
            <p key={i} className="mb-4 uppercase">{p}</p>
          ))}
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className={cn(containerPadding)}>
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className={cn("text-4xl font-black mb-8 uppercase italic", textClass)}>{data.title}</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={isBoldTypography ? { backgroundColor: '#CCFF00', color: 'black' } : { backgroundColor: theme.accentColor }}>
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className={cn("text-sm opacity-50 uppercase tracking-widest font-bold", textClass)}>Email</p>
                <p className={cn("text-lg font-medium", textClass, isBoldTypography && "font-mono uppercase")}>{data.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={isBoldTypography ? { backgroundColor: '#CCFF00', color: 'black' } : { backgroundColor: theme.accentColor }}>
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className={cn("text-sm opacity-50 uppercase tracking-widest font-bold", textClass)}>Teléfono</p>
                <p className={cn("text-lg font-medium", textClass, isBoldTypography && "font-mono uppercase")}>{data.phone}</p>
              </div>
            </div>
          </div>
        </div>
        <form className={cn(
          "p-8 rounded-3xl space-y-4",
          isBrutalist ? "brutalist-border bg-white" : isBoldTypography ? "border-4 border-white bg-black rounded-none" : isDarkMode ? "bg-zinc-800" : "bg-white shadow-xl"
        )}>
           <div>
             <label className={cn("block text-sm font-bold mb-2 uppercase", textClass, isBoldTypography && "font-mono")}>Nombre</label>
             <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 focus:border-zinc-900 outline-none transition-all dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" style={isBoldTypography ? { borderRadius: '0', border: '2px solid white' } : {}} />
           </div>
           <div>
             <label className={cn("block text-sm font-bold mb-2 uppercase", textClass, isBoldTypography && "font-mono")}>Mensaje</label>
             <textarea className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 focus:border-zinc-900 outline-none transition-all h-32 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" style={isBoldTypography ? { borderRadius: '0', border: '2px solid white' } : {}} />
           </div>
           <button type="button" className={cn(
             "w-full py-4 rounded-xl font-black transition-all uppercase",
             isBrutalist ? "brutalist-button" : isBoldTypography ? "bg-neon text-black skew-box hover:bg-white text-xl" : "bg-zinc-900 text-white"
           )} style={!isBrutalist && !isBoldTypography ? { backgroundColor: theme.accentColor } : {}}>
             Enviar Mensaje
           </button>
        </form>
      </div>
    </section>
  );

  switch (type) {
    case 'hero': return renderHero();
    case 'features': return renderFeatures();
    case 'prices': return renderPrices();
    case 'gallery': return renderGallery();
    case 'cta': return renderCTA();
    case 'content': return renderContent();
    case 'contact': return renderContact();
    default: return <div className="p-12 text-center text-zinc-400">Section type "{type}" not implemented</div>;
  }
}
