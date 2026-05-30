const fs = require('fs');
const path = require('path');

const routes = {
    "mp/ingreso": "mp/IngresoLotes",
    "mp/layout": "mp/LayoutAlmacen",
    "mp/kardex": "mp/Kardex",
    "mp/proveedores": "mp/Proveedores",
    "mp/ordenes": "mp/OrdenesCompra",
    "mp/ajuste": "mp/AjusteInventario",
    "proceso": "proceso/ProcesoView",
    "pt/ingreso": "pt/IngresoLotesPT",
    "pt/kardex": "pt/KardexPT",
    "pt/rastreo": "pt/RastreoLote"
};

for (const [routePath, componentPath] of Object.entries(routes)) {
    const dir = path.join(__dirname, 'src/app', routePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const compName = componentPath.split('/').pop();
    const content = `"use client";
import ${compName} from '@/pages/${componentPath}';

export default function Page() {
  return <${compName} />;
}
`;
    fs.writeFileSync(path.join(dir, 'page.tsx'), content);
}

// And update the root page as well
const rootContent = `"use client";
import Dashboard from '@/pages/Dashboard';

export default function Page() {
  return <Dashboard />;
}
`;
fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), rootContent);

console.log("Pages generated!");
