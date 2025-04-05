import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import InteraccionService from "../../services/InteraccionService";
import ClienteService from "../../services/ClienteService";

const DetalleInteraccion = () => {
  const { id } = useParams();
  const { error, obtenerInteraccionPorId } = InteraccionService();
  const { obtenerClientePorId } = ClienteService();
  const [interaccion, setInteraccion] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener interacción
        const foundInteraccion = await obtenerInteraccionPorId(id);
        if (!foundInteraccion) {
          setNotFound(true);
          return;
        }
        setInteraccion(foundInteraccion);

        // Obtener cliente asociado si existe
        if (foundInteraccion.cliente_id) {
          const clienteData = await obtenerClientePorId(foundInteraccion.cliente_id);
          setCliente(clienteData);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Función para formatear fecha y hora
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estilo para el estado
  const getEstadoStyle = (estado) => {
    switch(estado) {
      case 'completada': return 'badge bg-success';
      case 'pendiente': return 'badge bg-warning text-dark';
      case 'cancelada': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  if (notFound) {
    return (
      <Layout>
        <div className="alert alert-danger mt-3">
          Interacción no encontrada
        </div>
        <Link to="/ListaInteraccions" className="btn btn-secondary mt-3">
          Volver al Listado
        </Link>
      </Layout>
    );
  }

  if (loading || !interaccion) {
    return (
      <LoadingError
        loading={true}
        loadingMessage="Cargando datos..."
      />
    );
  }

  return (
    <LoadingError
      loading={loading}
      error={error}
      loadingMessage="Cargando datos..."
      errorMessage={error?.message}
    >
      <Layout>
        <div className="row">
          <div className="col">
            <div className="card p-4">
              <div className="invoice-title">
                <h4 className="float-end font-size-16">Interacción #{interaccion._id}</h4>
                <div className="mb-4">
                  <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark"/>
                  <img src="/assets/images/logo-light.png" alt="logo" height="20" className="logo-light" />
                </div>
                <div className="text-muted">
                  <h4 className="font-size-h4 mb-1">Detalles de la Interacción</h4>
                </div>
              </div>
              <hr className="my-4"/>

              <div className="row">
                {/* Columna para la Información Principal */}
                <div className="col-md-8">
                  <div className="text-muted">
                    <h5 className="font-size-20 mb-3">Información Básica:</h5>
                    <p className="font-size-16 mb-2">
                      Cliente:{interaccion.cliente_id?.nombre}
                    </p>
                    <p className="font-size-16 mb-2">
                      Tipo: <span className="badge bg-primary">{interaccion.tipo_interaccion}</span>
                    </p>
                    <p className="font-size-16 mb-2">
                      Fecha y Hora: {formatDateTime(interaccion.fecha)}
                    </p>
                    <p className="font-size-16 mb-2">
                      Responsable: {interaccion.responsable}
                    </p>
                    <p className="font-size-16 mb-2">
                      Estado: <span className={getEstadoStyle(interaccion.estado)}>
                        {interaccion.estado}
                      </span>
                    </p>

                    <p className="font-size-16 mb-2">
                        Descripción: {interaccion.descripcion}
                    </p>  
                  </div>             
              </div>

              <div className="d-print-none mt-4">
                <div className="float-end">
                  <Link
                    to="/ListaInteraccions"
                    className="btn btn-secondary w-md waves-effect waves-light">
                    Volver al Listado
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

export default DetalleInteraccion;