import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/app.min.css";
import "../assets/css/bootstrap.min.css";

const Sidebar = () => {
  return (
    <div className="vertical-menu">
      <div className="navbar-brand-box">
        <Link to="/index" className="logo logo-dark">
          <span className="logo-sm">
            <img src="/assets/images/logo-sm.png" alt="Logo pequeño" height="22" />
          </span>
          <span className="logo-lg">
            <img src="/assets/images/logo-dark.png" alt="Logo oscuro" height="20" />
          </span>
        </Link>

        <Link to="/index" className="logo logo-light">
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
              <Link to="/index">
                <i className="uil-home-alt"></i><span className="badge rounded-pill bg-primary float-end">01</span>
                <span>Inicio</span>
              </Link>
            </li>

            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="uil-window-section"></i>
                <span>Opciones</span>
              </a>
              <ul className="sub-menu">
                <li>
                  <a href="#" className="has-arrow">Subopción</a>
                  <ul className="sub-menu">
                    <li><Link to="/layouts-horizontal">1</Link></li>
                    <li><Link to="/layouts-hori-topbar-dark">2</Link></li>
                    <li><Link to="/layouts-hori-boxed-width">3</Link></li>
                    <li><Link to="/layouts-hori-preloader">4</Link></li>
                  </ul>
                </li>
              </ul>
            </li>

            <li className="menu-title">Más opciones</li>

            <li>
              <Link to="/calendar" className="waves-effect">
                <i className="uil-calender"></i>
                <span>Calendario</span>
              </Link>
            </li>

            <li>
              <Link to="/chat" className="waves-effect">
                <i className="uil-comments-alt"></i>
                <span>Chat</span>
              </Link>
            </li>

            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="uil-envelope"></i>
                <span>Correos</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/email-inbox">Bandeja de entrada</Link></li>
                <li><Link to="/email-read">Leer correo</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="uil-user-circle"></i>
                <span>Usuarios</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/auth-login">Iniciar sesión</Link></li>
                <li><Link to="/auth-register">Registrarse</Link></li>
                <li><Link to="/auth-recoverpw">Recuperar contraseña</Link></li>
                <li><Link to="/auth-lock-screen">Bloquear pantalla</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="uil-list-ul"></i>
                <span>Tablas</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/tables-basic">Básico</Link></li>
                <li><Link to="/tables-datatable">DataTable</Link></li>
                <li><Link to="/tables-responsive">Responsive</Link></li>
                <li><Link to="/tables-editable">Editable</Link></li>
              </ul>
            </li>

            <li>
              <a href="#" className="has-arrow waves-effect">
                <i className="uil-chart"></i>
                <span>Gráficos</span>
              </a>
              <ul className="sub-menu">
                <li><Link to="/charts-apex">Apex</Link></li>
                <li><Link to="/charts-chartjs">ChartJS</Link></li>
                <li><Link to="/charts-flot">Flot</Link></li>
                <li><Link to="/charts-knob">Knob</Link></li>
                <li><Link to="/charts-sparkline">Sparkline</Link></li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
