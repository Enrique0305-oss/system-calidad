import { useState } from 'react';
import { Plus, X, ChevronRight, ChevronDown, Clock, CheckCircle, Truck, Archive, FileText } from 'lucide-react';
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
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {ESTADOS.map((e, i) => {
        const done = i <= idx;
        const current = i === idx;
        const cfg = ESTADO_CONFIG[e];
        return (
          <div key={e} className="flex items-center">
            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs transition-all ${
                done ? `${cfg.bg} ${cfg.color} border-current` : 'border-gray-200 text-gray-300'
              } ${current ? 'ring-2 ring-offset-1 ring-blue-300' : ''}`}>
                {done ? <CheckCircle size={12} /> : <span className="text-[9px]">{i+1}</span>}
              </div>
              <span className={`text-[10px] font-medium ${done ? cfg.color : 'text-gray-400'}`}>{e}</span>
            </div>
            {i < ESTADOS.length - 1 && (
              <div className={`w-8 h-0.5 mb-4 ${i < idx ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrdenesCompra() {
  const [ocs, setOcs] = useState<OrdenCompra[]>(initialOC);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [filterEstado, setFilterEstado] = useState<OCEstado | 'Todos'>('Todos');

  const filtered = ocs.filter(o => filterEstado === 'Todos' || o.estado === filterEstado);

  const nextEstado = (oc: OrdenCompra): OCEstado | null => {
    const idx = ESTADOS.indexOf(oc.estado);
    return idx < ESTADOS.length - 1 ? ESTADOS[idx + 1] : null;
  };

  return (
    <div className="p-6 space-y-5">
      {/* Encabezado Principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1E3A5F]">Órdenes de Compra</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ocs.length} órdenes en total</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:bg-[#16304f] transition-colors text-sm font-medium">
          <Plus size={16} /> Nueva OC
        </button>
      </div>

      {/* Filtros por Estado */}
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

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="py-3 px-4 w-12 text-center"></th>
                <th className="py-3 px-4 w-32">N° Orden</th>
                <th className="py-3 px-4 w-48">Proveedor</th>
                <th className="py-3 px-4 w-64">Items / Productos</th>
                <th className="py-3 px-4 w-32">F. Requerida</th>
                <th className="py-3 px-4 w-32 text-right">Total</th>
                <th className="py-3 px-4 w-32 text-center">Estado</th>
              </tr>
            </thead>
            {filtered.map(oc => {
              const isExpanded = selectedId === oc.id;
              return (
                <tbody key={oc.id} className="border-b border-gray-100 last:border-0">
                  {/* Fila Base */}
                  <tr 
                    onClick={() => setSelectedId(isExpanded ? null : oc.id)}
                    className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/20' : ''}`}
                  >
                    <td className="py-4 px-4 text-center text-gray-400">
                      {isExpanded ? <ChevronDown size={16} className="text-[#1E3A5F]" /> : <ChevronRight size={16} />}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs font-bold text-[#1E3A5F]">{oc.numero}</td>
                    <td className="py-4 px-4 font-medium text-gray-800 truncate">{oc.proveedor}</td>
                    <td className="py-4 px-4 text-xs text-gray-500 truncate">
                      {oc.productos.map(p => p.nombre).join(', ')}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">{oc.fechaRequerida}</td>
                    <td className="py-4 px-4 text-right font-semibold text-[#1E3A5F] whitespace-nowrap">
                      S/ {oc.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <OCBadge estado={oc.estado} />
                    </td>
                  </tr>

                  {/* Fila Desplegable del Detalle */}
                  {isExpanded && (
                    <tr className="bg-gray-50/60">
                      <td colSpan={7} className="p-5 border-t border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          
                          {/* Izquierda: Progreso */}
                          <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-gray-200/70 shadow-sm flex flex-col justify-center items-center">
                            <p className="text-xs font-semibold text-gray-400 mb-3 self-start uppercase tracking-wider">Flujo de la Orden</p>
                            <Timeline estado={oc.estado} />
                          </div>

                          {/* Derecha: Desglose de Productos */}
                          <div className="lg:col-span-7 space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-gray-200/70 shadow-sm space-y-3">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Estructura de Costos / Productos</p>
                              <div className="divide-y divide-gray-100 max-h-[180px] overflow-y-auto">
                                {oc.productos.map((p, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs py-2.5 first:pt-0 last:pb-0">
                                    <span className="text-gray-700 font-medium">{p.nombre}</span>
                                    <span className="text-gray-500">
                                      {p.cantidad.toLocaleString()} {p.unidad} × S/{p.precioUnit} = <span className="text-[#1E3A5F] font-bold">S/{(p.cantidad * p.precioUnit).toLocaleString()}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {oc.observaciones && (
                                <div className="bg-amber-50/40 text-amber-800 text-xs p-2.5 rounded-lg border border-amber-100/50 italic mt-2">
                                  📝 Observaciones: {oc.observaciones}
                                </div>
                              )}
                            </div>

                            {/* Control de Flujo */}
                            {nextEstado(oc) && (
                              <div className="flex justify-end">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    setOcs(prev => prev.map(o => o.id === oc.id ? { ...o, estado: nextEstado(oc)! } : o));
                                  }}
                                  className="px-5 py-2 text-xs font-semibold bg-[#1E3A5F] text-white rounded-lg hover:bg-[#16304f] transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                  Avanzar Orden a: {nextEstado(oc)} <ChevronRight size={13} />
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>

      {/* Modal Nueva OC */}
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