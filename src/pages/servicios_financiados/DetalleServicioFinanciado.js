import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import ServicioFinanciadoService from "../../services/ServicioFinanciadoService";

const DetalleServicioFinanciado = () => {
  const { id } = useParams();
  const { obtenerServicioFinanciadoPorId, loading, error } = ServicioFinanciadoService();
  const [servicio, setServicio] = useState(null);

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const fetchedServicio = await obtenerServicioFinanciadoPorId(id);
        setServicio(fetchedServicio);
      } catch (err) {
        console.error("Error al obtener servicio financiado:", err);
      }
    };
    fetchServicio();
  }, [id]);

    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    return date.toLocaleDateString();
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
          <div className="col-lg">
            <div className="card">
              <div className="card-body">
                <div className="invoice-title">
                  <h4 className="float-end font-size-14"> # {servicio?._id}</h4>
                  <div className="mb-4">
                  </div>
                </div>
                <div className="text-muted">
                  <h4 className="font-size-h4 mb-1">Detalle del Servicio Financiero </h4>
                </div>

                <hr className="my-4" />

                <div className="row">
                  <div className="col-sm-6">
                    <div className="text-muted">
                      <h5>Servicio: </h5>
                      <p className="font-size-16 mb-4">{servicio?.nombre_servicio}</p>
                      <h5 className="font-size-16 mb-1">Cliente:</h5>
                      <p className="font-size-18 mb-2">{servicio?.cliente_id?.nombre}</p>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="text-muted text-sm-end">
                      <div>
                        <h5 className="font-size-16 mb-1">Fecha de Inicio:</h5>
                        <p className="font-size-16 mb-5">{formatDate(servicio?.fecha_inicio)}</p>
                      </div>

                      {servicio?.fecha_termino && (
                        <div className="mt-4">
                          <h5 className="font-size-16 mb-1">Fecha de Término:</h5>
                          <p className="font-size-16 mb-5">{formatDate(servicio?.fecha_termino)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <h5>Descripción: </h5>
                    <p className="font-size-16 mb-4">{servicio?.descripcion}</p>
                  </div>
                </div>

                <div className="py-2">
                  <h5 className="font-size-16 mb-2">Servicio Financiero</h5>

                  <div className="table-responsive">
                    <table className="table table-nowrap table-centered mb-0">
                      <thead>
                        <tr>
                          <th>Monto del Servicio</th>
                          <th>Pago Semanal</th>
                          <th>Saldo Restante</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>${servicio?.monto_servicio}</td>
                          <td>${servicio?.pago_semanal}</td>
                          <td>${servicio?.saldo_restante}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="d-print-none mt-4">
                    <div className="float-end">
                      <div className="d-print-none mt-4">
                        <div className="float-end">
                          <Link href="" className="btn btn-success waves-effect waves-light me-1">
                            <i className="fa fa-print"></i>
                          </Link>
                          <Link href="#" className="btn btn-primary w-md waves-effect waves-light p-2">
                            Enviar
                          </Link>
                        </div>
                      </div>
                    </div>
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

export default DetalleServicioFinanciado;