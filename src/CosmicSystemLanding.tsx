import React, { useEffect, useRef, useState, useCallback, KeyboardEvent, ReactNode } from 'react';
import CubeIcon from '@heroicons/react/24/outline/CubeIcon.js';
import BeakerIcon from '@heroicons/react/24/outline/BeakerIcon.js';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon.js';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon.js';
import SunIcon from '@heroicons/react/24/outline/SunIcon.js';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon.js';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon.js';
import CodeBracketIcon from '@heroicons/react/24/outline/CodeBracketIcon.js';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon.js';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon.js';

// Tipos TypeScript
type SectionId = 'hero' | 'planets' | 'harmony' | 'earth' | 'contact' | 'about';
type Theme = 'dark' | 'light';
type Particle = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
  opacity: number;
  type: 'star' | 'meteor' | 'nebula';
};
type Planet = {
  id: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  role: string[];
  color: {
    from: string;
    to: string;
    border: string;
  };
  orbit: number;
};
type CosmicHarmony = {
  id: number;
  title: string;
  description: string;
  impact: string;
  icon: string;
};
type EarthSystem = {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  conditions: string[];
  color: 'blue' | 'emerald';
  link?: string;
  linkText?: string;
};
type NavItem = {
  id: SectionId;
  label: string;
  icon: ReactNode;
};

// Type guard para SectionId
const isSectionId = (id: string): id is SectionId => {
  return ['hero', 'planets', 'harmony', 'earth', 'contact', 'about'].includes(id);
};

// Configuración de color para sistemas terrestres
type SystemColorConfig = {
  bg: string;
  border: string;
  text: string;
  dot: string;
};

const systemColorMap: Record<'blue' | 'emerald', SystemColorConfig> = {
  blue: {
    bg: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    dot: 'bg-blue-500'
  },
  emerald: {
    bg: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500'
  }
} as const;

// Componentes SVG personalizados para iconografía planetaria
const PlanetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <circle cx="10" cy="15" r="1" fill="currentColor" />
    <path d="M12 3a9 9 0 0 1 0 18" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const OrbitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeDasharray="4 4" />
    <circle cx="12" cy="12" r="7" strokeWidth="1.5" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="4" strokeWidth="2" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);



const AtmosphereIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <path d="M3 12h18" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M12 3v18" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="5" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const LifeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth="2" />
    <path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8v8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 16h8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);



const CosmicSystemLanding: React.FC = () => {
  // Estados
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>('dark');
  const [particleCount, setParticleCount] = useState<number>(50);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Constantes y datos
  const navItems: NavItem[] = [
    { id: 'about', label: 'Sobre el Sistema', icon: '🌌' },
    { id: 'planets', label: 'Planetas', icon: '🪐' },
    { id: 'harmony', label: 'Armonía', icon: '⚖️' },
    { id: 'earth', label: 'Tierra', icon: '🌍' },
    { id: 'contact', label: 'Contacto', icon: '📡' }
  ];

  const planets: Planet[] = [
    {
      id: 1,
      icon: SunIcon,
      title: 'Sol - Fuente de Vida',
      description: 'Motor gravitacional y fuente de energía del sistema',
      role: ['Gravedad', 'Energía', 'Estabilidad térmica'],
      color: {
        from: 'from-amber-500/20',
        to: 'to-orange-500/20',
        border: 'border-amber-500/30'
      },
      orbit: 0
    },
    {
      id: 2,
      icon: PlanetIcon,
      title: 'Júpiter - Guardián',
      description: 'Escudo gravitacional que protege a los planetas interiores',
      role: ['Protección', 'Estabilidad orbital', 'Filtro cósmico'],
      color: {
        from: 'from-red-500/20',
        to: 'to-amber-500/20',
        border: 'border-red-500/30'
      },
      orbit: 5.2
    },
    {
      id: 3,
      icon: PlanetIcon,
      title: 'Luna - Estabilizador',
      description: 'Regulador climático y estabilizador del eje terrestre',
      role: ['Mareas', 'Clima estable', 'Eje constante'],
      color: {
        from: 'from-slate-500/20',
        to: 'to-gray-500/20',
        border: 'border-slate-500/30'
      },
      orbit: 0.00257
    },
    {
      id: 4,
      icon: PlanetIcon,
      title: 'Marte - Equilibrador',
      description: 'Influencia gravitacional en la estabilidad orbital terrestre',
      role: ['Resonancia orbital', 'Estabilidad a largo plazo'],
      color: {
        from: 'from-red-400/20',
        to: 'to-red-600/20',
        border: 'border-red-400/30'
      },
      orbit: 1.52
    }
  ];

  const harmonies: CosmicHarmony[] = [
    {
      id: 1,
      title: 'Órbitas Resonantes',
      description: 'Las frecuencias orbitales se sincronizan como un reloj cósmico perfecto',
      impact: 'Estabilidad climática milenaria',
      icon: '🌀'
    },
    {
      id: 2,
      title: 'Campo Magnético Terrestre',
      description: 'Escudo dinámico generado por el núcleo que protege de radiación solar',
      impact: 'Protección de la atmósfera y la vida',
      icon: '🛡️'
    },
    {
      id: 3,
      title: 'Distancia Habitable',
      description: 'La Tierra orbita en la zona Ricitos de Oro - ni demasiado cerca, ni demasiado lejos',
      impact: 'Temperatura ideal para agua líquida',
      icon: '🌡️'
    }
  ];

  const earthSystems: EarthSystem[] = [
    {
      id: 1,
      title: 'Atmósfera Perfecta',
      description: 'Composición química única que permite y protege la vida',
      icon: AtmosphereIcon,
      conditions: [
        'Oxígeno al 21% - nivel óptimo para respiración y combustión',
        'Nitrógeno al 78% - diluyente y estabilizador químico',
        'CO2 en trazas - efecto invernadero moderado',
        'Capa de ozono - filtro UV natural'
      ],
      color: 'blue',
      link: 'https://es.wikipedia.org/wiki/Atm%C3%B3sfera_terrestre',
      linkText: 'Explorar la Atmósfera'
    },
    {
      id: 2,
      title: 'Condiciones Únicas',
      description: 'Equilibrios delicados que hacen posible la biosfera',
      icon: LifeIcon,
      conditions: [
        'Temperatura media: 15°C - rango óptimo para química orgánica',
        'Inclinación axial de 23.5° - estaciones moderadas',
        'Gravedad de 9.8 m/s² - retiene atmósfera pero permite vuelo',
        'Rotación de 24h - ciclos día/noche ideales'
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

  // Inicializar canvas para partículas y efectos espaciales
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

  // Sistema de partículas y efectos espaciales
  useEffect(() => {
    if (reducedMotion || !canvasRef.current) {
      setIsLoading(false);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: Particle[] = [];
    const starColors = ['#ffffff', '#fef3c7', '#93c5fd', '#c7d2fe'];
    const nebulaColors = ['#3b82f6', '#8b5cf6', '#06b6d4'];
    
    // Crear estrellas, meteoritos y nebulosas
    for (let i = 0; i < particleCount; i++) {
      const type = i % 10 === 0 ? 'meteor' : i % 5 === 0 ? 'nebula' : 'star';
      
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: type === 'meteor' ? (Math.random() + 0.5) : (Math.random() - 0.5) * 0.3,
        speedY: type === 'meteor' ? (Math.random() + 0.5) : (Math.random() - 0.5) * 0.3,
        size: type === 'meteor' ? Math.random() * 3 + 1 : type === 'nebula' ? Math.random() * 8 + 3 : Math.random() * 1.5 + 0.5,
        color: type === 'nebula' ? nebulaColors[Math.floor(Math.random() * nebulaColors.length)] : starColors[Math.floor(Math.random() * starColors.length)],
        opacity: type === 'nebula' ? Math.random() * 0.1 + 0.05 : Math.random() * 0.8 + 0.2,
        type
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
      
      // Fondo espacial con gradiente
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(3, 7, 18, 0.95)');
      gradient.addColorStop(1, 'rgba(9, 24, 51, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Efecto de galaxias en el fondo
      for (let i = 0; i < 3; i++) {
        const x = (canvas.width / 3) * (i + 0.5);
        const y = canvas.height * (Math.sin(frameCount * 0.0001 + i) * 0.1 + 0.5);
        const radius = 100 + Math.sin(frameCount * 0.0005 + i) * 20;
        
        const galaxyGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        galaxyGradient.addColorStop(0, `rgba(59, 130, 246, ${0.05 + Math.sin(frameCount * 0.001) * 0.02})`);
        galaxyGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = galaxyGradient;
        ctx.fill();
      }
      
      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        // Actualizar posición
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebote en los bordes o reinicio
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.y = Math.random() * canvas.height;
        }
        if (particle.x < 0) {
          particle.x = canvas.width;
          particle.y = Math.random() * canvas.height;
        }
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
        
        // Efecto de parpadeo para estrellas
        let currentOpacity = particle.opacity;
        if (particle.type === 'star') {
          currentOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(frameCount * 0.02 + particle.x));
        }
        
        // Dibujar partícula según su tipo
        ctx.beginPath();
        
        if (particle.type === 'nebula') {
          // Nebulosa como círculo difuminado
          const nebulaGradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          nebulaGradient.addColorStop(0, `${particle.color}${Math.floor(currentOpacity * 255).toString(16).padStart(2, '0')}`);
          nebulaGradient.addColorStop(1, `${particle.color}00`);
          
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = nebulaGradient;
        } else if (particle.type === 'meteor') {
          // Meteorito con estela
          const meteorGradient = ctx.createLinearGradient(
            particle.x, particle.y,
            particle.x - particle.speedX * 10, particle.y - particle.speedY * 10
          );
          meteorGradient.addColorStop(0, `${particle.color}ff`);
          meteorGradient.addColorStop(1, `${particle.color}00`);
          
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.speedX * 10, particle.y - particle.speedY * 10);
          ctx.lineWidth = particle.size / 2;
          ctx.strokeStyle = meteorGradient;
          ctx.stroke();
          
          // Cabeza del meteorito
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          //continue;
        } else {
          // Estrella normal
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = currentOpacity;
          ctx.fill();
        }
        
        ctx.globalAlpha = 1;
      });
      
      // Efectos de supernova ocasionales
      if (frameCount % 600 === 0) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        const supernovaGradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
        supernovaGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        supernovaGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
        supernovaGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, 100, 0, Math.PI * 2);
        ctx.fillStyle = supernovaGradient;
        ctx.fill();
      }
      
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
          if (entry.isIntersecting && entry.target.id && isSectionId(entry.target.id)) {
            setActiveSection(entry.target.id);
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
    if (!targetId || !isSectionId(targetId)) return;
    
    scrollToSection(targetId);
    
    // Cerrar menú móvil después de hacer clic
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Navegación programática por secciones
  const scrollToSection = useCallback((targetId: SectionId) => {
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
  const handleKeyDown = useCallback((
    e: KeyboardEvent<HTMLElement>, 
    callback?: () => void
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback?.();
    }
  }, []);

  // Toggle tema
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // Toggle menú móvil
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Ajustar número de partículas según el dispositivo
  useEffect(() => {
    const adjustParticles = () => {
      if (window.innerWidth < 768) {
        setParticleCount(25);
      } else if (window.innerWidth < 1024) {
        setParticleCount(35);
      } else {
        setParticleCount(50);
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

  // Cerrar menú móvil al redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Renderizar indicador de distancia
  const renderDistanceIndicator = () => (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center space-y-4">
      <div className="text-xs text-blue-400 rotate-90 whitespace-nowrap mb-20">
        DISTANCIA CÓSMICA
      </div>
      {['0.1 AU', '1 AU', '5 AU', '30 AU'].map((distance) => (
        <div key={distance} className="flex items-center">
          <div className="w-8 h-px bg-blue-500/30"></div>
          <span className="text-xs text-blue-400/60 ml-2">{distance}</span>
        </div>
      ))}
    </div>
  );

  // Renderizar tarjeta de planeta
  const renderPlanetCard = (planet: Planet) => {
    const Icon = planet.icon;
    
    return (
      <div
        key={planet.id}
        className="group relative"
        role="article"
        aria-label={`Planeta: ${planet.title}`}
      >
        <div 
          className={`absolute -inset-1 bg-gradient-to-br ${planet.color.from} ${planet.color.to} rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${reducedMotion ? 'transition-none' : ''}`}
          aria-hidden="true"
        ></div>
        <div 
          className={`relative p-6 rounded-xl backdrop-blur-sm border ${planet.color.border} h-full transition-all duration-300 ${!reducedMotion ? 'group-hover:-translate-y-2' : ''} ${theme === 'dark' ? 'bg-gray-900/30' : 'bg-white/60'}`}
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e)}
        >
          <div className={`p-3 rounded-lg bg-gradient-to-br ${planet.color.from.replace('/20', '/10')} ${planet.color.to.replace('/20', '/10')} w-fit mb-6 relative`}>
            <Icon className="h-8 w-8 text-white" />
            {planet.orbit > 0 && (
              <div className="absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full bg-gray-900/80 text-amber-300">
                {planet.orbit} AU
              </div>
            )}
          </div>
          <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {planet.title}
          </h3>
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {planet.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {planet.role.map((role) => (
              <span
                key={role}
                className={`px-3 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100/80 text-gray-700'}`}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar tarjeta de armonía cósmica
  const renderHarmonyCard = (harmony: CosmicHarmony) => (
    <div
      key={harmony.id}
      className={`relative group p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900/40 to-gray-900/20 border-gray-800/30 hover:border-blue-500/30' 
        : 'bg-gradient-to-br from-white/40 to-white/20 border-gray-200/30 hover:border-blue-500/50'}`}
      role="article"
      aria-label={`Armonía cósmica: ${harmony.title}`}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e)}
    >
      <div className="text-4xl mb-6" aria-hidden="true">{harmony.icon}</div>
      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        {harmony.title}
      </h3>
      <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {harmony.description}
      </p>
      <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 w-fit">
        <span className="text-sm text-blue-600 dark:text-blue-300">Impacto: {harmony.impact}</span>
      </div>
    </div>
  );

  // Renderizar sistema terrestre
  const renderEarthSystemCard = (system: EarthSystem) => {
    const Icon = system.icon;
    const colorClasses = systemColorMap[system.color];

    return (
      <div key={system.id} className="group relative" role="article" aria-label={`Sistema terrestre: ${system.title}`}>
        <div 
          className={`absolute -inset-4 bg-gradient-to-r ${colorClasses.bg.replace('/20', '/10')} rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${reducedMotion ? 'transition-none' : ''}`}
          aria-hidden="true"
        ></div>
        <div className={`relative p-8 rounded-2xl backdrop-blur-sm border ${theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900/60 to-gray-900/30 border-gray-800/30' 
          : 'bg-gradient-to-br from-white/60 to-white/30 border-gray-200/30'}`}>
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/3">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses.bg} border ${colorClasses.border} w-fit mb-4`}>
                <Icon className={`h-10 w-10 ${colorClasses.text}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {system.title}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {system.description}
              </p>
            </div>
            <div className="md:w-2/3">
              <ul className="space-y-4">
                {system.conditions.map((condition, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full ${colorClasses.dot} mt-2 mr-3 flex-shrink-0`} aria-hidden="true"></div>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{condition}</span>
                  </li>
                ))}
              </ul>
              {system.link && system.linkText && (
                <div className="mt-8 pt-6 border-t border-gray-800/50 dark:border-gray-200/20">
                  <a
                    href={system.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100 text-white"
                    aria-label={`${system.linkText} - Se abrirá en una nueva pestaña`}
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    {system.linkText}
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar botón de acción principal
  const renderPrimaryCTA = () => {
    const ctas = [
      {
        id: 1,
        label: 'Explorar el Código Cósmico',
        icon: CodeBracketIcon,
        href: 'https://github.com',
        color: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
        external: true
      },
      {
        id: 2,
        label: 'Estudiar las Leyes Físicas',
        icon: DocumentTextIcon,
        href: '/cosmic-laws.pdf',
        color: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
        external: false
      }
    ];

    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        {ctas.map((cta) => {
          const Icon = cta.icon;
          return (
            <a
              key={cta.id}
              href={cta.href}
              target={cta.external ? '_blank' : '_self'}
              rel={cta.external ? 'noopener noreferrer' : ''}
              className="group relative px-6 py-4 sm:px-8 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white w-full sm:w-auto"
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => handleKeyDown(e)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${cta.color} transition-all duration-300`}></div>
              <div className={`absolute inset-0 bg-gradient-to-r ${cta.color.split(' ')[0]} ${cta.color.split(' ')[1]} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}></div>
              <span className="relative flex items-center justify-center text-lg font-semibold">
                <Icon className="h-5 w-5 mr-3" />
                {cta.label}
                {cta.external && <ArrowTopRightOnSquareIcon className={`h-5 w-5 ml-2 ${!reducedMotion ? 'group-hover:rotate-45 transition-transform' : ''}`} />}
              </span>
            </a>
          );
        })}
      </div>
    );
  };

  // Configuración de Tailwind CSS para gradientes animados
  const gradientAnimationStyle = !reducedMotion ? {
    animation: 'cosmicGradient 3s ease infinite',
    backgroundSize: '200% auto'
  } : {};

  return (
    <>
      <div 
        ref={containerRef}
        className={`min-h-screen bg-gradient-to-b ${theme === 'dark' 
          ? 'from-gray-950 via-slate-900 to-gray-950 text-white' 
          : 'from-blue-50 via-indigo-50 to-gray-100 text-gray-900'} overflow-hidden relative font-sans`}
        role="main"
      >
        {/* Canvas para efectos espaciales */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-950/95 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                <div className="absolute inset-4 border-4 border-blue-500/50 rounded-full animate-spin"></div>
                <div className="absolute inset-8 border-4 border-blue-500/70 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-blue-300 text-lg">Inicializando sistema solar...</p>
              <p className="text-blue-400/60 text-sm mt-2">Cargando armonías cósmicas</p>
            </div>
          </div>
        )}

        {/* Fondo espacial con efectos */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          {/* Galaxias distantes */}
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${theme === 'dark' ? 'from-blue-900/10' : 'from-blue-200/10'} via-transparent to-transparent rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tr ${theme === 'dark' ? 'from-purple-900/10' : 'from-purple-200/10'} via-transparent to-transparent rounded-full blur-3xl`}></div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${theme === 'dark' ? 'from-cyan-900/5' : 'from-cyan-200/5'} via-transparent to-transparent rounded-full blur-3xl`}></div>
          
          {/* Nebulosas */}
          <div className={`absolute top-20 right-40 w-64 h-64 bg-gradient-to-br ${theme === 'dark' ? 'from-indigo-500/5' : 'from-indigo-300/10'} to-blue-500/5 rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '4s' }}></div>
          <div className={`absolute bottom-40 left-60 w-48 h-48 bg-gradient-to-tr ${theme === 'dark' ? 'from-emerald-500/5' : 'from-emerald-300/10'} to-teal-500/5 rounded-full blur-3xl animate-pulse`} style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
          
          {/* Anillos planetarios */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rotate-45"></div>
            <div className="absolute bottom-1/3 right-1/3 w-40 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent -rotate-30"></div>
          </div>
        </div>

        {/* Navegación */}
        <nav 
          role="navigation" 
          aria-label="Navegación principal"
          className={`fixed top-0 w-full z-50 px-4 sm:px-6 py-4 backdrop-blur-md border-b ${theme === 'dark' ? 'bg-gray-900/30 border-blue-500/20' : 'bg-white/30 border-blue-500/30'}`}
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 bg-gray-950 rounded-full"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Sistema Solar
              </span>
            </div>
            
            {/* Menú desktop */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={handleSmoothScroll}
                  className={`flex items-center space-x-2 px-3 py-2 lg:px-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'} ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 font-semibold shadow-lg shadow-blue-500/10'
                      : theme === 'dark' ? 'hover:bg-gray-800/50 text-gray-300' : 'hover:bg-gray-100/50 text-gray-700'
                  } ${reducedMotion ? 'transition-none' : ''}`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Botón menú móvil */}
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden ${theme === 'dark' ? 'focus:ring-offset-gray-900 hover:bg-gray-800/50' : 'focus:ring-offset-white hover:bg-gray-100/50'}`}
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'focus:ring-offset-gray-900 hover:bg-gray-800/50' : 'focus:ring-offset-white hover:bg-gray-100/50'}`}
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
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:focus:ring-offset-gray-100"
              >
                Contactar
              </a>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
            <div className={`py-4 rounded-xl backdrop-blur-md border ${theme === 'dark' ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={handleSmoothScroll}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 font-semibold'
                      : theme === 'dark' ? 'hover:bg-gray-800/50 text-gray-300' : 'hover:bg-gray-100/50 text-gray-700'
                    }`}
                    aria-current={activeSection === item.id ? 'page' : undefined}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Sección Hero */}
        <section 
          id="hero" 
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6"
          aria-label="Sección principal - El sistema solar"
        >
          <div className="container mx-auto max-w-6xl text-center relative z-10">
            {renderDistanceIndicator()}

            <div className="mb-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 mb-6 ${theme === 'dark' ? '' : 'shadow-lg'}`}>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2"></div>
                <span className="text-sm text-blue-600 dark:text-blue-300">Arquitectura Cósmica</span>
              </div>
              <div className='py-4'>
                
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6">
                <span 
                  className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent"
                  style={gradientAnimationStyle}
                >
                  Sistema Solar
                </span>
                <br />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Diseño Perfecto para la Vida</span>
              </h1>
              
              <p className={`text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Un equilibrio cósmico magistral donde cada planeta, cada fuerza, cada órbita 
                conspira para hacer posible la vida en la Tierra. Un milímetro de diferencia 
                y todo colapsaría.
              </p>
              
              {/* Botones de acción principales */}
              {renderPrimaryCTA()}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#planets"
                  onClick={handleSmoothScroll}
                  className="group relative px-6 py-4 sm:px-8 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => 
                    handleKeyDown(e, () => scrollToSection('planets'))
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:from-blue-700 group-hover:to-cyan-700 transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500"></div>
                  <span className="relative flex items-center text-lg font-semibold">
                    Explorar Planetas
                    <ChevronDownIcon className={`h-5 w-5 ml-2 ${!reducedMotion ? 'group-hover:translate-y-1 transition-transform' : ''}`} />
                  </span>
                </a>
                
                <a
                  href="#earth"
                  onClick={handleSmoothScroll}
                  className={`group px-6 py-4 sm:px-8 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark' ? 'border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10 focus:ring-offset-gray-900' : 'border-blue-500/40 hover:border-blue-500/60 hover:bg-blue-500/10 focus:ring-offset-white'}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => 
                    handleKeyDown(e, () => scrollToSection('earth'))
                  }
                >
                  <span className="flex items-center text-lg font-medium">
                    Ver la Tierra
                    <ArrowTopRightOnSquareIcon className={`h-5 w-5 ml-2 ${!reducedMotion ? 'group-hover:rotate-45 transition-transform' : ''}`} />
                  </span>
                </a>
              </div>
            </div>
            
            {/* Orbits animadas */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
              <div className="relative w-40 h-40">
                {/* Órbita exterior */}
                <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                {/* Órbita media */}
                <div className="absolute inset-10 border border-cyan-500/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full"></div>
                </div>
                {/* Órbita interior */}
                <div className="absolute inset-20 border border-emerald-500/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                </div>
                {/* Sol central */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Sobre el Sistema */}
        <section 
          id="about" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Sobre el sistema solar"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  El Diseño Cósmico
                </span>
              </h2>
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                4.5 billones de años de evolución orbital perfecta
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-center">
              <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
                <div className="relative mb-6">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl" aria-hidden="true"></div>
                  <div className={`relative p-6 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-500/40'}`}>
                    <OrbitIcon className="h-32 w-32 text-blue-400" />
                  </div>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Precisión Milimétrica
                </h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  Un sistema de tolerancia cero
                </p>
              </div>
              
              <div className="lg:col-span-2">
                <div className={`p-8 rounded-2xl backdrop-blur-sm border ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900/40 to-gray-900/20 border-gray-800/30' : 'bg-gradient-to-br from-white/40 to-white/20 border-gray-200/30'}`}>
                  <p className={`text-lg leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    El sistema solar es una obra maestra de ingeniería cósmica. Cada parámetro — 
                    desde la masa del Sol hasta la inclinación del eje terrestre — está calibrado 
                    con una precisión que desafía la probabilidad. Si la Tierra estuviera un 5% más 
                    cerca del Sol, herviría; un 5% más lejos, se congelaría.
                  </p>
                  <p className={`text-lg leading-relaxed mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Júpiter actúa como un escudo gravitacional, desviando asteroides peligrosos. 
                    La Luna estabiliza nuestro clima. Marte y Venus mantienen resonancias orbitales 
                    que previenen caos gravitacional. Es un sistema donde cada elemento existe 
                    no por accidente, sino por necesidad cósmica.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100/50 border border-gray-200/50'}`}>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Gravedad Perfecta</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100/50 border border-gray-200/50'}`}>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Órbitas Resonantes</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-gray-100/50 border border-gray-200/50'}`}>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Equilibrio Térmico</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Planetas */}
        <section 
          id="planets" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Planetas del sistema"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Los Pilares Cósmicos
                </span>
              </h2>
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Cada cuerpo celeste juega un papel crítico en el equilibrio que permite la vida terrestre.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {planets.map(renderPlanetCard)}
            </div>
          </div>
        </section>

        {/* Sección Armonía Cósmica */}
        <section 
          id="harmony" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Armonías cósmicas"
        >
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${theme === 'dark' ? 'via-gray-900/20' : 'via-gray-100/20'} to-transparent`} aria-hidden="true"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                  Armonías Cósmicas
                </span>
              </h2>
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Interacciones perfectamente sincronizadas que mantienen la estabilidad del sistema.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {harmonies.map(renderHarmonyCard)}
            </div>
          </div>
        </section>

        {/* Sección Tierra */}
        <section 
          id="earth" 
          className="relative py-24 md:py-32 px-4 sm:px-6"
          aria-label="Sistemas terrestres"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  El Milagro Terrestre
                </span>
              </h2>
              <p className={`max-w-2xl mx-auto text-base sm:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Condiciones únicas que convierten a la Tierra en el único oasis de vida conocido.
              </p>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {earthSystems.map(renderEarthSystemCard)}
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
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent"
                style={gradientAnimationStyle}
              >
                ¿Fascinado por el cosmos?
              </span>
            </h2>
            
            <p className={`text-lg sm:text-xl mb-12 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              El universo es el libro más grande jamás escrito. 
              Cada estrella es una letra, cada galaxia un párrafo, y el sistema solar...
              el capítulo más extraordinario de todos.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
              <a
                href="mailto:cosmos@universo.com"
                className={`group px-6 py-4 md:px-8 rounded-xl transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' 
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 border-gray-800/50 hover:border-blue-500/30 focus:ring-offset-gray-900' 
                  : 'bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border-gray-200/50 hover:border-blue-500/40 focus:ring-offset-white'}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => handleKeyDown(e)}
              >
                <span className="flex items-center text-lg font-semibold">
                  <CubeIcon className="h-5 w-5 mr-3" />
                  Explorar el Cosmos
                </span>
              </a>
              
              <a
                href="https://nasa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className={`group px-6 py-4 md:px-8 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' 
                  ? 'border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/10 focus:ring-offset-gray-900' 
                  : 'border-blue-500/40 hover:border-blue-500/60 hover:bg-blue-500/10 focus:ring-offset-white'}`}
                aria-label="Explorar la NASA - Se abrirá en una nueva pestaña"
              >
                <span className="flex items-center text-lg font-semibold">
                  <BeakerIcon className="h-5 w-5 mr-3" />
                  NASA - Ver en Vivo
                </span>
              </a>
            </div>
            
            <div className={`pt-8 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500" aria-hidden="true"></div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Sistema Solar 4.5B Años
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Precisión cósmica • Equilibrio perfecto • Vida por diseño
                  </p>
                </div>
                
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <p>© {new Date().getFullYear()} Observatorio Cósmico</p>
                  <p className="mt-1">Un planeta, un milagro</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes cosmicGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
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

export default CosmicSystemLanding;
