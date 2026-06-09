"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Clock, Plus, CheckCircle, AlertTriangle, XCircle, Save, Download, Flame, ShieldCheck, Calendar, Search, FileSpreadsheet, Waves, Gauge } from 'lucide-react';

interface Muestra {
  id: string;
  hora: string;
  temperatura: number;
  caudal: number;
  presion: number;
  operador: string;
  estado: 'Normal' | 'Advertencia' | 'Crítico';
}

const initialData: Muestra[] = [
  { id: '1', hora: '06:00', temperatura: 85.1, caudal: 5020, presion: 2.5, operador: 'Ing. García', estado: 'Normal' },
  { id: '2', hora: '06:30', temperatura: 84.8, caudal: 5050, presion: 2.4, operador: 'Ing. García', estado: 'Normal' },
  { id: '3', hora: '07:00', temperatura: 86.2, caudal: 4980, presion: 2.5, operador: 'Ing. García', estado: 'Normal' },
  { id: '4', hora: '07:30', temperatura: 87.5, caudal: 4800, presion: 2.2, operador: 'Ing. García', estado: 'Advertencia' },
  { id: '5', hora: '08:00', temperatura: 85.5, caudal: 5010, presion: 2.6, operador: 'Ing. García', estado: 'Normal' },
];

const LIMITES = {
  temperatura: { LSE: 90, LSC: 88, MU: 85, LIC: 82, LIE: 80, min: 75, max: 95, unit: '°C' },
  caudal: { LSE: 5500, LSC: 5300, MU: 5000, LIC: 4700, LIE: 4500, min: 4000, max: 6000, unit: 'L/h' },
  presion: { LSE: 3.5, LSC: 3.0, MU: 2.5, LIC: 2.0, LIE: 1.5, min: 0.5, max: 4.5, unit: 'Bar' }
};

export default function ControlPasteurizacion() {
  const [muestras, setMuestras] = useState<Muestra[]>(initialData);
  const [activeTab, setActiveTab] = useState<'temperatura' | 'caudal' | 'presion'>('temperatura');

  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevaTemp, setNuevaTemp] = useState('');
  const [nuevoCaudal, setNuevoCaudal] = useState('');
  const [nuevaPresion, setNuevaPresion] = useState('');

  // Filtros de historial
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleBuscarHistorial = () => {
    if (!fechaDesde) {
      alert("Seleccione al menos una 'Fecha Desde' para buscar el historial.");
      return;
    }
    
    const historicalData: Muestra[] = [
      { id: '100', hora: '06:00', temperatura: 85.0, caudal: 5000, presion: 2.5, operador: 'Ing. López', estado: 'Normal' },
      { id: '101', hora: '06:30', temperatura: 84.5, caudal: 4950, presion: 2.4, operador: 'Ing. López', estado: 'Normal' },
      { id: '102', hora: '07:00', temperatura: 82.1, caudal: 4750, presion: 2.1, operador: 'Ing. López', estado: 'Advertencia' },
      { id: '103', hora: '07:30', temperatura: 79.5, caudal: 4400, presion: 1.4, operador: 'Ing. López', estado: 'Crítico' },
      { id: '104', hora: '08:00', temperatura: 85.2, caudal: 5010, presion: 2.6, operador: 'Ing. López', estado: 'Normal' },
    ];
    setMuestras(historicalData);
  };

  const handleExportarExcel = () => {
    if (muestras.length === 0) return alert("No hay datos en la tabla para exportar.");
    
    const headers = ["ID", "Hora", "Temperatura (°C)", "Caudal (L/h)", "Presion (Bar)", "Operador", "Estado Global"];
    const csvRows = muestras.map(m => `${m.id},${m.hora},${m.temperatura},${m.caudal},${m.presion},${m.operador},${m.estado}`);
    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_SPC_Pasteurizacion_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const evaluarEstadoIndividual = (valor: number, variable: 'temperatura'|'caudal'|'presion') => {
    const limits = LIMITES[variable];
    if (valor >= limits.LSE || valor <= limits.LIE) return 'Crítico';
    if (valor >= limits.LSC || valor <= limits.LIC) return 'Advertencia';
    return 'Normal';
  };

  const evaluarEstadoGlobal = (t: number, c: number, p: number) => {
    const estados = [
      evaluarEstadoIndividual(t, 'temperatura'),
      evaluarEstadoIndividual(c, 'caudal'),
      evaluarEstadoIndividual(p, 'presion')
    ];
    if (estados.includes('Crítico')) return 'Crítico';
    if (estados.includes('Advertencia')) return 'Advertencia';
    return 'Normal';
  };

  const handleAgregarMuestra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaHora || !nuevaTemp || !nuevoCaudal || !nuevaPresion) return;

    const t = parseFloat(nuevaTemp);
    const c = parseFloat(nuevoCaudal);
    const p = parseFloat(nuevaPresion);

    const nuevaMuestra: Muestra = {
      id: Date.now().toString(),
      hora: nuevaHora,
      temperatura: t,
      caudal: c,
      presion: p,
      operador: 'Ing. García',
      estado: evaluarEstadoGlobal(t, c, p),
    };

    setMuestras([...muestras, nuevaMuestra]);
    setNuevaHora('');
    setNuevaTemp('');
    setNuevoCaudal('');
    setNuevaPresion('');
  };

  const totalMuestras = muestras.length;
  const fueraDeControl = muestras.filter(m => m.estado === 'Crítico').length;
  const enAdvertencia = muestras.filter(m => m.estado === 'Advertencia').length;
  const tempPromedio = (muestras.reduce((acc, curr) => acc + curr.temperatura, 0) / totalMuestras).toFixed(1);

  const curLimits = LIMITES[activeTab];

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Thermometer className="text-orange-500" /> Control SPC Multivariable: Pasteurización
          </h1>
          <p className="text-sm text-slate-500 mt-1">Lote en proceso: <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">PROC-2026-015</span></p>
        </div>
        
        {/* Badge CIP */}
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg shadow-sm">
          <ShieldCheck size={16} className="text-green-600" />
          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">CIP Validado</span>
          <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full ml-1">Hace 2h</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Left Panel: Form & Stats */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">T° Promedio</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{tempPromedio}°C</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase">Alertas Globales</p>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{fueraDeControl + enAdvertencia}</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Flame className="text-orange-500" size={18} />
              <h2 className="font-bold text-slate-700">Registrar Variables de Proceso</h2>
            </div>
            <form onSubmit={handleAgregarMuestra} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Hora de Toma</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="time" required value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Temp (°C)</label>
                  <div className="relative">
                    <Thermometer className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="number" step="0.1" required value={nuevaTemp} onChange={(e) => setNuevaTemp(e.target.value)} placeholder="85.5" className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Caudal (L/h)</label>
                  <div className="relative">
                    <Waves className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="number" step="1" required value={nuevoCaudal} onChange={(e) => setNuevoCaudal(e.target.value)} placeholder="5000" className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Presión (Bar)</label>
                  <div className="relative">
                    <Gauge className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="number" step="0.1" required value={nuevaPresion} onChange={(e) => setNuevaPresion(e.target.value)} placeholder="2.5" className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none" />
                  </div>
                </div>
              </div>
              
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-lg text-sm font-bold shadow-sm hover:brightness-110 transition-all mt-2" style={{ background: '#1E3A5F' }}>
                <Save size={16} /> Guardar Valores
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-800">Gráfico de Control Estadístico (SPC)</h2>
              <p className="text-xs text-slate-500">Selecciona la variable a inspeccionar</p>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('temperatura')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'temperatura' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Thermometer size={14} /> Temperatura
              </button>
              <button 
                onClick={() => setActiveTab('caudal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'caudal' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Waves size={14} /> Caudal
              </button>
              <button 
                onClick={() => setActiveTab('presion')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'presion' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Gauge size={14} /> Presión
              </button>
            </div>
          </div>
          
          <div className="p-5 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={muestras} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hora" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                <YAxis domain={[curLimits.min, curLimits.max]} tick={{ fontSize: 12, fill: '#64748b' }} tickCount={9} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1E3A5F' }}
                  formatter={(value: any) => [`${value} ${curLimits.unit}`, activeTab.toUpperCase()]}
                />
                
                {/* Background colored areas */}
                <ReferenceArea y1={curLimits.LSE} y2={curLimits.max} fill="#EF4444" fillOpacity={0.15} />
                <ReferenceArea y1={curLimits.LSC} y2={curLimits.LSE} fill="#F59E0B" fillOpacity={0.15} />
                <ReferenceArea y1={curLimits.LIC} y2={curLimits.LSC} fill="#10B981" fillOpacity={0.15} />
                <ReferenceArea y1={curLimits.LIE} y2={curLimits.LIC} fill="#F59E0B" fillOpacity={0.15} />
                <ReferenceArea y1={curLimits.min} y2={curLimits.LIE} fill="#EF4444" fillOpacity={0.15} />

                {/* Reference Lines for Limits */}
                <ReferenceLine y={curLimits.LSE} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: `LSE`, fill: '#EF4444', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={curLimits.LSC} stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: `LSC`, fill: '#F59E0B', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={curLimits.MU} stroke="#10B981" strokeWidth={2} label={{ position: 'right', value: `µ`, fill: '#10B981', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={curLimits.LIC} stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: `LIC`, fill: '#F59E0B', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={curLimits.LIE} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: `LIE`, fill: '#EF4444', fontSize: 11, fontWeight: 'bold' }} />
                
                {/* Data Line */}
                <Line 
                  key={activeTab} // Force re-render animation when changing tabs
                  type="linear" 
                  dataKey={activeTab} 
                  stroke="#1E293B" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const val = payload[activeTab];
                    let fill = '#10B981'; // Green
                    if (val >= curLimits.LSE || val <= curLimits.LIE) fill = '#EF4444'; // Red
                    else if (val >= curLimits.LSC || val <= curLimits.LIC) fill = '#F59E0B'; // Yellow
                    return <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} key={payload.id} />;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend visual */}
          <div className="px-5 py-3 border-t border-slate-100 flex gap-4 text-[11px] font-bold bg-slate-50 justify-center">
            <span className="flex items-center gap-1.5 text-green-700"><div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div> Normal</span>
            <span className="flex items-center gap-1.5 text-yellow-700"><div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div> Advertencia</span>
            <span className="flex items-center gap-1.5 text-red-700"><div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div> Crítico (Fuera Espec.)</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-5">
        
        {/* Panel de Filtros y Exportación */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha Desde</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha Hasta</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
            <button onClick={handleBuscarHistorial} className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors h-[34px]">
              <Search size={14} /> Buscar
            </button>
          </div>
          
          <button onClick={handleExportarExcel} className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors h-[34px]">
            <FileSpreadsheet size={16} /> Exportar a Excel
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-700">Historial de Muestras (Variables Múltiples)</h2>
          <span className="text-xs text-slate-500 font-bold">{totalMuestras} muestras registradas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-slate-500 font-semibold border-b border-slate-200 bg-white">
              <tr>
                <th className="px-5 py-3">Hora</th>
                <th className="px-5 py-3">T° (°C)</th>
                <th className="px-5 py-3">Caudal (L/h)</th>
                <th className="px-5 py-3">Presión (Bar)</th>
                <th className="px-5 py-3">Operador</th>
                <th className="px-5 py-3">Estado Global</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...muestras].reverse().map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-bold text-slate-700">{m.hora}</td>
                  <td className="px-5 py-3 font-mono text-slate-800">{m.temperatura.toFixed(1)}</td>
                  <td className="px-5 py-3 font-mono text-slate-800">{m.caudal}</td>
                  <td className="px-5 py-3 font-mono text-slate-800">{m.presion.toFixed(1)}</td>
                  <td className="px-5 py-3 text-slate-600">{m.operador}</td>
                  <td className="px-5 py-3">
                    {m.estado === 'Normal' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-100 text-green-700"><CheckCircle size={14} /> Normal</span>}
                    {m.estado === 'Advertencia' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-yellow-100 text-yellow-700"><AlertTriangle size={14} /> Advertencia</span>}
                    {m.estado === 'Crítico' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-700"><XCircle size={14} /> Crítico</span>}
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
