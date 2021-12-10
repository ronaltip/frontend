const onSearch = (valueFilter, listRegister) => {
  const value = valueFilter.target.value;
  if (value !== '') {
    const valueSearch = value
      .normalize('NFD')
      .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
      .normalize()
      .toUpperCase();
    const valuesFiltered = listRegister.filter(
      search =>
        search.nombre_wells
          .normalize('NFD')
          .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
          .normalize()
          .toUpperCase()
          .includes(valueSearch) ||
        search.columnas
          .normalize('NFD')
          .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
          .normalize()
          .toUpperCase()
          .includes(valueSearch)
    );
    return valuesFiltered;
  } else {
    return null;
  }
};
export default onSearch;
