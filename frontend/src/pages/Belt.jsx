import { useState, useEffect } from 'react';
import { getBelt, addBelt } from '../api/index.js';

const BELTS  = ['branca','azul','roxo','marrom','preta'];
const LABELS = { branca:'Branca', azul:'Azul', roxo:'Roxo', marrom:'Marrom', preta:'Preta' };

const fmt = d => new Date(d).toLocaleDateString('pt-BR', {day:'2-digit', month:'short', year:'numeric'});
const grauLabel = d => d === 0 ? 'sem grau' : d === 1 ? '1 grau' : `${d} graus`;

function BeltBar({ belt, degree }) {
  const beltCls = {
    branca: 'bg-zinc-200 dark:bg-zinc-600 border border-zinc-400',
    azul:   'bg-zinc-400 dark:bg-zinc-500',
    roxo:   'bg-zinc-500 dark:bg-zinc-400',
    marrom: 'bg-zinc-600 dark:bg-zinc-400',
    preta:  'bg-zinc-900 dark:bg-zinc-200',
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-16 rounded-sm flex-shrink-0 ${beltCls[belt]}`} />
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full ${i <= degree ? 'bg-zinc-700 dark:bg-zinc-300' : 'bg-zinc-200 dark:bg-zinc-700'}`} />
        ))}
      </div>
    </div>
  );
}

const inputCls = "px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-zinc-900 dark:text-zinc-100 transition-colors w-full";
const labelCls = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1";

export default function Belt() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [form,    setForm]    = useState({ belt:'branca', degree:0 });

  useEffect(() => {
    getBelt().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  const submit = async e => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      await addBelt(form.belt, parseInt(form.degree));
      const updated = await getBelt();
      setData(updated);
      setSuccess(`Faixa atualizada: ${LABELS[form.belt]} — ${grauLabel(form.degree)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar.');
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-7 h-7 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin" />
      </div>
    );
  }

  const current = data?.current;
  const history = data?.history || [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Faixa & Evolução</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Registre sua progressão na arte suave</p>
      </div>

      {/* Current belt */}
      {current && (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900 mb-6">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Faixa Atual</p>
          <div className="flex items-center gap-4">
            <BeltBar belt={current.belt} degree={current.degree} />
            <div>
              <p className="font-bold">{LABELS[current.belt]}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {grauLabel(current.degree)} · {fmt(current.updated_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900 mb-8">
        <p className="text-sm font-bold mb-4">Registrar Evolução</p>

        {error   && <p className="text-xs text-red-500 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded px-3 py-2 mb-4">{error}</p>}
        {success && <p className="text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2 mb-4">✓ {success}</p>}

        <form onSubmit={submit} className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-36">
            <label className={labelCls}>Faixa</label>
            <select className={inputCls} value={form.belt} onChange={e => setForm(f => ({...f, belt: e.target.value}))}>
              {BELTS.map(b => <option key={b} value={b}>{LABELS[b]}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-28">
            <label className={labelCls}>Grau (0–4)</label>
            <select className={inputCls} value={form.degree} onChange={e => setForm(f => ({...f, degree: parseInt(e.target.value)}))}>
              {[0,1,2,3,4].map(d => <option key={d} value={d}>{grauLabel(d)}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving}
            className="px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 transition-colors">
            {saving ? 'Salvando...' : 'Registrar'}
          </button>
        </form>
      </div>

      {/* History */}
      <div>
        <p className="text-sm font-bold mb-4">Histórico Completo</p>
        {history.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
            <p className="font-medium">Sem histórico ainda</p>
            <p className="text-xs mt-1">Registre sua faixa acima para começar.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry, idx) => (
              <div key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  idx === 0
                    ? 'border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800'
                    : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}>
                <BeltBar belt={entry.belt} degree={entry.degree} />
                <p className="text-sm font-semibold flex-1">
                  {LABELS[entry.belt]} — {grauLabel(entry.degree)}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">{fmt(entry.updated_at)}</p>
                {idx === 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 border border-zinc-400 dark:border-zinc-500 rounded text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
                    Atual
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
