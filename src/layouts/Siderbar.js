import React, { useState }from "react";
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
  const [isSubMenuOpen3, setIsSubMenuOpen3] = useState(false);
  const toggleSubMenu3 = () => {
    setIsSubMenuOpen3(!isSubMenuOpen3);
  };

  return (
    
    <div className={`vertical-menu ${isSidebarOpen ? "" : "collapsed"}`}>
      
      <div className="navbar-brand-box">


        <Link to="/" className="logo logo-light">
        <span className="logo-lg">
            <img src="/assets/images/logo-light.png" alt="Logo claro" height="25" />
          </span>
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt="Logo pequeño" height="22" />
          </span>
          
        </Link>
        <Link to="/" className="logo logo-dark">
        <span className="logo-lg">
            <img src="/assets/images/logo-dark.png" alt="Logo oscuro" height="25" />
          </span>
          <span className="logo-sm">
            <img src="/assets/images/logo-sm-dark.png" alt="Logo pequeño" height="22" />
          </span>

        </Link>

      </div>

      <button 
        type="button" 
        className="btn btn-sm px-3 font-size-16 header-item waves-effect menu vertical vertical-menu-btn"
        onClick={toggleSidebar} >
       <i className="fa fa-fw fa-bars"></i>
       </button>
      
      <div data-simplebar className="sidebar-menu-scroll">
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title"> Menu </li>

            <li>
              <Link to="/Home" className="waves-effect">
                <i className="uil-home-alt"></i>
                <span> Inicio </span>
              </Link>
            </li>

            <li>
              <Link to="/Tablero" className="waves-effect">
                <i className="fas fa-tasks"></i>
                <span> Tablero</span>
              </Link>
            </li>

            <li>
              <Link to="/Calendario" className="waves-effect">
                <i className="far fa-calendar-alt"></i>
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
              <Link to="/ListaInteraccions" className="waves-effect">
                <i className="bx bx-folder-open"></i>
                <span> Interacciones </span>
              </Link>
            </li>
            <li>
              <Link to="/Campañas" className="waves-effect"><i className="uil-megaphone"></i><span> Campañas</span></Link>
            </li>
            <li>
              <Link to="/Lista_Eventos" className="waves-effect"><i className="uil-chart-line"></i><span>Eventos</span></Link>
            </li>
            
            <li>
              <Link to="/Lista_cotizacion" className="waves-effect">
                <i className="fas fa-file-invoice-dollar"></i>
                <span> Cotizaciones </span>
              </Link>
            </li>

            <li>
              <Link to="/Lista_pagos" className="waves-effect">
                <i className="fas fa-money-check-alt "></i>
                <span> Pagos </span>
              </Link>
            </li>

            <li>
              <Link className="has-arrow waves-effect" onClick={toggleSubMenu2}>
                <i className="fas fa-users"></i>
                <span> Clientes</span>
              </Link>
              {isSubMenuOpen2 && (
              <ul className="sub-menu">
                <li><Link to="/Lista_clientes">Lista de Clientes</Link></li>
                <li><Link to="/Estados_Cuenta">Estados Cuenta</Link></li>
              </ul>
              )}
            </li>
            <li>
            <Link
              className={"has-arrow waves-effect"} onClick={toggleSubMenu3}>
              <i className="fas fa-users"></i>
              <span> Usuarios </span>
              </Link>
                {isSubMenuOpen3 && ( 
              <ul className="sub-menu">
              <li><Link to="/Lista_usuarios">Lista de Usuarios</Link></li>
              <li>
              <Link to="/Filials" className="waves-effect">
                <i className="bx bx-folder-open"></i>
                <span> Areas </span>
              </Link>
            </li>
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
