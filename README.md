Coral Architecture - Hybrid Ecosystem Landing Page

Inspired by marine biology

https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white

An immersive, visually stunning landing page that presents a technology stack as a living coral reef ecosystem. Built with React, TypeScript, and Tailwind CSS, this project showcases a hybrid architecture where backend, frontend, mobile, and desktop applications coexist in symbiotic harmony.

🌊 Live Demo

[Add your deployment link here]

🎯 Features

Interactive Ecosystem Visualization

· Dynamic Particle System: Canvas-based animated particles that simulate underwater marine life
· Theme Switching: Seamless dark/light mode transitions with gradient adaptations
· Reduced Motion Support: Respects user preferences for accessibility
· Depth Indicators: Visual depth cues for immersive experience

Technology Stack Presentation

· Organism Cards: Four main technology components presented as reef organisms
  · Backend (Coral) - Python, FastAPI, SQLModel
  · Frontend (Polyp) - React, TypeScript, Zustand
  · Desktop (Anemone) - CustomTkinter, EXE, Server
  · Mobile (Jellyfish) - Java, WebView, APK
· Symbiotic Relationships: Shows how technologies interact and complement each other
· Production Biomes: Desktop and mobile environments as self-contained ecosystems

Technical Highlights

· TypeScript: Full type safety and developer experience
· Responsive Design: Mobile-first approach with adaptive layouts
· Accessibility: ARIA labels, keyboard navigation, focus management
· Performance: Optimized animations with canvas rendering
· Modern React: Functional components with hooks and custom callbacks

🏗️ Architecture

Core Technologies

```
Frontend: React 18 + TypeScript + Tailwind CSS
Backend: Python + FastAPI + SQLModel
Desktop: CustomTkinter + Embedded Server
Mobile: Java + WebView + APK
```

Key Dependencies

· @heroicons/react: Icon library for UI elements
· Type-safe navigation and state management
· Canvas API for particle animations
· Intersection Observer for scroll tracking

📂 Project Structure

```
src/
├── components/
│   ├── HybridEcosystemLanding.tsx  # Main component
│   ├── particles/                  # Canvas particle system
│   └── organisms/                  # Technology cards
├── types/
│   └── ecosystem.ts               # TypeScript interfaces
├── styles/
│   └── animations.css             # Custom animations
└── hooks/
    └── useTheme.ts               # Theme management
```

🚀 Getting Started

Prerequisites

· Node.js 16+ and npm/yarn
· TypeScript 4.9+
· React 18+

Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/coral-architecture.git
cd coral-architecture
```

1. Install dependencies:

```bash
npm install
# or
yarn install
```

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

1. Open http://localhost:3000 in your browser.

Build for Production

```bash
npm run build
npm run start
```

🎨 Design Philosophy

Coral Reef Metaphor

· Backend as Coral: Solid, porous foundation supporting the ecosystem
· Frontend as Polyps: Reactive interfaces interacting with the environment
· Desktop as Anemones: Stable bases with functional tentacles
· Mobile as Jellyfish: Mobile networks with internal connections

Visual Design System

· Color Palette: Cyan/blue gradients for water, emerald/green for life
· Typography: Clean, readable fonts with gradient text effects
· Spacing: Consistent spacing system following Tailwind defaults
· Transitions: Smooth animations mimicking underwater movement

🔧 Customization

Modifying Technologies

Edit the organisms array in the main component to update your tech stack:

```typescript
const organisms: Organism[] = [
  {
    id: 1,
    icon: ServerStackIcon,
    title: 'Your Backend Tech',
    description: 'Your description here',
    tech: ['Your', 'Technologies'],
    color: {
      from: 'from-cyan-500/20',
      to: 'to-blue-500/20',
      border: 'border-cyan-500/30'
    }
  },
  // Add more organisms...
];
```

Theme Customization

Adjust colors in the theme object:

```typescript
const themeClasses = {
  dark: 'from-gray-950 via-slate-900 to-gray-950',
  light: 'from-cyan-50 via-blue-50 to-gray-100'
};
```

📱 Responsive Design

The landing page is fully responsive across all device sizes:

· Mobile: Single column layout, simplified animations
· Tablet: Two-column organism grids, adjusted particle count
· Desktop: Full multi-column layouts, complex animations
· 4K+: Enhanced visual effects, increased particle density

♿ Accessibility Features

· Semantic HTML structure with proper ARIA labels
· Keyboard navigation support
· Reduced motion preferences respected
· Sufficient color contrast ratios
· Focus indicators for interactive elements

🧪 Performance Optimizations

· Canvas-based animations for smooth performance
· Debounced resize handlers
· Optimized re-renders with React.memo and useCallback
· Lazy loading for off-screen content
· CSS will-change hints for animations

🤝 Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature/amazing-feature
3. Commit changes: git commit -m 'Add amazing feature'
4. Push to branch: git push origin feature/amazing-feature
5. Open a Pull Request

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

🌟 Acknowledgments

· Inspired by marine biology and ecosystem design patterns
· Icons provided by Heroicons
· Gradient animations inspired by modern web design trends
· Thanks to the React and Tailwind CSS communities

📬 Contact

Giovani Fouz - @fouzstack

Project Link: https://github.com/fouzstack/giovani-fouz

---

Made with ❤️ and lots of ☕ by [Giovani]

---

Tags: react typescript tailwindcss portfolio developer fullstack architecture ui-design animation canvas
