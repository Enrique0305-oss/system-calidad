import { useRouter } from 'next/navigation';
import { 
  FlaskConical, 
  Boxes, 
  Warehouse, 
  ShieldCheck, 
  ArrowRight,
  ChevronRight 
} from 'lucide-react';

interface MacroModulo {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  badgeText: string;
  stepNumber: number;
}

const macroModulos: MacroModulo[] = [
  {
    id: 'amp',
    stepNumber: 1,
    title: 'Almacén Materia Prima',
    subtitle: 'Ingreso Lotes · Kardex · Proveedores · Órdenes de Compra',
    icon: <Warehouse size={24} />,
    path: '/mp/ingreso',
    borderColor: 'border-violet-500',
    bgColor: 'bg-violet-50/40 hover:bg-violet-50',
    textColor: 'text-violet-700',
    badgeText: 'Fase Inicial',
  },
  {
    id: 'proceso',
    stepNumber: 2,
    title: 'Procesamiento / Producción',
    subtitle: 'Pasteurización · Homogeneización · Inoculación (13 pasos)',
    icon: <FlaskConical size={24} />,
    path: '/proceso',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50/40 hover:bg-orange-50',
    textColor: 'text-orange-700',
    badgeText: 'En Curso',
  },
  {
    id: 'calidad',
    stepNumber: 3,
    title: 'Control de Calidad',
    subtitle: 'Liberación de Lotes · Monitoreo SPC · No Conformidades (RNC)',
    icon: <ShieldCheck size={24} />,
    path: '/calidad/liberacion',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50/40 hover:bg-blue-50',
    textColor: 'text-blue-700',
    badgeText: 'Validación',
  },
  {
    id: 'apt',
    stepNumber: 4,
    title: 'Almacén Producto Terminado',
    subtitle: 'Kardex Central · Trazabilidad Final · Rastreo de Lote',
    icon: <Boxes size={24} />,
    path: '/pt/ingreso',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50/40 hover:bg-green-50',
    textColor: 'text-green-700',
    badgeText: 'Listo / Despacho',
  },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="p-6 bg-[#F4F6F9] min-h-screen flex flex-col space-y-6 font-sans overflow-hidden">
      
      {/* Título de Panel de Control */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#1E3A5F]">Panel de Control General</h1>
          <p className="text-xs text-gray-500 mt-0.5">Sistema Integrado de Gestión de Almacén, Proceso y Despacho</p>
        </div>
        <span className="self-start sm:self-auto text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
          Periodo 2026
        </span>
      </div>

      {/* Contenedor del Flujo */}
      <div className="flex-1 flex flex-col space-y-3 min-h-0">
        <div className="flex-shrink-0">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E3A5F]">Módulos y Flujo del Sistema</h2>
          <p className="text-xs text-gray-400">Accede directamente al área de trabajo haciendo clic en la tarjeta secuencial</p>
        </div>

        {/* Grid configurado estrictamente en 2 columnas a partir de pantallas medianas (md:grid-cols-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 pb-4">
          {macroModulos.map((modulo, index) => (
            <div key={modulo.id} className="relative flex flex-col items-stretch h-full">
              
              {/* Tarjeta de Módulo */}
              <button
                onClick={() => router.push(modulo.path)}
                className={`w-full h-full flex flex-col justify-between text-left p-6 bg-white border-l-4 ${modulo.borderColor} rounded-xl shadow-sm border border-gray-200/70 transition-all transform hover:-translate-y-1 hover:shadow-md ${modulo.bgColor} group`}
              >
                {/* Contenido superior */}
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-lg bg-white shadow-sm border border-gray-100 ${modulo.textColor}`}>
                      {modulo.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-full bg-white/90 border border-gray-200 text-gray-500">
                        {modulo.badgeText}
                      </span>
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1E3A5F] text-white text-[10px] font-bold">
                        {modulo.stepNumber}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-base font-bold text-gray-800 group-hover:text-[#1E3A5F] transition-colors">
                      {modulo.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed font-normal">
                      {modulo.subtitle}
                    </p>
                  </div>
                </div>

                {/* Footer de Tarjeta */}
                <div className="flex items-center gap-1 text-xs font-bold text-[#1E3A5F] mt-8 pt-3 border-t border-gray-100 w-full group-hover:underline">
                  Abrir Módulo <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Indicador de Flecha Conectora Horizontal (Solo se muestra entre 1->2 y entre 3->4) */}
              {(index === 0 || index === 2) && (
                <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 items-center justify-center bg-white border border-gray-200 rounded-full w-6 h-6 shadow-sm text-gray-400***">
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}