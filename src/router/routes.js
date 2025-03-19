import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Invoices_detail from "../pages/InvoicesDetail";
import Tablero from "../pages/Tablero";
import Cronograma from "../pages/Cronograma";
import Calendario from "../pages/Calendario";
import Cotizacion from "../pages/Cotizacion";
import Reporte from "../pages/Reporte";
import Lista_clientes from "../pages/Lista-clientes";
import Estados_factura from "../pages/Estados-factura";
import Lista_facturas from "../pages/Lista-facturas";
import Lista_usuarios from "../pages/Lista-usuarios";
import Lista_nomina from "../pages/Lista-nomina";
import Agregar_factura from "../pages/facturas/Agregar-factura";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/InvoicesDetail" element={<Invoices_detail />}/>
            <Route path="/Tablero" element={<Tablero />}/>
            <Route path="/Calendario" element={<Calendario />}/>
            <Route path="/Cronograma" element={<Cronograma />}/>
            <Route path="/Cotizacion" element={<Cotizacion />}/>
            <Route path="/Reporte" element={<Reporte />}/>
            <Route path="/Lista_clientes" element={<Lista_clientes />}/>
            <Route path="/Estados_factura" element={<Estados_factura />}/>
            <Route path="/Lista_facturas" element={<Lista_facturas />}/>
            <Route path="/Lista_usuarios" element={<Lista_usuarios />}/>
            <Route path="/Lista_nomina" element={<Lista_nomina />}/>
            <Route path="/Agregar_factura" element={<Agregar_factura />}/>










            </Routes>
        </Router>
    );
};

 export default AppRoutes;