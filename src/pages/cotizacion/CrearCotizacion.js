import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/AlertasComponent";
import CotizacionService from "../../services/CotizacionService";
import ClienteService from "../../services/ClienteService";
import FilialService from "../../services/FilialService";

const CrearCotizacion = ({ onCotizacionCreada }) => {
  const navigate = useNavigate();
  const { crearCotizacion } = CotizacionService();
  const { obtenerClientes } = ClienteService();
  const { obtenerFilials } = FilialService();
  const [formData, setFormData] = useState({
    fecha_cotizacion: new Date().toISOString().split('T')[0],
    nombre_cotizacion: "", forma_pago: "", precio_venta: "", anticipo_solicitado: "", filial_id: "", cliente_id: "",
    detalles: [{
      descripcion: "",  costo_materiales: "",  costo_mano_obra: "",  inversion: "",  utilidad_esperada: "",
    }],
  });
  const [clientes, setClientes] = useState([]);
  const [filials, setFilials] = useState([]);
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
    const fetchFilials = async () => {
      try {
        const fetchedFilials = await obtenerFilials();
        setFilials(fetchedFilials);
      } catch (err) {
        console.error("Error al obtener filials:", err);
      }
    };
    fetchFilials();
  }, [obtenerFilials]);

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

  const handleAddDetalle = () => {
    setFormData({
      ...formData,
      detalles: [ ...formData.detalles,
        {  descripcion: "",  costo_materiales: "", costo_mano_obra: "", inversion: "", utilidad_esperada: "",  },
      ],
    });

  };

  const handleRemoveDetalle = (index) => {
    const detalles = [...formData.detalles];
    detalles.splice(index, 1);
    setFormData({ ...formData, detalles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCotizacion(formData);
      setAlertType("success");
      setAlertMessage("Cotización creada exitosamente.");
      setShowAlert(true);
      navigate(`/Lista_cotizacion`);
      setFormData({
        fecha_cotizacion: new Date().toISOString().split('T')[0],
        nombre_cotizacion: "", forma_pago: "", precio_venta: "",
        anticipo_solicitado: "", filial_id: "", cliente_id: "",
        detalles: [{
          descripcion: "", costo_materiales: "",  costo_mano_obra: "",  inversion: "",  utilidad_esperada: "",
        }],
      });
      if (onCotizacionCreada) {
        onCotizacionCreada(formData);
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
                          <label className="form-label">Titulo de Cotización</label>
                          <input type="text" className="form-control" id="nombre_cotizacion" name="nombre_cotizacion" value={formData.nombre_cotizacion} onChange={handleChange} required />
                        </div>
                      <div className="mb-3">
                          <label htmlFor="filial" className="form-label">Filial</label>
                          <select className="form-select" id="filial_id" name="filial_id" value={formData.filial_id} onChange={handleChange} required>
                            <option value="">Selecciona un Filial</option>
                            {filials.map((filial) => (
                              <option key={filial._id} value={filial._id}>
                                {filial.nombre_filial}
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
                          <label htmlFor="fecha_cotizacion" className="form-label">Fecha de Cotización</label>
                          <input type="date" className="form-control" id="fecha_cotizacion" name="fecha_cotizacion" value={formData.fecha_cotizacion} onChange={handleChange} required />
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
                            {formData.detalles.map((detalle, index) => (
                              <tr key={index}>
                                <td>
                                  <input type="text" className="form-control" name={`detalles[${index}].descripcion`} value={detalle.descripcion} onChange={(e) => handleChange(e, index)} required />
                                </td>
                                <td>
                                  <input type="number" className="form-control" name={`detalles[${index}].costo_materiales`} value={detalle.costo_materiales} onChange={(e) => handleChange(e, index)} required/>
                                </td>
                                <td>
                                  <input type="number" className="form-control" name={`detalles[${index}].costo_mano_obra`} value={detalle.costo_mano_obra} onChange={(e) => handleChange(e, index)} required/>
                                </td>
                                <td>
                                  <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveDetalle(index)}>Eliminar</button>
                                </td>
                              </tr>
                            ))}
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
    
    export default CrearCotizacion;