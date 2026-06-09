"use client";
import React, { useState } from 'react';
import { Droplets, CheckCircle, AlertTriangle, ShieldCheck, Waves, X, Save, Clock, Thermometer, Calendar, Search, FileSpreadsheet, List, MonitorPlay } from 'lucide-react';

type EquipEstado = 'Limpio' | 'Sucio';

interface Equipo {
  id: string;
  nombre: string;
  area: string;
  estado: EquipEstado;
  ultimoLavado: string;
  responsable?: string;
}

interface HistorialCIP {
  id: string;
  fecha: string;
  equipo: string;
  area: string;
  sodaTemp: number;
  sodaConc: number;
  acidoTemp: number;
  acidoConc: number;
  responsable: string;
  estado: string;
}

const equiposIniciales: Equipo[] = [
  { id: '1', nombre: 'Tanque de Recepción A', area: 'Recepción MP', estado: 'Limpio', ultimoLavado: 'Hace 2 horas', responsable: 'Javier Ramos' },
  { id: '2', nombre: 'Pasteurizador HTST', area: 'Tratamiento Térmico', estado: 'Sucio', ultimoLavado: 'Ayer' },
  { id: '3', nombre: 'Tanque de Incubación 1', area: 'Fermentación', estado: 'Limpio', ultimoLavado: 'Hace 5 horas', responsable: 'Pedro Vega' },
  { id: '4', nombre: 'Envasadora Lineal 200ml', area: 'Envasado', estado: 'Sucio', ultimoLavado: 'Hace 10 horas' },
  { id: '5', nombre: 'Tubería Principal (Línea B)', area: 'Distribución', estado: 'Limpio', ultimoLavado: 'Hace 1 hora', responsable: 'M. López' }
];

export default function RegistroCIP() {
  const [activeTab, setActiveTab] = useState<'estado' | 'historial'>('estado');
  const [equipos, setEquipos] = useState<Equipo[]>(equiposIniciales);
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);

  // Form states
  const [sodaConc, setSodaConc] = useState('2.5');
  const [sodaTemp, setSodaTemp] = useState('80');
  const [acidoConc, setAcidoConc] = useState('1.5');
  const [acidoTemp, setAcidoTemp] = useState('65');

  // Historial states
  const [historial, setHistorial] = useState<HistorialCIP[]>([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleValidarCIP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipo) return;

    setEquipos(prev => prev.map(eq => {
      if (eq.id === selectedEquipo.id) {
        return {
          ...eq,
          estado: 'Limpio',
          ultimoLavado: 'Justo ahora',
          responsable: 'Ing. García' // Usuario actual simulado
        };
      }
      return eq;
    }));
    setSelectedEquipo(null);
  };

  const handleBuscarHistorial = () => {
    if (!fechaDesde) {
      alert("Seleccione al menos una 'Fecha Desde' para buscar el historial.");
      return;
    }
    
    // Simular carga de datos históricos
    const mockHistorial: HistorialCIP[] = [
      { id: 'CIP-1045', fecha: '2026-06-07 05:30', equipo: 'Pasteurizador HTST', area: 'Tratamiento Térmico', sodaTemp: 82.5, sodaConc: 2.6, acidoTemp: 66.0, acidoConc: 1.5, responsable: 'Javier Ramos', estado: 'Completado' },
      { id: 'CIP-1044', fecha: '2026-06-07 02:15', equipo: 'Tanque de Recepción A', area: 'Recepción MP', sodaTemp: 80.0, sodaConc: 2.5, acidoTemp: 65.0, acidoConc: 1.5, responsable: 'M. López', estado: 'Completado' },
      { id: 'CIP-1043', fecha: '2026-06-06 23:45', equipo: 'Envasadora Lineal 200ml', area: 'Envasado', sodaTemp: 78.5, sodaConc: 2.4, acidoTemp: 64.5, acidoConc: 1.4, responsable: 'Pedro Vega', estado: 'Completado' },
      { id: 'CIP-1042', fecha: '2026-06-06 14:20', equipo: 'Tubería Principal (Línea B)', area: 'Distribución', sodaTemp: 81.0, sodaConc: 2.5, acidoTemp: 65.5, acidoConc: 1.6, responsable: 'Javier Ramos', estado: 'Completado' },
      { id: 'CIP-1041', fecha: '2026-06-05 06:00', equipo: 'Tanque de Incubación 1', area: 'Fermentación', sodaTemp: 80.5, sodaConc: 2.5, acidoTemp: 65.0, acidoConc: 1.5, responsable: 'Ing. García', estado: 'Completado' },
    ];
    setHistorial(mockHistorial);
  };

  const handleExportarExcel = () => {
    if (historial.length === 0) {
      alert("No hay registros en el historial para exportar.");
      return;
    }
    
    const headers = ["ID CIP", "Fecha/Hora", "Equipo", "Área", "Temp. Soda (°C)", "Conc. Soda (%)", "Temp. Ácido (°C)", "Conc. Ácido (%)", "Responsable", "Estado"];
    const csvRows = historial.map(h => `${h.id},${h.fecha},${h.equipo},${h.area},${h.sodaTemp},${h.sodaConc},${h.acidoTemp},${h.acidoConc},${h.responsable},${h.estado}`);
    const csvContent = "\uFEFF" + [headers.join(","), ...csvRows].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_CIP_Historial_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplets className="text-blue-500" /> Registros de Limpieza (CIP)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Validación de limpieza in-situ obligatoria antes de iniciar producción.
          </p>
        </div>
        
        {/* TABS */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('estado')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'estado' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <MonitorPlay size={16} /> Estado en Vivo
          </button>
          <button 
            onClick={() => setActiveTab('historial')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'historial' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={16} /> Historial
          </button>
        </div>
      </div>

      {/* ESTADO EN VIVO TAB */}
      {activeTab === 'estado' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-end gap-4">
            <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl flex flex-col items-center">
              <span className="text-xs text-green-700 font-bold uppercase">Equipos Limpios</span>
              <span className="text-2xl font-extrabold text-green-600">{equipos.filter(e=>e.estado === 'Limpio').length}</span>
            </div>
            <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-xl flex flex-col items-center">
              <span className="text-xs text-red-700 font-bold uppercase">Requieren Lavado</span>
              <span className="text-2xl font-extrabold text-red-600">{equipos.filter(e=>e.estado === 'Sucio').length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipos.map(eq => (
              <div 
                key={eq.id} 
                className={`rounded-2xl p-5 border-2 transition-all duration-300 relative overflow-hidden bg-white ${
                  eq.estado === 'Limpio' ? 'border-green-400 shadow-sm' : 'border-red-400 shadow-md'
                }`}
              >
                {eq.estado === 'Limpio' 
                  ? <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full -mr-4 -mt-4"></div>
                  : <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full -mr-4 -mt-4 animate-pulse"></div>
                }

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{eq.area}</p>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mt-1">{eq.nombre}</h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${eq.estado==='Limpio'?'bg-green-100 text-green-600':'bg-red-100 text-red-600'}`}>
                    {eq.estado === 'Limpio' ? <ShieldCheck size={18}/> : <AlertTriangle size={18}/>}
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Estado actual:</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${eq.estado==='Limpio'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                      {eq.estado === 'Limpio' ? 'Limpio (CIP OK)' : 'Sucio (Bloqueado)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> Último lavado:</span>
                    <span className="text-xs font-semibold text-slate-600">{eq.ultimoLavado}</span>
                  </div>
                  {eq.estado === 'Limpio' && (
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><CheckCircle size={12}/> Validado por:</span>
                      <span className="text-xs font-semibold text-slate-600">{eq.responsable}</span>
                    </div>
                  )}
                </div>

                {eq.estado === 'Sucio' && (
                  <button 
                    onClick={() => setSelectedEquipo(eq)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2"
                  >
                    <Waves size={16}/> Iniciar Lavado CIP
                  </button>
                )}
                {eq.estado === 'Limpio' && (
                  <button className="w-full py-2.5 bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl text-sm opacity-70 cursor-not-allowed">
                    Equipo Listo para Producción
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HISTORIAL TAB */}
      {activeTab === 'historial' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          
          {/* Toolbar Historial */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
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
              <button onClick={handleBuscarHistorial} className="flex items-center gap-1.5 px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors h-[34px]">
                <Search size={14} /> Buscar Registros
              </button>
            </div>
            
            <button onClick={handleExportarExcel} className="flex items-center gap-2 px-5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors h-[34px]">
              <FileSpreadsheet size={16} /> Exportar a Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            {historial.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <List className="text-slate-300 mb-3" size={48} />
                <p className="text-slate-500 font-medium">Selecciona un rango de fechas y presiona "Buscar Registros" para ver el historial.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-slate-500 font-semibold border-b border-slate-200 bg-white">
                  <tr>
                    <th className="px-5 py-4">ID CIP</th>
                    <th className="px-5 py-4">Fecha y Hora</th>
                    <th className="px-5 py-4">Equipo / Área</th>
                    <th className="px-5 py-4">Fase Alcalina (Soda)</th>
                    <th className="px-5 py-4">Fase Ácida (Ácido)</th>
                    <th className="px-5 py-4">Operador</th>
                    <th className="px-5 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historial.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-mono font-bold text-slate-700">{h.id}</td>
                      <td className="px-5 py-3 text-slate-600">{h.fecha}</td>
                      <td className="px-5 py-3">
                        <div className="font-bold text-slate-800">{h.equipo}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{h.area}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-slate-700">T°: <span className="font-mono font-semibold">{h.sodaTemp.toFixed(1)}°C</span></div>
                        <div className="text-slate-500 text-xs">Conc: {h.sodaConc}%</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-slate-700">T°: <span className="font-mono font-semibold">{h.acidoTemp.toFixed(1)}°C</span></div>
                        <div className="text-slate-500 text-xs">Conc: {h.acidoConc}%</div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{h.responsable}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-100 text-green-700"><CheckCircle size={14} /> {h.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal CIP */}
      {selectedEquipo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="bg-blue-600 p-6 flex justify-between items-center relative overflow-hidden">
              <Waves className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10" />
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Registro de Lavado CIP
                </h3>
                <p className="text-blue-100 text-sm mt-1">{selectedEquipo.nombre}</p>
              </div>
              <button onClick={() => setSelectedEquipo(null)} className="relative z-10 text-blue-200 hover:text-white transition-colors bg-white/10 p-2 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleValidarCIP} className="p-6 space-y-6">
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18}/>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  Confirme los parámetros de concentración y temperatura utilizados en el ciclo de limpieza. Valores fuera de norma no liberarán el equipo.
                </p>
              </div>

              <div className="space-y-5">
                {/* Paso 1: Enjuague */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">1</div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Enjuague Inicial</p>
                      <p className="text-xs text-slate-500">Agua a temperatura ambiente</p>
                    </div>
                    <CheckCircle className="text-green-500" size={20}/>
                  </div>
                </div>

                {/* Paso 2: Soda */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0 mt-2">2</div>
                  <div className="flex-1 border-2 border-blue-100 p-4 rounded-xl space-y-3">
                    <p className="text-sm font-bold text-blue-800 flex items-center gap-2"><Waves size={16}/> Lavado Alcalino (Soda Cáustica)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Concentración (%)</label>
                        <input type="number" step="0.1" value={sodaConc} onChange={e=>setSodaConc(e.target.value)} required
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Thermometer size={12}/> Temperatura (°C)</label>
                        <input type="number" value={sodaTemp} onChange={e=>setSodaTemp(e.target.value)} required
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paso 3: Ácido */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 flex-shrink-0 mt-2">3</div>
                  <div className="flex-1 border-2 border-purple-100 p-4 rounded-xl space-y-3">
                    <p className="text-sm font-bold text-purple-800 flex items-center gap-2"><Waves size={16}/> Lavado Ácido (Ácido Nítrico)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Concentración (%)</label>
                        <input type="number" step="0.1" value={acidoConc} onChange={e=>setAcidoConc(e.target.value)} required
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Thermometer size={12}/> Temperatura (°C)</label>
                        <input type="number" value={acidoTemp} onChange={e=>setAcidoTemp(e.target.value)} required
                          className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paso 4: Enjuague Final */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">4</div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Enjuague Final</p>
                      <p className="text-xs text-slate-500">Agua limpia para eliminar restos de químicos</p>
                    </div>
                    <CheckCircle className="text-green-500" size={20}/>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="pt-2 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setSelectedEquipo(null)}
                  className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2 text-sm"
                >
                  <ShieldCheck size={18}/> Validar CIP y Liberar Equipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
