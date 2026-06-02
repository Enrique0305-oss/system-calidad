"use client";
import React, { useState } from 'react';
import { Microscope, ShieldCheck, ShieldAlert, X, FileText, CheckCircle, AlertTriangle, Search, Clock } from 'lucide-react';

type LoteEstado = 'Cuarentena' | 'Liberado' | 'Rechazado';

interface LoteMicro {
  id: string;
  lote: string;
  producto: string;
  envasado: string;
  estado: LoteEstado;
  horasCuarentena: number;
  responsable?: string;
  resultados?: string;
}

const datosIniciales: LoteMicro[] = [
  { id: '1', lote: 'LPT-2026-008', producto: 'Yogurt Fresa 1L', envasado: 'Hace 42 horas', estado: 'Cuarentena', horasCuarentena: 42 },
  { id: '2', lote: 'LPT-2026-009', producto: 'Yogurt Natural 1L', envasado: 'Hace 18 horas', estado: 'Cuarentena', horasCuarentena: 18 },
  { id: '3', lote: 'LPT-2026-010', producto: 'Yogurt Durazno 1L', envasado: 'Hace 5 horas', estado: 'Cuarentena', horasCuarentena: 5 },
  { id: '4', lote: 'LPT-2026-007', producto: 'Yogurt Vainilla 1L', envasado: 'Hace 48 horas', estado: 'Liberado', horasCuarentena: 48, responsable: 'Ing. García', resultados: 'Cumple criterios microbiológicos.' },
  { id: '5', lote: 'LPT-2026-006', producto: 'Yogurt Fresa 1L', envasado: 'Hace 50 horas', estado: 'Rechazado', horasCuarentena: 50, responsable: 'Ing. García', resultados: 'Recuento alto de levaduras. Fuera de límite.' },
];

export default function LiberacionLotes() {
  const [lotes, setLotes] = useState<LoteMicro[]>(datosIniciales);
  const [selectedLote, setSelectedLote] = useState<LoteMicro | null>(null);
  const [obs, setObs] = useState('');
  
  const [coliformes, setColiformes] = useState('Ausencia');
  const [hongos, setHongos] = useState('Ausencia');

  const cuarentena = lotes.filter(l => l.estado === 'Cuarentena');
  const liberados = lotes.filter(l => l.estado === 'Liberado');
  const rechazados = lotes.filter(l => l.estado === 'Rechazado');

  const handleAction = (nuevoEstado: LoteEstado) => {
    if (!selectedLote) return;
    
    const nota = nuevoEstado === 'Liberado' 
      ? `Aprobado. Coliformes: ${coliformes}. Hongos: ${hongos}. Obs: ${obs}`
      : `Rechazado. Coliformes: ${coliformes}. Hongos: ${hongos}. Obs: ${obs}`;

    setLotes(prev => prev.map(l => {
      if (l.id === selectedLote.id) {
        return { ...l, estado: nuevoEstado, responsable: 'Ing. García', resultados: nota };
      }
      return l;
    }));
    
    setSelectedLote(null);
    setObs('');
    setColiformes('Ausencia');
    setHongos('Ausencia');
  };

  const getCardStyle = (estado: LoteEstado) => {
    if (estado === 'Cuarentena') return 'border-orange-200 bg-orange-50';
    if (estado === 'Liberado') return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Microscope className="text-purple-600" /> Laboratorio: Liberación de Calidad
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Revisión microbiológica (48h) para autorizar la venta de los lotes de Producto Terminado.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Buscar lote..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Columna: Cuarentena */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col h-[calc(100vh-200px)]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-orange-600 uppercase text-sm tracking-wide flex items-center gap-1.5">
              <Clock size={16} /> En Cuarentena
            </h2>
            <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full">{cuarentena.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4">
            {cuarentena.map(l => (
              <div 
                key={l.id} 
                onClick={() => setSelectedLote(l)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 bg-white ${getCardStyle(l.estado)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs">{l.lote}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.horasCuarentena >= 40 ? 'bg-orange-200 text-orange-800 animate-pulse' : 'bg-slate-200 text-slate-600'}`}>
                    {l.horasCuarentena >= 48 ? '48h Cumplidas' : `${l.horasCuarentena} hrs`}
                  </span>
                </div>
                <p className="font-semibold text-sm text-slate-700">{l.producto}</p>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><FileText size={12}/> {l.envasado}</p>
                <button className="mt-3 w-full py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors">
                  Evaluar Lote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Columna: Liberados */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col h-[calc(100vh-200px)] opacity-80">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-green-600 uppercase text-sm tracking-wide flex items-center gap-1.5">
              <ShieldCheck size={16} /> Liberados (Venta)
            </h2>
            <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">{liberados.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4">
            {liberados.map(l => (
              <div key={l.id} className="p-4 rounded-xl border bg-white border-green-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-xs">{l.lote}</span>
                </div>
                <p className="font-semibold text-sm text-slate-700">{l.producto}</p>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Por: {l.responsable}</p>
                  <p className="text-xs text-green-700 mt-1 line-clamp-2">{l.resultados}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna: Rechazados */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col h-[calc(100vh-200px)] opacity-80">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="font-bold text-red-600 uppercase text-sm tracking-wide flex items-center gap-1.5">
              <ShieldAlert size={16} /> Rechazados
            </h2>
            <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">{rechazados.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-4">
            {rechazados.map(l => (
              <div key={l.id} className="p-4 rounded-xl border bg-white border-red-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-xs">{l.lote}</span>
                </div>
                <p className="font-semibold text-sm text-slate-700">{l.producto}</p>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Por: {l.responsable}</p>
                  <p className="text-xs text-red-700 mt-1 line-clamp-2">{l.resultados}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal de Liberación */}
      {selectedLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="bg-slate-800 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Evaluación Microbiológica</h3>
                <p className="text-slate-300 text-xs mt-1">Lote: <span className="font-mono font-bold text-white">{selectedLote.lote}</span> · {selectedLote.producto}</p>
              </div>
              <button onClick={() => setSelectedLote(null)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            {/* Body Modal */}
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3">
                <Microscope className="text-blue-500 shrink-0 mt-0.5" size={18}/>
                <p className="text-sm text-blue-800 font-medium">Tiempo de cuarentena cumplido: <strong>{selectedLote.horasCuarentena} horas</strong>. Ingrese los resultados de laboratorio para emitir el dictamen.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Coliformes Totales</label>
                  <select 
                    value={coliformes} onChange={e => setColiformes(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    <option value="Ausencia">Ausencia (&lt;3 NMP/g)</option>
                    <option value="Presencia">Presencia (&gt;3 NMP/g) ⚠️</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mohos y Levaduras</label>
                  <select 
                    value={hongos} onChange={e => setHongos(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    <option value="Ausencia">Ausencia (&lt;10 UFC/g)</option>
                    <option value="Presencia">Presencia (&gt;10 UFC/g) ⚠️</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Observaciones Adicionales</label>
                <textarea 
                  value={obs} onChange={e => setObs(e.target.value)}
                  placeholder="Detalles del análisis o motivo de rechazo..."
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20"
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 p-5 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => handleAction('Rechazado')}
                className="flex-1 bg-white border-2 border-red-200 hover:border-red-500 hover:bg-red-50 text-red-700 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <AlertTriangle size={18}/> Rechazar Lote
              </button>
              <button 
                onClick={() => handleAction('Liberado')}
                className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={18}/> Firmar y Liberar Lote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
