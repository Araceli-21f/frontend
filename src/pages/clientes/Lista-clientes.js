import React, { useState } from "react";
import Layout from "../../layouts/pages/layout";
import { Link, useNavigate} from "react-router-dom";
import useSearchFilter from "../../hooks/Usuarios/useSearchFilter";
import usePagination from "../../hooks/Usuarios/usePagination";
import BotonesAccion from "../../components/BotonesAccion";
import AlertComponent from "../../components/AlertasComponent";



const ListaClientes = () => {
  const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

  // Datos de ejemplo de clientes (reemplaza con tu lógica de obtención de datos)
  const [clientes, setcliente] = useState([
    { id: "1", nombre: "Juan Pérez", email: "juan.perez@example.com", telefono: "1234567890", direccion: "Calle 1, Ciudad", fecha_registro: "2023-01-15",estado_cliente: "Inactivo", tipo_cliente: "Individual" },
    { id: "2", nombre: "María García", email: "maria.garcia@example.com", telefono: "9876543210", direccion: "Avenida 2, Ciudad", fecha_registro: "2023-02-20", estado_cliente: "Activo", tipo_cliente: "Empresa" },
    { id: "4", nombre: "García Perez", email: "garcia@example.com", telefono: "1236543210", direccion: "Avenida 2, Madrid", fecha_registro: "2024-12-20", estado_cliente: "Inactivo", tipo_cliente: "Empresa" },
    { id: "5", nombre: "Maríana García", email: "maria@example.com", telefono: "3676543210", direccion: " Ciudad Londre", fecha_registro: "2025-02-10", estado_cliente: "Activo", tipo_cliente: "Individual" },

  ]);

   // --- Usa un hook --- Filtra los usuarios según el término de búsqueda y el valor de filtro.
   const {
    searchTerm, filterType, filterValue,
    handleSearchChange, handleFilterTypeChange, handleFilterValueChange
  } = useSearchFilter("id");

  const filteredCliente = clientes.filter((cliente) => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "Todos" || cliente[filterType] === filterValue;
    return matchesSearch && matchesFilter;
  });
    
    //generamos opciones dinamicamente sin repetir
    const filterOptions = ["Todos", ...new Set(clientes.map((cliente) => cliente[filterType]))];


  // --- Usa el hook de paginación.
  const { current:currentclientes, currentPage, totalPages, setNextPage, setPreviousPage } = usePagination(filteredCliente, 5);  

  // --- Eliminar al cliente
  const handleDelete = (id) => {
    setcliente(prevusers => prevusers.filter(cliente => cliente.id !== id));
    setAlert({ type: "success", action: "delete", entity: "cliente" });
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
  //Función para iniciar el borrado con confirmación.
    const iniciarBorrado = (id) => {
        setAlert({
            type: "confirm",
            action: "delete",
            entity: "cliente",
            id: id,
        });
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
        <h2 className="mb-3"><i className="fa fa-fw fa-bars"/> Lista de Clientes</h2>
        
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
       {/* Filtro por tipo (2 columnas) */}
      <div className="col-md-2 mb-2">
       <div className="input-group">
         <select className="form-select" value={filterType} onChange={handleFilterTypeChange}>
           <option value="estado_cliente">Filtrar Estado</option>
           <option value="tipo_cliente">Filtrar Tipo</option>
         </select>
       </div>
     </div>
      {/* Filtro por valor (2 columnas) */}
      <div className="col-md-2 mb-2">
        <div className="input-group">
          <select className="form-select" value={filterValue} onChange={handleFilterValueChange}>
            {filterOptions.map(option => (
            <option key={option} value={option}>{option}</option>
           ))}
          </select>
        </div>
      </div>
       {/* Crear Cliente Button (4 columnas) */}
       <div className="col-md-4 mb-2">
         <div className="input-group">
           <Link to="/clientes/CrearCliente" className="input-daterange input-group btn btn-soft-success waves-effect waves-light">
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
                      <th>Teléfono</th>
                      <th>Dirección</th>
                      <th>Fecha de Registro</th>
                      <th>Estado Cliente</th>
                      <th>Tipo Cliente</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                  {currentclientes.map((cliente) => (                      
                    <tr key={cliente.id}>
                        <td>{cliente.id}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.direccion}</td>
                        <td>{cliente.fecha_registro}</td>
                        <td>{cliente.estado_cliente}</td>
                        <td>{cliente.tipo_cliente}</td>
                        <td>
                          {/* Aquí usas el componente BotonesAccion */}
                        <BotonesAccion id={cliente.id} 
                        entidad="clientes"
                        onDelete={() => iniciarBorrado(cliente.id)}
                        setAlert={setAlert}
                         />

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

export default ListaClientes;
