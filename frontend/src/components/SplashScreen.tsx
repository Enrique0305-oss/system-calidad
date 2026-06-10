import Image from 'next/image';
import { useEffect, useState } from 'react';
import kodexLogo from '@/imports/logoKodex.png';
import labTech from '@/imports/login1.png';

interface SplashScreenProps {
  onIniciar: () => void;
}

export function SplashScreen({ onIniciar }: SplashScreenProps) {
  const slides = [kodexLogo, labTech];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F6F9', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Header Bar */}
      <header
        className="flex items-center justify-between px-8"
        style={{ background: '#1E3A5F', height: 64, flexShrink: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base shrink-0">🥛</div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
            Sistema de Calidad
          </span>
        </div>
      </header>

      {/* Main Splash Content */}
      <div className="flex-1 flex items-stretch">
        <div className="w-full flex flex-col lg:flex-row items-stretch">
          
          {/* LEFT: Carousel con Overlay Verde Olivo */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-0 flex flex-col justify-center items-center">
            {/* Imagen de Fondo */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slides[index]}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* CAPA DE TRANSPARENCIA: Verde Olivo Suave (mix-blend-mode opcional para integrar color) */}
            <div 
              className="absolute inset-0 z-10 block" 
              style={{ backgroundColor: 'rgba(30, 90, 150, 0.45)' }} // 👈 CAMBIA ESTA LÍNEA
            />

            {/* TEXTO FLOTANTE SOBRE EL CARRUSEL (Estilo Prosergen) */}
            <div className="relative z-20 text-center px-6 max-w-2xl text-white drop-shadow-md pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl mx-auto mb-4 animate-pulse">
                🛡️
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
                Calidad Incomprometible
              </h2>
              <p className="text-sm lg:text-base text-white/90 font-medium max-w-md mx-auto leading-relaxed">
                Monitoreo estricto en tiempo real para asegurar los más altos estándares de producción.
              </p>
            </div>

            {/* Indicadores flotantes sobre la imagen */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === index ? 'bg-white scale-125 shadow-md' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: QMS Yogurt panel */}
          <div className="flex-1 lg:max-w-[540px] flex items-center justify-center p-8 lg:p-12 bg-[#F4F6F9]">
            <div className="w-full max-w-[400px] bg-white rounded-[30px] drop-shadow-2xl p-8 flex flex-col justify-center gap-6">
              
              <div className="flex flex-col items-center gap-3">
                <div className="relative rounded-2xl overflow-hidden shadow-sm" style={{ width: 100, height: 100 }}>
                  <Image
                    src={kodexLogo}
                    alt="KODEX PERU SAC"
                    fill
                    className="object-cover"
                  />
                </div>
                <p style={{ color: '#1E3A5F', fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Powered by KODEX PERU SAC
                </p>
              </div>

              <div className="text-center">
                <h1 style={{ color: '#1E3A5F', fontSize: 26, fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
                  Planta Yogurt
                </h1>
                <p style={{ color: '#7F8C8D', fontSize: 13, fontWeight: 400, lineHeight: 1.5 }}>
                  Sistema integrado de gestión de calidad para plantas de producción de yogurt
                </p>
              </div>


              <button
                onClick={onIniciar}
                className="w-full flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: '#2ECC71',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  height: 50,
                  borderRadius: 12,
                  letterSpacing: '0.5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>▶</span>
                INICIAR SESIÓN
              </button>

              <p style={{ color: '#B0BEC5', fontSize: 10, textAlign: 'center' }}>
                v1.0 · KODEX PERU SAC · 2026
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom footer strip */}
      <div className="px-8 py-3 flex items-center justify-between" style={{ background: 'rgba(30,58,95,0.04)', borderTop: '1px solid rgba(30,58,95,0.08)', flexShrink: 0 }}>
        <span style={{ color: '#B0BEC5', fontSize: 11 }}>© 2026 KODEX PERU SAC · Todos los derechos reservados</span>
        <span style={{ color: '#B0BEC5', fontSize: 11 }}>Sistema de Gestión de Calidad · Industria Láctea</span>
      </div>
    </div>
  );
}