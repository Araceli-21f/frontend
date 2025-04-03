import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import ServicioFinanciadoService from "../../services/ServicioFinanciadoService"; // Asegúrate de crear este servicio
import ClienteService from "../../services/ClienteService";

const EditarServicioFinanciado = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerServicioFinanciadoPorId, actualizarServicioFinanciado } = ServicioFinanciadoService();
  const [servicio, setservicio] = useState({
    cliente_id: null, nombre_servicio: "Instalacion", descripcion: "", monto_servicio: 0, fecha_inicio: new Date(), fecha_termino: new Date(), pago_semanal: 0, saldo_restante: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { obtenerClientes } = ClienteService();
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarSelectClientes, setMostrarSelectClientes] = useState(false);

  useEffect(() => {
    const fetchservicio = async () => {
      setLoading(true);
      try {
        const foundservicio = await obtenerServicioFinanciadoPorId(id);
        if (!foundservicio) throw new Error("Servicio financiado no encontrado");
        setservicio(foundservicio);
        const cliente = clientes.find((c) => c._id === foundservicio.cliente_id);
        setClienteSeleccionado(cliente || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchservicio();
  }, [id]);

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const listaClientes = await obtenerClientes();
        setClientes(listaClientes);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setservicio({ ...servicio, [e.target.name]: e.target.value });
  };

  const handleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente);
    setservicio({ ...servicio, cliente_id: cliente._id });
    setMostrarSelectClientes(false);
  };

  const handleSeleccionarCliente = () => { setMostrarSelectClientes(true);};

  const handleClienteSeleccionadoChange = (e) => {
    const clienteIdSeleccionado = e.target.value;
    const clienteEncontrado = clientes.find((cliente) => cliente._id === clienteIdSeleccionado);
    if (clienteEncontrado) {
      handleClienteSeleccionado(clienteEncontrado);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!servicio.cliente_id) {
        setError("Debes seleccionar un cliente.");
        return;
      }
      await actualizarServicioFinanciado(id, servicio);
      navigate("/Lista_servicios"); // Asegúrate de que esta ruta sea correcta
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingError loading={loading} error={error} loadingMessage="Cargando datos..." errorMessage={error?.message}>
      <Layout>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h2 className="font-size-h4 mb-4">Editar Servicio Financiado</h2>
                <form onSubmit={handleSubmit}>
                  {/* Campos del servicio financiado */}
                  <div className="row mb-3">
                    {/* Cliente */}
                    <div className="col-md-6 d-flex align-items-center p-2">
                      <label className="form-label me-2 font-size-17">Cliente: </label>
                      <select  className="form-select"   value={clienteSeleccionado?._id || ""} onChange={handleClienteSeleccionadoChange} >
                          {clientes.length > 0 ? (
                             clientes.map((cliente) => (
                              
                               <option key={cliente._id} value={cliente._id}>
                                 {cliente.nombre}
                                  </option>
                                   ))
                                   ) : (
                                     <option disabled>Cargando clientes...</option>
                                      )}
                                      </select>
                    </div>
                    {/* Nombre del servicio */}
                    <div className="col-md-6 d-flex align-items-center p-2">
                      <label className="form-label me-2 font-size-17">Nombre del Servicio: </label>
                      <select name="nombre_servicio" value={servicio.nombre_servicio} onChange={handleChange} className="form-select bg-light">
                        <option value="Instalacion">Instalación</option>
                        <option value="Desarrollo">Desarrollo</option>
                        <option value="Diseño">Diseño</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Configuracion">Configuración</option>
                      </select>
                    </div>
                  </div>
                  {/* Dropdown para seleccionar cliente */}
                  {mostrarSelectClientes && (
  <div className="mb-3">
    {clientes.length > 0 ? (
      <select
        className="form-select"
        value={clienteSeleccionado ? clienteSeleccionado._id : ""}
        onChange={handleClienteSeleccionadoChange}
      >
        <option value="">Selecciona un cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente._id} value={cliente._id}>
            {cliente.nombre}
          </option>
        ))}
      </select>
    ) : (
      <p>No hay clientes disponibles</p>
    )}
  </div>
)}

                  <div className="row mb-3">
                    {/* Descripción */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Descripción:</label>
                      <textarea name="descripcion" value={servicio.descripcion} onChange={handleChange} className="form-control bg-light" />
                    </div>
                    {/* Monto del servicio */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Monto del Servicio:</label>
                      <input type="number" name="monto_servicio" value={servicio.monto_servicio} onChange={handleChange} className="form-control bg-light" />
                    </div>
                  </div>
                  <div className="row mb-3">
                    {/* Fecha de inicio */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Fecha de Inicio:</label>
                      <input type="date" name="fecha_inicio" value={servicio.fecha_inicio} onChange={handleChange} className="form-control bg-light" />
                    </div>
                    {/* Fecha de término */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Fecha de Término:</label>
                      <input type="date" name="fecha_termino" value={servicio.fecha_termino} onChange={handleChange} className="form-control bg-light" />
                    </div>
                    {/* Pago semanal */}
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Pago Semanal:</label>
                      <input type="number" name="pago_semanal" value={servicio.pago_semanal} onChange={handleChange} className="form-control bg-light" />
                    </div>
                  </div>
                  {/* Saldo restante */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Saldo Restante:</label>
                    <input type="number" name="saldo_restante" value={servicio.saldo_restante} onChange={handleChange} className="form-control bg-light" />
                  </div>
                  {/* Botón de Guardar */}
                  <div className="text-end">
                     <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                  </div>
                </form>
               </div>
             </div>
            </div>
           </div>
          </Layout>
        </LoadingError>
    );
};

export default EditarServicioFinanciado;