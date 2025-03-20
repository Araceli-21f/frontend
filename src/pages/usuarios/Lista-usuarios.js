import React, {useState} from "react";
import Layout from "../../layouts/pages/layout";
import { Link} from "react-router-dom";
import useSearchFilter from "../../hooks/Usuarios/useSearchFilter";
import usePagination from "../../hooks/Usuarios/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';



const Lista_usuarios = () => {
  const { searchTerm, filterType, filterValue, handleSearchChange, handleFilterTypeChange, handleFilterValueChange } = useSearchFilter();
  const [alert, setAlert] = useState(null);
  
  const [users , setuser] = useState([
    { id: "1", nombre: "Admin", email: "admin@example.com", rol: "Administrador", area: "Sistemas", accesoNomina: true },
    { id: "2", nombre: "Usuario 1", email: "usuario1@example.com", rol: "Empleado", area: "Ventas", accesoNomina: false },
    { id: "3", nombre: "Usuario 2", email: "usuario2@example.com", rol: "Recursos Humanos", area: "Recursos Humanos", accesoNomina: true },
    { id: "4", nombre: "Usuario 3", email: "usuario3@example.com", rol: "Empleado", area: "Desarrollo", accesoNomina: false },
    { id: "5", nombre: "Usuario 4", email: "usuario4@example.com", rol: "Administrador", area: "Finanzas", accesoNomina:true },
  ]);

  // Filtra los usuarios según el término de búsqueda y el valor de filtro.
  const filteredusers = users.filter((user) =>
    (filterValue === "Todos" || user[filterType] === filterValue) &&
    (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || user.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Usa el hook de paginación.
  const { currentusers, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredusers, 5);
  const options = ["Todos", ...new Set(users.map((user) => user[filterType]))];


  //Eliminar al usuario
  const handleDelete = (id) => {
    setuser(prevusers => prevusers.filter(user => user.id !== id));
    setAlert({ type: "success", action: "delete", entity: "usuario" });
    setTimeout(() => setAlert(null), 5000);
  };
  //confirmar la eliminacion
  const handleConfirmDelete = (id) => {
    handleDelete(id);
    setAlert(null);
  };
  //Cancelar la confirmacion de la eliminacion
  const handleCancelDelete = () => {
    setAlert(null);
  };


  return (
    <Layout>
      {/*Manda la alerta como un modal*/}
   {alert && (
        <AlertComponent
          type={alert.type}
          action={alert.action}
          entity={alert.entity}
          onConfirm={() => handleConfirmDelete(alert.id)}
          onCancel={handleCancelDelete}
        />
      )}
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
            {currentusers.map((user, index) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>{user.area}</td>
                <td>{user.accesoNomina ? "Sí" : "No"}</td>
                <td>
                <BotonesAccion id={user.id} entidad="usuario" onDelete={handleDelete} setAlert={setAlert} /> {/* Aquí usas el componente BotonesAccion */}

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
