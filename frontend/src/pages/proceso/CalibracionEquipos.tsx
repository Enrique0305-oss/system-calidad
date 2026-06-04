"use client";
import React, { useState } from 'react';
import { Search, Plus, FileText, CheckCircle, AlertTriangle, XCircle, Download, FileUp, X, Calendar } from 'lucide-react';

interface Equipo {
  id: string;
  codigo: string;
  nombre: string;
  marcaModelo: string;
  rango: string;
  ultimaCalibracion: string;
  proximaCalibracion: string;
  estado: 'Vigente' | 'Por Vencer' | 'Vencido';
  certificadoUrl: string;
}

const mockEquipos: Equipo[] = [
  { id: '1', codigo: 'CAL-00001', nombre: 'Balanza Analítica', marcaModelo: 'Ohaus Pioneer PX', rango: '0.0001g - 220g', ultimaCalibracion: '2026-01-15', proximaCalibracion: '2027-01-15', estado: 'Vigente', certificadoUrl: '#' },
  { id: '2', codigo: 'CAL-00002', nombre: 'Humedímetro (Analizador de Humedad)', marcaModelo: 'Sartorius MA160', rango: '0% - 100%', ultimaCalibracion: '2025-11-20', proximaCalibracion: '2026-05-20', estado: 'Vencido', certificadoUrl: '#' },
  { id: '3', codigo: 'CAL-00003', nombre: 'Termómetro de Precisión', marcaModelo: 'Testo 104-IR', rango: '-50°C a 250°C', ultimaCalibracion: '2025-06-10', proximaCalibracion: '2026-06-10', estado: 'Por Vencer', certificadoUrl: '#' },
  { id: '4', codigo: 'CAL-00004', nombre: 'Medidor de pH (Potenciómetro)', marcaModelo: 'Hanna HI98190', rango: '0.00 - 14.00 pH', ultimaCalibracion: '2026-03-05', proximaCalibracion: '2027-03-05', estado: 'Vigente', certificadoUrl: '#' },
  { id: '5', codigo: 'CAL-00005', nombre: 'Detector de Metales', marcaModelo: 'Mettler Toledo Safeline', rango: 'Fe 1.5mm / NoFe 2.0mm', ultimaCalibracion: '2026-02-28', proximaCalibracion: '2026-08-28', estado: 'Vigente', certificadoUrl: '#' },
];

const ESTADO_COLORS = {
  Vigente: { bg: '#DCFCE7', text: '#15803D', icon: <CheckCircle size={14} /> },
  'Por Vencer': { bg: '#FEF08A', text: '#A16207', icon: <AlertTriangle size={14} /> },
  Vencido: { bg: '#FEE2E2', text: '#B91C1C', icon: <XCircle size={14} /> },
};

export default function CalibracionEquipos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<Equipo | null>(null);

  const filteredEquipos = mockEquipos.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{ color: '#1E3A5F' }}>Calibración de Equipos</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de mantenimiento y verificación de instrumentos de medición</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} /> Exportar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            style={{ background: '#1E3A5F' }}
          >
            <Plus size={16} /> Registrar Calibración
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por código o equipo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Equipo e Información</th>
                <th className="px-6 py-3">Última Calibración</th>
                <th className="px-6 py-3">Próxima Calibración</th>
                <th className="px-6 py-3 text-center">Estado</th>
                <th className="px-6 py-3 text-center">Certificado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEquipos.map((equipo) => {
                const est = ESTADO_COLORS[equipo.estado];
                return (
                  <tr key={equipo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {equipo.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{equipo.nombre}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{equipo.marcaModelo} • {equipo.rango}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{equipo.ultimaCalibracion}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{equipo.proximaCalibracion}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: est.bg, color: est.text }}>
                        {est.icon} {equipo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setPdfPreview(equipo)}
                        className="inline-flex items-center justify-center p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Ver Certificado PDF"
                      >
                        <FileText size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredEquipos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron equipos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {pdfPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><FileText size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-800">Certificado_{pdfPreview.codigo}.pdf</h3>
                  <p className="text-xs text-slate-500">{pdfPreview.nombre} • Emitido: {pdfPreview.ultimaCalibracion}</p>
                </div>
              </div>
              <button onClick={() => setPdfPreview(null)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20} /></button>
            </div>
            <div className="p-6 bg-slate-200/50 h-[60vh] flex flex-col items-center justify-center">
              <FileText size={64} className="text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Previsualización de Documento Simulada</p>
              <p className="text-sm text-slate-400 mt-2">Aquí se cargaría el PDF del laboratorio de calibración.</p>
              <button className="mt-6 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm flex items-center gap-2">
                <Download size={16} /> Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between" style={{ background: '#1E3A5F' }}>
              <h2 className="font-bold text-white text-lg">Registrar Nueva Calibración</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white p-1"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Equipo a Calibrar</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>Seleccionar equipo...</option>
                    {mockEquipos.map(e => <option key={e.id}>{e.codigo} - {e.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Laboratorio / Proveedor</label>
                  <input type="text" placeholder="Ej. Metrología S.A.C." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Fecha de Calibración</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="date" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Próxima Calibración</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="date" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Certificado de Calibración (PDF)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <FileUp size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Haz clic para subir o arrastra el PDF aquí</p>
                  <p className="text-xs text-slate-500 mt-1">Máx. 5MB (Solo archivos PDF)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Observaciones</label>
                <textarea rows={2} placeholder="Desviaciones encontradas, ajustes realizados..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-white rounded-lg text-sm font-bold shadow-sm hover:brightness-110 transition-all" style={{ background: '#2ECC71' }}>
                Guardar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
