import React, { useState, useEffect } from 'react';

function RightSidebar({toggleRightSidebar, showRightSidebar}) {

  //Inicializa los estados para el diseño
  const [layout, setlayout] = useState('vertical');
  const [layoutMode, setLayoutMode] = useState(localStorage.getItem('data-bs-theme') || 'light');
  const [layoutWidth, setLayoutWidth] = useState('fluid');
  const [topbarColor, setTopbarColor] = useState('light');
  const [sidebarSize, setSidebarSize] = useState('lg');
  const [sidebarColor, setSidebarColor] = useState('light');

  //Actualiza el estado del diseño cuando cambia
  const handleLayoutChange = (value) => {
    setlayout(value);
  };

//actualiza el estado del diseño con el tema claro/oscuro
const handleLayoutModeChange = (mode) => {
  setLayoutMode(mode);
};

useEffect(() => {
  document.body.setAttribute('data-bs-theme', layoutMode);
  localStorage.setItem('data-bs-theme', layoutMode);
}, [layoutMode]);




  // Actualiza el estado del ancho del diseño y el atributo en el body.
  const handleLayoutWidthChange = (value) => {
    setLayoutWidth(value);
    document.body.setAttribute('data-layout-size', value);
  };

  // Actualiza el estado del color de la barra superior y el atributo en el body.
  const handleTopbarColorChange = (value) => {
    setTopbarColor(value);
    document.body.setAttribute('data-topbar', value);
  };

  // Actualiza el estado del tamaño de la barra lateral y el atributo en el body.
  const handleSidebarSizeChange = (value) => {
    setSidebarSize(value);
    let dataSize;
    switch (value) {
      case 'default':  dataSize = 'lg';
        break;
      case 'compact':  dataSize = 'small';
        break;
      case 'small':    dataSize = 'sm';
        break;
      default:  dataSize = 'lg';
    }
    document.body.setAttribute('data-sidebar-size', dataSize);
  };

  // Actualiza el estado del color de la barra lateral y el atributo en el body.
  const handleSidebarColorChange = (value) => {
    setSidebarColor(value);
    document.body.setAttribute('data-sidebar', value);
  };




  
  return (
    <>
      <div className={`right-bar ${showRightSidebar ? "right-bar-enabled" : ""}`}>
      <div data-simplebar className="h-100">
          <div className="rightbar-title d-flex align-items-center p-3">
            <h5 className="m-0 me-2">Settings</h5>
            <a href="#" className="right-bar-toggle ms-auto" onClick={toggleRightSidebar}>
              <i className="mdi mdi-close noti-icon"></i>
            </a>
            
          </div>

          <hr className="m-0" />

          <div className="p-4">
            <h6 className="mb-3">Layout</h6>
            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="layout"
                id="layout-vertical" value="vertical"
                checked={layout === 'vertical'}
                onChange={() => handleLayoutChange('vertical')}
                />
                <label className="form-check-label" htmlFor="layout-vertical">Vertical</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="layout"
                id="layout-horizontal" value="horizontal"
                checked={layout === 'horizontal'}
                onChange={() => handleLayoutChange('horizontal')}
                />
                <label className="form-check-label" htmlFor="layout-horizontal">Horizontal</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Layout Mode</h6>

            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="layout-mode"
                id="layout-mode-light" value="light"
                checked={layoutMode === 'light'}
                onChange={() => handleLayoutModeChange('light')}
                    />
                <label className="form-check-label" htmlFor="layout-mode-light">Light</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="layout-mode"
                id="layout-mode-dark" value="dark"
                checked={layoutMode === 'dark'}
                onChange={() => handleLayoutModeChange('dark')}
                    />
                <label className="form-check-label" htmlFor="layout-mode-dark">Dark</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Layout Width</h6>

            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="layout-width"
                    id="layout-width-fuild" value="fuild" 
                    checked={layoutWidth === 'fluid'}
                    onChange={() => {
                      handleLayoutWidthChange('fluid');
                      document.body.setAttribute('data-layout-size', 'fluid');
                  }}
                    />
                <label className="form-check-label" htmlFor="layout-width-fuild">Fluid</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="layout-width"
                id="layout-width-boxed" value="boxed" 
                checked={layoutWidth === 'boxed'}
                onChange={() => {
                  handleLayoutWidthChange('boxed');
                  document.body.setAttribute('data-layout-size', 'boxed');
              }}                />
                <label className="form-check-label" htmlFor="layout-width-boxed">Boxed</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Topbar Color</h6>

            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="topbar-color"
                id="topbar-color-light" value="light" 
                checked={topbarColor === 'light'}
                onChange={() => {
                  handleTopbarColorChange('light');
                  document.body.setAttribute('data-topbar', 'light');
              }}                />
                <label className="form-check-label" htmlFor="topbar-color-light">Light</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" 
                type="radio" name="topbar-color"
                id="topbar-color-dark" value="dark" 
                checked={topbarColor === 'dark'}
                onChange={() => {
                  handleTopbarColorChange('dark');
                  document.body.setAttribute('data-topbar', 'dark');
              }}                />
                <label className="form-check-label" htmlFor="topbar-color-dark">Dark</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2 sidebar-setting">Sidebar Size</h6>

            <div className="form-check sidebar-setting">
                <input className="form-check-input" 
                type="radio" name="sidebar-size"
                id="sidebar-size-default" value="default" 
                checked={sidebarSize === 'lg'}
                onChange={() => {
                  handleSidebarSizeChange('default');
                  document.body.setAttribute('data-sidebar-size', 'lg');
              }}                />
                <label className="form-check-label" htmlFor="sidebar-size-default">Default</label>
            </div>
            <div className="form-check sidebar-setting">
                <input className="form-check-input" 
                type="radio" name="sidebar-size"
                id="sidebar-size-compact" value="compact" 
                checked={sidebarSize === 'small'}
                onChange={() => {
                  handleSidebarSizeChange('compact');
                  document.body.setAttribute('data-sidebar-size', 'small');
              }}
                />
                <label className="form-check-label" htmlFor="sidebar-size-compact">Compact</label>
            </div>
            <div className="form-check sidebar-setting">
                <input className="form-check-input" 
                type="radio" name="sidebar-size"
                id="sidebar-size-small" value="small" 
                checked={sidebarSize === 'sm'}
                onChange={() => {
                  handleSidebarSizeChange('small');
                  document.body.setAttribute('data-sidebar-size', 'sm');
              }}
              />
                <label className="form-check-label" htmlFor="sidebar-size-small">Small (Icon View)</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2 sidebar-setting">Sidebar Color</h6>

            <div className="form-check sidebar-setting">
                <input className="form-check-input" 
                type="radio" name="sidebar-color"
                id="sidebar-color-light" value="light" 
                checked={sidebarColor === 'light'}
                onChange={() => {
                  handleSidebarColorChange('light');
                  document.body.setAttribute('data-sidebar', 'light');
              }}
                />
                <label className="form-check-label" htmlFor="sidebar-color-light">Light</label>
            </div>
            <div className="form-check sidebar-setting">
                <input className="form-check-input" 
                type="radio" name="sidebar-color"
                id="sidebar-color-dark" value="dark" 
                checked={sidebarColor === 'dark'}
                onChange={() => {
                  handleSidebarColorChange('dark');
                  document.body.setAttribute('data-sidebar', 'dark');
              }}                />
                <label className="form-check-label" htmlFor="sidebar-color-dark">Dark</label>
            </div>
            <div className="form-check sidebar-setting">
                <input className="form-check-input" 
                type="radio" name="sidebar-color"
                id="sidebar-color-colored" value="colored" 
                checked={sidebarColor === 'colored'}
                onChange={() => {
                  handleSidebarColorChange('colored');
                  document.body.setAttribute('data-sidebar', 'colored');
              }}                />
                <label className="form-check-label" htmlFor="sidebar-color-colored">Colored</label>
            </div>

        </div>
        </div>
      </div>
      {showRightSidebar && <div className="rightbar-overlay" onClick={toggleRightSidebar}></div>}
    </>
  );
}

export default RightSidebar;
