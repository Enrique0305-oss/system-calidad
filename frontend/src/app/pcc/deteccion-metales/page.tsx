// src/app/pcc/deteccion-metales/page.tsx
"use client";
import { useState } from 'react';
import { ShieldCheck, ShieldAlert, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RegistroDeteccion {
  id: number;
  hora: string;
  lote: string;
  operador: string;
  testFe: 'Pasa' | 'Rechaza';   // Ferroso
  testNoFe: 'Pasa' | 'Rechaza'; // No Ferroso
  testSs: 'Pasa' | 'Rechaza';   // Acero Inoxidable
  observaciones: string;
}

export default function DeteccionMetalesPage() {
  const [registros, setRegistros] = useState<RegistroDeteccion[]>([
    { id: 1, hora: '08:15', lote: 'L-YOG2405-01', operador: 'Op. Alva', testFe: 'Pasa', testNoFe: 'Pasa', testSs: 'Pasa', observaciones: 'Calibración de rutina matutina conforme.' },
    { id: 2, hora: '11:30', lote: 'L-YOG2405-01', operador: 'Op. Alva', testFe: 'Pasa', testNoFe: 'Pasa', testSs: 'Rechaza', observaciones: 'Desviación en probeta SS 2.0mm. Se recalibró el equipo.' },
    { id: 3, hora: '14:00', lote: 'L-YOG2405-02', operador: 'Op. Castro', testFe: 'Pasa', testNoFe: 'Pasa', testSs: 'Pasa', observaciones: 'Monitoreo sin novedades en línea de envasado.' },
  ]);

  const [form, setForm] = useState({
    lote: '',
    operador: '',
    testFe: 'Pasa',
    testNoFe: 'Pasa',
    testSs: 'Pasa',
    observaciones: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lote || !form.operador) return alert('Por favor llene los campos obligatorios');
    
    const nuevo: RegistroDeteccion = {
      id: Date.now(),
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lote: form.lote,
      operador: form.operador,
      testFe: form.testFe as 'Pasa' | 'Rechaza',
      testNoFe: form.testNoFe as 'Pasa' | 'Rechaza',
      testSs: form.testSs as 'Pasa' | 'Rechaza',
      observaciones: form.observaciones || 'Sin observaciones.'
    };

    setRegistros([nuevo, ...registros]);
    setForm({ lote: '', operador: '', testFe: 'Pasa', testNoFe: 'Pasa', testSs: 'Pasa', observaciones: '' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Banner de Estado Crítico */}
      <div style={{ display: 'flex', background: '#fff', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderLeft: '4px solid #EF4444' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1E3A5F', margin: 0 }}>PCC-2: Detector de Metales en Envasado</h1>
          <p style={{ fontSize: '12px', color: '#7F8C8D', margin: '4px 0 0 0' }}>Monitoreo crítico de contaminación física por partículas metálicas.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', padding: '6px 12px', borderRadius: '20px', color: '#EF4444', fontSize: '12px', fontWeight: 600 }}>
          <ShieldCheck size={16} /> Estado: Monitoreo Activo
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Formulario de registro */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Registrar Verificación
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7F8C8D', marginBottom: '4px' }}>Lote Actual *</label>
              <input type="text" value={form.lote} onChange={e => setForm({...form, lote: e.target.value})} placeholder="Ej: L-YOG2405-03" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E8ECF0', fontSize: '13px' }} required />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7F8C8D', marginBottom: '4px' }}>Operador Responsable *</label>
              <input type="text" value={form.operador} onChange={e => setForm({...form, operador: e.target.value})} placeholder="Nombre del operador" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E8ECF0', fontSize: '13px' }} required />
            </div>

            {/* Selectores de Probetas */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Prueba de Probetas Patrón:</span>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#1E3A5F' }}>Ferroso (Fe 1.5mm)</span>
                <select value={form.testFe} onChange={e => setForm({...form, testFe: e.target.value})} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  <option value="Pasa">Pasa (Detecta/Rechaza)</option>
                  <option value="Rechaza">Falla (No Detecta)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#1E3A5F' }}>No Ferroso (No-Fe 1.5mm)</span>
                <select value={form.testNoFe} onChange={e => setForm({...form, testNoFe: e.target.value})} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  <option value="Pasa">Pasa (Detecta/Rechaza)</option>
                  <option value="Rechaza">Falla (No Detecta)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#1E3A5F' }}>Inoxidable (SS 2.0mm)</span>
                <select value={form.testSs} onChange={e => setForm({...form, testSs: e.target.value})} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                  <option value="Pasa">Pasa (Detecta/Rechaza)</option>
                  <option value="Rechaza">Falla (No Detecta)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7F8C8D', marginBottom: '4px' }}>Acción Correctiva / Observaciones</label>
              <textarea value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} placeholder="Describa incidencias si las hubiera..." style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E8ECF0', fontSize: '13px', height: '60px', resize: 'none' }} />
            </div>

            <button type="submit" style={{ background: '#EF4444', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Guardar Verificación Crítica
            </button>
          </form>
        </div>

        {/* Tabla de registros históricos */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1E3A5F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} /> Bitácora de Verificaciones del Turno
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '10px', color: '#64748B' }}>Hora</th>
                  <th style={{ padding: '10px', color: '#64748B' }}>Lote</th>
                  <th style={{ padding: '10px', color: '#64748B' }}>Operador</th>
                  <th style={{ padding: '10px', color: '#64748B', textAlign: 'center' }}>Fe</th>
                  <th style={{ padding: '10px', color: '#64748B', textAlign: 'center' }}>No-Fe</th>
                  <th style={{ padding: '10px', color: '#64748B', textAlign: 'center' }}>SS</th>
                  <th style={{ padding: '10px', color: '#64748B' }}>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#1E3A5F' }}>{reg.hora}</td>
                    <td style={{ padding: '12px 10px', color: '#334155' }}>{reg.lote}</td>
                    <td style={{ padding: '12px 10px', color: '#64748B' }}>{reg.operador}</td>
                    
                    {/* Status de los tests patrón */}
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      {reg.testFe === 'Pasa' ? <CheckCircle size={15} style={{ color: '#2ECC71', margin: '0 auto' }} /> : <XCircle size={15} style={{ color: '#EF4444', margin: '0 auto' }} />}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      {reg.testNoFe === 'Pasa' ? <CheckCircle size={15} style={{ color: '#2ECC71', margin: '0 auto' }} /> : <XCircle size={15} style={{ color: '#EF4444', margin: '0 auto' }} />}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      {reg.testSs === 'Pasa' ? <CheckCircle size={15} style={{ color: '#2ECC71', margin: '0 auto' }} /> : <XCircle size={15} style={{ color: '#EF4444', margin: '0 auto' }} />}
                    </td>

                    <td style={{ padding: '12px 10px', color: '#64748B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={reg.observaciones}>
                      {reg.observaciones}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}