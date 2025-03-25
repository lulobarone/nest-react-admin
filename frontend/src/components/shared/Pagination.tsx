interface PaginationProps {
  pagination: {
    current: number;
    pageSize: number;
  };
  count: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export default function Pagination({
  pagination,
  handleNextPage,
  handlePrevPage,
  count,
}: PaginationProps) {
  return (
    <div className="flex justify-between">
      <button
        className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
        onClick={handlePrevPage}
        disabled={pagination.current === 1}
      >
        Anterior
      </button>
      <span className="font-semibold flex items-center">
        pagina {pagination.current} de{' '}
        {Math.ceil(count / pagination.pageSize) || 1}
      </span>
      <button
        className="btn my-5 flex gap-2 w-full sm:w-auto justify-center"
        onClick={handleNextPage}
        disabled={pagination.current * pagination.pageSize >= count}
      >
        Siguiente
      </button>
    </div>
  );
}
