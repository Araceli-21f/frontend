import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import AlertComponent from '../../components/AlertasComponent';
import LoadingError from "../../components/LoadingError";
import EstadoCuentaService from "../../services/EstadoCuentaService";

const ListaEstadoCuenta = () => {
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [estadosCuenta, setEstadosCuenta] = useState([]);
    const { loading, error, obtenerEstadosCuenta, eliminarEstadoCuenta } = EstadoCuentaService();

    // Hook de búsqueda y filtrado
    const {
        searchTerm, filterType, filterValue,
        handleSearchChange, handleFilterTypeChange, handleFilterValueChange
    } = useSearchFilter("");

    const filteredEstadosCuenta = estadosCuenta.filter((estadoCuenta) => {
        const clienteId = estadoCuenta.cliente_id?.toString() || '';
        const matchesSearch = clienteId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterValue === "Todos" || estadoCuenta[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });

    const filterOptions = ["Todos", ...new Set(estadosCuenta.map((estadoCuenta) => estadoCuenta[filterType]))];

    // Hook de paginación
    const { current: currentEstadosCuenta, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredEstadosCuenta, 5);

    useEffect(() => {
        const fetchEstadosCuenta = async () => {
            try {
                const fetchedEstadosCuenta = await obtenerEstadosCuenta();
                setEstadosCuenta(fetchedEstadosCuenta);
            } catch (err) {
                console.error("Error al obtener Estados de Cuenta:", err);
            }
        };
        fetchEstadosCuenta();
    }, [obtenerEstadosCuenta]);

    const handleDelete = async (id) => {
        try {
            await eliminarEstadoCuenta(id);
            setEstadosCuenta(estadosCuenta.filter(estadoCuenta => estadoCuenta._id !== id));
            setAlert({ type: "success", action: "delete", entity: "Estado de Cuenta" });
            setTimeout(() => setAlert(null), 5000);
        } catch (err) {
            console.error("Error al eliminar Estado de Cuenta:", err);
        }
    };

    const handleConfirmDelete = (id) => {
        handleDelete(id);
        setAlert(null);
    };

    const handleCancelDelete = () => {
        setAlert(null);
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
                    type={alert.type}
                    action={alert.action}
                    entity={alert.entity}
                    onConfirm={() => handleConfirmDelete(alert.id)}
                    onCancel={handleCancelDelete}
                />
            )}
            <div className="card p-3">
                <h2 className="mb-3"><i className="fa fa-fw fa-bars" /> Lista de Estados de Cuenta</h2>

                <div className="col-md-10">
                    <div className="row">
                        {/* Barra de búsqueda */}
                        <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    placeholder="Buscar por Cliente ID..."
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
                                    <option value="servicio_id">Filtrar por Servicio ID</option>
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
                        {/* Crear Estado de Cuenta Button */}
                        <div className="col-md-4 mb-2">
                            <div className="input-group">
                                <Link to="/estados-cuenta/CrearEstadoCuenta" className="input-daterange input-group btn btn-soft-success waves-effect waves-light">
                                    <i className="mdi mdi-plus me-1"></i> Crear Estado de Cuenta
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
                                    <th>Servicio ID</th>
                                    <th>Fecha Estado</th>
                                    <th>Saldo Inicial</th>
                                    <th>Pago Total</th>
                                    <th>Saldo Actual</th>
                                    <th>Pago Semanal</th>
                                    <th>Total a Pagar</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEstadosCuenta.map((estadoCuenta) => (
                                    <tr key={estadoCuenta._id}>
                                        <td>{estadoCuenta._id}</td>
                                        <td>{estadoCuenta.cliente_id}</td>
                                        <td>{estadoCuenta.servicio_id}</td>
                                        <td>{new Date(estadoCuenta.fecha_estado).toLocaleDateString()}</td>
                                        <td>{estadoCuenta.saldo_inicial}</td>
                                        <td>{estadoCuenta.pago_total}</td>
                                        <td>{estadoCuenta.saldo_actual}</td>
                                        <td>{estadoCuenta.pago_semanal}</td>
                                        <td>{estadoCuenta.total_a_pagar}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => setAlert({ type: "delete", id: estadoCuenta._id })}>Eliminar</button>
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
                        onClick={setPreviousPage} disabled={currentPage === 1}>
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={setNextPage} disabled={currentPage === totalPages}>
                        Siguiente
                    </button>
                </div>
            </div>
            <br />
        </Layout>
        </LoadingError>
    );
};

export default ListaEstadoCuenta;