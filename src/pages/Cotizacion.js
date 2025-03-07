import React from "react";
import Layout from "../layouts/pages/layout";

const Cotizacion = () => {
  return (
    <Layout>
      {/* Detalles de Cotización */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="invoice-title">
                <h4 className="float-end font-size-16">
                  Cotización #12345
                </h4>
                <div className="mb-4">
                  <img
                    src="/assets/images/logo-dark.png"
                    alt="logo"
                    height="20"
                    className="logo-dark"
                  />
                  <img
                    src="/assets/images/logo-light.png"
                    alt="logo"
                    height="20"
                    className="logo-light"
                  />
                </div>
                <div className="text-muted">
                  <p className="mb-1">1874 County Line Road City, FL 33566</p>
                  <p className="mb-1">
                    <i className="uil uil-envelope-alt me-1"></i> abc@123.com
                  </p>
                  <p>
                    <i className="uil uil-phone me-1"></i> 012-345-6789
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row">
                <div className="col-sm-6">
                  <div className="text-muted">
                    <h5 className="font-size-16 mb-3">Cotizado a:</h5>
                    <h5 className="font-size-15 mb-2">Richard Saul</h5>
                    <p className="mb-1">
                      1208 Sherwood Circle Lafayette, LA 70506
                    </p>
                    <p className="mb-1">RichardSaul@rhyta.com</p>
                    <p>337-256-9134</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted text-sm-end">
                    <div>
                      <h5 className="font-size-16 mb-1">Fecha de Cotización:</h5>
                      <p>February 16, 2020</p>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-size-16 mb-1">Método de Pago:</h5>
                      <p className="mb-1">Visa ending **** 4242</p>
                      <p>richards@email.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <h5 className="font-size-15">Resumen de la Cotización</h5>

                <div className="table-responsive">
                  <table className="table table-nowrap table-centered mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "70px" }}>No.</th>
                        <th>Artículo</th>
                        <th>Precio</th>
                        <th className="text-end" style={{ width: "120px" }}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">01</th>
                        <td>
                          <h5 className="font-size-15 mb-1">Minia</h5>
                          <p className="font-size-13 text-muted mb-0">
                            Bootstrap 5 Admin Dashboard
                          </p>
                        </td>
                        <td>$499.00</td>
                        <td className="text-end">$499.00</td>
                      </tr>

                      <tr>
                        <th scope="row">02</th>
                        <td>
                          <h5 className="font-size-15 mb-1">Skote</h5>
                          <p className="font-size-13 text-muted mb-0">
                            Bootstrap 5 Admin Dashboard
                          </p>
                        </td>
                        <td>$499.00</td>
                        <td className="text-end">$499.00</td>
                      </tr>

                      <tr>
                        <th scope="row" colSpan="3" className="text-end">
                          Sub Total
                        </th>
                        <td className="text-end">$998.00</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3" className="border-0 text-end">
                          Impuesto
                        </th>
                        <td className="border-0 text-end">$12.00</td>
                      </tr>
                      <tr>
                        <th scope="row" colSpan="3" className="border-0 text-end">
                          Total
                        </th>
                        <td className="border-0 text-end">
                          <h4 className="m-0">$1010.00</h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <a
                      href="javascript:window.print()"
                      className="btn btn-success waves-effect waves-light me-1"
                    >
                      <i className="fa fa-print"></i>
                    </a>
                    <a
                      href="#"
                      className="btn btn-primary w-md waves-effect waves-light"
                    >
                      Enviar
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cotizacion;