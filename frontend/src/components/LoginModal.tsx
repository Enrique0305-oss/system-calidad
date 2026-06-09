import { useState } from 'react';
import { User, Lock, Eye, EyeOff, X } from 'lucide-react';

interface LoginModalProps {
  onLogin: (user: { nombre: string; rol: string }) => void;
  onCancel: () => void;
}

const USERS = [
  { usuario: 'admin', password: 'admin26', nombre: 'Ing. García', rol: 'Supervisor de Calidad' },
  { usuario: 'operador', password: 'admin26', nombre: 'María López', rol: 'Operadora de Planta' },
  { usuario: 'supervisor', password: 'admin26', nombre: 'Carlos Mendoza', rol: 'Supervisor de Turno' },
];

export function LoginModal({ onLogin, onCancel }: LoginModalProps) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    const user = USERS.find(u => u.usuario === usuario && u.password === password);
    if (user) {
      onLogin({ nombre: user.nombre, rol: user.rol });
    } else {
      setError('Usuario o contraseña incorrectos. Intente con admin / admin26');
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-full mx-4"
        style={{
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#EFF6FF' }}
          >
            <span style={{ fontSize: 28 }}>🔐</span>
          </div>
          <h2 style={{ color: '#1E3A5F', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Iniciar Sesión
          </h2>
          <p style={{ color: '#7F8C8D', fontSize: 13 }}>
            Sistema de Calidad · KODEX PERU SAC
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="px-8 py-6 space-y-4">
          {/* Usuario */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2C3E50', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User size={16} style={{ color: '#7F8C8D' }} />
              </div>
              <input
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Ingrese su usuario"
                required
                style={{
                  width: '100%',
                  paddingLeft: 40,
                  paddingRight: 14,
                  paddingTop: 10,
                  paddingBottom: 10,
                  border: '1.5px solid #E2E8F0',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#2C3E50',
                  outline: 'none',
                  background: '#F8FAFC',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#1E3A5F'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#2C3E50', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={16} style={{ color: '#7F8C8D' }} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                style={{
                  width: '100%',
                  paddingLeft: 40,
                  paddingRight: 44,
                  paddingTop: 10,
                  paddingBottom: 10,
                  border: '1.5px solid #E2E8F0',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#2C3E50',
                  outline: 'none',
                  background: '#F8FAFC',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#1E3A5F'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                style={{ color: '#7F8C8D', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#E74C3C', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#93C5A1' : '#2ECC71',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                height: 46,
                borderRadius: 8,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
              }}
            >
              {loading ? '⏳ Verificando...' : 'Ingresar'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#7F8C8D',
                fontSize: 14,
                fontWeight: 500,
                height: 40,
                borderRadius: 8,
                border: '1.5px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Cancelar
            </button>
          </div>

          <div className="text-center">
            <button type="button" style={{ background: 'none', border: 'none', color: '#1E3A5F', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Demo hint */}
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 14px', fontSize: 11, color: '#15803D', textAlign: 'center' }}>
            Demo: usuario <strong>admin</strong> · contraseña <strong>admin26</strong>
          </div>
        </form>

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4"
          style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7F8C8D' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
