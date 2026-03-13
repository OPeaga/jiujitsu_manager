import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTechniques, getTrainingCount, getBelt, incrementTraining } from '../api/index.js';

const BELT_LABELS = { branca:'Branca', azul:'Azul', roxo:'Roxo', marrom:'Marrom', preta:'Preta' };

/* Belt bar — thin horizontal bar with degree ticks */
function BeltBar({ belt, degree }) {
  const colors = {
    branca: 'bg-zinc-200 dark:bg-zinc-600 border border-zinc-400 dark:border-zinc-500',
    azul:   'bg-zinc-400 dark:bg-zinc-500',
    roxo:   'bg-zinc-500 dark:bg-zinc-400',
    marrom: 'bg-zinc-600 dark:bg-zinc-400',
    preta:  'bg-zinc-900 dark:bg-zinc-200',
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-20 rounded-sm ${colors[belt]}`} />
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full ${i <= degree ? 'bg-zinc-700 dark:bg-zinc-300' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
        ))}
      </div>
    </div>
  );
}

/* Stat card — minimal, outlined */
function StatCard({ label, value, sub, icon }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900 hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-base flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{value}</p>
          {sub && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [techniques,    setTechniques]    = useState([]);
  const [trainingCount, setTrainingCount] = useState(0);
  const [beltData,      setBeltData]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [registering,   setRegistering]   = useState(false);

  useEffect(() => {
    Promise.all([getTechniques(), getTrainingCount(), getBelt()])
      .then(([techs, training, belt]) => {
        setTechniques(techs);
        setTrainingCount(training.count);
        setBeltData(belt);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async () => {
    setRegistering(true);
    try { const r = await incrementTraining(); setTrainingCount(r.count); }
    catch (e) { console.error(e); }
    finally { setRegistering(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin" />
      </div>
    );
  }

  const learned  = techniques.filter(t => t.learned).length;
  const total    = techniques.length;
  const progress = total > 0 ? Math.round((learned / total) * 100) : 0;
  const current  = beltData?.current;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Visão geral do seu progresso</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Treinos" value={trainingCount} sub="sessões registradas" icon="○" />
        <StatCard label="Aprendidas" value={learned} sub={`de ${total} técnicas`} icon="✓" />
        <StatCard label="Total" value={total} sub="técnicas cadastradas" icon="≡" />
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900 hover:-translate-y-0.5 transition-transform">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Faixa Atual</p>
          {current
            ? <>
                <BeltBar belt={current.belt} degree={current.degree} />
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                  {BELT_LABELS[current.belt]} — {current.degree} grau{current.degree !== 1 ? 's' : ''}
                </p>
              </>
            : <p className="text-sm text-zinc-400 dark:text-zinc-500">—</p>
          }
        </div>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold">Progresso de aprendizado</span>
            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">{progress}%</span>
          </div>
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-800 dark:bg-zinc-200 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">{learned} de {total} técnicas dominadas</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleRegister}
          disabled={registering}
          className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-50"
        >
          {registering ? 'Registrando...' : '+ Registrar Treino'}
        </button>
        <Link to="/techniques" className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 text-sm font-semibold rounded hover:border-zinc-600 dark:hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
          Ver Técnicas
        </Link>
        <Link to="/belt" className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 text-sm font-semibold rounded hover:border-zinc-600 dark:hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
          Atualizar Faixa
        </Link>
      </div>
    </div>
  );
}
