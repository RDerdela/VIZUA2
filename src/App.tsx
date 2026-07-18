import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Music,
  Disc,
  Terminal,
  Cpu,
  Globe,
  ArrowRight,
  Sliders,
} from "lucide-react";
import CosmicBackground from "./components/CosmicBackground";
import GenesisSection from "./components/GenesisSection";
import OracleSection from "./components/OracleSection";
import AlbumSection from "./components/AlbumSection";
import VizuaSolarSystem from "./components/VizuaSolarSystem";
import VizuaAudioEngine from "./components/VizuaAudioEngine";
import { Language, translations } from "./translations";

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("album");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

  const t = translations[lang];

  // Trigger synthesized audio beeps for menu switches
  const triggerBeep = (freq: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    triggerBeep(600);
  };

  const handleTrackPlayStateChange = (playing: boolean, trackId: string | null) => {
    setIsPlaying(playing);
    setActiveTrackId(trackId);
  };

  const handlePlayTriggerFromAlbum = (trackId: string) => {
    // Set tab to forge to reveal the synthesizer panel while playing!
    setActiveTab("forge");
    setActiveTrackId(trackId);
    setIsPlaying(true);
    triggerBeep(800);
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* 1. Starry Quantum Background */}
      <CosmicBackground />

      {/* Decorative Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />

      {/* 2. Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hologram Circle */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-blue to-neon-purple p-0.5 flex items-center justify-center shadow-lg shadow-neon-blue/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-neon-blue animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-black tracking-widest text-white uppercase flex items-center gap-1.5 leading-none">
                VIZUA <span className="text-[10px] text-neon-blue font-mono font-normal normal-case tracking-normal bg-neon-blue/10 px-1.5 py-0.5 rounded border border-neon-blue/30">2026.composer</span>
              </h1>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider uppercase">
                {t.header.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: "genesis", label: t.header.tabs.genesis, icon: <Music className="w-3.5 h-3.5" /> },
              { id: "album", label: t.header.tabs.album, icon: <Disc className="w-3.5 h-3.5" /> },
              { id: "forge", label: t.header.tabs.forge, icon: <Cpu className="w-3.5 h-3.5" /> },
              { id: "oracle", label: t.header.tabs.oracle, icon: <Terminal className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono tracking-wide transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-neon-purple/20 to-neon-blue/10 border border-neon-purple/50 text-white font-bold shadow shadow-neon-purple/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* UA Cyber Vibe Status Indicators & Language Selector */}
          <div className="flex items-center gap-3">
            {/* Language switcher hidden as requested */}

            <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono text-slate-300">{t.header.indicators.hq}</span>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-mono text-neon-blue">
              <Globe className="w-3.5 h-3.5 animate-spin-slow text-neon-blue" />
              <span className="font-bold">{t.header.indicators.sector}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col gap-16 w-full">
        
        {/* Intro Hero banner */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-neon-blue/10 via-neon-purple/5 to-transparent rounded-full blur-3xl -z-10" />
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/15 border border-neon-blue/30 w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-blue animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-neon-blue font-bold">
                {t.hero.badge}
              </span>
            </div>
            
            {/* Premium 3D Holographic Title with Specular Glare & Ground Reflection */}
            <div className="relative group select-none pt-4 pb-16 sm:pb-28">
              {/* Subtle background cosmic laser grid line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue/35 to-transparent pointer-events-none" />
              <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-neon-blue animate-ping pointer-events-none" />
              
              <div className="flex flex-col relative z-10">
                {/* 3D Extruded Chrome Title with Laser Light Sweep */}
                <h1 className="font-display text-5xl sm:text-7xl font-black tracking-tight leading-none uppercase select-none cursor-default">
                  <span className="relative block text-3d-cyber pb-2">
                    <span className="absolute inset-0 chrome-gradient bg-clip-text text-transparent pointer-events-none" />
                    <span className="absolute inset-0 animate-sweep-shine pointer-events-none" />
                    VIZUA
                  </span>
                  
                  {/* Glowing 3D Neon Horizon subtitle */}
                  <span className="relative block text-3d-neon text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-orange pb-3">
                    NEON HORIZON
                  </span>
                </h1>

                {/* Cyber Mirror Glass Floor Reflection Effect with Smooth Fade-out */}
                <div className="hidden sm:block absolute top-[94%] left-0 right-0 h-[140px] pointer-events-none select-none overflow-hidden z-0">
                  <div className="origin-top scale-y-[-0.65] opacity-35 filter blur-[1px] select-none">
                    <h2 className="font-display text-5xl sm:text-7xl font-black tracking-tight leading-none uppercase">
                      <span className="block text-slate-500 pb-2">
                        VIZUA
                      </span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-orange pb-3">
                        NEON HORIZON
                      </span>
                    </h2>
                  </div>
                  {/* Glowing neon laser horizontal horizon line (the reflection line) */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-blue/60 to-transparent shadow-[0_0_12px_rgba(0,243,255,0.8)]" />
                  
                  {/* Ultra smooth fade out mask so reflection melts into background card seamlessly */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleTabChange("album")}
                className="px-6 py-3 rounded-xl bg-neon-blue hover:bg-cyan-400 text-slate-950 font-display text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-neon-blue/15 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {t.hero.btnAlbum} <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleTabChange("forge")}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-neon-purple" /> {t.hero.btnSynth}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {/* Orbital Vizua System Map */}
            <VizuaSolarSystem
              activeTab={activeTab}
              onTabChange={handleTabChange}
              lang={lang}
              activeTrackId={activeTrackId}
              isPlaying={isPlaying}
            />
          </div>
        </section>

        {/* 4. Tab Navigation Content Area */}
        <section className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 min-h-[450px]">
          <div className="flex items-center gap-2.5 border-b border-slate-900 pb-6 mb-8 overflow-x-auto no-scrollbar">
            {[
              { id: "genesis", label: t.tabsNav.genesis.label, desc: t.tabsNav.genesis.desc, accent: "border-neon-orange" },
              { id: "album", label: t.tabsNav.album.label, desc: t.tabsNav.album.desc, accent: "border-neon-blue" },
              { id: "forge", label: t.tabsNav.forge.label, desc: t.tabsNav.forge.desc, accent: "border-neon-pink" },
              { id: "oracle", label: t.tabsNav.oracle.label, desc: t.tabsNav.oracle.desc, accent: "border-neon-purple" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[200px] p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? `bg-white/10 border-white/25 ${tab.accent} shadow-md`
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <h3 className={`font-display text-xs font-extrabold uppercase tracking-wider ${
                  activeTab === tab.id ? "text-white" : "text-slate-400"
                }`}>
                  {tab.label}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tab.desc}</p>
              </button>
            ))}
          </div>

          {/* Interactive animated rendering of the chosen universe sector */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {activeTab === "genesis" && <GenesisSection lang={lang} />}
              {activeTab === "album" && (
                <AlbumSection
                  lang={lang}
                  onPlayTrigger={handlePlayTriggerFromAlbum}
                  isPlaying={isPlaying && activeTrackId !== null}
                />
              )}
              {activeTab === "forge" && (
                <VizuaAudioEngine
                  lang={lang}
                  activeTrackId={activeTrackId}
                  activePlaybackState={isPlaying}
                  onTrackPlayStateChange={handleTrackPlayStateChange}
                />
              )}
              {activeTab === "oracle" && <OracleSection lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* 5. Cybernetic Futuristic Footer */}
      <footer className="bg-transparent backdrop-blur-md border-t border-white/10 py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-blue animate-pulse" />
              <span className="font-display text-sm font-bold tracking-widest text-white uppercase">
                {t.footer.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {t.footer.desc}
            </p>
          </div>

          {/* Virtual system diagnostic coordinates */}
          <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-slate-900 py-4 md:py-0">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              {t.footer.telemetry}
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-center">
              <span className="text-[10px] font-mono text-slate-400">SYS_TEMP: <span className="text-emerald-400">36.2 °C</span></span>
              <span className="text-[10px] font-mono text-slate-400">LATENCY: <span className="text-neon-blue">0.4 ms</span></span>
              <span className="text-[10px] font-mono text-slate-400">S-CORE: <span className="text-neon-purple">ACTIVE</span></span>
              <span className="text-[10px] font-mono text-slate-400">FREQ_UA: <span className="text-neon-orange">99.9 Hz</span></span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 justify-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              {t.footer.platforms}
            </span>
            <div className="flex gap-3">
              {[
                { name: "Spotify", href: "#spotify" },
                { name: "Apple Music", href: "#apple" },
                { name: "Telegram", href: "#telegram" },
                { name: "SoundCloud", href: "#soundcloud" },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.href}
                  className="text-xs font-mono text-slate-400 hover:text-neon-blue transition-colors border-b border-transparent hover:border-neon-blue/40"
                  onClick={(e) => {
                    e.preventDefault();
                    triggerBeep(950);
                  }}
                >
                  {platform.name}
                </a>
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-600 mt-2">
              {t.footer.copyright}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
