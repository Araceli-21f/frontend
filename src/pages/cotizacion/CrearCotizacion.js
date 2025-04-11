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
    // Datos básicos
    nombre_cotizacion: "",
    fecha_cotizacion: new Date().toISOString().split('T')[0],
    validoHasta: "",
    estado: "Borrador",
    aplicaIva: true, // Nuevo campo para controlar IVA

    // Relaciones
    cliente_id: "",
    vendedor: "",
    filial_id: "",

    // Detalles
    detalles: [{
      descripcion: "",
      costo_materiales: 0,
      costo_mano_obra: 0,
      utilidad_esperada: 0,
      inversion: 0
    }],
    
    // Totales
    subtotal: 0,
    iva: 0,
    precio_venta: 0,

    // Tipo de servicio
    forma_pago: "",

    // Financiamiento
    financiamiento: {
      anticipo_solicitado: 0,
      plazo_semanas: 0,
      pago_semanal: 0,
      saldo_restante: 0,
    },
    
    // Pago contado
    pagoContado: { fechaPago: "" },
    
    // Seguimiento de servicio
    fecha_inicio_servicio: "",
    fecha_fin_servicio: "",
    estado_servicio: "Pendiente"
  });

  const [clientes, setClientes] = useState([]);
  const [filials, setFilials] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  
  const formasPago = ["Contado", "Financiado"];
  const estados = ["Borrador", "Enviada", "Aprobada", "Completada", "Cancelada"];
  const estadosServicio = ["Pendiente", "EnProceso", "Completado", "Cancelado"];

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
    const { name, value, type, checked } = e.target;
    
    // Manejar el checkbox de IVA
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
        // Recalcular IVA y precio de venta
        iva: checked ? formData.subtotal * 0.19 : 0,
        precio_venta: checked ? formData.subtotal * 1.19 : formData.subtotal
      });
      return;
    }
    
    if (name.startsWith("financiamiento.")) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        financiamiento: {
          ...formData.financiamiento,
          [field]: value
        }
      });
    } else if (name.startsWith("pagoContado.")) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        pagoContado: {
          ...formData.pagoContado,
          [field]: value
        }
      });
    } else if (index !== undefined) {
      // Manejo de detalles
      const detalles = formData.detalles.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [name]: value };
          // Calcular inversión del item
          updatedItem.inversion = 
            Number(updatedItem.costo_materiales || 0) + 
            Number(updatedItem.costo_mano_obra || 0);
          return updatedItem;
        }
        return item;
      });
      
      // Calcular subtotal, IVA y precio_venta
      const subtotal = detalles.reduce((sum, item) => sum + (item.inversion || 0), 0);
      const iva = formData.aplicaIva ? subtotal * 0.19 : 0;
      const precio_venta = subtotal + iva;
      
      // Si es financiado, recalcular saldo
      let financiamiento = formData.financiamiento;
      if (formData.forma_pago === "Financiado") {
        const saldo = precio_venta - (financiamiento.anticipo_solicitado || 0);
        const pagoSemanal = saldo / (financiamiento.plazo_semanas || 1);
        
        financiamiento = {
          ...financiamiento,
          saldo_restante: saldo,
          pago_semanal: pagoSemanal
        };
      }
      
      setFormData({ 
        ...formData, 
        detalles, 
        subtotal, 
        iva, 
        precio_venta,
        financiamiento
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      detalles: [
        ...formData.detalles,
        { 
          descripcion: "", 
          costo_materiales: 0, 
          costo_mano_obra: 0, 
          utilidad_esperada: 0,
          inversion: 0 
        }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    const detalles = [...formData.detalles];
    detalles.splice(index, 1);
    
    // Recalcular totales
    const subtotal = detalles.reduce((sum, item) => sum + (item.inversion || 0), 0);
    const iva = formData.aplicaIva ? subtotal * 0.19 : 0;
    const precio_venta = subtotal + iva;
    
    setFormData({ 
      ...formData, 
      detalles, 
      subtotal, 
      iva, 
      precio_venta 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCotizacion(formData);
      setAlertType("success");
      setAlertMessage("Cotización creada exitosamente.");
      setShowAlert(true);
      navigate(`/Lista_cotizacion`);
      
      // Reset form
      setFormData({
        nombre_cotizacion: "",
        fecha_cotizacion: new Date().toISOString().split('T')[0],
        validoHasta: "",
        estado: "Borrador",
        aplicaIva: true,
        cliente_id: "",
        vendedor: "",
        filial_id: "",
        detalles: [{
          descripcion: "",
          costo_materiales: 0,
          costo_mano_obra: 0,
          utilidad_esperada: 0,
          inversion: 0
        }],
        subtotal: 0,
        iva: 0,
        precio_venta: 0,
        forma_pago: "",
        financiamiento: {
          anticipo_solicitado: 0,
          plazo_semanas: 0,
          pago_semanal: 0,
          saldo_restante: 0,
        },
        pagoContado: {
          fechaPago: ""
        },
        fecha_inicio_servicio: "",
        fecha_fin_servicio: "",
        estado_servicio: "Pendiente"
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
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Título de Cotización</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="nombre_cotizacion" 
                        value={formData.nombre_cotizacion} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label htmlFor="fecha_cotizacion" className="form-label">Fecha de Cotización</label>
                      <input
                        type="date" 
                        className="form-control" 
                        name="fecha_cotizacion"
                        value={formData.fecha_cotizacion} 
                        onChange={handleChange} 
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label htmlFor="validoHasta" className="form-label">Válido hasta <span className="text-danger">*</span></label>
                      <input
                        type="date" 
                        className="form-control" 
                        name="validoHasta" 
                        value={formData.validoHasta} 
                        onChange={handleChange} 
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="forma_pago" className="form-label">Forma de Pago</label>
                      <select 
                        className="form-select" 
                        name="forma_pago" 
                        value={formData.forma_pago} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Selecciona una opción</option>
                        {formasPago.map((forma) => (
                          <option key={forma} value={forma}>{forma}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="filial_id" className="form-label">Filial</label>
                      <select 
                        className="form-select" 
                        name="filial_id" 
                        value={formData.filial_id} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Selecciona una Filial</option>
                        {filials.map((filial) => (
                          <option key={filial._id} value={filial._id}>
                            {filial.nombre_filial}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="estado" className="form-label">Estado</label>
                      <select 
                        className="form-select" 
                        name="estado" 
                        value={formData.estado} 
                        onChange={handleChange} 
                        required
                      >
                        {estados.map((estado) => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="cliente_id" className="form-label">Cliente</label>
                      <select 
                        className="form-select" 
                        name="cliente_id" 
                        value={formData.cliente_id} 
                        onChange={handleChange} 
                        required
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
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="vendedor" className="form-label">Vendedor</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="vendedor" 
                        value={formData.vendedor} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="py-2 mt-3">
                  <h5 className="font-size-15">Detalles de la Cotización</h5>
                  <div className="table-responsive">
                    <table className="table table-nowrap table-centered mb-0">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th>Costo Materiales</th>
                          <th>Costo Mano Obra</th>
                          <th>Utilidad Esperada</th>
                          <th>Inversión Total</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.detalles.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="descripcion" 
                                value={item.descripcion} 
                                onChange={(e) => handleChange(e, index)} 
                                required 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="costo_materiales" 
                                value={item.costo_materiales} 
                                onChange={(e) => handleChange(e, index)} 
                                required 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="costo_mano_obra" 
                                value={item.costo_mano_obra} 
                                onChange={(e) => handleChange(e, index)} 
                                required 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="utilidad_esperada" 
                                value={item.utilidad_esperada} 
                                onChange={(e) => handleChange(e, index)} 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={item.inversion} 
                                disabled 
                              />
                            </td>
                            <td>
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm" 
                                onClick={() => handleRemoveItem(index)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary mt-2" 
                    onClick={handleAddItem}
                  >
                    Agregar Detalle
                  </button>
                </div>

                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="aplicaIva"
                        checked={formData.aplicaIva}
                        onChange={handleChange}
                        id="aplicaIvaCheck"
                      />
                      <label className="form-check-label" htmlFor="aplicaIvaCheck">
                        Aplicar IVA (19%)
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 offset-md-4">
                    <div className="table-responsive">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <th>Subtotal:</th>
                            <td className="text-end">${formData.subtotal.toFixed(2)}</td>
                          </tr>
                          {formData.aplicaIva && (
                            <tr>
                              <th>IVA (19%):</th>
                              <td className="text-end">${formData.iva.toFixed(2)}</td>
                            </tr>
                          )}
                          <tr className="border-top">
                            <th>Total:</th>
                            <td className="text-end fw-bold">${formData.precio_venta.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {formData.forma_pago === "Financiado" && (
                  <div className="row mt-3 border-top">
                    <div className="col-md-12">
                      <h5>Datos de Financiamiento</h5>    
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.anticipo_solicitado" className="form-label">Anticipo</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              name="financiamiento.anticipo_solicitado" 
                              value={formData.financiamiento.anticipo_solicitado} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.plazo_semanas" className="form-label">Plazo (semanas)</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              name="financiamiento.plazo_semanas" 
                              value={formData.financiamiento.plazo_semanas} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.pago_semanal" className="form-label">Pago Semanal</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              name="financiamiento.pago_semanal" 
                              value={formData.financiamiento.pago_semanal} 
                              onChange={handleChange} 
                              disabled 
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.saldo_restante" className="form-label">Saldo Restante</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              name="financiamiento.saldo_restante" 
                              value={formData.financiamiento.saldo_restante} 
                              onChange={handleChange} 
                              disabled 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-md waves-effect waves-light"
                    >
                      Crear Cotización
                    </button>
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