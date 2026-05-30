import { useState } from 'react';
import { Search, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Truck, RotateCcw, Download, PackageOpen } from 'lucide-react';
import { trazabilidadData, lotesPT } from '../../data/mockData';

const DELIVERY_STATUS_CFG = {
  'En tránsito': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Truck size={11} /> },
  Entregado: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={11} /> },
  Devuelto: { bg: 'bg-red-100', text: 'text-red-600', icon: <RotateCcw size={11} /> },
};

function TimelineStep({ paso, isLast }: { paso: typeof trazabilidadData.historialProceso[0]; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const color = paso.alerta ? '#F1C40F' : '#2ECC71';
  const bgColor = paso.alerta ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200';

  return (
    <div className="flex gap-3">
      {/* Left: line + dot */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 shadow-sm"
          style={{ borderColor: color, backgroundColor: `${color}20` }}>
          {paso.icono}
        </div>
        {!isLast && <div className="w-0.5 flex-1 my-1 min-h-[20px]" style={{ backgroundColor: `${color}40` }} />}
      </div>

      {/* Right: content */}
      <div className={`flex-1 mb-4 rounded-xl border p-3 cursor-pointer hover:shadow-sm transition-all ${bgColor}`} onClick={() => setOpen(p => !p)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Paso {paso.paso}</span>
              {paso.alerta && <span className="flex items-center gap-1 text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium"><AlertTriangle size={9} /> Observación</span>}
            </div>
            <p className="font-semibold text-gray-800 text-sm">{paso.nombre}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{paso.fecha}</p>
            <p className="text-xs text-gray-400">{paso.operador}</p>
          </div>
        </div>

        {open && (
          <div className="mt-3 pt-3 border-t border-current/10 grid grid-cols-1 gap-1">
            {paso.datos.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${paso.alerta && i === 0 ? 'bg-yellow-500' : 'bg-green-400'}`} />
                {d}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RastreoLote() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<typeof trazabilidadData | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = query.trim().toUpperCase();
    if (q === 'LPT-2026-001' || q === 'LPT2026001') {
      setResult(trazabilidadData);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[#1E3A5F] flex items-center gap-2">
          <Search size={20} /> Rastreo de Lote – Trazabilidad Completa
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Rastrea el origen y destino de cualquier lote de producto terminado</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 font-mono"
            placeholder="Ingrese N° de Lote PT (ej: LPT-2026-001)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="flex items-center justify-center gap-2 bg-[#1E3A5F] text-white px-6 py-3 rounded-xl hover:bg-[#16304f] transition-colors text-sm font-medium">
            <Search size={16} /> Rastrear
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">También puedes buscar por: fecha de producción, producto, o rango de vencimiento</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {lotesPT.map(l => (
            <button key={l.id} onClick={() => { setQuery(l.lote); }} className="text-xs px-2 py-1 bg-gray-100 hover:bg-[#1E3A5F]/10 text-gray-500 hover:text-[#1E3A5F] rounded-lg transition-colors font-mono">
              {l.lote}
            </button>
          ))}
        </div>
      </div>

      {/* No result */}
      {searched && !result && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <PackageOpen size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">Lote no encontrado</p>
          <p className="text-xs text-gray-400 mt-1">Prueba con <span className="font-mono">LPT-2026-001</span> para ver un ejemplo completo</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-5">
          {/* Lot Info Card */}
          <div className="bg-[#1E3A5F] rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Expediente del Lote</p>
              <h2 className="font-bold text-xl font-mono">{result.lote}</h2>
              <p className="text-white/70 text-sm mt-1">{result.producto} · {result.presentacion}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Producido', value: result.fechaProduccion },
                { label: 'Vence', value: result.fechaVencimiento },
                { label: 'Total unidades', value: `${result.cantidadTotal.toLocaleString()} und` },
                { label: 'Distribuidas', value: `${result.adelante.reduce((s, d) => s + d.cantidad, 0)} und` },
              ].map(i => (
                <div key={i.label} className="bg-white/10 rounded-xl px-3 py-2">
                  <p className="text-xs text-white/40">{i.label}</p>
                  <p className="font-semibold text-sm">{i.value}</p>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm transition-colors">
              <Download size={14} /> Exportar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Section A: Adelante */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <ArrowRight size={16} className="text-green-500" />
                <h3 className="font-semibold text-gray-800">¿A dónde fue?</h3>
                <span className="ml-auto text-xs text-gray-400">Trazabilidad hacia adelante</span>
              </div>
              <div className="p-5 space-y-3">
                {result.adelante.map((d, i) => {
                  const statusCfg = DELIVERY_STATUS_CFG[d.estado as keyof typeof DELIVERY_STATUS_CFG];
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Truck size={14} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-700 text-sm">{d.cliente}</p>
                        <p className="text-xs text-gray-400">Guía: <span className="font-mono">{d.guia}</span> · {d.fechaSalida}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{d.cantidad} unidades despachadas</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                        {statusCfg.icon} {d.estado}
                      </span>
                    </div>
                  );
                })}
                <div className="text-xs text-gray-400 pt-1">
                  Pendiente distribución: <span className="font-medium text-gray-600">{result.cantidadTotal - result.adelante.reduce((s, d) => s + d.cantidad, 0)} und</span>
                </div>
              </div>
            </div>

            {/* Section B: Atrás */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <ArrowLeft size={16} className="text-blue-500" />
                <h3 className="font-semibold text-gray-800">¿De dónde viene?</h3>
                <span className="ml-auto text-xs text-gray-400">Trazabilidad hacia atrás</span>
              </div>
              <div className="p-5 space-y-3">
                {result.atras.map((mp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-sm">🏭</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-blue-600 font-semibold">{mp.loteMp}</span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Nivel {mp.nivel}</span>
                      </div>
                      <p className="font-medium text-gray-700 text-sm mt-0.5">{mp.producto}</p>
                      <p className="text-xs text-gray-400">{mp.proveedor}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        <span>Ingreso: {mp.fechaIngreso}</span>
                        <span>Usado: <span className="font-medium text-gray-700">{mp.cantidadUsada}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section C: Process History */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="text-base">🔬</span>
              <h3 className="font-semibold text-gray-800">Historial del Proceso</h3>
              <span className="ml-auto text-xs text-gray-400">9 pasos · Haz clic para expandir</span>
            </div>
            <div className="p-5">
              {result.historialProceso.map((paso, i) => (
                <TimelineStep
                  key={paso.paso}
                  paso={paso}
                  isLast={i === result.historialProceso.length - 1}
                />
              ))}
            </div>

            <div className="mx-5 mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-2 text-xs text-yellow-700">
              <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
              <span><strong>Paso 6 – Cultivo:</strong> Se registró observación en tiempo de fermentación. pH dentro de rango aceptable (4.5). Sin impacto en calidad.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
