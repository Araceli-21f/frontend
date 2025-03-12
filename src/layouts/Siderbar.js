import React, { useState}from "react";
import { Link } from "react-router-dom";

const Sidebar = ({isSidebarOpen, toggleSidebar}) => {
    //Funcion del menu y sub menu
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState(false);
  const toggleSubMenu2 = () => {
    setIsSubMenuOpen2(!isSubMenuOpen2);
  };

  return (
    
    <div className={`vertical-menu ${!isSidebarOpen ? "vertical-menu mm-active collapsed " : "expanded-menu"}`}>
      
      <div className="navbar-brand-box">

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

      <button 
        type="button" 
        className={`btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn ${!isSidebarOpen ? 'collapsed' : ''}`}
        onClick={toggleSidebar} >
       <i className="fa fa-fw fa-bars"></i>
       </button>
      
      <div data-simplebar className="sidebar-menu-scroll">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title"> Menu </li>

            <li>
              <Link to="/" className="waves-effect">
                <i className="uil-home-alt"></i>
                <span> Inicio </span>
              </Link>
            </li>

            <li>
              <Link to="/Tablero" className="waves-effect">
                <i className="uil-invoice"></i>
                <span> Tablero</span>
              </Link>
            </li>

            <li>
              <Link to="/Calendario" className="waves-effect">
                <i className="uil-calender"></i>
                <span> Calendario </span>
              </Link>
            </li>

            <li>
              <Link to="/Cronograma" className="waves-effect">
                <i className="uil-chart-growth-alt "></i>
                <span> Cronograma </span>
              </Link>
            </li>

            <li>
              <Link to="/Cotizacion" className="waves-effect">
                <i className="uil-moneybag"></i>
                <span> Cotizacion </span>
              </Link>
            </li>

            <li>
              <Link to="/Reporte" className="waves-effect">
                <i className="uil-folder "></i>
                <span> Reporte </span>
              </Link>
            </li>

            <li>
              <Link className="has-arrow waves-effect" onClick={toggleSubMenu}>
                <i className="uil-window-section"></i>
                <span> Clientes </span>
              </Link>
              {isSubMenuOpen && (
              <ul className="sub-menu">
                <li><Link to="/Lista_clientes">Lista de Clientes</Link></li>
                <li><Link to="/Estados_factura">Estados de Factura </Link></li>
                <li><Link to="/Lista_facturas">Lista de facturas</Link></li>
                <li><Link to="/InvoicesDetail">Detalle Factura</Link></li>
              </ul>
              )}
            </li>
            <li>
            <Link
              className={"has-arrow waves-effect"} onClick={toggleSubMenu2 }>
              <i className="uil-users-alt"></i>
              <span> Usuarios </span>
              </Link>
                {isSubMenuOpen2 && ( 
              <ul className="sub-menu">
              <li><Link to="/Lista_usuarios">Lista de Usuarios</Link></li>
              <li><Link to="/Lista_nomina">Lista de Nomina</Link></li>
              </ul>
              )}
          </li> 
          </ul>
        </div>
      </div> 
    </div>
  );
};

export default Sidebar;
