import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Volume2, VolumeX, Music, Cpu, Zap, Radio } from "lucide-react";
import { Language, translations } from "../translations";

// Types for tracks
export interface Track {
  id: string;
  title: string;
  tempo: number;
  description: string;
  color: string;
  notes: { note: string; dur: number; time: number }[];
  bassline: string[];
}

// Map notes to frequencies
const NOTE_FREQ: { [key: string]: number } = {
  "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.00, "A3": 220.00, "B3": 246.94,
  "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
  "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77,
  "C6": 1046.50
};

export default function VizuaAudioEngine({
  activeTrackId,
  onTrackPlayStateChange,
  activePlaybackState,
  lang,
}: {
  activeTrackId: string | null;
  onTrackPlayStateChange: (isPlaying: boolean, trackId: string | null) => void;
  activePlaybackState: boolean;
  lang: Language;
}) {
  const t = translations[lang];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(16).fill(10));

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayFeedbackRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const sequencerTimerRef = useRef<number | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Keyboard synthesizer state
  const [synthOscType, setSynthOscType] = useState<"sine" | "triangle" | "sawtooth" | "square">("sawtooth");
  const [synthFilterCutoff, setSynthFilterCutoff] = useState(1500);
  const [synthFeedback, setSynthFeedback] = useState(0.4);

  // Album Track definitions
  const tracks: Track[] = [
    {
      id: "neon-horizon",
      title: "Neon Horizon",
      tempo: 120,
      description:
        lang === "uk"
          ? "Енергійний ретро-футуристичний квантовий синтвейв з пульсуючими басами та космічними арпеджіо."
          : lang === "en"
          ? "Driving retro-futuristic quantum synthwave with pulsing basslines & celestial arpeggios."
          : "Драйвовый ретро-футуристический квантовый синтвейв с пульсирующими басами и космическими арпеджио.",
      color: "from-cyan-400 to-blue-600",
      notes: [
        { note: "A4", dur: 0.25, time: 0 },
        { note: "C5", dur: 0.25, time: 0.25 },
        { note: "E5", dur: 0.25, time: 0.5 },
        { note: "G5", dur: 0.25, time: 0.75 },
        { note: "A5", dur: 0.5, time: 1.0 },
        { note: "G5", dur: 0.25, time: 1.5 },
        { note: "E5", dur: 0.25, time: 1.75 },
        { note: "D5", dur: 0.25, time: 2.0 },
        { note: "E5", dur: 0.25, time: 2.25 },
        { note: "G5", dur: 0.25, time: 2.5 },
        { note: "A5", dur: 0.25, time: 2.75 },
        { note: "C6", dur: 0.5, time: 3.0 },
        { note: "A5", dur: 0.5, time: 3.5 }
      ],
      bassline: ["A3", "A3", "C3", "C3", "G3", "G3", "D3", "E3"]
    },
    {
      id: "quantum-leap",
      title: "Quantum Leap",
      tempo: 95,
      description:
        lang === "uk"
          ? "Глибокий атмосферний ембієнт-тріп з просторовими педами та мікротональними звуками."
          : lang === "en"
          ? "Deep atmospheric ambient trip, layered with spatial sweeping pads and microtonal clicks."
          : "Глубокий атмосферный эмбиент-трип с пространственными пэдами и микротональными кликами.",
      color: "from-purple-500 to-indigo-700",
      notes: [
        { note: "E4", dur: 0.8, time: 0 },
        { note: "G4", dur: 0.8, time: 1.0 },
        { note: "B4", dur: 1.2, time: 2.0 },
        { note: "D5", dur: 0.8, time: 3.5 },
        { note: "C5", dur: 1.5, time: 4.5 },
        { note: "A4", dur: 1.0, time: 6.0 }
      ],
      bassline: ["E3", "E3", "G3", "G3", "A3", "A3", "C3", "B3"]
    },
    {
      id: "kyiv-99",
      title: "Kyiv-99 (Acid Tribute)",
      tempo: 135,
      description:
        lang === "uk"
          ? "Енергійний високотемповий триб'ют українській клубній культурі кінця 90-х. Кислотні квадратні фільтри."
          : lang === "en"
          ? "An energetic high-tempo tribute to Ukrainian club culture of the late 90s. Sizzling square filters."
          : "Энергичный высокотемповый трибьют украинской клубной культуре конца 90-х. Кислотные квадратные фильтры.",
      color: "from-yellow-400 to-amber-600",
      notes: [
        { note: "C4", dur: 0.15, time: 0 },
        { note: "C4", dur: 0.15, time: 0.2 },
        { note: "D4", dur: 0.15, time: 0.4 },
        { note: "C4", dur: 0.15, time: 0.6 },
        { note: "F4", dur: 0.15, time: 0.8 },
        { note: "E4", dur: 0.15, time: 1.0 },
        { note: "C4", dur: 0.15, time: 1.2 },
        { note: "G4", dur: 0.15, time: 1.4 },
        { note: "F4", dur: 0.3, time: 1.6 }
      ],
      bassline: ["C3", "C3", "F3", "F3", "G3", "G3", "C3", "Bb3"]
    },
    {
      id: "zenith-wind",
      title: "Zenith Wind",
      tempo: 110,
      description:
        lang === "uk"
          ? "Мелодійна електронна композиція, що поєднує величні духові синтезатори та динамічні драм-партії."
          : lang === "en"
          ? "Melodic electronic composition blending majestic synthesized brass chords and dynamic drums."
          : "Мелодичная электронная композиция, сочетающая величественные духовые синтезаторы и динамичные драм-партии.",
      color: "from-orange-500 to-rose-600",
      notes: [
        { note: "G4", dur: 0.4, time: 0 },
        { note: "C5", dur: 0.4, time: 0.5 },
        { note: "E5", dur: 0.4, time: 1.0 },
        { note: "G5", dur: 0.8, time: 1.5 },
        { note: "F5", dur: 0.4, time: 2.5 },
        { note: "E5", dur: 0.4, time: 3.0 },
        { note: "D5", dur: 0.8, time: 3.5 }
      ],
      bassline: ["G3", "G3", "C3", "C3", "D3", "D3", "G3", "F3"]
    }
  ];

  // Initialize Web Audio API
  const initAudio = () => {
    if (audioCtxRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Analyzer Node for glowing bars
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyzerRef.current = analyser;

    // Master Volume node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
    masterGainRef.current = masterGain;

    // Biquad filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(synthFilterCutoff, ctx.currentTime);
    filterNodeRef.current = filter;

    // Stereo Space Delay Nodes
    const delay = ctx.createDelay(2.0);
    delay.delayTime.setValueAtTime(0.35, ctx.currentTime);
    delayNodeRef.current = delay;

    const delayFeedback = ctx.createGain();
    delayFeedback.gain.setValueAtTime(synthFeedback, ctx.currentTime);
    delayFeedbackRef.current = delayFeedback;

    // Routing: Source -> Filter -> MasterGain -> Analyser -> Destination
    filter.connect(masterGain);
    filter.connect(delay);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay); // Feedback Loop
    delayFeedback.connect(masterGain);

    masterGain.connect(analyser);
    analyser.connect(ctx.destination);
  };

  // Sync state when external props trigger playback change
  useEffect(() => {
    if (activeTrackId) {
      const idx = tracks.findIndex(t => t.id === activeTrackId);
      if (idx !== -1) {
        setCurrentTrackIndex(idx);
        if (activePlaybackState && !isPlaying) {
          startSequencer(idx);
        } else if (!activePlaybackState && isPlaying) {
          stopSequencer();
        }
      }
    } else if (isPlaying) {
      stopSequencer();
    }
  }, [activeTrackId, activePlaybackState]);

  // Adjust Master Volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const currentVal = isMuted ? 0 : volume;
      masterGainRef.current.gain.linearRampToValueAtTime(currentVal, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume, isMuted]);

  // Adjust Synthesizer properties in real-time
  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      filterNodeRef.current.frequency.setValueAtTime(synthFilterCutoff, audioCtxRef.current.currentTime);
    }
  }, [synthFilterCutoff]);

  useEffect(() => {
    if (delayFeedbackRef.current && audioCtxRef.current) {
      delayFeedbackRef.current.gain.setValueAtTime(synthFeedback, audioCtxRef.current.currentTime);
    }
  }, [synthFeedback]);

  // Visualizer Animation Frame Loop
  const animateVisualizer = () => {
    if (!analyzerRef.current) return;
    const array = new Uint8Array(analyzerRef.current.frequencyBinCount);
    analyzerRef.current.getByteFrequencyData(array);

    // Map 16 bars
    const newBars: number[] = [];
    for (let i = 0; i < 16; i++) {
      const val = array[i] || 0;
      // Scale to height percentage (10px to 100px)
      newBars.push(Math.max(8, Math.floor((val / 255) * 100)));
    }
    setVisualizerBars(newBars);
    animationFrameRef.current = requestAnimationFrame(animateVisualizer);
  };

  // Sound triggering function for synthesizer keys
  const triggerSynthKey = (note: string) => {
    initAudio();
    const ctx = audioCtxRef.current;
    const filter = filterNodeRef.current;
    if (!ctx || !filter) return;

    // Resume context if suspended
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const freq = NOTE_FREQ[note];
    if (!freq) return;

    // Create oscillator
    const osc = ctx.createOscillator();
    osc.type = synthOscType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Custom frequency slide (quantum glissando!)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.005, ctx.currentTime + 0.4);

    // Create custom Gain Node for attack-decay-sustain-release (ADSR) envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    // Attack
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
    // Decay & Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.3);
    // Release
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(filter);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  };

  // Play a beautiful synthesized step of the current track
  const playStep = (track: Track, step: number, time: number) => {
    const ctx = audioCtxRef.current;
    const filter = filterNodeRef.current;
    if (!ctx || !filter) return;

    // Play Bass Note
    const bassNote = track.bassline[step % track.bassline.length];
    const bassFreq = NOTE_FREQ[bassNote];
    if (bassFreq) {
      const bassOsc = ctx.createOscillator();
      bassOsc.type = "sawtooth";
      bassOsc.frequency.setValueAtTime(bassFreq / 2, time); // Pitch bass down an octave

      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0, time);
      bassGain.gain.linearRampToValueAtTime(0.25, time + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

      bassOsc.connect(bassGain);
      bassGain.connect(filter);
      bassOsc.start(time);
      bassOsc.stop(time + 0.3);
    }

    // Play Hihat / Cosmic noise on eighth steps
    if (step % 2 === 1) {
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 7000;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGainRef.current!);
      noiseNode.start(time);
    }

    // Play Melodic notes scheduled for this beat
    const beatInBar = step % 8; // Steps are 1/8 notes, 0-7
    const noteToPlay = track.notes.find(n => Math.floor(n.time * 2) === beatInBar);

    if (noteToPlay) {
      const leadFreq = NOTE_FREQ[noteToPlay.note];
      if (leadFreq) {
        const leadOsc = ctx.createOscillator();
        leadOsc.type = synthOscType;
        leadOsc.frequency.setValueAtTime(leadFreq, time);

        const leadGain = ctx.createGain();
        leadGain.gain.setValueAtTime(0, time);
        leadGain.gain.linearRampToValueAtTime(0.35, time + 0.02);
        leadGain.gain.exponentialRampToValueAtTime(0.05, time + noteToPlay.dur);

        leadOsc.connect(leadGain);
        leadGain.connect(filter);
        leadOsc.start(time);
        leadOsc.stop(time + noteToPlay.dur);
      }
    }
  };

  // Start the procedural music sequencer
  const startSequencer = (trackIdx: number) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    setIsPlaying(true);
    setCurrentTrackIndex(trackIdx);
    onTrackPlayStateChange(true, tracks[trackIdx].id);

    const track = tracks[trackIdx];
    const stepDuration = 60 / track.tempo / 2; // 1/8 notes
    let nextStepTime = ctx.currentTime + 0.1;
    let stepCount = 0;

    // Clean up existing visualizer loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animateVisualizer();

    // Scheduling loop
    const scheduler = () => {
      while (nextStepTime < ctx.currentTime + 0.2) {
        playStep(track, stepCount, nextStepTime);
        const currentStep = stepCount;
        
        // Update step UI safely
        setTimeout(() => {
          setActiveStep(currentStep % 8);
        }, (nextStepTime - ctx.currentTime) * 1000);

        nextStepTime += stepDuration;
        stepCount++;
      }
      sequencerTimerRef.current = window.setTimeout(scheduler, 25);
    };

    scheduler();
  };

  const stopSequencer = () => {
    setIsPlaying(false);
    onTrackPlayStateChange(false, null);
    if (sequencerTimerRef.current) {
      clearTimeout(sequencerTimerRef.current);
      sequencerTimerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    // Smooth reset bars
    setVisualizerBars(Array(16).fill(10));
    setActiveStep(0);
  };

  const togglePlayback = (idx: number) => {
    if (isPlaying && currentTrackIndex === idx) {
      stopSequencer();
    } else {
      if (isPlaying) stopSequencer();
      // Brief delay to allow audio state reset
      setTimeout(() => {
        startSequencer(idx);
      }, 50);
    }
  };

  // Notes array for keyboard
  const keyboardNotes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"];

  return (
    <div id="audio-engine-panel" className="w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-neon-purple/20 rounded-xl border border-neon-purple/50">
            <Radio className="w-6 h-6 text-neon-purple animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              {t.synth.title}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {t.synth.subtitle}
            </p>
          </div>
        </div>

        {/* Visualizer and controls */}
        <div className="flex items-center gap-6">
          {/* Simulated LED bars */}
          <div className="flex items-end gap-1 h-12 px-3 bg-slate-900 rounded-lg border border-slate-800/80">
            {visualizerBars.map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-neon-purple via-neon-blue to-neon-pink rounded-t transition-all duration-75"
                style={{ height: `${h}%`, opacity: isPlaying ? 1 : 0.4 }}
              />
            ))}
          </div>

          {/* Mute and volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-slate-800/80 rounded-lg text-slate-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-neon-blue cursor-pointer h-1.5 rounded-lg bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Album Track List & Sequencer State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-display text-sm font-semibold text-neon-blue tracking-wider mb-4 flex items-center gap-2 uppercase">
            <Music className="w-4 h-4" /> {t.album.title}
          </h4>
          <div className="flex flex-col gap-3">
            {tracks.map((track, idx) => {
              const isThisTrackPlaying = isPlaying && currentTrackIndex === idx;
              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    isThisTrackPlaying
                      ? "bg-white/15 border-neon-blue/60 shadow-lg shadow-neon-blue/5"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-neon-purple font-semibold">
                        0{idx + 1}
                      </span>
                      <h5 className="font-display text-sm font-bold text-white truncate">
                        {track.title}
                      </h5>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                        {track.tempo} BPM
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                      {track.description}
                    </p>

                    {/* Step indicator */}
                    {isThisTrackPlaying && (
                      <div className="flex items-center gap-1.5 mt-2">
                        {Array(8)
                           .fill(0)
                           .map((_, s) => (
                             <div
                               key={s}
                               className={`h-1.5 rounded-full transition-all duration-100 ${
                                 activeStep === s
                                   ? "w-4 bg-neon-blue shadow-sm shadow-neon-blue/80"
                                   : "w-1.5 bg-slate-800"
                               }`}
                             />
                           ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => togglePlayback(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isThisTrackPlaying
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 animate-pulse"
                        : "bg-neon-blue hover:bg-cyan-400 text-slate-950 hover:scale-105 shadow-md shadow-neon-blue/10"
                    }`}
                  >
                    {isThisTrackPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time keyboard controller */}
        <div className="flex flex-col">
          <h4 className="font-display text-sm font-semibold text-neon-purple tracking-wider mb-4 flex items-center gap-2 uppercase">
            <Cpu className="w-4 h-4" /> {t.tabsNav.forge.label}
          </h4>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex-1 flex flex-col gap-4">
            {/* Waveform Select and Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                  {t.synth.oscillator}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["sine", "triangle", "sawtooth", "square"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSynthOscType(type)}
                      className={`py-1 px-2 text-[10px] font-mono rounded capitalize transition-all ${
                        synthOscType === type
                          ? "bg-neon-purple text-white shadow shadow-neon-purple/50"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                  {t.synth.filter}
                </label>
                <input
                  type="range"
                  min="200"
                  max="4000"
                  step="50"
                  value={synthFilterCutoff}
                  onChange={(e) => setSynthFilterCutoff(parseInt(e.target.value))}
                  className="w-full accent-neon-purple h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
                  <span>200Hz</span>
                  <span className="text-neon-purple font-bold">{synthFilterCutoff}Hz</span>
                  <span>4kHz</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                  {t.synth.delay}
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={synthFeedback}
                  onChange={(e) => setSynthFeedback(parseFloat(e.target.value))}
                  className="w-full accent-neon-blue h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
                  <span>Dry</span>
                  <span className="text-neon-blue font-bold">{Math.round(synthFeedback * 100)}%</span>
                  <span>Heavy</span>
                </div>
              </div>
            </div>

            {/* Keyboard Keys */}
            <div className="flex-1 flex flex-col justify-end">
              <span className="text-[10px] font-mono text-slate-400 block mb-2 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-neon-orange" /> {t.synth.keyboardLabel}
              </span>
              <div className="relative h-28 bg-white/5 rounded-lg border border-white/10 overflow-x-auto flex no-scrollbar select-none py-1 px-1 gap-1">
                {keyboardNotes.map((note) => {
                  return (
                    <button
                      key={note}
                      onMouseDown={() => triggerSynthKey(note)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        triggerSynthKey(note);
                      }}
                      className={`flex-1 min-w-[32px] rounded-md transition-all active:translate-y-1 flex flex-col justify-end items-center pb-2 cursor-pointer ${
                        note.startsWith("C") || note.startsWith("E") || note.startsWith("G")
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold active:bg-neon-blue"
                          : "bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium active:bg-neon-purple border border-slate-700/60"
                      }`}
                    >
                      <span className="text-[8px] font-mono font-bold tracking-tighter">
                        {note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
