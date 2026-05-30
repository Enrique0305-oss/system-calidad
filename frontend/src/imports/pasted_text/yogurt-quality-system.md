CONTEXTO GENERAL
Sistema web de gestión de calidad para una planta de producción de yogurt. El flujo productivo va desde la recepción de leche cruda hasta el envasado del producto final. El sistema se divide en 3 módulos principales con navegación lateral izquierda fija.
Paleta sugerida: Blanco, azul industria (#1E3A5F), gris claro (#F4F6F9), verde éxito (#2ECC71), rojo alerta (#E74C3C), amarillo advertencia (#F1C40F).
Layout general: Sidebar izquierdo con íconos + etiquetas → Header con breadcrumb + usuario → Área de contenido principal con cards/tablas.

MÓDULO 1: ALMACÉN MATERIA PRIMA 🏭
Submodulo 1.1 – Ingreso de Productos / Asignación de Lotes

Formulario de registro con campos: Nombre del producto, Proveedor (dropdown), Fecha de ingreso, Cantidad, Unidad de medida, N° de Lote (autogenerado + editable), Fecha de vencimiento, Certificado de calidad (adjunto PDF).
Selector visual de Nivel de almacén: 3 botones tipo toggle — Nivel 1 | Nivel 2 | Nivel 3 — con representación visual de estantería (opcional ilustración isométrica simple de rack de 3 pisos donde se ilumina el nivel seleccionado).
Botón: Registrar Ingreso → genera entrada en Kardex automáticamente.
Tabla inferior con los últimos 10 ingresos del día con columnas: Lote, Producto, Cantidad, Nivel, Estado (badge: Disponible / En proceso / Agotado).


Submodulo 1.2 – Kardex

Vista tipo libro contable digital.
Filtros superiores: Producto, Rango de fechas, Tipo (Entrada / Salida / Ajuste).
Tabla principal columnas: Fecha, Tipo de movimiento, N° Lote, Producto, Cantidad Entrada, Cantidad Salida, Saldo Actual, Usuario responsable, Observación.
Cards resumen en la parte superior: Stock total actual | Entradas del mes | Salidas del mes | Últimos ajustes.
Exportar a Excel/PDF.


Submodulo 1.3 – Proveedores

Lista de proveedores en cards o tabla con: Nombre, RUC/NIT, Contacto, Teléfono, Correo, Productos que suministra, Estado (Activo/Inactivo), Calificación (1–5 estrellas).
Botón + Nuevo Proveedor abre modal con formulario completo.
Vista de perfil de proveedor: historial de entregas, órdenes de compra asociadas, incidencias de calidad.


Submodulo 1.4 – Órdenes de Compra

Listado de OC con estados tipo Kanban o tabla: Borrador → Enviada → Aprobada → Recibida → Cerrada.
Badge de color por estado.
Formulario de nueva OC: Proveedor, Producto(s), Cantidad, Precio unitario, Fecha requerida, Observaciones, Firma/aprobador.
Vista detalle de OC con línea de tiempo del estado.


Submodulo 1.5 – Ajuste de Inventario

Formulario: Seleccionar producto + lote, Cantidad actual en sistema (readonly), Nueva cantidad real, Motivo del ajuste (dropdown: Merma, Error de conteo, Daño, Vencimiento, Otro), Observación libre, Foto evidencia (adjunto).
Historial de ajustes con filtros por fecha y responsable.
Requiere aprobación de supervisor (flujo de doble confirmación: usuario registra → supervisor aprueba).


MÓDULO 2: PROCESO 🔬
Vista Principal – Diagrama de Flujo Interactivo
Usar como base visual la imagen del proceso industrial proporcionada. Sobre esa imagen (o una representación simplificada e ilustrada de ella), colocar los 9 pasos del proceso como nodos/etapas clicables conectadas por flechas direccionales.
Secuencia de pasos:
[1. Recepción] → [2. Almacenaje] → [3. Fraccionamiento] → [4. Pasteurización]
→ [5. Enfriado] → [6. Cultivo] → [7. Mezclado] → [8. Envasado] → [9. Almacenado]
Cada paso se representa como una tarjeta o nodo circular/rectangular con:

Ícono representativo del proceso (tanque, termómetro, cultivo, envasadora, etc.)
Nombre del paso en negrita
Indicador de estado: Pendiente (gris) / En curso (azul parpadeante) / Completado (verde) / Con alerta (rojo)
Número de orden visible (1 al 9)

Las tarjetas están conectadas por flechas/líneas de flujo sobre un fondo que evoca la planta industrial (azul oscuro o gris con textura sutil).

Modal de Registro por Paso (al hacer clic en cualquier nodo)
Se abre un modal centrado con el siguiente contenido:
Header del modal:

Ícono del proceso + Nombre del paso (ej: "🧪 Paso 4 – Pasteurización")
Subtítulo breve explicando la función del paso (ver detalle abajo)
Badge con lote en proceso actual

Cuerpo del modal – 5 campos de cantidad:
CampoDescripciónCampo 1Cantidad de materia prima ingresada (litros/kg/unidades)Campo 2Temperatura registrada (°C)Campo 3Tiempo de proceso (minutos)Campo 4Cantidad de producto resultante (post-proceso)Campo 5Cantidad de merma/descarte
Cada campo tiene: etiqueta, input numérico, unidad de medida al lado, y opción de observación rápida (ícono de nota).
Footer del modal:

Cancelar (botón secundario) | Guardar registro (botón primario azul)
Checkbox: "Marcar paso como completado"


Descripción funcional de cada paso (para Figma):

Recepción – Registro del ingreso de leche cruda desde el proveedor. Se registran: litros recibidos, temperatura de llegada, densidad, acidez inicial y cantidad rechazada.
Almacenaje – Control de la leche cruda en tanques de frío. Se registran: tanque asignado (N°), litros almacenados, temperatura de almacenamiento, tiempo en almacén y capacidad disponible.
Fraccionamiento – División del volumen de leche para diferentes líneas o lotes de producción. Se registran: lote origen, cantidad fraccionada por línea, línea de destino, operador y fecha/hora.
Pasteurización – Tratamiento térmico para eliminar patógenos. Se registran: temperatura de proceso (72°C mínimo), tiempo de exposición (15 seg mínimo), litros procesados, resultado de control y cantidad descartada.
Enfriado – Reducción de temperatura post-pasteurización para preparar el cultivo. Se registran: temperatura inicial, temperatura final (40–45°C), tiempo de enfriamiento, litros enfriados y equipo utilizado.
Cultivo – Inoculación de bacterias lácticas (fermentación). Se registran: tipo de cultivo utilizado, cantidad de cultivo agregado, litros inoculados, temperatura de incubación y tiempo estimado de fermentación.
Mezclado – Incorporación de ingredientes adicionales (azúcar, frutas, saborizantes, etc.). Se registran: ingrediente agregado, cantidad por ingrediente (hasta 5 ingredientes posibles), litros base y resultado de mezcla.
Envasado – Llenado y sellado en envases finales. Se registran: tipo de envase, unidades envasadas, volumen por unidad, unidades defectuosas descartadas y lote asignado al producto terminado.
Almacenado – Ingreso del producto terminado al almacén de PT. Se registran: lote PT generado, cantidad de unidades, ubicación en almacén (Nivel 1/2/3), temperatura de conservación y fecha de vencimiento.


MÓDULO 3: ALMACÉN PRODUCTO TERMINADO 📦
Submodulo 3.1 – Ingreso de Productos / Asignación de Lotes

Mismo esquema que Almacén MP pero orientado a producto terminado.
Campos: Nombre del producto, Presentación (tamaño/sabor), Lote PT (vinculado automáticamente desde el paso 8-9 del proceso), Fecha de producción, Fecha de vencimiento, Cantidad de unidades, Nivel de almacén (1/2/3).
El lote PT ya trae automáticamente el historial del proceso que lo generó.


Submodulo 3.2 – Kardex PT

Idéntica estructura al Kardex de MP pero con columnas adaptadas: Lote PT, Producto, Presentación, Unidades Entrada, Unidades Salida, Saldo, Destino de salida (cliente/distribuidora), Usuario.


Submodulo 3.3 – Rastreo de Lote (Trazabilidad Completa) 🔍
Esta es la funcionalidad más importante y diferenciadora del sistema.
Vista de búsqueda:

Campo grande central: Ingrese N° de Lote PT + botón Rastrear
También permite búsqueda por: fecha de producción, producto, rango de fechas de vencimiento.

Vista de resultado – Timeline/Árbol de trazabilidad:
Se muestra una pantalla tipo "expediente del lote" con dos secciones:
Sección A – ¿A dónde fue? (Trazabilidad hacia adelante)

Mapa o lista de distribución: Cliente/Destino, Fecha de salida, Cantidad despachada, N° guía de remisión, Estado (En tránsito / Entregado / Devuelto).
Opción de exportar como reporte de trazabilidad.

Sección B – ¿De dónde viene? (Trazabilidad hacia atrás)

Cards de Materia Prima utilizada: Lote MP, Producto, Proveedor, Fecha de ingreso, Cantidad usada, Nivel donde estaba almacenado.
Múltiples MP pueden aparecer (leche, cultivo, azúcar, etc.)

Sección C – Historial del Proceso

Timeline vertical con los 9 pasos del proceso.
Cada paso muestra: fecha/hora de ejecución, operador responsable, los 5 datos registrados, y si hubo alguna observación o alerta.
Estilo: línea de tiempo con íconos de cada paso, color verde si fue correcto, amarillo si tuvo observación, rojo si hubo alerta.