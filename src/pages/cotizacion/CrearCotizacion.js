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
    numero: "", fecha_cotizacion: new Date().toISOString().split('T')[0], validoHasta: "", estado: "Borrador", nombre_cotizacion: "",
    
    // Relaciones
    cliente_id: "", vendedor: "", filial_id: "",
    
    // Items
    items: [{
      descripcion: "", cantidad: 1, precio: 0, total: 0
    }],
    
    // Totales
    subtotal: 0, iva: 0, total: 0,
    
    // Tipo de servicio
    tipo: "",
    
    // Financiamiento
    financiamiento: {
      anticipo: 0, plazo: 0, pagoSemanal: 0, saldoRestante: 0
    },
    
    // Pago contado
    pagoContado: { fechaPago: "" },
    
    // Seguimiento de servicio
    fechaInicioServicio: "", fechaFinServicio: "", estadoServicio: "Pendiente"
  });

  const [clientes, setClientes] = useState([]);
  const [filials, setFilials] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  
  const tiposServicio = ["Contado", "Financiado"];
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
    const { name, value } = e.target;
    
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
      // Manejo de items
      const items = formData.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [name]: value };
          // Calcular total del item
          updatedItem.total = updatedItem.cantidad * updatedItem.precio;
          return updatedItem;
        }
        return item;
      });
      
      // Calcular subtotal, IVA y total
      const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const iva = subtotal * 0.19;
      const total = subtotal + iva;
      
      setFormData({ 
        ...formData, 
        items, subtotal, iva, total
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
    const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    setFormData({ 
      ...formData, 
      items, subtotal, iva, total
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
        numero: "", fecha_cotizacion: new Date().toISOString().split('T')[0], validoHasta: "", estado: "Borrador", nombre_cotizacion: "", cliente_id: "", vendedor: "", filial_id: "",
        items: [{
          descripcion: "", cantidad: 1, precio: 0, total: 0
        }],
        subtotal: 0, iva: 0, total: 0, tipo: "",
        financiamiento: {
          anticipo: 0, plazo: 0, pagoSemanal: 0, saldoRestante: 0
        },
        pagoContado: {
          fechaPago: ""
        },
        fechaInicioServicio: "", fechaFinServicio: "",  estadoServicio: "Pendiente"
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
                     <input type="text" className="form-control" name="nombre_cotizacion" value={formData.nombre_cotizacion} onChange={handleChange} required />
                </div>
              </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="fecha_inicio" className="form-label">Fecha de Inicio <span className="text-danger">*</span></label>
                      <input
                        type="date" className="form-control" name="fecha_cotizacion"
                        value={formData.fecha_cotizacion} onChange={handleChange} required
                      />
                      </div>
                    </div>
                    <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="fecha_fin" className="form-label">Fecha de Fin <span className="text-danger">*</span></label>
                      <input
                        type="date" className="form-control" name="fecha_cotizacion"
                        value={formData.fecha_cotizacion} onChange={handleChange} required
                        />
                    </div>
                  </div>
                </div>

              <div className="row">
                
                  <div className="col-md-4">
                  <div className="mb-3">
                      <label htmlFor="tipo" className="form-label">Tipo de Servicio</label>
                      <select className="form-select" name="tipo" value={formData.tipo} onChange={handleChange} required>
                        <option value="">Selecciona un tipo</option>
                        {tiposServicio.map((tipo) => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                    <div className="col-md-4">
                    <div className="mb-3">
                      <label htmlFor="filial_id" className="form-label">Filial</label>
                      <select className="form-select" name="filial_id" value={formData.filial_id} onChange={handleChange} required>
                        <option value="">Selecciona un Filial</option>
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
                      <select className="form-select" name="estado" value={formData.estado} onChange={handleChange} required>
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
                      <select className="form-select" name="cliente_id" value={formData.cliente_id} onChange={handleChange} required>
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
                      <input type="text" className="form-control" name="vendedor" value={formData.vendedor} onChange={handleChange} required />
                    </div></div>
                </div>

                {formData.tipo === "Financiado" && (
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <h5>Datos de Financiamiento</h5>    
                      <div className="row">
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.anticipo" className="form-label">Anticipo</label>
                            <input type="number" className="form-control" name="financiamiento.anticipo" value={formData.financiamiento.anticipo} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.plazo" className="form-label">Plazo (semanas)</label>
                            <input type="number" className="form-control" name="financiamiento.plazo" value={formData.financiamiento.plazo} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.pagoSemanal" className="form-label">Pago Semanal</label>
                            <input type="number" className="form-control" name="financiamiento.pagoSemanal" value={formData.financiamiento.pagoSemanal} onChange={handleChange} disabled />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="mb-3">
                            <label htmlFor="financiamiento.saldoRestante" className="form-label">Saldo Restante</label>
                            <input type="number" className="form-control" name="financiamiento.saldoRestante" value={formData.financiamiento.saldoRestante} onChange={handleChange} disabled />
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
                        <label htmlFor="pagoContado.fechaPago" className="form-label">Fecha de Pago</label>
                        <input type="date" className="form-control" name="pagoContado.fechaPago" value={formData.pagoContado.fechaPago} onChange={handleChange} />
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
                              <input type="text" className="form-control" name="descripcion" value={item.descripcion} onChange={(e) => handleChange(e, index)} required />
                            </td>
                            <td>
                              <input type="number" className="form-control" name="cantidad" value={item.cantidad} onChange={(e) => handleChange(e, index)} required />
                            </td>
                            <td>
                              <input type="number" className="form-control" name="precio" value={item.precio} onChange={(e) => handleChange(e, index)} required />
                            </td>
                            <td>
                              <input type="number" className="form-control" value={item.total} disabled />
                            </td>
                            <td>
                              <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(index)}>Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" className=" btn btn-primary mt-2" onClick={handleAddItem}>Agregar Item</button>
                </div>

                <div className="row mt-3">
                  <div className="col-md-4 offset-md-8">
                    <div className="table-responsive">
                      <table className="table table-sm table-borderless">
                        <tbody>
                          <tr>
                            <th>Subtotal:</th>
                            <td className="text-end">${formData.subtotal.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <th>IVA (19%):</th>
                            <td className="text-end">${formData.iva.toFixed(2)}</td>
                          </tr>
                          <tr className="border-top">
                            <th>Total:</th>
                            <td className="text-end fw-bold">${formData.total.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
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