🖥️ PANTALLA 1 — SPLASH / PANTALLA DE BIENVENIDA
Diseñar una pantalla de bienvenida tipo splash screen para un sistema web industrial de calidad alimentaria.
Estructura visual:

Fondo blanco o gris muy claro (#F4F6F9)
Header superior con barra azul oscuro (#1E3A5F) que contenga a la izquierda el texto "Sistema de Calidad" en tipografía bold blanca grande, y a la derecha el logo de Mondelēz International (imagen referencial, placeholder rectangular con el nombre)
En el área central izquierda: logo de KODEX PERU SAC (escudo con letra K, placeholder cuadrado redondeado con fondo oscuro metálico)
En el área central derecha: ilustración de un técnico de laboratorio con bata blanca, guantes azules, cofia, frente a múltiples monitores con dashboards y código — estilo render 3D realista
Botón grande verde (#2ECC71) redondeado con texto "INICIAR" en blanco bold, ubicado debajo del logo KODEX, centrado a la izquierda
El botón INICIAR al hacer clic dispara un modal de inicio de sesión


🔐 PANTALLA 2 — MODAL DE INICIO DE SESIÓN
Modal pequeño centrado sobre la splash screen con fondo semitransparente oscuro detrás.
Contenido del modal:

Título: "Iniciar Sesión" en azul oscuro
Campo A: "Usuario" — input text con ícono de persona
Campo B: "Contraseña" — input password con ícono de candado y toggle show/hide
Botón primario: "Ingresar" (verde #2ECC71, ancho completo)
Botón secundario: "Cancelar" (borde gris, texto gris)
Link pequeño: "¿Olvidaste tu contraseña?"
Borde del modal redondeado, sombra suave, sin ventana de sistema operativo


🏠 PANTALLA 3 — DASHBOARD PRINCIPAL (post login)
Luego de iniciar sesión, pantalla principal tipo selector de módulos con la imagen del flujo de producción como elemento visual central e interactivo.
Layout:

Header fijo azul oscuro: logo "Sistema de Calidad" a la izquierda + nombre usuario + rol + ícono campana notificaciones a la derecha
Área central: mostrar la imagen del diagrama de flujo industrial (los 13 pasos desde Almacén MP hasta Despacho) como fondo interactivo con overlay semitransparente
Sobre la imagen del proceso, superponer 3 zonas clicables tipo card con borde resaltado de color:

Card 1 — ALMACÉN MATERIA PRIMA (borde morado, posicionada sobre el paso 1 de la imagen)

Ícono de almacén/bodega
Texto: "Almacén Materia Prima"
Sub-texto pequeño: "Ingresos · Kardex · Proveedores"
Al hacer clic → navegar al módulo AMP

Card 2 — PROCESO (borde naranja/multicolor, posicionada sobre los pasos 2–11)

Ícono de engranaje o tubo industrial
Texto: "Proceso"
Sub-texto: "13 etapas de producción"
Al hacer clic → navegar al módulo Proceso

Card 3 — ALMACÉN PRODUCTO TERMINADO (borde verde, posicionada sobre el paso 12)

Ícono de caja/pallet
Texto: "Almacén Producto Terminado"
Sub-texto: "Lotes · Kardex · Trazabilidad"
Al hacer clic → navegar al módulo APT
En la parte inferior: barra de Actividad Reciente con los últimos 5 movimientos del sistema (entrada, proceso, salida) con badges de color


📋 CORRECCIONES Y NUEVAS ESPECIFICACIONES DEL PDF
Módulo Almacén Materia Prima — Vista Lista / Ingreso de Lotes
Columnas de la tabla principal:
LOTE | PRODUCTO | PROVEEDOR | CANTIDAD | ZONA | NIVEL | VENCIMIENTO | DOCUMENTOS | ESTADO

Columna ZONA: dropdown badge con zonas del almacén (Zona A, B, C, D)
Columna NIVEL: badge numérico circular (1, 2 o 3)
Columna DOCUMENTOS: ícono de clip/archivo — al hacer clic abre visor de documentos adjuntos
Columna ESTADO: badge de color → 🔵 En proceso / 🟢 Disponible / 🔴 Agotado / 🟡 Por vencer


Subvista: LAY OUT DE ALMACÉN
Vista adicional dentro del módulo AMP accesible desde el sidebar. Muestra el plano visual interactivo del almacén dividido en zonas:

Dimensiones: 60m × 40m (mostradas con líneas guía)
ZONA A — Almacenamiento (fondo verde claro): filas de racks/estanterías con 3 niveles visibles, ícono de montacargas, área de recepción lateral con ícono de camión
ZONA B — Picking (fondo amarillo): racks de picking, operario al fondo
ZONA C — Embalaje (fondo naranja): mesas de trabajo, cajas
ZONA D — Expedición (fondo lila): pallets listos para despacho, puerta de salida con camión
Pasillos centrales en gris con flechas de circulación punteadas amarillas
Cada rack es clicable → al hacer clic muestra tooltip con: productos almacenados, nivel, cantidad, lote y estado
Botón "+ Nuevo Ingreso" flotante arriba derecha


Módulo Recepción — Vista de Documentos
Al acceder al paso de Recepción dentro del módulo Proceso, debe haber una sub-sección de documentos:
Panel de documentos de recepción:

Título: "Documentos de Recepción"
Lista de documentos adjuntables por lote:

📄 Certificado de Calidad del proveedor
🔬 Análisis Microbiológico
📋 Guía de remisión / Factura
📎 Otros documentos


Cada ítem tiene: nombre del doc, fecha de carga, estado (Cargado ✅ / Pendiente ⚠️), botón "Ver" y botón "Subir"
Filtro por lote en la parte superior


Módulo Recepción — Control de Procesos (Parámetros de Calidad)
Sub-sección dentro de Recepción para registro de parámetros fisicoquímicos de la leche cruda recibida:
Tabla de control:

Columnas: Lote | Fecha | Hora | Turno | Operario | pH | Acidez (°D) | Sólidos (%) | Temperatura (°C) | Resultado | Observación
Filas resaltadas en rojo si algún parámetro está fuera de rango
Filas en verde si todos los parámetros son correctos
Botón "Registrar análisis" abre modal con los campos de parámetros
Botón "Exportar a Excel" en la parte superior derecha
Rango de fechas como filtro superior

Parámetros con rangos de referencia visibles:

pH: rango 6.6 – 6.8 (mostrado como referencia debajo del campo)
Acidez: 16 – 18 °D
Sólidos totales: 11.5 – 13%
Temperatura de llegada: ≤ 8°C