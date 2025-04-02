import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/AlertasComponent";
import CotizacionService from "../../services/CotizacionService";
import ClienteService from "../../services/ClienteService";

const CrearCotizacion = ({ onCotizacionCreada }) => {
  const navigate = useNavigate();
  const { crearCotizacion } = CotizacionService();
  const { obtenerClientes } = ClienteService();
  const [formData, setFormData] = useState({
    fecha_cotizacion: new Date().toISOString().split('T')[0],
    forma_pago: "",
    precio_venta: "",
    anticipo_solicitado: "",
    filial: "",
    cliente_id: "",
    detalles: [{
      descripcion: "",  costo_materiales: "",  costo_mano_obra: "",  inversion: "",  utilidad_esperada: "",
    }],
  });
  const [clientes, setClientes] = useState([]);
  const [errors, setErrors] = useState({
    forma_pago: "", precio_venta: "", anticipo_solicitado: "", filial: "", cliente_id: "",
    detalles: [{
      descripcion: "", costo_materiales: "", costo_mano_obra: "",
    }],
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const formasPago = ["Financiado", "Contado"];
  const filiales = ["Filial A", "Filial B", "Filial C"];

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
    setErrors({ ...errors, [name]: "" });
  };

  const handleAddDetalle = () => {
    setFormData({
      ...formData,
      detalles: [ ...formData.detalles,
        {  descripcion: "",  costo_materiales: "", costo_mano_obra: "", inversion: "", utilidad_esperada: "",  },
      ],
    });
    setErrors({ ...errors,
      detalles: [...errors.detalles, { descripcion: "", costo_materiales: "", costo_mano_obra: "" }],
    });
  };

  const handleRemoveDetalle = (index) => {
    const detalles = [...formData.detalles];
    detalles.splice(index, 1);
    setFormData({ ...formData, detalles });

    const errorDetalles = [...errors.detalles];
    errorDetalles.splice(index, 1);
    setErrors({ ...errors, detalles: errorDetalles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    let hasErrors = false;

    if (!formData.forma_pago) {
      formErrors.forma_pago = "La forma de pago es requerida."; 
      hasErrors = true;
    }
    if (!formData.precio_venta) {
      formErrors.precio_venta = "El precio de venta es requerido.";
      hasErrors = true;
    }
    if (!formData.anticipo_solicitado) {
      formErrors.anticipo_solicitado = "El anticipo solicitado es requerido.";
      hasErrors = true;
    }
    if (!formData.filial) {
      formErrors.filial = "La filial es requerida.";
      hasErrors = true;
    }
    if (!formData.cliente_id) {
      formErrors.cliente_id = "El cliente es requerido.";
      hasErrors = true;
    }
    formData.detalles.forEach((detalle, index) => {
      if (!detalle.descripcion) {
        formErrors.detalles = { ...formErrors.detalles, [index]: { descripcion: "La descripción es requerida." } };
        hasErrors = true;
      }
      if (!detalle.costo_materiales) {
        formErrors.detalles = { ...formErrors.detalles, [index]: { ...formErrors.detalles[index], costo_materiales: "El costo de materiales es requerido." } };
        hasErrors = true;
      }
      if (!detalle.costo_mano_obra) {
        formErrors.detalles = { ...formErrors.detalles, [index]: { ...formErrors.detalles[index], costo_mano_obra: "El costo de mano de obra es requerido." } };
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(formErrors);
      return;
    }

    try {
      await crearCotizacion(formData);
      setAlertType("success");
      setAlertMessage("Cotización creada exitosamente.");
      setShowAlert(true);
      navigate(`/Lista_cotizacion`);
      setFormData({
        fecha_cotizacion: new Date().toISOString().split('T')[0],
        forma_pago: "",
        precio_venta: "",
        anticipo_solicitado: "",
        filial: "",
        cliente_id: "",
        detalles: [{
          descripcion: "", costo_materiales: "",  costo_mano_obra: "",  inversion: "",  utilidad_esperada: "",
        }],
      });
      setErrors({
        forma_pago: "", precio_venta: "", anticipo_solicitado: "", filial: "", cliente_id: "", detalles: [{ descripcion: "", costo_materiales: "", costo_mano_obra: "" }],
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
                    <h2 className="font-size-20 text-center w-100">Cotización</h2>
                  </div>
                  <hr className="my-4" />
    
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <label htmlFor="fecha_cotizacion" className="form-label">Fecha de Cotización</label>
                          <input type="date" className="form-control" id="fecha_cotizacion" name="fecha_cotizacion" value={formData.fecha_cotizacion} onChange={handleChange} required />
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
                          {errors.cliente_id && <div className="text-danger">{errors.cliente_id}</div>}
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
                          {errors.forma_pago && <div className="text-danger">{errors.forma_pago}</div>}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="filial" className="form-label">Filial</label>
                          <select className="form-select" id="filial" name="filial" value={formData.filial} onChange={handleChange} required>
                            <option value="">Selecciona una filial</option>
                            {filiales.map((filial) => (
                              <option key={filial} value={filial}>
                                {filial}
                              </option>
                            ))}
                          </select>
                          {errors.filial && <div className="text-danger">{errors.filial}</div>}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-3">
                          <label htmlFor="precio_venta" className="form-label">Precio de Venta</label>
                          <input type="number" className="form-control" id="precio_venta" name="precio_venta" value={formData.precio_venta} onChange={handleChange} required />
                          {errors.precio_venta && <div className="text-danger">{errors.precio_venta}</div>}
                        </div>
                        <div className="mb-3">
                          <label htmlFor="anticipo_solicitado" className="form-label">Anticipo Solicitado</label>
                          <input type="number" className="form-control" id="anticipo_solicitado" name="anticipo_solicitado" value={formData.anticipo_solicitado} onChange={handleChange} required />
                          {errors.anticipo_solicitado && <div className="text-danger">{errors.anticipo_solicitado}</div>}
                        </div>
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
                                  <input type="text" className="form-control" name={`detalles[${index}].descripcion`} value={detalle.descripcion} onChange={(e) => handleChange(e, index)} />
                                  {errors.detalles && errors.detalles[index] && errors.detalles[index].descripcion && <div className="text-danger">{errors.detalles[index].descripcion}</div>}
                                </td>
                                <td>
                                  <input type="number" className="form-control" name={`detalles[${index}].costo_materiales`} value={detalle.costo_materiales} onChange={(e) => handleChange(e, index)} />
                                  {errors.detalles && errors.detalles[index] && errors.detalles[index].costo_materiales && <div className="text-danger">{errors.detalles[index].costo_materiales}</div>}
                                </td>
                                <td>
                                  <input type="number" className="form-control" name={`detalles[${index}].costo_mano_obra`} value={detalle.costo_mano_obra} onChange={(e) => handleChange(e, index)} />
                                  {errors.detalles && errors.detalles[index] && errors.detalles[index].costo_mano_obra && <div className="text-danger">{errors.detalles[index].costo_mano_obra}</div>}
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