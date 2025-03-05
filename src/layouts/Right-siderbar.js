import React from 'react';

function RightSidebar() {
  return (
    <>
      <div className="right-bar">
        <div data-simplebar className="h-100">
          <div className="rightbar-title d-flex align-items-center p-3">
            <h5 className="m-0 me-2">Settings</h5>
            <a href="#" className="right-bar-toggle ms-auto">
              <i className="mdi mdi-close noti-icon"></i>
            </a>
          </div>

          <hr className="m-0" />

          <div className="p-4">
            <h6 className="mb-3">Layout</h6>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="layout" id="layout-vertical" value="vertical" />
              <label className="form-check-label" htmlFor="layout-vertical">Vertical</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="layout" id="layout-horizontal" value="horizontal" />
              <label className="form-check-label" htmlFor="layout-horizontal">Horizontal</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Layout Mode</h6>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="layout-mode" id="layout-mode-light" value="light" />
              <label className="form-check-label" htmlFor="layout-mode-light">Light</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="layout-mode" id="layout-mode-dark" value="dark" />
              <label className="form-check-label" htmlFor="layout-mode-dark">Dark</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Layout Width</h6>
            <div className="form-check form-check-inline">
              <input 
                className="form-check-input" 
                type="radio" 
                name="layout-width" 
                id="layout-width-fluid" 
                value="fluid"
                onChange={() => document.body.setAttribute('data-layout-size', 'fluid')}
              />
              <label className="form-check-label" htmlFor="layout-width-fluid">Fluid</label>
            </div>
            <div className="form-check form-check-inline">
              <input 
                className="form-check-input" 
                type="radio" 
                name="layout-width" 
                id="layout-width-boxed" 
                value="boxed"
                onChange={() => document.body.setAttribute('data-layout-size', 'boxed')}
              />
              <label className="form-check-label" htmlFor="layout-width-boxed">Boxed</label>
            </div>

            <h6 className="mt-4 mb-3 pt-2">Direction</h6>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="layout-direction" id="layout-direction-ltr" value="ltr" />
              <label className="form-check-label" htmlFor="layout-direction-ltr">LTR</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="layout-direction" id="layout-direction-rtl" value="rtl" />
              <label className="form-check-label" htmlFor="layout-direction-rtl">RTL</label>
            </div>
          </div>
        </div>
      </div>
      <div className="rightbar-overlay"></div>
    </>
  );
}

export default RightSidebar;
