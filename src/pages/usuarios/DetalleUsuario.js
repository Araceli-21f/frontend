import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";

const DetalleUsuario = ({entidad, users}) => {
  const { id } = useParams();
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Simulación de la respuesta de la API usando los datos de users
        const foundUser = users.find((u) => u.id === id);
        if (!foundUser) throw new Error("Usuario no encontrado");
        setuser(foundUser);
      } catch (error) {
        setuser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, users]);

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <h2>Cargando...</h2>
        </div>
      </Layout>
    );
  }

  if (!user) {
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
                  <h4 className="float-end font-size-16">Usuario #{user.id}</h4>
                  <div className="mb-4">
                    <h2 className="mb-1">Detalles del Usuario</h2>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="row">
                  <div className="col-sm-6">
                    <div className="text-muted">
                      <h5 className="font-size-16 mb-3">Información Personal:</h5>
                      <p><strong>Nombre:</strong> {user.nombre}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Rol:</strong> {user.rol}</p>
                    </div>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="text-muted">
                      <h5 className="font-size-16 mb-3">Detalles Laborales:</h5>
                      <p><strong>Área:</strong> {user.area}</p>
                      <p><strong>Acceso a Nómina:</strong> {user.accesoNomina}</p>
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
