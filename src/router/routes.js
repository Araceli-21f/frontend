import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../layouts/Auth/Login";
import Register from "../layouts/Auth/Register";
import ResetPassword from "../layouts/Auth/ResetPassword";
import RecoverPassword from "../layouts/Auth/RecoverPassword";
import Home from "../pages/Home";
import Tablero from "../pages/Tablero";
import Cronograma from "../pages/Cronograma";
import Calendario from "../pages/Calendario";
import Cotizacion from "../pages/cotizacion/Cotizacion";
import Reporte from "../pages/Reporte";
import Campana from "../pages/campanas/ListaCampana";
import DetalleCampana from "../pages/campanas/DetalleCampana";

import Lista_clientes from "../pages/clientes/Lista-clientes";
import Estados_factura from "../pages/facturas/Estados-factura";
import Lista_facturas from "../pages/facturas/Lista-facturas";
import Agregar_factura from "../pages/facturas/Agregar-factura";
import Invoices_detail from "../pages/facturas/InvoicesDetail";

import Lista_usuarios from "../pages/usuarios/Lista-usuarios";
import CrearUsuario from "../pages/usuarios/CrearUsuario";
import EditarUsuario from "../pages/usuarios/EditarUsuario";
import DetalleUsuario from "../pages/usuarios/DetalleUsuario";

import Lista_nomina from "../pages/nomina/Lista-nomina";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
            {/*Login*/}
            <Route path="/" element={<Login/>}/>
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />   
            <Route path="/ResetPassword" element={<ResetPassword />}/>
            <Route path="/RecoverPassword" element={<RecoverPassword />}/>

            {/*Inicio*/}
            <Route path="/Home" element={<Home />} />
            <Route path="/Tablero" element={<Tablero />}/>
            <Route path="/Calendario" element={<Calendario />}/>
            <Route path="/Cronograma" element={<Cronograma />}/>

            {/*Cotizacion*/}
            <Route path="/Cotizacion" element={<Cotizacion />}/>

            {/*Reportes*/}
            <Route path="/Reporte" element={<Reporte />}/>

            {/*Campañas*/}
            <Route path="/Campana" element={<Campana />}/>
            <Route path="/usuario/ver/:id" element={<DetalleCampana />} />


            {/*Clientes*/}
            <Route path="/Lista_clientes" element={<Lista_clientes />}/>

            {/*Facturas*/}
            <Route path="/Estados_factura" element={<Estados_factura />}/>
            <Route path="/Lista_facturas" element={<Lista_facturas />}/>
            <Route path="/facturas/Agregar-factura" element={<Agregar_factura />} />
            <Route path="/InvoicesDetail" element={<Invoices_detail />}/>

            {/*Usuarios*/}
            <Route path="/Lista_usuarios" element={<Lista_usuarios />}/>
            <Route path="/usuarios/CrearUsuario" element={<CrearUsuario />} />
            <Route path="/usuario/editar/:id" element={<EditarUsuario />} />
            <Route path="/usuario/ver/:id" element={<DetalleUsuario />} />

            {/*Nomina*/}
            <Route path="/Lista_nomina" element={<Lista_nomina />}/>


            </Routes>
        </Router>
    );
};

 export default AppRoutes;