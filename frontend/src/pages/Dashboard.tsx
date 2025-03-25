import moment from 'moment';
import { useEffect, useState } from 'react';
import { Loader } from 'react-feather';

import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import statsService from '../services/StatsService';

export default function Dashboard() {
  const [data, setData] = useState({
    numberOfUsers: 0,
    numberOfCourses: 0,
    numberOfContents: 0,
    latestUsers: [],
    latestCourses: [],
    coursesMoreContents: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();

  const getStats = async () => {
    try {
      setIsLoading(true);
      const data = await statsService.getStats();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setError('Error al buscar datos');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">PANEL PRINCIPAL</h1>
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        {!isLoading ? (
          <>
            <div className="flex flex-col sm:flex-row gap-5">
              {authenticatedUser.role === 'admin' ? (
                <div className="card shadow text-white bg-red-500 flex-1">
                  <h1 className="font-semibold sm:text-4xl text-center mb-3">
                    {data.numberOfUsers}
                  </h1>
                  <p className="text-center sm:text-lg font-semibold">
                    Usuarios
                  </p>
                </div>
              ) : null}
              <div className="card shadow text-white bg-gray-400 flex-1">
                <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                  {data.numberOfCourses}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Cursos</p>
              </div>
              <div className="card shadow text-white bg-brand-primary flex-1">
                <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                  {data.numberOfContents}
                </h1>
                <p className="text-center sm:text-lg font-semibold">
                  Contenidos
                </p>
              </div>
            </div>
            {authenticatedUser.role === 'admin' ? (
              <div className="mt-5">
                <h2 className="text-xl font-semibold mb-3">
                  Ultimos 5 usuarios agregados:
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {data.latestUsers.map((user, i) => (
                    <div
                      key={i}
                      className="card shadow p-4 bg-red-400 text-white"
                    >
                      <h3 className="font-semibold">
                        Nombre: {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm">Usuario: {user.username}</p>
                      <p className="text-sm">Rol: {user.role}</p>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-5">
              <h2 className="text-xl font-semibold mb-3">
                Ultimos 5 cursos agregados:
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {data.latestCourses.map((course, i) => (
                  <div key={i} className="card shadow p-4 bg-gray-300">
                    <h3 className="font-semibold">Nombre: {course.name}</h3>
                    <p className="text-sm">Descripcion: {course.description}</p>
                    <p className="text-sm text-gray-500">
                      Fecha de creacion:
                      {moment(course.dateCreated).format('DD/MM/YYYY')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <h2 className="text-xl font-semibold mb-3">
                Los 5 cursos con mas contenidos:
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {data.coursesMoreContents.map((course, i) => (
                  <div
                    key={i}
                    className="card shadow p-4 bg-brand-primary text-white"
                  >
                    <h3 className="font-semibold">Nombre:{course.name}</h3>
                    <p className="text-sm">
                      Numero de contenidos: {course.contentCount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {error ? (
              <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
                {error}
              </div>
            ) : null}
          </>
        ) : (
          <Loader className="w-full" />
        )}
      </div>
    </Layout>
  );
}
