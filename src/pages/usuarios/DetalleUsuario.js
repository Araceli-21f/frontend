import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import UserService from "../../services/UserService";

const DetalleUsuario = ({ entidad }) => {
  const { id } = useParams();
  const { error, obtenerUsuarioPorId } = UserService(); // Nombre corregido
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ID actual:", id);
    const fetchUser = async () => {
      setLoading(true);
      try {
        const foundUser = await obtenerUsuarioPorId(id);
        console.log("Datos del usuario obtenidos:", foundUser);
        if (!foundUser) throw new Error("Usuario no encontrado");
        setUser(foundUser);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);  
  
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
                <h4 className="float-end font-size-16">Usuario   #{user?._id}</h4>
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
                  <h3 className="font-size-h4 mb-1">Detalles del Usuario</h3>
                </div>
              </div>

              <hr className="my-3" />

              <div className="row">
                {/* Columna para la Foto */}
                <div className="col-md-4">
                  <div className="text-center">
                    <img
                      src={user?.foto_user}
                      alt="Foto de perfil"
                      className="rounded-circle"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                </div>

                {/* Columna para la Información del Usuario */}
                <div className="col-md-8">
                  <div className="text-muted">
                    <h5 className="font-size-20 mb-3">Información Personal:</h5>
                    <p className="font-size-16 mb-2">Nombre: {user?.name} {user?.apellidos}</p>
                    <p className="font-size-16 mb-2">Email: {user?.email}</p>
                    <h5 className="font-size-18 mt-4 mb-1">Detalles Laborales:</h5>
                    <p className="font-size-16 mb-2">Área: {user?.area}</p>
                    <p className="font-size-16 mb-2">Rol: {user?.rol_user}</p>
                    <h5 className="font-size-18 mt-4 mb-1">Otros Datos:</h5>
                    <p className="font-size-16 mb-2">Bloqueo: {user?.bloqueo}</p>
                  </div>
                </div>
              </div>

              <div className="d-print-none mt-4">
                <div className="float-end">
                  <Link
                    to="/usuario/editar/:id"
                    className="btn btn-primary w-md waves-effect waves-light"
                  >
                    Editar Perfil
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

export default DetalleUsuario;