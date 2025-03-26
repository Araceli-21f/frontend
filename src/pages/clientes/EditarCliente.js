import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import useClienteService from "../../services/ClienteService"; // Importa el hook personalizado

const EditarCliente = ({ entidad }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerClientePorId, actualizarCliente } = useClienteService(); // Usa el hook personalizado
  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    estado_cliente: "Activo", // Valor por defecto
    tipo_cliente: "Individual", // Valor por defecto
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      setLoading(true);
      try {
        const foundCliente = await obtenerClientePorId(id);
        if (!foundCliente) throw new Error("Cliente no encontrado");
        setCliente(foundCliente);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  // Select
  const tiposCliente = ["Individual", "Empresa"];
  const estadosCliente = ["Activo", "Inactivo"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarCliente(id, cliente);
      navigate(`/Lista_Clientes`);
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
              <h4 className="card-title">Editar Cliente</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombre" name="nombre" value={cliente.nombre} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input type="text" className="form-control" id="telefono" name="telefono" value={cliente.telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">Correo</label>
                  <input type="email" className="form-control" id="correo" name="correo" value={cliente.correo} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección</label>
                  <input type="text" className="form-control" id="direccion" name="direccion" value={cliente.direccion} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="estado_cliente" className="form-label">Estado del Cliente</label>
                  <select className="form-select" name="estado_cliente" value={cliente.estado_cliente} onChange={handleChange}>
                    <option value="">Selecciona un estado</option>
                    {estadosCliente.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="tipo_cliente" className="form-label">Tipo de Cliente</label>
                  <select className="form-select" name="tipo_cliente" value={cliente.tipo_cliente} onChange={handleChange}>
                    <option value="">Selecciona un tipo</option>
                    {tiposCliente.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                <Link to={`/Lista_Clientes`} className="btn btn-secondary ms-2">Cancelar</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCliente;