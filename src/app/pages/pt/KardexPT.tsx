import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Package, Filter } from 'lucide-react';
import { kardexPT, type MovTipo } from '../../data/mockData';

const PRODUCTOS = ['Todos', 'Yogurt natural', 'Yogurt de fresa', 'Yogurt de maracuyá', 'Yogurt de durazno'];

function MovBadge({ tipo }: { tipo: MovTipo }) {
  const cfg = {
    Entrada: 'bg-green-100 text-green-700',
    Salida: 'bg-red-100 text-red-600',
    Ajuste: 'bg-yellow-100 text-yellow-700',
  }[tipo];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg}`}>{tipo}</span>;
}

export default function KardexPT() {
  const [filtroProducto, setFiltroProducto] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | MovTipo>('Todos');

  const filtered = kardexPT.filter(k => {
    if (filtroProducto !== 'Todos' && k.producto !== filtroProducto) return false;
    if (filtroTipo !== 'Todos' && k.tipo !== filtroTipo) return false;
    return true;
  });

  const totalEntradas = kardexPT.filter(k => k.tipo === 'Entrada').reduce((s, k) => s + k.unidadesEntrada, 0);
  const totalSalidas = kardexPT.filter(k => k.tipo === 'Salida').reduce((s, k) => s + k.unidadesSalida, 0);
  const saldo = totalEntradas - totalSalidas;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1E3A5F]">Kardex – Producto Terminado</h1>
          <p className="text-sm text-gray-500 mt-0.5">Libro contable digital de movimientos de PT</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <Download size={15} /> Exportar
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Saldo actual PT', value: `${saldo.toLocaleString()} und`, icon: <Package size={18} />, color: '#1E3A5F', bg: '#EFF6FF' },
          { label: 'Entradas del mes', value: `+${totalEntradas.toLocaleString()} und`, icon: <TrendingUp size={18} />, color: '#2ECC71', bg: '#F0FDF4' },
          { label: 'Salidas del mes', value: `-${totalSalidas.toLocaleString()} und`, icon: <TrendingDown size={18} />, color: '#E74C3C', bg: '#FEF2F2' },
          { label: 'Clientes atendidos', value: '3', icon: <Package size={18} />, color: '#8B5CF6', bg: '#F5F3FF' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className="font-semibold text-sm mt-0.5" style={{ color: c.color }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <Filter size={15} className="text-gray-400" />
        <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={filtroProducto} onChange={e => setFiltroProducto(e.target.value)}>
          {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value as any)}>
          {['Todos', 'Entrada', 'Salida', 'Ajuste'].map(t => <option key={t}>{t}</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} registros</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1E3A5F] text-white">
                {['Fecha', 'Tipo', 'Lote PT', 'Producto', 'Presentación', 'Entrada', 'Salida', 'Saldo', 'Destino', 'Usuario'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((k, i) => (
                <tr key={k.id} className={`border-b border-gray-50 hover:bg-blue-50/20 ${i % 2 ? 'bg-gray-50/40' : 'bg-white'}`}>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{k.fecha}</td>
                  <td className="px-4 py-3"><MovBadge tipo={k.tipo} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-[#1E3A5F] font-medium whitespace-nowrap">{k.lote}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{k.producto}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{k.presentacion}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{k.unidadesEntrada > 0 ? `+${k.unidadesEntrada}` : '—'}</td>
                  <td className="px-4 py-3 text-red-500 font-medium">{k.unidadesSalida > 0 ? `-${k.unidadesSalida}` : '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{k.saldo}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{k.destino || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{k.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No se encontraron registros.</div>
        )}
      </div>
    </div>
  );
}
