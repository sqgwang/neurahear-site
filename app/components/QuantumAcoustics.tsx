'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  angle: number;
  radius: number;
  orbit?: number;
  speed?: number;
}

type VisualMode = 'galaxy' | 'warp' | 'quantum' | 'spectrum' | 'grid' | 'snapshot' | 'neural' | 'blackhole' | 'dna' | 'flow' | 'cymatic';
type ColorTheme = 'cyan' | 'purple' | 'gold' | 'rainbow' | 'matrix';
type FreqRange = 'full' | 'bass' | 'mid' | 'treble';

export default function QuantumAcoustics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  // Interaction State
  const mouseRef = useRef({ x: 0, y: 0, active: false, down: false, lastX: 0, lastY: 0 });
  const rotationRef = useRef({ x: 0, y: 0 }); // Camera rotation
  const velocityRef = useRef({ x: 0, y: 0 }); // Rotation velocity for inertia

  // Settings
  const [mode, setMode] = useState<VisualMode>('galaxy');
  const [sensitivity, setSensitivity] = useState(1.5);
  const [speed, setSpeed] = useState(1.0);
  const [theme, setTheme] = useState<ColorTheme>('cyan');
  const [freqRange, setFreqRange] = useState<FreqRange>('full');
  const [showControls, setShowControls] = useState(false);
  const [autoCycle, setAutoCycle] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Snapshot State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [snapshotParticles, setSnapshotParticles] = useState<Particle[]>([]);
  const recordingRef = useRef<{ count: number; sums: Float32Array } | null>(null);
  // History for Time-based visualization (Flow mode)
  const historyRef = useRef<Uint8Array[]>([]);
  const maxHistory = 40; // Number of "slices" in time to keep

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) throw new Error('Web Audio API is not supported in this browser.');
      const ctx = new AudioContextCtor();
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
      case 'matrix': return { base: 120, range: 20 };
      case 'cyan': default: return { base: 180, range: 60 };
    }
  };

  const handleStartRecording = () => {
    if (!isListening) {
      startListening();
      // Give it a moment to start
      setTimeout(() => setIsRecording(true), 500);
    } else {
      setIsRecording(true);
    }
    setRecordingProgress(0);
    // Initialize accumulator (size 512 matches fftSize/2 usually, but let's assume 256 bins for simplicity or check fftSize)
    // fftSize is 512, so binCount is 256.
    recordingRef.current = { count: 0, sums: new Float32Array(256) };
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `neurahear-voice-crystal-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Auto-cycle modes
  useEffect(() => {
    if (!autoCycle || !isListening) return;
    const modes: VisualMode[] = ['galaxy', 'warp', 'neural', 'blackhole', 'dna', 'flow', 'cymatic', 'quantum', 'spectrum', 'grid'];
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
    const particleCount = 1200; // Increased for higher resolution in Flow/Cymatic modes
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Initialize with random 3D positions
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200 + 50;
      const z = (Math.random() - 0.5) * 400; // Depth
      
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        z: z,
        baseX: Math.cos(angle) * radius, // Relative to center
        baseY: Math.sin(angle) * radius,
        baseZ: z,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 0.5,
        color: '',
        angle: angle,
        radius: radius,
        orbit: Math.random() * 200 + 50,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear with trail effect
      ctx.fillStyle = theme === 'matrix' ? 'rgba(0, 10, 0, 0.2)' : 'rgba(10, 10, 15, 0.2)';
      if (mode === 'quantum' || mode === 'spectrum') ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let frequencyData = new Uint8Array(0);
      let averageFrequency = 0;

      if (isListening && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        frequencyData = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(frequencyData);
        
        // Recording Logic
        if (isRecording && recordingRef.current) {
            const rec = recordingRef.current;
            for(let i = 0; i < Math.min(rec.sums.length, bufferLength); i++) {
                rec.sums[i] += frequencyData[i];
            }
            rec.count++;
            
            // Update progress (record for ~3 seconds at 60fps = 180 frames)
            const maxFrames = 180;
            const progress = Math.min(100, (rec.count / maxFrames) * 100);
            setRecordingProgress(progress);
            
            if (rec.count >= maxFrames) {
                setIsRecording(false);
                setMode('snapshot');
                
                // Generate Snapshot Particles
                const newParticles: Particle[] = [];
                const count = 1000; // High density for crystal
                
                for(let i = 0; i < count; i++) {
                    // Map particle to frequency bin
                    const binIndex = Math.floor((i / count) * rec.sums.length);
                    const avgAmp = rec.sums[binIndex] / rec.count; // 0-255
                    const norm = avgAmp / 255;
                    
                    // Sphere distribution
                    const phi = Math.acos(-1 + (2 * i) / count);
                    const theta = Math.sqrt(count * Math.PI) * phi;
                    
                    const r = 100 + (norm * 150); // Amplitude affects radius
                    
                    newParticles.push({
                        x: 0, y: 0, z: 0, // Will be calculated in draw
                        baseX: r * Math.cos(theta) * Math.sin(phi),
                        baseY: r * Math.sin(theta) * Math.sin(phi),
                        baseZ: r * Math.cos(phi),
                        vx: 0, vy: 0, vz: 0,
                        size: 1 + norm * 3,
                        color: '', // Calculated in draw
                        angle: 0,
                        radius: r,
                        orbit: norm // Store intensity in orbit
                    });
                }
                setSnapshotParticles(newParticles);
            }
        }
        
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

        // Update History
        if (historyRef.current.length >= maxHistory) {
            historyRef.current.pop();
        }
        // Clone the data to store it
        historyRef.current.unshift(new Uint8Array(frequencyData));
      }

      const time = Date.now() * 0.001 * speed;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const themeColors = getThemeColors(theme, time);
      
      // 3D Projection Constants
      const fov = 300;
      
      // Rotation Physics (Inertia)
      if (!mouseRef.current.down) {
        // Apply velocity
        rotationRef.current.x += velocityRef.current.x;
        rotationRef.current.y += velocityRef.current.y;
        
        // Friction
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;
        
        // Auto-rotate if stopped
        if (Math.abs(velocityRef.current.x) < 0.0001 && Math.abs(velocityRef.current.y) < 0.0001) {
             rotationRef.current.y += 0.002 * speed;
             rotationRef.current.x = Math.sin(time * 0.5) * 0.1;
        }
      }

      // --- 3D MODES ---
      if (['galaxy', 'warp', 'grid', 'snapshot', 'neural', 'blackhole', 'dna', 'flow', 'cymatic'].includes(mode)) {
        
        const currentParticles = mode === 'snapshot' ? snapshotParticles : particles;
        const projectedParticles: {x: number, y: number, z: number, size: number, color: string, alpha: number}[] = [];

        currentParticles.forEach((p, i) => {
          let x = p.baseX;
          let y = p.baseY;
          let z = p.baseZ;

          const val = isListening ? (frequencyData[i % frequencyData.length] || 0) * sensitivity : 0;
          const norm = val / 255;

          if (mode === 'galaxy') {
            // Spiral Galaxy Logic
            const spiralAngle = p.angle + time * 0.5 + (norm * 0.5);
            const spiralRadius = p.orbit || 100;
            
            x = Math.cos(spiralAngle) * spiralRadius;
            z = Math.sin(spiralAngle) * spiralRadius;
            y = (Math.sin(spiralAngle * 2) * 50) + (norm * 100); // Audio affects height
            
          } else if (mode === 'warp') {
            // Warp Speed Logic
            z = p.z - (speed * 10) - (averageFrequency * 2); // Move towards camera
            if (z < -fov) z = 1000; // Reset to back
            p.z = z;
            
            x = p.baseX * 2;
            y = p.baseY * 2;
            
            // Audio shakes the tunnel
            if (isListening) {
                const shake = norm * 20;
                x += (Math.random() - 0.5) * shake;
                y += (Math.random() - 0.5) * shake;
            }

          } else if (mode === 'grid') {
            // 3D Terrain/Grid Logic
            const cols = 20;
            const row = Math.floor(i / cols);
            const col = i % cols;
            const spacing = 40;
            
            x = (col - cols/2) * spacing;
            z = (row - cols/2) * spacing;
            
            // Audio affects Y (height)
            const distFromCenter = Math.sqrt(x*x + z*z);
            const wave = Math.sin(distFromCenter * 0.05 - time * 2);
            y = wave * 20 + (norm * 100);
          } else if (mode === 'snapshot') {
             // Static Crystal Logic
             const breath = 1 + Math.sin(time) * 0.05;
             x = p.baseX * breath;
             y = p.baseY * breath;
             z = p.baseZ * breath;
          } else if (mode === 'neural') {
             // Neural Network Logic
             const pulse = 1 + (norm * 0.5);
             x = p.baseX * pulse;
             y = p.baseY * pulse;
             z = p.baseZ * pulse;
             
             // Rotate slowly
             const rot = time * 0.1;
             const x0 = x;
             x = x0 * Math.cos(rot) - z * Math.sin(rot);
             z = z * Math.cos(rot) + x0 * Math.sin(rot);
          } else if (mode === 'blackhole') {
             // Event Horizon
             const angle = p.angle + (time * (2 - p.radius/200)); // Inner spins faster
             const r = p.radius;
             
             // Accretion disk
             x = Math.cos(angle) * r;
             z = Math.sin(angle) * r;
             
             // Audio distorts the disk vertically
             y = (Math.sin(angle * 5 + time) * 10) + (norm * 50 * (r < 100 ? 2 : 0.5));
             
             // Pull into center
             if (r < 50) y += (Math.random()-0.5) * 50;

          } else if (mode === 'dna') {
             // Double Helix
             const strand = i % 2 === 0 ? 1 : -1;
             const yPos = ((i % 100) * 4) - 200; // Vertical stack
             const twist = (yPos * 0.05) + time;
             
             const r = 60 + (norm * 50);
             
             x = Math.cos(twist) * r * strand;
             z = Math.sin(twist) * r * strand;
             y = yPos;
             
             // Rotate entire structure
             const rot = time * 0.2;
             const x0 = x;
             x = x0 * Math.cos(rot) - z * Math.sin(rot);
             z = z * Math.cos(rot) + x0 * Math.sin(rot);
          } else if (mode === 'flow') {
             // Time-Frequency River
             // Map particles to a grid: X = Frequency, Z = Time (History)
             const cols = 32; // Frequency bands
             const rows = maxHistory; // Time steps
             
             // Only use enough particles for the grid
             if (i < cols * rows) {
                 const col = i % cols; // Frequency index
                 const row = Math.floor(i / cols); // Time index (0 is newest)
                 
                 // Get data from history
                 let amp = 0;
                 if (historyRef.current[row]) {
                     // Map column to frequency bin (logarithmic or linear)
                     // Simple linear mapping for now
                     const bin = Math.floor((col / cols) * (frequencyData.length / 2));
                     amp = historyRef.current[row][bin] || 0;
                 }
                 
                 const spacingX = 15;
                 const spacingZ = 20;
                 
                 x = (col - cols/2) * spacingX;
                 z = (row - rows/2) * spacingZ;
                 y = (amp * sensitivity * 0.8) - 50; // Height based on amplitude
                 
                 // Curve the river slightly
                 x += Math.sin(z * 0.01 + time) * 50;
             } else {
                 // Hide unused particles
                 x = 0; y = 0; z = -10000;
             }
          } else if (mode === 'cymatic') {
             // Spherical Harmonics / Cymatics
             // Deform a sphere based on frequency bands
             
             // Map i to sphere surface
             const count = 800; // Use subset
             if (i < count) {
                 const phi = Math.acos(-1 + (2 * i) / count);
                 const theta = Math.sqrt(count * Math.PI) * phi;
                 
                 const rBase = 120;
                 
                 // Deform based on 3 frequency bands
                 const bass = isListening ? (frequencyData[10] || 0) / 255 : 0;
                 const mid = isListening ? (frequencyData[50] || 0) / 255 : 0;
                 const treble = isListening ? (frequencyData[100] || 0) / 255 : 0;
                 
                 // Spherical harmonic-ish deformation
                 // m=3, n=2 type shapes
                 const deformation = 
                    (bass * 50 * Math.sin(phi * 6)) + 
                    (mid * 50 * Math.cos(theta * 4)) + 
                    (treble * 50 * Math.sin(phi * 10 + time * 5));
                 
                 const r = rBase + deformation * sensitivity;
                 
                 x = r * Math.cos(theta) * Math.sin(phi);
                 y = r * Math.sin(theta) * Math.sin(phi);
                 z = r * Math.cos(phi);
                 
                 // Rotate slowly
                 const rot = time * 0.2;
                 const x0 = x;
                 x = x0 * Math.cos(rot) - z * Math.sin(rot);
                 z = z * Math.cos(rot) + x0 * Math.sin(rot);
             } else {
                 x = 0; y = 0; z = -10000;
             }
          }

          // 3D Rotation
          const rx = rotationRef.current.x;
          const ry = rotationRef.current.y;

          // Rotate around Y
          const x1 = x * Math.cos(ry) - z * Math.sin(ry);
          const z1 = z * Math.cos(ry) + x * Math.sin(ry);
          
          // Rotate around X
          const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
          const z2 = z1 * Math.cos(rx) + y * Math.sin(rx);

          // Perspective Projection
          const scale = fov / (fov + z2);
          const x2d = x1 * scale + cx;
          const y2d = y2 * scale + cy;

          // Draw if in front of camera
          if (scale > 0) {
            let hue = themeColors.base + (z2 * 0.1) + (norm * 100);
            let alpha = Math.min(1, (scale * 0.5) + (norm * 0.5));
            let size = Math.max(0.5, p.size * scale * (1 + norm * 2));
            
            if (mode === 'snapshot') {
                const intensity = p.orbit || 0;
                hue = themeColors.base + (intensity * 100);
                alpha = 0.6 + (intensity * 0.4);
                size = p.size * scale;
            } else if (mode === 'neural') {
                hue = 200 + (norm * 50); // Blue-ish
                alpha = 0.8;
            } else if (mode === 'blackhole') {
                hue = (p.radius < 80) ? 30 : 260 + (norm * 50); // Orange center, purple outer
                alpha = (p.radius < 80) ? 0.9 : 0.5;
            } else if (mode === 'dna') {
                hue = (i % 2 === 0) ? 180 : 300; // Cyan and Magenta strands
                hue += norm * 50;
            } else if (mode === 'flow') {
                // Color by height (amplitude)
                hue = themeColors.base + (y * 2); 
                alpha = 0.8;
                size = 2 * scale;
            } else if (mode === 'cymatic') {
                // Color by radius (deformation)
                const r = Math.sqrt(x*x + y*y + z*z);
                hue = themeColors.base + (r - 100);
                alpha = 0.9;
            }

            // Store for post-processing (lines)
            if (mode === 'neural' || mode === 'flow' || mode === 'cymatic') {
                projectedParticles.push({x: x2d, y: y2d, z: z2, size, color: `hsla(${hue}, 80%, 60%, ${alpha})`, alpha});
            }

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            ctx.fill();
          }
        });

        // Post-processing for Neural Mode (Connections)
        if (mode === 'neural') {
            ctx.lineWidth = 0.5;
            projectedParticles.forEach((p1, i) => {
                // Connect to nearby particles
                // Optimization: only check next few particles to avoid O(N^2)
                // Checking 10 neighbors is usually enough for the visual effect
                for (let j = i + 1; j < Math.min(i + 15, projectedParticles.length); j++) {
                    const p2 = projectedParticles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 60) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        const alpha = (1 - dist/60) * 0.4 * p1.alpha;
                        ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
                        ctx.stroke();
                    }
                }
            });
        }

        // Post-processing for Flow Mode (Grid Lines)
        if (mode === 'flow') {
             ctx.lineWidth = 1;
             // We know the grid structure: 32 cols, maxHistory rows
             const cols = 32;
             // Draw lines connecting rows (time)
             for(let i = 0; i < projectedParticles.length; i++) {
                 const p1 = projectedParticles[i];
                 // Connect to next row (same col) -> index + cols
                 if (i + cols < projectedParticles.length) {
                     const p2 = projectedParticles[i + cols];
                     // Only connect if close enough (avoid wrapping artifacts if any)
                     const dist = Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));
                     if (dist < 100) {
                         ctx.beginPath();
                         ctx.moveTo(p1.x, p1.y);
                         ctx.lineTo(p2.x, p2.y);
                         ctx.strokeStyle = p1.color.replace('0.8)', '0.3)');
                         ctx.stroke();
                     }
                 }
                 // Connect to next col (same row) -> index + 1
                 if ((i + 1) % cols !== 0 && i + 1 < projectedParticles.length) {
                     const p2 = projectedParticles[i + 1];
                     const dist = Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));
                     if (dist < 100) {
                         ctx.beginPath();
                         ctx.moveTo(p1.x, p1.y);
                         ctx.lineTo(p2.x, p2.y);
                         ctx.strokeStyle = p1.color.replace('0.8)', '0.3)');
                         ctx.stroke();
                     }
                 }
             }
        }
      } else {
        // --- 2D MODES (Legacy Support) ---
        particles.slice(0, 150).forEach((p, i) => {
             const val = isListening ? (frequencyData[i % frequencyData.length] || 0) * sensitivity : 0;
             const norm = val / 255;
             
             if (mode === 'spectrum') {
                 // Circular Spectrum
                 const angle = (i / 64) * Math.PI * 2;
                 const r = 80 + (norm * 100);
                 const x = cx + Math.cos(angle) * r;
                 const y = cy + Math.sin(angle) * r;
                 
                 ctx.beginPath();
                 ctx.moveTo(cx + Math.cos(angle)*80, cy + Math.sin(angle)*80);
                 ctx.lineTo(x, y);
                 ctx.strokeStyle = `hsla(${themeColors.base + norm*100}, 80%, 60%, 0.8)`;
                 ctx.lineWidth = 3;
                 ctx.stroke();
             } else {
                 // Quantum Cloud
                 const r = p.radius + (norm * 50);
                 const x = cx + Math.cos(p.angle + time) * r;
                 const y = cy + Math.sin(p.angle + time) * r;
                 
                 ctx.beginPath();
                 ctx.arc(x, y, p.size * (1+norm), 0, Math.PI * 2);
                 ctx.fillStyle = `hsla(${themeColors.base + norm*50}, 70%, 50%, 0.6)`;
                 ctx.fill();
             }
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

  // Mouse Handlers for 3D Rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseRef.current.down = true;
    setIsDragging(true);
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handleMouseUp = () => {
    mouseRef.current.down = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;

    if (mouseRef.current.down) {
        const deltaX = e.clientX - mouseRef.current.lastX;
        const deltaY = e.clientY - mouseRef.current.lastY;
        
        rotationRef.current.y += deltaX * 0.005;
        rotationRef.current.x += deltaY * 0.005;
        
        // Update velocity for inertia
        velocityRef.current = { x: deltaY * 0.005, y: deltaX * 0.005 };

        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.down = false;
    setIsDragging(false);
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_1px_2px_rgba(23,23,23,0.05)] transition-all duration-300 hover:shadow-[0_16px_40px_rgba(23,23,23,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 p-5">
        <div>
          <h3 className="text-lg font-semibold text-neutral-950">Quantum Acoustic Field</h3>
          <p className="text-sm text-neutral-500">Interactive sound visualization</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowControls(!showControls)}
            className={`rounded-md p-2 transition-colors ${showControls ? 'bg-stone-100 text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'}`}
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={isListening ? stopListening : startListening}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              isListening 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-neutral-950 text-white shadow-[0_10px_24px_rgba(23,23,23,0.16)] hover:bg-neutral-800'
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
      <div className={`overflow-hidden border-b border-stone-200 bg-stone-50 transition-all duration-300 ${showControls ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Voice Snapshot Section */}
          <div className="col-span-full rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h4 className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                    <span className="h-2 w-2 rounded-full bg-brand-primary"></span>
                    Voice Crystal
                </h4>
                {mode === 'snapshot' && (
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-1 rounded-md bg-stone-100 px-3 py-1 text-xs text-neutral-600 transition-colors hover:bg-stone-200"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Snapshot
                    </button>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                <button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        isRecording 
                        ? 'bg-stone-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-brand-primary text-white hover:shadow-lg hover:scale-[1.02]'
                    }`}
                >
                    {isRecording ? 'Recording...' : 'Create Voice Crystal'}
                </button>
                
                {isRecording && (
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
                        <div 
                            className="h-full bg-brand-primary transition-all duration-100 ease-linear"
                            style={{ width: `${recordingProgress}%` }}
                        />
                    </div>
                )}
                
                {!isRecording && mode === 'snapshot' && (
                    <button
                        onClick={() => setMode('galaxy')}
                        className="rounded-md px-4 py-2 text-sm text-neutral-500 transition-colors hover:bg-stone-100 hover:text-neutral-700"
                    >
                        Reset
                    </button>
                )}
            </div>
            <p className="mt-2 text-xs text-neutral-400">
                Record 3 seconds of audio to generate a unique 3D crystal structure based on your voice frequency profile.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="col-span-full">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase text-neutral-500">Visualization Mode</label>
              <button 
                onClick={() => setAutoCycle(!autoCycle)}
                className={`rounded-full border px-2 py-0.5 text-xs ${autoCycle ? 'bg-green-100 text-green-700 border-green-200' : 'text-neutral-400 border-stone-200'}`}
              >
                Auto Cycle: {autoCycle ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['galaxy', 'warp', 'neural', 'blackhole', 'dna', 'flow', 'cymatic', 'grid', 'quantum', 'spectrum', 'snapshot'] as VisualMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                    mode === m ? 'bg-white shadow-sm text-brand-primary font-medium' : 'text-neutral-500 hover:bg-white/50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-neutral-500">Color Theme</label>
            <div className="flex gap-2">
              {(['cyan', 'purple', 'gold', 'rainbow', 'matrix'] as ColorTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    theme === t ? 'border-neutral-400 scale-110' : 'border-transparent'
                  }`}
                  style={{ 
                    background: t === 'rainbow' 
                      ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' 
                      : t === 'matrix' ? '#22c55e'
                      : t === 'cyan' ? '#06b6d4' : t === 'purple' ? '#8b5cf6' : '#eab308' 
                  }}
                  title={t}
                />
              ))}
            </div>
          </div>

          {/* Frequency Focus */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-neutral-500">Freq Focus</label>
            <div className="flex w-fit gap-1 rounded-lg bg-stone-200 p-1">
              {(['full', 'bass', 'mid', 'treble'] as FreqRange[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFreqRange(f)}
                  className={`px-3 py-1 rounded-md text-xs capitalize transition-all ${
                    freqRange === f ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'
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
              <label className="mb-1 block text-xs font-semibold uppercase text-neutral-500">
                Sensitivity: {sensitivity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-brand-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-neutral-500">
                Speed: {speed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-brand-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-96 bg-black">
        <canvas 
          ref={canvasRef} 
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        />
        {!isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              Waiting for acoustic input...
            </p>
          </div>
        )}
        <div className="absolute bottom-4 right-4 text-xs text-white/30 pointer-events-none">
          Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
