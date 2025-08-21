import React, { useState } from "react";

  function usePagination() {
   const [total, setTotal] = useState(0);
   const [itemsPerPage, setItemsPerPage] = useState(3);
   const [currentPage, setCurrentPage] = useState(0);
    const maxPage = Math.ceil(total / itemsPerPage);

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }

  return { next, prev, jump, currentPage,itemsPerPage, maxPage, setTotal, setItemsPerPage, setCurrentPage, total };
 }

 export default usePagination;