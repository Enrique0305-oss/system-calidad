"use client";
import React, { useState } from 'react';
import { FileWarning, AlertTriangle, CheckCircle, Clock, X, Save, FileText, Search } from 'lucide-react';

type RNCStatus = 'Abierta' | 'Cerrada';

interface RNC {
  id: string;
  codigo: string;
  fecha: string;
  origen: string; // Ej. Pasteurización, Incubación
  descripcion: string;
  loteAsociado: string;
  detectadoPor: string;
  estado: RNCStatus;
  causaRaiz?: string;
  accionCorrectiva?: string;
  cerradoPor?: string;
  fechaCierre?: string;
}

const datosIniciales: RNC[] = [
  {
    id: '1',
    codigo: 'RNC-2026-042',
    fecha: '2026-05-30 08:35',
    origen: 'Pasteurización',
    descripcion: 'Desviación de límite crítico de temperatura (Alcanzó 91°C, LSE es 90°C).',
    loteAsociado: 'LMP-002',
    detectadoPor: 'Sistema SPC Automático',
    estado: 'Abierta'
  },
  {
    id: '2',
    codigo: 'RNC-2026-043',
    fecha: '2026-05-30 11:45',
    origen: 'Incubación',
    descripcion: 'pH final fuera de rango. Se registró 5.0 (LSE es 4.6).',
    loteAsociado: 'PROC-2026-015',
    detectadoPor: 'M. López (Operador)',
    estado: 'Abierta'
  },
  {
    id: '3',
    codigo: 'RNC-2026-040',
    fecha: '2026-05-28 14:20',
    origen: 'Recepción MP',
    descripcion: 'Leche cruda ingresó con temperatura de 9.5°C (Límite max 8°C).',
    loteAsociado: 'LMP-001',
    detectadoPor: 'Javier Ramos',
    estado: 'Cerrada',
    causaRaiz: 'Falla en el sistema de enfriamiento del camión cisterna del proveedor Establo Santa María.',
    accionCorrectiva: 'Rechazo total del lote. Se emitió amonestación escrita al proveedor. Calibración de termómetro de recepción validada ok.',
    cerradoPor: 'Ing. García',
    fechaCierre: '2026-05-28 16:00'
  }
];

export default function NoConformidades() {
  const [rncs, setRncs] = useState<RNC[]>(datosIniciales);
  const [selectedRnc, setSelectedRnc] = useState<RNC | null>(null);
  const [causaRaiz, setCausaRaiz] = useState('');
  const [accionCorrectiva, setAccionCorrectiva] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = (rnc: RNC) => {
    setSelectedRnc(rnc);
    setCausaRaiz(rnc.causaRaiz || '');
    setAccionCorrectiva(rnc.accionCorrectiva || '');
  };

  const handleCloseRNC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRnc) return;

    setRncs(prev => prev.map(rnc => {
      if (rnc.id === selectedRnc.id) {
        return {
          ...rnc,
          estado: 'Cerrada',
          causaRaiz,
          accionCorrectiva,
          cerradoPor: 'Ing. García',
          fechaCierre: new Date().toLocaleString('es-PE', { hour12: false }).substring(0, 16).replace(',', '')
        };
      }
      return rnc;
    }));
    
    setSelectedRnc(null);
  };

  const filteredRncs = rncs.filter(r => 
    r.codigo.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.origen.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileWarning className="text-red-600" /> Gestión de No Conformidades (CAPA)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro, investigación y cierre de desviaciones en los procesos de calidad.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por RNC u origen..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" 
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total RNCs</p>
            <p className="text-3xl font-extrabold text-slate-800">{rncs.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Abiertas</p>
            <p className="text-3xl font-extrabold text-red-600">{rncs.filter(r => r.estado === 'Abierta').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-green-600 uppercase tracking-wider">Cerradas</p>
            <p className="text-3xl font-extrabold text-green-600">{rncs.filter(r => r.estado === 'Cerrada').length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Código RNC</th>
                <th className="px-6 py-4">Fecha Reporte</th>
                <th className="px-6 py-4">Origen / Proceso</th>
                <th className="px-6 py-4">Lote Afectado</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRncs.map(rnc => (
                <tr key={rnc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-800">{rnc.codigo}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{rnc.fecha}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{rnc.origen}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono text-xs border border-slate-200">{rnc.loteAsociado}</span>
                  </td>
                  <td className="px-6 py-4">
                    {rnc.estado === 'Abierta' 
                      ? <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><AlertTriangle size={14}/> Abierta</span>
                      : <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200"><CheckCircle size={14}/> Cerrada</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenModal(rnc)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${rnc.estado === 'Abierta' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                    >
                      {rnc.estado === 'Abierta' ? 'Evaluar CAPA' : 'Ver Detalles'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRncs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron registros de No Conformidad.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CAPA */}
      {selectedRnc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            {/* Header Modal */}
            <div className={`p-5 flex justify-between items-center ${selectedRnc.estado === 'Abierta' ? 'bg-red-600' : 'bg-slate-800'}`}>
              <div className="text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileWarning size={20}/> 
                  Reporte de No Conformidad: {selectedRnc.codigo}
                </h3>
                <p className="text-white/80 text-xs mt-1">Estado: {selectedRnc.estado.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedRnc(null)} className="text-white/70 hover:text-white transition-colors"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleCloseRNC} className="p-6 space-y-6">
              
              {/* Información del Evento */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide border-b border-slate-200 pb-2">1. Descripción del Evento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Origen / Proceso</p>
                    <p className="text-sm font-semibold text-slate-800">{selectedRnc.origen}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Lote Afectado</p>
                    <p className="text-sm font-mono font-bold text-slate-800">{selectedRnc.loteAsociado}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Fecha de Detección</p>
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-1"><Clock size={14}/> {selectedRnc.fecha}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Detectado Por</p>
                    <p className="text-sm font-semibold text-slate-800">{selectedRnc.detectadoPor}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Falla Reportada</p>
                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
                    {selectedRnc.descripcion}
                  </p>
                </div>
              </div>

              {/* Análisis CAPA */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide border-b border-slate-200 pb-2">2. Análisis y Acción Correctiva (CAPA)</h4>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Análisis de Causa Raíz (Ishikawa / 5 Por qués)</label>
                  <textarea 
                    required
                    disabled={selectedRnc.estado === 'Cerrada'}
                    value={causaRaiz} 
                    onChange={e => setCausaRaiz(e.target.value)}
                    placeholder="Escriba la causa raíz identificada..."
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none h-24 disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Acción Correctiva / Preventiva Tomada</label>
                  <textarea 
                    required
                    disabled={selectedRnc.estado === 'Cerrada'}
                    value={accionCorrectiva} 
                    onChange={e => setAccionCorrectiva(e.target.value)}
                    placeholder="Describa la acción tomada para resolver y prevenir recurrencia..."
                    className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none h-24 disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>
              </div>

              {selectedRnc.estado === 'Cerrada' && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                    <CheckCircle size={18}/> No Conformidad Cerrada
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-green-600 uppercase font-bold">Cerrado por: {selectedRnc.cerradoPor}</p>
                    <p className="text-xs text-green-700">{selectedRnc.fechaCierre}</p>
                  </div>
                </div>
              )}

              {/* Footer Modal */}
              {selectedRnc.estado === 'Abierta' && (
                <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setSelectedRnc(null)}
                    className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <Save size={18}/> Guardar y Cerrar RNC
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
