import React, { useState, useEffect, useRef } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';
import LoadingError from "../../components/LoadingError";
import CatalogoService from "../../services/CatalagoService";
import { Modal, Button } from "react-bootstrap";

const ListaCatalogo = () => {
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const fileInputRef = useRef(null);
    const [importMode, setImportMode] = useState('actualizar');
    const [isImporting, setIsImporting] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    const {  loading, error, obtenerProductos, eliminarProducto, exportarExcel, importarExcel } = CatalogoService();

    // Hook de búsqueda y filtro
    const { searchTerm, filterType, filterValue, handleSearchChange, handleFilterTypeChange, handleFilterValueChange } = useSearchFilter("categoria");

    const filteredProductos = productos.filter((producto) => {
        const codigo = producto.codigo || '';
        const nombre = producto.nombre || '';
        const descripcion = producto.descripcion || '';
        const categoria = producto.categoria || '';
        const id = producto._id || '';
        
        const matchesSearch =
            codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterValue === "Todos" || producto[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });
    
    const filterOptions = ["Todos", ...new Set(productos.map((producto) => producto[filterType]))];

    // Hook de paginación
    const { current: currentProductos, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredProductos, 10);

    // Obtener productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const fetchedProductos = await obtenerProductos();
                setProductos(fetchedProductos);
            } catch (err) {
                console.error("Error al obtener productos:", err);
            }
        };
        fetchProductos();
    }, [obtenerProductos]);

    // Eliminar producto
    const handleDelete = async (id) => {
        try {
            await eliminarProducto(id);
            setProductos(productos.filter(producto => producto._id !== id));
            setAlert({ 
                type: "warning", 
                action: "delete", 
                entity: "producto",
                autoClose: true
            });
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            setAlert({
                type: "error",
                message: "Error al eliminar el producto",
                autoClose: true
            });
        }
    };

    const handleConfirmDelete = (id) => {
        handleDelete(id);
        setAlert(null);
    };

    const handleCancelDelete = () => {
        setAlert(null);
    };

    const handleView = (id) => {
        const producto = productos.find((p) => p._id === id);
        if (producto) {
            navigate(`/catalogo/ver/${id}`);
        } else {
            console.error('Producto no encontrado');
            setAlert({
                type: "error",
                message: "Producto no encontrado",
                autoClose: true
            });
        }
    };

    const handleStatusChange = async (id, nuevoEstado) => {
        try {
            await CatalogoService.actualizarProducto(id, { activo: nuevoEstado });
            setProductos(productos.map(p => 
                p._id === id ? { ...p, activo: nuevoEstado } : p
            ));
            setAlert({
                type: "success",
                message: `Producto ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`,
                autoClose: true
            });
        } catch (err) {
            console.error("Error al cambiar estado del producto:", err);
            setAlert({
                type: "error",
                message: "Error al cambiar estado del producto",
                autoClose: true
            });
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await exportarExcel();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `catalogo_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            setAlert({ 
                type: "success", 
                message: "Catálogo exportado exitosamente",
                autoClose: true
            });
        } catch (error) {
            setAlert({ 
                type: "error", 
                message: error.response?.data?.error || "Error al exportar el catálogo",
                autoClose: true
            });
        }
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const result = await importarExcel(file, importMode);
            // Recargar los productos después de importar
            const fetchedProductos = await obtenerProductos();
            setProductos(fetchedProductos);
            
            setAlert({
                type: "success",
                message: `Importación exitosa: ${result.count} productos procesados (Modo: ${importMode})`,
                autoClose: true
            });
        } catch (error) {
            setAlert({
                type: "error",
                message: error.response?.data?.error || "Error al importar el archivo",
                details: error.response?.data?.details,
                autoClose: true
            });
        } finally {
            setIsImporting(false);
            // Limpiar el input para permitir volver a subir el mismo archivo
            e.target.value = '';
        }
    };

    return (
        <LoadingError
            loading={loading || isImporting}
            error={error}
            loadingMessage={isImporting ? "Importando productos..." : "Cargando catálogo..."}
            errorMessage={error?.message}
        >
             <Layout>
                {alert && (
                    <AlertComponent
                        type={alert.type}
                        message={alert.message}
                        action={alert.action}
                        entity={alert.entity}
                        onConfirm={() => handleConfirmDelete(alert.id)}
                        onCancel={handleCancelDelete}
                        autoClose={alert.autoClose}
                        onClose={() => setAlert(null)}
                    />
                )}

                {/* Modal para selección de modo de importación */}
                <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Opciones de Importación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Seleccione el modo de importación:</label>
                            <select 
                                className="form-select"
                                value={importMode}
                                onChange={(e) => setImportMode(e.target.value)}
                            >
                                <option value="actualizar">Actualizar existentes</option>
                                <option value="anadir">Añadir nuevos</option>
                                <option value="sobrescribir">Sobrescribir todo</option>
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowImportModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={() => {
                            setShowImportModal(false);
                            fileInputRef.current.click();
                        }}>
                            Continuar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className="card p-3">
                    <h2 className="mb-3 "> Lista Catalogo</h2>

                    {/* Fila compacta con todos los controles */}
                    <div className="row mb-4 g-2 align-items-center">
                        {/* Búsqueda (20%) */}
                        <div className="col-md-2">
                            <div className="input-group shadow-sm">
                                <input
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Buscar..."
                                    value={searchTerm} 
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-purple" type="button">
                                    <i className="uil-search"></i>
                                </button>
                            </div>
                        </div>

                        {/* Filtros (25%) */}
                        <div className="col-md-5">
                            <div className="input-group shadow-sm">
                                <span className="input-group-text bg-purple text-white">
                                    <i className="uil-filter"></i>
                                </span>
                                <select 
                                    className="form-select" 
                                    value={filterType} 
                                    onChange={handleFilterTypeChange}
                                >
                                    <option value="categoria">Categoría</option>
                                    <option value="activo">Estado</option>
                                </select>
                                <select 
                                    className="form-select" 
                                    value={filterValue} 
                                    onChange={handleFilterValueChange}
                                >
                                    {filterOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Acciones (55%) */}
                        <div className="col-md-5">
                            <div className="d-flex justify-content-end align-items-center gap-2">
                                {/* Botón Exportar */}
                                <button
                                    className="btn btn-outline-success"
                                    onClick={handleExportExcel}
                                    disabled={loading || productos.length === 0}
                                >
                                    <i className="mdi mdi-file-export me-1"></i> Exportar
                                </button>

                                {/* Botón Importar */}
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setShowImportModal(true)}
                                    disabled={loading}
                                >
                                    <i className="mdi mdi-file-import me-1"></i> Importar
                                </button>

                                {/* Botón Nuevo Producto */}
                                <Link 
                                    to="/Catalogo/CrearCatalogo"
                                    className="btn btn-outline-success"
                                >
                                    <i className="mdi mdi-plus me-1"></i> Nuevo
                                </Link>
                            </div>
                        </div>

                        {/* Input file oculto */}
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xlsx,.xls"
                            style={{ display: 'none' }}
                        />
                    </div>
                    {/* Tabla de productos */}
                    <div className="table-responsive shadow-sm">
                        <table className="table table-centered table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProductos.map((producto) => (
                                    <tr key={producto._id}>
                                        <td>{producto.codigo}</td>
                                        <td>{producto.nombre}</td>
                                        <td>${producto.precio.toFixed(2)}</td>
                                        <td>{producto.categoria}</td>
                                        <td>
                                            <span className={`badge ${producto.activo ? 'bg-success' : 'bg-danger'}`}>
                                                {producto.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <BotonesAccion
                                                id={producto._id}
                                                entidad="producto"
                                                onDelete={handleDelete}
                                                setAlert={setAlert}
                                                onView={() => handleView(producto._id)}
                                                customButtons={[
                                                    {
                                                        icon: producto.activo ? 'mdi-eye-off' : 'mdi-eye',
                                                        color: producto.activo ? 'warning' : 'success',
                                                        tooltip: producto.activo ? 'Desactivar' : 'Activar',
                                                        onClick: () => handleStatusChange(producto._id, !producto.activo)
                                                    }
                                                ]}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                            className="btn btn-secondary shadow-sm"
                            onClick={setPreviousPage}
                            disabled={currentPage === 1}
                        >
                            {/*<i className="uil uil-arrow-left me-1"/> */}Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            className="btn btn-secondary shadow-sm"
                            onClick={setNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente {/*<i className="uil uil-arrow-right me-1"*/}
                        </button>
                    </div>
                </div>
            </Layout>
        </LoadingError>
    );
};

export default ListaCatalogo;