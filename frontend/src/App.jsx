import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard  from './pages/Dashboard.jsx';
import Techniques from './pages/Techniques.jsx';
import Belt       from './pages/Belt.jsx';
import Docs       from './pages/Docs.jsx';

/* ── Monochrome SVG brand icon (outline only) ─────────────── */
function BJJIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      {/* Gi lapels */}
      <path d="M16 5 L9 11 L6 27 L16 22 L26 27 L23 11 Z" />
      <path d="M9 11 L16 17 L23 11" />
      <line x1="16" y1="17" x2="16" y2="22" />
      {/* Belt knot */}
      <line x1="8" y1="19" x2="24" y2="19" />
      <circle cx="16" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" className="w-4 h-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⊞', end: true },
  { to: '/techniques', label: 'Técnicas', icon: '≡' },
  { to: '/belt', label: 'Faixa', icon: '◎' },
  { to: '/docs', label: 'API Docs', icon: '⊙' },
];

function Navbar({ theme, toggle }) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-14 flex items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100">
            <BJJIcon />
            <span className="font-bold text-sm tracking-tight hidden sm:block">JiuJitsu Manager</span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded text-sm font-medium transition-colors hidden sm:flex items-center gap-1.5 ` +
                  (isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
            title={theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('jj-theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('jj-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        <Navbar theme={theme} toggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
        <main>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/belt"       element={<Belt />} />
            <Route path="/docs"       element={<Docs />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
