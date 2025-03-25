import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

const EditarCampana = () => {
  const { id } = useParams(); // Obtener el ID de la campaña de los parámetros de la URL
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("activa");
  const [clientes, setClientes] = useState([]);
  const [allClientes, setAllClientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampana = async () => {
      try {
        const response = await axios.get(`/api/campanas/${id}`);
        const campana = response.data;
        setNombre(campana.nombre);
        setDescripcion(campana.descripcion);
        setFechaInicio(campana.fecha_inicio);
        setFechaFin(campana.fecha_fin);
        setEstado(campana.estado);
        setClientes(campana.clientes);
      } catch (error) {
        console.error("Error al obtener la campaña:", error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get("/api/clientes");
        setAllClientes(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    };

    fetchCampana();
    fetchClientes();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/campanas/${id}`, {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        estado,
        clientes,
      });
      navigate('/campanas');
    } catch (error) {
      console.error("Error al actualizar la campaña:", error);
    }
  };

  const handleClienteChange = (e) => {
    const selectedClienteId = e.target.value;
    if (e.target.checked) {
      setClientes([...clientes, selectedClienteId]);
    } else {
      setClientes(clientes.filter((id) => id !== selectedClienteId));
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Editar Campaña</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fecha_inicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fecha_fin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Clientes</label>
                  <div>
                    {allClientes.map((cliente) => (
                      <div key={cliente._id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value={cliente._id}
                          checked={clientes.includes(cliente._id)}
                          onChange={handleClienteChange}
                          id={`cliente-${cliente._id}`}
                        />
                        <label className="form-check-label" htmlFor={`cliente-${cliente._id}`}>
                          {cliente.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCampana;