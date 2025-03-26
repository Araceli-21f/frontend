import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../layouts/pages/layout";
import CotizacionService from "../../services/CotizacionService";

const EditarCotizacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerCotizacionPorId, actualizarCotizacion, loading, error } = CotizacionService();
  const [cotizacion, setCotizacion] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const fetchedCotizacion = await obtenerCotizacionPorId(id);
        setCotizacion(fetchedCotizacion);
        setFormData(fetchedCotizacion);
      } catch (err) {
        console.error("Error al obtener cotización:", err);
      }
    };
    fetchCotizacion();
  }, [id]);

  if (loading) {
    return <p>Cargando cotización...</p>;
  }

  if (error) {
    return <p>Error al cargar cotización: {error.message}</p>;
  }

  if (!formData) {
    return <p>Cotización no encontrada.</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetalleChange = (e, index) => {
    const { name, value } = e.target;
    const detalles = formData.detalles.map((detalle, i) =>
      i === index ? { ...detalle, [name]: value } : detalle
    );
    setFormData({
      ...formData,
      detalles: detalles,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarCotizacion(id, formData);
      navigate(`/cotizacion/ver/${id}`);
    } catch (err) {
      console.error("Error al actualizar cotización:", err);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <h4 className="card-title mb-4">Editar Cotización #{formData._id}</h4>

                <div className="mb-3">
                  <label className="form-label">Filial:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="filial"
                    value={formData.filial}
                    onChange={handleChange}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Cotizado a:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cliente_id"
                      value={formData.cliente_id?.nombre || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fecha de Cotización:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha_cotizacion"
                      value={formData.fecha_cotizacion.split("T")[0]}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Método de Pago:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="forma_pago"
                    value={formData.forma_pago}
                    onChange={handleChange}
                  />
                </div>

                <h5 className="mt-4 mb-3">Resumen de la Cotización</h5>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Artículo</th>
                        <th>Precio</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.detalles.map((detalle, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control mb-2"
                              name="descripcion"
                              value={detalle.descripcion}
                              onChange={(e) => handleDetalleChange(e, index)}
                            />
                            <div className="d-flex">
                              <div className="me-2">
                                <label className="form-label">Costo Materiales:</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="costo_materiales"
                                  value={detalle.costo_materiales}
                                  onChange={(e) => handleDetalleChange(e, index)}
                                />
                              </div>
                              <div>
                                <label className="form-label">Costo Mano de Obra:</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="costo_mano_obra"
                                  value={detalle.costo_mano_obra}
                                  onChange={(e) => handleDetalleChange(e, index)}
                                />
                              </div>
                            </div>
                          </td>
                          <td>${detalle.inversion}</td>
                          <td className="text-end">${detalle.utilidad_esperada}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="3" className="text-end">
                          <strong>Total</strong>
                        </td>
                        <td className="text-end">
                          <input
                            type="number"
                            className="form-control"
                            name="precio_venta"
                            value={formData.precio_venta}
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-end">
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCotizacion;