import { useState, useEffect, useCallback } from 'react';
import { getTechniques, createTechnique, updateTechnique, deleteTechnique } from '../api/index.js';

function timeAgo(d) {
  const days = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 30) return `${days}d atrás`;
  if (days < 365) return `${Math.floor(days/30)}m atrás`;
  return `${Math.floor(days/365)}a atrás`;
}

const EMPTY = { name:'', japanese_name:'', image_url:'', video_url:'', notes:'', learned:false };

/* ── Shared input classes ──────────────────────────────────── */
const inputCls = "w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors";
const labelCls = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1";

function Modal({ tech, onSave, onClose }) {
  const [form, setForm] = useState(tech ? {...tech} : EMPTY);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = f => e => setForm(p => ({...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}));

  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Nome é obrigatório.'); return; }
    setSaving(true); setError('');
    try {
      const saved = tech?.id ? await updateTechnique(tech.id, form) : await createTechnique(form);
      onSave(saved);
    } catch { setError('Erro ao salvar. Verifique a conexão.'); }
    finally { setSaving(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-y-auto max-h-[90vh] animate-[fadeIn_.15s_ease]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-bold">{tech ? 'Editar Técnica' : 'Nova Técnica'}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="p-5 space-y-4">
            {error && <p className="text-xs text-red-500 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded px-3 py-2">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Nome *</label>
                <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Ex: Armlock" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Nome em Japonês</label>
                <input className={`${inputCls} font-[Noto_Sans_JP]`} value={form.japanese_name} onChange={set('japanese_name')} placeholder="腕がらみ (Ude Garami)" />
              </div>
              <div>
                <label className={labelCls}>URL da Imagem</label>
                <input className={inputCls} type="url" value={form.image_url} onChange={set('image_url')} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>URL do Vídeo</label>
                <input className={inputCls} type="url" value={form.video_url} onChange={set('video_url')} placeholder="https://youtube.com/..." />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Observações</label>
                <textarea className={inputCls} rows={3} value={form.notes} onChange={set('notes')} placeholder="Dicas, variações, detalhes..." />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={form.learned} onChange={set('learned')}
                    className="w-4 h-4 rounded border-zinc-400 text-zinc-800 focus:ring-zinc-400" />
                  <span className="text-sm font-medium">Já aprendi esta técnica</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-5 py-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 transition-colors">
              {saving ? 'Salvando...' : tech ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TechCard({ tech, onEdit, onDelete, onToggle }) {
  const [del_, setDel] = useState(false);
  const [tog_, setTog] = useState(false);

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">

      {/* Image */}
      {tech.image_url
        ? <img src={tech.image_url} alt={tech.name} className="w-full h-44 object-cover bg-zinc-100 dark:bg-zinc-800" onError={e=>{e.target.style.display='none';}} />
        : <div className="w-full h-44 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-zinc-300 dark:text-zinc-600">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          </div>
      }

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold leading-tight">{tech.name}</p>
            {tech.japanese_name && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-[Noto_Sans_JP]">{tech.japanese_name}</p>
            )}
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${
            tech.learned
              ? 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
          }`}>
            {tech.learned ? '✓ Aprendida' : '○ Pendente'}
          </span>
        </div>

        {/* Notes */}
        {tech.notes && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 flex-1">{tech.notes}</p>
        )}

        {/* Video link */}
        {tech.video_url && (
          <a href={tech.video_url} target="_blank" rel="noopener noreferrer"
            className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Ver vídeo
          </a>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">{timeAgo(tech.created_at)}</span>
          <div className="flex gap-1.5">
            {/* Toggle learned */}
            <button disabled={tog_}
              onClick={async()=>{setTog(true);await onToggle(tech).finally(()=>setTog(false));}}
              className="px-2.5 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded hover:border-zinc-500 dark:hover:border-zinc-400 transition-colors"
              title={tech.learned ? 'Desmarcar' : 'Marcar aprendida'}>
              {tog_ ? '…' : tech.learned ? '↩' : '✓'}
            </button>
            <button onClick={() => onEdit(tech)}
              className="px-2.5 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded hover:border-zinc-500 dark:hover:border-zinc-400 transition-colors">
              Editar
            </button>
            <button disabled={del_}
              onClick={async()=>{if(!confirm(`Remover "${tech.name}"?`))return;setDel(true);await onDelete(tech.id).finally(()=>setDel(false));}}
              className="px-2.5 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded hover:border-red-400 hover:text-red-500 transition-colors">
              {del_ ? '…' : 'Remover'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Techniques() {
  const [techniques, setTechniques] = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);

  const load = useCallback(async (f = filter) => {
    setLoading(true);
    const data = await getTechniques(f === 'all' ? null : f).catch(() => []);
    setTechniques(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(filter); }, [filter]);

  const handleSave = saved => {
    setTechniques(prev => {
      const i = prev.findIndex(t => t.id === saved.id);
      if (i >= 0) { const n=[...prev]; n[i]=saved; return n; }
      return [saved, ...prev];
    });
    setModal(false); setEditing(null);
  };

  const handleDelete = async id => {
    await deleteTechnique(id);
    setTechniques(p => p.filter(t => t.id !== id));
  };

  const handleToggle = async tech => {
    const updated = await updateTechnique(tech.id, { learned: !tech.learned });
    setTechniques(p => p.map(t => t.id === updated.id ? updated : t));
  };

  const filtered = techniques.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.japanese_name||'').toLowerCase().includes(search.toLowerCase())
  );

  const filters = [['all','Todas'],['learned','Aprendidas'],['not_learned','Pendentes']];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Técnicas</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{techniques.length} técnica{techniques.length !== 1 ? 's' : ''} cadastrada{techniques.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={()=>{setEditing(null);setModal(true);}}
          className="px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          + Nova Técnica
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 flex-wrap mb-6 items-center">
        <input
          className="px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 w-52 transition-colors"
          placeholder="Buscar técnicas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-1.5">
          {filters.map(([f, label]) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                filter === f
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 mx-auto mb-4 opacity-40">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
          </svg>
          <p className="font-semibold text-zinc-500 dark:text-zinc-400">Nenhuma técnica encontrada</p>
          <p className="text-sm mt-1">Clique em "+ Nova Técnica" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <TechCard key={t.id} tech={t}
              onEdit={t=>{setEditing(t);setModal(true);}}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {modal && <Modal tech={editing} onSave={handleSave} onClose={()=>{setModal(false);setEditing(null);}} />}
    </div>
  );
}
