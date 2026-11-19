import { useState, useEffect, useCallback, useRef } from 'react';
import { ASSETS } from './assetsMap';
import CodeAmbientBackground from './CodeAmbientBackground';

/* ═══════════════════════════════════════════════════════════
   CODECRAFT ACADEMY — Presentación Interactiva en React
   PresentationApp.jsx — Desglose Procedimental Secuencial
   (Avanza primero subfases y luego cambia de diapositiva)
   ═══════════════════════════════════════════════════════════ */

const TOTAL_SLIDES = 7;

// Subfases configuradas por cada diapositiva
const SLIDE_SUBSTEPS = [
  1, // Slide 1 (index 0): 1 paso (Portada)
  3, // Slide 2 (index 1): 3 pasos (La Brecha, El Enfoque, La Visión)
  3, // Slide 3 (index 2): 3 fases (Scratch, Arduino, Python)
  3, // Slide 4 (index 3): 3 pilares (Metodología, Desglose, Propósito)
  2, // Slide 5 (index 4): 2 módulos (Radar Preventivo, Horarios)
  2, // Slide 6 (index 5): 2 etapas (Misión, Manifiesto Final)
  1, // Slide 7 (index 6): 1 paso (Demostración en Vivo)
];

const TOTAL_ATOMIC_STEPS = SLIDE_SUBSTEPS.reduce((a, b) => a + b, 0); // 15 pasos en total

// ── Chatbot Responses ──
const CHATBOT_RESPONSES = {
  circuit: {
    question: '💡 "¿Por qué mi circuito no enciende?"',
    answer:
      'Observa el estado de tu pin 13 en el loop(). ¿Has comprobado si configuraste pinMode() como OUTPUT en el setup()? Revisa también la polaridad del LED: ¿el ánodo (pata larga) va al pin digital y el cátodo a tierra GND? ¡Examínalo y cuéntame qué observas! 🔍',
  },
  semaforo: {
    question: '🚦 "Dame el código para resolver el semáforo"',
    answer:
      'Si te doy el código hecho, el robot aprenderá, pero tú te perderás la magia de crearlo. 😉 Piensa en la secuencia de la calle: cuando la luz roja está activa, ¿qué deben hacer el amarillo y el verde? Escribe esa primera línea y te acompaño en las siguientes. 🚦',
  },
  loop: {
    question: '⚡ "¿Cómo repito esta acción para siempre?"',
    answer:
      'En lugar de duplicar instrucciones decenas de veces, ¿qué estructura de control en void loop() o bucle de iteración te permite automatizar la repetición sin fin? Piensa en el patrón que se repite. ¿Cuál es el bloque base? 🔄',
  },
  reallife: {
    question: '🌍 "¿Para qué me sirve aprender esto en la vida real?"',
    answer:
      'Cada semáforo de tu ciudad, cada marcapasos médico y cada rover en Marte funcionan exactamente con esta lógica de sensores, decisiones y actuadores. No estás solo encendiendo un LED: estás aprendiendo a darle órdenes al mundo físico. 🚀',
  },
};

// ── Particles Canvas Component ──
function ParticlesCanvas({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00BCD4', '#805AD5', '#FF9800', '#00E676', '#00D2FF', '#FFA96C'];

    for (let i = 0; i < 150; i++) {
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 3,
        size: Math.random() * 4 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.005,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      particlesRef.current = [];
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

// ── Typing Animation Hook ──
function useTypingAnimation(text, isActive, speed = 20) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayed('');
      setIsDone(false);
      return;
    }

    let i = 0;
    setDisplayed('');
    setIsDone(false);

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, isActive, speed]);

  return { displayed, isDone };
}

// ══════════════════════════════════════════════════════════
//  SLIDE 1: Portada Viva (El Despertar del Creador)
// ══════════════════════════════════════════════════════════
function Slide1() {
  const [role, setRole] = useState('student');

  const messages = {
    student: 'Empodérate para construir lo que imaginas.',
    teacher: 'Potencia a tus estudiantes con tecnología humana.',
  };

  return (
    <div className="slide slide-centered slide-1-container">
      {/* Asset ambiental ubicado en la esquina superior sin solapar el logo */}
      <div className="slide-1-sparkles-ambient float-anim">
        <img
          src={ASSETS.codeSparkles}
          alt="Chispa de Innovación"
          className="slide-1-sparkles-img"
        />
        <div className="sparkles-ambient-glow glow-cyan-bg" />
      </div>

      <div className="slide-1-layout">
        <div className="hero-logo-box">
          <img src={ASSETS.logo} alt="Codecraft Academy" className="logo-hero" />
        </div>

        <p className="slide-subtitle text-center">
          Donde la curiosidad de un niño se transforma en{' '}
          <span className="accent-cyan">pensamiento computacional creador</span>.
        </p>

        <div className="pill-group justify-center">
          <button
            className={`pill-btn ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
          >
            🎓 Visión Estudiante
          </button>
          <button
            className={`pill-btn ${role === 'teacher' ? 'active-purple' : ''}`}
            onClick={() => setRole('teacher')}
          >
            🧑‍🏫 Visión Docente
          </button>
        </div>

        <p
          className="role-message fade-in-up"
          key={role}
          style={{
            color: role === 'student' ? 'var(--cc-cyan-bright)' : 'var(--cc-purple)',
          }}
        >
          {messages[role]}
        </p>

        <div className="credit-line">
          Desarrollado por <span className="accent-amber">Eddie Ibáñez</span> &{' '}
          <span className="accent-amber">Esteban De Moya</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SLIDE 2: La Idea Inicial (Flujo Procedimental en 3 Pasos)
// ══════════════════════════════════════════════════════════
function Slide2({ subStep, setSubStep, goNext, goPrev }) {
  const step = subStep;

  const stepsData = {
    1: {
      badge: 'PASO 1 / EL DIAGNÓSTICO',
      title: 'El Muro de la Educación Tradicional',
      subtitle: 'La frustración temprana que apaga la vocación científica.',
      desc: 'Pizarras estáticas y memorización mecánica de sintaxis. El error es penalizado con malas notas en vez de aprovecharse como experiencia de aprendizaje. Instalaciones fallidas que desmotivan al alumno en los primeros 10 minutos.',
      highlight: 'El estudiante queda reducido a simple consumidor pasivo de pantallas.',
      asset: ASSETS.brain,
      assetCaption: 'La mente atrapada en conceptos abstractos sin aplicación práctica',
      glow: 'glow-purple-bg',
    },
    2: {
      badge: 'PASO 2 / EL CAMBIO DE PARADIGMA',
      title: 'El Error como Catalizador Creativo',
      subtitle: 'Aprender a programar es aprender a pensar con libertad.',
      desc: 'En Codecraft Academy rediseñamos la experiencia: no se memoriza, se experimenta. Si un motor no gira o un bucle se bloquea, no hay castigo: hay un enigma divertido por resolver guiado por el método científico.',
      highlight: 'El error no es fracaso; es el combustible del razonamiento crítico.',
      asset: ASSETS.teamStudents,
      assetCaption: 'Co-creación y aprendizaje basado en desafíos reales',
      glow: 'glow-amber-bg',
    },
    3: {
      badge: 'PASO 3 / LA VISIÓN CODECRAFT',
      title: 'El Arquitecto de su Propio Futuro',
      subtitle: 'Tecnología humana que enciende la confianza creativa.',
      desc: 'Aulas interactivas donde cada línea de código tiene un efecto visible inmediato: un LED que parpadea, un personaje que cobra vida o un algoritmo que procesa datos reales. Una pedagogía que empodera al joven para ser creador.',
      highlight: 'Formamos mentes creadoras, seguras y autónomas preparadas para liderar.',
      asset: ASSETS.girlCoding,
      assetCaption: 'Pensamiento computacional aplicado y transformador',
      glow: 'glow-cyan-bg',
    },
  };

  const current = stepsData[step] || stepsData[1];

  return (
    <div className="slide slide-bento">
      <div className="narrative-zone">
        {/* Stepper Procedimental */}
        <div className="procedural-stepper">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`stepper-step-btn ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
              onClick={() => setSubStep(num)}
            >
              <span className="step-label">
                {num === 1 && 'La Brecha'}
                {num === 2 && 'El Enfoque'}
                {num === 3 && 'La Visión'}
              </span>
            </button>
          ))}
        </div>

        <div className="substep-stage-wrapper" key={step}>
          <div className="slide-badge">{current.badge}</div>
          <h2 className="slide-title">{current.title}</h2>
          <p className="slide-subtitle">{current.subtitle}</p>

          <div className="procedural-card glass-card">
            <p className="slide-body">{current.desc}</p>
            <div className="procedural-highlight-box">
              <strong>Clave:</strong> {current.highlight}
            </div>
          </div>
        </div>
      </div>

      <div className="visual-zone">
        <div className="asset-card-wrapper substep-visual-wrapper" key={step}>
          <div className={`asset-glow ${current.glow}`} />
          <img
            src={current.asset}
            alt={current.title}
            className="asset-img"
          />
          <div className="asset-caption">{current.assetCaption}</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SLIDE 3: 3 Paradigmas (Flujo Procedimental Separado)
// ══════════════════════════════════════════════════════════
function Slide3({ subStep, setSubStep, goNext, goPrev }) {
  const paradigm = subStep;
  const [ledOn, setLedOn] = useState(false);
  const [scratchStep, setScratchStep] = useState(0); // 0=idle, 1=flag, 2=walking, 3=speaking
  const [scratchPlayKey, setScratchPlayKey] = useState(0);
  const scratchTimeoutRef = useRef([]);
  const [pythonRunning, setPythonRunning] = useState(false);
  const [pythonKey, setPythonKey] = useState(0);

  const runScratchDemo = () => {
    scratchTimeoutRef.current.forEach(clearTimeout);
    scratchTimeoutRef.current = [];

    // Force remount to reset cat position instantly to 0
    setScratchPlayKey((k) => k + 1);
    setScratchStep(1); // 1. Flag event triggered

    const t1 = setTimeout(() => {
      setScratchStep(2); // 2. Move 15 steps
    }, 300);

    const t2 = setTimeout(() => {
      setScratchStep(3); // 3. Speak "¡Construyendo el futuro!"
    }, 1200);

    scratchTimeoutRef.current.push(t1, t2);
  };

  const resetScratchDemo = () => {
    scratchTimeoutRef.current.forEach(clearTimeout);
    scratchTimeoutRef.current = [];
    setScratchStep(0);
    setScratchPlayKey((k) => k + 1);
  };

  const paradigms = {
    1: {
      badge: 'FASE 1 / PENSAMIENTO VISUAL',
      title: 'Scratch: La Imaginación en Bloques',
      subtitle: 'Creación intuitiva sin la barrera de la sintaxis tipográfica.',
      concept:
        'El estudiante comprende secuencias de ejecución, eventos asíncronos y bucles mediante bloques apilables y animaciones inmediatas.',
      asset: ASSETS.boyLaptop,
      caption: 'Creatividad visual y narrativa interactiva para edades tempranas',
    },
    2: {
      badge: 'FASE 2 / ROBÓTICA Y HARDWARE',
      title: 'Arduino C++: El Código Toca el Mundo',
      subtitle: 'De la pantalla al circuito físico tangible.',
      concept:
        'Control de actuadores, lectura de sensores analógicos y programación estructurada en C++. Los jóvenes descubren que la electrónica obedece a su lógica.',
      asset: ASSETS.laptopIde,
      caption: 'Interacción directa con hardware, puertos GPIO y robótica embebida',
    },
    3: {
      badge: 'FASE 3 / ALGORITMIA PROFESIONAL',
      title: 'Python 3: Estructuras y Ciencia de Datos',
      subtitle: 'Pensamiento computacional con el lenguaje de la industria.',
      concept:
        'Tipado dinámico, colecciones de datos, algoritmia limpia y fundamentos de inteligencia artificial para resolver problemas del mundo real.',
      asset: ASSETS.boyLaptop,
      caption: 'Algoritmos eficientes, programación estructurada y bases de la IA',
    },
  };

  const curr = paradigms[paradigm] || paradigms[1];

  return (
    <div className="slide slide-bento">
      <div className="narrative-zone">
        {/* Procedural Stepper */}
        <div className="procedural-stepper">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`stepper-step-btn ${paradigm === num ? 'active' : ''} ${paradigm > num ? 'completed' : ''}`}
              onClick={() => setSubStep(num)}
            >
              <span className="step-label">
                {num === 1 && 'Scratch'}
                {num === 2 && 'Arduino'}
                {num === 3 && 'Python'}
              </span>
            </button>
          ))}
        </div>

        <div className="substep-stage-wrapper" key={paradigm}>
          <div className="slide-badge">{curr.badge}</div>
          <h2 className="slide-title">{curr.title}</h2>
          <p className="slide-subtitle">{curr.subtitle}</p>
          <p className="slide-body">{curr.concept}</p>

          {/* Micro-Demo Interactiva de la Fase Activa */}
          <div className="demo-area">
            <div className="demo-dots">
              <div className="demo-dot dot-red" />
              <div className="demo-dot dot-yellow" />
              <div className="demo-dot dot-green" />
              <span className="demo-header-title">
                {paradigm === 1 && 'Simulador Visual Scratch'}
                {paradigm === 2 && 'Arduino Pin 13 Controller'}
                {paradigm === 3 && 'Terminal Python 3'}
              </span>
            </div>

            <div className="demo-body">
              {paradigm === 1 && (
                <div className="scratch-stage-wrapper">
                  <div className="scratch-stage-split" key={scratchPlayKey}>
                    {/* Bloques de código apilados VERTICALMENTE */}
                    <div className="scratch-blocks-vertical">
                      <div className={`scratch-block block-events ${scratchStep === 1 ? 'block-active' : ''}`}>
                        <span className="block-flag-icon">🏁</span> al presionar bandera
                      </div>
                      <div className={`scratch-block block-motion ${scratchStep === 2 ? 'block-active' : ''}`}>
                        mover <span className="block-num-bubble">15</span> pasos
                      </div>
                      <div className={`scratch-block block-looks ${scratchStep === 3 ? 'block-active' : ''}`}>
                        decir <span className="block-text-bubble">"¡Construyendo el futuro!"</span>
                      </div>
                    </div>

                    {/* Escenario con el Gato y el bocadillo de diálogo */}
                    <div className="scratch-stage-canvas">
                      <div className="scratch-stage-toolbar">
                        <div className="stage-controls-left">
                          <button
                            type="button"
                            className={`scratch-flag-btn ${scratchStep > 0 ? 'active' : ''}`}
                            onClick={runScratchDemo}
                            title="Ejecutar bloques (Bandera verde)"
                          >
                            🚩
                          </button>
                          <button
                            type="button"
                            className="scratch-stop-btn"
                            onClick={resetScratchDemo}
                            title="Detener y reiniciar al punto inicial"
                          >
                            🛑
                          </button>
                        </div>
                        <span className="stage-coord-label">
                          {scratchStep >= 2 ? 'x: 15  y: 0' : 'x: 0  y: 0'}
                        </span>
                      </div>

                      <div className="scratch-viewport">
                        <div className={`scratch-cat-actor ${scratchStep >= 2 ? 'moved' : ''}`}>
                          {/* Bocadillo de diálogo de Scratch cuando dice la frase */}
                          {scratchStep === 3 && (
                            <div className="scratch-speech-bubble">
                              <span>¡Construyendo el futuro!</span>
                              <div className="speech-tail" />
                            </div>
                          )}
                          <div className={`scratch-cat-body ${scratchStep === 2 ? 'cat-walking' : ''}`}>
                            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="scratch-cat-svg">
                              {/* Orejas */}
                              <polygon points="20,40 10,12 38,24" fill="#FFAB19" stroke="#E69500" strokeWidth="3" strokeLinejoin="round" />
                              <polygon points="18,34 14,18 32,24" fill="#FFFFFF" opacity="0.65" />
                              <polygon points="80,40 90,12 62,24" fill="#FFAB19" stroke="#E69500" strokeWidth="3" strokeLinejoin="round" />
                              <polygon points="82,34 86,18 68,24" fill="#FFFFFF" opacity="0.65" />
                              {/* Cabeza */}
                              <ellipse cx="50" cy="50" rx="36" ry="32" fill="#FFAB19" stroke="#E69500" strokeWidth="3" />
                              {/* Bigotes */}
                              <line x1="8" y1="46" x2="30" y2="48" stroke="#2D1A00" strokeWidth="2.5" strokeLinecap="round" />
                              <line x1="8" y1="56" x2="30" y2="54" stroke="#2D1A00" strokeWidth="2.5" strokeLinecap="round" />
                              <line x1="92" y1="46" x2="70" y2="48" stroke="#2D1A00" strokeWidth="2.5" strokeLinecap="round" />
                              <line x1="92" y1="56" x2="70" y2="54" stroke="#2D1A00" strokeWidth="2.5" strokeLinecap="round" />
                              {/* Hocico blanco */}
                              <ellipse cx="50" cy="58" rx="20" ry="14" fill="#FFFFFF" />
                              {/* Ojos */}
                              <ellipse cx="38" cy="42" rx="5" ry="7" fill="#2D1A00" />
                              <circle cx="36.5" cy="40" r="2" fill="#FFFFFF" />
                              <ellipse cx="62" cy="42" rx="5" ry="7" fill="#2D1A00" />
                              <circle cx="60.5" cy="40" r="2" fill="#FFFFFF" />
                              {/* Nariz y sonrisa */}
                              <polygon points="50,53 46,49 54,49" fill="#FF5252" />
                              <path d="M 44 57 Q 50 63 56 57" stroke="#2D1A00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>
                        <div className="scratch-stage-ground" />
                      </div>
                    </div>
                  </div>

                  <div className="scratch-actions-row">
                    <button
                      className="pill-btn scratch-run-btn"
                      onClick={runScratchDemo}
                    >
                      {scratchStep > 0 ? '🔄 Reiniciar y Reproducir de Nuevo' : '▶ Probar Bloques de Scratch'}
                    </button>
                    {scratchStep > 0 && (
                      <button
                        className="scratch-secondary-btn"
                        onClick={resetScratchDemo}
                      >
                        ⏹ Reiniciar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {paradigm === 2 && (
                <div className="led-circuit">
                  <div className="led-visual-col">
                    <div className="led-label">
                      Pin 13: <span>{ledOn ? 'HIGH (5V Activo)' : 'LOW (0V Inactivo)'}</span>
                    </div>
                    <div className={`led-bulb ${ledOn ? 'on' : ''}`} />
                    <button className="led-switch-btn" onClick={() => setLedOn(!ledOn)}>
                      {ledOn ? '🔴 Apagar Circuito' : '🟢 Encender Circuito'}
                    </button>
                  </div>
                  <div className="arduino-code-col">
                    <code>
                      <span className="code-kw">void</span> <span className="code-fn">setup</span>() {'{'}<br />
                      &nbsp;&nbsp;<span className="code-call">pinMode</span>(13, OUTPUT);<br />
                      {'}'}<br />
                      <span className="code-kw">void</span> <span className="code-fn">loop</span>() {'{'}<br />
                      &nbsp;&nbsp;<span className="code-call">digitalWrite</span>(13,{' '}
                      <span style={{ color: ledOn ? 'var(--cc-emerald)' : 'var(--cc-text-subtle)' }}>
                        {ledOn ? 'HIGH' : 'LOW'}
                      </span>
                      );<br />
                      {'}'}
                    </code>
                  </div>
                </div>
              )}

              {paradigm === 3 && (
                <div>
                  {!pythonRunning ? (
                    <div className="python-run-prompt">
                      <p className="python-script-desc">
                        # Algoritmo de computación numérica: Detectar primos del 1 al 20
                      </p>
                      <button
                        className="pill-btn"
                        onClick={() => {
                          setPythonRunning(true);
                          setPythonKey((k) => k + 1);
                        }}
                      >
                        ▶ Ejecutar Algoritmo en Python
                      </button>
                    </div>
                  ) : (
                    <div className="python-console" key={pythonKey}>
                      <div className="python-line">
                        <span className="python-prompt">{'>>> '}</span>
                        <span className="python-comment"># Evaluando primalidad con filtro funcional</span>
                      </div>
                      <div className="python-line">
                        <span className="python-prompt">{'>>> '}</span>
                        <span className="code-kw">for</span> n <span className="code-kw">in</span>{' '}
                        <span className="code-fn">range</span>(2, 21):
                      </div>
                      <div className="python-line">
                        <span className="python-prompt">... </span>
                        &nbsp;&nbsp;<span className="code-kw">if</span>{' '}
                        <span className="code-fn">all</span>(n % i <span className="code-kw">for</span> i in range(2, n)):
                      </div>
                      <div className="python-line python-output">
                        ✓ 2 es primo | ✓ 3 es primo | ✓ 5 es primo | ✓ 7 es primo
                      </div>
                      <div className="python-line python-output">
                        ✓ 11 es primo | ✓ 13 es primo | ✓ 17 es primo | ✓ 19 es primo
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="visual-zone">
        <div className="asset-card-wrapper substep-visual-wrapper" key={paradigm}>
          <div className="asset-glow glow-cyan-bg" />
          <img
            src={curr.asset}
            alt={curr.title}
            className="asset-img"
          />
          <div className="asset-caption">{curr.caption}</div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SLIDE 4: Tutor IA Socrático (Demostración Procedimental)
// ══════════════════════════════════════════════════════════
function Slide4({ subStep, setSubStep, goNext, goPrev }) {
  const guideStep = subStep;
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answerActive, setAnswerActive] = useState(false);
  const [usedChips, setUsedChips] = useState(new Set());
  const messagesEndRef = useRef(null);

  const { displayed, isDone } = useTypingAnimation(currentAnswer, answerActive, 18);

  const guidePillars = {
    1: {
      badge: 'PILAR 1 / METODOLOGÍA',
      title: 'El Tutor que Nunca Hace la Tarea por Ti',
      concept:
        'Si una IA resuelve el código del estudiante, la IA aprende y el estudiante se estanca. El Tutor Codecraft actúa como Sócrates: replica con preguntas estratégicas para que el alumno descubra la respuesta por sus propios medios.',
      actionPrompt: 'Prueba activar el caso de Hardware 💡',
    },
    2: {
      badge: 'PILAR 2 / RAZONAMIENTO ALGORÍTMICO',
      title: 'Deconstruir Problemas Complejos',
      concept:
        'Cuando un estudiante se bloquea pidiendo la solución del semáforo, el tutor lo guía paso a paso: primero los estados de luces, luego los tiempos de espera y finalmente el bucle general.',
      actionPrompt: 'Prueba la pregunta del semáforo 🚦',
    },
    3: {
      badge: 'PILAR 3 / AUTONOMÍA Y SIGNIFICADO',
      title: 'Conectar el Código con la Vida Real',
      concept:
        'El aprendizaje adquiere sentido cuando el estudiante descubre que la misma lógica que enciende un LED opera los satélites espaciales, marcapasos y sistemas de tráfico de su propia ciudad.',
      actionPrompt: 'Prueba la pregunta de la vida real 🌍',
    },
  };

  useEffect(() => {
    if (isDone && currentAnswer) {
      setChatHistory((prev) => [...prev, { type: 'bot', text: currentAnswer }]);
      setCurrentAnswer('');
      setAnswerActive(false);
    }
  }, [isDone, currentAnswer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, displayed]);

  const handleChip = (key) => {
    if (usedChips.has(key) || isTyping) return;

    const data = CHATBOT_RESPONSES[key];
    setUsedChips((prev) => new Set(prev).add(key));
    setChatHistory((prev) => [...prev, { type: 'user', text: data.question }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setCurrentAnswer(data.answer);
      setAnswerActive(true);
    }, 900);
  };

  const resetChat = () => {
    setChatHistory([]);
    setUsedChips(new Set());
    setCurrentAnswer('');
    setAnswerActive(false);
    setIsTyping(false);
  };

  const currGuide = guidePillars[guideStep] || guidePillars[1];

  return (
    <div className="slide slide-bento">
      <div className="narrative-zone">
        {/* Stepper Procedimental */}
        <div className="procedural-stepper">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className={`stepper-step-btn ${guideStep === num ? 'active' : ''} ${guideStep > num ? 'completed' : ''}`}
              onClick={() => setSubStep(num)}
            >
              <span className="step-label">
                {num === 1 && 'Metodología'}
                {num === 2 && 'Desglose'}
                {num === 3 && 'Propósito'}
              </span>
            </button>
          ))}
        </div>

        <div className="substep-stage-wrapper" key={guideStep}>
          <div className="slide-badge">{currGuide.badge}</div>
          <h2 className="slide-title">{currGuide.title}</h2>
          <p className="slide-body" style={{ marginTop: '0.5rem' }}>{currGuide.concept}</p>

          <div className="procedural-action-hint">
            <span className="accent-amber">Paso sugerido en la demo:</span> {currGuide.actionPrompt}
          </div>

          <div className="girl-chat-thumbnail-row">
            <img
              src={ASSETS.girlChat}
              alt="Estudiante interactuando con el Tutor"
              className="girl-chat-thumb"
            />
            <div className="thumb-text">
              <strong>Andamiaje Metacognitivo</strong>
              <span>La IA enseña a pensar, no sustituye el pensamiento.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="visual-zone">
        <div className="chatbot-mockup">
          <div className="chatbot-header">
            <img src={ASSETS.aiTutor} alt="Tutor IA" className="chatbot-avatar" />
            <div className="chatbot-info">
              <div className="chatbot-name">Tutor IA Codecraft</div>
              <div className="chatbot-status">● En línea — Modo Socrático Activo</div>
            </div>
            {chatHistory.length > 0 && (
              <button onClick={resetChat} className="reset-chat-btn">
                ↻ Reiniciar
              </button>
            )}
          </div>

          <div className="chatbot-messages">
            <div className="chat-message bot">
              <img src={ASSETS.aiTutor} alt="" className="chat-mini-avatar" />
              <div className="chat-bubble">
                ¡Hola! 👋 Soy tu Tutor Socrático. No resolveré tu código por ti, pero te ayudaré a
                entenderlo a fondo. Pulsa una pregunta abajo para probar la interacción:
              </div>
            </div>

            {chatHistory.map((msg, i) => (
              <div className={`chat-message ${msg.type}`} key={i}>
                {msg.type === 'bot' && (
                  <img src={ASSETS.aiTutor} alt="" className="chat-mini-avatar" />
                )}
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message bot">
                <img src={ASSETS.aiTutor} alt="" className="chat-mini-avatar" />
                <div className="chat-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {answerActive && displayed && (
              <div className="chat-message bot">
                <img src={ASSETS.aiTutor} alt="" className="chat-mini-avatar" />
                <div className="chat-bubble">{displayed}</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-chips">
            <div className="chips-label">Preguntas de demostración en vivo:</div>
            {Object.entries(CHATBOT_RESPONSES).map(([key, data]) => (
              <button
                key={key}
                className={`chip-btn ${usedChips.has(key) ? 'chip-used' : ''}`}
                onClick={() => handleChip(key)}
                disabled={usedChips.has(key) || isTyping || answerActive}
              >
                {data.question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SLIDE 5: El Mentor Empoderado (Gestión y Analítica Procedimental)
// ══════════════════════════════════════════════════════════
function Slide5({ subStep, setSubStep, goNext, goPrev }) {
  const panelStep = subStep;

  const students = [
    { name: 'María Gómez', progress: 92, status: 'good', label: 'Avanzada — Dominio de bucles' },
    { name: 'Carlos Rojas', progress: 48, status: 'warning', label: 'Requiere apoyo en pines GPIO' },
    { name: 'Lucía Parra', progress: 82, status: 'good', label: 'En progreso óptimo' },
    { name: 'Andrés Morales', progress: 28, status: 'danger', label: '⚠ Refuerzo urgente en condicionales' },
    { name: 'Valentina Soto', progress: 88, status: 'good', label: 'Destacada en proyectos Arduino' },
    { name: 'Diego Lozano', progress: 42, status: 'warning', label: 'Dudas en sintaxis C++' },
  ];

  const schedule = [
    { day: 'Lun', slots: ['Scratch 3A (08:00)', 'Arduino 5B (10:00)', 'Python 4A (14:00)'] },
    { day: 'Mar', slots: ['Python 3B (08:00)', '— Libre —', 'Scratch 4A (14:00)'] },
    { day: 'Mié', slots: ['Arduino 3A (08:00)', 'Scratch 5B (10:00)', '⚠ Cruce detectado'] },
    { day: 'Jue', slots: ['— Libre —', 'Python 5A (10:00)', 'Arduino 4B (14:00)'] },
    { day: 'Vie', slots: ['Scratch 3B (08:00)', '⚠ Cruce detectado', 'Python 5B (14:00)'] },
  ];

  const proceduralViews = {
    1: {
      badge: 'MODALIDAD 1 / DIAGNÓSTICO',
      title: 'Detección Preventiva de Brechas',
      subtitle: 'Anticipar dificultades antes de que se conviertan en deserción.',
      desc: 'El radar inteligente monitoriza en tiempo real los patrones de error de cada estudiante. El docente sabe con exactitud quién requiere un refuerzo puntual y quién está listo para proyectos de mayor dificultad.',
    },
    2: {
      badge: 'MODALIDAD 2 / OPTIMIZACIÓN',
      title: 'Gestión Inteligente de Horarios',
      subtitle: 'Cero fricción administrativa: horarios sin cruces automáticos.',
      desc: 'El sistema resuelve los traslapes de salas y laboratorios en tiempo real, liberando al docente de planillas y calendarios para que dedique el 100% de su energía a inspirar y guiar el talento de sus alumnos.',
    },
  };

  const currView = proceduralViews[panelStep] || proceduralViews[1];

  return (
    <div className="slide slide-bento">
      <div className="narrative-zone">
        <div className="procedural-stepper">
          {[1, 2].map((num) => (
            <button
              key={num}
              className={`stepper-step-btn ${panelStep === num ? 'active' : ''} ${panelStep > num ? 'completed' : ''}`}
              onClick={() => setSubStep(num)}
            >
              <span className="step-label">
                {num === 1 && 'Radar Preventivo'}
                {num === 2 && 'Gestión de Horarios'}
              </span>
            </button>
          ))}
        </div>

        <div className="substep-stage-wrapper" key={panelStep}>
          <div className="slide-badge">{currView.badge}</div>
          <h2 className="slide-title">{currView.title}</h2>
          <p className="slide-subtitle">{currView.subtitle}</p>
          <p className="slide-body">{currView.desc}</p>

          <div className="two-assets-row">
            <div className="mini-asset-card">
              <img src={ASSETS.teamStudents} alt="Estudiantes en equipo" className="mini-asset-img" />
              <span>Colaboración en el aula</span>
            </div>
            <div className="mini-asset-card">
              <img src={ASSETS.diploma} alt="Certificación y logro" className="mini-asset-img" />
              <span>Reconocimiento de logros</span>
            </div>
          </div>
        </div>
      </div>

      <div className="visual-zone">
        <div className="analytics-panel glass-card substep-visual-wrapper" key={panelStep}>
          {panelStep === 1 && (
            <div className="tab-content" key="det">
              <div className="panel-hint">
                Semáforo de acompañamiento pedagógico en tiempo real:
              </div>
              <div className="radar-container">
                {students.map((s, i) => (
                  <div className="radar-card" key={i}>
                    <div className="radar-header">
                      <span className="radar-name">{s.name}</span>
                      <span className="radar-percent">{s.progress}%</span>
                    </div>
                    <div className="radar-bar">
                      <div
                        className="radar-fill"
                        style={{
                          width: `${s.progress}%`,
                          background:
                            s.status === 'good'
                              ? 'var(--cc-emerald)'
                              : s.status === 'warning'
                              ? 'var(--cc-amber)'
                              : '#FF5252',
                        }}
                      />
                    </div>
                    <div className={`radar-status status-${s.status}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panelStep === 2 && (
            <div className="tab-content" key="sched">
              <div className="panel-hint">
                Resolución inteligente y detección preventiva de cruces:
              </div>
              <div className="schedule-grid">
                {schedule.map((day, di) => (
                  <div key={di} className="schedule-col">
                    <div className="schedule-day">{day.day}</div>
                    {day.slots.map((slot, si) => (
                      <div
                        className={`schedule-slot ${
                          slot.includes('⚠')
                            ? 'slot-conflict'
                            : slot.includes('Libre')
                            ? 'slot-free'
                            : 'slot-busy'
                        }`}
                        key={si}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SLIDE 6: El Manifiesto de Cierre (Procedural: Misión -> Manifiesto)
// ══════════════════════════════════════════════════════════
function Slide6({ subStep, setSubStep, goNext, goPrev }) {
  const closureStep = subStep;
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (closureStep === 2) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 3800);
      return () => clearTimeout(timer);
    }
  }, [closureStep]);

  const handleIgnite = () => {
    setSubStep(2);
  };

  return (
    <div className="slide slide-centered">
      <ParticlesCanvas active={showParticles} />

      <div className="manifesto-container">
        <div className="manifesto-assets-row">
          <img
            src={ASSETS.gradCap}
            alt="Birrete de graduación"
            className="manifesto-asset-img float-anim"
          />
          <img
            src={ASSETS.codeSparkles}
            alt="Chispa creadora"
            className="manifesto-asset-img float-anim"
            style={{ animationDelay: '1.2s' }}
          />
        </div>

        {/* Stepper Procedimental */}
        <div className="procedural-stepper" style={{ justifyContent: 'center' }}>
          <button
            className={`stepper-step-btn ${closureStep === 1 ? 'active' : ''}`}
            onClick={() => setSubStep(1)}
          >
            <span className="step-label">La Misión Educativa</span>
          </button>
          <button
            className={`stepper-step-btn ${closureStep === 2 ? 'active' : ''}`}
            onClick={handleIgnite}
          >
            <span className="step-label">El Manifiesto Final</span>
          </button>
        </div>

        <div className="substep-stage-wrapper" key={closureStep}>
          {closureStep === 1 && (
            <div className="manifesto-stage-1">
              <div className="slide-badge" style={{ margin: '0 auto 1rem' }}>
                06 / EL HORIZONTE EDUCATIVO
              </div>
              <h2 className="slide-title text-center">Las Vocaciones del Mañana Nacen Hoy</h2>
              <p className="slide-subtitle text-center" style={{ maxWidth: '640px', margin: '0 auto 1.5rem' }}>
                Formando mentes <span className="accent-cyan">críticas</span>,{' '}
                <span className="accent-purple">creativas</span> y{' '}
                <span className="accent-amber">autónomas</span> preparadas para diseñar el futuro tecnológico.
              </p>

              <button className="ignite-btn" onClick={handleIgnite}>
                ✨ Encender la Chispa — Revelar Manifiesto
              </button>
            </div>
          )}

          {closureStep === 2 && (
            <div className="manifesto-card glass-card">
              <p className="manifesto-quote">
                "La educación no predice el porvenir; forma a las mentes que lo van a construir.
                Cada línea de código que un joven escribe es una semilla de libertad cognitiva.
                Cada error superado es una lección de carácter. Y cada pregunta que el Tutor IA devuelve
                es una puerta abierta hacia la autonomía del pensamiento humano."
              </p>
              <div className="manifesto-divider" />
              <p className="manifesto-authors">
                🌟 Eddie Ibáñez & Esteban De Moya
              </p>
              <p className="manifesto-sub">
                Codecraft Academy — Donde la curiosidad se transforma en creación tecnológica viva.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  SLIDE 7: Demostración en Vivo (La Teoría Hecha Realidad)
// ══════════════════════════════════════════════════════════
function Slide7() {
  return (
    <div className="slide slide-centered slide-7-container">
      <div className="slide-7-card glass-card">
        <div className="slide-badge">07 / EXPERIENCIA EN VIVO</div>

        <h2 className="slide-title text-center">
          Que la teoría no se quede en la presentación...
        </h2>

        <p className="slide-subtitle text-center">
          ¡Mejor miremos la <span className="accent-cyan">demostración en vivo</span>!
        </p>

        <p className="slide-body text-center" style={{ maxWidth: '720px', margin: '0 auto 1.6rem' }}>
          Codecraft Academy no es solo una visión pedagógica, es una plataforma operativa lista para transformar aulas reales. Interactúa directamente con el tutor de IA, la suite de programación y el panel de seguimiento.
        </p>

        {/* HUD Navegador de Demostración */}
        <div className="demo-browser-hud">
          <div className="hud-topbar">
            <div className="hud-mac-dots">
              <span className="mac-dot dot-red" />
              <span className="mac-dot dot-yellow" />
              <span className="mac-dot dot-green" />
            </div>
            <div className="hud-address-pill">
              <span className="address-lock">🔒</span>
              <span className="address-url">https://codecraftbeta.vercel.app/</span>
            </div>
            <span className="hud-live-tag">● EN LÍNEA</span>
          </div>

          <div className="hud-content-zone">
            <div className="hud-pills-features">
              <div className="hud-pill-tag">
                <span className="tag-icon">💻</span>
                <span>Laboratorios Scratch, Arduino & Python</span>
              </div>
              <div className="hud-pill-tag">
                <span className="tag-icon">🤖</span>
                <span>Tutor Socrático Inteligente</span>
              </div>
              <div className="hud-pill-tag">
                <span className="tag-icon">📊</span>
                <span>Métricas Docentes en Tiempo Real</span>
              </div>
            </div>

            <a
              href="https://codecraftbeta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="demo-portal-launch-btn"
            >
              <span className="btn-ambient-glow" />
              <span className="demo-btn-icon">🚀</span>
              <span className="demo-btn-text">INGRESAR A LA DEMOSTRACIÓN EN VIVO</span>
              <span className="demo-btn-arrow">↗</span>
            </a>
          </div>
        </div>

        <div className="credit-line" style={{ marginTop: '1.4rem' }}>
          Desarrollado por <span className="accent-amber">Eddie Ibáñez</span> &{' '}
          <span className="accent-amber">Esteban De Moya</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  MAIN PRESENTATION APP
// ══════════════════════════════════════════════════════════
export default function PresentationApp() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const maxSubSteps = SLIDE_SUBSTEPS[currentSlide] || 1;

  // Navegación: primero avanza por subfases, y al terminar cambia de diapositiva
  const goNext = useCallback(() => {
    const maxSteps = SLIDE_SUBSTEPS[currentSlide] || 1;
    if (currentSubStep < maxSteps) {
      setCurrentSubStep((prev) => prev + 1);
    } else if (currentSlide < TOTAL_SLIDES - 1) {
      setCurrentSlide((prev) => prev + 1);
      setCurrentSubStep(1);
    }
  }, [currentSlide, currentSubStep]);

  // Retroceso: retrocede subfases, y al inicio retrocede a la diapositiva previa en su última subfase
  const goPrev = useCallback(() => {
    if (currentSubStep > 1) {
      setCurrentSubStep((prev) => prev - 1);
    } else if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      const prevMax = SLIDE_SUBSTEPS[prevSlide] || 1;
      setCurrentSlide(prevSlide);
      setCurrentSubStep(prevMax);
    }
  }, [currentSlide, currentSubStep]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
        case ' ':
        case 'Enter':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'Backspace':
          e.preventDefault();
          goPrev();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, toggleFullscreen]);

  // Fullscreen event listener
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const slides = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7];
  const CurrentSlideComponent = slides[currentSlide];

  // Cálculo de progreso continuo acumulativo
  const completedStepsBeforeCurrent = SLIDE_SUBSTEPS
    .slice(0, currentSlide)
    .reduce((a, b) => a + b, 0);
  const currentGlobalStep = completedStepsBeforeCurrent + currentSubStep;
  const progressWidth = (currentGlobalStep / TOTAL_ATOMIC_STEPS) * 100;

  return (
    <div className="presentation">
      {/* Fondo Animado de Programación (Sutil, elegante, no distrae) */}
      <CodeAmbientBackground />

      {/* Top Progress Bar Continua */}
      <div className="progress-bar" style={{ width: `${progressWidth}%` }} />

      {/* Discretely Fixed Logo for Slides 2 to 7 (Bottom Left) — Interactivo con enlace a la demo en la Slide 7 */}
      {currentSlide > 0 && (
        <a
          href="https://codecraftbeta.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={`logo-corner-wrapper ${currentSlide === 6 ? 'logo-corner-cta-active' : ''}`}
          title={currentSlide === 6 ? "🚀 Abrir Demostración en Vivo: https://codecraftbeta.vercel.app/" : "Codecraft Academy"}
        >
          <img src={ASSETS.isotipo} alt="Isotipo Codecraft </>" className="logo-corner-icon" />
          <span className="logo-corner-text">CODECRAFT ACADEMY</span>
        </a>
      )}

      {/* STRICTLY ONE SLIDE AT A TIME */}
      <main className="slide-container" key={currentSlide}>
        <CurrentSlideComponent
          subStep={currentSubStep}
          setSubStep={setCurrentSubStep}
          goNext={goNext}
          goPrev={goPrev}
        />
      </main>

      {/* Fullscreen Button */}
      <button
        className="fullscreen-btn"
        onClick={toggleFullscreen}
        title="Pantalla completa (F)"
        aria-label="Pantalla completa"
      >
        {isFullscreen ? '⊠' : '⛶'}
      </button>
    </div>
  );
}
