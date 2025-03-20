import { useState } from "react";

const usePagination = (filteredUsuarios, usersPerPage) => {
  // Estado para la página actual.
  const [currentPage, setCurrentPage] = useState(1);

  // Calcula los índices para la paginación.
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // Obtiene los usuarios para la página actual.
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);
  // Calcula el total de páginas.
  const totalPages = Math.ceil(filteredUsuarios.length / usersPerPage);

  // Función para ir a la siguiente página.
  const setNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Función para ir a la página anterior.
  const setPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Retorna los datos y funciones para la paginación.
  return {
    currentUsers,
    currentPage,
    totalPages,
    setNextPage,
    setPreviousPage,
  };
};

export default usePagination;