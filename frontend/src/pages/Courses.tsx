import { useEffect, useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import Pagination from '../components/shared/Pagination';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [filterData, setFilterData] = useState({
    name: '',
    description: '',
    dateCreated: '',
  });
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 5,
  });
  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
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

  const getCourses = async () => {
    try {
      setIsLoading(true);
      const { courses, count } = await courseService.findAll({
        name: filterData.name || undefined,
        description: filterData.description || undefined,
        dateCreated: filterData.dateCreated || undefined,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      setData(courses);
      setCount(count);
      setIsLoading(false);
    } catch (error) {
      setError('Error al buscar cursos');
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      await getCourses();
      setError(null);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handlePage = (nextPage: number) => {
    setFilterData({ name: '', description: '', dateCreated: '' });
    setPagination((prev) => ({ ...prev, current: nextPage }));
  };

  useEffect(() => {
    getCourses();
  }, [pagination]);

  return (
    <Layout>
      <div className="flex justify-between items-start mb-10">
        <h1 className="font-semibold text-3xl ">CURSOS</h1>
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn flex gap-2 w-auto justify-center"
            onClick={() => setAddCourseShow(true)}
          >
            <Plus /> Agregar curso
          </button>
        ) : null}
      </div>
      <div className="table-filter">
        <div className="flex flex-row  gap-5">
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
          <button className="btn w-40" onClick={getCourses}>
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

      <CoursesTable data={data} isLoading={isLoading} getCourses={getCourses} />

      {/* Paginacion */}
      <Pagination
        pagination={pagination}
        handleNextPage={() => handlePage(pagination.current + 1)}
        handlePrevPage={() => handlePage(pagination.current - 1)}
        count={count}
      />

      {/* Add Course Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Agregar curso</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
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
