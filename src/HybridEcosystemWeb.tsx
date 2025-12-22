import React, { useEffect, useRef, useState, useCallback, KeyboardEvent } from 'react';
import {
  CpuChipIcon,
  ServerStackIcon,
  CommandLineIcon,
  DevicePhoneMobileIcon,
  CubeIcon,
  BeakerIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ArchiveBoxIcon,
  CubeTransparentIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

// Tipos TypeScript
type SectionId = 'hero' | 'ecosystem' | 'organisms' | 'symbiosis' | 'habitat' | 'contact';
type Theme = 'dark' | 'light';
type Particle = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
  opacity: number;
};
type Organism = {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tech: string[];
  color: {
    from: string;
    to: string;
    border: string;
  };
};
type Symbiosis = {
  id: number;
  title: string;
  description: string;
  benefit: string;
  icon: string;
};
type Biome = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  color: 'cyan' | 'emerald';
  link?: string;
  linkText?: string;
};
type NavItem = {
  id: SectionId;
  label: string;
  icon: string;
};

const HybridEcosystemLanding: React.FC = () => {
  // Estados
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>('dark');
  const [particleCount, setParticleCount] = useState<number>(30);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Constantes y datos
  const navItems: NavItem[] = [
    { id: 'ecosystem', label: 'Ecosistema', icon: '🪸' },
    { id: 'organisms', label: 'Organismos', icon: '🧬' },
    { id: 'symbiosis', label: 'Simbiosis', icon: '🔄' },
    { id: 'habitat', label: 'Habitat', icon: '🌊' }
  ];

  const organisms: Organism[] = [
    {
      id: 1,
      icon: ServerStackIcon,
      title: 'Backend - Coral',
      description: 'Estructura sólida y porosa que soporta el ecosistema',
      tech: ['Python', 'FastAPI', 'SQLModel'],
      color: {
        from: 'from-cyan-500/20',
        to: 'to-blue-500/20',
        border: 'border-cyan-500/30'
      }
    },
    {
      id: 2,
      icon: CpuChipIcon,
      title: 'Frontend - Pólipo',
      description: 'Interfaz reactiva que interactúa con el entorno',
      tech: ['React', 'TypeScript', 'Zustand'],
      color: {
        from: 'from-emerald-500/20',
        to: 'to-green-500/20',
        border: 'border-emerald-500/30'
      }
    },
    {
      id: 3,
      icon: CommandLineIcon,
      title: 'Desktop - Anémona',
      description: 'Base estable con tentáculos de funcionalidad',
      tech: ['CustomTkinter', '.EXE', 'Servidor'],
      color: {
        from: 'from-purple-500/20',
        to: 'to-pink-500/20',
        border: 'border-purple-500/30'
      }
    },
    {
      id: 4,
      icon: DevicePhoneMobileIcon,
      title: 'Mobile - Medusa',
      description: 'Movilidad con red de conexiones internas',
      tech: ['Java', 'WebView', 'APK'],
      color: {
        from: 'from-amber-500/20',
        to: 'to-orange-500/20',
        border: 'border-amber-500/30'
      }
    }
  ];

  const symbioses: Symbiosis[] = [
    {
      id: 1,
      title: 'React ←→ FastAPI',
      description: 'Comunicación fluida como los sistemas circulatorios entrelazados',
      benefit: 'API Type-Safe con frontend predictivo',
      icon: '🔄'
    },
    {
      id: 2,
      title: 'Android ←→ Desktop',
      description: 'Sincronización de ecosistemas como las mareas coordinadas',
      benefit: 'Experiencia unificada multiplataforma',
      icon: '🌊'
    },
    {
      id: 3,
      title: 'SQLModel ←→ Zustand',
      description: 'Estado compartido como los nutrientes en el arrecife',
      benefit: 'Datos consistentes en toda la aplicación',
      icon: '🧪'
    }
  ];

  const biomes: Biome[] = [
    {
      id: 1,
      title: 'Arrecife Android',
      description: 'Ecosistema móvil autónomo y resiliente',
      icon: ArchiveBoxIcon,
      items: [
        'APK como colonia coralina - autosuficiente y completa',
        'WebView como simbiosis entre nativo y web',
        'Servidor embebido como sistema circulatorio interno',
        'Offline-first como adaptación a condiciones variables'
      ],
      color: 'cyan',
      link: 'https://www.uptodown.com/',
      linkText: 'Explorar en Uptodown'
    },
    {
      id: 2,
      title: 'Ecosistema Desktop',
      description: 'Superorganismo de múltiples capas',
      icon: CubeTransparentIcon,
      items: [
        'CustomTkinter como exoesqueleto estructural',
        'Servidor embebido como sistema nervioso central',
        '.EXE empaquetado como capullo de despliegue',
        'Comunicación IPC como neurotransmisores'
      ],
      color: 'emerald'
    }
  ];

  // Detectar preferencias de reducción de movimiento
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Inicializar canvas para partículas
  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Ajustar canvas al tamaño del viewport
      const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
      
      return () => window.removeEventListener('resize', updateCanvasSize);
    };
    
    initCanvas();
  }, []);

  // Sistema de partículas optimizado con canvas
  useEffect(() => {
    if (reducedMotion || !canvasRef.current) {
      setIsLoading(false);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: Particle[] = [];
    const colors = ['#06b6d4', '#3b82f6', '#10b981', '#8b5cf6'];
    
    // Crear partículas iniciales
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    
    let frameCount = 0;
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      
      // Limitar a 60 FPS
      if (deltaTime < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = timestamp;
      frameCount++;
      
      // Limpiar canvas con opacidad para efecto de rastro
      ctx.fillStyle = theme === 'dark' ? 'rgba(3, 7, 18, 0.05)' : 'rgba(236, 254, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        // Actualizar posición
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebote suave en los bordes
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Iniciar animación
    animationRef.current = requestAnimationFrame(animate);
    setIsLoading(false);
    
    // Limpiar
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, reducedMotion, theme]);

  // Observador para secciones activas
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Scroll suave mejorado
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.replace('#', '');
    if (!targetId) return;
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      
      // Actualizar URL sin recargar
      window.history.pushState({}, '', `#${targetId}`);
    }
  }, [reducedMotion]);

  // Manejar navegación por teclado
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>, callback?: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback?.();
    }
  }, []);

  // Toggle tema
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Ajustar número de partículas según el dispositivo
  useEffect(() => {
    const adjustParticles = () => {
      if (window.innerWidth < 768) {
        setParticleCount(15);
      } else if (window.innerWidth < 1024) {
        setParticleCount(20);
      } else {
        setParticleCount(30);
      }
    };
    
    adjustParticles();
    window.addEventListener('resize', adjustParticles);
    
    return () => window.removeEventListener('resize', adjustParticles);
  }, []);

  // Efecto para aplicar tema al body
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Renderizar indicador de profundidad
  const renderDepthIndicator = () => (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-4">
      <div className="text-xs text-cyan-400 rotate-90 whitespace-nowrap mb-20">
        PROFUNDIDAD DEL SISTEMA
      </div>
      {[100, 200, 300, 400].map((depth) => (
        <div key={depth} className="flex items-center">
          <div className="w-8 h-px bg-cyan-500/30"></div>
          <span className="text-xs text-cyan-400/60 ml-2">{depth}m</span>
        </div>
      ))}
    </div>
  );

  // Renderizar tarjeta de organismo
  const renderOrganismCard = (organism: Organism) => {
    const Icon = organism.icon;
    
    return (
      <div
        key={organism.id}
        className="group relative"
        role="article"
        aria-label={`Organismo: ${organism.title}`}
      >
        <div 
          className={`absolute -inset-1 bg-gradient-to-br ${organism.color.from} ${organism.color.to} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${reducedMotion ? 'transition-none' : ''}`}
          aria-hidden="true"
        ></div>
        <div 
          className={`relative p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900/40' : 'bg-white/60'} backdrop-blur-sm border ${organism.color.border} h-full transition-all duration-300 ${!reducedMotion ? 'group-hover:-translate-y-2' : ''}`}
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e)}
        >
          <div className={`p-3 rounded-lg bg-gradient-to-br ${organism.color.from.replace('/20', '/10')} ${organism.color.to.replace('/20', '/10')} w-fit mb-6`}>
            <Icon className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {organism.title}
          </h3>
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {organism.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {organism.tech.map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100/80 text-gray-700'}`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar tarjeta de simbiosis
  const renderSymbiosisCard = (symbiosis: Symbiosis) => (
    <div
      key={symbiosis.id}
      className={`relative group p-8 rounded-2xl backdrop-blur-sm border ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900/40 to-gray-900/20 border-gray-800/30 hover:border-cyan-500/30' : 'bg-gradient-to-br from-white/40 to-white/20 border-gray-200/30 hover:border-cyan-500/50'} transition-all duration-300`}
      role="article"
      aria-label={`Simbiosis: ${symbiosis.title}`}
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <div className="text-4xl mb-6" aria-hidden="true">{symbiosis.icon}</div>
      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        {symbiosis.title}
      </h3>
      <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {symbiosis.description}
      </p>
      <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 w-fit">
        <span className="text-sm text-cyan-600 dark:text-cyan-300">{symbiosis.benefit}</span>
      </div>
    </div>
  );

  // Renderizar bioma
  const renderBiomeCard = (biome: Biome) => {
    const Icon = biome.icon;
    const colorClasses = {
      cyan: {
        bg: 'from-cyan-500/20 to-blue-500/20',
        border: 'border-cyan-500/30',
        text: 'text-cyan-400',
        dot: 'bg-cyan-500'
      },
      emerald: {
        bg: 'from-emerald-500/20 to-green-500/20',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500'
      }
    }[biome.color];

    return (
      <div key={biome.id} className="group relative" role="article" aria-label={`Bioma: ${biome.title}`}>
        <div 
          className={`absolute -inset-4 bg-gradient-to-r ${colorClasses.bg.replace('/20', '/10')} rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${reducedMotion ? 'transition-none' : ''}`}
          aria-hidden="true"
        ></div>
        <div className={`relative p-8 rounded-2xl backdrop-blur-sm border ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900/60 to-gray-900/30 border-gray-800/30' : 'bg-gradient-to-br from-white/60 to-white/30 border-gray-200/30'}`}>
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses.bg} border ${colorClasses.border} w-fit mb-4`}>
                <Icon className={`h-10 w-10 ${colorClasses.text}`} aria-hidden="true" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {biome.title}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {biome.description}
              </p>
            </div>
            <div className="md:w-2/3">
              <ul className="space-y-4">
                {biome.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full ${colorClasses.dot} mt-2 mr-3 flex-shrink-0`} aria-hidden="true"></div>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                  </li>
                ))}
              </ul>
              {biome.link && (
                <div className="mt-8 pt-6 border-t border-gray-800/50 dark:border-gray-200/20">
                  <a
                    href={biome.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100 text-white"
                    aria-label={`${biome.linkText} - Se abrirá en una nueva pestaña`}
                  >
                    <DevicePhoneMobileIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    {biome.linkText}
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Configuración de Tailwind CSS 4 para gradientes animados
  const gradientAnimationStyle = !reducedMotion ? {
    animation: 'gradient 3s ease infinite',
    backgroundSize: '200% auto'
  } : {};

  return (
    <>
      <div 
        ref={containerRef}
        className={`min-h-screen bg-gradient-to-b ${theme === 'dark' 
          ? 'from-gray-950 via-slate-900 to-gray-950 text-white' 
          : 'from-cyan-50 via-blue-50 to-gray-100 text-gray-900'} overflow-hidden relative font-sans`}
        role="main"
      >
        {/* Canvas para partículas */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-950/90 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-cyan-300">Inicializando ecosistema...</p>
            </div>
          </div>
        )}

        {/* Fondo del arrecife */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${theme === 'dark' ? 'from-cyan-900/10' : 'from-cyan-200/20'} via-transparent to-transparent`}></div>
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] ${theme === 'dark' ? 'from-blue-900/10' : 'from-blue-200/20'} via-transparent to-transparent`}></div>
          
          <div className={`absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-br ${theme === 'dark' ? 'from-cyan-500/5' : 'from-cyan-400/10'} to-blue-500/5 rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-1/3 right-20 w-96 h-96 bg-gradient-to-tr ${theme === 'dark' ? 'from-emerald-500/5' : 'from-emerald-400/10'} to-teal-500/5 rounded-full blur-3xl`}></div>
          <div className={`absolute top-2/3 left-1/4 w-48 h-48 bg-gradient-to-r ${theme === 'dark' ? 'from-purple-500/5' : 'from-purple-400/10'} to-pink-500/5 rounded-full blur-3xl`}></div>
        </div>

        {/* Navegación */}
        <nav 
          role="navigation" 
          aria-label="Navegación principal"
          className={`fixed top-0 w-full z-50 px-4 sm:px-6 py-4 backdrop-blur-md border-b ${theme === 'dark' ? 'bg-gray-900/30 border-cyan-500/20' : 'bg-white/30 border-cyan-500/30'}`}
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" aria-hidden="true"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                gfouz
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={handleSmoothScroll}
                  className={`flex items-center space-x-2 px-3 py-2 lg:px-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                      : theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'
                  } ${reducedMotion ? 'transition-none' : ''}`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900 hover:bg-gray-800/50' : 'focus:ring-offset-white hover:bg-gray-100/50'}`}
                aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              
              <a
                href="#contact"
                onClick={handleSmoothScroll}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100"
              >
                Contactar
              </a>
            </div>
          </div>
        </nav>

        {/* Sección Hero */}
        <section 
          id="hero" 
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6"
          aria-label="Sección principal - Entrada al arrecife"
        >
          <div className="container mx-auto max-w-6xl text-center relative z-10">
            {renderDepthIndicator()}

            <div className="mb-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 mb-6 ${theme === 'dark' ? '' : 'shadow-lg'}`}>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2" aria-hidden="true"></div>
                <span className="text-sm text-cyan-600 dark:text-cyan-300">Ecosistema Híbrido</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6">
                <span 
                  className="bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
                  style={gradientAnimationStyle}
                >
                  Arquitectura
                </span>
                <br />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Coralina</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Donde cada organismo —backend, frontend, mobile, desktop— coexiste, 
                se complementa y fortalece el sistema completo. Como en un arrecife, 
                la resiliencia nace de la simbiosis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#organisms"
                  onClick={handleSmoothScroll}
                  className="group relative px-6 py-4 sm:px-8 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 text-white"
                  role="button"
                  tabIndex={0} //@ts-expect-error
                  onKeyDown={(e) => handleKeyDown(e, () => handleSmoothScroll(e as any))}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:from-cyan-700 group-hover:to-blue-700 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                  <span className="relative flex items-center text-lg font-semibold">
                    Explorar Organismos
                    <ChevronDownIcon className={`h-5 w-5 ml-2 ${!reducedMotion ? 'group-hover:translate-y-1 transition-transform' : ''}`} aria-hidden="true" />
                  </span>
                </a>
                
                <a
                  href="#habitat"
                  onClick={handleSmoothScroll}
                  className={`group px-6 py-4 sm:px-8 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${theme === 'dark' ? 'border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10 focus:ring-offset-gray-900' : 'border-cyan-500/40 hover:border-cyan-500/60 hover:bg-cyan-500/10 focus:ring-offset-white'}`}
                  role="button"
                  tabIndex={0}   //@ts-expect-error
                  onKeyDown={(e) => handleKeyDown(e, () => handleSmoothScroll(e as any))}
                >
                  <span className="flex items-center text-lg font-medium">
                    Ver Habitat
                    <ArrowTopRightOnSquareIcon className={`h-5 w-5 ml-2 ${!reducedMotion ? 'group-hover:rotate-45 transition-transform' : ''}`} aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
            
            {/* Línea de conexión */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
              <div className="flex flex-col items-center animate-bounce">
                <ChevronDownIcon className="h-6 w-6 text-cyan-400/60" aria-hidden="true" />
                <div className="w-px h-8 bg-gradient-to-b from-cyan-400/30 to-transparent mt-2" aria-hidden="true"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Organismos */}
        <section 
          id="organisms" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Organismos del sistema"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Organismos del Sistema
                </span>
              </h2>
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Cada tecnología es un organismo especializado que cumple su función 
                dentro del ecosistema, adaptándose y evolucionando en simbiosis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {organisms.map(renderOrganismCard)}
            </div>
          </div>
        </section>

        {/* Sección Simbiosis */}
        <section 
          id="symbiosis" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Relaciones simbióticas"
        >
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${theme === 'dark' ? 'via-gray-900/20' : 'via-gray-100/20'} to-transparent`} aria-hidden="true"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Relaciones Simbióticas
                </span>
              </h2>
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Como el pez payaso y la anémona, nuestras tecnologías se protegen 
                y potencian mutuamente en un ciclo de dependencia beneficiosa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {symbioses.map(renderSymbiosisCard)}
            </div>
          </div>
        </section>

        {/* Sección Habitat */}
        <section 
          id="habitat" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Biomas de producción"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Biomas de Producción
                </span>
              </h2>
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Cada proyecto es un bioma único donde los organismos tecnológicos 
                interactúan para crear ecosistemas funcionales y autosuficientes.
              </p>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {biomes.map(renderBiomeCard)}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section 
          id="contact" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Contacto"
        >
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${theme === 'dark' ? 'via-blue-900/10' : 'via-blue-100/20'} to-gray-950`} aria-hidden="true"></div>
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
              <span 
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
                style={gradientAnimationStyle}
              >
                ¿Listo para cultivar un nuevo ecosistema?
              </span>
            </h2>
            
            <p className={`text-lg sm:text-xl mb-12 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Cada gran arrecife comenzó con un solo pólipo. 
              Hablemos sobre cómo podemos hacer crecer juntos tu próximo sistema híbrido.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
              <a
                href="mailto:contacto@gfouz.com"
                className={`group px-6 py-4 md:px-8 rounded-xl transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${theme === 'dark' 
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 border-gray-800/50 hover:border-cyan-500/30 focus:ring-offset-gray-900' 
                  : 'bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border-gray-200/50 hover:border-cyan-500/40 focus:ring-offset-white'}`}
                role="button"
                tabIndex={0}  //@ts-expect-error
                onKeyDown={(e) => handleKeyDown(e)}
              >
                <span className="flex items-center text-lg font-semibold">
                  <CubeIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                  Iniciar Simbiosis
                </span>
              </a>
              
              <a
                href="https://dev.to/gfouz"
                target="_blank"
                rel="noopener noreferrer"
                className={`group px-6 py-4 md:px-8 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${theme === 'dark' 
                  ? 'border-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10 focus:ring-offset-gray-900' 
                  : 'border-cyan-500/40 hover:border-cyan-500/60 hover:bg-cyan-500/10 focus:ring-offset-white'}`}
                aria-label="Explorar el laboratorio - Se abrirá en una nueva pestaña"
              >
                <span className="flex items-center text-lg font-semibold">
                  <BeakerIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                  Explorar el Laboratorio
                </span>
              </a>
            </div>
            
            <div className={`pt-8 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" aria-hidden="true"></div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Arquitecto de Ecosistemas Híbridos
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Resiliencia a través de la simbiosis • Sistemas autónomos • Control exhaustivo
                  </p>
                </div>
                
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <p>© {new Date().getFullYear()} Giovani Fouz</p>
                  <p className="mt-1">Un ecosistema por línea de código</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          section {
            scroll-margin-top: 80px;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .animate-gradient,
            .group-hover\\:translate-y-2,
            .group-hover\\:-translate-y-2,
            .group-hover\\:rotate-45,
            .transition-all,
            .transition-opacity,
            .transition-transform,
            .animate-bounce,
            .animate-pulse,
            .animate-spin {
              animation: none !important;
              transition: none !important;
            }
          }
          
          /* Optimización para Tailwind CSS 4 */
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
          
          .backdrop-blur-md {
            backdrop-filter: blur(12px);
          }
          
          .bg-clip-text {
            -webkit-background-clip: text;
            background-clip: text;
          }
          
          .will-change-transform {
            will-change: transform;
          }
        `}
      </style>
    </>
  );
};

export default HybridEcosystemLanding;