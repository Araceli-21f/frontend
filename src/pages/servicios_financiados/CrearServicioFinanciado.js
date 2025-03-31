import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";
import ServicioFinanciadoService from "../../services/ServicioFinanciadoService";
import ClienteService from "../../services/ClienteService"; // Importa ClienteService

const CrearServicioFinanciado = ({ onServicioFinanciadoCreado }) => {
  const navigate = useNavigate();
  const { crearServicioFinanciado } = ServicioFinanciadoService();
  const { obtenerClientes } = ClienteService(); // Usa obtenerClientes de ClienteService
  const [formData, setFormData] = useState({
    cliente_id: "",
    descripcion: "",
    monto_servicio: "",
    fecha_inicio: "",
    fecha_termino: "",
    pago_semanal: "",
    saldo_restante: "",
  });
  const [errors, setErrors] = useState({
    cliente_id: "",
    descripcion: "",
    monto_servicio: "",
    fecha_inicio: "",
    fecha_termino: "",
    pago_semanal: "",
    saldo_restante: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [clientes, setClientes] = useState([]); // Cambia el nombre a clientes

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const fetchedClientes = await obtenerClientes();
        setClientes(fetchedClientes); // Actualiza el estado con los clientes
      } catch (err) {
        console.error("Error al obtener clientes:", err);
      }
    };
    fetchClientes();
  }, [obtenerClientes]); // Usa obtenerClientes


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    let hasErrors = false;

    if (!formData.cliente_id) {
      formErrors.cliente_id = "El cliente es requerido.";
      hasErrors = true;
    }
    if (!formData.descripcion) {
      formErrors.descripcion = "La descripción es requerida.";
      hasErrors = true;
    }
    if (!formData.monto_servicio) {
      formErrors.monto_servicio = "El monto del servicio es requerido.";
      hasErrors = true;
    }
    if (!formData.fecha_inicio) {
      formErrors.fecha_inicio = "La fecha de inicio es requerida.";
      hasErrors = true;
    }
    if (!formData.pago_semanal) {
      formErrors.pago_semanal = "El pago semanal es requerido.";
      hasErrors = true;
    }
    if (!formData.saldo_restante) {
      formErrors.saldo_restante = "El saldo restante es requerido.";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(formErrors);
      return;
    }

    try {
      await crearServicioFinanciado(formData);
      setAlertType("success");
      setAlertMessage("Servicio financiado creado exitosamente.");
      navigate(`/ServicioFinanciado`);
      setShowAlert(true);
      setFormData({
        cliente_id: "",
        descripcion: "",
        monto_servicio: "",
        fecha_inicio: "",
        fecha_termino: "",
        pago_semanal: "",
        saldo_restante: "",
      });
      setErrors({
        cliente_id: "",
        descripcion: "",
        monto_servicio: "",
        fecha_inicio: "",
        fecha_termino: "",
        pago_semanal: "",
        saldo_restante: "",
      });
      if (onServicioFinanciadoCreado) {
        onServicioFinanciadoCreado(formData);
        navigate(`/ServicioFinanciado`);

      }
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
                    <label className="form-label">Cliente:</label>
                    <select
                      className="form-select"
                      name="cliente_id"
                      value={formData.cliente_id}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona un cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente._id} value={cliente._id}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.cliente_id && <div className="text-danger">{errors.cliente_id}</div>}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-2">
                    <label className="form-label">Fecha de Inicio:</label>
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.fecha_inicio && <div className="text-danger">{errors.fecha_inicio}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Fecha de Término (Opcional):</label>
                    <input
                      type="date"
                      name="fecha_termino"
                      value={formData.fecha_termino}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.fecha_termino && <div className="text-danger">{errors.fecha_termino}</div>}
                  </div>
                </div>

              </div>
              <div className="col-md">
                  <div className="mb-2">
                    <label className="form-label">Descripción:</label>
                    <textarea
                    type="text"
                    name="descripcion"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  />
                    {errors.descripcion && <div className="text-danger">{errors.descripcion}</div>}
                  </div>
                </div>
                <div className="row">
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Monto del Servicio:</label>
                    <input
                      type="number"
                      name="monto_servicio"
                      value={formData.monto_servicio}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.monto_servicio && <div className="text-danger">{errors.monto_servicio}</div>}
                  </div>
                </div>                
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Pago Semanal:</label>
                    <input
                      type="number"
                      name="pago_semanal"
                      value={formData.pago_semanal}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.pago_semanal && <div className="text-danger">{errors.pago_semanal}</div>}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <label className="form-label">Saldo Restante:</label>
                    <input
                      type="number"
                      name="saldo_restante"
                      value={formData.saldo_restante}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors.saldo_restante && <div className="text-danger">{errors.saldo_restante}</div>}
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
  );
};

export default CrearServicioFinanciado;
