import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import InteraccionService from "../../services/InteraccionService";

const CrearInteraccion = () => {
  const [tipo_interaccion, setTipoInteraccion] = useState("llamada");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState("12:00");
  const [responsable, setResponsable] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [cliente_id, setClienteId] = useState("");
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

  const { crearInteraccion } = InteraccionService();

  useEffect(() => {
    // Obtener la lista de todos los clientes disponibles
    const fetchClientes = async () => {
      try {
        const response = await axios.get("/api/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearInteraccion({
        cliente_id,
        tipo_interaccion,
        fecha: `${fecha}T${hora}:00.000Z`,
        descripcion,
        responsable,
        estado
      });
      navigate('/interacciones');
    } catch (error) {
      console.error("Error al crear la interacción:", error);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Registrar Nueva Interacción</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Cliente</label>
                  <select
                    className="form-select"
                    value={cliente_id}
                    onChange={(e) => setClienteId(e.target.value)}
                    required
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente._id} value={cliente._id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Tipo de Interacción</label>
                  <select
                    className="form-select"
                    value={tipo_interaccion}
                    onChange={(e) => setTipoInteraccion(e.target.value)}
                    required
                  >
                    <option value="llamada">Llamada</option>
                    <option value="correo">Correo Electrónico</option>
                    <option value="reunión">Reunión</option>
                    <option value="visita">Visita</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    className="form-control"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Responsable</label>
                  <input
                    type="text"
                    className="form-control"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
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
                    <option value="pendiente">Pendiente</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                
                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/interacciones')}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Interacción
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CrearInteraccion;