import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import UserService from "../../services/UserService";

const EditarUsuario = ({ entidad }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerUsuarioPorId, actualizarUsuario } = UserService();
  const [user, setUser] = useState({
    name: "", apellidos: "", email: "", area: "", rol_user: "", bloqueo: "", foto_user: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //obtine los datos del usuario id
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const foundUser = await obtenerUsuarioPorId(id);
        if (!foundUser) throw new Error("Usuario no encontrado");
        setUser(foundUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarUsuario(id, user);
      navigate(`/Lista_usuarios`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              <h4 className="font-size-h4">Editar Usuario</h4>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Columna para la foto */}
                  <div className="col-md-4">
                    {user.foto_user && (
                      <div className="mb-3">
                        <label className="form-label">Foto Actual</label>
                        <br />
                        <img
                          src={user.foto_user}
                          alt="Foto de usuario"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Columna para la información del usuario */}
                  <div className="col-md-8 p-5">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={user.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="apellidos" className="form-label">
                          Apellidos
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="apellidos"
                          name="apellidos"
                          value={user.apellidos}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="row">
                      <div className="col-md">
                        <label htmlFor="area" className="form-label">
                          Área
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="area"
                          name="area"
                          value={user.area}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md">
                        <label htmlFor="rol_user" className="form-label">
                          Rol
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="rol_user"
                          name="rol_user"
                          value={user.rol_user}
                          onChange={handleChange}
                        />
                      </div>
                    
                    </div>
                    <div className="col-md">
                        <label htmlFor="bloqueo" className="form-label">
                          Bloqueo
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="bloqueo"
                          name="bloqueo"
                          value={user.bloqueo}
                          onChange={handleChange}
                        />
                      </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-success">
                  Guardar Cambios
                </button>
                <Link to={`/Lista_usuarios`} className="btn btn-danger ms-2">
                  Cancelar
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </LoadingError>
  );
};

export default EditarUsuario;