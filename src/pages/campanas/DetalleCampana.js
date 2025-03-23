import React, { useEffect, useState } from "react";
import Layout from "../../layouts/pages/layout";
import axios from "axios";

const DetalleCampana = ({ campanaId }) => {
  const [campana, setCampana] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener los datos de la campaña
    const fetchCampana = async () => {
      try {
        const response = await axios.get(`/api/campanas/${campanaId}`);
        setCampana(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de la campaña:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampana();
  }, [campanaId]);

  // Mientras se carga la información, mostrar un indicador de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay datos de la campaña, se muestra un mensaje de error
  if (!campana) {
    return <div>No se encontraron los datos de la campaña.</div>;
  }

  const { nombre, descripcion, fecha_inicio, fecha_fin, estado, clientes } = campana;

  return (
    <Layout>
      {/* Detalles de la Campaña */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="invoice-title">
                <h4 className="float-end font-size-16">Campaña: {nombre}</h4>
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
              </div>

              <hr className="my-4" />

              <div className="row">
                <div className="col-sm-6">
                  <div className="text-muted">
                    <h5 className="font-size-16 mb-3">Detalles de la Campaña</h5>
                    <p className="mb-1">
                      <strong>Descripción:</strong> {descripcion}
                    </p>
                    <p className="mb-1">
                      <strong>Estado:</strong> {estado}
                    </p>
                    <p className="mb-1">
                      <strong>Clientes:</strong> {clientes.length} clientes
                    </p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted text-sm-end">
                    <div>
                      <h5 className="font-size-16 mb-1">Fechas</h5>
                      <p><strong>Inicio:</strong> {new Date(fecha_inicio).toLocaleDateString()}</p>
                      <p><strong>Fin:</strong> {new Date(fecha_fin).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <h5 className="font-size-15">Resumen de la Campaña</h5>

                <div className="table-responsive">
                  <table className="table table-nowrap table-centered mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "70px" }}>No.</th>
                        <th>Cliente</th>
                        <th>Fecha de Inscripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((cliente, index) => (
                        <tr key={cliente._id}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <h5 className="font-size-15 mb-1">{cliente.nombre}</h5>
                          </td>
                          <td>{new Date(cliente.fecha_inscripcion).toLocaleDateString()}</td>
                        </tr>
                      ))}
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

export default DetalleCampana;
