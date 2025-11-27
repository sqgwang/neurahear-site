'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseX: number;
  baseY: number;
  angle: number;
  radius: number;
  orbit?: number;
  speed?: number;
}

type VisualMode = 'quantum' | 'strings' | 'spectrum' | 'nebula' | 'blackhole';
type ColorTheme = 'cyan' | 'purple' | 'gold' | 'rainbow';
type FreqRange = 'full' | 'bass' | 'mid' | 'treble';

export default function QuantumAcoustics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Settings
  const [mode, setMode] = useState<VisualMode>('quantum');
  const [sensitivity, setSensitivity] = useState(1.5);
  const [speed, setSpeed] = useState(1.0);
  const [theme, setTheme] = useState<ColorTheme>('cyan');
  const [freqRange, setFreqRange] = useState<FreqRange>('full');
  const [showControls, setShowControls] = useState(false);
  const [autoCycle, setAutoCycle] = useState(false);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzerNode = ctx.createAnalyser();
      const sourceNode = ctx.createMediaStreamSource(stream);
      
      sourceNode.connect(analyzerNode);
      analyzerNode.fftSize = 512;
      analyzerNode.smoothingTimeConstant = 0.85;
      
      setAudioContext(ctx);
      setAnalyser(analyzerNode);
      setSource(sourceNode);
      setIsListening(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access is required for the acoustic visualization.');
    }
  };

  const stopListening = () => {
    if (source) source.disconnect();
    if (analyser) analyser.disconnect();
    if (audioContext) audioContext.close();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    setIsListening(false);
    setAudioContext(null);
    setAnalyser(null);
    setSource(null);
  };

  const getThemeColors = (t: ColorTheme, time: number) => {
    switch(t) {
      case 'purple': return { base: 260, range: 60 };
      case 'gold': return { base: 30, range: 40 };
      case 'rainbow': return { base: (time * 50) % 360, range: 180 };
      case 'cyan': default: return { base: 180, range: 60 };
    }
  };

  // Auto-cycle modes
  useEffect(() => {
    if (!autoCycle || !isListening) return;
    const modes: VisualMode[] = ['quantum', 'strings', 'spectrum', 'nebula', 'blackhole'];
    const interval = setInterval(() => {
      setMode(prev => {
        const idx = modes.indexOf(prev);
        return modes[(idx + 1) % modes.length];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [autoCycle, isListening]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = 200;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100 + 50;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: '',
        baseX: centerX + Math.cos(angle) * radius,
        baseY: centerY + Math.sin(angle) * radius,
        angle: angle,
        radius: radius,
        orbit: Math.random() * 150 + 50,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear with trail effect
      ctx.fillStyle = mode === 'nebula' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';
      if (mode === 'blackhole') ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let frequencyData = new Uint8Array(0);
      let averageFrequency = 0;

      if (isListening && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        frequencyData = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(frequencyData);
        
        let startBin = 0;
        let endBin = bufferLength;
        
        if (freqRange === 'bass') endBin = Math.floor(bufferLength * 0.2);
        else if (freqRange === 'mid') { startBin = Math.floor(bufferLength * 0.2); endBin = Math.floor(bufferLength * 0.6); }
        else if (freqRange === 'treble') startBin = Math.floor(bufferLength * 0.6);

        let sum = 0;
        let count = 0;
        for(let i = startBin; i < endBin; i++) {
          sum += frequencyData[i];
          count++;
        }
        averageFrequency = (count > 0 ? sum / count : 0) * sensitivity;
      }

      const time = Date.now() * 0.001 * speed;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const themeColors = getThemeColors(theme, time);
      
      // Mouse interaction target
      const targetX = mouseRef.current.active ? mouseRef.current.x : cx;
      const targetY = mouseRef.current.active ? mouseRef.current.y : cy;

      if (mode === 'quantum') {
        // --- QUANTUM MODE ---
        particles.forEach((p, i) => {
          if (!isListening) {
            const floatScale = 20;
            p.x = p.baseX + Math.cos(time + p.angle) * floatScale;
            p.y = p.baseY + Math.sin(time + p.angle * 2) * floatScale;
            p.color = `hsla(${themeColors.base + Math.sin(time + i) * 30}, 70%, 60%, 0.6)`;
          } else {
            const freqIndex = Math.floor((i / particleCount) * (frequencyData.length || 0));
            const freqValue = frequencyData[freqIndex] || 0;
            const normalizedFreq = (freqValue / 255) * sensitivity;

            const expansion = averageFrequency * 2; 
            const wave = Math.sin(time * 5 + p.angle * 4) * (normalizedFreq * 50);
            
            // Mouse repulsion
            const dx = p.x - targetX;
            const dy = p.y - targetY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const repulsion = mouseRef.current.active && dist < 150 ? (150 - dist) * 0.5 : 0;

            const currentRadius = p.radius + expansion + wave + repulsion;
            
            p.angle += (0.002 + (normalizedFreq * 0.05)) * speed;
            
            p.x = cx + Math.cos(p.angle) * currentRadius;
            p.y = cy + Math.sin(p.angle) * currentRadius;

            const hue = themeColors.base + (normalizedFreq * themeColors.range * 2);
            const alpha = 0.4 + normalizedFreq * 0.6;
            
            p.color = `hsla(${hue}, 80%, 60%, ${alpha})`;
            
            if (normalizedFreq > 0.3) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              if (normalizedFreq > 0.6) {
                 ctx.lineTo(cx, cy);
                 ctx.strokeStyle = `hsla(${hue}, 80%, 80%, 0.1)`;
              }
              ctx.stroke();
            }
          }
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, isListening ? p.size + (frequencyData[i % frequencyData.length] / 255 * 5) : p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

      } else if (mode === 'strings') {
        // --- STRINGS MODE ---
        const lines = 20;
        const step = canvas.height / lines;
        
        for(let i = 0; i < lines; i++) {
          ctx.beginPath();
          const y = (i * step) + (step / 2);
          
          ctx.moveTo(0, y);
          
          for(let x = 0; x < canvas.width; x += 5) {
            let distortion = 0;
            if (isListening) {
              const freqIndex = Math.floor((x / canvas.width) * frequencyData.length);
              const val = frequencyData[freqIndex] || 0;
              
              // Mouse interaction
              const dx = x - targetX;
              const dy = y - targetY;
              const dist = Math.sqrt(dx*dx + dy*dy);
              const mouseWave = mouseRef.current.active && dist < 100 ? Math.sin(dist * 0.1 - time * 10) * 20 : 0;

              distortion = Math.sin(x * 0.01 + time * 2 + i) * (val * sensitivity * 0.5) + mouseWave;
            } else {
              distortion = Math.sin(x * 0.01 + time + i) * 5;
            }
            
            ctx.lineTo(x, y + distortion);
          }
          
          const hue = themeColors.base + (i / lines) * themeColors.range;
          ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.5)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

      } else if (mode === 'spectrum') {
        // --- SPECTRUM MODE ---
        const bars = 64;
        const radius = 80;
        const angleStep = (Math.PI * 2) / bars;
        
        ctx.translate(cx, cy);
        // Rotate entire spectrum with mouse x
        if (mouseRef.current.active) {
            ctx.rotate((mouseRef.current.x / canvas.width) * Math.PI * 2);
        }
        
        for(let i = 0; i < bars; i++) {
          const val = isListening ? (frequencyData[i * 2] || 0) * sensitivity : 20 + Math.sin(time * 5 + i) * 10;
          const angle = i * angleStep;
          
          const x1 = Math.cos(angle) * radius;
          const y1 = Math.sin(angle) * radius;
          const x2 = Math.cos(angle) * (radius + val * 0.8);
          const y2 = Math.sin(angle) * (radius + val * 0.8);
          
          const hue = themeColors.base + (val / 255) * themeColors.range * 2;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);

      } else if (mode === 'nebula') {
        // --- NEBULA MODE ---
        // Draw soft glowing orbs
        particles.slice(0, 50).forEach((p, i) => {
            const val = isListening ? (frequencyData[i % 32] || 0) * sensitivity : 50;
            const norm = val / 255;
            
            // Drift
            p.x += Math.sin(time + i) * 0.5;
            p.y += Math.cos(time + i * 0.5) * 0.5;
            
            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            const size = p.radius * (1 + norm * 2);
            const hue = themeColors.base + norm * 100 + (i * 5);
            
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
            grad.addColorStop(0, `hsla(${hue}, 80%, 60%, ${0.1 + norm * 0.2})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        });

      } else if (mode === 'blackhole') {
        // --- BLACK HOLE MODE ---
        const centerRadius = 30 + averageFrequency * 0.5;
        
        // Event Horizon
        ctx.beginPath();
        ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();
        ctx.strokeStyle = `hsla(${themeColors.base}, 100%, 70%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Accretion Disk Particles
        particles.forEach((p, i) => {
            const val = isListening ? (frequencyData[i % 64] || 0) * sensitivity : 20;
            const norm = val / 255;
            
            // Spiral movement
            p.angle += (p.speed || 0.01) * (1 + norm * 2) * speed;
            
            // Distance from center (Orbit)
            // Audio pushes particles OUT, Gravity pulls IN
            let orbit = p.orbit || 100;
            if (isListening) {
                orbit += norm * 100; // Push out
            }
            
            // Mouse gravity well
            if (mouseRef.current.active) {
                const dx = mouseRef.current.x - cx;
                const dy = mouseRef.current.y - cy;
                // Shift center slightly based on mouse
                p.x = (cx + dx * 0.2) + Math.cos(p.angle) * orbit;
                p.y = (cy + dy * 0.2) + Math.sin(p.angle) * (orbit * 0.6); // Elliptical
            } else {
                p.x = cx + Math.cos(p.angle) * orbit;
                p.y = cy + Math.sin(p.angle) * (orbit * 0.6);
            }

            const hue = themeColors.base + (1 - (orbit / 300)) * 100;
            const size = (p.size * (1 + norm)) * (1 - (orbit/400)); // Smaller when further
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, size > 0 ? size : 0, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${0.6 + norm * 0.4})`;
            ctx.fill();
        });
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isListening, analyser, mode, sensitivity, speed, theme, freqRange]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Quantum Acoustic Field</h3>
          <p className="text-sm text-slate-500">Interactive sound visualization</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-full transition-colors ${showControls ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isListening 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-brand-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
            }`}
          >
            {isListening ? (
              <span className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Stop
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Activate
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className={`bg-slate-50 border-b border-slate-100 transition-all duration-300 overflow-hidden ${showControls ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mode Selector */}
          <div className="col-span-full">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Visualization Mode</label>
              <button 
                onClick={() => setAutoCycle(!autoCycle)}
                className={`text-xs px-2 py-0.5 rounded-full border ${autoCycle ? 'bg-green-100 text-green-700 border-green-200' : 'text-slate-400 border-slate-200'}`}
              >
                Auto Cycle: {autoCycle ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['quantum', 'strings', 'spectrum', 'nebula', 'blackhole'] as VisualMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                    mode === m ? 'bg-white shadow-sm text-brand-primary font-medium' : 'text-slate-500 hover:bg-white/50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Color Theme</label>
            <div className="flex gap-2">
              {(['cyan', 'purple', 'gold', 'rainbow'] as ColorTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    theme === t ? 'border-slate-400 scale-110' : 'border-transparent'
                  }`}
                  style={{ 
                    background: t === 'rainbow' 
                      ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' 
                      : t === 'cyan' ? '#06b6d4' : t === 'purple' ? '#8b5cf6' : '#eab308' 
                  }}
                  title={t}
                />
              ))}
            </div>
          </div>

          {/* Frequency Focus */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Freq Focus</label>
            <div className="flex gap-1 bg-slate-200 p-1 rounded-lg w-fit">
              {(['full', 'bass', 'mid', 'treble'] as FreqRange[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFreqRange(f)}
                  className={`px-3 py-1 rounded-md text-xs capitalize transition-all ${
                    freqRange === f ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Sensitivity: {sensitivity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Speed: {speed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-96 bg-slate-50">
        <canvas 
          ref={canvasRef} 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block cursor-crosshair"
        />
        {!isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-400 text-sm bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
              Waiting for acoustic input...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
