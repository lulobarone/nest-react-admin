import { useEffect, useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';

import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import Pagination from '../components/shared/Pagination';
import UsersTable from '../components/users/UsersTable';
import useAuth from '../hooks/useAuth';
import CreateUserRequest from '../models/user/CreateUserRequest';
import userService from '../services/UserService';

export default function Users() {
  const [filterData, setFilterData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    role: '',
  });
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 5,
  });
  const [addUserShow, setAddUserShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string>();
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const { authenticatedUser } = useAuth();

  const sortData = (
    sortValue: 'firstName' | 'lastName' | 'username' | 'role',
  ) => {
    const sortedData = [...data].sort((a, b) =>
      a[sortValue].localeCompare(b[sortValue]),
    );
    setData(sortedData);
    setSortMenuVisible(false);
  };

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const { users, count } = await userService.findAll({
        firstName: filterData.firstName || undefined,
        lastName: filterData.lastName || undefined,
        username: filterData.username || undefined,
        role: filterData.role || undefined,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      setData(users.filter((user) => user.id !== authenticatedUser.id));
      setCount(count);
      setIsLoading(false);
    } catch (error) {
      setError('Error al buscar usuarios');
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateUserRequest>();

  const saveUser = async (createUserRequest: CreateUserRequest) => {
    try {
      await userService.save(createUserRequest);
      setAddUserShow(false);
      await getUsers();
      setError(null);
      reset();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handlePage = (nextPage: number) => {
    setFilterData({
      firstName: '',
      lastName: '',
      username: '',
      role: '',
    });
    setPagination((prev) => ({ ...prev, current: nextPage }));
  };

  useEffect(() => {
    getUsers();
  }, [pagination]);

  return (
    <Layout>
      <div className="flex justify-between items-start mb-10">
        <h1 className="font-semibold text-3xl ">USUARIOS</h1>
        {authenticatedUser.role !== 'user' ? (
          <button
            className="btn flex gap-2 w-auto justify-center"
            onClick={() => setAddUserShow(true)}
          >
            <Plus /> Agregar usuario
          </button>
        ) : null}
      </div>
      <div className="table-filter mt-2">
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Nombre"
            value={filterData.firstName}
            onChange={(e) =>
              setFilterData({ ...filterData, firstName: e.target.value })
            }
          />
          <input
            type="text"
            className="input w-1/2"
            placeholder="Apellido"
            value={filterData.lastName}
            onChange={(e) =>
              setFilterData({ ...filterData, lastName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-row gap-5">
          <input
            type="text"
            className="input w-1/2"
            placeholder="Usuario"
            value={filterData.username}
            onChange={(e) =>
              setFilterData({ ...filterData, username: e.target.value })
            }
          />
          <select
            name=""
            id=""
            className="input w-1/2"
            value={filterData.role}
            onChange={(e) =>
              setFilterData({ ...filterData, role: e.target.value })
            }
          >
            <option value="">Todos</option>
            <option value="user">user</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button className="btn w-40" onClick={getUsers}>
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
                onClick={() => sortData('firstName')}
              >
                Por nombre
              </button>
              <button
                className="block px-4 py-2 text-left w-full hover:bg-gray-200"
                onClick={() => sortData('username')}
              >
                Por usuario
              </button>
              <button
                className="block px-4 py-2 text-left w-full hover:bg-gray-200"
                onClick={() => sortData('role')}
              >
                Por rol
              </button>
            </div>
          )}
        </div>
      </div>

      <UsersTable data={data} isLoading={isLoading} />

      {/* Paginacion */}
      <Pagination
        pagination={pagination}
        handleNextPage={() => handlePage(pagination.current + 1)}
        handlePrevPage={() => handlePage(pagination.current - 1)}
        count={count}
      />

      {/* Add User Modal */}
      <Modal show={addUserShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Agregar usuario</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setError(null);
              setAddUserShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveUser)}
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Nombre"
              required
              disabled={isSubmitting}
              {...register('firstName')}
            />
            <input
              type="text"
              className="input sm:w-1/2"
              placeholder="Apellido"
              required
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>
          <input
            type="text"
            className="input"
            required
            placeholder="Usuario"
            disabled={isSubmitting}
            {...register('username')}
          />
          <input
            type="password"
            className="input"
            required
            placeholder="Contraseña (minimo 6 caracteres)"
            disabled={isSubmitting}
            {...register('password')}
          />
          <p className="ml-1">Seleccion el Rol:</p>
          <select
            className="input"
            required
            {...register('role')}
            disabled={isSubmitting}
          >
            <option value="user">User</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
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
