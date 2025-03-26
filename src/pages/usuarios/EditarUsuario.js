import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import UserService from "../../services/UserService";

const EditarUsuario = ({ entidad }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerUsuarioPorId, actualizarUsuario } = UserService(); // Agregamos actualizarUsuario
  const [user, setUser] = useState({
    name: "",
    apellidos: "",
    email: "",
    area: "",
    rol_user: "",
    bloqueo: "",
    foto_user: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <h2>Cargando...</h2>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container">
          <h2>Error: {error}</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Editar Usuario</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="apellidos" className="form-label">Apellidos</label>
                  <input
                    type="text"
                    className="form-control"
                    id="apellidos"
                    name="apellidos"
                    value={user.apellidos}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="area" className="form-label">Área</label>
                  <input
                    type="text"
                    className="form-control"
                    id="area"
                    name="area"
                    value={user.area}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="rol_user" className="form-label">Rol</label>
                  <input
                    type="text"
                    className="form-control"
                    id="rol_user"
                    name="rol_user"
                    value={user.rol_user}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bloqueo" className="form-label">Bloqueo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="bloqueo"
                    name="bloqueo"
                    value={user.bloqueo}
                    onChange={handleChange}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                <Link to={`/Lista_usuarios`} className="btn btn-secondary ms-2">Cancelar</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditarUsuario;