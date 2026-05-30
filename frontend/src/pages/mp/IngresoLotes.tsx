import { useState } from 'react';
import { Plus, Upload, CheckCircle, Clock, XCircle, AlertTriangle, Paperclip, Eye, X, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { lotesMP as initialLotes, type LoteMP } from '../../data/mockData';

const PRODUCTS = ['Leche cruda entera', 'Leche semidescremada', 'Cultivo láctico termofílico', 'Cultivo bifidus', 'Azúcar refinada', 'Fructosa', 'Pulpa de fresa', 'Pulpa de maracuyá', 'Pulpa de durazno', 'Envases PP 150ml', 'Envases PP 200ml'];
const PROVIDERS = ['Lácteos del Norte SAC', 'BioKultivos Peru SA', 'Azucares del Sur EIRL', 'Frutas Andinas SAC', 'Envases Modernos SA'];
const UNITS = ['L', 'kg', 'g', 'und', 'caja'];
const ZONAS = ['Zona A', 'Zona B', 'Zona C', 'Zona D'];

type Estado = 'Disponible' | 'En proceso' | 'Agotado' | 'Por vencer';

interface LoteExtended extends LoteMP {
  zona: string;
  documentos: { nombre: string; cargado: boolean }[];
}

const extendedLotes: LoteExtended[] = initialLotes.map((l, i) => ({
  ...l,
  zona: ZONAS[i % 4],
  documentos: [
    { nombre: 'Certificado de Calidad', cargado: i % 3 !== 2 },
    { nombre: 'Análisis Microbiológico', cargado: i % 2 === 0 },
    { nombre: 'Guía de Remisión', cargado: true },
  ],
}));

function genLote() {
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `LMP-${new Date().getFullYear()}-${seq}`;
}

const STATUS_CFG: Record<string, { bg: string; text: string; icon: React.ReactNode; dot: string }> = {
  Disponible: { bg: '#F0FDF4', text: '#15803D', icon: <CheckCircle size={11} />, dot: '#2ECC71' },
  'En proceso': { bg: '#EFF6FF', text: '#1D4ED8', icon: <Clock size={11} />, dot: '#3B82F6' },
  Agotado: { bg: '#FEF2F2', text: '#B91C1C', icon: <XCircle size={11} />, dot: '#E74C3C' },
  'Por vencer': { bg: '#FFFBEB', text: '#B45309', icon: <AlertTriangle size={11} />, dot: '#F1C40F' },
};

function StatusBadge({ estado }: { estado: string }) {
  const cfg = STATUS_CFG[estado] || STATUS_CFG['Disponible'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.text }}>
      {cfg.icon} {estado}
    </span>
  );
}

function ZonaBadge({ zona }: { zona: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    'Zona A': { bg: '#F0FDF4', text: '#15803D' },
    'Zona B': { bg: '#FFFBEB', text: '#92400E' },
    'Zona C': { bg: '#FFF7ED', text: '#C2410C' },
    'Zona D': { bg: '#F5F3FF', text: '#6D28D9' },
  };
  const c = colors[zona] || { bg: '#F1F5F9', text: '#475569' };
  return (
    <select
      defaultValue={zona}
      style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
      onClick={e => e.stopPropagation()}
    >
      {ZONAS.map(z => <option key={z}>{z}</option>)}
    </select>
  );
}

function DocumentosModal({ lote, onClose }: { lote: LoteExtended; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
        <div style={{ background: '#1E3A5F', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>Documentos de Recepción</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Lote: {lote.lote}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 12, color: '#7F8C8D', marginBottom: 12 }}>Producto: <strong style={{ color: '#2C3E50' }}>{lote.producto}</strong></div>
          <div className="space-y-3">
            {[
              { nombre: 'Certificado de Calidad del proveedor', icon: '📄' },
              { nombre: 'Análisis Microbiológico', icon: '🔬' },
              { nombre: 'Guía de remisión / Factura', icon: '📋' },
              { nombre: 'Otros documentos', icon: '📎' },
            ].map((doc, i) => {
              const cargado = lote.documentos[i]?.cargado ?? false;
              return (
                <div key={doc.nombre} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: cargado ? '#F0FDF4' : '#FEF9EE', border: `1px solid ${cargado ? '#BBF7D0' : '#FDE68A'}` }}>
                  <span style={{ fontSize: 18 }}>{doc.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#2C3E50' }}>{doc.nombre}</p>
                    <p style={{ fontSize: 11, color: '#7F8C8D' }}>
                      {cargado ? `Cargado el ${lote.fechaIngreso}` : 'Pendiente de carga'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: cargado ? '#15803D' : '#B45309' }}>
                      {cargado ? '✅ Cargado' : '⚠️ Pendiente'}
                    </span>
                    {cargado && (
                      <button style={{ fontSize: 11, color: '#1E3A5F', background: '#EFF6FF', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Ver</button>
                    )}
                    <button style={{ fontSize: 11, color: '#fff', background: '#1E3A5F', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Subir</button>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={onClose} style={{ marginTop: 16, width: '100%', background: '#F1F5F9', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600, color: '#7F8C8D', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function IngresoLotes() {
  const router = useRouter();
  const [lotes, setLotes] = useState<LoteExtended[]>(extendedLotes);
  const [showForm, setShowForm] = useState(false);
  const [docsModal, setDocsModal] = useState<LoteExtended | null>(null);
  const [form, setForm] = useState({
    producto: '', proveedor: '', fechaIngreso: new Date().toISOString().split('T')[0],
    cantidad: '', unidad: 'L', lote: genLote(), fechaVencimiento: '',
    nivel: 1 as 1|2|3, zona: 'Zona A',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: LoteExtended = {
      id: `L${Date.now()}`, lote: form.lote, producto: form.producto, proveedor: form.proveedor,
      fechaIngreso: form.fechaIngreso, cantidad: Number(form.cantidad), unidad: form.unidad,
      nivel: form.nivel, estado: 'Disponible', fechaVencimiento: form.fechaVencimiento,
      zona: form.zona,
      documentos: [{ nombre: 'Certificado de Calidad', cargado: false }, { nombre: 'Análisis Microbiológico', cargado: false }, { nombre: 'Guía de Remisión', cargado: false }],
    };
    setLotes(prev => [nuevo, ...prev]);
    setShowForm(false);
    setForm(p => ({ ...p, lote: genLote(), producto: '', cantidad: '' }));
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }} className="space-y-5">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1E3A5F' }}>Ingreso de Productos / Asignación de Lotes</h1>
          <p style={{ fontSize: 13, color: '#7F8C8D', marginTop: 2 }}>Almacén Materia Prima · Registro de ingresos</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => router.push('/mp/layout')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1.5px solid #7C3AED', color: '#7C3AED', background: '#F5F3FF', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            <Map size={14} /> Ver Layout
          </button>
          <button
            onClick={() => setShowForm(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1E3A5F', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif' }}
          >
            <Plus size={15} /> Nuevo Ingreso
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8ECF0', padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#2C3E50', marginBottom: 16 }}>Registrar Ingreso</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Fields */}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Producto *</label>
                <select required style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }} value={form.producto} onChange={e => setForm(p => ({ ...p, producto: e.target.value }))}>
                  <option value="">Seleccionar...</option>
                  {PRODUCTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proveedor *</label>
                <select required style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }} value={form.proveedor} onChange={e => setForm(p => ({ ...p, proveedor: e.target.value }))}>
                  <option value="">Seleccionar...</option>
                  {PROVIDERS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha de Ingreso *</label>
                <input type="date" required style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} value={form.fechaIngreso} onChange={e => setForm(p => ({ ...p, fechaIngreso: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cantidad *</label>
                  <input type="number" required min="0" style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} value={form.cantidad} onChange={e => setForm(p => ({ ...p, cantidad: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unidad</label>
                  <select style={{ border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 8px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }} value={form.unidad} onChange={e => setForm(p => ({ ...p, unidad: e.target.value }))}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>N° de Lote</label>
                <input type="text" style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#1E3A5F', background: '#F8FAFC', fontFamily: 'monospace', boxSizing: 'border-box' }} value={form.lote} onChange={e => setForm(p => ({ ...p, lote: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha de Vencimiento *</label>
                <input type="date" required style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} value={form.fechaVencimiento} onChange={e => setForm(p => ({ ...p, fechaVencimiento: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Zona</label>
                <select style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }} value={form.zona} onChange={e => setForm(p => ({ ...p, zona: e.target.value }))}>
                  {ZONAS.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nivel</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([1, 2, 3] as const).map(n => (
                    <button key={n} type="button" onClick={() => setForm(p => ({ ...p, nivel: n }))}
                      style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', border: form.nivel === n ? 'none' : '1.5px solid #E2E8F0', background: form.nivel === n ? '#1E3A5F' : '#F8FAFC', color: form.nivel === n ? '#fff' : '#7F8C8D', transition: 'all 0.15s' }}>
                      Nv {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certificado de Calidad</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1.5px dashed #D1D9E0', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', fontSize: 13, color: '#7F8C8D', background: '#FAFBFC' }}>
                  <Upload size={13} /> Adjuntar PDF...
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', fontSize: 13, color: '#7F8C8D', border: '1.5px solid #E2E8F0', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancelar</button>
              <button type="submit" style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Registrar Ingreso</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8ECF0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50' }}>Últimos Ingresos</h2>
          <span style={{ fontSize: 11, color: '#B0BEC5' }}>{lotes.length} registro(s)</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ background: '#1E3A5F' }}>
                {['LOTE', 'PRODUCTO', 'PROVEEDOR', 'CANTIDAD', 'ZONA', 'NIVEL', 'VENCIMIENTO', 'DOCUMENTOS', 'ESTADO'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lotes.slice(0, 12).map((l, i) => {
                const docsOk = l.documentos.filter(d => d.cargado).length;
                return (
                  <tr key={l.id} style={{ borderBottom: '1px solid #F8FAFC', background: i % 2 ? '#FAFBFC' : '#fff', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#EFF6FF')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 ? '#FAFBFC' : '#fff')}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: '#1E3A5F', fontWeight: 600 }}>{l.lote}</td>
                    <td style={{ padding: '10px 14px', color: '#2C3E50', whiteSpace: 'nowrap' }}>{l.producto}</td>
                    <td style={{ padding: '10px 14px', color: '#7F8C8D', fontSize: 12, whiteSpace: 'nowrap', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.proveedor}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#2C3E50', whiteSpace: 'nowrap' }}>{l.cantidad.toLocaleString()} <span style={{ color: '#B0BEC5', fontWeight: 400 }}>{l.unidad}</span></td>
                    <td style={{ padding: '10px 14px' }}><ZonaBadge zona={(l as LoteExtended).zona} /></td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EFF6FF', color: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                        {l.nivel}
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#7F8C8D', fontSize: 12, whiteSpace: 'nowrap' }}>{l.fechaVencimiento}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => setDocsModal(l as LoteExtended)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: docsOk === 3 ? '#F0FDF4' : '#FFFBEB', color: docsOk === 3 ? '#15803D' : '#92400E', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                      >
                        <Paperclip size={11} /> {docsOk}/{l.documentos.length}
                      </button>
                    </td>
                    <td style={{ padding: '10px 14px' }}><StatusBadge estado={l.estado} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {docsModal && <DocumentosModal lote={docsModal} onClose={() => setDocsModal(null)} />}
    </div>
  );
}
