import React from "react";
import { motion } from "motion/react";
import { Compass, Music, Disc, Sparkles, Sun } from "lucide-react";
import { Language, translations } from "../translations";

interface GenesisSectionProps {
  lang: Language;
}

export default function GenesisSection({ lang }: GenesisSectionProps) {
  const t = translations[lang];

  const milestones = [
    {
      year: t.genesis.timeline.childhood.year,
      title: t.genesis.timeline.childhood.title,
      icon: <Music className="w-5 h-5 text-neon-blue" />,
      text: t.genesis.timeline.childhood.text,
      color: "border-neon-blue/40"
    },
    {
      year: t.genesis.timeline.father.year,
      title: t.genesis.timeline.father.title,
      icon: <Sun className="w-5 h-5 text-neon-orange" />,
      text: t.genesis.timeline.father.text,
      color: "border-neon-orange/40"
    },
    {
      year: t.genesis.timeline.vintage.year,
      title: t.genesis.timeline.vintage.title,
      icon: <Disc className="w-5 h-5 text-neon-purple" />,
      text: t.genesis.timeline.vintage.text,
      color: "border-neon-purple/40"
    },
    {
      year: t.genesis.timeline.future.year,
      title: t.genesis.timeline.future.title,
      icon: <Sparkles className="w-5 h-5 text-neon-pink" />,
      text: t.genesis.timeline.future.text,
      color: "border-neon-pink/40"
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Narrative Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 w-fit">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon-blue">
              {t.genesis.badge}
            </span>
          </div>
          
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase">
            {t.genesis.title}
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {t.genesis.intro}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
            {t.genesis.quote}
          </p>
        </div>

        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Decorative futuristic geometry (representing father's keys & wind instruments transforming to quantum cubes) */}
          <div className="relative w-72 h-72 rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 via-transparent to-neon-purple/10" />
            
            {/* Visual cybernetic instrument representing wind keys & digital synthesizer */}
            <div className="relative z-10 w-44 h-44 rounded-full border-2 border-dashed border-neon-purple/40 flex items-center justify-center animate-spin-slow">
              <div className="w-32 h-32 rounded-full border border-double border-neon-blue/30 flex items-center justify-center">
                <Compass className="w-16 h-16 text-neon-blue animate-pulse" />
              </div>
            </div>

            {/* Glowing lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-neon-blue via-transparent to-neon-purple opacity-40" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-full bg-gradient-to-r from-neon-orange via-transparent to-neon-pink opacity-40" />
          </div>
        </div>
      </div>

      {/* Grid Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {milestones.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-6 rounded-2xl bg-slate-950/70 border ${item.color} backdrop-blur-lg flex flex-col gap-3 hover:translate-y-[-4px] transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                {item.year}
              </span>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                {item.icon}
              </div>
            </div>
            
            <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              {item.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
