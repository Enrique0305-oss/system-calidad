import { useState } from 'react';
import { Plus, CheckCircle, Clock, XCircle, Link } from 'lucide-react';
import { lotesPT as initialLotes, type LotePT } from '../../data/mockData';

const PRODUCTOS = ['Yogurt natural', 'Yogurt de fresa', 'Yogurt de maracuyá', 'Yogurt de durazno', 'Yogurt griego', 'Yogurt light'];
const PRESENTACIONES = ['150ml', '200ml', '500ml', '1L', '4L'];

function genLotePT() {
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `LPT-${new Date().getFullYear()}-${seq}`;
}

function StatusBadge({ estado }: { estado: LotePT['estado'] }) {
  const cfg = {
    Disponible: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={11} /> },
    'En proceso': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock size={11} /> },
    Agotado: { bg: 'bg-red-100', text: 'text-red-600', icon: <XCircle size={11} /> },
  }[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.icon} {estado}
    </span>
  );
}

function NivelBadge({ nivel }: { nivel: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-bold">{nivel}</span>
  );
}

export default function IngresoLotesPT() {
  const [lotes, setLotes] = useState<LotePT[]>(initialLotes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    producto: '', presentacion: '200ml', lote: genLotePT(),
    fechaProduccion: new Date().toISOString().split('T')[0],
    fechaVencimiento: '', cantidad: '', nivel: 1 as 1 | 2 | 3,
    loteOrigenProceso: 'PROC-2026-016',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: LotePT = {
      id: `PT${Date.now()}`, lote: form.lote, producto: form.producto,
      presentacion: form.presentacion, fechaProduccion: form.fechaProduccion,
      fechaVencimiento: form.fechaVencimiento, cantidad: Number(form.cantidad),
      nivel: form.nivel, estado: 'Disponible', loteOrigenProceso: form.loteOrigenProceso,
    };
    setLotes(prev => [nuevo, ...prev]);
    setShowForm(false);
    setForm(p => ({ ...p, lote: genLotePT(), producto: '', cantidad: '' }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1E3A5F]">Ingreso de PT / Asignación de Lotes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Almacén Producto Terminado · Registro con trazabilidad desde proceso</p>
        </div>
        <button onClick={() => setShowForm(p => !p)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:bg-[#16304f] transition-colors text-sm font-medium">
          <Plus size={16} /> Nuevo Ingreso PT
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total unidades', value: lotes.reduce((s, l) => s + l.cantidad, 0).toLocaleString(), color: '#1E3A5F' },
          { label: 'Lotes disponibles', value: String(lotes.filter(l => l.estado === 'Disponible').length), color: '#2ECC71' },
          { label: 'En proceso', value: String(lotes.filter(l => l.estado === 'En proceso').length), color: '#3B82F6' },
          { label: 'Agotados', value: String(lotes.filter(l => l.estado === 'Agotado').length), color: '#E74C3C' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm text-center">
            <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Registrar Ingreso de Producto Terminado</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre del producto *</label>
              <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.producto} onChange={e => setForm(p => ({ ...p, producto: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Presentación</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.presentacion} onChange={e => setForm(p => ({ ...p, presentacion: e.target.value }))}>
                {PRESENTACIONES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Lote PT (autogenerado)</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.lote} onChange={e => setForm(p => ({ ...p, lote: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de producción</label>
              <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.fechaProduccion} onChange={e => setForm(p => ({ ...p, fechaProduccion: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de vencimiento *</label>
              <input type="date" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.fechaVencimiento} onChange={e => setForm(p => ({ ...p, fechaVencimiento: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad de unidades *</label>
              <input type="number" required min="1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.cantidad} onChange={e => setForm(p => ({ ...p, cantidad: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nivel de almacén</label>
              <div className="flex gap-2">
                {([1, 2, 3] as const).map(n => (
                  <button key={n} type="button" onClick={() => setForm(p => ({ ...p, nivel: n }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.nivel === n ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'border-gray-200 text-gray-500 hover:border-[#1E3A5F]/30'}`}>
                    Nivel {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Link size={11} /> Lote proceso origen</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.loteOrigenProceso} onChange={e => setForm(p => ({ ...p, loteOrigenProceso: e.target.value }))} />
              <p className="text-[10px] text-blue-500 mt-0.5">✓ Vinculado desde Paso 8-9 del proceso</p>
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium bg-[#1E3A5F] text-white rounded-lg hover:bg-[#16304f]">Registrar Ingreso PT</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">Lotes de Producto Terminado</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Lote PT', 'Producto', 'Presentación', 'Producción', 'Vencimiento', 'Cantidad', 'Nivel', 'Proceso Origen', 'Estado'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lotes.map((l, i) => (
                <tr key={l.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#1E3A5F]">{l.lote}</td>
                  <td className="px-4 py-3 text-gray-700">{l.producto}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{l.presentacion}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{l.fechaProduccion}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{l.fechaVencimiento}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">{l.cantidad.toLocaleString()} und</td>
                  <td className="px-4 py-3"><NivelBadge nivel={l.nivel} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{l.loteOrigenProceso}</td>
                  <td className="px-4 py-3"><StatusBadge estado={l.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
