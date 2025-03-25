import { useEffect, useState } from 'react';
import { ChevronLeft, Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import ContentsTable from '../components/content/ContentsTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import Pagination from '../components/shared/Pagination';
import useAuth from '../hooks/useAuth';
import CreateContentRequest from '../models/content/CreateContentRequest';
import contentService from '../services/ContentService';

export default function Course() {
  const { id } = useParams<{ id: string }>();
  const [filterData, setFilterData] = useState({
    name: '',
    description: '',
    dateCreated: '',
    imageUrl: '',
  });
  const [courseName, setCourseName] = useState('');
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 5,
  });
  const [addContentShow, setAddContentShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string>();
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const { authenticatedUser } = useAuth();

  const sortData = (sortValue: 'name' | 'description' | 'dateCreated') => {
    const sortedData = [...data].sort((a, b) =>
      a[sortValue].localeCompare(b[sortValue]),
    );
    setData(sortedData);
    setSortMenuVisible(false);
  };

  const getContents = async () => {
    try {
      setIsLoading(true);
      const { contents, count, courseName } = await contentService.findAll({
        courseId: id,
        name: filterData.name || undefined,
        description: filterData.description || undefined,
        dateCreated: filterData.dateCreated || undefined,
        imageUrl: filterData.imageUrl || undefined,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      setCourseName(courseName);
      setData(contents);
      setCount(count);
      setIsLoading(false);
    } catch (error) {
      setError('Error al buscar contenidos');
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateContentRequest>();

  const saveCourse = async (createContentRequest: CreateContentRequest) => {
    try {
      await contentService.save(id, createContentRequest);
      setAddContentShow(false);
      reset();
      getContents();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handlePage = (nextPage: number) => {
    setFilterData({ name: '', description: '', dateCreated: '', imageUrl: '' });
    setPagination((prev) => ({ ...prev, current: nextPage }));
  };

  useEffect(() => {
    getContents();
  }, [pagination]);

  return (
    <Layout>
      <div className="flex justify-between items-start mb-10">
        {!isLoading ? (
          <div className="flex items-center">
            <Link to="/courses">
              <ChevronLeft />
            </Link>
            <h1 className="font-semibold text-3xl mb-1 ml-5">
              {courseName.toUpperCase()}
            </h1>
          </div>
        ) : (
          <div />
        )}
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn flex gap-2 w-full sm:w-auto justify-center"
            onClick={() => setAddContentShow(true)}
          >
            <Plus /> Agregar contenido al curso
          </button>
        ) : null}
      </div>
      <div className="table-filter">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-40"
            placeholder="Nombre"
            value={filterData.name}
            onChange={(e) =>
              setFilterData({ ...filterData, name: e.target.value })
            }
          />
          <input
            type="text"
            className="input w-40"
            placeholder="Descripcion"
            value={filterData.description}
            onChange={(e) =>
              setFilterData({ ...filterData, description: e.target.value })
            }
          />
          <div className="flex items-center">
            <p className="text-center w-30 mr-1">A partir de:</p>
            <input
              type="date"
              className="input w-40"
              value={filterData.dateCreated}
              onChange={(e) =>
                setFilterData({ ...filterData, dateCreated: e.target.value })
              }
            />
          </div>
          <button className="btn w-40" onClick={getContents}>
            Buscar
          </button>
          <div>
            <button
              className="btn outline w-40"
              onClick={() => setSortMenuVisible(!sortMenuVisible)}
            >
              Ordenar
            </button>
            {sortMenuVisible && (
              <div className="absolute z-2 bg-white border rounded shadow-md mt-1">
                <button
                  className="block px-4 py-2 text-left w-full hover:bg-gray-200"
                  onClick={() => sortData('name')}
                >
                  Por nombre
                </button>
                <button
                  className="block px-4 py-2 text-left w-full hover:bg-gray-200"
                  onClick={() => sortData('description')}
                >
                  Por descripcion
                </button>
                <button
                  className="block px-4 py-2 text-left w-full hover:bg-gray-200"
                  onClick={() => sortData('dateCreated')}
                >
                  Por fecha
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContentsTable
        data={data}
        isLoading={isLoading}
        courseId={id}
        getContents={getContents}
      />

      {/* Paginacion */}
      <Pagination
        pagination={pagination}
        handleNextPage={() => handlePage(pagination.current + 1)}
        handlePrevPage={() => handlePage(pagination.current - 1)}
        count={count}
      />

      {/* Add User Modal */}
      <Modal show={addContentShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Agregar contenido</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddContentShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Nombre"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Descripcion"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <input
            type="text"
            className="input"
            placeholder="URL de la imagen"
            {...register('imageUrl')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Guardar'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
