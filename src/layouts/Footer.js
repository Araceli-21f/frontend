import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            {currentYear} © Minible.
          </div>
          <div className="col-sm-6">
            <div className="text-sm-end d-none d-sm-block">
              Crafted with <i className="mdi mdi-heart text-danger"></i> by{' '}
              <a
                href="https://themesbrand.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-reset"
              >
                Themesbrand
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;