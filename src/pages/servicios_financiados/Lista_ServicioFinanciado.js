import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import useDateRange from "../../hooks/useDateRange";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';
import LoadingError from "../../components/LoadingError";
import ServicioFinanciadoService from "../../services/ServicioFinanciadoService";

const ListaServiciosFinancieros = () => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { obtenerServicioFinanciados, eliminarServicioFinanciado } = ServicioFinanciadoService();

    const {
        searchTerm, filterType, filterValue,
        handleSearchChange
    } = useSearchFilter("");

    const filteredServicios = servicios.filter((servicio) => {
        const descripcion = servicio.descripcion || '';
        const clienteNombre = servicio.cliente_id?.nombre || ''; // Manejo de nulos
        const matchesSearch = descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()); // Búsqueda en descripción y nombre del cliente
        const matchesFilter = filterValue === "Todos" || servicio[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });

    const { current: currentServicios, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredServicios, 5);
      // Usar el hook para las fechas
  const { dateRanges, handleDateChange } = useDateRange({
    fecha_inicio: "",
    fecha_fin: "",
  });

      // Filtrado por fechas
  const filterByDateRange = (servicios, startDate, endDate) => {
    if (!startDate || !endDate) return servicios; // Si no hay fechas, retorna todas las campañas
    return servicios.filter(servicio => {
      const servicioStartDate = new Date(servicio.fecha_inicio);
      const servicioEndDate = new Date(servicio.fecha_termino);
      return servicioStartDate >= new Date(startDate) && servicioEndDate <= new Date(endDate);
    });
  };

  // Aplicar filtro de fechas al hacer clic en el botón
  const handleDateFilter = () => {
    const filteredByDate = filterByDateRange(filteredServicios, dateRanges.fecha_inicio, dateRanges.fecha_fin);
    setServicios(filteredByDate); // Actualizar el estado de las campañas con el filtrado de fechas
  };

    useEffect(() => {
        const fetchServicios = async () => {
            setLoading(true);
            try {
                const fetchedServicios = await obtenerServicioFinanciados();
                console.log("Servicios obtenidos:", fetchedServicios);
                setServicios(fetchedServicios);
            } catch (err) {
                console.error("Error al obtener servicios financiados:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchServicios();
    }, [obtenerServicioFinanciados]);

    const handleDelete = async (id) => {
        try {
            await eliminarServicioFinanciado(id);
            setServicios(servicios.filter(servicio => servicio._id !== id));
            setAlert({ type: "warning", action: "delete", entity: "servicio financiero" });
            setTimeout(() => setAlert(null), 5000);
        } catch (err) {
            console.error("Error al eliminar servicio financiero:", err);
        }
    };

    const handleConfirmDelete = (id) => {
        handleDelete(id);
        setAlert(null);
    };

    const handleCancelDelete = () => {
        setAlert(null);
    };

    //vista
    const handleView = (id) => {
    const servicio = servicios.find((u) => u._id === id); // Corregido: usa _id
    if (servicio) {
        navigate(`/servicio/ver/${id}`);
    } else {
        console.error('Servicio no encontrado');
    }
};

     // Función para formatear la fecha a DD-MM-YYYY
    const formatDate = (dateString) => {
      if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
    <LoadingError
      loading={loading}
      error={error}
      loadingMessage="Cargando datos..."
      errorMessage={error?.message}
    >
        <Layout>
            {alert && (
                <AlertComponent
                    type={alert.type} action={alert.action} entity={alert.entity}
                    onConfirm={() => handleConfirmDelete(alert.id)} onCancel={handleCancelDelete}
                />
            )}
            <div className="card p-3">
                <h2 className="mb-3 ">Lista de Servicios Financieros</h2>

                <div className="col-md">
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <div className="input-group shadow-sm">
                                <input
                                    type="text" className="form-control pe-5"
                                    placeholder="Buscar Servicio o Cliente..."
                                    value={searchTerm} onChange={handleSearchChange}
                                />
                                <button type="button" className="btn btn-primary" style={{ marginLeft: '2px' }}>
                                    <i className="uil-search"></i>
                                </button>
                            </div>
                        </div>
                        {/* Filtro por fechas (2 columnas) */}
                         <div className="col-md-4 mb-2">
                          <div className="input-daterange input-group">
                           <input type="date" className="form-control" value={dateRanges.fecha_inicio}
                            onChange={(e) => handleDateChange("fecha_inicio", e.target.value)}/>
                           <input type="date" className="form-control" value={dateRanges.fecha_fin}
                            onChange={(e) => handleDateChange("fecha_fin", e.target.value)}/>
                             <button  type="button" className="btn btn-primary" style={{ marginLeft: "2px" }} onClick={handleDateFilter}>
                                <i className="mdi mdi-filter-variant"></i>
                                </button>
                               </div>
                             </div>
                             <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <Link to="/servicios-financieros/CrearServicioFinanciero" className="input-daterange input-group btn btn-outline-success waves-effect waves-light">
                                    <i className="uil-plus fs-6" /> Crear Servicio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="table-responsive shadow-sm">
                        <table className="table table-centered table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cotizacion</th>
                                    <th>Servicio</th>
                                    <th>Cliente</th>
                                    <th>Monto Servicio</th>
                                    <th>Pago Semanal</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Término</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentServicios.map((servicio) => (
                                    <tr key={servicio._id}>
                                        <td>{servicio._id}</td>
                                        <td>{servicio.cotizacion_id?.nombre_cotizacion}</td>
                                        <td>{servicio.nombre_servicio}</td>
                                        <td>{servicio.cliente_id?.nombre || 'N/A'}</td> {/* Manejo de nulos */}
                                        <td>{servicio.monto_servicio}</td>
                                        <td>{servicio.pago_semanal}</td>
                                        <td>{formatDate(servicio.fecha_inicio)}</td>
                                        <td>{formatDate(servicio.fecha_termino)}</td>
                                        <td>
                                            <BotonesAccion
                                                id={servicio._id}
                                                entidad="servicio"
                                                onDelete={handleDelete}
                                                setAlert={setAlert}
                                                onView={() => handleView(servicio._id)}

                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button className="btn btn-secondary shadow-sm" onClick={setPreviousPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button className="btn btn-secondary shadow-sm" onClick={setNextPage} disabled={currentPage === totalPages}>
                        Siguiente
                    </button>
                </div>
            </div>
            <br />
        </Layout>
        </LoadingError>
    );
};

export default ListaServiciosFinancieros;