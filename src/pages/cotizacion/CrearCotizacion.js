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
    metodo_pago: "Efectivo",
    estado_servicio: "Pendiente"
  });

  const [clientes, setClientes] = useState([]);
  const [filials, setFilials] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  
  const formasPago = ["Contado", "Financiado"];
  const metodosPago = ["Efectivo", "Transferencia", "Tarjeta", "Cheque"];
  const estados = ["Borrador", "Enviada", "Aprobada", "Completada", "Cancelada"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedClientes, fetchedFilials] = await Promise.all([
          obtenerClientes(),
          obtenerFilials()
        ]);
        setClientes(fetchedClientes);
        setFilials(fetchedFilials);
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setAlertType("error");
        setAlertMessage("Error al cargar datos iniciales");
        setShowAlert(true);
      }
    };
    fetchData();
  }, [obtenerClientes, obtenerFilials]);

  const calcularTotales = (detalles, aplicaIva, formaPago, financiamiento) => {
    // Calcular subtotal sumando (inversión + utilidad) de cada item
    const subtotal = detalles.reduce((sum, item) => {
      const inversion = Number(item.costo_materiales) + Number(item.costo_mano_obra);
      const precioConUtilidad = inversion * (1 + (Number(item.utilidad_esperada) || 0)/100);
      return sum + precioConUtilidad;
    }, 0);

    const iva = aplicaIva ? subtotal * 0.16 : 0;
    let precio_venta = subtotal + iva;

    // Aplicar cargo financiero si es financiado
    let nuevoFinanciamiento = { ...financiamiento };
    if (formaPago === "Financiado") {
      const cargoFinanciero = precio_venta * 0.34;
      precio_venta += cargoFinanciero;
      
      // Recalcular saldos
      const saldo = precio_venta - (nuevoFinanciamiento.anticipo_solicitado || 0);
      nuevoFinanciamiento.saldo_restante = saldo > 0 ? saldo : 0;
      nuevoFinanciamiento.pago_semanal = nuevoFinanciamiento.plazo_semanas > 0 
        ? saldo / nuevoFinanciamiento.plazo_semanas 
        : 0;
    }

    return { subtotal, iva, precio_venta, financiamiento: nuevoFinanciamiento };
  };

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const nuevosTotales = calcularTotales(
        formData.detalles,
        checked,
        formData.forma_pago,
        formData.financiamiento
      );
      
      setFormData(prev => ({
        ...prev,
        aplicaIva: checked,
        ...nuevosTotales
      }));
      return;
    }
    
    if (name.startsWith("financiamiento.")) {
      const field = name.split('.')[1];
      const newFinanciamiento = {
        ...formData.financiamiento,
        [field]: Number(value) || 0
      };
      
      const nuevosTotales = calcularTotales(
        formData.detalles,
        formData.aplicaIva,
        formData.forma_pago,
        newFinanciamiento
      );
      
      setFormData(prev => ({
        ...prev,
        financiamiento: newFinanciamiento,
        ...nuevosTotales
      }));
    } 
    else if (index !== undefined) {
      // Manejo de detalles
      const detalles = formData.detalles.map((item, i) => {
        if (i === index) {
          const updatedItem = { 
            ...item, 
            [name]: type === 'number' ? Number(value) || 0 : value 
          };
          updatedItem.inversion = 
            Number(updatedItem.costo_materiales || 0) + 
            Number(updatedItem.costo_mano_obra || 0);
          return updatedItem;
        }
        return item;
      });
      
      const nuevosTotales = calcularTotales(
        detalles,
        formData.aplicaIva,
        formData.forma_pago,
        formData.financiamiento
      );
      
      setFormData(prev => ({ 
        ...prev,
        detalles, 
        ...nuevosTotales
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? Number(value) || 0 : value 
      }));
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        { 
          descripcion: "", 
          costo_materiales: 0, 
          costo_mano_obra: 0, 
          utilidad_esperada: 0,
          inversion: 0 
        }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
    const detalles = formData.detalles.filter((_, i) => i !== index);
    
    const nuevosTotales = calcularTotales(
      detalles,
      formData.aplicaIva,
      formData.forma_pago,
      formData.financiamiento
    );
    
    setFormData(prev => ({ 
      ...prev,
      detalles, 
      ...nuevosTotales
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validación básica
      if (!formData.detalles.some(d => d.descripcion.trim() !== "")) {
        throw new Error("Debe agregar al menos un detalle con descripción");
      }

      if (formData.forma_pago === "Financiado") {
        if (!formData.financiamiento.plazo_semanas || formData.financiamiento.plazo_semanas <= 0) {
          throw new Error("El plazo de financiamiento debe ser mayor a 0 semanas");
        }
        if (formData.financiamiento.anticipo_solicitado > formData.precio_venta) {
          throw new Error("El anticipo no puede ser mayor al precio total");
        }
      }

      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        // Eliminar campos calculados que el backend recalculará
        subtotal: undefined,
        iva: undefined,
        precio_venta: undefined,
        detalles: formData.detalles.map(item => ({
          descripcion: item.descripcion,
          costo_materiales: item.costo_materiales,
          costo_mano_obra: item.costo_mano_obra,
          utilidad_esperada: item.utilidad_esperada
        }))
      };

      const response = await crearCotizacion(dataToSend);
      
      setAlertType("success");
      setAlertMessage("Cotización creada exitosamente.");
      setShowAlert(true);
      
      if (onCotizacionCreada) {
        onCotizacionCreada(response);
      }
      
      // Redirigir después de 2 segundos
      setTimeout(() => navigate(`/cotizaciones/ver/${response._id}`), 2000);
      
    } catch (error) {
      console.error("Error al crear la cotización:", error);
      setAlertType("error");
      setAlertMessage(error.message || "Error al crear la cotización.");
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
              <div className="invoice-title d-flex justify-content-between align-items-center">
                <h3 className="font-size-h4">Crear una Cotización</h3>
                <div className="mb-6">
                  <img src="/assets/images/logo-dark.png" alt="logo" height="25" className="logo-dark" />  
                  <img src="/assets/images/logo-light.png" alt="logo" height="25" className="logo-light" />
                </div>
              </div>
              <hr className="my-4" />

              <form onSubmit={handleSubmit}>
                {/* Sección de datos básicos */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Título de Cotización *</label>
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
                      <label className="form-label">Fecha de Cotización</label>
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
                      <label className="form-label">Válido hasta *</label>
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

                {/* Sección de relaciones */}
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Forma de Pago *</label>
                      <select 
                        className="form-select" 
                        name="forma_pago" 
                        value={formData.forma_pago} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Seleccione...</option>
                        {formasPago.map((forma) => (
                          <option key={forma} value={forma}>{forma}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Método de Pago *</label>
                      <select 
                        className="form-select" 
                        name="metodo_pago" 
                        value={formData.metodo_pago} 
                        onChange={handleChange} 
                        required
                      >
                        {metodosPago.map((metodo) => (
                          <option key={metodo} value={metodo}>{metodo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select 
                        className="form-select" 
                        name="estado" 
                        value={formData.estado} 
                        onChange={handleChange}
                      >
                        {estados.map((estado) => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Cliente *</label>
                      <select 
                        className="form-select" 
                        name="cliente_id" 
                        value={formData.cliente_id} 
                        onChange={handleChange} 
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
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Filial *</label>
                      <select 
                        className="form-select" 
                        name="filial_id" 
                        value={formData.filial_id} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Seleccione una filial</option>
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
                      <label className="form-label">Vendedor *</label>
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

                {/* Sección de detalles */}
                <div className="py-2 mt-3 mb-4">
                  <h5 className="font-size-15">Detalles de la Cotización</h5>
                  <div className="table-responsive">
                    <table className="table table-nowrap table-centered mb-0">
                      <thead>
                        <tr>
                          <th>Descripción*</th>
                          <th>Costo Materiales*</th>
                          <th>Costo Mano Obra*</th>
                          <th>Utilidad (%)</th>
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
                                min="0"
                                step="0.01"
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
                                min="0"
                                step="0.01"
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
                                min="0"
                                max="100"
                                step="1"
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={item.inversion.toFixed(2)} 
                                disabled 
                              />
                            </td>
                            <td>
                              <button 
                                type="button" 
                                className="btn btn-danger btn-sm" 
                                onClick={() => handleRemoveItem(index)}
                                disabled={formData.detalles.length <= 1}
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

                {/* Sección de totales */}
                <div className="row mt-3 mb-4">
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
                        Aplicar IVA (16%)
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
                              <th>IVA (16%):</th>
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
                
                {/* Sección de financiamiento (solo si es financiado) */}
                {formData.forma_pago === "Financiado" && (
                  <div className="row mt-3 border-top pt-3 mb-4">
                    <div className="col-md-12">
                      <h5>Datos de Financiamiento</h5>    
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Anticipo *</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              name="financiamiento.anticipo_solicitado" 
                              value={formData.financiamiento.anticipo_solicitado} 
                              onChange={handleChange}
                              min="0"
                              max={formData.precio_venta}
                              step="0.01"
                              required
                            />
                            <small className="text-muted">Máximo: ${formData.precio_venta.toFixed(2)}</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Plazo (semanas) *</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              name="financiamiento.plazo_semanas" 
                              value={formData.financiamiento.plazo_semanas} 
                              onChange={handleChange}
                              min="1"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Pago Semanal</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              value={formData.financiamiento.pago_semanal.toFixed(2)} 
                              disabled 
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label className="form-label">Saldo Restante</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              value={formData.financiamiento.saldo_restante.toFixed(2)} 
                              disabled 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="alert alert-info mt-2">
                        <i className="uil-info-circle me-2"></i>
                        El financiamiento incluye un cargo adicional del 34% sobre el total.
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón de envío */}
                <div className="d-print-none mt-4">
                  <div className="float-end">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-md waves-effect waves-light"
                      disabled={!formData.detalles.some(d => d.descripcion.trim() !== "")}
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
      
      {/* Alertas */}
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