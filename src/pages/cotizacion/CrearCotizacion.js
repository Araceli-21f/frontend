import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../../components/AlertasComponent";
import CotizacionService from "../../services/CotizacionService";
import ClienteService from "../../services/ClienteService";
import FilialService from "../../services/FilialService";
import UserService from "../../services/UserService";

const CrearCotizacion = ({ onCotizacionCreada }) => {
  const navigate = useNavigate();
  const { crearCotizacion } = CotizacionService();
  const { obtenerClientes } = ClienteService();
  const { obtenerFilials } = FilialService();
  const { obtenerUsuarios } = UserService();
  
  // Estados del modelo
  const estadosCotizacion = ["Borrador", "Enviada", "Aprobada", "Completada", "Cancelada"];  
  const estadosServicio = ["Pendiente", "En Proceso", "Completado", "Cancelado"];
  const formasPago = ["Contado", "Financiado"];
  const metodosPago = ["Efectivo", "Transferencia", "Tarjeta Débito", "Tarjeta Crédito", "Cheque", "Depósito"];

  const [formData, setFormData] = useState({
    // Información básica
    nombre_cotizacion: "",
    fecha_cotizacion: new Date().toISOString().split('T')[0],
    valido_hasta: "",
    
    // Estados
    estado: "Borrador",
    estado_servicio: "Pendiente",
    
    // Configuración
    aplicaIva: true,
    forma_pago: "",
    metodo_pago: "Efectivo",
    
    // Relaciones
    cliente_id: "",
    vendedor_id: "",
    filial_id: "",
    creado_por: "",
    actualizado_por: "",
    
    // Detalles técnicos
    detalles: [{
      descripcion: "", 
      costo_materiales: 0, 
      costo_mano_obra: 0, 
      utilidad_esperada: 0,
      inversion_total: 0,
      precio_venta: 0
    }],
    
    // Totales
    subtotal: 0,
    iva: 0,
    precio_venta: 0,
    
    // Financiamiento
    financiamiento: {
      anticipo_solicitado: 0, 
      plazo_semanas: 0,  
      pago_semanal: 0,  
      saldo_restante: 0,
      tasa_interes: 0.34,
      fecha_inicio: null,
      fecha_termino: null,
      pagos_ids: []
    },
    
    // Seguimiento
    fecha_inicio_servicio: null,
    fecha_fin_servicio: null,
    
    // Referencias
    pago_contado_id: null
  });

  const [clientes, setClientes] = useState([]);
  const [filials, setFilials] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedClientes, fetchedFilials, fetchedUsuarios] = await Promise.all([
          obtenerClientes(),
          obtenerFilials(),
          obtenerUsuarios()
        ]);
        
        setClientes(fetchedClientes);
        setFilials(fetchedFilials);
        setUsuarios(fetchedUsuarios);
        
        if (fetchedUsuarios.length > 0) {
          setFormData(prev => ({
            ...prev,
            vendedor_id: fetchedUsuarios[0]._id,
            creado_por: fetchedUsuarios[0]._id,
            actualizado_por: fetchedUsuarios[0]._id
          }));
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setAlertType("error");
        setAlertMessage("Error al cargar datos iniciales");
        setShowAlert(true);
      }
    };
    fetchData();
  }, [obtenerClientes, obtenerFilials, obtenerUsuarios]);

  const calcularTotales = (detalles, aplicaIva, formaPago, financiamiento) => {
    const detallesValidos = detalles || [];
    const aplicaIvaValido = aplicaIva !== undefined ? aplicaIva : true;
    
    // Calcular detalles primero
    const detallesCalculados = detallesValidos.map(item => {
      const inversion = Number(item.costo_materiales || 0) + Number(item.costo_mano_obra || 0);
      const precio = inversion * (1 + (Number(item.utilidad_esperada || 0)/100));
      return {
        ...item,
        inversion_total: inversion,
        precio_venta: precio
      };
    });

    // Calcular subtotal
    const subtotal = detallesCalculados.reduce((sum, item) => sum + item.precio_venta, 0);
    const iva = aplicaIvaValido ? subtotal * 0.16 : 0;
    let precio_venta = subtotal + iva;

    // Manejar financiamiento
    let nuevoFinanciamiento = { 
      ...(financiamiento || {}),
      tasa_interes: 0.34 
    };

    if (formaPago === "Financiado") {
      const cargoFinanciero = precio_venta * 0.34;
      precio_venta += cargoFinanciero;
      
      const anticipo = Math.min(
        Number(nuevoFinanciamiento.anticipo_solicitado) || 0,
        precio_venta
      );
      
      const plazo = Math.max(Number(nuevoFinanciamiento.plazo_semanas) || 1, 1);
      const saldo = precio_venta - anticipo;
      
      nuevoFinanciamiento = {
        ...nuevoFinanciamiento,
        anticipo_solicitado: anticipo,
        plazo_semanas: plazo,
        saldo_restante: Math.max(saldo, 0),
        pago_semanal: plazo > 0 ? saldo / plazo : 0
      };
    }

    return {
      detalles: detallesCalculados,
      subtotal: parseFloat(subtotal.toFixed(2)),
      iva: parseFloat(iva.toFixed(2)),
      precio_venta: parseFloat(precio_venta.toFixed(2)),
      financiamiento: formaPago === "Financiado" ? nuevoFinanciamiento : undefined
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validación de fechas
      const fechaCotizacion = new Date(formData.fecha_cotizacion);
      const fechaValidoHasta = new Date(formData.valido_hasta);
      
      if (fechaValidoHasta <= fechaCotizacion) {
        throw new Error("La fecha de validez debe ser posterior a la fecha de cotización");
      }

      // Validación de estados
      if (!estadosCotizacion.includes(formData.estado)) {
        throw new Error(`Estado no válido. Use uno de: ${estadosCotizacion.join(", ")}`);
      }

      if (!estadosServicio.includes(formData.estado_servicio)) {
        throw new Error(`Estado de servicio no válido. Use uno de: ${estadosServicio.join(", ")}`);
      }
      
      // Validaciones básicas
      if (!formData.nombre_cotizacion) {
        throw new Error("El nombre de la cotización es requerido");
      }
  
      if (!formData.cliente_id) {
        throw new Error("Debe seleccionar un cliente");
      }
  
      if (!formData.filial_id) {
        throw new Error("Debe seleccionar una filial");
      }
  
      if (!formData.vendedor_id) {
        throw new Error("Debe seleccionar un vendedor");
      }
  
      if (!formData.detalles.some(d => d.descripcion.trim() !== "")) {
        throw new Error("Debe agregar al menos un detalle con descripción");
      }
  
      if (!formData.forma_pago) {
        throw new Error("Debe seleccionar una forma de pago");
      }
  
      // Validación de fechas de servicio si está en proceso o completado
      if (formData.estado_servicio === "EnProceso" && !formData.fecha_inicio_servicio) {
        throw new Error("Debe especificar fecha de inicio cuando el servicio está en proceso");
      }
      
      if (formData.estado_servicio === "Completado" && !formData.fecha_fin_servicio) {
        throw new Error("Debe especificar fecha de finalización cuando el servicio está completado");
      }

      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        fecha_cotizacion: new Date(formData.fecha_cotizacion),
        valido_hasta: new Date(formData.valido_hasta),
        fecha_inicio_servicio: formData.fecha_inicio_servicio ? new Date(formData.fecha_inicio_servicio) : null,
        fecha_fin_servicio: formData.fecha_fin_servicio ? new Date(formData.fecha_fin_servicio) : null,
        
        // Campos calculados que el backend maneja
        subtotal: undefined,
        iva: undefined,
        precio_venta: undefined,
        estado: formData.estado|| 'Borrador',
        estado_servicio:formData.estado_servicio ||"Pendiente",

        detalles: formData.detalles.map(item => ({
          descripcion: item.descripcion,
          costo_materiales: item.costo_materiales,
          costo_mano_obra: item.costo_mano_obra,
          utilidad_esperada: item.utilidad_esperada,
          inversion_total: undefined, // El backend lo calcula
          precio_venta: undefined    // El backend lo calcula
        })),
        
        // Limpiar financiamiento si no aplica
        ...(formData.forma_pago !== "Financiado" ? { financiamiento: undefined } : {
          financiamiento: {
            anticipo_solicitado: formData.financiamiento.anticipo_solicitado,
            plazo_semanas: formData.financiamiento.plazo_semanas,
            tasa_interes: 0.34,
            ...(formData.financiamiento.fecha_inicio && {
              fecha_inicio: new Date(formData.financiamiento.fecha_inicio)
            })
          }
        }),
        
        pago_contado_id: undefined // Se crea después
      };

      // Enviar datos
      const response = await crearCotizacion(dataToSend);
      
      // Manejar respuesta exitosa
      setAlertType("success");
      setAlertMessage("Cotización creada exitosamente");
      setShowAlert(true);
      
      setTimeout(() => navigate(`/cotizaciones/ver/${response._id}`), 2000);
      
    } catch (error) {
      console.error("Error al crear cotización:", error);
      setAlertType("error");
      setAlertMessage(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Error al crear la cotización"
      );
      setShowAlert(true);
    }
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
        [field]: type === 'number' ? Number(value) || 0 : value
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
          return { 
            ...item, 
            [name]: type === 'number' ? Number(value) || 0 : value 
          };
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
        detalles: nuevosTotales.detalles,
        subtotal: nuevosTotales.subtotal,
        iva: nuevosTotales.iva,
        precio_venta: nuevosTotales.precio_venta,
        financiamiento: nuevosTotales.financiamiento || prev.financiamiento
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? Number(value) || 0 : value,
        actualizado_por: usuarios[0]?._id || "" // Actualizar quién modificó
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
          inversion_total: 0,
          precio_venta: 0
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
      detalles: nuevosTotales.detalles,
      subtotal: nuevosTotales.subtotal,
      iva: nuevosTotales.iva,
      precio_venta: nuevosTotales.precio_venta,
      financiamiento: nuevosTotales.financiamiento || prev.financiamiento
    }));
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
                        maxLength="100"
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
                        name="valido_hasta" 
                        value={formData.valido_hasta} 
                        onChange={handleChange} 
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sección de estados y pagos */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Estado Cotización</label>
                      <select 
                        className="form-select" 
                        name="estado" 
                        value={formData.estado} 
                        onChange={handleChange}
                      >
                        {estadosCotizacion.map((estado) => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label">Estado Servicio</label>
                      <select 
                        className="form-select" 
                        name="estado_servicio" 
                        value={formData.estado_servicio} 
                        onChange={handleChange}
                      >
                        {estadosServicio.map((estado) => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
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
                  <div className="col-md-3">
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
                </div>

                {/* Fechas de servicio */}
                {(formData.estado_servicio === "EnProceso" || formData.estado_servicio === "Completado") && (
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha Inicio Servicio</label>
                        <input
                          type="date"
                          className="form-control"
                          name="fecha_inicio_servicio"
                          value={formData.fecha_inicio_servicio || ""}
                          onChange={handleChange}
                          required={formData.estado_servicio === "EnProceso"}
                        />
                      </div>
                    </div>
                    {formData.estado_servicio === "Completado" && (
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Fecha Fin Servicio</label>
                          <input
                            type="date"
                            className="form-control"
                            name="fecha_fin_servicio"
                            value={formData.fecha_fin_servicio || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Relaciones */}
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
                      <select 
                        className="form-select" 
                        name="vendedor_id" 
                        value={formData.vendedor_id} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Seleccione un vendedor</option>
                        {usuarios.map((usuario) => (
                          <option key={usuario._id} value={usuario._id}>
                            {usuario.name} {usuario.apellidos}
                          </option>
                        ))}
                      </select>
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
                          <th>Precio Venta</th>
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
                                maxLength="200"
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
                                value={(item.inversion_total || 0).toFixed(2)}
                                disabled 
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={(item.precio_venta || 0).toFixed(2)}
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
                            <td className="text-end">${(formData.subtotal || 0).toFixed(2)}</td>
                          </tr>
                          {formData.aplicaIva && (
                            <tr>
                              <th>IVA (16%):</th>
                              <td className="text-end">${(formData.iva || 0).toFixed(2)}</td>
                            </tr>
                          )}
                          <tr className="border-top">
                            <th>Total:</th>
                            <td className="text-end fw-bold">${(formData.precio_venta || 0).toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Sección de financiamiento */}
                {formData.forma_pago === "Financiado" && formData.financiamiento && (
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
                              value={(formData.financiamiento.pago_semanal || 0).toFixed(2)} 
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
                      <div className="row mt-2">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Fecha Inicio Financiamiento</label>
                            <input
                              type="date"
                              className="form-control"
                              name="financiamiento.fecha_inicio"
                              value={formData.financiamiento.fecha_inicio || ""}
                              onChange={handleChange}
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