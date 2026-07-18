import React from "react";
import { motion } from "motion/react";
import { Sparkles, Flame, Radio, Zap } from "lucide-react";
import { Language, translations } from "../translations";

interface AlbumSectionProps {
  onPlayTrigger: (trackId: string) => void;
  isPlaying: boolean;
  lang: Language;
}

export default function AlbumSection({
  onPlayTrigger,
  isPlaying,
  lang,
}: AlbumSectionProps) {
  const t = translations[lang];

  const tracks = [
    { id: "neon-horizon", title: "Neon Horizon", len: "4:12", tag: lang === "en" ? "Quantum Lead" : "Квантовый лид" },
    { id: "quantum-leap", title: "Quantum Leap", len: "3:45", tag: lang === "en" ? "Atmospheric Ambient" : "Атмосферный эмбиент" },
    { id: "kyiv-99", title: "Kyiv-99 (Acid Tribute)", len: "4:30", tag: lang === "en" ? "High Tempo Energy" : "Энергичный эйсид" },
    { id: "zenith-wind", title: "Zenith Wind", len: "3:58", tag: lang === "en" ? "Majestic Brass Lead" : "Медный духовой лид" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* 3D Wireframe Cyber Cube - representation of album art */}
      <div className="lg:col-span-5 flex justify-center items-center relative">
        <div className="relative w-80 h-80 flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Nebula dust behind the cube */}
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/10 via-neon-purple/5 to-neon-pink/10 animate-pulse-slow" />
          
          {/* Animated cyber soil / grid ground */}
          <div className="absolute bottom-0 w-full h-1/3 bg-slate-900/60 border-t border-slate-800 flex flex-col justify-end p-2 overflow-hidden">
            <div className="w-full h-full border-t border-dashed border-neon-purple/20 rotate-x-12 translate-y-2 scale-125 opacity-40 flex items-center justify-around">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="w-[1px] h-full bg-gradient-to-t from-neon-blue/50 to-transparent" />
              ))}
            </div>
          </div>

          {/* Suspended rotating glowing wireframe album cube */}
          <motion.div
            animate={{
              rotateY: 360,
              rotateX: [15, 30, 15],
              y: [-10, 10, -10]
            }}
            transition={{
              rotateY: { duration: 16, repeat: Infinity, ease: "linear" },
              rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-36 h-36 border-2 border-neon-blue relative flex items-center justify-center rounded-lg shadow-[0_0_30px_rgba(0,243,255,0.2)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Inner nested cube - Orange neon */}
            <div className="absolute w-24 h-24 border-2 border-neon-orange rounded-lg animate-pulse shadow-[0_0_20px_rgba(255,94,0,0.3)]" />
            
            {/* Inner nested core - Pink/Magenta */}
            <div className="absolute w-12 h-12 border border-neon-pink bg-neon-purple/20 rounded flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.4)]">
              <Sparkles className="w-5 h-5 text-neon-blue animate-spin-slow" />
            </div>

            {/* Glowing energy lasers (neon lines connecting corners) */}
            <div className="absolute inset-0 border border-dashed border-neon-pink/50 rounded-full scale-110 pointer-events-none" />
          </motion.div>

          {/* Floating cosmic text on cover art */}
          <div className="absolute top-4 left-6 flex flex-col">
            <span className="font-display text-lg font-black tracking-widest text-white/90">Vizua</span>
            <span className="text-[9px] font-mono tracking-widest text-neon-blue">NEON HORIZON</span>
          </div>

          {/* Interactive touch coordinate */}
          <div className="absolute bottom-2 right-4 text-[8px] font-mono text-slate-500">
            SYSTEM CORE // ACTIVE
          </div>
        </div>
      </div>

      {/* Album Text & Track list side */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 w-fit">
            <Flame className="w-3.5 h-3.5 text-neon-orange animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon-orange">
              {t.album.badge}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none">
            {t.album.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            {t.album.quote}
          </p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {t.album.desc}
        </p>

        {/* Track rows */}
        <div className="flex flex-col gap-2.5">
          {tracks.map((track, i) => (
            <div
              key={track.id}
              onClick={() => onPlayTrigger(track.id)}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-neon-blue/40 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-500 group-hover:text-neon-blue transition-colors">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-white group-hover:text-neon-blue transition-colors">
                    {track.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">{track.tag}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-slate-500">{track.len}</span>
                <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-neon-blue hover:text-white hover:bg-neon-blue/20 transition-all">
                  <Zap className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-blue/5 border border-neon-purple/20 flex gap-3 items-center">
          <div className="p-2.5 bg-neon-purple/20 rounded-lg text-neon-purple">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h5 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              {t.album.motivateTitle}
            </h5>
            <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
              {t.album.motivateDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
