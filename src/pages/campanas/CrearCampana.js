import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const CrearCampana = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("activa");
  const [clientes, setClientes] = useState([]);
  const [allClientes, setAllClientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la lista de todos los clientes disponibles
    const fetchClientes = async () => {
      try {
        const response = await axios.get("/api/clientes"); // Asegúrate de que esta ruta sea correcta
        setAllClientes(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/campanas", {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        estado,
        clientes,
      });
      navigate('/campanas');
    } catch (error) {
      console.error("Error al crear la campaña:", error);
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
              <h4 className="card-title">Crear Nueva Campaña</h4>
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
                  Crear Campaña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrearCampana;