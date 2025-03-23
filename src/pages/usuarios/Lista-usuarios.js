import React, {useState} from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate} from "react-router-dom";
import useSearchFilter from "../../hooks/useSearchFilter";
import usePagination from "../../hooks/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from '../../components/AlertasComponent';



const Lista_usuarios = () => {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  //ejemplo de los datos
  const [users , setuser] = useState([
    { id: "1", nombre: "Admin", email: "admin@example.com", rol: "Administrador", area: "Sistemas", accesoNomina: true },
    { id: "2", nombre: "Usuario 1", email: "usuario1@example.com", rol: "Empleado", area: "Ventas", accesoNomina: false },
    { id: "3", nombre: "Usuario 2", email: "usuario2@example.com", rol: "Recursos Humanos", area: "Recursos Humanos", accesoNomina: true },
    { id: "4", nombre: "Usuario 3", email: "usuario3@example.com", rol: "Empleado", area: "Desarrollo", accesoNomina: false },
    { id: "5", nombre: "Usuario 4", email: "usuario4@example.com", rol: "Administrador", area: "Finanzas", accesoNomina:true },
  ]);

  // --- Usa un hook --- Filtra los usuarios según el término de búsqueda y el valor de filtro.
  const {
    searchTerm, filterType, filterValue,
    handleSearchChange, handleFilterTypeChange, handleFilterValueChange
  } = useSearchFilter("id");

  const filteredUsuarios = users.filter((user) => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "Todos" || user[filterType] === filterValue;
    return matchesSearch && matchesFilter;
  });
    
    //generamos opciones dinamicamente sin repetir
    const filterOptions = ["Todos", ...new Set(users.map((user) => user[filterType]))];


  // --- Usa el hook de paginación.
  const { current:currentusers, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredUsuarios, 5);

  // --- Eliminar al usuario
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

  // --- Vista
  const handleView = (id) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      navigate(`/usuario/ver/${id}`);
    } else {
      console.error('Usuario no encontrado');
    }
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
      <div className="card p-3">
      <h2 className="mb-3">Lista de Usuarios</h2>

        <div className="col-md-10">
      <div className="row">
        {/* Barra de búsqueda (4 columnas) */}
        <div className="col-md-4 mb-2">
         <div className="input-group">
           <input
             type="text"
             className="form-control pe-5"
             placeholder="Buscar Cliente ..."
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
                <option value="rol">Filtrar por Rol</option>
                <option value="area">Filtrar por Área</option>
              </select>
            </div>   
          </div>        
            {/* Filtro dinámico por valor */}
          <div className="col-md-2 mb-2">
            <div className="input-group">
             <select className="form-select" value={filterValue} onChange={handleFilterValueChange}>
             {filterOptions.map(option => (
             <option key={option} value={option}>{option}</option>
           ))}
            </select>
           </div>
          </div>
          
        <div className="col-md-4 mb-2">
               <div className="input-group">
                <Link to="/usuarios/CrearUsuario" className="input-daterange input-group btn btn-soft-success waves-effect waves-light">
                 <i className="mdi mdi-plus me-1"></i> Crear Cliente
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
              <th>Email</th>
              <th>Rol</th>
              <th>Área</th>
              <th>Acceso a Nómina</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentusers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>{user.area}</td>
                <td>{user.accesoNomina ? "Sí" : "No"}</td>
                <td>
                <BotonesAccion id={user.id} entidad="usuario" 
                onDelete={handleDelete} setAlert={setAlert}
                onView={() => handleView(user.id)} /> 
                </td>
              </tr>
            ))}
          
          </tbody>
        </table>
      </div>
      </div>
      {/* Paginacion */}
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

export default Lista_usuarios;
