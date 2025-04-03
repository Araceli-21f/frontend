import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../layouts/Auth/Login";
import Register from "../layouts/Auth/Register";
import ResetPassword from "../layouts/Auth/ResetPassword";
import RecoverPassword from "../layouts/Auth/RecoverPassword";
import Profile from "../layouts/Auth/Profile";

import Home from "../pages/Home";
import Tablero from "../pages/Tablero";
import Cronograma from "../pages/Cronograma";
import Calendario from "../pages/Calendario";

import ListaCotizaciones from "../pages/cotizacion/Lista-cotizacion";
import CrearCotizacion from "../pages/cotizacion/CrearCotizacion";
import DetalleCotizacion from "../pages/cotizacion/Cotizacion";
import EditarCotizacion from "../pages/cotizacion/EditarCotizacion";

import Reporte from "../pages/Reporte";
import Campana from "../pages/campanas/ListaCampana";
import CrearCampana from "../pages/campanas/CrearCampana";
import DetalleCampana from "../pages/campanas/DetalleCampana";
import EditarCampana from "../pages/campanas/EditarCampana";

import ListaServiciosFinancieros from "../pages/servicios_financiados/Lista_ServicioFinanciado";
import CrearServicioFinanciado from "../pages/servicios_financiados/CrearServicioFinanciado";
import EditarServicioFinanciado from "../pages/servicios_financiados/EditarServicioFinanciado";
import DetalleServicioFinanciado from "../pages/servicios_financiados/DetalleServicioFinanciado";

import ListaFiliales from "../pages/Filial/Lista-filial";
import CrearFilial from "../pages/Filial/CrearFilial";
import DetalleFilial from "../pages/Filial/DetalleFilial";
import EditarFilial from "../pages/Filial/EditarFilial";


import ListaClientes from "../pages/clientes/Lista-clientes";
import CrearCliente from "../pages/clientes/CrearCliente";
import DetalleCliente from "../pages/clientes/DetalleCliente";
import EditarCliente from "../pages/clientes/EditarCliente";

import ListaEstadoCuenta from "../pages/estados_cuenta/Lista_EstadoCuenta";

import EstadosFactura from "../pages/facturas/Estados-factura";
import ListaFacturas from "../pages/facturas/Lista-facturas";
import AgregarFactura from "../pages/facturas/Agregar-factura";
import DetalleFactura from "../pages/facturas/InvoicesDetail";

import ListaUsuarios from "../pages/usuarios/Lista-usuarios";
import CrearUsuario from "../pages/usuarios/CrearUsuario";
import EditarUsuario from "../pages/usuarios/EditarUsuario";
import DetalleUsuario from "../pages/usuarios/DetalleUsuario";

import ListaNomina from "../pages/nomina/Lista-nomina";

import ListaInteraccions from "../pages/interaccions/ListaInteraccions";
import CrearInteraccions from "../pages/interaccions/CrearInteraccions";
import DetalleInteraccions from "../pages/interaccions/DetalleInteraccions";
import EditarInteraccions from "../pages/interaccions/EditarInteraccions";

 
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
            <Route path="/Profile" element={<Profile />}/>

            <Route path="/Home" element={<Home />} />
            <Route path="/Tablero" element={<Tablero />}/>
            <Route path="/Calendario" element={<Calendario />}/>
            <Route path="/Cronograma" element={<Cronograma />}/>

            {/*Cotizacion*/}
            <Route path="/Lista_cotizacion" element={<ListaCotizaciones />}/>
            <Route path="/Cotizacion/CrearCotizacion" element={<CrearCotizacion />}/>
            <Route path="/Cotizacion/ver/:id" element={<DetalleCotizacion />}/>
            <Route path="/Cotizacion/editar/:id" element={<EditarCotizacion />}/>

            {/*Reportes*/}
            <Route path="/Reporte" element={<Reporte />}/>

            {/*Filials*/}
            <Route path="/Filials" element={<ListaFiliales />}/>
            <Route path="/filial/CrearFilial" element={<CrearFilial />} />
            <Route path="/filial/ver/:id" element={<DetalleFilial/>} />
            <Route path="/filial/editar/:id" element={<EditarFilial/>} />



            {/*Campañas*/}
            <Route path="/Campañas" element={<Campana />}/>
            <Route path="/Campaña/CrearCampana" element={<CrearCampana />} />
            <Route path="/Campaña/ver/:id" element={<DetalleCampana />} />
            <Route path="/Campaña/editar/:id" element={<EditarCampana />} />

            {/*Servicios Financiados */}
            <Route path="/Lista_Servicios" element={<ListaServiciosFinancieros/>}/>
            <Route path="/servicios-financieros/CrearServicioFinanciero" element={<CrearServicioFinanciado />} />
            <Route path="/servicio/editar/:id" element={<EditarServicioFinanciado />} />
            <Route path="/servicio/ver/:id" element={<DetalleServicioFinanciado />} />


            {/*Clientes*/}
            <Route path="/Lista_clientes" element={<ListaClientes />}/>
            <Route path="/clientes/CrearCliente" element={<CrearCliente />} />
            <Route path="/cliente/editar/:id" element={<EditarCliente/>} />
            <Route path="/cliente/ver/:id" element={<DetalleCliente />} />

            {/*Estados Cuenta */}
            <Route path="/Estados_Cuenta" element={<ListaEstadoCuenta />}/>


            {/*Facturas*/}
            <Route path="/Estados_factura" element={<EstadosFactura />}/>
            <Route path="/Lista_facturas" element={<ListaFacturas />}/>
            <Route path="/facturas/Agregar-factura" element={<AgregarFactura />} />
            <Route path="/InvoicesDetail" element={<DetalleFactura />}/>

            {/*Usuarios*/}
            <Route path="/Lista_usuarios" element={<ListaUsuarios />}/>
            <Route path="/usuarios/CrearUsuario" element={<CrearUsuario />} />
            <Route path="/usuario/editar/:id" element={<EditarUsuario />} />
            <Route path="/usuario/ver/:id" element={<DetalleUsuario />} />

            {/*Nomina*/}
            <Route path="/Lista_nomina" element={<ListaNomina />}/>

            {/*Interaccions*/}
           <Route path="/ListaInteraccions" element={<ListaInteraccions />}/>
           <Route path="/interaccions/CrearInteraccions" element={<CrearInteraccions />} />
           <Route path="/interaccions/ver/:id" element={<DetalleInteraccions/>} />
           <Route path="/interaccions/editar/:id" element={<EditarInteraccions/>} />


            </Routes>
        </Router>
    );
};

 export default AppRoutes;