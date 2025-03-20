import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";

const DetalleUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulación de carga de datos (reemplazar con llamada a API real)
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/usuarios/${id}`); // Reemplazar con la API real
        if (!response.ok) throw new Error("Usuario no encontrado");
        const data = await response.json();
        setUsuario(data);
      } catch (error) {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <h2>Cargando...</h2>
        </div>
      </Layout>
    );
  }

  if (!usuario) {
    return (
      <Layout>
        <div className="container">
          <h2>Usuario no encontrado</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="invoice-title">
                  <h4 className="float-end font-size-16">Usuario #{usuario.id}</h4>
                  <div className="mb-4">
                    <h2 className="mb-1">Detalles del Usuario</h2>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="row">
                  <div className="col-sm-6">
                    <div className="text-muted">
                      <h5 className="font-size-16 mb-3">Información Personal:</h5>
                      <p><strong>Nombre:</strong> {usuario.nombre}</p>
                      <p><strong>Email:</strong> {usuario.email}</p>
                      <p><strong>Rol:</strong> {usuario.rol}</p>
                    </div>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="text-muted">
                      <h5 className="font-size-16 mb-3">Detalles Laborales:</h5>
                      <p><strong>Área:</strong> {usuario.area}</p>
                      <p><strong>Acceso a Nómina:</strong> {usuario.accesoNomina}</p>
                    </div>
                  </div>
                </div>
                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <button className="btn btn-primary w-md waves-effect waves-light">Editar</button>
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

export default DetalleUsuario;
