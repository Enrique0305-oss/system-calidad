import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, MessageSquare, CheckSquare, Square, ChevronRight, Download, Plus } from 'lucide-react';
import processDiagram from '@/imports/Captura_de_pantalla_2026-04-27_195959.png';

type PasoEstado = 'Pendiente' | 'En curso' | 'Completado' | 'Alerta';

interface Campo { label: string; unidad: string; min?: number; max?: number }
interface PasoRegistro {
  campo1: number; campo2: number; campo3: number; campo4: number; campo5: number;
  observaciones: string; completado: boolean; fecha: string; operador: string;
}
interface PasoProceso {
  id: number; nombre: string; icono: string; descripcion: string;
  estado: PasoEstado; campos: Campo[]; registro?: PasoRegistro;
  hasDocumentos?: boolean; hasParametros?: boolean;
}

const PASOS: PasoProceso[] = [
  { id: 1, nombre: 'Almacén MP', icono: '🏭', descripcion: 'Gestión del inventario de materias primas: leche cruda, cultivos, azúcar, frutas e insumos.', estado: 'Completado',
    campos: [{ label: 'Stock disponible', unidad: 'L' }, { label: 'Temperatura almacén', unidad: '°C' }, { label: 'Lotes activos', unidad: '' }, { label: 'Capacidad usada', unidad: '%' }, { label: 'Alertas de vencimiento', unidad: '' }],
    registro: { campo1: 4300, campo2: 4.0, campo3: 7, campo4: 75, campo5: 1, observaciones: 'Stock normal. Un lote próximo a vencer.', completado: true, fecha: '2026-04-22 06:00', operador: 'Javier Ramos' },
  },
  { id: 2, nombre: 'Recepción', icono: '🥛', descripcion: 'Registro del ingreso de leche cruda desde el proveedor. Verificación de temperatura, densidad y acidez.', estado: 'Completado', hasDocumentos: true, hasParametros: true,
    campos: [{ label: 'Litros recibidos', unidad: 'L' }, { label: 'Temperatura de llegada', unidad: '°C', max: 8 }, { label: 'Densidad', unidad: 'g/ml' }, { label: 'Acidez inicial', unidad: '°D' }, { label: 'Cantidad rechazada', unidad: 'L' }],
    registro: { campo1: 2500, campo2: 6.5, campo3: 1.032, campo4: 16.5, campo5: 0, observaciones: 'Leche apta para procesamiento.', completado: true, fecha: '2026-04-22 07:30', operador: 'Javier Ramos' },
  },
  { id: 3, nombre: 'Pasteurización', icono: '🌡️', descripcion: 'Primer tratamiento térmico (HTST). Temperatura mínima 72°C por 15 segundos para eliminar patógenos.', estado: 'En curso',
    campos: [{ label: 'Litros procesados', unidad: 'L' }, { label: 'Temperatura proceso', unidad: '°C', min: 72 }, { label: 'Tiempo de exposición', unidad: 'seg', min: 15 }, { label: 'Litros aprobados', unidad: 'L' }, { label: 'Cantidad descartada', unidad: 'L' }],
  },
  { id: 4, nombre: 'Estand. Grasa', icono: '⚗️', descripcion: 'Estandarización del contenido de grasa mediante separación centrífuga para el tipo de yogurt a producir.', estado: 'Pendiente',
    campos: [{ label: 'Litros entrada', unidad: 'L' }, { label: 'Grasa objetivo', unidad: '%' }, { label: 'Tiempo centrifugado', unidad: 'min' }, { label: 'Litros resultantes', unidad: 'L' }, { label: 'Grasa separada', unidad: 'kg' }],
  },
  { id: 5, nombre: 'Estand. Mat. Seca', icono: '🧪', descripcion: 'Adición de leche en polvo o concentrado para ajustar el contenido de sólidos totales.', estado: 'Pendiente',
    campos: [{ label: 'Litros base', unidad: 'L' }, { label: 'Sólidos objetivo', unidad: '%', min: 11.5, max: 13 }, { label: 'Polvo agregado', unidad: 'kg' }, { label: 'Litros finales', unidad: 'L' }, { label: 'Descarte', unidad: 'kg' }],
  },
  { id: 6, nombre: 'Pasteurización 2', icono: '🔥', descripcion: 'Segunda pasteurización post-estandarización para asegurar la inocuidad de la mezcla final.', estado: 'Pendiente',
    campos: [{ label: 'Litros procesados', unidad: 'L' }, { label: 'Temperatura', unidad: '°C', min: 85 }, { label: 'Tiempo de retención', unidad: 'min' }, { label: 'Litros aprobados', unidad: 'L' }, { label: 'Descarte', unidad: 'L' }],
  },
  { id: 7, nombre: 'Homogeneización', icono: '🔄', descripcion: 'Reducción del tamaño de glóbulos de grasa para mejorar textura y evitar separación del producto.', estado: 'Pendiente',
    campos: [{ label: 'Litros entrada', unidad: 'L' }, { label: 'Presión', unidad: 'bar' }, { label: 'Temperatura', unidad: '°C' }, { label: 'Litros homogeneizados', unidad: 'L' }, { label: 'Pérdida proceso', unidad: 'L' }],
  },
  { id: 8, nombre: 'Fermentación', icono: '🧫', descripcion: 'Inoculación de bacterias lácticas termofílicas (S. thermophilus y L. bulgaricus) para iniciar la fermentación.', estado: 'Pendiente',
    campos: [{ label: 'Cultivo agregado', unidad: 'g' }, { label: 'Temperatura inoculación', unidad: '°C' }, { label: 'Litros inoculados', unidad: 'L' }, { label: 'pH post-inoculación', unidad: '' }, { label: 'Merma en inoculación', unidad: 'L' }],
  },
  { id: 9, nombre: 'Incubación', icono: '⏳', descripcion: 'Fermentación controlada en cámara de incubación hasta alcanzar pH objetivo de 4.5–4.6.', estado: 'Pendiente',
    campos: [{ label: 'Litros en incubación', unidad: 'L' }, { label: 'Temperatura incubación', unidad: '°C' }, { label: 'Tiempo de fermentación', unidad: 'h' }, { label: 'pH final', unidad: '', min: 4.5, max: 4.6 }, { label: 'Descarte por pH fuera de rango', unidad: 'L' }],
  },
  { id: 10, nombre: 'Enfriamiento', icono: '❄️', descripcion: 'Corte de la fermentación por reducción brusca de temperatura a 4–8°C para estabilizar el yogurt.', estado: 'Pendiente',
    campos: [{ label: 'Temperatura inicial', unidad: '°C' }, { label: 'Temperatura final', unidad: '°C', max: 8 }, { label: 'Tiempo de enfriamiento', unidad: 'min' }, { label: 'Litros enfriados', unidad: 'L' }, { label: 'Equipo (código)', unidad: '' }],
  },
  { id: 11, nombre: 'Envasado', icono: '🏭', descripcion: 'Llenado y sellado automático en envases finales. Adición de frutas/saborizantes si aplica.', estado: 'Pendiente',
    campos: [{ label: 'Unidades envasadas', unidad: 'und' }, { label: 'Temperatura llenado', unidad: '°C' }, { label: 'Tiempo de envasado', unidad: 'min' }, { label: 'Volumen por unidad', unidad: 'ml' }, { label: 'Unidades defectuosas', unidad: 'und' }],
  },
  { id: 12, nombre: 'Almacén PT', icono: '📦', descripcion: 'Ingreso del producto terminado al almacén refrigerado con control de temperatura y trazabilidad.', estado: 'Pendiente',
    campos: [{ label: 'Unidades ingresadas', unidad: 'und' }, { label: 'Temperatura conservación', unidad: '°C', max: 6 }, { label: 'Nivel de almacén', unidad: '' }, { label: 'Lote PT asignado', unidad: '' }, { label: 'Fecha de vencimiento', unidad: '' }],
  },
  { id: 13, nombre: 'Despacho', icono: '🚚', descripcion: 'Salida del producto terminado hacia el cliente o distribuidora. Generación de guías de remisión.', estado: 'Pendiente',
    campos: [{ label: 'Unidades despachadas', unidad: 'und' }, { label: 'Temperatura despacho', unidad: '°C' }, { label: 'Destino', unidad: '' }, { label: 'N° Guía de Remisión', unidad: '' }, { label: 'Unidades devueltas', unidad: 'und' }],
  },
];

const ESTADO_CFG: Record<PasoEstado, { ring: string; bg: string; text: string; dot: string; label: string; badgeBg: string; badgeText: string }> = {
  Pendiente: { ring: '#D1D9E0', bg: '#F8FAFC', text: '#94A3B8', dot: '#CBD5E1', label: 'Pendiente', badgeBg: '#F1F5F9', badgeText: '#94A3B8' },
  'En curso': { ring: '#60A5FA', bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6', label: 'En curso', badgeBg: '#DBEAFE', badgeText: '#1D4ED8' },
  Completado: { ring: '#4ADE80', bg: '#F0FDF4', text: '#15803D', dot: '#2ECC71', label: 'Completado', badgeBg: '#DCFCE7', badgeText: '#15803D' },
  Alerta: { ring: '#F87171', bg: '#FEF2F2', text: '#B91C1C', dot: '#E74C3C', label: 'Alerta', badgeBg: '#FEE2E2', badgeText: '#B91C1C' },
};

// ─── Quality Parameters Sub-Section ──────────────────────────────────────────
const mockParams = [
  { lote: 'LMP-2026-001', fecha: '2026-04-22', hora: '07:30', turno: 'Mañana', operario: 'J. Ramos', pH: 6.7, acidez: 16.5, solidos: 12.1, temp: 6.5, ok: true, obs: '' },
  { lote: 'LMP-2026-002', fecha: '2026-04-22', hora: '08:10', turno: 'Mañana', operario: 'M. López', pH: 6.5, acidez: 19.2, solidos: 11.0, temp: 9.1, ok: false, obs: 'Acidez fuera de rango. Temperatura alta.' },
  { lote: 'LMP-2026-007', fecha: '2026-04-19', hora: '14:30', turno: 'Tarde', operario: 'P. Vega', pH: 6.8, acidez: 17.0, solidos: 12.8, temp: 7.0, ok: true, obs: '' },
];

const mockDocs = [
  { nombre: 'Certificado de Calidad del proveedor', icon: '📄', lote: 'LMP-2026-001', fecha: '2026-04-22', cargado: true },
  { nombre: 'Análisis Microbiológico', icon: '🔬', lote: 'LMP-2026-001', fecha: '2026-04-22', cargado: true },
  { nombre: 'Guía de remisión / Factura', icon: '📋', lote: 'LMP-2026-001', fecha: '2026-04-22', cargado: false },
  { nombre: 'Otros documentos', icon: '📎', lote: 'LMP-2026-001', fecha: '—', cargado: false },
];

// ─── Modal ────────────────────────────────────────────────────────────────────
function PasoModal({ paso, onClose, onSave }: { paso: PasoProceso; onClose: () => void; onSave: (id: number, data: any, completado: boolean) => void }) {
  const [tab, setTab] = useState<'registro' | 'documentos' | 'parametros'>('registro');
  const [form, setForm] = useState<Record<string, string>>(
    paso.registro
      ? { campo1: String(paso.registro.campo1), campo2: String(paso.registro.campo2), campo3: String(paso.registro.campo3), campo4: String(paso.registro.campo4), campo5: String(paso.registro.campo5), observaciones: paso.registro.observaciones }
      : { campo1: '', campo2: '', campo3: '', campo4: '', campo5: '', observaciones: '' }
  );
  const [completado, setCompletado] = useState(paso.registro?.completado ?? false);
  const [notas, setNotas] = useState<Record<string, boolean>>({});
  const [showNewParam, setShowNewParam] = useState(false);

  const cfg = ESTADO_CFG[paso.estado];
  const tabs = [
    { id: 'registro', label: '📋 Registro' },
    ...(paso.hasDocumentos ? [{ id: 'documentos', label: '📁 Documentos' }] : []),
    ...(paso.hasParametros ? [{ id: 'parametros', label: '🔬 Parámetros' }] : []),
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 72px rgba(0,0,0,0.25)', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ background: '#1E3A5F', padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 14, flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {paso.icono}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Paso {paso.id}</span>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: cfg.badgeBg, color: cfg.badgeText }}>● {cfg.label}</span>
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{paso.nombre}</h2>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3, lineHeight: 1.5 }}>{paso.descripcion}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        {tabs.length > 1 && (
          <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                style={{ flex: 1, padding: '10px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                  background: tab === t.id ? '#fff' : '#F8FAFC',
                  color: tab === t.id ? '#1E3A5F' : '#7F8C8D',
                  borderBottom: tab === t.id ? '2px solid #1E3A5F' : '2px solid transparent',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {/* --- REGISTRO TAB --- */}
          {tab === 'registro' && (
            <div className="space-y-3">
              {paso.campos.map((campo, i) => {
                const key = `campo${i + 1}`;
                const val = Number(form[key]);
                const outOfRange = form[key] !== '' && ((campo.min !== undefined && val < campo.min) || (campo.max !== undefined && val > campo.max));
                return (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {campo.label}
                      {(campo.min !== undefined || campo.max !== undefined) && (
                        <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 400, color: '#B0BEC5', textTransform: 'none' }}>
                          (Rango: {campo.min !== undefined ? campo.min : '—'} – {campo.max !== undefined ? campo.max : '—'} {campo.unidad})
                        </span>
                      )}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" step="any" value={form[key]}
                        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="0"
                        style={{ flex: 1, border: `1.5px solid ${outOfRange ? '#FCA5A5' : '#E2E8F0'}`, borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: outOfRange ? '#FEF2F2' : '#F8FAFC', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                      />
                      {campo.unidad && <span style={{ fontSize: 12, color: '#94A3B8', minWidth: 30 }}>{campo.unidad}</span>}
                      <button onClick={() => setNotas(p => ({ ...p, [key]: !p[key] }))}
                        style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: notas[key] ? '#DBEAFE' : '#F1F5F9', color: notas[key] ? '#1D4ED8' : '#94A3B8', display: 'flex', alignItems: 'center' }}>
                        <MessageSquare size={12} />
                      </button>
                    </div>
                    {outOfRange && <p style={{ fontSize: 10, color: '#E74C3C', marginTop: 3, fontWeight: 600 }}>⚠ Valor fuera del rango de referencia</p>}
                    {notas[key] && (
                      <input type="text" placeholder="Observación rápida..." style={{ width: '100%', marginTop: 6, border: '1.5px solid #BFDBFE', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#2C3E50', background: '#EFF6FF', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    )}
                  </div>
                );
              })}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#7F8C8D', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Observaciones generales</label>
                <textarea value={form.observaciones} onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))} rows={2} placeholder="Observaciones adicionales del operador..."
                  style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          {/* --- DOCUMENTOS TAB --- */}
          {tab === 'documentos' && (
            <div className="space-y-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50', flex: 1 }}>Documentos de Recepción</h3>
                <select style={{ border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', fontSize: 12, color: '#2C3E50', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
                  <option>LMP-2026-001</option>
                  <option>LMP-2026-002</option>
                </select>
              </div>
              {mockDocs.map(doc => (
                <div key={doc.nombre} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: doc.cargado ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${doc.cargado ? '#BBF7D0' : '#FDE68A'}` }}>
                  <span style={{ fontSize: 22 }}>{doc.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#2C3E50' }}>{doc.nombre}</p>
                    <p style={{ fontSize: 11, color: '#7F8C8D' }}>
                      {doc.cargado ? `Cargado: ${doc.fecha}` : 'Pendiente de carga'}
                      {' · '}Lote: <span style={{ fontFamily: 'monospace', color: '#1E3A5F' }}>{doc.lote}</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: doc.cargado ? '#15803D' : '#B45309' }}>{doc.cargado ? '✅' : '⚠️'}</span>
                    {doc.cargado && <button style={{ fontSize: 11, color: '#1E3A5F', background: '#EFF6FF', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Ver</button>}
                    <button style={{ fontSize: 11, color: '#fff', background: '#1E3A5F', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Subir</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- PARÁMETROS TAB --- */}
          {tab === 'parametros' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50' }}>Control de Parámetros Fisicoquímicos</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#7F8C8D', background: '#F1F5F9', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    <Download size={11} /> Excel
                  </button>
                  <button onClick={() => setShowNewParam(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#fff', background: '#1E3A5F', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    <Plus size={11} /> Registrar
                  </button>
                </div>
              </div>

              {/* Reference ranges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'pH', range: '6.6 – 6.8', unit: '' },
                  { label: 'Acidez', range: '16 – 18', unit: '°D' },
                  { label: 'Sólidos totales', range: '11.5 – 13', unit: '%' },
                  { label: 'Temp. llegada', range: '≤ 8', unit: '°C' },
                ].map(r => (
                  <div key={r.label} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, color: '#7F8C8D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{r.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>{r.range} {r.unit}</p>
                    <p style={{ fontSize: 9, color: '#86EFAC' }}>Referencia</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #E8ECF0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
                  <thead>
                    <tr style={{ background: '#1E3A5F' }}>
                      {['Lote', 'Fecha', 'Hora', 'Turno', 'Operario', 'pH', 'Acidez °D', 'Sólidos %', 'Temp °C', 'Resultado', 'Obs'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockParams.map((p, i) => (
                      <tr key={i} style={{ background: p.ok ? (i % 2 ? '#F0FDF4' : '#F8FFFA') : (i % 2 ? '#FEF2F2' : '#FFF5F5'), borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: 11, color: '#1E3A5F', fontWeight: 600 }}>{p.lote}</td>
                        <td style={{ padding: '8px 10px', color: '#7F8C8D' }}>{p.fecha}</td>
                        <td style={{ padding: '8px 10px', color: '#7F8C8D' }}>{p.hora}</td>
                        <td style={{ padding: '8px 10px', color: '#7F8C8D' }}>{p.turno}</td>
                        <td style={{ padding: '8px 10px', color: '#2C3E50', whiteSpace: 'nowrap' }}>{p.operario}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: p.pH >= 6.6 && p.pH <= 6.8 ? '#15803D' : '#B91C1C' }}>{p.pH}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: p.acidez >= 16 && p.acidez <= 18 ? '#15803D' : '#B91C1C' }}>{p.acidez}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: p.solidos >= 11.5 && p.solidos <= 13 ? '#15803D' : '#B91C1C' }}>{p.solidos}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: p.temp <= 8 ? '#15803D' : '#B91C1C' }}>{p.temp}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: p.ok ? '#DCFCE7' : '#FEE2E2', color: p.ok ? '#15803D' : '#B91C1C' }}>
                            {p.ok ? '✅ OK' : '❌ No apto'}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: 10, color: '#7F8C8D', maxWidth: 120 }}>{p.obs || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {tab === 'registro' && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 12 }}>
              <button onClick={() => setCompletado(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E3A5F', padding: 0, display: 'flex' }}>
                {completado ? <CheckSquare size={18} /> : <Square size={18} style={{ color: '#CBD5E1' }} />}
              </button>
              <span style={{ fontSize: 13, color: '#2C3E50', fontWeight: 500 }}>Marcar paso como completado</span>
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600, color: '#7F8C8D', border: '1.5px solid #E2E8F0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Cancelar
              </button>
              <button onClick={() => onSave(paso.id, form, completado)} style={{ flex: 2, padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#fff', background: '#1E3A5F', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Guardar Registro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Process View ────────────────────────────────────────────────────────
export default function ProcesoView() {
  const router = useRouter();
  const [pasos, setPasos] = useState<PasoProceso[]>(PASOS);
  const [selectedPaso, setSelectedPaso] = useState<PasoProceso | null>(null);
  const [view, setView] = useState<'diagram' | 'cards'>('diagram');

  const completados = pasos.filter(p => p.estado === 'Completado').length;
  const enCurso = pasos.filter(p => p.estado === 'En curso').length;

  const handleSave = (id: number, data: Record<string, string>, completado: boolean) => {
    setPasos(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p, estado: completado ? 'Completado' : 'En curso',
        registro: { campo1: Number(data.campo1), campo2: Number(data.campo2), campo3: Number(data.campo3), campo4: Number(data.campo4), campo5: Number(data.campo5), observaciones: data.observaciones, completado, fecha: new Date().toLocaleString('es-PE'), operador: 'Ing. García' },
      };
    }));
    setSelectedPaso(null);
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }} className="space-y-5">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1E3A5F' }}>Proceso de Producción</h1>
          <p style={{ fontSize: 13, color: '#7F8C8D', marginTop: 2 }}>13 etapas · Haz clic en cada paso para registrar datos</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['diagram', 'cards'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', border: 'none', background: view === v ? '#1E3A5F' : '#F1F5F9', color: view === v ? '#fff' : '#7F8C8D', transition: 'all 0.15s' }}>
              {v === 'diagram' ? '🖼 Diagrama' : '📋 Tarjetas'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total etapas', value: '13', color: '#1E3A5F', bg: '#EFF6FF' },
          { label: 'Completadas', value: String(completados), color: '#2ECC71', bg: '#F0FDF4' },
          { label: 'En curso', value: String(enCurso), color: '#3B82F6', bg: '#DBEAFE' },
          { label: 'Pendientes', value: String(pasos.length - completados - enCurso), color: '#94A3B8', bg: '#F8FAFC' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '12px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</p>
            <p style={{ fontSize: 11, color: '#7F8C8D' }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Process Diagram View */}
      {view === 'diagram' && (
        <div style={{ background: '#0F2744', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Flujo de Producción de Yogurt · 13 Pasos</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {Object.entries(ESTADO_CFG).map(([key, cfg]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Image with clickable overlay */}
          <div style={{ position: 'relative', width: '100%', margin: '0 auto', background: '#fff' }}>
            <img src={processDiagram.src} alt="Diagrama de proceso de producción de yogurt" style={{ width: '100%', height: 'auto', display: 'block' }} />

            {/* Overlay step buttons absolutely positioned */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {pasos.map(paso => {
                const cfg = ESTADO_CFG[paso.estado];
                // Approximate coordinates for each machine in the diagram
                const pos: Record<number, { top: string; left: string }> = {
                  1: { top: '30%', left: '16%' },
                  2: { top: '30%', left: '26%' },
                  3: { top: '30%', left: '42%' },
                  4: { top: '30%', left: '56%' },
                  5: { top: '30%', left: '72%' },
                  6: { top: '30%', left: '88%' },
                  7: { top: '65%', left: '16%' },
                  8: { top: '65%', left: '26%' },
                  9: { top: '65%', left: '42%' },
                  10: { top: '65%', left: '56%' },
                  11: { top: '65%', left: '72%' },
                  12: { top: '65%', left: '88%' },
                  13: { top: '88%', left: '50%' },
                };
                
                const { top, left } = pos[paso.id] || { top: '50%', left: '50%' };

                return (
                  <button key={paso.id} onClick={() => {
                      if (paso.id === 3) {
                        router.push('/proceso/pasteurizacion');
                      } else {
                        setSelectedPaso(paso);
                      }
                    }}
                    style={{ 
                      position: 'absolute', top, left, transform: 'translate(-50%, -50%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, 
                      padding: '6px 8px', borderRadius: 8, cursor: 'pointer', 
                      border: `2px solid ${cfg.dot}`, background: `${cfg.dot}40`, 
                      backdropFilter: 'blur(6px)', transition: 'all 0.2s', minWidth: 60, pointerEvents: 'auto'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1.15)'; (e.currentTarget as HTMLElement).style.background = `${cfg.dot}90`; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${cfg.dot}`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1)'; (e.currentTarget as HTMLElement).style.background = `${cfg.dot}40`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: cfg.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{paso.id}</div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', textAlign: 'center', lineHeight: 1.2, maxWidth: 60, textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }}>{paso.nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div style={{ padding: '12px 20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${(completados / 13) * 100}%`, height: '100%', background: 'linear-gradient(to right, #3B82F6, #2ECC71)', borderRadius: 6, transition: 'width 0.5s' }} />
            </div>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>{completados}/13 etapas completadas ({Math.round((completados / 13) * 100)}%)</p>
          </div>
        </div>
      )}

      {/* Cards View */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {pasos.map(paso => {
            const cfg = ESTADO_CFG[paso.estado];
            return (
              <div key={paso.id} onClick={() => {
                  if (paso.id === 3) {
                    router.push('/proceso/pasteurizacion');
                  } else {
                    setSelectedPaso(paso);
                  }
                }}
                style={{ background: '#fff', borderRadius: 12, border: `1.5px solid ${paso.estado === 'En curso' ? '#60A5FA' : '#E8ECF0'}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 14, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{paso.icono}</span>
                  <div>
                    <span style={{ fontSize: 10, color: '#B0BEC5', fontFamily: 'monospace' }}>Paso {paso.id}</span>
                    <div>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8, background: cfg.badgeBg, color: cfg.badgeText }}>● {cfg.label}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#2C3E50' }}>{paso.nombre}</p>
                {paso.registro ? (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#7F8C8D' }}>
                    <p>{paso.registro.operador}</p>
                    <p>{paso.registro.fecha}</p>
                  </div>
                ) : (
                  <p style={{ marginTop: 6, fontSize: 11, color: '#CBD5E1', fontStyle: 'italic' }}>Sin registro · Clic para registrar</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedPaso && (
        <PasoModal paso={selectedPaso} onClose={() => setSelectedPaso(null)} onSave={handleSave} />
      )}
    </div>
  );
}
