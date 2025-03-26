import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate } from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from "../../components/AlertasComponent";
import useDateRange from "../../hooks/useDateRange";

const ListaCampana = () => {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  // Datos de ejemplo de campañas (simulando el esquema campanaSchema)
  const [campanas, setcampana] = useState([
    { id: "1", nombre: "Campaña de Diseño Web", descripcion: "Campaña para promocionar servicios de diseño web.", fecha_inicio: "2024-03-01", fecha_fin: "2024-03-31", estado: "completada", clientes: ["cliente1", "cliente2"] },
    { id: "2", nombre: "Campaña de Publicidad Digital", descripcion: "Campaña para servicios de publicidad en línea.", fecha_inicio: "2024-04-01", fecha_fin: "2024-04-30", estado: "inactiva", clientes: ["cliente3", "cliente4", "cliente1"] },
    { id: "3", nombre: "Campaña de SEO", descripcion: "Campaña para servicios de optimización de motores de búsqueda.", fecha_inicio: "2024-06-01", fecha_fin: "2024-06-30", estado: "activa", clientes: ["cliente4"] }
  ]);

  // --- Usa un hook --- Filtra los usuarios según el término de búsqueda y el valor de filtro.
  const {
    searchTerm, filterType, filterValue,
    handleSearchChange, handleFilterTypeChange, handleFilterValueChange
  } = useSearchFilter("id");

  const filteredcampana = campanas.filter((campana) => {
    const matchesSearch =
      campana.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campana.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campana.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "Todos" || campana[filterType] === filterValue;
    return matchesSearch && matchesFilter;
  });

  //generamos opciones dinamicamente sin repetir
  const filterOptions = ["Todos", ...new Set(campanas.map((campana) => campana[filterType]))];

  // Usar el hook para las fechas
  const { dateRanges, handleDateChange } = useDateRange({
    fecha_inicio: "",
    fecha_fin: "",
  });

  // --- Usa el hook de paginación.
  const { current: currentcampanas, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredcampana, 5);

  // Filtrado por fechas
  const filterByDateRange = (campanas, startDate, endDate) => {
    if (!startDate || !endDate) return campanas; // Si no hay fechas, retorna todas las campañas
    return campanas.filter(campana => {
      const campanaStartDate = new Date(campana.fecha_inicio);
      const campanaEndDate = new Date(campana.fecha_fin);
      return campanaStartDate >= new Date(startDate) && campanaEndDate <= new Date(endDate);
    });
  };

  // Aplicar filtro de fechas al hacer clic en el botón
  const handleDateFilter = () => {
    const filteredByDate = filterByDateRange(filteredcampana, dateRanges.fecha_inicio, dateRanges.fecha_fin);
    setcampana(filteredByDate); // Actualizar el estado de las campañas con el filtrado de fechas
  };

  // Eliminar al campana
  const handleDelete = (id) => {
    setcampana(prevcampanas => prevcampanas.filter(campana => campana.id !== id));
    setAlert({ type: "success", action: "delete", entity: "campana" });
    setTimeout(() => setAlert(null), 5000);
  };

  // Confirmar la eliminación
  const handleConfirmDelete = (id) => {
    handleDelete(id);
    setAlert(null);
  };

  // Cancelar la confirmación de la eliminación
  const handleCancelDelete = () => {
    setAlert(null);
  };

  // Función para iniciar el borrado con confirmación
  const iniciarBorrado = (id) => {
    setAlert({
      type: "confirm",
      action: "delete",
      entity: "campana",
      id: id,
    });
  };

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
        <h2 className="mb-3"><i className="fa fa-fw fa-bars"/> Lista de campanas</h2>
        
        <div className="col-md">
          <div className="row">
            {/* Barra de búsqueda (4 columnas) */}
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar  ..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button type="button" className="btn btn-primary" style={{ marginLeft: '2px' }}>
                  <i className="uil-search"></i>
                </button>
              </div>
            </div>
            {/* Filtro por fechas (2 columnas) */}
            <div className="col-md-5 mb-2">
              <div className="input-daterange input-group">
                <input
                  type="date"
                  className="form-control"
                  value={dateRanges.fecha_inicio}
                  onChange={(e) => handleDateChange("fecha_inicio", e.target.value)}
                />
                <input
                  type="date"
                  className="form-control"
                  value={dateRanges.fecha_fin}
                  onChange={(e) => handleDateChange("fecha_fin", e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ marginLeft: "2px" }} 
                  onClick={handleDateFilter}
                >
                  <i className="mdi mdi-filter-variant"></i> Filtrar
                </button>
              </div>
            </div>
            {/* Crear campaña Button (4 columnas) */}
            <div className="col-md-4 mb-2">
              <div className="input-group">
                <Link to="/Campaña/CrearCampana" className="input-daterange input-group btn btn-soft-success waves-effect waves-light">
                  <i className="mdi mdi-plus me-1"></i> Crear campana
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
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentcampanas.map((campana) => (                      
                  <tr key={campana.id}>
                    <td>{campana.id}</td>
                    <td>{campana.nombre}</td>
                    <td>{campana.descripcion}</td>
                    <td>{campana.fecha_inicio}</td>
                    <td>{campana.fecha_fin}</td>
                    <td>
                      <div className={`badge ${campana.estado === "completada" ? "bg-success-subtle text-success" : campana.estado === "activa" ? "bg-warning-subtle text-warning" : "bg-secondary-subtle text-secondary"} font-size-12`}>
                        {campana.estado}
                      </div>
                    </td>
                    <td>
                      {/* Aquí usas el componente BotonesAccion */}
                      <BotonesAccion 
                        id={campana.id} 
                        entidad="campana" 
                        onDelete={() => iniciarBorrado(campana.id)} 
                        setAlert={setAlert} 

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
      <br/>
    </Layout>
  );
};

export default ListaCampana;
