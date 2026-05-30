import { useState } from 'react';
import { Plus, X, ChevronRight, Clock, CheckCircle, Truck, Archive, FileText } from 'lucide-react';
import { ordenesCompra as initialOC, type OrdenCompra, type OCEstado } from '../../data/mockData';

const ESTADO_CONFIG: Record<OCEstado, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Borrador: { color: 'text-gray-600', bg: 'bg-gray-100', icon: <FileText size={11} />, label: 'Borrador' },
  Enviada: { color: 'text-blue-700', bg: 'bg-blue-100', icon: <Clock size={11} />, label: 'Enviada' },
  Aprobada: { color: 'text-purple-700', bg: 'bg-purple-100', icon: <CheckCircle size={11} />, label: 'Aprobada' },
  Recibida: { color: 'text-green-700', bg: 'bg-green-100', icon: <Truck size={11} />, label: 'Recibida' },
  Cerrada: { color: 'text-gray-500', bg: 'bg-gray-50', icon: <Archive size={11} />, label: 'Cerrada' },
};

const ESTADOS: OCEstado[] = ['Borrador', 'Enviada', 'Aprobada', 'Recibida', 'Cerrada'];

function OCBadge({ estado }: { estado: OCEstado }) {
  const cfg = ESTADO_CONFIG[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function Timeline({ estado }: { estado: OCEstado }) {
  const idx = ESTADOS.indexOf(estado);
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {ESTADOS.map((e, i) => {
        const done = i <= idx;
        const current = i === idx;
        const cfg = ESTADO_CONFIG[e];
        return (
          <div key={e} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 min-w-[60px]`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs transition-all ${
                done ? `${cfg.bg} ${cfg.color} border-current` : 'border-gray-200 text-gray-300'
              } ${current ? 'ring-2 ring-offset-1 ring-blue-300' : ''}`}>
                {done ? <CheckCircle size={12} /> : <span className="text-[9px]">{i+1}</span>}
              </div>
              <span className={`text-[9px] font-medium ${done ? cfg.color : 'text-gray-300'}`}>{e}</span>
            </div>
            {i < ESTADOS.length - 1 && (
              <div className={`w-6 h-0.5 mb-3 ${i < idx ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrdenesCompra() {
  const [ocs, setOcs] = useState<OrdenCompra[]>(initialOC);
  const [selected, setSelected] = useState<OrdenCompra | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [filterEstado, setFilterEstado] = useState<OCEstado | 'Todos'>('Todos');

  const filtered = ocs.filter(o => filterEstado === 'Todos' || o.estado === filterEstado);

  const nextEstado = (oc: OrdenCompra): OCEstado | null => {
    const idx = ESTADOS.indexOf(oc.estado);
    return idx < ESTADOS.length - 1 ? ESTADOS[idx + 1] : null;
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1E3A5F]">Órdenes de Compra</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ocs.length} órdenes en total</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:bg-[#16304f] transition-colors text-sm font-medium">
          <Plus size={16} /> Nueva OC
        </button>
      </div>

      {/* Estado filter pills */}
      <div className="flex flex-wrap gap-2">
        {(['Todos', ...ESTADOS] as const).map(e => (
          <button
            key={e}
            onClick={() => setFilterEstado(e)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterEstado === e ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {e} {e !== 'Todos' && <span className="ml-1 opacity-60">{ocs.filter(o => o.estado === e).length}</span>}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(oc => (
          <div
            key={oc.id}
            onClick={() => setSelected(s => s?.id === oc.id ? null : oc)}
            className={`bg-white rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all ${selected?.id === oc.id ? 'border-[#1E3A5F] ring-1 ring-[#1E3A5F]/20' : 'border-gray-200'}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-semibold text-[#1E3A5F]">{oc.numero}</span>
                <OCBadge estado={oc.estado} />
              </div>
              <p className="text-sm font-medium text-gray-700">{oc.proveedor}</p>
              <p className="text-xs text-gray-400 mt-0.5">{oc.productos.map(p => p.nombre).join(', ')}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">Requerida: <span className="font-medium text-gray-600">{oc.fechaRequerida}</span></span>
                <span className="text-sm font-semibold text-[#1E3A5F]">S/ {oc.total.toLocaleString()}</span>
              </div>
            </div>

            {selected?.id === oc.id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                <Timeline estado={oc.estado} />
                <div className="space-y-1">
                  {oc.productos.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                      <span className="text-gray-600">{p.nombre}</span>
                      <span className="font-medium text-gray-700">{p.cantidad.toLocaleString()} {p.unidad} × S/{p.precioUnit} = <span className="text-[#1E3A5F]">S/{(p.cantidad * p.precioUnit).toLocaleString()}</span></span>
                    </div>
                  ))}
                </div>
                {oc.observaciones && <p className="text-xs text-gray-400 italic">📝 {oc.observaciones}</p>}
                {nextEstado(oc) && (
                  <button
                    onClick={e => { e.stopPropagation(); setOcs(prev => prev.map(o => o.id === oc.id ? { ...o, estado: nextEstado(oc)! } : o)); setSelected(s => s?.id === oc.id ? { ...oc, estado: nextEstado(oc)! } : s); }}
                    className="w-full py-2 text-xs font-medium bg-[#1E3A5F] text-white rounded-lg hover:bg-[#16304f] transition-colors flex items-center justify-center gap-1"
                  >
                    Avanzar a: {nextEstado(oc)} <ChevronRight size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New OC Modal (simplified) */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Nueva Orden de Compra</h2>
              <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {['Proveedor', 'Producto(s)', 'Cantidad', 'Fecha requerida', 'Aprobador', 'Observaciones'].map(f => (
                <div key={f}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{f}</label>
                  {f === 'Observaciones' ? (
                    <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" rows={2} />
                  ) : f === 'Fecha requerida' ? (
                    <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" />
                  ) : (
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button
                onClick={() => {
                  const nueva: OrdenCompra = {
                    id: `OC${Date.now()}`, numero: `OC-2026-00${ocs.length + 1}`,
                    proveedor: 'Por definir', productos: [{ nombre: 'Por definir', cantidad: 0, unidad: 'und', precioUnit: 0 }],
                    estado: 'Borrador', fechaCreacion: new Date().toISOString().split('T')[0],
                    fechaRequerida: '', aprobador: '', observaciones: '', total: 0,
                  };
                  setOcs(prev => [nueva, ...prev]);
                  setShowNew(false);
                }}
                className="flex-1 py-2 text-sm font-medium bg-[#1E3A5F] text-white rounded-lg hover:bg-[#16304f]"
              >
                Crear como Borrador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
