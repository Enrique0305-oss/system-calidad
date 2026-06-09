import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface RackInfo {
  id: string;
  zona: string;
  fila: string;
  nivel: number;
  producto: string;
  lote: string;
  cantidad: number;
  unidad: string;
  estado: 'Disponible' | 'En proceso' | 'Agotado' | 'Por vencer';
}

const racks: RackInfo[] = [
  { id: 'A1', zona: 'A', fila: 'Fila 1', nivel: 1, producto: 'Leche cruda entera', lote: 'LMP-2026-001', cantidad: 2500, unidad: 'L', estado: 'En proceso' },
  { id: 'A2', zona: 'A', fila: 'Fila 1', nivel: 2, producto: 'Leche cruda entera', lote: 'LMP-2026-002', cantidad: 1800, unidad: 'L', estado: 'Disponible' },
  { id: 'A3', zona: 'A', fila: 'Fila 2', nivel: 1, producto: 'Cultivo láctico', lote: 'LMP-2026-003', cantidad: 5, unidad: 'kg', estado: 'Disponible' },
  { id: 'A4', zona: 'A', fila: 'Fila 2', nivel: 3, producto: 'Pulpa de fresa', lote: 'LMP-2026-005', cantidad: 80, unidad: 'kg', estado: 'Disponible' },
  { id: 'B1', zona: 'B', fila: 'Picking 1', nivel: 1, producto: 'Azúcar refinada', lote: 'LMP-2026-004', cantidad: 300, unidad: 'kg', estado: 'Disponible' },
  { id: 'B2', zona: 'B', fila: 'Picking 2', nivel: 2, producto: 'Pulpa de maracuyá', lote: 'LMP-2026-006', cantidad: 60, unidad: 'kg', estado: 'En proceso' },
  { id: 'C1', zona: 'C', fila: 'Embalaje 1', nivel: 1, producto: 'Envases PP 200ml', lote: 'LMP-2026-008', cantidad: 5000, unidad: 'und', estado: 'Disponible' },
  { id: 'D1', zona: 'D', fila: 'Expedición 1', nivel: 1, producto: 'Leche cruda (agotado)', lote: 'LMP-2026-007', cantidad: 0, unidad: 'L', estado: 'Agotado' },
];

const STATUS_COLOR: Record<string, string> = {
  Disponible: '#2ECC71',
  'En proceso': '#3B82F6',
  Agotado: '#E74C3C',
  'Por vencer': '#F1C40F',
};

interface TooltipState {
  rack: RackInfo;
  x: number;
  y: number;
}

function RackUnit({ rack, onClick }: { rack: RackInfo; onClick: (r: RackInfo, e: React.MouseEvent) => void }) {
  return (
    <div
      onClick={e => onClick(rack, e)}
      title={rack.producto}
      style={{
        width: 48, height: 40, borderRadius: 6, cursor: 'pointer', border: `2px solid ${STATUS_COLOR[rack.estado]}`,
        background: `${STATUS_COLOR[rack.estado]}20`, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700,
        color: STATUS_COLOR[rack.estado], transition: 'all 0.15s', position: 'relative',
        gap: 1,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; (e.currentTarget as HTMLElement).style.zIndex = '10'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.zIndex = '1'; }}
    >
      <div style={{ fontSize: 14 }}>📦</div>
      <div>{rack.id}</div>
    </div>
  );
}

function EmptyRack() {
  return (
    <div style={{ width: 48, height: 40, borderRadius: 6, border: '1.5px dashed #D1D9E0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#E2E8F0' }}>
      +
    </div>
  );
}

function Forklift({ style }: { style?: React.CSSProperties }) {
  return <div style={{ fontSize: 24, userSelect: 'none', ...style }}>🚐</div>;
}

function Truck({ style }: { style?: React.CSSProperties }) {
  return <div style={{ fontSize: 28, userSelect: 'none', ...style }}>🚚</div>;
}

export default function LayoutAlmacen() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filterZona, setFilterZona] = useState<string>('Todas');

  const handleRackClick = (rack: RackInfo, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).closest('#warehouse-container')?.getBoundingClientRect();
    const elemRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (rect) {
      setTooltip({ rack, x: elemRect.left - rect.left + elemRect.width / 2, y: elemRect.top - rect.top });
    }
  };

  const zonaARacks = racks.filter(r => r.zona === 'A');
  const zonaBRacks = racks.filter(r => r.zona === 'B');
  const zonaCRacks = racks.filter(r => r.zona === 'C');
  const zonaDRacks = racks.filter(r => r.zona === 'D');

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1E3A5F' }}>Lay Out del Almacén</h1>
          <p style={{ fontSize: 13, color: '#7F8C8D', marginTop: 2 }}>Plano visual interactivo · 60m × 40m · Haz clic en cada rack para ver detalles</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, background: '#F1F5F9', padding: 4, borderRadius: 10 }}>
            {(['map', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', border: 'none', background: view === v ? '#fff' : 'transparent', color: view === v ? '#1E3A5F' : '#7F8C8D', boxShadow: view === v ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.15s' }}>
                {v === 'map' ? '🗺️ Mapa visual' : '📋 Ver en lista'}
              </button>
            ))}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            <Plus size={14} /> Nuevo Ingreso
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_COLOR).map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7F8C8D' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7F8C8D', marginLeft: 'auto' }}>
          <div style={{ width: 14, height: 14, border: '1.5px dashed #D1D9E0', borderRadius: 3 }} />
          Espacio vacío
        </div>
      </div>

      {view === 'map' ? (
        <>
          {/* Warehouse Floor Plan */}
          <div
            id="warehouse-container"
            style={{
              position: 'relative', background: '#F8FAFC', borderRadius: 16,
              border: '2px solid #E2E8F0', padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              minHeight: 500,
            }}
          >
            {/* Dimension labels */}
            <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: '#B0BEC5', fontWeight: 600, letterSpacing: '1px' }}>← 60 METROS →</div>
            <div style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: 10, color: '#B0BEC5', fontWeight: 600, letterSpacing: '1px' }}>← 40 METROS →</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, marginLeft: 20, marginTop: 10 }}>
              {/* ZONA A — Insumos Secos */}
              <div style={{ background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: 12, padding: 16, position: 'relative', minHeight: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: '#2ECC71' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Zona A — Insumos Secos</span>
                </div>
                {/* Racks grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 48px)', gap: 6 }}>
                  {zonaARacks.map(r => <RackUnit key={r.id} rack={r} onClick={handleRackClick} />)}
                  {Array.from({ length: Math.max(0, 8 - zonaARacks.length) }).map((_, i) => <EmptyRack key={`ea${i}`} />)}
                </div>
              </div>

              {/* ZONA B — Cámara de Frío */}
              <div style={{ background: '#FFFBEB', border: '2px solid #FCD34D', borderRadius: 12, padding: 16, position: 'relative', minHeight: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: '#F59E0B' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Zona B — Cámara de Frío</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 48px)', gap: 6 }}>
                  {zonaBRacks.map(r => <RackUnit key={r.id} rack={r} onClick={handleRackClick} />)}
                  {Array.from({ length: Math.max(0, 8 - zonaBRacks.length) }).map((_, i) => <EmptyRack key={`eb${i}`} />)}
                </div>
              </div>

              {/* ZONA C — Material de Empaque */}
              <div style={{ background: '#FFF7ED', border: '2px solid #FDBA74', borderRadius: 12, padding: 16, position: 'relative', minHeight: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: '#F97316' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Zona C — Material de Empaque</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 48px)', gap: 6 }}>
                  {zonaCRacks.map(r => <RackUnit key={r.id} rack={r} onClick={handleRackClick} />)}
                  {Array.from({ length: Math.max(0, 8 - zonaCRacks.length) }).map((_, i) => <EmptyRack key={`ec${i}`} />)}
                </div>
              </div>

              {/* ZONA D — Químicos y Limpieza */}
              <div style={{ background: '#F5F3FF', border: '2px solid #C4B5FD', borderRadius: 12, padding: 16, position: 'relative', minHeight: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: '#7C3AED' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Zona D — Químicos y Limpieza</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 48px)', gap: 6 }}>
                  {zonaDRacks.map(r => <RackUnit key={r.id} rack={r} onClick={handleRackClick} />)}
                  {Array.from({ length: Math.max(0, 8 - zonaDRacks.length) }).map((_, i) => <EmptyRack key={`ed${i}`} />)}
                </div>
              </div>
            </div>


            {/* Tooltip */}
            {tooltip && (
              <div
                style={{
                  position: 'absolute', left: tooltip.x - 100, top: tooltip.y - 160, width: 200,
                  background: '#1E3A5F', borderRadius: 10, padding: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  zIndex: 50, color: '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#93C5FD' }}>Rack {tooltip.rack.id}</span>
                  <button onClick={() => setTooltip(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 0 }}>
                    <X size={12} />
                  </button>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#fff' }}>{tooltip.rack.producto}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 11 }}>
                  {[
                    ['Lote', tooltip.rack.lote],
                    ['Nivel', String(tooltip.rack.nivel)],
                    ['Cantidad', `${tooltip.rack.cantidad} ${tooltip.rack.unidad}`],
                    ['Zona', `Zona ${tooltip.rack.zona}`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k}</p>
                      <p style={{ color: '#fff', fontWeight: 600, fontFamily: 'monospace', fontSize: 11 }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: `${STATUS_COLOR[tooltip.rack.estado]}25`, color: STATUS_COLOR[tooltip.rack.estado] }}>
                    ● {tooltip.rack.estado}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Summary Table */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8ECF0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', marginTop: 16 }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#2C3E50' }}>Resumen de Ocupación por Zona</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {[
                { zona: 'A', label: 'Insumos Secos', color: '#2ECC71', bg: '#F0FDF4', count: zonaARacks.length, max: 8 },
                { zona: 'B', label: 'Cámara de Frío', color: '#F59E0B', bg: '#FFFBEB', count: zonaBRacks.length, max: 8 },
                { zona: 'C', label: 'Mat. Empaque', color: '#F97316', bg: '#FFF7ED', count: zonaCRacks.length, max: 8 },
                { zona: 'D', label: 'Químicos', color: '#7C3AED', bg: '#F5F3FF', count: zonaDRacks.length, max: 8 },
              ].map((z, i) => (
                <div key={z.zona} style={{ padding: '14px 20px', borderRight: i < 3 ? '1px solid #F1F5F9' : 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: z.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Zona {z.zona} — {z.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#2C3E50' }}>{z.count}<span style={{ fontSize: 14, fontWeight: 400, color: '#B0BEC5' }}>/{z.max}</span></div>
                  <div style={{ fontSize: 11, color: '#7F8C8D', marginTop: 2 }}>racks ocupados</div>
                  <div style={{ marginTop: 8, background: '#F1F5F9', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${(z.count / z.max) * 100}%`, height: '100%', background: z.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8ECF0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2C3E50' }}>Inventario Detallado del Almacén</h3>
            <select value={filterZona} onChange={e => setFilterZona(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #E2E8F0', fontSize: 13, color: '#2C3E50', background: '#F8FAFC', outline: 'none', cursor: 'pointer' }}>
              <option value="Todas">Todas las Zonas</option>
              <option value="A">Zona A - Insumos Secos</option>
              <option value="B">Zona B - Cámara de Frío</option>
              <option value="C">Zona C - Material de Empaque</option>
              <option value="D">Zona D - Químicos y Limpieza</option>
            </select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#7F8C8D' }}>Rack / Zona</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#7F8C8D' }}>Lote</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#7F8C8D' }}>Producto</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 600, color: '#7F8C8D' }}>Cantidad</th>
                  <th style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 600, color: '#7F8C8D' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {racks.filter(r => filterZona === 'Todas' || r.zona === filterZona).map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, background: '#1E3A5F', color: '#fff', padding: '2px 6px', borderRadius: 4 }}>{r.id}</span>
                        <span style={{ fontSize: 12, color: '#7F8C8D' }}>Zona {r.zona}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#1E3A5F' }}>{r.lote}</td>
                    <td style={{ padding: '12px 20px', fontWeight: 500, color: '#2C3E50' }}>{r.producto}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 600, color: '#2C3E50' }}>{r.cantidad} <span style={{ fontSize: 11, color: '#7F8C8D' }}>{r.unidad}</span></td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12, background: `${STATUS_COLOR[r.estado]}15`, color: STATUS_COLOR[r.estado] }}>
                        ● {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
                {racks.filter(r => filterZona === 'Todas' || r.zona === filterZona).length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: '#B0BEC5', fontSize: 14 }}>
                      No hay registros en esta zona.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
