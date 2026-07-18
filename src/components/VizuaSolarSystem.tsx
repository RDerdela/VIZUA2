import React, { useState, useEffect, useRef } from "react";
import { Sparkles, RefreshCw, Zap, Disc, Volume2, Info, Compass, HelpCircle } from "lucide-react";
import { Language } from "../translations";

interface VizuaSolarSystemProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  activeTrackId?: string | null;
  isPlaying?: boolean;
}

// Interactive Cosmic Moods
type CosmicMood = "cyberpunk" | "zen" | "supernova" | "aurora";

interface MoodTheme {
  name: string;
  desc: string;
  bgGradient: string;
  coreColors: [string, string];
  starColor: string;
  glowColor: string;
  particleSpeed: number;
}

const moodThemes: Record<CosmicMood, MoodTheme> = {
  cyberpunk: {
    name: "Cyberpunk Glow",
    desc: "Vibrant high-contrast neon blues and hot magentas with extreme speed",
    bgGradient: "rgba(5, 5, 20, 0.95)",
    coreColors: ["#bd00ff", "#00f3ff"],
    starColor: "rgba(0, 243, 255, 0.8)",
    glowColor: "rgba(189, 0, 255, 0.25)",
    particleSpeed: 1.8,
  },
  zen: {
    name: "Cosmic Calm",
    desc: "Drifting, atmospheric deep space silver and dark amethyst",
    bgGradient: "rgba(8, 5, 12, 0.98)",
    coreColors: ["#a78bfa", "#e2e8f0"],
    starColor: "rgba(255, 255, 255, 0.7)",
    glowColor: "rgba(167, 139, 250, 0.15)",
    particleSpeed: 0.5,
  },
  supernova: {
    name: "Supernova Fire",
    desc: "Active solar storm with blazing solar flares and golden-crimson hues",
    bgGradient: "rgba(18, 5, 5, 0.96)",
    coreColors: ["#f59e0b", "#ef4444"],
    starColor: "rgba(245, 158, 11, 0.85)",
    glowColor: "rgba(239, 68, 68, 0.3)",
    particleSpeed: 2.5,
  },
  aurora: {
    name: "Acid Aurora",
    desc: "Wavy quantum electromagnetic fields in neon lime and emerald green",
    bgGradient: "rgba(5, 15, 10, 0.97)",
    coreColors: ["#10b981", "#eab308"],
    starColor: "rgba(16, 185, 129, 0.8)",
    glowColor: "rgba(16, 185, 129, 0.22)",
    particleSpeed: 1.2,
  },
};

// 3D Point structure
interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Localized UI strings
const sTranslations = {
  uk: {
    title: "Квантова Галактика VIZUA",
    subtitle: "Інтерактивний 3D всесвіт • Обертайте затисканням миші",
    legend: "Виберіть Сектор / Обертайте Галактику",
    activeNode: "АКТИВНИЙ СЕКТОР",
    moodLabel: "Режим Галактики (Настрій):",
    trackPlaying: "Трансляція планетарного сигналу...",
    tracks: "Треки-планети",
    backToApp: "Торкніться планети для переходу між вкладками",
  },
  en: {
    title: "Quantum Galaxy VIZUA",
    subtitle: "Interactive 3D Universe • Click & drag to rotate",
    legend: "Select Sector / Orbit the Galaxy",
    activeNode: "ACTIVE SECTOR",
    moodLabel: "Galactic Cosmos Mood:",
    trackPlaying: "Broadcasting planetary soundwaves...",
    tracks: "Track Satellites",
    backToApp: "Click any planet to navigate the interface",
  },
  ru: {
    title: "Квантовая Галактика VIZUA",
    subtitle: "Интерактивная 3D вселенная • Вращайте зажатием мыши",
    legend: "Выберите Сектор / Вращайте Галактику",
    activeNode: "АКТИВНЫЙ СЕКТОР",
    moodLabel: "Режим Галактики (Настрой):",
    trackPlaying: "Трансляция планетарного сигнала...",
    tracks: "Треки-спутники",
    backToApp: "Нажмите на планету для переключения вкладок",
  },
};

export default function VizuaSolarSystem({
  activeTab,
  onTabChange,
  lang = "en",
  activeTrackId = null,
  isPlaying = false,
}: VizuaSolarSystemProps) {
  const trans = sTranslations[lang] || sTranslations.en;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [mood, setMood] = useState<CosmicMood>("cyberpunk");
  const [dimensions, setDimensions] = useState({ width: 450, height: 420 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isRotatingAutomatically, setIsRotatingAutomatically] = useState(true);

  // 3D Camera Angles
  const cameraAngleX = useRef<number>(-0.45); // Pitch (tilt down slightly)
  const cameraAngleY = useRef<number>(0.6); // Yaw (spin around)
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const spinInertia = useRef<number>(0.004);

  // Synthesized Audio Trigger
  const triggerBeep = (freq: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  };

  // Resize canvas responsively
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // Keep a nice aspect ratio or custom height
        setDimensions({
          width: width,
          height: Math.max(380, width * 0.8),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Set up 3D Scene Components
  // Starfield
  const starsRef = useRef<Array<Point3D & { size: number; alpha: number }>>([]);
  useEffect(() => {
    const starList = [];
    for (let i = 0; i < 110; i++) {
      // Uniform distribution in a sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 160 + Math.random() * 120; // Star shell radius
      starList.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }
    starsRef.current = starList;
  }, []);

  // Node Planet Settings
  // Radius, speed, base size, color, moons (individual tracks)
  const nodes = [
    {
      id: "genesis",
      name: lang === "uk" ? "Истоки Genesis" : lang === "en" ? "Genesis Sector" : "Истоки Genesis",
      sub: lang === "uk" ? "DJ Шлях & Спадщина" : lang === "en" ? "History & DJ Roots" : "DJ Путь & Наследие",
      orbitRadius: 75,
      speed: 0.015,
      size: 14,
      primaryColor: "#f97316", // Neon Orange
      secondaryColor: "#ea580c",
      hasRings: false,
      moons: [],
    },
    {
      id: "album",
      name: lang === "uk" ? "Ядро Neon Horizon" : lang === "en" ? "Neon Horizon Core" : "Ядро Neon Horizon",
      sub: lang === "uk" ? "4 Альбомні Композиції" : lang === "en" ? "4 Album Masterpieces" : "4 Альбомных Трека",
      orbitRadius: 120,
      speed: 0.008,
      size: 20,
      primaryColor: "#06b6d4", // Neon Cyan
      secondaryColor: "#0891b2",
      hasRings: true,
      ringColor: "rgba(6, 182, 212, 0.3)",
      // Orbiting moons representing individual tracks!
      moons: [
        { id: "neon-horizon", title: "Neon Horizon", radius: 24, speed: 0.04, size: 4, color: "#22d3ee" },
        { id: "quantum-leap", title: "Quantum Leap", radius: 32, speed: -0.03, size: 3.5, color: "#c084fc" },
        { id: "kyiv-99", title: "Kyiv-99 Acid", radius: 40, speed: 0.022, size: 4, color: "#fbbf24" },
        { id: "zenith-wind", title: "Zenith Wind", radius: 48, speed: -0.018, size: 3.5, color: "#f87171" },
      ],
    },
    {
      id: "forge",
      name: lang === "uk" ? "Кузня Хвиль Wave Forge" : lang === "en" ? "Wave Forge Synthesizer" : "Кузня Волн Wave Forge",
      sub: lang === "uk" ? "Генеративний Алгоритм" : lang === "en" ? "Interactive Algorithmic Synth" : "Генеративный Алгоритм",
      orbitRadius: 175,
      speed: 0.005,
      size: 15,
      primaryColor: "#ec4899", // Neon Pink/Magenta
      secondaryColor: "#db2777",
      hasRings: false,
      moons: [],
    },
    {
      id: "oracle",
      name: lang === "uk" ? "Квантовий Оракул" : lang === "en" ? "The Quantum Oracle" : "Квантовый Оракул",
      sub: lang === "uk" ? "ІІ-Музична Мотивація" : lang === "en" ? "AI Space-Navigator" : "ИИ-Музыкальная Мотивация",
      orbitRadius: 220,
      speed: 0.003,
      size: 13,
      primaryColor: "#a855f7", // Neon Purple
      secondaryColor: "#9333ea",
      hasRings: false,
      moons: [],
    },
  ];

  // Dynamic Phase values to track celestial positions
  const planetPhases = useRef<Record<string, number>>({
    genesis: 0.0,
    album: 1.5,
    forge: 3.2,
    oracle: 4.8,
  });

  const moonPhases = useRef<Record<string, number>>({
    "neon-horizon": 0,
    "quantum-leap": 1,
    "kyiv-99": 2,
    "zenith-wind": 3,
  });

  // Track hoverable coordinates on screen for precise clicking
  interface ProjectedNode {
    id: string;
    name: string;
    sub: string;
    screenX: number;
    screenY: number;
    size: number;
    z: number;
  }
  const projectedNodes = useRef<ProjectedNode[]>([]);

  // Principal rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let localTime = 0;
    const theme = moodThemes[mood];

    const render = () => {
      localTime += 0.01;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Width/height context
      const width = dimensions.width;
      const height = dimensions.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Space background & Ambient Nebula glow
      ctx.fillStyle = theme.bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Radial neon gradient behind galaxy core
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, Math.min(width, height) * 0.6);
      bgGlow.addColorStop(0, theme.glowColor);
      bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Apply automatic camera rotation over time if no active dragging is happening
      if (isRotatingAutomatically && !isDragging.current) {
        cameraAngleY.current += 0.0009 * theme.particleSpeed;
      }

      // Add gentle drift to X angle (pitch) for fluid dynamic feeling
      const currentAngleX = cameraAngleX.current + Math.sin(localTime * 0.4) * 0.015;
      const currentAngleY = cameraAngleY.current;

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // Perspective projection helper
      const project = (pt: Point3D) => {
        // Rotate around Y axis (Yaw)
        const x1 = pt.x * cosY - pt.z * sinY;
        const z1 = pt.x * sinY + pt.z * cosY;

        // Rotate around X axis (Pitch)
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = pt.y * sinX + z1 * cosX;

        // Focal point calculations
        const perspective = 280;
        const cameraDistance = 330;
        const scale = perspective / (cameraDistance + z2);

        return {
          screenX: centerX + x1 * scale,
          screenY: centerY + y2 * scale,
          sizeMultiplier: scale,
          z: z2,
        };
      };

      // 2. Project and draw rotating stars
      starsRef.current.forEach((star) => {
        const proj = project(star);
        // Do not draw behind the camera
        if (proj.z < -200) return;

        ctx.fillStyle = theme.starColor;
        ctx.globalAlpha = star.alpha * (1 - (proj.z / 300)); // fade stars that are far
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, star.size * proj.sizeMultiplier, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Clear the hover lookup for this frame
      const currentProjectedNodes: ProjectedNode[] = [];

      // Create a depth sorted list of everything to render (Z-buffer list)
      interface Renderable {
        z: number;
        draw: () => void;
      }
      const renderQueue: Renderable[] = [];

      // 3. Draw Orbits (faint ellipses tilted in 3D)
      nodes.forEach((node) => {
        const orbitPoints: Point3D[] = [];
        const segments = 90;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          orbitPoints.push({
            x: Math.cos(angle) * node.orbitRadius,
            y: Math.sin(angle * 2) * 5, // slight wavy non-planar distortion for cosmic flavor
            z: Math.sin(angle) * node.orbitRadius,
          });
        }

        // We push drawing of orbit paths directly, or sort segments.
        // For simplicity and perfect appearance, draw the orbit as a continuous line behind and in front of the sun.
        renderQueue.push({
          z: 100, // Background priority, drawn deep
          draw: () => {
            ctx.strokeStyle = node.id === activeTab ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = node.id === activeTab ? 1.5 : 0.8;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            
            orbitPoints.forEach((pt, idx) => {
              const proj = project(pt);
              if (idx === 0) ctx.moveTo(proj.screenX, proj.screenY);
              else ctx.lineTo(proj.screenX, proj.screenY);
            });
            
            ctx.stroke();
            ctx.setLineDash([]); // reset
          },
        });
      });

      // 4. Central Sun ("Vizua Core")
      const coreZ = 0;
      renderQueue.push({
        z: coreZ,
        draw: () => {
          // Glow size pulsates smoothly
          const pulseFactor = isPlaying ? (1.15 + Math.sin(localTime * 12) * 0.1) : (1.0 + Math.sin(localTime * 2.5) * 0.05);
          const baseSize = 24 * pulseFactor;

          // Radial outer glow
          const radialGlow = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, baseSize * 3);
          radialGlow.addColorStop(0, theme.coreColors[0]);
          radialGlow.addColorStop(0.3, theme.coreColors[1] + "77");
          radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = radialGlow;
          ctx.beginPath();
          ctx.arc(centerX, centerY, baseSize * 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Central plasma body
          const plasma = ctx.createRadialGradient(centerX - 4, centerY - 4, 1, centerX, centerY, baseSize);
          plasma.addColorStop(0, "#ffffff");
          plasma.addColorStop(0.5, theme.coreColors[1]);
          plasma.addColorStop(1, theme.coreColors[0]);
          ctx.fillStyle = plasma;
          ctx.beginPath();
          ctx.arc(centerX, centerY, baseSize, 0, Math.PI * 2);
          ctx.fill();

          // Spinning energy rings around the core
          ctx.strokeStyle = theme.coreColors[1] + "aa";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, baseSize * 1.5, localTime * 2, localTime * 2 + Math.PI * 0.6);
          ctx.stroke();

          ctx.strokeStyle = theme.coreColors[0] + "88";
          ctx.beginPath();
          ctx.arc(centerX, centerY, baseSize * 1.7, -localTime * 1.5, -localTime * 1.5 + Math.PI * 0.4);
          ctx.stroke();

          // Soundwave rays expanding if playing music
          if (isPlaying) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 1;
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
              const rayDist = baseSize * 1.8 + Math.abs(Math.sin(localTime * 15 + angle)) * 12;
              const startX = centerX + Math.cos(angle) * (baseSize * 1.2);
              const startY = centerY + Math.sin(angle) * (baseSize * 1.2);
              const endX = centerX + Math.cos(angle) * rayDist;
              const endY = centerY + Math.sin(angle) * rayDist;
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();
            }
          }

          // Core label
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.font = "bold 9px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillText("VIZUA CORE", centerX, centerY + baseSize * 0.25);
        },
      });

      // 5. Place each planet in 3D
      nodes.forEach((node) => {
        // Advance physical position
        planetPhases.current[node.id] += (node.speed * 0.5) * theme.particleSpeed;
        const angle = planetPhases.current[node.id];

        // 3D coordinate on orbital circle
        const planetPt: Point3D = {
          x: Math.cos(angle) * node.orbitRadius,
          y: Math.sin(angle * 2.3) * 6, // orbital wave
          z: Math.sin(angle) * node.orbitRadius,
        };

        const proj = project(planetPt);
        const actualPlanetSize = node.size * proj.sizeMultiplier;

        // Register coordinates for click/hover checking
        currentProjectedNodes.push({
          id: node.id,
          name: node.name,
          sub: node.sub,
          screenX: proj.screenX,
          screenY: proj.screenY,
          size: actualPlanetSize,
          z: proj.z,
        });

        // Add planet drawing job to render queue
        renderQueue.push({
          z: proj.z,
          draw: () => {
            const px = proj.screenX;
            const py = proj.screenY;
            const isHovered = hoveredNodeId === node.id;
            const isActive = activeTab === node.id;

            // 1. Highlight glow backplate if active/hovered
            if (isActive || isHovered) {
              const pulseScale = 1.0 + Math.sin(localTime * 8) * 0.08;
              const glowGrd = ctx.createRadialGradient(px, py, 1, px, py, actualPlanetSize * 2.6);
              glowGrd.addColorStop(0, node.primaryColor + "77");
              glowGrd.addColorStop(0.5, node.secondaryColor + "22");
              glowGrd.addColorStop(1, "rgba(0,0,0,0)");
              ctx.fillStyle = glowGrd;
              ctx.beginPath();
              ctx.arc(px, py, actualPlanetSize * 3.0 * pulseScale, 0, Math.PI * 2);
              ctx.fill();
            }

            // 2. Realistic 3D lighting vector calculations (light comes from Vizua Core at centerX, centerY)
            const dx = px - centerX;
            const dy = py - centerY;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            // Atmospheric outer scatter glow (beautiful colored halo offset slightly with light)
            if (len > 0) {
              const scatOffsetX = -(dx / len) * (actualPlanetSize * 0.2);
              const scatOffsetY = -(dy / len) * (actualPlanetSize * 0.2);
              const haloGrd = ctx.createRadialGradient(
                px + scatOffsetX, py + scatOffsetY, actualPlanetSize * 0.8,
                px + scatOffsetX, py + scatOffsetY, actualPlanetSize * 1.5
              );
              haloGrd.addColorStop(0, node.primaryColor + "aa");
              haloGrd.addColorStop(0.3, node.primaryColor + "33");
              haloGrd.addColorStop(1, "rgba(0, 0, 0, 0)");
              ctx.fillStyle = haloGrd;
              ctx.beginPath();
              ctx.arc(px + scatOffsetX, py + scatOffsetY, actualPlanetSize * 1.5, 0, Math.PI * 2);
              ctx.fill();
            }

            // 3. Draw detailed, multi-layered planetary rings ( Saturn/Jupiter style ) BEFORE the planet body so they wrap beautifully
            if (node.hasRings && node.ringColor) {
              ctx.save();
              ctx.translate(px, py);
              ctx.scale(1.9, 0.45); // Ring flat plane perspective
              
              // Draw 3 distinct concentric ring bands with realistic Cassini-like gaps
              const ringBands = [
                { r1: actualPlanetSize * 1.25, r2: actualPlanetSize * 1.4, col: node.primaryColor + "15" }, // Inner faint ring
                { r1: actualPlanetSize * 1.43, r2: actualPlanetSize * 1.75, col: node.primaryColor + "88" }, // Main bright ring
                { r1: actualPlanetSize * 1.8, r2: actualPlanetSize * 2.05, col: node.secondaryColor + "44" }, // Outer faint ring
              ];

              ringBands.forEach((ring) => {
                ctx.strokeStyle = ring.col;
                const midRadius = (ring.r1 + ring.r2) / 2;
                const thickness = ring.r2 - ring.r1;
                ctx.lineWidth = thickness;
                ctx.beginPath();
                ctx.arc(0, 0, midRadius, 0, Math.PI * 2);
                ctx.stroke();
              });

              ctx.restore();
            }

            // 4. Planet Sphere Body drawing using clipping masks for procedural realism
            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, actualPlanetSize, 0, Math.PI * 2);
            ctx.clip(); // Clip all drawing inside the planet body sphere!

            // Base planet color filling
            ctx.fillStyle = node.secondaryColor;
            ctx.fillRect(px - actualPlanetSize, py - actualPlanetSize, actualPlanetSize * 2, actualPlanetSize * 2);

            // DRAW PROCEDURAL LANDMASSES, BANDS, OR CIRCUITS FOR HIGHER REALISM
            if (node.id === "genesis") {
              // Volcanic / lava planet with continental patches and glowing gold crust fissures
              ctx.fillStyle = "rgba(74, 22, 5, 0.8)"; // Dark basalt crust
              const rotPhase = localTime * 0.12;
              for (let i = 0; i < 4; i++) {
                const cx = px + Math.cos(rotPhase + i * Math.PI / 2) * (actualPlanetSize * 0.5);
                const cy = py + Math.sin(rotPhase * 0.6 + i * Math.PI) * (actualPlanetSize * 0.3);
                ctx.beginPath();
                ctx.arc(cx, cy, actualPlanetSize * 0.55, 0, Math.PI * 2);
                ctx.fill();
              }

              // Bright gold/orange lava veins
              ctx.strokeStyle = "rgba(249, 115, 22, 0.75)";
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              for (let i = 0; i < 3; i++) {
                const yShift = py - actualPlanetSize * 0.5 + (i * actualPlanetSize * 0.5) + Math.sin(localTime * 0.3 + i) * 3;
                ctx.moveTo(px - actualPlanetSize, yShift);
                ctx.quadraticCurveTo(px, yShift + Math.cos(localTime * 0.4) * 6, px + actualPlanetSize, yShift - 2);
              }
              ctx.stroke();

            } else if (node.id === "album") {
              // Gas giant with horizontal gas stripes (Jupiter bands) and a blue cyclone storm
              const bandCount = 10;
              for (let i = 0; i < bandCount; i++) {
                const bandY = py - actualPlanetSize + (i * (actualPlanetSize * 2) / bandCount);
                const bandHeight = (actualPlanetSize * 2) / bandCount;
                const alpha = 0.3 + 0.35 * Math.abs(Math.sin(i * 1.8 + localTime * 0.15));
                ctx.fillStyle = i % 3 === 0 
                  ? `rgba(6, 182, 212, ${alpha})` 
                  : i % 3 === 1 
                    ? `rgba(8, 145, 178, ${alpha * 0.7})` 
                    : `rgba(21, 94, 117, ${alpha * 0.9})`;
                ctx.fillRect(px - actualPlanetSize, bandY, actualPlanetSize * 2, bandHeight);
              }

              // Cyclone Red/Blue Spot
              const spotAngle = localTime * 0.15;
              const spotX = px + Math.cos(spotAngle) * (actualPlanetSize * 0.45);
              const spotY = py + (actualPlanetSize * 0.25);
              const spotGlow = ctx.createRadialGradient(spotX, spotY, 1, spotX, spotY, actualPlanetSize * 0.3);
              spotGlow.addColorStop(0, "rgba(34, 211, 238, 0.95)");
              spotGlow.addColorStop(0.5, "rgba(6, 182, 212, 0.4)");
              spotGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
              ctx.fillStyle = spotGlow;
              ctx.beginPath();
              ctx.arc(spotX, spotY, actualPlanetSize * 0.3, 0, Math.PI * 2);
              ctx.fill();

            } else if (node.id === "forge") {
              // Cybernetic planet with futuristic technological gridlines and a sine soundwave
              ctx.strokeStyle = "rgba(236, 72, 153, 0.45)";
              ctx.lineWidth = 1;
              const lineCount = 6;
              const scrollOffset = (localTime * 12) % (actualPlanetSize * 2);
              for (let i = -1; i <= lineCount; i++) {
                const x = px - actualPlanetSize + (i * (actualPlanetSize * 2) / lineCount) + scrollOffset;
                ctx.beginPath();
                ctx.moveTo(x, py - actualPlanetSize);
                ctx.lineTo(x, py + actualPlanetSize);
                ctx.stroke();
              }

              // Real active sine wave signal scrolling horizontally
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              for (let sx = px - actualPlanetSize; sx <= px + actualPlanetSize; sx += 2) {
                const relX = sx - px;
                const sy = py + Math.sin(relX * 0.18 + localTime * 6.5) * (actualPlanetSize * 0.3);
                if (sx === px - actualPlanetSize) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
              }
              ctx.stroke();

            } else if (node.id === "oracle") {
              // Mystical purple world with cosmic swirling storm clouds
              const swirlGrd = ctx.createRadialGradient(px, py, 1, px, py, actualPlanetSize);
              swirlGrd.addColorStop(0, "rgba(168, 85, 247, 0.9)");
              swirlGrd.addColorStop(0.6, "rgba(147, 51, 234, 0.5)");
              swirlGrd.addColorStop(1, "rgba(15, 5, 30, 0.95)");
              ctx.fillStyle = swirlGrd;
              ctx.fillRect(px - actualPlanetSize, py - actualPlanetSize, actualPlanetSize * 2, actualPlanetSize * 2);

              ctx.strokeStyle = "rgba(192, 132, 252, 0.4)";
              ctx.lineWidth = 1.5;
              ctx.save();
              ctx.translate(px, py);
              ctx.rotate(localTime * 0.25);
              ctx.beginPath();
              for (let i = 0; i < 4; i++) {
                ctx.rotate(Math.PI / 2);
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(actualPlanetSize * 0.5, -actualPlanetSize * 0.25, actualPlanetSize * 0.85, 0);
              }
              ctx.stroke();
              ctx.restore();
            }

            // 5. High-fidelity 3D Spherical Shading Overlay (combining diffuse light side, crescent limb, and absolute deep space shadow)
            const lightOffsetX = len > 0 ? -(dx / len) * (actualPlanetSize * 0.35) : 0;
            const lightOffsetY = len > 0 ? -(dy / len) * (actualPlanetSize * 0.35) : 0;

            const shadowGrd = ctx.createRadialGradient(
              px + lightOffsetX, py + lightOffsetY, actualPlanetSize * 0.15,
              px, py, actualPlanetSize
            );
            shadowGrd.addColorStop(0, "rgba(255, 255, 255, 0.2)"); // Bright specular core
            shadowGrd.addColorStop(0.25, "rgba(255, 255, 255, 0.0)"); // Midtones
            shadowGrd.addColorStop(0.75, "rgba(0, 0, 0, 0.65)"); // Soft shadow start
            shadowGrd.addColorStop(1.0, "rgba(5, 5, 20, 0.98)"); // Deep dark night side

            ctx.fillStyle = shadowGrd;
            ctx.beginPath();
            ctx.arc(px, py, actualPlanetSize + 1, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore(); // Release clipping mask

            // 6. Atmospheric edge flare (realistic glowing rim facing light source)
            ctx.strokeStyle = node.primaryColor + "ee";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(px, py, actualPlanetSize, 0, Math.PI * 2);
            ctx.stroke();

            // Active digital pulsing ring indicator
            if (isActive) {
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 1.5;
              ctx.setLineDash([2, 4]);
              ctx.beginPath();
              ctx.arc(px, py, actualPlanetSize + 5, localTime * 2.5, localTime * 2.5 + Math.PI * 2);
              ctx.stroke();
              ctx.setLineDash([]);
            }

            // Draw HUD target ring on hover
            if (isHovered) {
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(px, py, actualPlanetSize + 9, 0, Math.PI * 2);
              ctx.stroke();

              // Crosshair tick marks
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 1.5;
              for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
                ctx.beginPath();
                ctx.moveTo(px + Math.cos(a) * (actualPlanetSize + 7), py + Math.sin(a) * (actualPlanetSize + 7));
                ctx.lineTo(px + Math.cos(a) * (actualPlanetSize + 11), py + Math.sin(a) * (actualPlanetSize + 11));
                ctx.stroke();
              }
            }

            // Draw moons representing tracks orbiting around the ALBUM planet
            if (node.moons && node.moons.length > 0) {
              node.moons.forEach((moon) => {
                // Update moon rotation phase
                moonPhases.current[moon.id] += (moon.speed * 0.5) * theme.particleSpeed;
                const mAngle = moonPhases.current[moon.id];

                // 3D Position of moon relative to planet
                // Moon orbit tilted out of standard planet plane
                const relativeMoonPt: Point3D = {
                  x: Math.cos(mAngle) * moon.radius,
                  y: Math.sin(mAngle) * moon.radius * 0.25, // tilted ellipse
                  z: Math.sin(mAngle) * moon.radius,
                };

                // Add to planet position to get global coordinates
                const globalMoonPt: Point3D = {
                  x: planetPt.x + relativeMoonPt.x,
                  y: planetPt.y + relativeMoonPt.y,
                  z: planetPt.z + relativeMoonPt.z,
                };

                const mProj = project(globalMoonPt);
                const actualMoonSize = moon.size * mProj.sizeMultiplier;

                // Draw moon
                renderQueue.push({
                  z: mProj.z,
                  draw: () => {
                    const isTrackActive = activeTrackId === moon.id;
                    const mx = mProj.screenX;
                    const my = mProj.screenY;

                    // Audio ripple if playing
                    if (isTrackActive && isPlaying) {
                      const waveRadius = actualMoonSize * (2.2 + Math.sin(localTime * 14) * 0.4);
                      ctx.strokeStyle = moon.color + "99";
                      ctx.lineWidth = 0.8;
                      ctx.beginPath();
                      ctx.arc(mx, my, waveRadius, 0, Math.PI * 2);
                      ctx.stroke();
                    }

                    // Sphere gradient for moon with dynamic realism
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(mx, my, actualMoonSize, 0, Math.PI * 2);
                    ctx.clip();

                    // Procedural mini crater details on moon
                    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
                    const moonRot = localTime * 0.3;
                    for (let i = 0; i < 3; i++) {
                      const cx = mx + Math.cos(moonRot + i * 2) * (actualMoonSize * 0.4);
                      const cy = my + Math.sin(moonRot + i * 3) * (actualMoonSize * 0.4);
                      ctx.beginPath();
                      ctx.arc(cx, cy, actualMoonSize * 0.25, 0, Math.PI * 2);
                      ctx.fill();
                    }

                    // 3D Shadow overlay on moon relative to the sun source
                    const moonDx = mx - centerX;
                    const moonDy = my - centerY;
                    const moonLen = Math.sqrt(moonDx * moonDx + moonDy * moonDy);
                    const mLitX = moonLen > 0 ? -(moonDx / moonLen) * (actualMoonSize * 0.45) : 0;
                    const mLitY = moonLen > 0 ? -(moonDy / moonLen) * (actualMoonSize * 0.45) : 0;

                    const mShadowGrd = ctx.createRadialGradient(
                      mx + mLitX, my + mLitY, actualMoonSize * 0.1,
                      mx, my, actualMoonSize
                    );
                    mShadowGrd.addColorStop(0, "rgba(255, 255, 255, 0.2)");
                    mShadowGrd.addColorStop(0.4, "rgba(0, 0, 0, 0)");
                    mShadowGrd.addColorStop(0.95, "rgba(0, 0, 0, 0.92)");
                    ctx.fillStyle = mShadowGrd;
                    ctx.beginPath();
                    ctx.arc(mx, my, actualMoonSize + 0.5, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();

                    // Soft atmospheric rim light around moon
                    ctx.strokeStyle = moon.color + "77";
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.arc(mx, my, actualMoonSize, 0, Math.PI * 2);
                    ctx.stroke();

                    // Glow for active track
                    if (isTrackActive) {
                      ctx.strokeStyle = "#ffffff";
                      ctx.lineWidth = 1;
                      ctx.beginPath();
                      ctx.arc(mx, my, actualMoonSize + 1.5, 0, Math.PI * 2);
                      ctx.stroke();
                    }

                    // Show small track index or initials near moon if hovered or playing
                    if (isHovered || isTrackActive) {
                      ctx.fillStyle = "#ffffff";
                      ctx.font = "bold 7px 'JetBrains Mono', monospace";
                      ctx.textAlign = "center";
                      ctx.fillText(moon.title.substring(0, 4).toUpperCase(), mx, my - actualMoonSize - 3);
                    }
                  },
                });
              });
            }

            // Draw HUD text line next to planet
            const labelX = px + actualPlanetSize + 8;
            const labelY = py + 3;

            ctx.fillStyle = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)";
            ctx.font = isActive ? "bold 10px 'Inter', sans-serif" : "500 9px 'Inter', sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(node.name.toUpperCase(), labelX, labelY);

            // Sleek data code string
            ctx.fillStyle = node.primaryColor;
            ctx.font = "6px 'JetBrains Mono', monospace";
            ctx.fillText(`SYS_${node.id.toUpperCase()}_NODE`, labelX, labelY + 7);
          },
        });
      });

      // 6. Draw deep nebulous dust clouds or wave currents ( Aurora Mood )
      if (mood === "aurora") {
        renderQueue.push({
          z: 200, // deep background
          draw: () => {
            ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let x = 0; x < width; x += 15) {
              const y = centerY + Math.sin(x * 0.01 + localTime * 0.8) * 35 + Math.cos(x * 0.005) * 15;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();

            ctx.strokeStyle = "rgba(234, 179, 8, 0.05)";
            ctx.beginPath();
            for (let x = 0; x < width; x += 15) {
              const y = centerY + 15 + Math.cos(x * 0.012 - localTime * 0.5) * 40;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          },
        });
      }

      // 7. Depth Sorting and Drawing
      // Sort elements by z descending (large z, further back, drawn first)
      renderQueue.sort((a, b) => b.z - a.z);
      renderQueue.forEach((item) => item.draw());

      // Save projected nodes to ref so hover & clicks can capture them
      projectedNodes.current = currentProjectedNodes;

      // Repeat animation loop
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, mood, activeTab, hoveredNodeId, isPlaying, activeTrackId, isRotatingAutomatically, lang]);

  // Mouse drag & click event handlers to rotate 3D viewport
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Handle dragging to rotate in 3D
    if (isDragging.current) {
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      cameraAngleY.current += deltaX * 0.01;
      cameraAngleX.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, cameraAngleX.current + deltaY * 0.01));

      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
      return;
    }

    // 2. Handle planet picking on mouse hover
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let matchedNodeId: string | null = null;
    for (let node of projectedNodes.current) {
      const dx = mouseX - node.screenX;
      const dy = mouseY - node.screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // check if inside collision boundary
      if (dist < node.size + 15) {
        matchedNodeId = node.id;
        break;
      }
    }

    if (matchedNodeId !== hoveredNodeId) {
      setHoveredNodeId(matchedNodeId);
      if (matchedNodeId) {
        triggerBeep(520);
        // Pause automatic rotation while user inspects
        setIsRotatingAutomatically(false);
      }
    }
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    // Resume automatic camera rotation after a short delay
    setTimeout(() => {
      if (!isDragging.current && hoveredNodeId === null) {
        setIsRotatingAutomatically(true);
      }
    }, 4000);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let node of projectedNodes.current) {
      const dx = mouseX - node.screenX;
      const dy = mouseY - node.screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < node.size + 15) {
        // Trigger tab switch
        onTabChange(node.id);
        triggerBeep(880);
        return;
      }
    }
  };

  // Get active planet info for the sidebar summary info card
  const activePlanet = nodes.find((n) => n.id === activeTab) || nodes[1];

  return (
    <div className="flex flex-col bg-slate-950/60 rounded-3xl border border-slate-900 overflow-hidden relative">
      {/* Upper info panel */}
      <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/80 flex items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-mono text-neon-blue uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 animate-spin-slow" /> COGNITIVE CORE MAP
          </span>
          <h3 className="font-display text-sm font-black text-white tracking-wide uppercase">
            {trans.title}
          </h3>
        </div>
        
        {/* Toggle automated orbit */}
        <button
          onClick={() => {
            setIsRotatingAutomatically(!isRotatingAutomatically);
            triggerBeep(380);
          }}
          className={`px-2 py-1 rounded border text-[8px] font-mono uppercase transition-all cursor-pointer ${
            isRotatingAutomatically
              ? "bg-neon-blue/15 border-neon-blue/30 text-neon-blue"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
          title="Toggle Auto-Spin"
        >
          {isRotatingAutomatically ? "AUTO_ROT: ON" : "AUTO_ROT: LOCKED"}
        </button>
      </div>

      {/* Interactive Canvas viewport */}
      <div ref={containerRef} className="relative w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClick={handleCanvasClick}
          className="block w-full h-auto"
        />

        {/* Drag to rotate overlay clue */}
        <div className="absolute bottom-3 left-4 text-[8px] font-mono text-slate-500 pointer-events-none select-none flex items-center gap-1.5 bg-slate-950/40 px-2 py-0.5 rounded">
          <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
          <span>{trans.subtitle}</span>
        </div>

        {/* Active track telemetry indicator */}
        {isPlaying && activeTrackId && (
          <div className="absolute top-4 left-4 bg-slate-950/90 border border-neon-blue/30 rounded-lg p-2 max-w-[200px] pointer-events-none select-none animate-pulse">
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-neon-blue uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-ping" />
              <span>{trans.trackPlaying}</span>
            </div>
            <div className="text-[10px] font-display font-black text-white mt-1 truncate">
              {activeTrackId.replace("-", " ").toUpperCase()}
            </div>
          </div>
        )}

        {/* Dynamic Interactive Planet Hologram Overlay Card */}
        {hoveredNodeId && (
          <div className="absolute bottom-4 right-4 bg-slate-950/95 border border-slate-800 rounded-xl p-3 shadow-2xl max-w-[210px] pointer-events-none select-none animate-fade-in z-50">
            {(() => {
              const hoverNode = nodes.find((n) => n.id === hoveredNodeId);
              if (!hoverNode) return null;
              return (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded uppercase font-bold" style={{ backgroundColor: hoverNode.primaryColor + "15", color: hoverNode.primaryColor, border: `1px solid ${hoverNode.primaryColor}30` }}>
                      SYS_{hoverNode.id.toUpperCase()}
                    </span>
                    <span className="text-[7px] font-mono text-slate-500">
                      R: {hoverNode.orbitRadius}LY
                    </span>
                  </div>
                  <h4 className="font-display text-xs font-black text-white mt-1.5 uppercase">
                    {hoverNode.name}
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                    {hoverNode.sub}
                  </p>
                  
                  {hoverNode.moons.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-900">
                      <span className="text-[7px] font-mono text-slate-500 block uppercase tracking-wider mb-1">
                        {trans.tracks} ({hoverNode.moons.length})
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {hoverNode.moons.map((m: any) => (
                          <div key={m.id} className="flex items-center justify-between text-[7.5px] font-mono">
                            <span className={activeTrackId === m.id ? "text-neon-blue font-bold" : "text-slate-400"}>• {m.title}</span>
                            <span className="text-slate-600">S:{m.size}px</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 text-[6.5px] font-mono text-slate-500 text-right uppercase">
                    {trans.backToApp}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Mood Theme Selector & Active Telemetry at Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Mood select triggers */}
        <div>
          <label className="text-[8.5px] font-mono text-slate-400 block mb-1.5 uppercase tracking-widest font-bold">
            {trans.moodLabel}
          </label>
          <div className="grid grid-cols-4 gap-1">
            {(Object.keys(moodThemes) as CosmicMood[]).map((m) => {
              const isSelected = mood === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setMood(m);
                    triggerBeep(isSelected ? 400 : 650);
                  }}
                  className={`py-1 text-[8.5px] font-mono rounded border uppercase transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-950 font-extrabold border-white scale-[1.03]"
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {m === "cyberpunk" ? "CYBER" : m === "zen" ? "CALM" : m === "supernova" ? "FLARE" : "AURORA"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Hub info readouts */}
        <div className="flex flex-col bg-slate-900/40 border border-slate-900 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[8px] font-mono">
            <span className="text-slate-500 uppercase">{trans.activeNode}</span>
            <span className="text-neon-blue font-bold">RAD: {activePlanet.orbitRadius}LY</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activePlanet.primaryColor }} />
            <span className="font-display text-[10px] font-bold text-white uppercase tracking-wider">{activePlanet.name}</span>
          </div>
          <span className="text-[8px] font-sans text-slate-400 mt-0.5 truncate">{activePlanet.sub}</span>
        </div>
      </div>
    </div>
  );
}
