import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import IngresoLotes from './pages/mp/IngresoLotes';
import LayoutAlmacen from './pages/mp/LayoutAlmacen';
import Kardex from './pages/mp/Kardex';
import Proveedores from './pages/mp/Proveedores';
import OrdenesCompra from './pages/mp/OrdenesCompra';
import AjusteInventario from './pages/mp/AjusteInventario';
import ProcesoView from './pages/proceso/ProcesoView';
import IngresoLotesPT from './pages/pt/IngresoLotesPT';
import KardexPT from './pages/pt/KardexPT';
import RastreoLote from './pages/pt/RastreoLote';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      // Almacén Materia Prima
      { path: 'mp/ingreso', Component: IngresoLotes },
      { path: 'mp/layout', Component: LayoutAlmacen },
      { path: 'mp/kardex', Component: Kardex },
      { path: 'mp/proveedores', Component: Proveedores },
      { path: 'mp/ordenes', Component: OrdenesCompra },
      { path: 'mp/ajuste', Component: AjusteInventario },
      // Proceso
      { path: 'proceso', Component: ProcesoView },
      // Almacén Producto Terminado
      { path: 'pt/ingreso', Component: IngresoLotesPT },
      { path: 'pt/kardex', Component: KardexPT },
      { path: 'pt/rastreo', Component: RastreoLote },
    ],
  },
]);
