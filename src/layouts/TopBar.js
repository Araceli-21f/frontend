import React, { useState } from "react";

const TopBar = ({ toggleSidebar, toggleRightSidebar }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box">
            <a href="index" className="logo logo-dark">
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src="/assets/images/logo-dark.png" alt="" height="20" />
              </span>
            </a>

            <a href="index" className="logo logo-light">
              <span className="logo-sm">
                <img src="/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src="/assets/images/logo-light.png" alt="" height="20" />
              </span>
            </a>
          </div>

          <button
            type="button"
            className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn"
            onClick={toggleSidebar}
          >
            <i className="fa fa-fw fa-bars"></i>
          </button>

          <form className="app-search d-none d-lg-block">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />
              <span className="uil-search"></span>
            </div>
          </form>
        </div>

        <div className="d-flex">
          <div className="dropdown d-inline-block d-lg-none ms-2">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              id="page-header-search-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="uil-search"></i>
            </button>
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
              aria-labelledby="page-header-search-dropdown"
            >
              <form className="p-3">
                <div className="m-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search ..."
                      aria-label="Recipient's username"
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

          <div className="dropdown d-none d-lg-inline-block ms-1">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="uil-apps"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
              <div className="px-lg-2">
                <div className="row g-0">
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <img src="/assets/images/brands/github.png" alt="Github" />
                      <span>GitHub</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <img
                        src="/assets/images/brands/bitbucket.png"
                        alt="bitbucket"
                      />
                      <span>Bitbucket</span>
                    </a>
                  </div>
                </div>
                <div className="row g-0">
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <img src="/assets/images/brands/dropbox.png" alt="dropbox" />
                      <span>Dropbox</span>
                    </a>
                  </div>
                  <div className="col">
                    <a className="dropdown-icon-item" href="#">
                      <img
                        src="/assets/images/brands/mail_chimp.png"
                        alt="mail_chimp"
                      />
                      <span>Mail Chimp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon waves-effect"
              id="page-header-notifications-dropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="uil-bell"></i>
              <span className="badge bg-danger rounded-pill">3</span>
            </button>
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
              aria-labelledby="page-header-notifications-dropdown"
            >
              <div className="p-3">
                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="m-0 font-size-16"> Notifications </h5>
                  </div>
                  <div className="col-auto">
                    <a href="#!" className="small">
                      {" "}
                      Mark all as read
                    </a>
                  </div>
                </div>
              </div>
              <div data-simplebar style={{ maxHeight: "230px" }}>
                <a href="javascript:void(0);" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-xs">
                        <span className="avatar-title bg-primary rounded-circle font-size-16">
                          <i className="uil-shopping-basket"></i>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Your order is placed</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          If several languages coalesce the grammar
                        </p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 3 min ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="javascript:void(0);" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <img
                        src="/assets/images/users/avatar-3.jpg"
                        className="rounded-circle avatar-xs"
                        alt="user-pic"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">James Lemire</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          It will seem like simplified English.
                        </p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
                <a href="javascript:void(0);" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-xs">
                        <span className="avatar-title bg-success rounded-circle font-size-16">
                          <i className="uil-truck"></i>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Your item is shipped</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          If several languages coalesce the grammar
                        </p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 3 min ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                <a href="javascript:void(0);" className="text-dark notification-item">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <img
                        src="/assets/images/users/avatar-4.jpg"
                        className="rounded-circle avatar-xs"
                        alt="user-pic"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Salena Layfield</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">
                          As a skeptical Cambridge friend of mine occidental.
                        </p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> 1 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              <div className="p-2 border-top">
                <div className="d-grid">
                  <a
                    className="btn btn-sm btn-link font-size-14 text-center"
                    href="javascript:void(0)"
                  >
                    <i className="uil-arrow-circle-right me-1"></i> View More..
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="dropdown d-inline-block">
        <button
          type="button"
          className="btn header-item waves-effect"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          aria-expanded={showUserDropdown}
        >
          <img
            className="rounded-circle header-profile-user"
            src="/assets/images/users/avatar-4.jpg"
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
            Marcus
          </span>
          <i className="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
        </button>
        
        <div 
          className={`dropdown-menu dropdown-menu-end ${showUserDropdown ? 'show' : ''}`}
          style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate(0px, 70px)' }}
        >
          <a className="dropdown-item" href="/Profile">
            <i className="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
            <span className="align-middle">View Profile</span>
          </a>
          <a className="dropdown-item" href="#wallet" onClick={(e) => { e.preventDefault(); /* tu lógica aquí */ }}>
            <i className="uil uil-wallet font-size-18 align-middle me-1 text-muted"></i>
            <span className="align-middle">My Wallet</span>
          </a>
          <a className="dropdown-item d-block" href="#settings" onClick={(e) => { e.preventDefault(); /* tu lógica aquí */ }}>
            <i className="uil uil-cog font-size-18 align-middle me-1 text-muted"></i>
            <span className="align-middle">Settings</span>
            <span className="badge bg-success-subtle text-success rounded-pill mt-1 ms-2">
              03
            </span>
          </a>
          <a className="dropdown-item" href="#lock" onClick={(e) => { e.preventDefault(); /* tu lógica aquí */ }}>
            <i className="uil uil-lock-alt font-size-18 align-middle me-1 text-muted"></i>
            <span className="align-middle">Lock screen</span>
          </a>
          <a className="dropdown-item" href="/logout">
            <i className="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
            <span className="align-middle">Sign out</span>
          </a>
        </div>
      </div>

          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn header-item noti-icon right-bar-toggle waves-effect"
              onClick={toggleRightSidebar}
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