// useSearchFilter.js
import { useState } from 'react';

const useSearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('rol');
  const [filterValue, setFilterValue] = useState('Todos');
  
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterValue('Todos');
  };
  const handleFilterValueChange = (e) => setFilterValue(e.target.value);

  return {
    searchTerm,
    filterType,
    filterValue,
    handleSearchChange,
    handleFilterTypeChange,
    handleFilterValueChange,
  };
};

export default useSearchFilter;
