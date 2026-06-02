"use client";
import React, { useState } from 'react';
import { Droplets, CheckCircle, AlertTriangle, ShieldCheck, Waves, X, Save, Clock, Thermometer } from 'lucide-react';

type EquipEstado = 'Limpio' | 'Sucio';

interface Equipo {
  id: string;
  nombre: string;
  area: string;
  estado: EquipEstado;
  ultimoLavado: string;
  responsable?: string;
}

const equiposIniciales: Equipo[] = [
  { id: '1', nombre: 'Tanque de Recepción A', area: 'Recepción MP', estado: 'Limpio', ultimoLavado: 'Hace 2 horas', responsable: 'Javier Ramos' },
  { id: '2', nombre: 'Pasteurizador HTST', area: 'Tratamiento Térmico', estado: 'Sucio', ultimoLavado: 'Ayer' },
  { id: '3', nombre: 'Tanque de Incubación 1', area: 'Fermentación', estado: 'Limpio', ultimoLavado: 'Hace 5 horas', responsable: 'Pedro Vega' },
  { id: '4', nombre: 'Envasadora Lineal 200ml', area: 'Envasado', estado: 'Sucio', ultimoLavado: 'Hace 10 horas' },
  { id: '5', nombre: 'Tubería Principal (Línea B)', area: 'Distribución', estado: 'Limpio', ultimoLavado: 'Hace 1 hora', responsable: 'M. López' }
];

export default function RegistroCIP() {
  const [equipos, setEquipos] = useState<Equipo[]>(equiposIniciales);
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);

  // Form states
  const [sodaConc, setSodaConc] = useState('2.5');
  const [sodaTemp, setSodaTemp] = useState('80');
  const [acidoConc, setAcidoConc] = useState('1.5');
  const [acidoTemp, setAcidoTemp] = useState('65');

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

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplets className="text-blue-500" /> Registros de Limpieza (CIP)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Validación de limpieza in-situ obligatoria antes de iniciar producción.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-xs text-green-700 font-bold uppercase">Equipos Limpios</span>
            <span className="text-2xl font-extrabold text-green-600">{equipos.filter(e=>e.estado === 'Limpio').length}</span>
          </div>
          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-xs text-red-700 font-bold uppercase">Requieren Lavado</span>
            <span className="text-2xl font-extrabold text-red-600">{equipos.filter(e=>e.estado === 'Sucio').length}</span>
          </div>
        </div>
      </div>

      {/* Grid de Equipos */}
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
