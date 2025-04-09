import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import AlertComponent from "../../components/AlertasComponent";
import CotizacionService from "../../services/CotizacionService";
import ClienteService from "../../services/ClienteService";
import FilialService from "../../services/FilialService";
import LoadingError from "../../components/LoadingError";

const EditarCotizacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerCotizacionPorId, actualizarCotizacion } = CotizacionService();
  const { obtenerClientes } = ClienteService();
  const { obtenerFilials } = FilialService();
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    validoHasta: "",
    estado: "Borrador",
    cliente: "",
    vendedor: "",
    filial: "",
    items: [{
      descripcion: "",
      cantidad: 1,
      precio: 0,
      total: 0
    }],
    subtotal: 0,
    iva: 0,
    total: 0,
    tipo: "",
    financiamiento: {
      anticipo: 0,
      plazo: 0,
      pagoSemanal: 0,
      saldoRestante: 0
    },
    pagoContado: {
      fechaPago: ""
    },
    fechaInicioServicio: "",
    fechaFinServicio: "",
    estadoServicio: "Pendiente"
  });

  const [clientes, setClientes] = useState([]);
  const [filials, setFilials] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const tiposServicio = ["Contado", "Financiado"];
  const estados = ["Borrador", "Enviada", "Aprobada", "Completada", "Cancelada"];
  const estadosServicio = ["Pendiente", "EnProceso", "Completado", "Cancelado"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener cotización existente
        const cotizacion = await obtenerCotizacionPorId(id);
        setFormData({
          ...cotizacion,
          fecha: cotizacion.fecha.split('T')[0],
          validoHasta: cotizacion.validoHasta?.split('T')[0] || "",
          fechaInicioServicio: cotizacion.fechaInicioServicio?.split('T')[0] || "",
          fechaFinServicio: cotizacion.fechaFinServicio?.split('T')[0] || "",
          pagoContado: {
            ...cotizacion.pagoContado,
            fechaPago: cotizacion.pagoContado?.fechaPago?.split('T')[0] || ""
          }
        });
        
        // Obtener clientes y filiales
        const [clientesData, filialsData] = await Promise.all([
          obtenerClientes(),
          obtenerFilials()
        ]);
        
        setClientes(clientesData);
        setFilials(filialsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    
    if (name.startsWith("financiamiento.")) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        financiamiento: {
          ...formData.financiamiento,
          [field]: parseFloat(value) || 0
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
      // Manejo de items
      const items = formData.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { 
            ...item, 
            [name]: name === 'descripcion' ? value : parseFloat(value) || 0 
          };
          // Calcular total del item
          updatedItem.total = updatedItem.cantidad * updatedItem.precio;
          return updatedItem;
        }
        return item;
      });
      
      // Calcular subtotal, IVA y total
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const iva = subtotal * 0.19;
      const total = subtotal + iva;
      
      // Calcular financiamiento si es necesario
      let financiamiento = { ...formData.financiamiento };
      if (formData.tipo === 'Financiado') {
        financiamiento.saldoRestante = total - financiamiento.anticipo;
        financiamiento.pagoSemanal = financiamiento.plazo > 0 
          ? financiamiento.saldoRestante / financiamiento.plazo 
          : 0;
      }
      
      setFormData({ 
        ...formData, 
        items,
        subtotal,
        iva,
        total,
        financiamiento
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { descripcion: "", cantidad: 1, precio: 0, total: 0 }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    
    // Recalcular totales
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    setFormData({ 
      ...formData, 
      items,
      subtotal,
      iva,
      total
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarCotizacion(id, formData);
      setAlertType("success");
      setAlertMessage("Cotización actualizada exitosamente.");
      setShowAlert(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(`/detalle-cotizacion/${id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Error al actualizar la cotización:", error);
      setAlertType("error");
      setAlertMessage("Error al actualizar la cotización.");
      setShowAlert(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(value);
  };

  return (
    <LoadingError loading={loading} error={error}>
      <Layout>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h2 className="float-left font-size-h4">Editar Cotización #{formData.numero || id}</h2>
                <div className="invoice-title d-flex flex-column align-items-center">
                  <img src="/assets/images/logo-dark.png" alt="logo" height="20" className="logo-dark ms-auto" />
                </div>
                <hr className="my-4" />

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          name="fecha" 
                          value={formData.fecha} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Válido hasta</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          name="validoHasta" 
                          value={formData.validoHasta} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Estado</label>
                        <select 
                          className="form-select" 
                          name="estado" 
                          value={formData.estado} 
                          onChange={handleChange} 
                          required
                        >
                          {estados.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-3">
                        <label className="form-label">Vendedor</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="vendedor" 
                          value={formData.vendedor} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Filial</label>
                        <select 
                          className="form-select" 
                          name="filial" 
                          value={formData.filial} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Selecciona una filial</option>
                          {filials.map(filial => (
                            <option key={filial._id} value={filial._id}>
                              {filial.nombre_filial}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Cliente</label>
                        <select 
                          className="form-select" 
                          name="cliente" 
                          value={formData.cliente} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Selecciona un cliente</option>
                          {clientes.map(cliente => (
                            <option key={cliente._id} value={cliente._id}>
                              {cliente.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Tipo de Servicio</label>
                        <select 
                          className="form-select" 
                          name="tipo" 
                          value={formData.tipo} 
                          onChange={handleChange} 
                          required
                        >
                          <option value="">Selecciona un tipo</option>
                          {tiposServicio.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {formData.tipo === "Financiado" && (
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <h5>Datos de Financiamiento</h5>
                        <div className="row">
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className="form-label">Anticipo</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="financiamiento.anticipo" 
                                value={formData.financiamiento.anticipo} 
                                onChange={handleChange} 
                                step="0.01" 
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className="form-label">Plazo (semanas)</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                name="financiamiento.plazo" 
                                value={formData.financiamiento.plazo} 
                                onChange={handleChange} 
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className="form-label">Pago Semanal</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={formatCurrency(formData.financiamiento.pagoSemanal)} 
                                disabled 
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-3">
                              <label className="form-label">Saldo Restante</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={formatCurrency(formData.financiamiento.saldoRestante)} 
                                disabled 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.tipo === "Contado" && (
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Fecha de Pago</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            name="pagoContado.fechaPago" 
                            value={formData.pagoContado.fechaPago} 
                            onChange={handleChange} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="py-2 mt-3">
                    <h5 className="font-size-15">Items de la Cotización</h5>
                    <div className="table-responsive">
                      <table className="table table-nowrap table-centered mb-0">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Total</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map((item, index) => (
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
                                  name="cantidad" 
                                  value={item.cantidad} 
                                  onChange={(e) => handleChange(e, index)} 
                                  min="1" 
                                  required 
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  name="precio" 
                                  value={item.precio} 
                                  onChange={(e) => handleChange(e, index)} 
                                  step="0.01" 
                                  min="0" 
                                  required 
                                />
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={formatCurrency(item.total)} 
                                  disabled 
                                />
                              </td>
                              <td>
                                <button 
                                  type="button" 
                                  className="btn btn-danger btn-sm" 
                                  onClick={() => handleRemoveItem(index)}
                                  disabled={formData.items.length <= 1}
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
                      Agregar Item
                    </button>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-4 offset-md-8">
                      <div className="table-responsive">
                        <table className="table table-sm table-borderless">
                          <tbody>
                            <tr>
                              <th>Subtotal:</th>
                              <td className="text-end">{formatCurrency(formData.subtotal)}</td>
                            </tr>
                            <tr>
                              <th>IVA (19%):</th>
                              <td className="text-end">{formatCurrency(formData.iva)}</td>
                            </tr>
                            <tr className="border-top">
                              <th>Total:</th>
                              <td className="text-end fw-bold">{formatCurrency(formData.total)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha Inicio Servicio</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          name="fechaInicioServicio" 
                          value={formData.fechaInicioServicio} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Fecha Fin Servicio</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          name="fechaFinServicio" 
                          value={formData.fechaFinServicio} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Estado del Servicio</label>
                        <select 
                          className="form-select" 
                          name="estadoServicio" 
                          value={formData.estadoServicio} 
                          onChange={handleChange}
                        >
                          {estadosServicio.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="d-print-none mt-4">
                    <div className="float-end">
                      <button type="submit" className="btn btn-primary w-md waves-effect waves-light">
                        Guardar Cambios
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary w-md waves-effect waves-light ms-2"
                        onClick={() => navigate(`/detalle-cotizacion/${id}`)}
                      >
                        Cancelar
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
            action={alertType === "success" ? "update" : "error"}
            onCancel={handleAlertClose}
            message={alertMessage}
          />
        )}
      </Layout>
    </LoadingError>
  );
};

export default EditarCotizacion;