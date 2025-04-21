import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import NotaService from "../../services/NotaService";
import ClienteService from "../../services/ClienteService";

const DetalleNota = () => {
  const { id } = useParams();
  const { error, obtenerNotaPorId } = NotaService();
  const { obtenerClientePorId } = ClienteService();
  const [nota, setNota] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const foundNota = await obtenerNotaPorId(id);
        if (!foundNota) {
          setNotFound(true);
          return;
        }
        setNota(foundNota);

        if (foundNota.cliente_id) {
          const clienteData = await obtenerClientePorId(foundNota.cliente_id);
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

  if (notFound) {
    return (
      <Layout>
        <div className="alert alert-danger mt-3">
          Nota no encontrada
        </div>
        <Link to="/ListaNotas" className="btn btn-secondary mt-3">
          Volver al Listado
        </Link>
      </Layout>
    );
  }

  if (loading || !nota) {
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
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-1">Detalles de la Nota</h4>
                  <small className="text-muted">ID: #{nota._id}</small>
                </div>
                <span className="badge bg-info px-3 py-2 rounded">
                  {formatDateTime(nota.fecha_creacion)}
                </span>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <h6 className="text-muted mb-1">Cliente</h6>
                    <p className="mb-0">
                      {cliente ? (
                        <Link to={`/clientes/${cliente._id}`} className="text-primary">
                          {cliente.nombre}
                        </Link>
                      ) : (
                        <span className="text-muted">No asignado</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="detail-item mb-3">
                    <h6 className="text-muted mb-1">Título</h6>
                    <p className="mb-0 fw-bold">{nota.titulo}</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <h6 className="text-muted mb-1">Fecha de Actualización</h6>
                    <p className="mb-0">{formatDateTime(nota.fecha_actualizacion)}</p>
                  </div>
                  
                  <div className="detail-item mb-3">
                    <h6 className="text-muted mb-1">Creada por</h6>
                    <p className="mb-0">{nota.creado_por || "No especificado"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-muted mb-2">Contenido</h6>
                <div className="p-3 bg-light rounded">
                  {nota.contenido || 
                   <span className="text-muted">No hay contenido disponible</span>}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Link
                  to="/ListaNotas"
                  className="btn btn-outline-secondary me-2"
                >
                  <i className="fas fa-arrow-left me-2"></i>Volver
                </Link>
               
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </LoadingError>
  );
};

export default DetalleNota;