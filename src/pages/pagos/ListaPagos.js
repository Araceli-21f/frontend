import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';
import LoadingError from "../../components/LoadingError";
import PagoService from "../../services/PagoService";
import useDateRange from "../../hooks/useDateRange";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ListaPagos = () => {
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [pagos, setPagos] = useState([]);
    const { loading, error, obtenerPagos, eliminarPago } = PagoService();

    // Hook de búsqueda y filtrado
    const {
        searchTerm, filterType, filterValue,
        handleSearchChange, handleFilterTypeChange, handleFilterValueChange
    } = useSearchFilter("metodo_pago");

    // Filtrado combinado (búsqueda + filtro)
    const filteredPagos = pagos.filter((pago) => {
        const referencia = pago.referencia || '';
        const clienteNombre = pago.cliente_id?.nombre || ''; // Asumiendo que cliente_id está poblado
        const matchesSearch =
            referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clienteNombre.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterValue === "Todos" || pago[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });

    // Opciones de filtro dinámicas
    const filterOptions = {
        metodo_pago: ["Todos", ...new Set(pagos.map(pago => pago.metodo_pago))],
        tipo_pago: ["Todos", ...new Set(pagos.map(pago => pago.tipo_pago))]
    };

    // Hook para rangos de fechas
    const { dateRanges, handleDateChange } = useDateRange({ 
        fecha_inicio: "", 
        fecha_fin: "" 
    });

    // Paginación
    const { current: currentPagos, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredPagos, 8);

    // Filtrado por fechas
    const filterByDateRange = (pagos, startDate, endDate) => {
        if (!startDate || !endDate) return pagos;
        return pagos.filter(pago => {
            const pagoDate = new Date(pago.fecha_pago);
            return pagoDate >= new Date(startDate) && pagoDate <= new Date(endDate);
        });
    };

    const handleDateFilter = () => {
        const filteredByDate = filterByDateRange(filteredPagos, dateRanges.fecha_inicio, dateRanges.fecha_fin);
        setPagos(filteredByDate);
    };

    // Obtener pagos al cargar el componente
    useEffect(() => {
        const fetchPagos = async () => {
            try {
                const fetchedPagos = await obtenerPagos();
                setPagos(fetchedPagos);
            } catch (err) {
                console.error("Error al obtener pagos:", err);
            }
        };
        fetchPagos();
    }, [obtenerPagos]);

    // Eliminar pago
    const handleDelete = async (id) => {
        try {
            await eliminarPago(id);
            setPagos(pagos.filter(pago => pago._id !== id));
            setAlert({ type: "warning", action: "delete", entity: "pago" });
            setTimeout(() => setAlert(null), 5000);
        } catch (err) {
            console.error("Error al eliminar pago:", err);
        }
    };

    const handleConfirmDelete = (id) => {
        handleDelete(id);
        setAlert(null);
    };

    const handleCancelDelete = () => {
        setAlert(null);
    };

    // Ver detalles del pago
    const handleView = (id) => {
        const pago = pagos.find(p => p._id === id);
        if (pago) {
            navigate(`/pagos/ver/${id}`);
        } else {
            console.error('Pago no encontrado');
        }
    };

    // Formatear fecha legible
    const formatDate = (date) => {
        return format(new Date(date), "dd MMM yyyy", { locale: es });
    };

    // Formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    return (
        <LoadingError
            loading={loading}
            error={error}
            loadingMessage="Cargando pagos..."
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
                    <h2 className="mb-3"><i className="fa fa-fw fa-credit-card"/> Lista de Pagos</h2>

                    <div className="col-md">
                        <div className="row">
                            {/* Barra de búsqueda */}
                            <div className="col-md-3 mb-2">
                                <div className="input-group shadow-sm">
                                    <input
                                        type="text" 
                                        className="form-control pe-4" 
                                        placeholder="Buscar por referencia o cliente..."
                                        value={searchTerm} 
                                        onChange={handleSearchChange}
                                    />
                                    <button type="button" className="btn btn-primary" style={{ marginLeft: '2px' }}>
                                        <i className="uil-search"></i>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Filtro por tipo/metodo */}
                            <div className="col-md-3 mb-2 d-flex align-items-center">
                                <div className="input-group w-100 shadow-sm">
                                    <span className="me-0 p-2 text-white bg-primary rounded-1 d-flex justify-content-center align-items-center">
                                        <i className="uil-filter fs-6"></i>
                                    </span>
                                    <select 
                                        className="form-select" 
                                        value={filterType} 
                                        onChange={handleFilterTypeChange}
                                    >
                                        <option value="metodo_pago">Método de pago</option>
                                        <option value="tipo_pago">Tipo de pago</option>
                                    </select>
                                    <select 
                                        className="form-select" 
                                        value={filterValue} 
                                        onChange={handleFilterValueChange}
                                    >
                                        {filterOptions[filterType]?.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Filtro por fechas */}
                            <div className="col-md-3 mb-2">
                                <div className="input-daterange input-group shadow-sm">
                                    <input
                                        type="date" 
                                        className="form-control" 
                                        placeholder="Fecha Inicio"
                                        value={dateRanges.fecha_inicio} 
                                        onChange={(e) => handleDateChange("fecha_inicio", e.target.value)}
                                    />
                                    <input
                                        type="date" 
                                        className="form-control" 
                                        placeholder="Fecha Fin"
                                        value={dateRanges.fecha_fin} 
                                        onChange={(e) => handleDateChange("fecha_fin", e.target.value)}    
                                    />
                                    <button
                                        type="button" 
                                        className="btn btn-primary"
                                        style={{ marginLeft: "2px" }} 
                                        onClick={handleDateFilter}
                                    >
                                        <i className="mdi mdi-filter-variant"></i>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Botón crear nuevo pago */}
                            <div className="col-md-3 mb-2">
                                <div className="input-group">
                                    <Link 
                                        to="/Pago/CrearPago" 
                                        className="input-daterange input-group btn btn-outline-success waves-effect waves-light"
                                    >
                                        <i className="mdi mdi-plus me-1"></i> Registrar Pago
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
                                        <th>Referencia</th>
                                        <th>Cliente</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Saldo Pendiente</th>
                                        <th>Tipo</th>
                                        <th>Método</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPagos.map((pago) => (
                                        <tr key={pago._id}>
                                            <td>{pago.referencia || 'N/A'}</td>
                                            <td>{pago.cliente_id?.nombre || 'Cliente no especificado'}</td>
                                            <td>{formatDate(pago.fecha_pago)}</td>
                                            <td className="text-end">{formatCurrency(pago.monto_pago)}</td>
                                            <td className="text-end">{formatCurrency(pago.saldo_pendiente)}</td>
                                            <td>
                                                <span className={`badge ${
                                                    pago.tipo_pago === 'Anticipo' ? 'bg-info-subtle text-info' :
                                                    pago.tipo_pago === 'Abono' ? 'bg-primary-subtle text-primary' :
                                                    'bg-secondary-subtle text-secondary'
                                                }`}>
                                                    {pago.tipo_pago}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${
                                                    pago.metodo_pago === 'Transferencia' ? 'bg-success-subtle text-success' :
                                                    pago.metodo_pago === 'Tarjeta' ? 'bg-warning-subtle text-warning' :
                                                    'bg-light-subtle text-dark'
                                                }`}>
                                                    {pago.metodo_pago}
                                                </span>
                                            </td>
                                            <td>
                                                <BotonesAccion
                                                    id={pago._id}
                                                    entidad="pago"
                                                    onDelete={handleDelete}
                                                    setAlert={setAlert}
                                                    onView={() => handleView(pago._id)}
                                                />
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
                            className="btn btn-secondary shadow-sm"
                            onClick={setPreviousPage}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            className="btn btn-secondary shadow-sm"
                            onClick={setNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
                <br />
            </Layout>
        </LoadingError>
    );
};

export default ListaPagos;