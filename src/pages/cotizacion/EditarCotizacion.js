import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import LoadingError from "../../components/LoadingError";
import useCotizacionService from "../../services/CotizacionService";
import ClienteService from "../../services/ClienteService"; 
import FilialService from "../../services/FilialService";

const EditarCotizacion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { obtenerCotizacionPorId, actualizarCotizacion } = useCotizacionService();
    const [cotizacion, setCotizacion] = useState({
        fecha_cotizacion: new Date(), forma_pago: "Contado", precio_venta: 0, anticipo_solicitado: 0, filial_id: "", cliente_id: null, detalles: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { obtenerClientes } = ClienteService();
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [mostrarSelectClientes, setMostrarSelectClientes] = useState(false);
    const { obtenerFilials } = FilialService();
    const [filials, setFilials] = useState([]);
    const [filialSeleccionado, setFilialSeleccionado] = useState(null);
    const [mostrarSelectFilials, setMostrarSelectFilials] = useState(false);
    const [nuevoDetalle, setNuevoDetalle] = useState({
        descripcion: "", costo_materiales: 0, costo_mano_obra: 0, inversion: 0, utilidad_esperada: 0,
    });

    useEffect(() => {
      const fetchCotizacion = async () => {
          setLoading(true);
          try {
              const foundCotizacion = await obtenerCotizacionPorId(id);
              if (!foundCotizacion) throw new Error("Cotización no encontrada");
              setCotizacion(foundCotizacion);
              const cliente = clientes.find((c) => 
              c._id === foundCotizacion.cliente_id);
              setClienteSeleccionado(cliente || null);
          } catch (err) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      };
      fetchCotizacion();
  }, [id]);


    // obtener clientes
    useEffect(() => {
      const cargarClientes = async () => {
        try {
          const listaClientes = await obtenerClientes();
          setClientes(listaClientes);
        } catch (error) {
          console.error("Error al cargar clientes:", error);
        }
      };
      cargarClientes();
    }, []);
  
    const handleChange = (e) => {
      setCotizacion({ ...cotizacion, [e.target.name]: e.target.value });
    };
  
    const handleClienteSeleccionado = (cliente) => {
      setClienteSeleccionado(cliente);
      setCotizacion({ ...cotizacion, cliente_id: cliente._id });
      setMostrarSelectClientes(false);
    };
  
    const handleSeleccionarCliente = () => {
      setMostrarSelectClientes(true);
    };
  
    const handleClienteSeleccionadoChange = (e) => {
      const clienteIdSeleccionado = e.target.value;
      const clienteEncontrado = clientes.find((cliente) => cliente._id === clienteIdSeleccionado);
      if (clienteEncontrado) {
        handleClienteSeleccionado(clienteEncontrado);
      }
    };
  
    // obtener filials
    useEffect(() => {
      const cargarFilials = async () => {
        try {
          const listafilials = await obtenerFilials();
          setFilials(listafilials); // Corregido: Usar setFilials
        } catch (error) {
          console.error("Error al cargar filials:", error); // Corregido el mensaje de error
        }
      };
      cargarFilials();
    }, []);
  
    const handleFilialSeleccionado = (filial) => {
      setFilialSeleccionado(filial);
      setCotizacion({ ...cotizacion, filial_id: filial._id });
      setMostrarSelectFilials(false);
    };
  
    const handleSeleccionarFilial = () => {
      setMostrarSelectFilials(true);
    };
  
    const handleFilialSeleccionadoChange = (e) => {
      const filialIdSeleccionado = e.target.value;
      const filialEncontrado = filials.find((filial) => filial._id === filialIdSeleccionado);
      if (filialEncontrado) {
        handleFilialSeleccionado(filialEncontrado); 
      }
    };
  



    const handleNuevoDetalleChange = (e) => {setNuevoDetalle({ ...nuevoDetalle, [e.target.name]: e.target.value }); };
    const handleAgregarDetalle = () => {
        setCotizacion({ ...cotizacion, detalles: [...cotizacion.detalles, nuevoDetalle], });
        setNuevoDetalle({ descripcion: "", costo_materiales: 0, costo_mano_obra: 0, inversion: 0, utilidad_esperada: 0, });
    };
    const handleEliminarDetalle = (index) => { 
      const nuevosDetalles = [...cotizacion.detalles]; 
      nuevosDetalles.splice(index, 1);
      setCotizacion({ ...cotizacion, detalles: nuevosDetalles });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          // Validación de datos aquí
          if (!cotizacion.cliente_id) {
              setError("Debes seleccionar un cliente.");
              return;
          }
          await actualizarCotizacion(id, cotizacion);
          navigate("/Lista_cotizacion");
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
    };

  return (
  <LoadingError
    loading={loading}
    error={error}
    loadingMessage="Cargando datos..."
    errorMessage={error?.message}
  >
<Layout>
  <div className="row">
    <div className="col-lg-12">
      <div className="card">
        <div className="card-body">
           <h2 className="font-size-h4 mb-4">Editar Cotización</h2>
           <form onSubmit={handleSubmit}>
             {/* Campos de la cotización */}
          <div className="row mb-3">
              {/* Cliente (50% del ancho) */}
              <div className="col-md-6 d-flex align-items-center p-2">
                      <label className="form-label me-2 font-size-17">Cliente: </label>
                      <select  className="form-select"   value={clienteSeleccionado?._id || ""} onChange={handleClienteSeleccionadoChange} >
                          {clientes.length > 0 ? (
                             clientes.map((cliente) => (
                              
                               <option key={cliente._id} value={cliente._id}>
                                 {cliente.nombre}
                                  </option>
                                   ))
                                   ) : (
                                     <option disabled>Cargando clientes...</option>
                                      )}
                                      </select>
                    </div>
            {/* Filial (50% del ancho) */}
            <div className="col-md-6 d-flex align-items-center p-2">
              <label className="form-label me-2 font-size-17">Filial: </label>
              <select  className="form-select"   value={filialSeleccionado?._id || ""} onChange={handleFilialSeleccionadoChange} >
                          {filials.length > 0 ? (
                             filials.map((filial) => (
                              
                               <option key={filial._id} value={filial._id}>
                                 {filial.nombre_filial}
                                  </option>
                                   ))
                                   ) : (
                                     <option disabled>Cargando filial...</option>
                                      )}
                                      </select>            </div>
          </div>

        <div className="row mb-3">
         {/* Forma de Pago */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Forma de Pago:</label>
          <select name="forma_pago" value={cotizacion.forma_pago} onChange={handleChange} className="form-select bg-light">
            <option value="Contado">Contado</option>
            <option value="Financiado">Financiado</option>
          </select>
        </div>
        {/* Precio de Venta */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Precio de Venta:</label>
          <input type="number" name="precio_venta" value={cotizacion.precio_venta} onChange={handleChange} className="form-control bg-light" />
        </div>
        {/* Anticipo Solicitado */}
        <div className="col-md-4">
          <label className="form-label fw-bold">Anticipo Solicitado:</label>
          <input type="number" name="anticipo_solicitado" value={cotizacion.anticipo_solicitado} onChange={handleChange} className="form-control bg-light" />
        </div>
     </div>
        {/* Detalles de la Factura */}
        <div className="py-2">
          <h5 className="font-size-15">Detalles de la Factura</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-centered mb-0">
              <thead>
                <tr>
                  <th className="bg-light">Descripción</th>
                  <th className="bg-light">Costo Materiales</th>
                  <th className="bg-light">Costo Mano de Obra</th>
                  <th className="bg-light">Inversión</th>
                  <th className="bg-light">Utilidad Esperada</th>
                  <th className="bg-light">Acciones</th>
                </tr>
              </thead>
            <tbody>
              {/* Mostrar detalles existentes */}
                {cotizacion.detalles.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" className="form-control" name={`items[${index}].descripcion`} 
                    value={item.descripcion} onChange={(e) => handleChange(e, index)} />
                  </td>
                  <td>
                    <input type="number" className="form-control" name={`items[${index}].costo_materiales`} 
                    value={item.costo_materiales} onChange={(e) => handleChange(e, index)} />
                  </td>
                  <td>
                    <input type="number" className="form-control" name={`items[${index}].costo_mano_obra`} 
                    value={item.costo_mano_obra} onChange={(e) => handleChange(e, index)} />
                  </td>
                  <td>
                    <input type="number" className="form-control" name={`items[${index}].inversion`}
                    value={item.inversion} onChange={(e) => handleChange(e, index)} />
                  </td>
                  <td>
                    <input type="number" className="form-control" name={`items[${index}].utilidad_esperada`} 
                    value={item.utilidad_esperada} onChange={(e) => handleChange(e, index)} />
                  </td>
                  <td>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => handleEliminarDetalle(index)}> Eliminar </button>
                  </td>
                </tr>
              ))}
              {/* Nuevo detalle en la factura */}
                <tr>
                 <td>
                  <input type="text" className="form-control" name="descripcion" value={nuevoDetalle.descripcion} onChange={handleNuevoDetalleChange} placeholder="Descripción"/>
                 </td>
                 <td>
                  <input type="number" className="form-control" name="costo_materiales" value={nuevoDetalle.costo_materiales} onChange={handleNuevoDetalleChange} placeholder="Costo Materiales" />
                 </td>
                 <td>
                  <input type="number" className="form-control" name="costo_mano_obra" value={nuevoDetalle.costo_mano_obra} onChange={handleNuevoDetalleChange} placeholder="Costo Mano de Obra" />
                 </td>
                 <td>
                  <input type="number" className="form-control" name="inversion" value={nuevoDetalle.inversion} onChange={handleNuevoDetalleChange} placeholder="Inversión" />
                 </td>
                 <td>
                   <input type="number" className="form-control" name="utilidad_esperada"  value={nuevoDetalle.utilidad_esperada} onChange={handleNuevoDetalleChange} placeholder="Utilidad Esperada" />
                 </td>
                 <td>
                   <button type="button" className="btn btn-success btn-sm" onClick={handleAgregarDetalle} > Agregar Detalle </button>
                 </td>
               </tr>
             </tbody>
            </table>
          </div>
            <button type="button" className="btn btn-primary mt-2" onClick={handleAgregarDetalle} > Agregar </button>
          </div>
          {/* Botón de Guardar */}
          <div className="text-end">
            <button type="submit" className="btn btn-primary"> Guardar </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>
  </Layout>
  </LoadingError>
  );
};

export default EditarCotizacion;
