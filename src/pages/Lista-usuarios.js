import React, { useState } from "react";
import Layout from "../layouts/pages/layout";

const Lista_usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("rol");
  const [filterValue, setFilterValue] = useState("Todos");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const usuarios = [
    { id: "#US001", nombre: "Admin", email: "admin@example.com", rol: "Administrador", area: "Sistemas", accesoNomina: true },
    { id: "#US002", nombre: "Usuario 1", email: "usuario1@example.com", rol: "Empleado", area: "Ventas", accesoNomina: false },
    { id: "#US003", nombre: "Usuario 2", email: "usuario2@example.com", rol: "Recursos Humanos", area: "Recursos Humanos", accesoNomina: true },
    { id: "#US004", nombre: "Usuario 3", email: "usuario3@example.com", rol: "Empleado", area: "Desarrollo", accesoNomina: false },
    { id: "#US005", nombre: "Usuario 4", email: "usuario4@example.com", rol: "Administrador", area: "Finanzas", accesoNomina: true },
  ];

  const options = ["Todos", ...new Set(usuarios.map((usuario) => usuario[filterType]))];

  const filteredUsuarios = usuarios.filter((usuario) =>
    (filterValue === "Todos" || usuario[filterType] === filterValue) &&
    (usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || usuario.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filterType} onChange={(e) => { setFilterType(e.target.value); setFilterValue("Todos"); }}>
                <option value="rol">Filtrar por Rol</option>
                <option value="area">Filtrar por Área</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn-success align-self-center">Crear Usuario</button>
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
              <tr
                key={usuario.id}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.area}</td>
                <td>{usuario.accesoNomina ? "Sí" : "No"}</td>
                <td>
                  <div style={{ visibility: hoveredRow === index ? "visible" : "hidden" }}>
                    <button className="btn btn-sm btn-info me-1" title="Ver">
                      <i className="uil uil-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-primary me-1" title="Editar">
                      <i className="uil uil-pen"></i>
                    </button>
                    <button className="btn btn-sm btn-danger" title="Eliminar">
                      <i className="uil uil-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </Layout>
  );
};

export default Lista_usuarios;
