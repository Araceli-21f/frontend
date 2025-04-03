import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // Importa useParams
import Layout from "../../layouts/pages/layout";
import CotizacionService from "../../services/CotizacionService";

const DetalleCotizacion = () => {
  const { id } = useParams(); // Obtiene el ID de la cotización de la URL
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

  if (loading) {
    return <p>Cargando cotización...</p>;
  }

  if (error) {
    return <p>Error al cargar cotización: {error.message}</p>;
  }

  if (!cotizacion) {
    return <p>Cotización no encontrada.</p>;
  }

  return (
    <Layout>
      {/* Detalles de Cotización */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="invoice-title">
                <h4 className="float-end font-size-16">
                  Cotización #{cotizacion._id}
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
                  <p className="mb-1">Filial: {cotizacion.filial_id.nombre_filial}</p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row">
                <div className="col-sm-6">
                  <div className="text-muted">
                    <h5 className="font-size-16 mb-3">Cotizado a:</h5>
                    <h5 className="font-size-15 mb-2">
                      {cotizacion.cliente_id.nombre}
                    </h5>
                    <p className="mb-1">
                      {/* Aquí podrías agregar más detalles del cliente si los tienes */}
                    </p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted text-sm-end">
                    <div>
                      <h5 className="font-size-16 mb-1">
                        Fecha de Cotización:
                      </h5>
                      <p>{new Date(cotizacion.fecha_cotizacion).toLocaleDateString()}</p>
                    </div>

                    <div className="mt-4">
                      <h5 className="font-size-16 mb-1">Método de Pago:</h5>
                      <p className="mb-1">{cotizacion.forma_pago}</p>
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
                      {cotizacion.detalles.map((detalle, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <h5 className="font-size-15 mb-1">
                              {detalle.descripcion}
                            </h5>
                            <p className="font-size-13 text-muted mb-0">
                              Costo Materiales: {detalle.costo_materiales}, Costo Mano de Obra: {detalle.costo_mano_obra}
                            </p>
                          </td>
                          <td>${detalle.inversion}</td>
                          <td className="text-end">${detalle.utilidad_esperada}</td>
                        </tr>
                      ))}
                      <tr>
                        <th scope="row" colSpan="3" className="text-end">
                          Total
                        </th>
                        <td className="border-0 text-end">
                          <h4 className="m-0">${cotizacion.precio_venta}</h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <Link
                      href=""
                      className="btn btn-success waves-effect waves-light me-1"
                    >
                      <i className="fa fa-print"></i>
                    </Link>
                    <Link
                      href="#"
                      className="btn btn-primary w-md waves-effect waves-light"
                    >
                      Enviar
                    </Link>
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

export default DetalleCotizacion;