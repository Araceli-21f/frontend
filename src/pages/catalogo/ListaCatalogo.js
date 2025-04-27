import React, { useState, useEffect } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';
import LoadingError from "../../components/LoadingError";
import CatalogoService from "../../services/CatalagoService";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ListaCatalogo = () => {
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const [catalogo, setCatalogo] = useState([]);
    const { 
        loading, 
        error, 
        obtenerCatalogo,
        eliminarProducto,
        cargarCatalogo,
        buscarPorCodigo,
        obtenerPorCategoria
    } = CatalogoService();
    
    // Estado para el modal de importación
    const [showImportModal, setShowImportModal] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importStatus, setImportStatus] = useState('');
    const [importFileName, setImportFileName] = useState('');
    const [importResult, setImportResult] = useState(null);
    const [file, setFile] = useState(null);

    // Hook de búsqueda y filtro
    const {
        searchTerm, filterType, filterValue,
        handleSearchChange, handleFilterTypeChange, handleFilterValueChange
    } = useSearchFilter("categoria");

    const filteredCatalogo = catalogo.filter((producto) => {
        const codigo = producto.codigo || '';
        const nombre = producto.nombre || '';
        const categoria = producto.categoria || '';
        const subcategoria = producto.subcategoria || '';
        const estatus = producto.estatus || '';
        
        const matchesSearch =
            codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subcategoria.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterValue === "Todos" || producto[filterType] === filterValue;
        return matchesSearch && matchesFilter;
    });
    
    const filterOptions = {
        categoria: ["Todos", ...new Set(catalogo.map((producto) => producto.categoria))],
        estatus: ["Todos", "Activo", "Inactivo"],
        seccion: ["Todos", ...new Set(catalogo.map((producto) => producto.seccion))]
    };

    // Hook de paginación
    const { current: currentCatalogo, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredCatalogo, 10);

    // Obtener catálogo
    useEffect(() => {
        const fetchCatalogo = async () => {
            try {
                const fetchedCatalogo = await obtenerCatalogo();
                setCatalogo(fetchedCatalogo);
            } catch (err) {
                console.error("Error al obtener catálogo:", err);
            }
        };
        fetchCatalogo();
    }, [obtenerCatalogo]);

    // Eliminar producto
    const handleDelete = async (id) => {
        try {
            await eliminarProducto(id);
            setCatalogo(catalogo.filter(producto => producto._id !== id));
            setAlert({ type: "warning", action: "delete", entity: "producto" });
            setTimeout(() => setAlert(null), 5000);
        } catch (err) {
            console.error("Error al eliminar producto:", err);
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
        const producto = catalogo.find((p) => p._id === id);
        if (producto) {
            navigate(`/catalogo/ver/${id}`);
        } else {
            console.error('Producto no encontrado');
        }
    };

    // Importar desde Excel con modal de progreso
    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
      
        const formData = new FormData();
        formData.append('file', file); // <<< Nombre debe coincidir con el backend
      
        try {
          const response = await cargarCatalogo(formData); // <<< Envía FormData
          
          if (response.error) {
            throw new Error(response.error);
          }
      
          // Actualiza el estado con la respuesta
          setImportResult({
            success: true,
            imported: response.imported,
            message: response.message
          });
      
        } catch (error) {
          console.error("Error completo:", {
            message: error.message,
            response: error.response?.data
          });
      
          setImportResult({
            success: false,
            message: "Error en el servidor",
            details: error.response?.data?.error || error.message,
            status: error.response?.status
          });
        }
      };

    // Exportar a Excel
    const handleExport = () => {
        const dataToExport = filteredCatalogo.map(producto => ({
            'Código Smart': producto.codigo,
            'Descripción': producto.nombre,
            'Código Tienda': producto.codigoTienda,
            'Categoría': producto.categoria,
            'Subcategoría': producto.subcategoria,
            'Precio Compra': producto.precioCompra,
            'Precio Sin Financiamiento': producto.precioSinFinanciamiento,
            'Precio Con Financiamiento': producto.precioConFinanciamiento,
            'Sección': producto.seccion,
            'Estatus': producto.estatus,
            'Fecha Creación': producto.fechaCreacion,
            'Fecha Modificación': producto.fechaModificacion
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Catálogo");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Catalogo_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // Cerrar modal de importación
    const handleCloseImportModal = () => {
        setShowImportModal(false);
        setImportProgress(0);
        setImportStatus('');
        setImportFileName('');
        setImportResult(null);
        setFile(null);
    };

    // Obtener texto del estado de importación
    const getImportStatusText = () => {
        const statusMessages = {
            'preparing': 'Preparando importación...',
            'reading': 'Leyendo archivo Excel...',
            'processing': 'Procesando datos...',
            'uploading': 'Subiendo datos al servidor...',
            'done': '¡Importación completada con éxito!',
            'error': 'Error en el proceso de importación'
        };
        
        return statusMessages[importStatus] || 'Procesando...';
    };

    return (
        <LoadingError
            loading={loading}
            error={error}
            loadingMessage="Cargando catálogo..."
            errorMessage={error?.message}
        >
            <Layout>
                {alert && (
                    <AlertComponent
                        type={alert.type}
                        action={alert.action}
                        entity={alert.entity}
                        message={alert.message}
                        onConfirm={() => handleConfirmDelete(alert.id)}
                        onCancel={handleCancelDelete}
                    />
                )}
                
                {/* Modal de Importación */}
                <Modal show={showImportModal} onHide={handleCloseImportModal} centered size="lg">
                    <Modal.Header closeButton className={importStatus === 'error' ? 'bg-danger text-white' : ''}>
                        <Modal.Title>
                            {importStatus === 'error' ? (
                                <><i className="mdi mdi-alert-circle-outline me-2"></i>Error en Importación</>
                            ) : (
                                <>Importar Catálogo</>
                            )}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center mb-3">
                            <div className="import-status-icon">
                                {importStatus === 'done' ? (
                                    <i className="mdi mdi-check-circle-outline display-4 text-success"></i>
                                ) : importStatus === 'error' ? (
                                    <i className="mdi mdi-alert-circle-outline display-4 text-danger"></i>
                                ) : (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                )}
                            </div>
                            <h5 className="mt-3">{getImportStatusText()}</h5>
                            {importFileName && (
                                <div className="file-info">
                                    <i className="mdi mdi-file-excel-outline me-1"></i>
                                    <span className="text-muted">{importFileName}</span>
                                    {file?.size && (
                                        <small className="d-block text-muted">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </small>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <ProgressBar 
                            now={importProgress} 
                            label={`${importProgress}%`} 
                            variant={
                                importStatus === 'done' ? 'success' : 
                                importStatus === 'error' ? 'danger' : 'primary'
                            }
                            animated={importStatus !== 'done' && importStatus !== 'error'}
                            striped
                            className="mb-3"
                        />
                        
                        {importResult && (
                            <div className={`alert alert-${importResult.success ? 'success' : 'danger'} mb-0`}>
                                <div className="d-flex align-items-start">
                                    <i className={`mdi mdi-${importResult.success ? 'check-circle' : 'alert-circle'} me-2 mt-1`}></i>
                                    <div>
                                        <h6 className="alert-heading">{importResult.message}</h6>
                                        
                                        {importResult.success ? (
                                            <div className="mt-2">
                                                <div className="import-summary">
                                                    <div className="summary-item">
                                                        <span className="summary-label">Total procesados:</span>
                                                        <span className="summary-value">{importResult.total}</span>
                                                    </div>
                                                    <div className="summary-item">
                                                        <span className="summary-label">Importados:</span>
                                                        <span className="summary-value text-success">{importResult.imported}</span>
                                                    </div>
                                                    {importResult.skipped > 0 && (
                                                        <div className="summary-item">
                                                            <span className="summary-label">Omitidos:</span>
                                                            <span className="summary-value text-warning">{importResult.skipped}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="error-details mt-2">
                                                <p>{importResult.details}</p>
                                                
                                                {importResult.errorType === 'processing' && (
                                                    <div className="solution-box">
                                                        <h6>Solución sugerida:</h6>
                                                        <ul>
                                                            <li>Asegúrese que el archivo tenga las columnas requeridas</li>
                                                            <li>Verifique que no haya filas vacías</li>
                                                            <li>Compruebe que los formatos de datos sean correctos</li>
                                                        </ul>
                                                    </div>
                                                )}
                                                
                                                {importResult.technicalDetails && (
                                                    <details className="technical-details mt-2">
                                                        <summary>Detalles técnicos</summary>
                                                        <pre>{importResult.technicalDetails}</pre>
                                                    </details>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        {importStatus === 'error' ? (
                            <>
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={handleCloseImportModal}
                                >
                                    <i className="mdi mdi-close me-1"></i> Cerrar
                                </button>
                                <div>
                                    <label className="btn btn-primary me-2">
                                        <i className="mdi mdi-file-upload me-1"></i> Nuevo Archivo
                                        <input 
                                            type="file" 
                                            style={{ display: 'none' }} 
                                            accept=".xlsx, .xls, .csv" 
                                            onChange={handleImport}
                                        />
                                    </label>
                                    <button className="btn btn-outline-primary">
                                        <i className="mdi mdi-download me-1"></i> Descargar Plantilla
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button 
                                className="btn btn-primary" 
                                onClick={handleCloseImportModal}
                                disabled={importStatus !== 'done' && importStatus !== 'error'}
                            >
                                {importStatus === 'done' ? (
                                    <><i className="mdi mdi-check me-1"></i> Aceptar</>
                                ) : (
                                    <><i className="mdi mdi-close me-1"></i> Cancelar</>
                                )}
                            </button>
                        )}
                    </Modal.Footer>
                </Modal>

                <div className="card p-3">
                    <h2 className="mb-3">Lista de Catálogo</h2>

                    <div className="col-md">
                        <div className="row">
                            {/* Barra de búsqueda */}
                            <div className="col-md-3 mb-2">
                                <div className="input-group shadow-sm">
                                    <input
                                        type="text" className="form-control pe-4" placeholder="Buscar Producto..."
                                        value={searchTerm} onChange={handleSearchChange}
                                    />
                                    <button type="button" className="btn btn-purple" style={{ marginLeft: '2px' }}>
                                        <i className="uil-search"></i>
                                    </button>
                                </div>
                            </div>
                            {/* Filtro */}
                            <div className="col-md-3 mb-2 d-flex align-items-center">
                                <div className="input-group w-100 shadow-sm">
                                    <span className="me-0 p-2 text-white bg-purple rounded-1 d-flex justify-content-center align-items-center">
                                        <i className="uil-filter fs-6"></i>
                                    </span>
                                    <select className="form-select" value={filterType} onChange={handleFilterTypeChange}>
                                        <option value="categoria">Categoría</option>
                                        <option value="estatus">Estatus</option>
                                        <option value="seccion">Sección</option>
                                    </select>
                                    <select className="form-select" value={filterValue} onChange={handleFilterValueChange}>
                                        {filterOptions[filterType]?.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Botones de Importar/Exportar */}
                            <div className="col-md-3 mb-2">
                                <div className="btn-group w-100">
                                    <label className="btn btn-outline-primary">
                                        <i className="mdi mdi-upload me-1"></i> Importar
                                        <input 
                                            type="file" 
                                            style={{ display: 'none' }} 
                                            accept=".xlsx, .xls, .csv" 
                                            onChange={handleImport}
                                        />
                                    </label>
                                    <button 
                                        className="btn btn-outline-success" 
                                        onClick={handleExport}
                                    >
                                        <i className="mdi mdi-download me-1"></i> Exportar
                                    </button>
                                </div>
                            </div>
                            {/* Crear producto Button */}
                            <div className="col-md-3 mb-2">
                                <div className="input-group">
                                    <Link to="/Catalogo/CrearCatalogo" className="input-daterange input-group btn btn-outline-success waves-effect waves-light">
                                        <i className="mdi mdi-plus me-1"></i> Crear Producto
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
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Subcategoría</th>
                                        <th>Precio Sin Fin.</th>
                                        <th>Precio Con Fin.</th>
                                        <th>Estatus</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentCatalogo.map((producto) => (
                                        <tr key={producto._id}>
                                            <td>{producto.codigo}</td>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.categoria}</td>
                                            <td>{producto.subcategoria}</td>
                                            <td>${producto.precioSinFinanciamiento?.toFixed(2)}</td>
                                            <td>${producto.precioConFinanciamiento?.toFixed(2)}</td>
                                            <td>
                                                <span className={`badge ${producto.estatus === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                                    {producto.estatus}
                                                </span>
                                            </td>
                                            <td>
                                                <BotonesAccion
                                                    id={producto._id}
                                                    entidad="producto"
                                                    onDelete={handleDelete}
                                                    setAlert={setAlert}
                                                    onView={() => handleView(producto._id)}
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

export default ListaCatalogo;