import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Terminal, Cpu, Send, RefreshCw } from "lucide-react";
import { Language, translations } from "../translations";

interface OracleSectionProps {
  lang: Language;
}

export default function OracleSection({ lang }: OracleSectionProps) {
  const t = translations[lang];

  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [sector, setSector] = useState("Neon Horizon");
  const [coordinate, setCoordinate] = useState("Q-3091");
  const [isLoading, setIsLoading] = useState(false);
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [statusLog, setStatusLog] = useState<string[]>([]);

  // Simple synthesised beep for interactions
  const triggerBeep = (freq: number, type: OscillatorType, duration: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context failed or blocked, ignore gracefully
    }
  };

  const runOracle = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerBeep(880, "triangle", 0.15);
    setIsLoading(true);
    setOracleResponse(null);
    setStatusLog([]);

    const ukLogs = [
      "Ініціалізація Квантового Ядра...",
      "Аналіз частотного спектра сектора: " + sector,
      "Налаштування резонансу на ім'я: " + (name || "Мандрівник"),
      "Генерація інтелектуального потоку мотивації..."
    ];

    const enLogs = [
      "Initializing Quantum Core...",
      "Analyzing frequency spectrum of sector: " + sector,
      "Tuning resonance to name: " + (name || "Traveler"),
      "Generating intellectual motivational stream..."
    ];

    const ruLogs = [
      "Инициализация Квантового Ядра...",
      "Анализ частотного спектра сектора: " + sector,
      "Настройка резонанса на имя: " + (name || "Путешественник"),
      "Генерация интеллектуального потока мотивации..."
    ];

    const logs = lang === "uk" ? ukLogs : lang === "en" ? enLogs : ruLogs;

    // Staggered logs simulation
    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setStatusLog((prev) => [...prev, logs[i]]);
      triggerBeep(440 + i * 110, "sine", 0.08);
    }

    try {
      const res = await fetch("/api/quantum-oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, prompt, sector, coordinate, lang }),
      });
      const data = await res.json();
      if (data.success) {
        setOracleResponse(data.response);
        triggerBeep(660, "sawtooth", 0.25);
      } else {
        setOracleResponse(
          lang === "uk"
            ? "Квантове ядро тимчасово недоступне. Сигнал згасає в поясі астероїдів."
            : lang === "en"
            ? "Quantum core is temporarily offline. Signal fades in the asteroid belt."
            : "Квантовое ядро временно недоступно. Сигнал угасает в поясе астероидов."
        );
      }
    } catch (err) {
      setOracleResponse(
        lang === "uk"
          ? "Не вдалося встановити з'єднання. Квантове зміщення занадто велике."
          : lang === "en"
          ? "Failed to establish connection. Quantum displacement is too high."
          : "Не удалось установить соединение. Квантовое смещение слишком велико."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sectors = [
    { name: "Neon Horizon", coord: "NH-2026", color: "text-neon-blue border-neon-blue/20" },
    { name: "Kyiv-99 Orbit", coord: "KV-1999", color: "text-neon-orange border-neon-orange/20" },
    { name: "Zenith Core", coord: "ZN-0815", color: "text-neon-purple border-neon-purple/20" },
    { name: "Brass Sector", coord: "BS-0144", color: "text-neon-pink border-neon-pink/20" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Console Input Side */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 w-fit">
            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-neon-purple">
              {t.oracle.badge}
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
            {t.oracle.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            {t.oracle.desc}
          </p>
        </div>

        <form onSubmit={runOracle} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                {t.oracle.form.name}
              </label>
              <input
                type="text"
                placeholder={t.oracle.form.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                {t.oracle.form.coord}
              </label>
              <input
                type="text"
                placeholder={t.oracle.form.coordPlaceholder}
                value={coordinate}
                onChange={(e) => setCoordinate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
              {t.oracle.form.sectorLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sectors.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => {
                    setSector(s.name);
                    setCoordinate(s.coord);
                    triggerBeep(330, "sine", 0.05);
                  }}
                  className={`py-2 px-1 text-[10px] font-mono rounded-lg border text-center transition-all cursor-pointer ${
                    sector === s.name
                      ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <span className="block truncate">{s.name}</span>
                  <span className="text-[8px] opacity-60 font-mono block mt-0.5">{s.coord}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
              {t.oracle.form.prompt}
            </label>
            <textarea
              placeholder={t.oracle.form.promptPlaceholder}
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple font-sans resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-display text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLoading
                ? "bg-slate-800 text-slate-500 border border-slate-700"
                : "bg-neon-purple hover:bg-fuchsia-600 text-white shadow-lg shadow-neon-purple/20 hover:scale-[1.01]"
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> {t.oracle.form.submitLoading}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> {t.oracle.form.submitBtn}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Hologram Output Display */}
      <div className="lg:col-span-6 flex flex-col justify-between bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 relative overflow-hidden">
        {/* Futuristic grids */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-[10px] font-mono text-neon-blue flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" /> {t.oracle.log.title}
            </span>
            <span className="text-[8px] font-mono bg-slate-900 text-slate-500 px-2 py-0.5 rounded">
              VER: 2026.06.Quantum
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[160px] gap-4">
            {isLoading && (
              <div className="flex flex-col gap-2">
                {statusLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-mono text-emerald-400 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    {log}
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && !oracleResponse && (
              <div className="text-center py-6">
                <Cpu className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-pulse" />
                <p className="text-xs font-mono text-slate-500">
                  {t.oracle.log.waiting}
                </p>
              </div>
            )}

            {!isLoading && oracleResponse && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-white/10 border border-white/10 relative"
              >
                {/* Accent neon corner */}
                <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-neon-purple rounded-tl" />
                <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-neon-purple rounded-br" />

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans font-medium">
                  {oracleResponse}
                </p>
              </motion.div>
            )}
          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>{t.oracle.log.coordLabel}: {coordinate}</span>
            <span>{t.oracle.log.status}: {isLoading ? t.oracle.log.statusActive : t.oracle.log.statusReady}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
