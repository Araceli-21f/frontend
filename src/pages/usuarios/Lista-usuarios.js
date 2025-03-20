import React from "react";
import Layout from "../../layouts/pages/layout";
import { Link } from "react-router-dom";
import useSearchFilter from "../../hooks/Usuarios/useSearchFilter";
import usePagination from "../../hooks/Usuarios/usePagination";
import BotonesAccion from "../../components/BotonesAccion";


const Lista_usuarios = () => {
  const { searchTerm, filterType, filterValue, handleSearchChange, handleFilterTypeChange, handleFilterValueChange } = useSearchFilter();

  const usuarios = [
    { id: "1", nombre: "Admin", email: "admin@example.com", rol: "Administrador", area: "Sistemas", accesoNomina: true },
    { id: "2", nombre: "Usuario 1", email: "usuario1@example.com", rol: "Empleado", area: "Ventas", accesoNomina: false },
    { id: "3", nombre: "Usuario 2", email: "usuario2@example.com", rol: "Recursos Humanos", area: "Recursos Humanos", accesoNomina: true },
    { id: "4", nombre: "Usuario 3", email: "usuario3@example.com", rol: "Empleado", area: "Desarrollo", accesoNomina: false },
    { id: "5", nombre: "Usuario 4", email: "usuario4@example.com", rol: "Administrador", area: "Finanzas", accesoNomina:true },
  ];

  // Filtra los usuarios según el término de búsqueda y el valor de filtro.
  const filteredUsuarios = usuarios.filter((usuario) =>
    (filterValue === "Todos" || usuario[filterType] === filterValue) &&
    (usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || usuario.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Usa el hook de paginación.
  const { currentUsers, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredUsuarios, 5);

  const options = ["Todos", ...new Set(usuarios.map((usuario) => usuario[filterType]))];

  return (
    <Layout>
      <div className="bg-white p-3 mb-3 rounded">
        <h2 className="mb-3">Lista de Usuarios</h2>
        <div className="d-flex justify-content-between mb-3">
          <div className="row w-75">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filterType} onChange={handleFilterTypeChange}>
                <option value="rol">Filtrar por Rol</option>
                <option value="area">Filtrar por Área</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filterValue} onChange={handleFilterValueChange}>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <Link to="/usuarios/Agregar-usuarios" className="btn btn-success align-self-center">
            <i className="mdi mdi-plus me-1"></i> Crear Usuario
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Área</th>
              <th>Acceso a Nómina</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((usuario, index) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.area}</td>
                <td>{usuario.accesoNomina ? "Sí" : "No"}</td>
                <td>
                <BotonesAccion id={usuario.id} entidad="usuario"/> {/* Aquí usas el componente BotonesAccion */}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </Layout>
  );
};

export default Lista_usuarios;
