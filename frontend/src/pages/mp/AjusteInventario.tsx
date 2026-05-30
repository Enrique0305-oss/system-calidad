import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Clock, AlertTriangle, Filter } from 'lucide-react';
import { ajustes as initialAjustes, lotesMP, type AjusteInventario } from '../../data/mockData';

const MOTIVOS = ['Merma', 'Error de conteo', 'Daño', 'Vencimiento', 'Otro'];

function StatusBadge({ estado }: { estado: AjusteInventario['estado'] }) {
  const cfg = {
    Pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={11} /> },
    Aprobado: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={11} /> },
    Rechazado: { bg: 'bg-red-100', text: 'text-red-600', icon: <XCircle size={11} /> },
  }[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.icon} {estado}
    </span>
  );
}

export default function AjusteInventario() {
  const [ajustes, setAjustes] = useState<AjusteInventario[]>(initialAjustes);
  const [showForm, setShowForm] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string>('Todos');
  const [form, setForm] = useState({ lote: '', producto: '', cantidadSistema: 0, cantidadReal: '', motivo: 'Merma', observacion: '' });
  const [confirmStep, setConfirmStep] = useState(false);

  const selectedLote = lotesMP.find(l => l.lote === form.lote);

  const handleLoteChange = (loteId: string) => {
    const lote = lotesMP.find(l => l.lote === loteId);
    setForm(p => ({ ...p, lote: loteId, producto: lote?.producto || '', cantidadSistema: lote?.cantidad || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmStep) { setConfirmStep(true); return; }
    const real = Number(form.cantidadReal);
    const nuevo: AjusteInventario = {
      id: `AJ${Date.now()}`, fecha: new Date().toLocaleString('es-PE'),
      producto: form.producto, lote: form.lote,
      cantidadSistema: form.cantidadSistema, cantidadReal: real,
      diferencia: real - form.cantidadSistema,
      motivo: form.motivo, observacion: form.observacion,
      usuario: 'Ing. García', estado: 'Pendiente',
    };
    setAjustes(prev => [nuevo, ...prev]);
    setShowForm(false);
    setConfirmStep(false);
    setForm({ lote: '', producto: '', cantidadSistema: 0, cantidadReal: '', motivo: 'Merma', observacion: '' });
  };

  const filtered = ajustes.filter(a => filterEstado === 'Todos' || a.estado === filterEstado);

  const handleApprove = (id: string, action: 'Aprobado' | 'Rechazado') => {
    setAjustes(prev => prev.map(a => a.id === id ? { ...a, estado: action } : a));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1E3A5F]">Ajuste de Inventario</h1>
          <p className="text-sm text-gray-500 mt-0.5">Requiere aprobación del supervisor</p>
        </div>
        <button onClick={() => { setShowForm(p => !p); setConfirmStep(false); }} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:bg-[#16304f] transition-colors text-sm font-medium">
          <AlertTriangle size={15} /> Registrar Ajuste
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Nuevo Ajuste de Inventario</h2>
          {!confirmStep ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Seleccionar Lote *</label>
                  <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.lote} onChange={e => handleLoteChange(e.target.value)}>
                    <option value="">Seleccionar lote...</option>
                    {lotesMP.filter(l => l.estado !== 'Agotado').map(l => (
                      <option key={l.id} value={l.lote}>{l.lote} – {l.producto}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Producto</label>
                  <input readOnly className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500" value={form.producto || '—'} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad en sistema</label>
                  <input readOnly className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500 font-mono" value={`${form.cantidadSistema} ${selectedLote?.unidad || ''}`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad real *</label>
                  <div className="flex gap-2">
                    <input type="number" required min="0" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.cantidadReal} onChange={e => setForm(p => ({ ...p, cantidadReal: e.target.value }))} placeholder="Ingrese cantidad real" />
                    <span className="flex items-center text-sm text-gray-400 px-1">{selectedLote?.unidad || ''}</span>
                  </div>
                  {form.cantidadReal !== '' && (
                    <p className={`text-xs mt-1 font-medium ${Number(form.cantidadReal) - form.cantidadSistema < 0 ? 'text-red-500' : 'text-green-600'}`}>
                      Diferencia: {Number(form.cantidadReal) - form.cantidadSistema > 0 ? '+' : ''}{(Number(form.cantidadReal) - form.cantidadSistema).toLocaleString()} {selectedLote?.unidad}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Motivo del ajuste *</label>
                  <select required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={form.motivo} onChange={e => setForm(p => ({ ...p, motivo: e.target.value }))}>
                    {MOTIVOS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Foto evidencia</label>
                  <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm text-gray-400">
                    <Upload size={14} /> Adjuntar imagen...
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Observación libre</label>
                  <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" rows={2} value={form.observacion} onChange={e => setForm(p => ({ ...p, observacion: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-[#1E3A5F] text-white rounded-lg hover:bg-[#16304f]">Continuar →</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800 text-sm">Confirmación requerida (doble validación)</p>
                  <p className="text-xs text-yellow-700 mt-1">Este ajuste quedará en estado <strong>Pendiente</strong> hasta que el supervisor lo apruebe.</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Lote:</span><span className="font-mono font-medium">{form.lote}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Producto:</span><span className="font-medium">{form.producto}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cant. sistema:</span><span>{form.cantidadSistema}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cant. real:</span><span className="font-semibold">{form.cantidadReal}</span></div>
                <div className="flex justify-between border-t pt-2"><span className="text-gray-500">Diferencia:</span><span className={`font-bold ${Number(form.cantidadReal) - form.cantidadSistema < 0 ? 'text-red-600' : 'text-green-600'}`}>{Number(form.cantidadReal) - form.cantidadSistema > 0 ? '+' : ''}{Number(form.cantidadReal) - form.cantidadSistema}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Motivo:</span><span>{form.motivo}</span></div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmStep(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">← Volver</button>
                <button onClick={handleSubmit as any} className="px-4 py-2 text-sm font-medium bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Confirmar y Enviar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historial */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <h2 className="font-semibold text-gray-800 text-sm flex-1">Historial de Ajustes</h2>
          <Filter size={14} className="text-gray-400" />
          <select className="border border-gray-200 rounded-lg px-2 py-1 text-xs" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            {['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Fecha', 'Producto', 'Lote', 'Cant. Sistema', 'Cant. Real', 'Diferencia', 'Motivo', 'Usuario', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{a.fecha}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{a.producto}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#1E3A5F]">{a.lote}</td>
                  <td className="px-4 py-3 text-gray-600">{a.cantidadSistema}</td>
                  <td className="px-4 py-3 font-medium">{a.cantidadReal}</td>
                  <td className={`px-4 py-3 font-semibold ${a.diferencia < 0 ? 'text-red-500' : 'text-green-600'}`}>{a.diferencia > 0 ? '+' : ''}{a.diferencia}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.motivo}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{a.usuario}</td>
                  <td className="px-4 py-3"><StatusBadge estado={a.estado} /></td>
                  <td className="px-4 py-3">
                    {a.estado === 'Pendiente' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleApprove(a.id, 'Aprobado')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Aprobar"><CheckCircle size={14} /></button>
                        <button onClick={() => handleApprove(a.id, 'Rechazado')} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Rechazar"><XCircle size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
