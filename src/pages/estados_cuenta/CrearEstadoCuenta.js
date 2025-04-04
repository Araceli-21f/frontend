import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/AlertasComponent";
import EstadoCuentaService from "../../services/EstadoCuentaService";
import ClienteService from "../../services/ClienteService";
import ServiciosFinanciadoService from "../../services/ServicioFinanciadoService";


const CrearEstadoCuenta = ({ onEstadoCuentaCreada }) => {
  const navigate = useNavigate();
  const { crearEstadoCuenta } = EstadoCuentaService();
  const { obtenerClientes } = ClienteService();
  const { obtenerServicioFinanciados} = ServiciosFinanciadoService();
  const [formData, setFormData] = useState({
    fecha_estadocuenta: new Date().toISOString().split('T')[0],
    cliente_id: "", service_id: "", saldo_inicial: "", pago_total: "", saldo_actual: "", pago_semanal: "", total_a_pagar: "" 
  });
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const formasPago = ["Financiado", "Contado"];

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const fetchedClientes = await obtenerClientes();
        setClientes(fetchedClientes);
      } catch (err) {
        console.error("Error al obtener clientes:", err);
      }
    };
    fetchClientes();
  }, [obtenerClientes]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const fetchedServicios = await obtenerServicioFinanciados();
        setServicios(fetchedServicios);
      } catch (err) {
        console.error("Error al obtener Servicios:", err);
      }
    };
    fetchServicios();
  }, [obtenerServicioFinanciados]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const detalles = formData.detalles.map((detalle, i) => {
        if (i === index) {
          const updatedDetalle = { ...detalle, [name.split('.')[1]]: value };
          updatedDetalle.inversion = parseFloat(updatedDetalle.costo_materiales || 0) + parseFloat(updatedDetalle.costo_mano_obra || 0);
          updatedDetalle.utilidad_esperada = parseFloat(formData.precio_venta || 0) - updatedDetalle.inversion;
          return updatedDetalle;
        }
        return detalle;
      });
      setFormData({ ...formData, detalles });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEstadoCuenta(formData);
      setAlertType("success");
      setAlertMessage("Cotización creada exitosamente.");
      setShowAlert(true);
      navigate(`/Lista_EstadoCuenta`);
      setFormData({
        fecha_estadocuenta: new Date().toISOString().split('T')[0],
        cliente_id: "", service_id: "", saldo_inicial: "", pago_total: "", saldo_actual: "", pago_semanal: "", total_a_pagar: "" 
      
      });
      if (onEstadoCuentaCreada) {
        onEstadoCuentaCreada(formData);
      }
    } catch (error) {
      console.error("Error al crear la cotización:", error);
      setAlertType("error");
      setAlertMessage("Error al crear la cotización.");
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
        <Layout>
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h2 className="float-left font-size-h4">Nueva Cotización</h2>
                  <div className="invoice-title d-flex flex-column align-items-center">
                    <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark ms-auto" />
                  </div>
                  <hr className="my-4" />
    
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-7">
                      <div className="mb-3">
                          <label htmlFor="Servicio" className="form-label">Servicio</label>
                          <select className="form-select" id="servicio_id" name="servicio_id" value={formData.servicio_id} onChange={handleChange} required>
                            <option value="">Selecciona un Servicio</option>
                            {servicios.map((servicio) => (
                              <option key={servicio._id} value={servicio._id}>
                                {servicio.nombre_servicio}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="cliente_id" className="form-label">Cliente</label>
                          <select className="form-select" id="cliente_id" name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
                            <option value="">Selecciona un cliente</option>
                            {clientes.map((cliente) => (
                              <option key={cliente._id} value={cliente._id}>
                                {cliente.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-5">
                      <div className="mb-3">
                          <label htmlFor="fecha_estadocuenta" className="form-label">Fecha de Cotización</label>
                          <input type="date" className="form-control" id="fecha_estadocuenta" name="fecha_estadocuenta" value={formData.fecha_estadocuenta} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="forma_pago" className="form-label">Forma de Pago</label>
                          <select className="form-select" id="forma_pago" name="forma_pago" value={formData.forma_pago} onChange={handleChange} required>
                            <option value="">Selecciona una forma de pago</option>
                            {formasPago.map((fp) => (
                              <option key={fp} value={fp}>
                                {fp}
                              </option>
                            ))}
                          </select>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-md">
                        <div className="mb-2">
                          <label htmlFor="precio_venta" className="form-label">Precio de Venta</label>
                          <input type="number" className="form-control" id="precio_venta" name="precio_venta" value={formData.precio_venta} onChange={handleChange} required />
                        </div>
                        </div>
                        <div className="col-md">
                        <div className="mb-2">
                          <label htmlFor="anticipo_solicitado" className="form-label">Anticipo Solicitado</label>
                          <input type="number" className="form-control" id="anticipo_solicitado" name="anticipo_solicitado" value={formData.anticipo_solicitado} onChange={handleChange} required />
                        </div></div>
                        </div>
                     
                    </div>
    
                    <div className="py-2">
                      <h5 className="font-size-15">Detalles de la Cotización</h5>
                      <div className="table-responsive">
                        <table className="table table-nowrap table-centered mb-0">
                          <thead>
                            <tr>
                              <th>Descripción</th>
                              <th>Costo Materiales</th>
                              <th>Costo Mano de Obra</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            
                              <tr>
                                <td>
                                  <input type="text" className="form-control" name="" value={ saldo_actual} onChange={handleChange} required />
                                </td>
                                <td>
                                  <input type="number" className="form-control" name="" value={pago_semanal} onChange={handleChange} required/>
                                </td>
                                <td>
                                  <input type="number" className="form-control" name="" value={total_a_pagar} onChange={handleChange} required/>
                                </td>
                                
                              </tr>
                            
                          </tbody>
                        </table>
                      </div>
                      <button type="button" className="btn btn-primary mt-2" onClick={handleAddDetalle}>Agregar Detalle</button>
                    </div>
    
                    <div className="d-print-none mt-4">
                      <div className="float-end">
                        <button type="submit" className="btn btn-primary w-md waves-effect waves-light">Crear Cotización</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {showAlert && (
            <AlertComponent
              type={alertType}
              entity="Cotización"
              action={alertType === "success" ? "create" : "error"}
              onCancel={handleAlertClose}
              message={alertMessage}
            />
          )}
        </Layout>
      );
    };
    
    export default CrearEstadoCuenta;