import { useState } from 'react';
import { Plus, Star, Phone, Mail, MapPin, CheckCircle, XCircle, Edit2, X } from 'lucide-react';
import { proveedores as initialProveedores, type Proveedor } from '../../data/mockData';

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={13}
          fill={s <= value ? '#F1C40F' : 'none'}
          stroke={s <= value ? '#F1C40F' : '#D1D5DB'}
          className={onChange ? 'cursor-pointer' : ''}
          onClick={() => onChange?.(s)}
        />
      ))}
    </div>
  );
}

const EMPTY_PROVEEDOR: Omit<Proveedor, 'id'> = {
  nombre: '', ruc: '', contacto: '', telefono: '', correo: '',
  productos: [], estado: 'Activo', calificacion: 3, direccion: '',
};

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores);
  const [showModal, setShowModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [form, setForm] = useState<Omit<Proveedor, 'id'>>(EMPTY_PROVEEDOR);
  const [productosInput, setProductosInput] = useState('');

  const handleOpenModal = (p?: Proveedor) => {
    if (p) { setForm({ ...p }); setProductosInput(p.productos.join(', ')); } 
    else { setForm(EMPTY_PROVEEDOR); setProductosInput(''); }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const prods = productosInput.split(',').map(s => s.trim()).filter(Boolean);
    const nuevo = { ...form, productos: prods };
    if (proveedores.find(p => p.id === (form as any).id)) {
      setProveedores(prev => prev.map(p => p.id === (form as any).id ? { ...nuevo, id: (form as any).id } : p));
    } else {
      setProveedores(prev => [...prev, { ...nuevo, id: `P${Date.now()}` }]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1E3A5F]">Proveedores</h1>
          <p className="text-sm text-gray-500 mt-0.5">{proveedores.filter(p => p.estado === 'Activo').length} activos · {proveedores.length} total</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2 rounded-lg hover:bg-[#16304f] transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Nuevo Proveedor
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {proveedores.map(p => (
          <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-all ${selectedProveedor?.id === p.id ? 'border-[#1E3A5F] ring-1 ring-[#1E3A5F]/20' : 'border-gray-200'}`} onClick={() => setSelectedProveedor(selected => selected?.id === p.id ? null : p)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 truncate">{p.nombre}</h3>
                  <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${p.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                    {p.estado === 'Activo' ? <CheckCircle size={10} /> : <XCircle size={10} />} {p.estado}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">RUC: {p.ruc}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); handleOpenModal(p); }} className="text-gray-300 hover:text-[#1E3A5F] transition-colors ml-2 flex-shrink-0">
                <Edit2 size={14} />
              </button>
            </div>

            <StarRating value={p.calificacion} />

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Phone size={12} className="flex-shrink-0 text-gray-400" />
                <span className="truncate">{p.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Mail size={12} className="flex-shrink-0 text-gray-400" />
                <span className="truncate text-xs">{p.correo}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={12} className="flex-shrink-0 text-gray-400" />
                <span className="truncate text-xs">{p.direccion}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1.5">Productos suministrados:</p>
              <div className="flex flex-wrap gap-1">
                {p.productos.map(prod => (
                  <span key={prod} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{prod}</span>
                ))}
              </div>
            </div>

            {/* Expanded profile */}
            {selectedProveedor?.id === p.id && (
              <div className="pt-3 border-t border-[#1E3A5F]/10 space-y-2 text-xs text-gray-500">
                <p className="font-semibold text-[#1E3A5F] text-sm">Historial reciente</p>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span>Última entrega</span><span className="font-medium text-gray-700">2026-04-22</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span>Órdenes activas</span><span className="font-medium text-gray-700">2</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span>Incidencias de calidad</span><span className="font-medium text-red-500">0</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Proveedor</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {[
                { label: 'Nombre *', key: 'nombre', type: 'text' },
                { label: 'RUC / NIT', key: 'ruc', type: 'text' },
                { label: 'Contacto', key: 'contacto', type: 'text' },
                { label: 'Teléfono', key: 'telefono', type: 'tel' },
                { label: 'Correo', key: 'correo', type: 'email' },
                { label: 'Dirección', key: 'direccion', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                  <input type={f.type} required={f.label.endsWith('*')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                    value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Productos (separar con comas)</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                  value={productosInput} onChange={e => setProductosInput(e.target.value)} placeholder="Ej: Leche cruda, Cultivo láctico" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as any }))}>
                    <option>Activo</option><option>Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Calificación</label>
                  <StarRating value={form.calificacion} onChange={v => setForm(p => ({ ...p, calificacion: v }))} />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-[#1E3A5F] text-white rounded-lg hover:bg-[#16304f]">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
