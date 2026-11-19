import { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════
   CODECRAFT ACADEMY — Fondo Animado de Código Ambiental
   Diseñado para ser sutil, no saturado, sin distraer la lectura
   ═══════════════════════════════════════════════════════════ */

const CODE_TOKENS = [
  '</>', '{ }', 'const', 'let', 'fn()', 'return', '=>',
  '01', '10', 'def', 'import', '// code', '[ ]', 'loop()',
  'pinMode', 'async', 'await', '&&', '===', 'true',
  'class', 'int', 'void', 'print()', 'for', 'if()', '->',
];

const COLORS = [
  { r: 0, g: 210, b: 255 },    // Cian tecnológico suave
  { r: 168, g: 85, b: 247 },   // Violeta cósmico
  { r: 125, g: 155, b: 195 },  // Azul pizarra neutro
  { r: 52, g: 211, b: 153 },   // Esmeralda terminal tenue
];

export default function CodeAmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Cantidad equilibrada de partículas bien visibles
    const count = Math.min(60, Math.floor((width * height) / 24000));

    // Generar partículas de código y nodos de red
    const particles = Array.from({ length: count }, () => {
      const isToken = Math.random() > 0.35; // 65% tokens de código, 35% nodos circuito
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speedY: Math.random() * 0.35 + 0.18, // Deriva vertical fluida
        speedX: (Math.random() - 0.5) * 0.22,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.009 + 0.004,
        isToken,
        text: CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)],
        fontSize: Math.floor(Math.random() * 4) + 13, // 13px a 16px
        size: Math.random() * 2 + 1.5, // Nodos más definidos
        color,
        baseAlpha: Math.random() * 0.05 + 0.55, // Exactamente entre 55% y 60% de opacidad
      };
    });

    let time = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Trazas de circuitos entre partículas cercanas
      ctx.lineWidth = 1.2;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          // Distancia de conexión: 140px
          if (distSq < 19600) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 140) * 0.32; // Trazas conectadas nítidas
            ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Renderizar cada partícula o token de código
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Movimiento flotante
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(time * p.swaySpeed + p.swayPhase) * 0.28;

        // Reubicar cuando sale por la parte superior
        if (p.y < -35) {
          p.y = height + 25;
          p.x = Math.random() * width;
        }
        if (p.x < -35) p.x = width + 25;
        if (p.x > width + 35) p.x = -25;

        const { r, g, b } = p.color;

        if (p.isToken) {
          // Token de código con resplandor neón visible
          ctx.font = `600 ${p.fontSize}px "JetBrains Mono", monospace`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.baseAlpha})`;
          ctx.fillText(p.text, p.x, p.y);
        } else {
          // Nodo de circuito
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
          ctx.shadowBlur = 8;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.65, p.baseAlpha * 1.15)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Resetear sombras para evitar sobrecoste
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="code-ambient-container" aria-hidden="true">
      {/* Luces aurorales tenues y profundas */}
      <div className="ambient-aurora aurora-cyan" />
      <div className="ambient-aurora aurora-purple" />
      <div className="ambient-aurora aurora-indigo" />

      {/* Cuadrícula sutil tipo Blueprint de programación */}
      <div className="ambient-code-grid" />

      {/* Canvas interactivo de tokens y nodos */}
      <canvas ref={canvasRef} className="code-ambient-canvas" />
    </div>
  );
}
