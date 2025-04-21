import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/UserService";


const TopBar = ({ toggleSidebar, toggleRightSidebar }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAppsDropdown, setShowAppsDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userService = UserService();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await userService.obtenerUsuarios();
        if (fetchedUsers.length > 0) {
          setUser(fetchedUsers[0]); 
        }
      } catch (err) {
        setError(err.message || "Error al cargar el usuario en TopBar");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userService]);

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          {/* Logo */}
          <div className="navbar-brand-box">
            <Link to="/" className="logo logo-dark">
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="Logo pequeño" height="22" />
              </span>
              <span className="logo-lg">
                <img src="/assets/images/logo-dark.png" alt="Logo" height="20" />
              </span>
            </Link>

            <Link to="/" className="logo logo-light">
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="Logo pequeño" height="22" />
              </span>
              <span className="logo-lg">
                <img src="/assets/images/logo-light.png" alt="Logo" height="20" />
              </span>
            </Link>
          </div>

          {/* Botón para toggle sidebar */}
          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
            onClick={toggleSidebar}
            aria-label="Alternar menú lateral"
          >
            <i className="fa fa-fw fa-bars"></i>
          </button>

          {/* Búsqueda desktop */}
          <form className="app-search d-none d-lg-block" role="search">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Buscar"
              />
              <span className="uil-search"></span>
            </div>
          </form>
        </div>

        <div className="d-flex">
          {/* Búsqueda mobile */}
          <div className="dropdown d-inline-block d-lg-none ms-2">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              onClick={() => setShowSearchDropdown(!showSearchDropdown)}
              aria-expanded={showSearchDropdown}
              aria-label="Buscar"
            >
              <i className="uil-search"></i>
            </button>
            <div 
              className={`dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 ${showSearchDropdown ? 'show' : ''}`}
              aria-labelledby="page-header-search-dropdown"
            >
              <form className="p-3">
                <div className="m-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search ..."
                      aria-label="Buscar"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Dropdown de apps */}
          <div className="dropdown d-none d-lg-inline-block ms-1">
  <button
    type="button"
    className="btn header-item noti-icon waves-effect"
    onClick={() => setShowAppsDropdown(!showAppsDropdown)}
    aria-expanded={showAppsDropdown}
    aria-label="Aplicaciones"
  >
    <i className="uil-apps"></i>
  </button>
  <div 
    className={`dropdown-menu dropdown-menu-ms dropdown-menu-start ${showAppsDropdown ? 'show' : ''}`}
  >
              <div className="px-sm-2">
                <div className="row g-0">
                  <div className="col">
                    <Link to="/Calendario" className="dropdown-icon-item">
                    <i className="far fa-calendar-alt"></i>
                    <span>Calendario</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link to="/Cronograma" className="dropdown-icon-item">
                    <i className="uil-chart-growth-alt "></i>
                    <span>Cronograma</span>
                    </Link>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Dropdown de usuario */}
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item waves-effect"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              aria-expanded={showUserDropdown}
              aria-label="Menú de usuario"
            >
              <img
                 className="rounded-circle header-profile-user"
                 src={user?.foto_user || "/assets/images/users/user-default.png"}
                 alt="Foto de perfil"
              />
              
              <i className="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
            </button>
            
            <div 
              className={`dropdown-menu dropdown-menu-end ${showUserDropdown ? 'show' : ''}`}
            >
              <Link to="/profile" className="dropdown-item">
                <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
                <span className="align-middle">Perfil</span>
              </Link>
              <Link to="#settings" className="dropdown-item d-block" onClick={(e) => e.preventDefault()}>
                <i className="uil uil-cog font-size-18 align-middle me-1 text-muted"></i>
                <span className="align-middle">Configuraciones</span>
              </Link>
              <Link to="#lock" className="dropdown-item" onClick={(e) => e.preventDefault()}>
                <i className="uil uil-lock-alt font-size-18 align-middle me-1 text-muted"></i>
                <span className="align-middle">Bloqueo Pantalla</span>
              </Link>
              <Link to="/logout" className="dropdown-item">
                <i className="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
                <span className="align-middle">Cerrar Sesión</span>
              </Link>
            </div>
          </div>

          {/* Botón de configuración */}
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon right-bar-toggle waves-effect"
              onClick={toggleRightSidebar}
              aria-label="Configuración"
            >
              <i className="uil-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;