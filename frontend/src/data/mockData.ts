// ─── TYPES ────────────────────────────────────────────────────────────────────

export type LoteEstado = 'Disponible' | 'En proceso' | 'Agotado';
export type MovTipo = 'Entrada' | 'Salida' | 'Ajuste';
export type OCEstado = 'Borrador' | 'Enviada' | 'Aprobada' | 'Recibida' | 'Cerrada';
export type PasoEstado = 'Pendiente' | 'En curso' | 'Completado' | 'Alerta';

export interface Proveedor {
  id: string;
  nombre: string;
  ruc: string;
  contacto: string;
  telefono: string;
  correo: string;
  productos: string[];
  estado: 'Activo' | 'Inactivo';
  calificacion: number;
  direccion: string;
}

export interface LoteMP {
  id: string;
  lote: string;
  producto: string;
  proveedor: string;
  fechaIngreso: string;
  cantidad: number;
  unidad: string;
  nivel: 1 | 2 | 3;
  estado: LoteEstado;
  fechaVencimiento: string;
  certificado?: string;
}

export interface KardexEntry {
  id: string;
  fecha: string;
  tipo: MovTipo;
  lote: string;
  producto: string;
  cantidadEntrada: number;
  cantidadSalida: number;
  saldo: number;
  usuario: string;
  observacion: string;
}

export interface OrdenCompra {
  id: string;
  numero: string;
  proveedor: string;
  productos: { nombre: string; cantidad: number; unidad: string; precioUnit: number }[];
  estado: OCEstado;
  fechaCreacion: string;
  fechaRequerida: string;
  aprobador: string;
  observaciones: string;
  total: number;
}

export interface AjusteInventario {
  id: string;
  fecha: string;
  producto: string;
  lote: string;
  cantidadSistema: number;
  cantidadReal: number;
  diferencia: number;
  motivo: string;
  observacion: string;
  usuario: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

export interface PasoRegistro {
  campo1: number; // cantidad MP ingresada
  campo2: number; // temperatura
  campo3: number; // tiempo
  campo4: number; // cantidad resultante
  campo5: number; // merma
  observaciones: string;
  completado: boolean;
  fecha: string;
  operador: string;
}

export interface PasoProceso {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string;
  estado: PasoEstado;
  campos: { label: string; unidad: string }[];
  registro?: PasoRegistro;
}

export interface LotePT {
  id: string;
  lote: string;
  producto: string;
  presentacion: string;
  fechaProduccion: string;
  fechaVencimiento: string;
  cantidad: number;
  nivel: 1 | 2 | 3;
  estado: LoteEstado;
  loteOrigenProceso: string;
}

export interface KardexPTEntry {
  id: string;
  fecha: string;
  tipo: MovTipo;
  lote: string;
  producto: string;
  presentacion: string;
  unidadesEntrada: number;
  unidadesSalida: number;
  saldo: number;
  destino: string;
  usuario: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

export const proveedores: Proveedor[] = [
  { id: 'P001', nombre: 'Lácteos del Norte SAC', ruc: '20123456789', contacto: 'Carlos Mendoza', telefono: '+51 944 123 456', correo: 'carlos@lacteosnorte.pe', productos: ['Leche cruda entera', 'Leche semidescremada'], estado: 'Activo', calificacion: 5, direccion: 'Av. Industrial 234, Trujillo' },
  { id: 'P002', nombre: 'BioKultivos Peru SA', ruc: '20987654321', contacto: 'Ana Flores', telefono: '+51 955 234 567', correo: 'ana@biokultivos.pe', productos: ['Cultivo láctico termofílico', 'Cultivo bifidus'], estado: 'Activo', calificacion: 4, direccion: 'Jr. Ciencia 567, Lima' },
  { id: 'P003', nombre: 'Azucares del Sur EIRL', ruc: '20456789012', contacto: 'Miguel Torres', telefono: '+51 966 345 678', correo: 'miguel@azucaressur.pe', productos: ['Azúcar refinada', 'Fructosa'], estado: 'Activo', calificacion: 4, direccion: 'Calle Comercio 89, Arequipa' },
  { id: 'P004', nombre: 'Frutas Andinas SAC', ruc: '20654321098', contacto: 'Lucía Quispe', telefono: '+51 977 456 789', correo: 'lucia@frutasandinas.pe', productos: ['Pulpa de fresa', 'Pulpa de maracuyá', 'Pulpa de durazno'], estado: 'Activo', calificacion: 3, direccion: 'Av. Agro 12, Cusco' },
  { id: 'P005', nombre: 'Envases Modernos SA', ruc: '20321654987', contacto: 'Roberto Salas', telefono: '+51 988 567 890', correo: 'roberto@envasesmodernos.pe', productos: ['Envases PP 150ml', 'Envases PP 200ml', 'Tapas termoformadas'], estado: 'Inactivo', calificacion: 2, direccion: 'Parque Industrial, Lima Norte' },
];

export const lotesMP: LoteMP[] = [
  { id: 'L001', lote: 'LMP-2026-001', producto: 'Leche cruda entera', proveedor: 'Lácteos del Norte SAC', fechaIngreso: '2026-04-22', cantidad: 2500, unidad: 'L', nivel: 1, estado: 'En proceso', fechaVencimiento: '2026-04-24' },
  { id: 'L002', lote: 'LMP-2026-002', producto: 'Leche cruda entera', proveedor: 'Lácteos del Norte SAC', fechaIngreso: '2026-04-22', cantidad: 1800, unidad: 'L', nivel: 2, estado: 'Disponible', fechaVencimiento: '2026-04-24' },
  { id: 'L003', lote: 'LMP-2026-003', producto: 'Cultivo láctico termofílico', proveedor: 'BioKultivos Peru SA', fechaIngreso: '2026-04-20', cantidad: 5, unidad: 'kg', nivel: 1, estado: 'Disponible', fechaVencimiento: '2026-06-20' },
  { id: 'L004', lote: 'LMP-2026-004', producto: 'Azúcar refinada', proveedor: 'Azucares del Sur EIRL', fechaIngreso: '2026-04-18', cantidad: 300, unidad: 'kg', nivel: 3, estado: 'Disponible', fechaVencimiento: '2027-04-18' },
  { id: 'L005', lote: 'LMP-2026-005', producto: 'Pulpa de fresa', proveedor: 'Frutas Andinas SAC', fechaIngreso: '2026-04-21', cantidad: 80, unidad: 'kg', nivel: 2, estado: 'Disponible', fechaVencimiento: '2026-05-21' },
  { id: 'L006', lote: 'LMP-2026-006', producto: 'Pulpa de maracuyá', proveedor: 'Frutas Andinas SAC', fechaIngreso: '2026-04-21', cantidad: 60, unidad: 'kg', nivel: 2, estado: 'En proceso', fechaVencimiento: '2026-05-21' },
  { id: 'L007', lote: 'LMP-2026-007', producto: 'Leche cruda entera', proveedor: 'Lácteos del Norte SAC', fechaIngreso: '2026-04-19', cantidad: 0, unidad: 'L', nivel: 1, estado: 'Agotado', fechaVencimiento: '2026-04-21' },
  { id: 'L008', lote: 'LMP-2026-008', producto: 'Envases PP 200ml', proveedor: 'Envases Modernos SA', fechaIngreso: '2026-04-15', cantidad: 5000, unidad: 'und', nivel: 3, estado: 'Disponible', fechaVencimiento: '2028-04-15' },
];

export const kardexMP: KardexEntry[] = [
  { id: 'K001', fecha: '2026-04-22 08:30', tipo: 'Entrada', lote: 'LMP-2026-001', producto: 'Leche cruda entera', cantidadEntrada: 2500, cantidadSalida: 0, saldo: 2500, usuario: 'Javier Ramos', observacion: 'Ingreso matutino – Tanque A' },
  { id: 'K002', fecha: '2026-04-22 08:45', tipo: 'Entrada', lote: 'LMP-2026-002', producto: 'Leche cruda entera', cantidadEntrada: 1800, cantidadSalida: 0, saldo: 4300, usuario: 'Javier Ramos', observacion: 'Ingreso matutino – Tanque B' },
  { id: 'K003', fecha: '2026-04-22 09:00', tipo: 'Salida', lote: 'LMP-2026-001', producto: 'Leche cruda entera', cantidadEntrada: 0, cantidadSalida: 500, saldo: 3800, usuario: 'María López', observacion: 'Traslado a pasteurización – Lote proceso P-001' },
  { id: 'K004', fecha: '2026-04-21 10:15', tipo: 'Entrada', lote: 'LMP-2026-003', producto: 'Cultivo láctico termofílico', cantidadEntrada: 5, cantidadSalida: 0, saldo: 5, usuario: 'Pedro Vega', observacion: 'Cadena de frío OK' },
  { id: 'K005', fecha: '2026-04-21 14:30', tipo: 'Salida', lote: 'LMP-2026-007', producto: 'Leche cruda entera', cantidadEntrada: 0, cantidadSalida: 2200, saldo: 0, usuario: 'María López', observacion: 'Producción batch tarde' },
  { id: 'K006', fecha: '2026-04-20 11:00', tipo: 'Ajuste', lote: 'LMP-2026-004', producto: 'Azúcar refinada', cantidadEntrada: 0, cantidadSalida: 20, saldo: 300, usuario: 'Supervisor García', observacion: 'Ajuste por merma en transporte interno' },
  { id: 'K007', fecha: '2026-04-20 16:00', tipo: 'Entrada', lote: 'LMP-2026-005', producto: 'Pulpa de fresa', cantidadEntrada: 80, cantidadSalida: 0, saldo: 80, usuario: 'Javier Ramos', observacion: '' },
  { id: 'K008', fecha: '2026-04-19 09:30', tipo: 'Entrada', lote: 'LMP-2026-006', producto: 'Pulpa de maracuyá', cantidadEntrada: 60, cantidadSalida: 0, saldo: 60, usuario: 'Javier Ramos', observacion: '' },
];

export const ordenesCompra: OrdenCompra[] = [
  { id: 'OC001', numero: 'OC-2026-001', proveedor: 'Lácteos del Norte SAC', productos: [{ nombre: 'Leche cruda entera', cantidad: 5000, unidad: 'L', precioUnit: 1.8 }], estado: 'Aprobada', fechaCreacion: '2026-04-20', fechaRequerida: '2026-04-24', aprobador: 'Ing. García', observaciones: 'Entrega en 2 partes', total: 9000 },
  { id: 'OC002', numero: 'OC-2026-002', proveedor: 'BioKultivos Peru SA', productos: [{ nombre: 'Cultivo láctico termofílico', cantidad: 10, unidad: 'kg', precioUnit: 450 }], estado: 'Recibida', fechaCreacion: '2026-04-18', fechaRequerida: '2026-04-21', aprobador: 'Ing. García', observaciones: '', total: 4500 },
  { id: 'OC003', numero: 'OC-2026-003', proveedor: 'Azucares del Sur EIRL', productos: [{ nombre: 'Azúcar refinada', cantidad: 500, unidad: 'kg', precioUnit: 2.5 }, { nombre: 'Fructosa', cantidad: 100, unidad: 'kg', precioUnit: 4.2 }], estado: 'Enviada', fechaCreacion: '2026-04-22', fechaRequerida: '2026-04-28', aprobador: 'Ing. García', observaciones: 'Urgente para producción semanal', total: 1670 },
  { id: 'OC004', numero: 'OC-2026-004', proveedor: 'Frutas Andinas SAC', productos: [{ nombre: 'Pulpa de fresa', cantidad: 200, unidad: 'kg', precioUnit: 8.5 }, { nombre: 'Pulpa de durazno', cantidad: 150, unidad: 'kg', precioUnit: 7.8 }], estado: 'Borrador', fechaCreacion: '2026-04-22', fechaRequerida: '2026-04-30', aprobador: '', observaciones: 'Pendiente aprobación', total: 2870 },
  { id: 'OC005', numero: 'OC-2026-005', proveedor: 'Lácteos del Norte SAC', productos: [{ nombre: 'Leche cruda entera', cantidad: 3000, unidad: 'L', precioUnit: 1.8 }], estado: 'Cerrada', fechaCreacion: '2026-04-10', fechaRequerida: '2026-04-15', aprobador: 'Ing. García', observaciones: '', total: 5400 },
];

export const ajustes: AjusteInventario[] = [
  { id: 'AJ001', fecha: '2026-04-20 11:00', producto: 'Azúcar refinada', lote: 'LMP-2026-004', cantidadSistema: 320, cantidadReal: 300, diferencia: -20, motivo: 'Merma', observacion: 'Pérdida en transporte interno, bolsa rota', usuario: 'Pedro Vega', estado: 'Aprobado' },
  { id: 'AJ002', fecha: '2026-04-18 14:30', producto: 'Pulpa de maracuyá', lote: 'LMP-2026-006', cantidadSistema: 65, cantidadReal: 60, diferencia: -5, motivo: 'Error de conteo', observacion: 'Reconteo realizado', usuario: 'María López', estado: 'Aprobado' },
  { id: 'AJ003', fecha: '2026-04-22 09:00', producto: 'Leche cruda entera', lote: 'LMP-2026-001', cantidadSistema: 2500, cantidadReal: 2480, diferencia: -20, motivo: 'Merma', observacion: 'Pérdida por evaporación en tanque abierto', usuario: 'Javier Ramos', estado: 'Pendiente' },
];

export const pasosProceso: PasoProceso[] = [
  {
    id: 1, nombre: 'Recepción', icono: '🥛', descripcion: 'Registro del ingreso de leche cruda desde el proveedor. Verificación de temperatura, densidad y acidez.', estado: 'Completado',
    campos: [
      { label: 'Litros recibidos', unidad: 'L' },
      { label: 'Temperatura de llegada', unidad: '°C' },
      { label: 'Densidad', unidad: 'g/ml' },
      { label: 'Acidez inicial', unidad: '°D' },
      { label: 'Cantidad rechazada', unidad: 'L' },
    ],
    registro: { campo1: 2500, campo2: 6.5, campo3: 0, campo4: 2480, campo5: 20, observaciones: 'Leche con temperatura adecuada. Acidez dentro de parámetros.', completado: true, fecha: '2026-04-22 07:30', operador: 'Javier Ramos' },
  },
  {
    id: 2, nombre: 'Almacenaje', icono: '🏗️', descripcion: 'Control de la leche cruda en tanques de frío. Registro de tanque asignado y condiciones de almacenamiento.', estado: 'Completado',
    campos: [
      { label: 'Tanque asignado (N°)', unidad: '' },
      { label: 'Litros almacenados', unidad: 'L' },
      { label: 'Temperatura de almacenamiento', unidad: '°C' },
      { label: 'Tiempo en almacén', unidad: 'min' },
      { label: 'Capacidad disponible', unidad: 'L' },
    ],
    registro: { campo1: 2, campo2: 2480, campo3: 4.0, campo4: 120, campo5: 520, observaciones: 'Tanque 2 asignado. Temperatura estable.', completado: true, fecha: '2026-04-22 07:45', operador: 'Javier Ramos' },
  },
  {
    id: 3, nombre: 'Fraccionamiento', icono: '⚗️', descripcion: 'División del volumen de leche para diferentes líneas o lotes de producción.', estado: 'Completado',
    campos: [
      { label: 'Cantidad fraccionada total', unidad: 'L' },
      { label: 'Temperatura', unidad: '°C' },
      { label: 'Tiempo de proceso', unidad: 'min' },
      { label: 'Cantidad por línea', unidad: 'L' },
      { label: 'Pérdida en fraccionamiento', unidad: 'L' },
    ],
    registro: { campo1: 2480, campo2: 4.2, campo3: 30, campo4: 2460, campo5: 20, observaciones: 'División en 2 líneas de 1230L c/u', completado: true, fecha: '2026-04-22 08:10', operador: 'María López' },
  },
  {
    id: 4, nombre: 'Pasteurización', icono: '🌡️', descripcion: 'Tratamiento térmico para eliminar patógenos. Temperatura mínima 72°C por 15 segundos.', estado: 'En curso',
    campos: [
      { label: 'Litros procesados', unidad: 'L' },
      { label: 'Temperatura de proceso', unidad: '°C' },
      { label: 'Tiempo de exposición', unidad: 'seg' },
      { label: 'Resultado de control', unidad: '' },
      { label: 'Cantidad descartada', unidad: 'L' },
    ],
    registro: undefined,
  },
  {
    id: 5, nombre: 'Enfriado', icono: '❄️', descripcion: 'Reducción de temperatura post-pasteurización para preparar la inoculación del cultivo (40–45°C).', estado: 'Pendiente',
    campos: [
      { label: 'Temperatura inicial', unidad: '°C' },
      { label: 'Temperatura final', unidad: '°C' },
      { label: 'Tiempo de enfriamiento', unidad: 'min' },
      { label: 'Litros enfriados', unidad: 'L' },
      { label: 'Equipo utilizado (código)', unidad: '' },
    ],
    registro: undefined,
  },
  {
    id: 6, nombre: 'Cultivo', icono: '🧫', descripcion: 'Inoculación de bacterias lácticas para la fermentación del yogurt.', estado: 'Pendiente',
    campos: [
      { label: 'Cantidad de cultivo agregado', unidad: 'g' },
      { label: 'Temperatura de incubación', unidad: '°C' },
      { label: 'Tiempo de fermentación', unidad: 'h' },
      { label: 'Litros inoculados', unidad: 'L' },
      { label: 'pH final medido', unidad: '' },
    ],
    registro: undefined,
  },
  {
    id: 7, nombre: 'Mezclado', icono: '🥄', descripcion: 'Incorporación de ingredientes adicionales: azúcar, frutas, saborizantes, etc.', estado: 'Pendiente',
    campos: [
      { label: 'Azúcar agregada', unidad: 'kg' },
      { label: 'Pulpa de fruta agregada', unidad: 'kg' },
      { label: 'Tiempo de mezclado', unidad: 'min' },
      { label: 'Litros base', unidad: 'L' },
      { label: 'Descarte de mezcla', unidad: 'kg' },
    ],
    registro: undefined,
  },
  {
    id: 8, nombre: 'Envasado', icono: '🏭', descripcion: 'Llenado y sellado en envases finales. Asignación del lote de producto terminado.', estado: 'Pendiente',
    campos: [
      { label: 'Unidades envasadas', unidad: 'und' },
      { label: 'Temperatura de llenado', unidad: '°C' },
      { label: 'Tiempo de envasado', unidad: 'min' },
      { label: 'Volumen por unidad', unidad: 'ml' },
      { label: 'Unidades defectuosas', unidad: 'und' },
    ],
    registro: undefined,
  },
  {
    id: 9, nombre: 'Almacenado', icono: '📦', descripcion: 'Ingreso del producto terminado al almacén de PT. Registro de ubicación y condiciones de conservación.', estado: 'Pendiente',
    campos: [
      { label: 'Cantidad de unidades PT', unidad: 'und' },
      { label: 'Temperatura de conservación', unidad: '°C' },
      { label: 'Tiempo de espera mínimo', unidad: 'h' },
      { label: 'Nivel de almacén asignado', unidad: '' },
      { label: 'Unidades con observación', unidad: 'und' },
    ],
    registro: undefined,
  },
];

export const lotesPT: LotePT[] = [
  { id: 'PT001', lote: 'LPT-2026-001', producto: 'Yogurt natural', presentacion: '200ml', fechaProduccion: '2026-04-21', fechaVencimiento: '2026-05-21', cantidad: 1200, nivel: 1, estado: 'Disponible', loteOrigenProceso: 'PROC-2026-015' },
  { id: 'PT002', lote: 'LPT-2026-002', producto: 'Yogurt de fresa', presentacion: '200ml', fechaProduccion: '2026-04-21', fechaVencimiento: '2026-05-21', cantidad: 950, nivel: 1, estado: 'En proceso', loteOrigenProceso: 'PROC-2026-015' },
  { id: 'PT003', lote: 'LPT-2026-003', producto: 'Yogurt de maracuyá', presentacion: '150ml', fechaProduccion: '2026-04-20', fechaVencimiento: '2026-05-20', cantidad: 800, nivel: 2, estado: 'Disponible', loteOrigenProceso: 'PROC-2026-014' },
  { id: 'PT004', lote: 'LPT-2026-004', producto: 'Yogurt natural', presentacion: '150ml', fechaProduccion: '2026-04-19', fechaVencimiento: '2026-05-19', cantidad: 0, nivel: 3, estado: 'Agotado', loteOrigenProceso: 'PROC-2026-013' },
  { id: 'PT005', lote: 'LPT-2026-005', producto: 'Yogurt de durazno', presentacion: '200ml', fechaProduccion: '2026-04-22', fechaVencimiento: '2026-05-22', cantidad: 600, nivel: 1, estado: 'Disponible', loteOrigenProceso: 'PROC-2026-016' },
];

export const kardexPT: KardexPTEntry[] = [
  { id: 'KPT001', fecha: '2026-04-22 15:00', tipo: 'Entrada', lote: 'LPT-2026-005', producto: 'Yogurt de durazno', presentacion: '200ml', unidadesEntrada: 600, unidadesSalida: 0, saldo: 600, destino: '', usuario: 'Pedro Vega' },
  { id: 'KPT002', fecha: '2026-04-21 14:30', tipo: 'Entrada', lote: 'LPT-2026-001', producto: 'Yogurt natural', presentacion: '200ml', unidadesEntrada: 1200, unidadesSalida: 0, saldo: 1200, destino: '', usuario: 'Pedro Vega' },
  { id: 'KPT003', fecha: '2026-04-21 14:45', tipo: 'Entrada', lote: 'LPT-2026-002', producto: 'Yogurt de fresa', presentacion: '200ml', unidadesEntrada: 950, unidadesSalida: 0, saldo: 950, destino: '', usuario: 'Pedro Vega' },
  { id: 'KPT004', fecha: '2026-04-21 16:00', tipo: 'Salida', lote: 'LPT-2026-001', producto: 'Yogurt natural', presentacion: '200ml', unidadesEntrada: 0, unidadesSalida: 200, saldo: 1000, destino: 'Distribuidora Lima Norte', usuario: 'María López' },
  { id: 'KPT005', fecha: '2026-04-20 13:00', tipo: 'Entrada', lote: 'LPT-2026-003', producto: 'Yogurt de maracuyá', presentacion: '150ml', unidadesEntrada: 800, unidadesSalida: 0, saldo: 800, destino: '', usuario: 'Pedro Vega' },
  { id: 'KPT006', fecha: '2026-04-20 17:00', tipo: 'Salida', lote: 'LPT-2026-003', producto: 'Yogurt de maracuyá', presentacion: '150ml', unidadesEntrada: 0, unidadesSalida: 150, saldo: 650, destino: 'Supermercado Los Andes', usuario: 'María López' },
  { id: 'KPT007', fecha: '2026-04-19 12:00', tipo: 'Entrada', lote: 'LPT-2026-004', producto: 'Yogurt natural', presentacion: '150ml', unidadesEntrada: 500, unidadesSalida: 0, saldo: 500, destino: '', usuario: 'Pedro Vega' },
  { id: 'KPT008', fecha: '2026-04-19 18:00', tipo: 'Salida', lote: 'LPT-2026-004', producto: 'Yogurt natural', presentacion: '150ml', unidadesEntrada: 0, unidadesSalida: 500, saldo: 0, destino: 'Mini Markets del Centro', usuario: 'María López' },
];

// Trazabilidad para LPT-2026-001
export const trazabilidadData = {
  lote: 'LPT-2026-001',
  producto: 'Yogurt natural',
  presentacion: '200ml',
  fechaProduccion: '2026-04-21',
  fechaVencimiento: '2026-05-21',
  cantidadTotal: 1200,
  adelante: [
    { cliente: 'Distribuidora Lima Norte', fechaSalida: '2026-04-21', cantidad: 200, guia: 'GR-2026-045', estado: 'Entregado' },
    { cliente: 'Supermercado Los Andes', fechaSalida: '2026-04-22', cantidad: 150, guia: 'GR-2026-047', estado: 'En tránsito' },
  ],
  atras: [
    { loteMp: 'LMP-2026-001', producto: 'Leche cruda entera', proveedor: 'Lácteos del Norte SAC', fechaIngreso: '2026-04-22', cantidadUsada: 1200, nivel: 1 },
    { loteMp: 'LMP-2026-003', producto: 'Cultivo láctico termofílico', proveedor: 'BioKultivos Peru SA', fechaIngreso: '2026-04-20', cantidadUsada: 2.4, nivel: 1 },
    { loteMp: 'LMP-2026-004', producto: 'Azúcar refinada', proveedor: 'Azucares del Sur EIRL', fechaIngreso: '2026-04-18', cantidadUsada: 60, nivel: 3 },
  ],
  historialProceso: [
    { paso: 1, nombre: 'Recepción', icono: '🥛', fecha: '2026-04-21 06:00', operador: 'Javier Ramos', datos: ['2200 L recibidos', 'Temp: 6.5°C', 'Densidad: 1.032 g/ml', 'Acidez: 16°D', 'Rechazado: 0 L'], alerta: false },
    { paso: 2, nombre: 'Almacenaje', icono: '🏗️', fecha: '2026-04-21 06:30', operador: 'Javier Ramos', datos: ['Tanque #1', '2200 L almacenados', 'Temp: 4.0°C', 'Tiempo: 60 min', 'Cap. disponible: 800 L'], alerta: false },
    { paso: 3, nombre: 'Fraccionamiento', icono: '⚗️', fecha: '2026-04-21 07:30', operador: 'María López', datos: ['2200 L fraccionados', 'Temp: 4.1°C', 'Tiempo: 25 min', 'Línea 1: 1100 L', 'Pérdida: 5 L'], alerta: false },
    { paso: 4, nombre: 'Pasteurización', icono: '🌡️', fecha: '2026-04-21 08:00', operador: 'María López', datos: ['1100 L procesados', 'Temp: 73°C ✓', 'Tiempo: 18 seg ✓', 'Control: Aprobado', 'Descartado: 0 L'], alerta: false },
    { paso: 5, nombre: 'Enfriado', icono: '❄️', fecha: '2026-04-21 08:30', operador: 'Pedro Vega', datos: ['Temp inicial: 73°C', 'Temp final: 43°C ✓', 'Tiempo: 35 min', '1100 L enfriados', 'Equipo: EQ-007'], alerta: false },
    { paso: 6, nombre: 'Cultivo', icono: '🧫', fecha: '2026-04-21 09:10', operador: 'Pedro Vega', datos: ['Cultivo: 2.2 kg', 'Temp incubación: 43°C', 'Tiempo fermentación: 4h', '1100 L inoculados', 'pH final: 4.5'], alerta: true },
    { paso: 7, nombre: 'Mezclado', icono: '🥄', fecha: '2026-04-21 13:20', operador: 'María López', datos: ['Azúcar: 60 kg', 'Pulpa fresa: 0 kg (yogurt natural)', 'Tiempo: 15 min', '1100 L base', 'Descarte: 0 kg'], alerta: false },
    { paso: 8, nombre: 'Envasado', icono: '🏭', fecha: '2026-04-21 14:00', operador: 'Pedro Vega', datos: ['1200 und envasadas', 'Temp: 8°C', 'Tiempo: 45 min', '200 ml/und', 'Defectuosas: 3 und'], alerta: false },
    { paso: 9, nombre: 'Almacenado', icono: '📦', fecha: '2026-04-21 15:00', operador: 'Pedro Vega', datos: ['1200 und almacenadas', 'Temp: 4°C', 'Espera mínima: 12h', 'Nivel 1', 'Con observación: 0'], alerta: false },
  ],
};

export const trazabilidadDataDurazno = {
  lote: 'LPT-2026-005',
  producto: 'Yogurt de durazno',
  presentacion: '200ml',
  fechaProduccion: '2026-04-22',
  fechaVencimiento: '2026-05-22',
  cantidadTotal: 600,
  adelante: [
    { cliente: 'Bodegas El Sol', fechaSalida: '2026-04-23', cantidad: 300, guia: 'GR-2026-050', estado: 'Entregado' },
  ],
  atras: [
    { loteMp: 'LMP-2026-001', producto: 'Leche cruda entera', proveedor: 'Lácteos del Norte SAC', fechaIngreso: '2026-04-22', cantidadUsada: 600, nivel: 1 },
    { loteMp: 'LMP-2026-003', producto: 'Cultivo láctico termofílico', proveedor: 'BioKultivos Peru SA', fechaIngreso: '2026-04-20', cantidadUsada: 1.2, nivel: 1 },
    { loteMp: 'LMP-2026-004', producto: 'Azúcar refinada', proveedor: 'Azucares del Sur EIRL', fechaIngreso: '2026-04-18', cantidadUsada: 30, nivel: 3 },
    { loteMp: 'LMP-2026-005', producto: 'Pulpa de durazno', proveedor: 'Frutas Andinas SAC', fechaIngreso: '2026-04-21', cantidadUsada: 40, nivel: 2 },
  ],
  historialProceso: [
    { paso: 1, nombre: 'Recepción', icono: '🥛', fecha: '2026-04-22 06:00', operador: 'Javier Ramos', datos: ['1200 L recibidos', 'Temp: 6.8°C', 'Densidad: 1.031 g/ml', 'Acidez: 16.5°D', 'Rechazado: 0 L'], alerta: false },
    { paso: 2, nombre: 'Almacenaje', icono: '🏗️', fecha: '2026-04-22 06:30', operador: 'Javier Ramos', datos: ['Tanque #2', '1200 L almacenados', 'Temp: 4.2°C', 'Tiempo: 45 min', 'Cap. disponible: 1800 L'], alerta: false },
    { paso: 3, nombre: 'Fraccionamiento', icono: '⚗️', fecha: '2026-04-22 07:15', operador: 'María López', datos: ['1200 L fraccionados', 'Temp: 4.3°C', 'Tiempo: 20 min', 'Línea 2: 600 L', 'Pérdida: 2 L'], alerta: false },
    { paso: 4, nombre: 'Pasteurización', icono: '🌡️', fecha: '2026-04-22 07:45', operador: 'María López', datos: ['600 L procesados', 'Temp: 88°C ✓', 'Tiempo: 18 seg ✓', 'Control: Aprobado', 'Descartado: 0 L'], alerta: false },
    { paso: 5, nombre: 'Enfriado', icono: '❄️', fecha: '2026-04-22 08:15', operador: 'Pedro Vega', datos: ['Temp inicial: 88°C', 'Temp final: 42°C ✓', 'Tiempo: 30 min', '600 L enfriados', 'Equipo: EQ-008'], alerta: false },
    { paso: 6, nombre: 'Cultivo', icono: '🧫', fecha: '2026-04-22 08:45', operador: 'Pedro Vega', datos: ['Cultivo: 1.2 kg', 'Temp incubación: 42°C', 'Tiempo fermentación: 4.5h', '600 L inoculados', 'pH final: 4.52'], alerta: false },
    { paso: 7, nombre: 'Mezclado', icono: '🥄', fecha: '2026-04-22 13:15', operador: 'María López', datos: ['Azúcar: 30 kg', 'Pulpa durazno: 40 kg', 'Tiempo: 20 min', '600 L base', 'Descarte: 0 kg'], alerta: false },
    { paso: 8, nombre: 'Envasado', icono: '🏭', fecha: '2026-04-22 14:00', operador: 'Pedro Vega', datos: ['600 und envasadas', 'Temp: 8.5°C', 'Tiempo: 30 min', '200 ml/und', 'Defectuosas: 1 und'], alerta: false },
    { paso: 9, nombre: 'Almacenado', icono: '📦', fecha: '2026-04-22 14:45', operador: 'Pedro Vega', datos: ['600 und almacenadas', 'Temp: 4.2°C', 'Espera mínima: 12h', 'Nivel 2', 'Con observación: 0'], alerta: false },
  ],
};
