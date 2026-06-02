import { useRouter } from 'next/navigation';
import { Package, FlaskConical, Boxes, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight, Warehouse, Truck } from 'lucide-react';
import processDiagram from '@/imports/Captura_de_pantalla_2026-04-27_195959.png';

const recentActivity = [
  { icon: '🥛', text: 'Ingreso lote LMP-2026-002 – 1800 L Leche cruda', time: 'hace 30 min', type: 'entrada' },
  { icon: '🌡️', text: 'Paso 3 (Pasteurización) iniciado – Lote proceso P-001', time: 'hace 1h', type: 'proceso' },
  { icon: '📦', text: 'Lote LPT-2026-005 registrado – 600 und Yogurt Durazno', time: 'hace 2h', type: 'salida' },
  { icon: '⚠️', text: 'Ajuste pendiente de aprobación – LMP-2026-001', time: 'hace 3h', type: 'alerta' },
  { icon: '🚚', text: 'Despacho a Distribuidora Lima Norte – 200 und', time: 'hace 5h', type: 'salida' },
];

interface ModuleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  badgeColor: string;
  // position overlay on image (percent)
  left: string;
  top: string;
}

const moduleCards: ModuleCard[] = [
  {
    id: 'amp',
    title: 'Almacén Materia Prima',
    subtitle: 'Ingresos · Kardex · Proveedores',
    icon: <Warehouse size={22} />,
    path: '/mp/ingreso',
    borderColor: '#7C3AED',
    bgColor: 'rgba(124,58,237,0.12)',
    textColor: '#5B21B6',
    badgeColor: '#7C3AED',
    left: '1%',
    top: '8%',
  },
  {
    id: 'proceso',
    title: 'Proceso',
    subtitle: '13 etapas de producción',
    icon: <FlaskConical size={22} />,
    path: '/proceso',
    borderColor: '#F97316',
    bgColor: 'rgba(249,115,22,0.12)',
    textColor: '#C2410C',
    badgeColor: '#F97316',
    left: '32%',
    top: '8%',
  },
  {
    id: 'apt',
    title: 'Almacén Producto Terminado',
    subtitle: 'Lotes · Kardex · Trazabilidad',
    icon: <Boxes size={22} />,
    path: '/pt/ingreso',
    borderColor: '#2ECC71',
    bgColor: 'rgba(46,204,113,0.12)',
    textColor: '#15803D',
    badgeColor: '#2ECC71',
    left: '70%',
    top: '8%',
  },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: 'Inter, sans-serif', background: '#F4F6F9', minHeight: '100%' }}>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Lotes MP activos', value: '7', sub: '+2 hoy', color: '#3B82F6', bg: '#EFF6FF', icon: <Package size={18} /> },
          { label: 'Proceso en curso', value: '1', sub: 'Paso 3 activo', color: '#8B5CF6', bg: '#F5F3FF', icon: <FlaskConical size={18} /> },
          { label: 'Lotes PT disponibles', value: '4', sub: '3,550 und totales', color: '#2ECC71', bg: '#F0FDF4', icon: <Boxes size={18} /> },
          { label: 'Alertas activas', value: '1', sub: 'Ajuste pendiente', color: '#E74C3C', bg: '#FEF2F2', icon: <AlertTriangle size={18} /> },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3"
            style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
              style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#7F8C8D', marginTop: 2 }}>{s.label}</p>
              <p style={{ fontSize: 10, color: '#B0BEC5' }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Process Image */}
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', background: '#fff' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1E3A5F' }}>Flujo de Producción</h2>
            <p style={{ fontSize: 12, color: '#7F8C8D', marginTop: 2 }}>Haz clic en cualquier zona para acceder al módulo correspondiente</p>
          </div>
          <span style={{ fontSize: 11, color: '#B0BEC5', background: '#F8FAFC', padding: '4px 10px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
            13 etapas · Flujo interactivo
          </span>
        </div>

        {/* Image container with overlay cards */}
        <div className="relative" style={{ cursor: 'crosshair' }}>
          <img
            src={processDiagram.src}
            alt="Diagrama de flujo de producción de yogurt – 13 pasos"
            className="w-full"
            style={{ display: 'block', maxHeight: 480, objectFit: 'contain', background: '#fff' }}
          />



          {/* Step number badges on the image */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
            {Array.from({ length: 13 }, (_, i) => i + 1).map(n => (
              <div
                key={n}
                className="flex items-center justify-center rounded-full text-white shadow-sm"
                style={{
                  width: 22, height: 22, fontSize: 9, fontWeight: 700,
                  background: n === 1 ? '#7C3AED' : n <= 11 ? '#F97316' : n === 12 ? '#2ECC71' : '#1E3A5F',
                  cursor: 'pointer',
                  border: '2px solid white',
                }}
                onClick={() => n === 1 ? router.push('/mp/ingreso') : n <= 11 ? router.push('/proceso') : n === 12 ? router.push('/pt/ingreso') : router.push('/pt/rastreo')}
                title={`Paso ${n}`}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Activity + Process Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="lg:col-span-2" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50' }}>Actividad Reciente</h2>
            <span style={{ fontSize: 11, color: '#B0BEC5' }}>Últimas 6 horas</span>
          </div>
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 hover:bg-gray-50 transition-colors"
              style={{ padding: '10px 20px', borderBottom: i < recentActivity.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, color: '#2C3E50', lineHeight: 1.4 }}>{a.text}</p>
                <p style={{ fontSize: 11, color: '#B0BEC5', marginTop: 1 }}>{a.time}</p>
              </div>
              <span className="flex-shrink-0" style={{
                fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                background: a.type === 'entrada' ? '#F0FDF4' : a.type === 'salida' ? '#EFF6FF' : a.type === 'proceso' ? '#F5F3FF' : '#FEF2F2',
                color: a.type === 'entrada' ? '#2ECC71' : a.type === 'salida' ? '#3B82F6' : a.type === 'proceso' ? '#8B5CF6' : '#E74C3C',
              }}>
                {a.type === 'entrada' ? '▲ Entrada' : a.type === 'salida' ? '▼ Salida' : a.type === 'proceso' ? '⚙ Proceso' : '⚠ Alerta'}
              </span>
            </div>
          ))}
        </div>

        {/* Process Progress */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50' }}>Proceso Activo</h2>
            <button onClick={() => router.push('/proceso')} style={{ background: 'none', border: 'none', color: '#1E3A5F', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>
              Ver todo <ArrowRight size={11} />
            </button>
          </div>
          <div style={{ padding: '12px 16px' }} className="space-y-2">
            {[
              { n: 1, name: 'Almacén MP', done: true },
              { n: 2, name: 'Recepción', done: true },
              { n: 3, name: 'Pasteurización', done: false, active: true },
              { n: 4, name: 'Estandar. Grasa', done: false },
              { n: 5, name: 'Estandar. Mat. Seca', done: false },
            ].map(step => (
              <div key={step.n} className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full text-white flex-shrink-0"
                  style={{
                    width: 20, height: 20, fontSize: 9, fontWeight: 700,
                    background: step.done ? '#2ECC71' : step.active ? '#3B82F6' : '#E2E8F0',
                    color: step.done || step.active ? '#fff' : '#94A3B8',
                  }}>
                  {step.done ? '✓' : step.n}
                </div>
                <span style={{
                  fontSize: 12,
                  color: step.done ? '#94A3B8' : step.active ? '#1E3A5F' : '#94A3B8',
                  fontWeight: step.active ? 600 : 400,
                  textDecoration: step.done ? 'line-through' : 'none',
                }}>
                  {step.name}
                </span>
                {step.active && <span style={{ marginLeft: 'auto', fontSize: 10, background: '#EFF6FF', color: '#3B82F6', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>En curso</span>}
                {step.done && <CheckCircle size={11} style={{ marginLeft: 'auto', color: '#2ECC71' }} />}
              </div>
            ))}
            <div style={{ fontSize: 10, color: '#B0BEC5', textAlign: 'center', paddingTop: 4 }}>+8 pasos más · Ver diagrama completo</div>
          </div>
          <div style={{ margin: '0 16px 14px', background: '#F1F5F9', borderRadius: 8, height: 6, overflow: 'hidden' }}>
            <div style={{ width: '18%', height: '100%', background: 'linear-gradient(to right, #3B82F6, #2ECC71)', borderRadius: 8 }} />
          </div>
          <p style={{ fontSize: 11, color: '#B0BEC5', textAlign: 'center', paddingBottom: 14 }}>2/13 pasos completados</p>
        </div>
      </div>
    </div>
  );
}
