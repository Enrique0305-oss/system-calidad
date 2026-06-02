"use client";
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Clock, Plus, CheckCircle, AlertTriangle, XCircle, Save, Download, Flame, ShieldCheck } from 'lucide-react';

interface Muestra {
  id: string;
  hora: string;
  temperatura: number;
  operador: string;
  estado: 'Normal' | 'Advertencia' | 'Crítico';
}

// Datos iniciales de prueba
const initialData: Muestra[] = [
  { id: '1', hora: '06:00', temperatura: 85.1, operador: 'Ing. García', estado: 'Normal' },
  { id: '2', hora: '06:30', temperatura: 84.8, operador: 'Ing. García', estado: 'Normal' },
  { id: '3', hora: '07:00', temperatura: 86.2, operador: 'Ing. García', estado: 'Normal' },
  { id: '4', hora: '07:30', temperatura: 87.5, operador: 'Ing. García', estado: 'Advertencia' },
  { id: '5', hora: '08:00', temperatura: 85.5, operador: 'Ing. García', estado: 'Normal' },
];

const LIMITES = {
  LSE: 90, // Límite Superior de Especificación (Rojo)
  LSC: 88, // Límite Superior de Control (Amarillo)
  MU: 85,  // Media / Ideal (Verde)
  LIC: 82, // Límite Inferior de Control (Amarillo)
  LIE: 80, // Límite Inferior de Especificación (Rojo)
};

export default function ControlPasteurizacion() {
  const [muestras, setMuestras] = useState<Muestra[]>(initialData);
  const [nuevaHora, setNuevaHora] = useState('');
  const [nuevaTemp, setNuevaTemp] = useState('');

  const evaluarEstado = (temp: number) => {
    if (temp >= LIMITES.LSE || temp <= LIMITES.LIE) return 'Crítico';
    if (temp >= LIMITES.LSC || temp <= LIMITES.LIC) return 'Advertencia';
    return 'Normal';
  };

  const handleAgregarMuestra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaHora || !nuevaTemp) return;

    const tempVal = parseFloat(nuevaTemp);
    const estado = evaluarEstado(tempVal);

    const nuevaMuestra: Muestra = {
      id: Date.now().toString(),
      hora: nuevaHora,
      temperatura: tempVal,
      operador: 'Ing. García',
      estado: estado,
    };

    setMuestras([...muestras, nuevaMuestra]);
    setNuevaHora('');
    setNuevaTemp('');
  };

  // Calcular métricas
  const totalMuestras = muestras.length;
  const fueraDeControl = muestras.filter(m => m.estado === 'Crítico').length;
  const enAdvertencia = muestras.filter(m => m.estado === 'Advertencia').length;
  const tempPromedio = (muestras.reduce((acc, curr) => acc + curr.temperatura, 0) / totalMuestras).toFixed(1);

  return (
    <div className="p-6 space-y-5" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Thermometer className="text-orange-500" /> Control SPC en Vivo: Pasteurización
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
              <p className="text-xs font-bold text-slate-500 uppercase">Alertas</p>
              <p className="text-2xl font-extrabold text-red-600 mt-1">{fueraDeControl + enAdvertencia}</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Flame className="text-orange-500" size={18} />
              <h2 className="font-bold text-slate-700">Registrar Nueva Muestra</h2>
            </div>
            <form onSubmit={handleAgregarMuestra} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Hora de Toma</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="time" 
                    required
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Temperatura (°C)</label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    value={nuevaTemp}
                    onChange={(e) => setNuevaTemp(e.target.value)}
                    placeholder="Ej. 85.5"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 py-2.5 text-white rounded-lg text-sm font-bold shadow-sm hover:brightness-110 transition-all"
                style={{ background: '#1E3A5F' }}
              >
                <Save size={16} /> Guardar Muestra
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">Gráfico de Control Estadístico (SPC)</h2>
              <p className="text-xs text-slate-500">Límites: Ideal 85°C | Control ±3°C | Espec. ±5°C</p>
            </div>
            {/* Legend visual */}
            <div className="flex gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-green-600"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Normal</span>
              <span className="flex items-center gap-1 text-yellow-600"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Advertencia</span>
              <span className="flex items-center gap-1 text-red-600"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Crítico</span>
            </div>
          </div>
          
          <div className="p-5 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={muestras} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hora" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                <YAxis domain={[75, 95]} tick={{ fontSize: 12, fill: '#64748b' }} tickCount={9} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1E3A5F' }}
                />
                
                {/* Reference Lines for Limits */}
                <ReferenceLine y={LIMITES.LSE} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: 'LSE (90°C)', fill: '#EF4444', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={LIMITES.LSC} stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: 'LSC (88°C)', fill: '#F59E0B', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={LIMITES.MU} stroke="#10B981" strokeWidth={2} label={{ position: 'right', value: 'µ (85°C)', fill: '#10B981', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={LIMITES.LIC} stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: 'LIC (82°C)', fill: '#F59E0B', fontSize: 11, fontWeight: 'bold' }} />
                <ReferenceLine y={LIMITES.LIE} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" label={{ position: 'right', value: 'LIE (80°C)', fill: '#EF4444', fontSize: 11, fontWeight: 'bold' }} />
                
                {/* Data Line */}
                <Line 
                  type="monotone" 
                  dataKey="temperatura" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    let fill = '#10B981'; // Green
                    if (payload.estado === 'Crítico') fill = '#EF4444'; // Red
                    else if (payload.estado === 'Advertencia') fill = '#F59E0B'; // Yellow
                    return <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} key={payload.id} />;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-5">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-700">Historial de Muestras (Turno Actual)</h2>
          <span className="text-xs text-slate-500 font-bold">{totalMuestras} muestras registradas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Hora</th>
                <th className="px-5 py-3">Temperatura</th>
                <th className="px-5 py-3">Operador</th>
                <th className="px-5 py-3">Estado SPC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...muestras].reverse().map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3 font-bold text-slate-700">{m.hora}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-slate-800 font-bold">{m.temperatura.toFixed(1)} °C</span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{m.operador}</td>
                  <td className="px-5 py-3">
                    {m.estado === 'Normal' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700"><CheckCircle size={14} /> Normal</span>}
                    {m.estado === 'Advertencia' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700"><AlertTriangle size={14} /> Advertencia</span>}
                    {m.estado === 'Crítico' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700"><XCircle size={14} /> Fuera de Límite</span>}
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
