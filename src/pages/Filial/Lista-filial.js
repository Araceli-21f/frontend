import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { Link } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';
import FilialService from "../../services/FilialService";

const ListaFiliales = () => {
    const [alert, setAlert] = useState(null);
    const [filiales, setFiliales] = useState([]);
    const { loading, error, obtenerFiliales, eliminarFilial } = FilialService();

    //Manda un hook de busqueda y filtrar
    const {
        searchTerm, filterType, filterValue,
        handleSearchChange, handleFilterTypeChange, handleFilterValueChange
    } = useSearchFilter("nombre_filial"); // Adjust filterType as needed

    const filteredFiliales = filiales.filter((filial) => {
        const nombre = filial.nombre_filial || '';
        const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterValue === "Todos" || filial[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });

    const filterOptions = ["Todos", ...new Set(filiales.map((filial) => filial[filterType]))];

    //Manda un hook de paginación
    const { current: currentFiliales, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredFiliales, 5);

    useEffect(() => {
        const fetchFiliales = async () => {
            try {
                const fetchedFiliales = await obtenerFiliales();
                setFiliales(fetchedFiliales);
            } catch (err) {
                console.error("Error al obtener filiales:", err);
            }
        };
        fetchFiliales();
    }, [obtenerFiliales]);

    const handleDelete = async (id) => {
        try {
            await eliminarFilial(id);
            setFiliales(filiales.filter(filial => filial._id !== id));
            setAlert({ type: "warning", action: "delete", entity: "filial" });
            setTimeout(() => setAlert(null), 5000);
        } catch (err) {
            console.error("Error al eliminar filial:", err);
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
        return <p>Cargando filiales...</p>;
    }

    if (error) {
        return <p>Error al cargar filiales: {error.message}</p>;
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
                <h2 className="mb-3 ">Lista de Filiales</h2>

                <div className="col-md-10">
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <div className="input-group shadow-sm">
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    placeholder="Buscar Filial..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button type="button" className="btn btn-primary" style={{ marginLeft: '2px' }}>
                                    <i className="uil-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-5 mb-2 d-flex align-items-center">
                            <div className="input-group w-100 shadow-sm">
                                <span className="me-0 p-2 text-white bg-primary rounded-1 d-flex justify-content-center align-items-center">
                                    <i className="uil-filter fs-6"></i>
                                </span>
                                <select className="form-select" value={filterType} onChange={handleFilterTypeChange}>
                                    <option value="nombre_filial">Filtrar por Nombre</option>
                                    <option value="cotizaciones">Filtrar por Cotizaciones</option>
                                </select>
                                <select className="form-select" value={filterValue} onChange={handleFilterValueChange}>
                                    {filterOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 mb-2">
                            <div className="input-group">
                                <Link to="/filiales/CrearFilial" className="input-daterange input-group btn btn-outline-success waves-effect waves-light">
                                    <i className="uil-plus fs-6" /> Crear Filial
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
                                    <th>Nombre Filial</th>
                                    <th>Cotizaciones</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFiliales.map((filial) => (
                                    <tr key={filial._id}>
                                        <td>{filial._id}</td>
                                        <td>{filial.nombre_filial}</td>
                                        <td>{filial.cotizaciones}</td>
                                        <td>
                                            <BotonesAccion
                                                id={filial._id}
                                                entidad="filial"
                                                onDelete={handleDelete}
                                                setAlert={setAlert}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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
    );
};

export default ListaFiliales;