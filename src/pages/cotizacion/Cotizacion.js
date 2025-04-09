import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import CotizacionService from "../../services/CotizacionService";

const DetalleCotizacion = () => {
  const { id } = useParams();
  const { obtenerCotizacionPorId, loading, error } = CotizacionService();
  const [cotizacion, setCotizacion] = useState(null);

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const fetchedCotizacion = await obtenerCotizacionPorId(id);
        setCotizacion(fetchedCotizacion);
      } catch (err) {
        console.error("Error al obtener cotización:", err);
      }
    };
    fetchCotizacion();
  }, [id]);

  if (!cotizacion) {
    return (
      <LoadingError
        loading={loading}
        error={error}
        loadingMessage="Cargando datos..."
        errorMessage={error?.message}
      />
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  return (
    <LoadingError
      loading={loading}
      error={error}
      loadingMessage="Cargando datos..."
      errorMessage={error?.message}
    >
      <Layout>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="invoice-title">
                  <h4 className="float-end font-size-16">
                    Cotización #{cotizacion.numero || cotizacion._id}
                  </h4>
                  <div className="mb-4">
                    <img
                      src="/assets/images/logo-dark.png"
                      alt="logo"
                      height="20"
                    />
                  </div>
                  <div className="text-muted">
                    <p className="mb-1">
                      <strong>Estado:</strong> {cotizacion.estado}
                    </p>
                    <p className="mb-1">
                      <strong>Filial:</strong> {cotizacion.filial?.nombre_filial}
                    </p>
                    <p className="mb-1">
                      <strong>Vendedor:</strong> {cotizacion.vendedor}
                    </p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="row">
                  <div className="col-sm-6">
                    <div className="text-muted">
                      <h5 className="font-size-16 mb-3">Cliente:</h5>
                      <h5 className="font-size-15 mb-2">
                        {cotizacion.cliente?.nombre}
                      </h5>
                      {/* Agregar más detalles del cliente si están disponibles */}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-muted text-sm-end">
                      <div>
                        <h5 className="font-size-16 mb-1">Fecha:</h5>
                        <p>{formatDate(cotizacion.fecha)}</p>
                      </div>
                      <div className="mt-2">
                        <h5 className="font-size-16 mb-1">Válido hasta:</h5>
                        <p>{formatDate(cotizacion.validoHasta)}</p>
                      </div>
                      <div className="mt-2">
                        <h5 className="font-size-16 mb-1">Tipo:</h5>
                        <p>{cotizacion.tipo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de Financiamiento si aplica */}
                {cotizacion.tipo === 'Financiado' && cotizacion.financiamiento && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h5 className="font-size-15">Detalles de Financiamiento</h5>
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead>
                            <tr>
                              <th>Anticipo</th>
                              <th>Plazo (semanas)</th>
                              <th>Pago Semanal</th>
                              <th>Saldo Restante</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{formatCurrency(cotizacion.financiamiento.anticipo)}</td>
                              <td>{cotizacion.financiamiento.plazo}</td>
                              <td>{formatCurrency(cotizacion.financiamiento.pagoSemanal)}</td>
                              <td>{formatCurrency(cotizacion.financiamiento.saldoRestante)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección de Pago Contado si aplica */}
                {cotizacion.tipo === 'Contado' && cotizacion.pagoContado && (
                  <div className="row mt-3">
                    <div className="col-12">
                      <h5 className="font-size-15">Detalles de Pago de Contado</h5>
                      <p>
                        <strong>Fecha de Pago:</strong> {formatDate(cotizacion.pagoContado.fechaPago)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="py-2 mt-3">
                  <h5 className="font-size-15">Items de la Cotización</h5>
                  <div className="table-responsive">
                    <table className="table table-nowrap table-centered mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: "70px" }}>No.</th>
                          <th>Descripción</th>
                          <th>Cantidad</th>
                          <th>Precio Unitario</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cotizacion.items.map((item, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.descripcion}</td>
                            <td>{item.cantidad}</td>
                            <td>{formatCurrency(item.precio)}</td>
                            <td className="text-end">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-4 offset-md-8">
                    <div className="table-responsive">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <th>Subtotal:</th>
                            <td className="text-end">{formatCurrency(cotizacion.subtotal)}</td>
                          </tr>
                          <tr>
                            <th>IVA (19%):</th>
                            <td className="text-end">{formatCurrency(cotizacion.iva)}</td>
                          </tr>
                          <tr className="border-top">
                            <th>Total:</th>
                            <td className="text-end fw-bold">{formatCurrency(cotizacion.total)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sección de Seguimiento del Servicio */}
                <div className="row mt-3">
                  <div className="col-12">
                    <h5 className="font-size-15">Seguimiento del Servicio</h5>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            <th>Estado del Servicio</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{cotizacion.estadoServicio}</td>
                            <td>{formatDate(cotizacion.fechaInicioServicio)}</td>
                            <td>{formatDate(cotizacion.fechaFinServicio)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <button
                      onClick={() => window.print()}
                      className="btn btn-success waves-effect waves-light me-1"
                    >
                      <i className="fa fa-print"></i> Imprimir
                    </button>
                    {cotizacion.estado === 'Borrador' && (
                      <Link
                        to={`/editar-cotizacion/${cotizacion._id}`}
                        className="btn btn-primary waves-effect waves-light me-1"
                      >
                        Editar
                      </Link>
                    )}
                    <Link
                      to="/lista-cotizaciones"
                      className="btn btn-secondary waves-effect waves-light"
                    >
                      Volver
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </LoadingError>
  );
};

export default DetalleCotizacion;