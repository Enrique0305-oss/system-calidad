"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle,
  Clock3,
  Download,
  ExternalLink,
  Filter,
  Package,
  PackageCheck,
  PenSquare,
  Printer,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Truck,
  UserRound,
  Warehouse,
} from 'lucide-react';

type EstadoDespacho =
  | 'Programado'
  | 'Asignado'
  | 'Verificado'
  | 'Cargado'
  | 'En ruta'
  | 'Entregado'
  | 'Reprogramado'
  | 'Rechazado'
  | 'Incidencia';

interface PedidoDespacho {
  id: string;
  guia: string;
  lotePT: string;
  cliente: string;
  destino: string;
  fechaProgramada: string;
  horaSalida: string;
  unidades: number;
  temperatura: number;
  chofer: string;
  vehiculo: string;
  estado: EstadoDespacho;
  prioridad: 'Alta' | 'Media' | 'Baja';
  observaciones: string;
  documentosOk: boolean;
  temperaturaSalidaOk: boolean;
  origen: 'Proceso' | 'Calidad' | 'PT';
}

const FLUJO_ESTADOS: EstadoDespacho[] = [
  'Programado',
  'Asignado',
  'Verificado',
  'Cargado',
  'En ruta',
  'Entregado',
  'Reprogramado',
  'Rechazado',
  'Incidencia',
];

const pedidosIniciales: PedidoDespacho[] = [
  {
    id: 'D-001',
    guia: 'GR-2026-0152',
    lotePT: 'LPT-2026-842',
    cliente: 'Distribuidora Andina SAC',
    destino: 'Lima Metropolitana',
    fechaProgramada: '2026-06-08',
    horaSalida: '08:30',
    unidades: 1680,
    temperatura: 4.2,
    chofer: 'Luis Calderón',
    vehiculo: 'Camión FR-2048',
    estado: 'Verificado',
    prioridad: 'Alta',
    observaciones: 'Carga validada. Pendiente sello de unidad.',
    documentosOk: true,
    temperaturaSalidaOk: true,
    origen: 'PT',
  },
  {
    id: 'D-002',
    guia: 'GR-2026-0153',
    lotePT: 'LPT-2026-315',
    cliente: 'Supermercados del Norte',
    destino: 'Trujillo',
    fechaProgramada: '2026-06-08',
    horaSalida: '10:00',
    unidades: 2300,
    temperatura: 4.8,
    chofer: 'Mario Cárdenas',
    vehiculo: 'Furgón FR-1182',
    estado: 'Programado',
    prioridad: 'Alta',
    observaciones: 'En espera de confirmación de documentos.',
    documentosOk: false,
    temperaturaSalidaOk: true,
    origen: 'PT',
  },
  {
    id: 'D-003',
    guia: 'GR-2026-0148',
    lotePT: 'LPT-2026-104',
    cliente: 'Mercados Regionales del Sur',
    destino: 'Arequipa',
    fechaProgramada: '2026-06-07',
    horaSalida: '16:20',
    unidades: 980,
    temperatura: 5.1,
    chofer: 'Jorge Huamán',
    vehiculo: 'Camión FR-3301',
    estado: 'En ruta',
    prioridad: 'Media',
    observaciones: 'Salida registrada y monitoreo activo.',
    documentosOk: true,
    temperaturaSalidaOk: true,
    origen: 'Calidad',
  },
  {
    id: 'D-004',
    guia: 'GR-2026-0141',
    lotePT: 'LPT-2026-679',
    cliente: 'Retail Costa Norte',
    destino: 'Piura',
    fechaProgramada: '2026-06-06',
    horaSalida: '11:10',
    unidades: 0,
    temperatura: 0,
    chofer: 'César Rojas',
    vehiculo: 'Camión FR-9002',
    estado: 'Entregado',
    prioridad: 'Baja',
    observaciones: 'Entrega confirmada con guía firmada.',
    documentosOk: true,
    temperaturaSalidaOk: true,
    origen: 'PT',
  },
  {
    id: 'D-005',
    guia: 'GR-2026-0154',
    lotePT: 'LPT-2026-441',
    cliente: 'Plataforma Express',
    destino: 'Callao',
    fechaProgramada: '2026-06-08',
    horaSalida: '14:45',
    unidades: 1420,
    temperatura: 6.4,
    chofer: 'Henry Salas',
    vehiculo: 'Furgón FR-7750',
    estado: 'Incidencia',
    prioridad: 'Alta',
    observaciones: 'Se detectó desviación térmica en pre-salida.',
    documentosOk: true,
    temperaturaSalidaOk: false,
    origen: 'Proceso',
  },
  {
    id: 'D-006',
    guia: 'GR-2026-0155',
    lotePT: 'LPT-2026-777',
    cliente: 'Mayorista Costero',
    destino: 'Chiclayo',
    fechaProgramada: '2026-06-09',
    horaSalida: '07:15',
    unidades: 1240,
    temperatura: 4.4,
    chofer: 'Raúl Ibáñez',
    vehiculo: 'Camión FR-6620',
    estado: 'Reprogramado',
    prioridad: 'Media',
    observaciones: 'Cliente solicitó cambio de ventana de entrega.',
    documentosOk: true,
    temperaturaSalidaOk: true,
    origen: 'Calidad',
  },
  {
    id: 'D-007',
    guia: 'GR-2026-0156',
    lotePT: 'LPT-2026-888',
    cliente: 'Cadena Gourmet',
    destino: 'Cusco',
    fechaProgramada: '2026-06-09',
    horaSalida: '09:00',
    unidades: 760,
    temperatura: 0,
    chofer: 'Renato Aguilar',
    vehiculo: 'Furgón FR-1108',
    estado: 'Rechazado',
    prioridad: 'Alta',
    observaciones: 'Despacho cancelado por documentación pendiente del receptor.',
    documentosOk: false,
    temperaturaSalidaOk: false,
    origen: 'Proceso',
  },
];

const CHECKLIST = [
  'Guía de remisión emitida',
  'Factura adjunta',
  'Lote PT liberado',
  'Temperatura de despacho verificada',
  'Vehículo sanitizado',
  'Sello y precinto colocados',
];

const ESTADO_CFG: Record<EstadoDespacho, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  Programado: { bg: '#F8FAFC', text: '#334155', border: '#CBD5E1', icon: <Clock3 size={14} /> },
  Asignado: { bg: '#EFF6FF', text: '#1D4ED8', border: '#3B82F6', icon: <Truck size={14} /> },
  Verificado: { bg: '#E0F2FE', text: '#0369A1', border: '#0EA5E9', icon: <ShieldCheck size={14} /> },
  Cargado: { bg: '#ECFDF5', text: '#047857', border: '#10B981', icon: <PackageCheck size={14} /> },
  'En ruta': { bg: '#ECFDF5', text: '#047857', border: '#10B981', icon: <Truck size={14} /> },
  Entregado: { bg: '#F0FDF4', text: '#15803D', border: '#22C55E', icon: <CheckCircle size={14} /> },
  Reprogramado: { bg: '#FFFBEB', text: '#A16207', border: '#F59E0B', icon: <RefreshCcw size={14} /> },
  Rechazado: { bg: '#FEF2F2', text: '#B91C1C', border: '#EF4444', icon: <ShieldAlert size={14} /> },
  Incidencia: { bg: '#FEF2F2', text: '#B91C1C', border: '#EF4444', icon: <AlertCircle size={14} /> },
};

const ORIGEN_CFG: Record<PedidoDespacho['origen'], { bg: string; text: string }> = {
  Proceso: { bg: '#FFF7ED', text: '#C2410C' },
  Calidad: { bg: '#EFF6FF', text: '#1D4ED8' },
  PT: { bg: '#ECFDF5', text: '#047857' },
};

function EstadoBadge({ estado }: { estado: EstadoDespacho }) {
  const cfg = ESTADO_CFG[estado];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}33`,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {cfg.icon} {estado}
    </span>
  );
}

function PrioridadBadge({ prioridad }: { prioridad: PedidoDespacho['prioridad'] }) {
  const palette = {
    Alta: { bg: '#FEF2F2', text: '#B91C1C' },
    Media: { bg: '#FFFBEB', text: '#B45309' },
    Baja: { bg: '#F8FAFC', text: '#475569' },
  }[prioridad];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        background: palette.bg,
        color: palette.text,
      }}
    >
      {prioridad}
    </span>
  );
}

function OrigenBadge({ origen }: { origen: PedidoDespacho['origen'] }) {
  const cfg = ORIGEN_CFG[origen];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: cfg.bg, color: cfg.text }}>
      {origen}
    </span>
  );
}

export default function DespachoView() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoDespacho[]>(pedidosIniciales);
  const [estadoFiltro, setEstadoFiltro] = useState<'Todos' | EstadoDespacho>('Todos');
  const [origenFiltro, setOrigenFiltro] = useState<'Todos' | PedidoDespacho['origen']>('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState<'tabla' | 'kanban' | 'seguimiento'>('tabla');
  const [seleccionado, setSeleccionado] = useState<PedidoDespacho | null>(pedidosIniciales[0]);

  const metricas = useMemo(
    () => ({
      programados: pedidos.filter((p) => p.estado === 'Programado').length,
      asignados: pedidos.filter((p) => p.estado === 'Asignado').length,
      verificados: pedidos.filter((p) => p.estado === 'Verificado').length,
      cargados: pedidos.filter((p) => p.estado === 'Cargado').length,
      ruta: pedidos.filter((p) => p.estado === 'En ruta').length,
      entregados: pedidos.filter((p) => p.estado === 'Entregado').length,
      incidencias: pedidos.filter((p) => ['Incidencia', 'Rechazado', 'Reprogramado'].includes(p.estado)).length,
    }),
    [pedidos],
  );

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideEstado = estadoFiltro === 'Todos' || pedido.estado === estadoFiltro;
    const coincideOrigen = origenFiltro === 'Todos' || pedido.origen === origenFiltro;
    const texto = `${pedido.guia} ${pedido.lotePT} ${pedido.cliente} ${pedido.destino} ${pedido.chofer} ${pedido.vehiculo}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());
    return coincideEstado && coincideOrigen && coincideBusqueda;
  });

  const avances = FLUJO_ESTADOS.map((estado) => ({ estado, total: pedidos.filter((pedido) => pedido.estado === estado).length }));

  const actualizarEstado = (id: string, estado: EstadoDespacho) => {
    setPedidos((prev) => prev.map((pedido) => (pedido.id === id ? { ...pedido, estado } : pedido)));
    setSeleccionado((prev) => (prev && prev.id === id ? { ...prev, estado } : prev));
  };

  const crearDemo = () => {
    const nuevo: PedidoDespacho = {
      id: `D-${Date.now()}`,
      guia: `GR-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      lotePT: `LPT-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      cliente: 'Cliente demo',
      destino: 'Ruta demo',
      fechaProgramada: new Date().toISOString().split('T')[0],
      horaSalida: '08:00',
      unidades: 1000,
      temperatura: 4.5,
      chofer: 'Operador demo',
      vehiculo: 'Unidad demo',
      estado: 'Programado',
      prioridad: 'Media',
      observaciones: 'Registro visual agregado desde el panel.',
      documentosOk: false,
      temperaturaSalidaOk: true,
      origen: 'PT',
    };

    setPedidos((prev) => [nuevo, ...prev]);
    setSeleccionado(nuevo);
    setVista('tabla');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
            <Truck size={14} /> Módulo de Despacho
          </div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="text-emerald-600" /> Panel visual de salida y distribución
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Todo es visual y local: puedes mover pedidos entre estados, revisar el flujo y saltar a los módulos reales que ya existen en el sistema.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => router.push('/pt/ingreso')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold shadow-sm hover:bg-emerald-100">
            <ExternalLink size={16} /> Ir a PT
          </button>
          <button onClick={() => router.push('/calidad/liberacion')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold shadow-sm hover:bg-blue-100">
            <ExternalLink size={16} /> Ir a Calidad
          </button>
          <button onClick={() => router.push('/proceso')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold shadow-sm hover:bg-orange-100">
            <ExternalLink size={16} /> Ir a Proceso
          </button>
          <button onClick={() => router.push('/mp/ingreso')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 text-sm font-semibold shadow-sm hover:bg-violet-100">
            <ExternalLink size={16} /> Ir a MP
          </button>
          <button onClick={crearDemo} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3A5F] text-white text-sm font-semibold shadow-sm hover:bg-[#16304f]">
            <PackageCheck size={16} /> Crear pedido demo
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-semibold shadow-sm hover:bg-slate-50">
            <Download size={16} /> Exportar
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-semibold shadow-sm hover:bg-slate-50">
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'tabla', label: 'Tabla operativa' },
          { id: 'kanban', label: 'Kanban de estados' },
          { id: 'seguimiento', label: 'Seguimiento visual' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setVista(item.id as typeof vista)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${vista === item.id ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            {item.label}
          </button>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { title: 'Temperatura controlada', value: `${((pedidos.filter((p) => p.temperaturaSalidaOk).length / pedidos.length) * 100).toFixed(0)}% de pedidos`, icon: <Truck size={18} />, tone: 'from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200' },
          { title: 'Documentos emitidos', value: `${((pedidos.filter((p) => p.documentosOk).length / pedidos.length) * 100).toFixed(0)}% de pedidos`, icon: <ShieldCheck size={18} />, tone: 'from-blue-50 to-blue-100 text-blue-700 border-blue-200' },
          { title: 'Incidencias activas', value: `${metricas.incidencias} pendientes`, icon: <AlertCircle size={18} />, tone: 'from-rose-50 to-rose-100 text-rose-700 border-rose-200' },
        ].map((card) => (
          <div key={card.title} className={`rounded-2xl border bg-gradient-to-br ${card.tone} p-5 shadow-sm`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold opacity-70">{card.title}</p>
                <p className="text-base font-bold mt-2">{card.value}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-50/60">
            <div>
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Package size={18} className="text-[#1E3A5F]" /> Pedidos listos para salida
              </h2>
              <p className="text-xs text-slate-500 mt-1">Selecciona una fila para ver la trazabilidad del despacho y cambiar su estado.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar guía, lote o cliente"
                    className="w-full sm:w-72 pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value as 'Todos' | EstadoDespacho)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Todos">Todos los estados</option>
                    {FLUJO_ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={origenFiltro}
                    onChange={(e) => setOrigenFiltro(e.target.value as 'Todos' | PedidoDespacho['origen'])}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Todos">Todos los orígenes</option>
                    <option value="Proceso">Proceso</option>
                    <option value="Calidad">Calidad</option>
                    <option value="PT">PT</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {avances.map((item) => (
                  <button
                    key={item.estado}
                    onClick={() => setEstadoFiltro(item.estado)}
                    className="px-3 py-1.5 rounded-full border text-xs font-bold bg-white hover:bg-slate-50"
                    style={{ borderColor: ESTADO_CFG[item.estado].border, color: ESTADO_CFG[item.estado].text }}
                  >
                    {item.estado} · {item.total}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {vista === 'tabla' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wide">
                  <tr>
                    {['Guía', 'Lote PT', 'Cliente', 'Origen', 'Salida', 'Unidades', 'Temp', 'Estado'].map((col) => (
                      <th key={col} className="text-left px-4 py-3 font-bold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido, index) => (
                    <tr
                      key={pedido.id}
                      onClick={() => setSeleccionado(pedido)}
                      className={`cursor-pointer border-t border-slate-100 transition-colors ${seleccionado?.id === pedido.id ? 'bg-emerald-50/60' : index % 2 ? 'bg-slate-50/30' : 'bg-white'} hover:bg-emerald-50/40`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-[#1E3A5F]">{pedido.guia}</td>
                      <td className="px-4 py-3 text-slate-600 font-medium">{pedido.lotePT}</td>
                      <td className="px-4 py-3 text-slate-700">{pedido.cliente}</td>
                      <td className="px-4 py-3 text-slate-500"><OrigenBadge origen={pedido.origen} /></td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {pedido.fechaProgramada} · {pedido.horaSalida}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-semibold whitespace-nowrap">{pedido.unidades.toLocaleString()} und</td>
                      <td className="px-4 py-3 text-slate-700 font-semibold whitespace-nowrap">
                        {pedido.temperatura ? `${pedido.temperatura.toFixed(1)} °C` : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <EstadoBadge estado={pedido.estado} />
                      </td>
                    </tr>
                  ))}
                  {pedidosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                        No hay despachos que coincidan con el filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {vista === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-slate-50/50">
              {FLUJO_ESTADOS.map((estado) => {
                const items = pedidosFiltrados.filter((pedido) => pedido.estado === estado);
                const cfg = ESTADO_CFG[estado];
                return (
                  <div key={estado} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between" style={{ background: cfg.bg }}>
                      <span className="font-bold text-sm" style={{ color: cfg.text }}>
                        {estado}
                      </span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/80" style={{ color: cfg.text }}>
                        {items.length}
                      </span>
                    </div>
                    <div className="p-3 space-y-3 max-h-[430px] overflow-y-auto">
                      {items.map((item) => (
                        <button key={item.id} onClick={() => setSeleccionado(item)} className="w-full text-left rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-mono text-[11px] font-bold text-[#1E3A5F]">{item.guia}</p>
                              <p className="text-sm font-semibold text-slate-700 mt-1">{item.cliente}</p>
                            </div>
                            <PrioridadBadge prioridad={item.prioridad} />
                          </div>
                          <p className="text-xs text-slate-500 mt-2">
                            {item.destino} · {item.fechaProgramada}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                            <span>{item.origen}</span>
                            <span>{item.unidades.toLocaleString()} und</span>
                          </div>
                        </button>
                      ))}
                      {items.length === 0 && <p className="text-sm text-slate-400 p-3 text-center">Sin pedidos.</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {vista === 'seguimiento' && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pedidosFiltrados.map((item) => (
                  <button key={item.id} onClick={() => setSeleccionado(item)} className="text-left rounded-2xl border border-slate-200 p-4 bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase">{item.guia}</p>
                        <h3 className="text-base font-bold text-slate-800 mt-1">{item.cliente}</h3>
                      </div>
                      <EstadoBadge estado={item.estado} />
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="px-2 py-1 rounded-full bg-slate-100">{item.lotePT}</span>
                      <span className="px-2 py-1 rounded-full bg-slate-100">{item.origen}</span>
                      <span className="px-2 py-1 rounded-full bg-slate-100">{item.destino}</span>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, ((FLUJO_ESTADOS.indexOf(item.estado) + 1) / FLUJO_ESTADOS.length) * 100)}%`,
                          background: item.estado === 'Incidencia' || item.estado === 'Rechazado' ? '#EF4444' : 'linear-gradient(90deg, #3B82F6, #10B981)',
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" /> Checklist de salida
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">Validación documental y operativa antes de liberar el vehículo.</p>
            <div className="space-y-3">
              {CHECKLIST.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <span className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-xs font-bold">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                    <p className="text-[11px] text-slate-400">Estado referencial del módulo</p>
                  </div>
                  <CheckCircle size={16} className="text-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <PenSquare size={18} className="text-[#1E3A5F]" /> Vínculos con procesos existentes
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">Navegación visual hacia las áreas ya implementadas.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/pt/ingreso" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 hover:bg-emerald-100 transition-colors">
                <p className="text-[11px] font-bold uppercase text-emerald-700">PT</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">Lotes listos para despacho</p>
              </Link>
              <Link href="/calidad/liberacion" className="rounded-xl border border-blue-200 bg-blue-50 p-3 hover:bg-blue-100 transition-colors">
                <p className="text-[11px] font-bold uppercase text-blue-700">Calidad</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">Liberación previa a salida</p>
              </Link>
              <Link href="/proceso" className="rounded-xl border border-orange-200 bg-orange-50 p-3 hover:bg-orange-100 transition-colors">
                <p className="text-[11px] font-bold uppercase text-orange-700">Proceso</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">Paso 13 conectado a despacho</p>
              </Link>
              <Link href="/mp/ingreso" className="rounded-xl border border-violet-200 bg-violet-50 p-3 hover:bg-violet-100 transition-colors">
                <p className="text-[11px] font-bold uppercase text-violet-700">MP</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">Origen y abastecimiento</p>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1E3A5F] to-[#16304f] rounded-2xl shadow-sm text-white overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="font-bold flex items-center gap-2">
                <Warehouse size={18} /> Detalle operativo
              </h2>
              <p className="text-xs text-white/60 mt-1">Resumen del pedido seleccionado.</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold">Pedido</p>
                <p className="text-lg font-semibold">{seleccionado?.cliente}</p>
                <p className="text-xs text-white/70 mt-1">
                  Guía {seleccionado?.guia} · Lote {seleccionado?.lotePT}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] text-white/55 uppercase font-bold">Chofer</p>
                  <p className="text-sm font-medium mt-1 flex items-center gap-2">
                    <UserRound size={14} /> {seleccionado?.chofer}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] text-white/55 uppercase font-bold">Vehículo</p>
                  <p className="text-sm font-medium mt-1 flex items-center gap-2">
                    <Truck size={14} /> {seleccionado?.vehiculo}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] text-white/55 uppercase font-bold">Prioridad</p>
                  <p className="text-sm font-medium mt-1">{seleccionado && <PrioridadBadge prioridad={seleccionado.prioridad} />}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] text-white/55 uppercase font-bold">Temp. salida</p>
                  <p className="text-sm font-medium mt-1">
                    {seleccionado?.temperatura ? `${seleccionado.temperatura.toFixed(1)} °C` : 'N/A'}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] text-white/55 uppercase font-bold">Documentos</p>
                  <p className="text-sm font-medium mt-1">{seleccionado?.documentosOk ? 'Validados' : 'Pendientes'}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-[11px] text-white/55 uppercase font-bold">Origen</p>
                  <p className="text-sm font-medium mt-1">{seleccionado && <OrigenBadge origen={seleccionado.origen} />}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {FLUJO_ESTADOS.map((estado) => (
                  <button
                    key={estado}
                    onClick={() => seleccionado && actualizarEstado(seleccionado.id, estado)}
                    className={`rounded-lg px-2 py-2 text-[11px] font-bold border transition-colors ${seleccionado?.estado === estado ? 'bg-white text-[#1E3A5F] border-white' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
                  >
                    {estado}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'Cargado')} className="rounded-lg px-3 py-2 bg-white text-[#1E3A5F] text-sm font-semibold">
                  Marcar cargado
                </button>
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'Entregado')} className="rounded-lg px-3 py-2 bg-emerald-500 text-white text-sm font-semibold">
                  Marcar entregado
                </button>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-[11px] text-white/55 uppercase font-bold">Observaciones</p>
                <p className="text-sm mt-1 leading-relaxed text-white/90">{seleccionado?.observaciones}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'Asignado')} className="px-4 py-2 rounded-lg bg-white text-[#1E3A5F] text-sm font-semibold">
                  Asignar ruta
                </button>
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'Verificado')} className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm font-semibold">
                  Verificar documentos
                </button>
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'En ruta')} className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold">
                  Despachar
                </button>
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'Reprogramado')} className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-semibold">
                  Reprogramar
                </button>
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'Incidencia')} className="px-4 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold">
                  Reportar incidencia
                </button>
                <button onClick={() => seleccionado && actualizarEstado(seleccionado.id, 'Rechazado')} className="px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-semibold">
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}