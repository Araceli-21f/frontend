import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/app.min.css";

const Sidebar = () => {
  return (
    <div className="vertical-menu">
          {/* Menu*/}

      <div className="navbar-brand-box">
        {/*Logos con tamaño y color*/}
        <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt="Logo pequeño" height="22" />
          </span>
          <span className="logo-lg">
            <img src="/assets/images/logo-dark.png" alt="Logo oscuro" height="20" />
          </span>
        </Link>

        <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt="Logo pequeño" height="22" />
          </span>
          <span className="logo-lg">
            <img src="/assets/images/logo-light.png" alt="Logo claro" height="20" />
          </span>
        </Link>
      </div>

      <button type="button" className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn">
        <i className="fa fa-fw fa-bars"></i>
      </button>

      <div className="sidebar-menu-scroll">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Menú</li>

            <li>
              <Link to="/">
                <i className="uil-home-alt"></i><span className="badge rounded-pill bg-primary float-end">01</span>
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/Tablero" className="waves-effect">
                <i className="uil-comments-alt"></i>
                <span>Tablero</span>
              </Link>
            </li>
            <li>
              <Link to="/Calendario" className="waves-effect">
                <i className="uil-comments-alt"></i>
                <span>Calendario</span>
              </Link>
            </li>
            <li>
              <Link to="/Cronograma" className="waves-effect">
                <i className="uil-comments-alt"></i>
                <span>Gronograma</span>
              </Link>
            </li>
            <li>
              <Link to="/Cotizacion" className="waves-effect">
                <i className="uil-comments-alt"></i>
                <span>Cotizacion</span>
              </Link>
            </li>
            <li>
              <Link to="/Reporte" className="waves-effect">
                <i className="uil-comments-alt"></i>
                <span>Reporte</span>
              </Link>
            </li>

            <li>
            <Link href="javascript: void(0);" className="has-arrow waves-effect">
            <i className="uil-list-ul"></i>
                <span>Clientes</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/Lista_clientes">Lista de Clientes</Link></li>
                <li><Link to="/Estados_factura">Estados de Factura</Link></li>
                <li><Link to="/Lista_facturas">Lista de facturas</Link></li>
                <li><Link to="/InvoicesDetail">Detalle Factura</Link></li>

              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow waves-effect mm-activate" >
                <i className="uil-envelope"></i>
                <span>Usuarios</span>
              </Link>
              <ul className="sub-menu">
                <li><Link to="/Lista_usuarios">Lista de Usuarios</Link></li>
                <li><Link to="/Lista_nomina">Lista de Nomina</Link></li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
