import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import AlertComponent from '../../components/AlertasComponent';
import ServicioFinanciadoService from "../../services/ServicioFinanciadoService";

const ListaServiciosFinanciados = () => {
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [serviciosFinanciados, setServiciosFinanciados] = useState([]);
    const { loading, error, obtenerServiciosFinanciados, eliminarServicioFinanciado } = ServicioFinanciadoService();

    // Hook de búsqueda y filtrado
    const {
        searchTerm, filterType, filterValue,
        handleSearchChange, handleFilterTypeChange, handleFilterValueChange
    } = useSearchFilter("");

    const filteredServiciosFinanciados = serviciosFinanciados.filter((servicio) => {
        const clienteId = servicio.cliente_id?.toString() || '';
        const descripcion = servicio.descripcion?.toLowerCase() || '';
        const matchesSearch = clienteId.toLowerCase().includes(searchTerm.toLowerCase()) || descripcion.includes(searchTerm.toLowerCase());
        const matchesFilter = filterValue === "Todos" || servicio[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });

    const filterOptions = ["Todos", ...new Set(serviciosFinanciados.map((servicio) => servicio[filterType]))];

    // Hook de paginación
    const { current: currentServiciosFinanciados, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredServiciosFinanciados, 5);

    useEffect(() => {
        const fetchServiciosFinanciados = async () => {
            try {
                const fetchedServiciosFinanciados = await obtenerServiciosFinanciados();
                setServiciosFinanciados(fetchedServiciosFinanciados);
            } catch (err) {
                console.error("Error al obtener Servicios Financiados:", err);
            }
        };
        fetchServiciosFinanciados();
    }, [obtenerServiciosFinanciados]);

    const handleDelete = async (id) => {
        try {
            await eliminarServicioFinanciado(id);
            setServiciosFinanciados(serviciosFinanciados.filter(servicio => servicio._id !== id));
            setAlert({ type: "success", action: "delete", entity: "Servicio Financiado" });
            setTimeout(() => setAlert(null), 5000);
        } catch (err) {
            console.error("Error al eliminar Servicio Financiado:", err);
        }
    };

    const handleConfirmDelete = (id) => {
        handleDelete(id);
        setAlert(null);
    };

    const handleCancelDelete = () => {
        setAlert(null);
    };

    if (loading) {
        return <p>Cargando Servicios Financiados...</p>;
    }

    if (error) {
        return <p>Error al cargar Servicios Financiados: {error.message}</p>;
    }

    return (
        <Layout>
            {alert && (
                <AlertComponent
                    type={alert.type}
                    action={alert.action}
                    entity={alert.entity}
                    onConfirm={() => handleConfirmDelete(alert.id)}
                    onCancel={handleCancelDelete}
                />
            )}
            <div className="card p-3">
                <h2 className="mb-3"><i className="fa fa-fw fa-bars" /> Lista de Servicios Financiados</h2>

                <div className="col-md-10">
                    <div className="row">
                        {/* Barra de búsqueda */}
                        <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    placeholder="Buscar por Cliente ID o Descripción..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button type="button" className="btn btn-primary" style={{ marginLeft: '2px' }}>
                                    <i className="uil-search"></i>
                                </button>
                            </div>
                        </div>
                        {/* Filtro por tipo */}
                        <div className="col-md-2 mb-2">
                            <div className="input-group">
                                <select className="form-select" value={filterType} onChange={handleFilterTypeChange}>
                                    <option value="cliente_id">Filtrar por Cliente ID</option>
                                    <option value="descripcion">Filtrar por Descripción</option>
                                </select>
                            </div>
                        </div>
                        {/* Filtro por valor */}
                        <div className="col-md-2 mb-2">
                            <div className="input-group">
                                <select className="form-select" value={filterValue} onChange={handleFilterValueChange}>
                                    {filterOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Crear Servicio Financiado Button */}
                        <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <Link to="/servicios-financiados/CrearServicioFinanciado" className="input-daterange input-group btn btn-soft-success waves-effect waves-light">
                                    <i className="mdi mdi-plus me-1"></i> Crear Servicio Financiado
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="table-responsive">
                        <table className="table table-centered table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente ID</th>
                                    <th>Descripción</th>
                                    <th>Monto Servicio</th>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Término</th>
                                    <th>Pago Semanal</th>
                                    <th>Saldo Restante</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentServiciosFinanciados.map((servicio) => (
                                    <tr key={servicio._id}>
                                        <td>{servicio._id}</td>
                                        <td>{servicio.cliente_id}</td>
                                        <td>{servicio.descripcion}</td>
                                        <td>{servicio.monto_servicio}</td>
                                        <td>{new Date(servicio.fecha_inicio).toLocaleDateString()}</td>
                                        <td>{servicio.fecha_termino ? new Date(servicio.fecha_termino).toLocaleDateString() : 'N/A'}</td>
                                        <td>{servicio.pago_semanal}</td>
                                        <td>{servicio.saldo_restante}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => setAlert({ type: "delete", id: servicio._id })}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Paginación */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                        className="btn btn-secondary"
                        onClick={setPreviousPage}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={setNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
            <br />
        </Layout>
    );
};

export default ListaServiciosFinanciados;