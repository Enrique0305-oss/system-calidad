import kodexLogo from '../../imports/Captura_de_pantalla_2026-04-27_195823.png';
import labTech from '../../imports/Captura_de_pantalla_2026-04-27_195911.png';

interface SplashScreenProps {
  onIniciar: () => void;
}

export function SplashScreen({ onIniciar }: SplashScreenProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F6F9', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Header Bar */}
      <header
        className="flex items-center justify-between px-8"
        style={{ background: '#1E3A5F', height: 64, flexShrink: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base flex-shrink-0">🥛</div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
            Sistema de Calidad
          </span>
        </div>
        {/* Mondelēz placeholder */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-6 h-6 rounded bg-white/30 flex items-center justify-center text-xs text-white font-bold">M</div>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, letterSpacing: '0.5px' }}>
            MONDELĒZ International
          </span>
        </div>
      </header>

      {/* Main Splash Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-6xl flex items-center gap-16">
          {/* LEFT: Kodex logo + intro + button */}
          <div className="flex flex-col items-center gap-8 flex-shrink-0" style={{ minWidth: 280 }}>
            {/* Kodex Logo */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={kodexLogo}
                alt="KODEX PERU SAC"
                className="rounded-2xl shadow-2xl"
                style={{ width: 160, height: 160, objectFit: 'cover' }}
              />
              <div className="text-center">
                <p style={{ color: '#1E3A5F', fontSize: 13, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginTop: 4 }}>
                  Powered by KODEX PERU SAC
                </p>
              </div>
            </div>

            {/* App title */}
            <div className="text-center">
              <h1 style={{ color: '#1E3A5F', fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                QMS Yogurt
              </h1>
              <p style={{ color: '#7F8C8D', fontSize: 14, fontWeight: 400, lineHeight: 1.6, maxWidth: 260 }}>
                Sistema integrado de gestión de calidad para plantas de producción de yogurt
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-2 w-full">
              {[
                { icon: '🏭', text: 'Control de Materia Prima' },
                { icon: '🔬', text: '13 Etapas de Proceso' },
                { icon: '📦', text: 'Trazabilidad Completa' },
              ].map(f => (
                <div
                  key={f.text}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background: 'rgba(30,58,95,0.06)' }}
                >
                  <span style={{ fontSize: 16 }}>{f.icon}</span>
                  <span style={{ color: '#2C3E50', fontSize: 13, fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* INICIAR Button */}
            <button
              onClick={onIniciar}
              className="w-full flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{
                background: '#2ECC71',
                color: '#fff',
                fontSize: 17,
                fontWeight: 700,
                height: 54,
                borderRadius: 12,
                letterSpacing: '1px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>▶</span>
              INICIAR SESIÓN
            </button>

            <p style={{ color: '#B0BEC5', fontSize: 11, textAlign: 'center' }}>
              v1.0 · KODEX PERU SAC · 2026
            </p>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 hidden lg:block" style={{ width: 1, height: 400, background: 'linear-gradient(to bottom, transparent, #CBD5E1, transparent)' }} />

          {/* RIGHT: Lab Tech Illustration */}
          <div className="flex-1 flex flex-col items-center gap-6 hidden lg:flex">
            <img
              src={labTech}
              alt="Técnico de laboratorio"
              className="w-full max-w-xl drop-shadow-2xl"
              style={{ objectFit: 'contain', maxHeight: 440 }}
            />
            <div className="text-center">
              <p style={{ color: '#1E3A5F', fontSize: 18, fontWeight: 700 }}>
                Calidad desde la fuente
              </p>
              <p style={{ color: '#7F8C8D', fontSize: 13, marginTop: 4 }}>
                Monitoreo en tiempo real · Control de lotes · Trazabilidad total
              </p>
            </div>

            {/* Stats strip */}
            <div className="flex gap-6">
              {[
                { value: '13', label: 'Etapas controladas' },
                { value: '100%', label: 'Trazabilidad' },
                { value: '3', label: 'Módulos integrados' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p style={{ color: '#1E3A5F', fontSize: 24, fontWeight: 800 }}>{s.value}</p>
                  <p style={{ color: '#7F8C8D', fontSize: 11, fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer strip */}
      <div className="px-8 py-3 flex items-center justify-between" style={{ background: 'rgba(30,58,95,0.04)', borderTop: '1px solid rgba(30,58,95,0.08)' }}>
        <span style={{ color: '#B0BEC5', fontSize: 11 }}>© 2026 KODEX PERU SAC · Todos los derechos reservados</span>
        <span style={{ color: '#B0BEC5', fontSize: 11 }}>Sistema de Gestión de Calidad · Industria Láctea</span>
      </div>
    </div>
  );
}
