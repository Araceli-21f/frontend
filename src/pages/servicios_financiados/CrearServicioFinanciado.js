import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";
import LoadingError from "../../components/LoadingError";
import ServicioFinanciadoService from "../../services/ServicioFinanciadoService";
import ClienteService from "../../services/ClienteService";

const CrearServicioFinanciado = ({ onServicioFinanciadoCreado }) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { error, loading, crearServicioFinanciado } = ServicioFinanciadoService();
  const [formData, setFormData] = useState({
    nombre_servicio: "", cliente_id: "", descripcion: "", monto_servicio: "", fecha_inicio: "", fecha_termino: null, pago_semanal: "", saldo_restante: "",
  });
  const { obtenerClientes } = ClienteService(); //obtener a los clientes
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [errorClientes, setErrorClientes] = useState(null);
  const servicios = ["Instalacion", "Desarrollo", "Diseño", "Marketing", "Configuracion"]; //seleccionar servicios
 
  useEffect(() => {
    const fetchClientes = async () => {
      setLoadingClientes(true);
      try {
        const fetchedClientes = await obtenerClientes();
        setClientes(fetchedClientes);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
        setErrorClientes(err);
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, [obtenerClientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearServicioFinanciado(formData);
      setAlertType("success");
      setAlertMessage("Servicio Financiado creado exitosamente.");
      setShowAlert(true);
      setFormData({ nombre_servicio: "", cliente_id: "", descripcion: "", monto_servicio: "", fecha_inicio: "", fecha_termino: null, pago_semanal: "", saldo_restante: "" });

      if (onServicioFinanciadoCreado) {
        onServicioFinanciadoCreado(formData);
        navigate(`/Lista_Servicios`);
      }
      navigate(`/Lista_Servicios`);
    } catch (error) {
      console.error("Error al crear el servicio financiado:", error);
      setAlertType("error");
      setAlertMessage("Error al crear el servicio financiado.");
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <LoadingError
      loading={loadingClientes || loading}
      error={errorClientes || error}
      loadingMessage="Cargando datos..."
      errorMessage={errorClientes?.message || error?.message}
    >
    <Layout>
      <div className="row">
        <div className="col">
          <div className="card p-4">
          <div className="invoice-title d-flex justify-content-between align-items-center">
          <h4 className="font-size-h4">Agregar Servicio Financiado:</h4>
          <div className="mb-4">
               <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark" />
               <img src="/assets/images/logo-light.png" alt="logo" height="20" className="logo-light" />
              </div>
             </div>
            <hr className="my-3"/>

            <form onSubmit={handleSubmit}>
              <div className="row">
              <div className="col-md-5">
              <div className="mb-2">
                     <label className="form-label"><i className="bx bxs-user-detail"/> Servicio</label>
                      <select className="form-select shadow-sm" name="nombre_servicio" value={formData.nombre_servicio} onChange={handleChange}  required>
                      <option value="">Selecciona un servicio</option>
                      {servicios.map((nombre_servicio) => (
                      <option key={nombre_servicio} value={nombre_servicio}>
                      {nombre_servicio}
                      </option>
                      ))}
                      </select>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="mb-2">
                    <label className="form-label">Cliente:</label>
                    <select
                      className="form-select shadow-sm" name="cliente_id"
                      value={formData.cliente_id} onChange={handleChange}  required
                    >
                      <option value="">Selecciona un cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente._id} value={cliente._id}>
                          {cliente.nombre} 
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-2">
                    <label className="form-label">Fecha de Inicio:</label>
                    <input
                      type="date" name="fecha_inicio" className="form-control shadow-sm"
                      value={formData.fecha_inicio} onChange={handleChange}  required
                    />
                    </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Fecha de Término (Opcional):</label>
                    <input
                      type="date" name="fecha_termino" className="form-control shadow-sm"
                      value={formData.fecha_termino} onChange={handleChange}  required
                    />
                    </div>
                </div>

              </div>
              <div className="col-md">
                  <div className="mb-2">
                    <label className="form-label">Descripción:</label>
                    <textarea
                    type="text" name="descripcion" className="form-control shadow-sm" 
                    value={formData.descripcion} onChange={handleChange} required
                  />
                    </div>
                </div>
                <div className="row">
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Monto del Servicio:</label>
                    <input
                      type="number" name="monto_servicio" className="form-control shadow-sm"
                      value={formData.monto_servicio} onChange={handleChange} required
                    />
                    </div>
                </div>                
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Pago Semanal:</label>
                    <input
                      type="number" name="pago_semanal" className="form-control shadow-sm"
                      value={formData.pago_semanal} onChange={handleChange} required />
                    </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Saldo Restante:</label>
                    <input
                      type="number" name="saldo_restante" className="form-control shadow-sm"
                      value={formData.saldo_restante} onChange={handleChange} required  />
                    </div>
                 </div>
                </div>
                  <div className="text-center p-3">
                <button type="submit" className="btn w-lg btn-outline-success ml-3"><i className="uil-user-plus fs-6"/> Agregar Servicio </button>
              </div>
            </form>
            {showAlert && (
              <AlertComponent
                type={alertType}
                entity="Servicio Financiado"
                action={alertType === "success" ? "create" : "error"}
                onCancel={handleAlertClose}
                message={alertMessage}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
    </LoadingError>
  );
};

export default CrearServicioFinanciado;
