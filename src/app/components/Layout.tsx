import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import {
  Package, FlaskConical, Boxes, ChevronDown, ChevronRight,
  ClipboardList, BookOpen, Users, ShoppingCart, BarChart3,
  Search, Bell, User, Menu, X, Beaker, Map
} from 'lucide-react';
import { currentUser } from '../App';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    id: 'mp',
    label: 'Almacén Materia Prima',
    icon: <Package size={17} />,
    color: '#7C3AED',
    items: [
      { label: 'Ingreso / Lotes', path: '/mp/ingreso', icon: <ClipboardList size={13} /> },
      { label: 'Lay Out Almacén', path: '/mp/layout', icon: <Map size={13} /> },
      { label: 'Kardex', path: '/mp/kardex', icon: <BookOpen size={13} /> },
      { label: 'Proveedores', path: '/mp/proveedores', icon: <Users size={13} /> },
      { label: 'Órdenes de Compra', path: '/mp/ordenes', icon: <ShoppingCart size={13} /> },
      { label: 'Ajuste de Inventario', path: '/mp/ajuste', icon: <BarChart3 size={13} /> },
    ],
  },
  {
    id: 'proceso',
    label: 'Proceso',
    icon: <FlaskConical size={17} />,
    color: '#F97316',
    items: [
      { label: 'Diagrama Interactivo', path: '/proceso', icon: <Beaker size={13} /> },
    ],
  },
  {
    id: 'pt',
    label: 'Almacén PT',
    icon: <Boxes size={17} />,
    color: '#2ECC71',
    items: [
      { label: 'Ingreso / Lotes', path: '/pt/ingreso', icon: <ClipboardList size={13} /> },
      { label: 'Kardex', path: '/pt/kardex', icon: <BookOpen size={13} /> },
      { label: 'Rastreo de Lote', path: '/pt/rastreo', icon: <Search size={13} /> },
    ],
  },
];

const breadcrumbMap: Record<string, string[]> = {
  '/mp/ingreso': ['Almacén MP', 'Ingreso / Lotes'],
  '/mp/layout': ['Almacén MP', 'Lay Out Almacén'],
  '/mp/kardex': ['Almacén MP', 'Kardex'],
  '/mp/proveedores': ['Almacén MP', 'Proveedores'],
  '/mp/ordenes': ['Almacén MP', 'Órdenes de Compra'],
  '/mp/ajuste': ['Almacén MP', 'Ajuste de Inventario'],
  '/proceso': ['Proceso', 'Diagrama Interactivo'],
  '/pt/ingreso': ['Almacén PT', 'Ingreso / Lotes'],
  '/pt/kardex': ['Almacén PT', 'Kardex'],
  '/pt/rastreo': ['Almacén PT', 'Rastreo de Lote'],
  '/': ['Dashboard'],
};

export function Layout() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ mp: true, proceso: true, pt: true });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const breadcrumbs = breadcrumbMap[location.pathname] || ['Sistema de Calidad'];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F4F6F9', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 64,
          minWidth: sidebarOpen ? 260 : 64,
          background: '#1E3A5F',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 64, borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
            🥛
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.2 }}>YogurtQMS</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, whiteSpace: 'nowrap' }}>Sistema de Calidad</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {navSections.map((section) => (
            <div key={section.id} style={{ marginBottom: 4 }}>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ color: section.color, flexShrink: 0 }}>{section.icon}</span>
                {sidebarOpen && (
                  <>
                    <span style={{ flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {section.label}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {openSections[section.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>
                  </>
                )}
              </button>

              {sidebarOpen && openSections[section.id] && (
                <div style={{ marginLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 8 }}>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 12px', margin: '1px 0', borderRadius: 8,
                        fontSize: 13, fontWeight: isActive ? 600 : 400, textDecoration: 'none',
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                        background: isActive ? `${section.color}30` : 'transparent',
                        borderLeft: isActive ? `2px solid ${section.color}` : '2px solid transparent',
                        transition: 'all 0.15s',
                      })}
                    >
                      <span style={{ flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}

              {!sidebarOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 2 }}>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={item.label}
                      style={({ isActive }) => ({
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 8, color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                        background: isActive ? `${section.color}30` : 'transparent',
                        transition: 'all 0.15s', textDecoration: 'none',
                      })}
                    >
                      {item.icon}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(46,204,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={14} style={{ color: '#2ECC71' }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.nombre}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{currentUser.rol}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(46,204,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={14} style={{ color: '#2ECC71' }} />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: 64, background: '#fff', borderBottom: '1px solid #E8ECF0',
          display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
          flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <button
            onClick={() => setSidebarOpen(p => !p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7F8C8D', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
            <span style={{ fontSize: 12, color: '#B0BEC5' }}>Sistema de Calidad</span>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ChevronRight size={12} style={{ color: '#D1D9E0' }} />
                <span style={{
                  fontSize: 13,
                  color: i === breadcrumbs.length - 1 ? '#1E3A5F' : '#B0BEC5',
                  fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
                }}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>

          {/* Right: Bell + User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#7F8C8D', display: 'flex' }}>
              <Bell size={19} />
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, background: '#E74C3C', borderRadius: '50%',
                fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              }}>3</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} style={{ color: '#fff' }} />
              </div>
              <div className="hidden md:block">
                <p style={{ fontSize: 13, fontWeight: 600, color: '#2C3E50' }}>{currentUser.nombre}</p>
                <p style={{ fontSize: 11, color: '#7F8C8D' }}>{currentUser.rol}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
