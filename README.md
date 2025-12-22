Landing Page - Giovani Fouz | Hybrid Systems Architect

inspirado en la vida marina.

Descripción del Proyecto

Landing page profesional para desarrollador full-stack especializado en arquitecturas híbridas (Desktop · Web · Mobile). La página refleja una filosofía de desarrollo basada en control explícito, trazabilidad completa y robustez de sistemas.

🚀 Características Técnicas

· Framework: React 19 con TypeScript
· Build Tool: Vite
· Estilos: Tailwind CSS con configuración moderna
· Iconografía: HeroIcons React
· Interactividad: Efectos hover, transiciones y scroll suave
· Responsive: Diseño adaptable a todos los dispositivos

📁 Estructura del Proyecto

```
src/
├── LandingPage.tsx     # Componente principal (un solo archivo)
├── App.tsx            # Punto de entrada principal
├── main.tsx           # Renderizado de la aplicación
├── index.css          # Estilos base (opcional)
└── assets/            # Recursos estáticos (imágenes, etc.)
```

🛠️ Dependencias Principales

Dependencias de producción:

```json
"@heroicons/react": "^2.2.0",
"react": "^19.1.1",
"react-router-dom": "^7.9.1",
"tailwindcss": "^4.1.13",
"tailwindcss-animated": "^2.0.0"
```

Dependencias de desarrollo:

```json
"@types/react": "^19.1.13",
"@types/react-dom": "^19.1.9",
"@vitejs/plugin-react": "^4.7.0",
"typescript": "^5.9.2",
"vite": "^6.3.6"
```

⚡ Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview

# Verificar linting
npm run lint

# Formatear código
npm run format
```

🌐 Despliegue

1. GitHub Pages (Gratuito)

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Añadir en package.json:
"homepage": "https://gfouz.github.io/repositorio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Desplegar:
npm run deploy
```

2. Vercel (Recomendado - Automático)

1. Conectar repositorio GitHub a Vercel
2. Configuración automática detectará Vite + React
3. Despliegue automático en cada push

3. Netlify

1. Arrastrar carpeta dist a Netlify
2. O conectar repositorio para CI/CD

🎨 Personalización

1. Cambiar información personal:

```jsx
// En LandingPage.jsx, actualizar:
- Enlaces de contacto (email, redes sociales)
- Texto de descripción personal
- Enlace específico de Uptodown
- Año de copyright dinámico
```

2. Modificar colores:

```jsx
// Cambiar gradientes principales:
bg-gradient-to-r from-slate-900 to-slate-800
// Por ejemplo:
bg-gradient-to-r from-gray-900 to-blue-900
```

3. Añadir secciones:

```jsx
// Insertar nueva sección antes de Contact & Footer
<section id="nueva-seccion" className="py-20 bg-white">
  {/* Contenido */}
</section>
```

📱 Secciones Implementadas

1. Navbar - Navegación responsive con links internos
2. Hero - Presentación principal con lema personal
3. Filosofía - Valores y anti-valores de desarrollo
4. Stack Tecnológico - Tecnologías organizadas por plataforma
5. Proyectos - Tipos de sistemas construidos
6. Uptodown - Sección específica para aplicación Android
7. Contacto - Información de contacto y redes

🎯 Optimizaciones Incluidas

· Lazy Loading: Preparado para imágenes y componentes
· SEO Básico: Estructura semántica HTML5
· Performance: Build optimizado con Vite
· Accesibilidad: Navegación por teclado, contraste adecuado
· PWA Ready: Configurable como Progressive Web App

🔧 Configuración de Tailwind CSS

```javascript
// tailwind.config.js (si existe)
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Personalizaciones aquí
    },
  },
  plugins: [],
}
```

📝 Notas para el Despliegue en Uptodown

1. Enlace a la página: Asegúrate de que el dominio/apodo sea profesional
2. Sección Uptodown: Actualiza el enlace real cuando tengas la app publicada
3. Política de privacidad: Considera añadir página /privacy para cumplir requisitos
4. Email de contacto: Esencial para que usuarios te contacten

🐛 Solución de Problemas Comunes

Problema: Estilos no se aplican

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

Problema: Build falla en GitHub Pages

```bash
# Verificar homepage en package.json
# Asegurar rutas relativas en vite.config.js
```

Problema: Iconos no aparecen

```bash
# Verificar instalación de HeroIcons
npm list @heroicons/react
```

📄 Licencia

Proyecto de código abierto. Puedes modificar y usar libremente.

🤝 Contribuciones

Actualmente no se aceptan contribuciones externas ya que es un portfolio personal.

📬 Contacto

· Desarrollador: Giovani Fouz
· Filosofía: "Si va a funcionar, debe funcionar completo, empaquetado y con logs."
· Especialización: Arquitecturas híbridas, sistemas offline-first, aplicaciones empaquetadas

---

Última actualización: $(date +%Y-%m-%d)
Versión del proyecto: 1.0.0
