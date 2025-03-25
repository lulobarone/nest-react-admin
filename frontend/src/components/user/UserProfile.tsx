import { useEffect, useState } from 'react';
import { Loader } from 'react-feather';
import { useForm } from 'react-hook-form';

import Layout from '../../components/layout';
import useAuth from '../../hooks/useAuth';
import UpdateUserRequest from '../../models/user/UpdateUserRequest';
import userService from '../../services/UserService';

export default function UserProfile() {
  const { authenticatedUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdateUserRequest>({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
    },
  });

  const getUser = async () => {
    try {
      setIsLoading(true);
      const userData = await userService.findOne(authenticatedUser.id);
      reset(userData);
      setIsLoading(false);
    } catch (error) {
      setError('Error al buscar usuario');
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (updateUserRequest: UpdateUserRequest) => {
    try {
      await userService.update(authenticatedUser.id, updateUserRequest);
      setMessage('Perfil actualizado correctamente');
      setError(null);
      reset({ ...updateUserRequest, password: '' });
    } catch (error) {
      setError(error.response.data.message);
      setMessage(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Layout>
      <div className="card shadow">
        {isLoading ? (
          <Loader className="w-full" />
        ) : (
          <form
            className="flex mt-3 flex-col gap-3 justify-center md:w-1/2 lg:w-1/2 mx-auto items-center"
            onSubmit={handleSubmit(handleUpdateUser)}
          >
            <h1 className="font-semibold text-4xl mb-10">{`Bienvenido ${authenticatedUser.firstName}`}</h1>
            <hr />
            <div className="flex gap-3 w-full mb-2">
              <div className="w-1/2">
                <label className="font-semibold">Nombre</label>
                <input
                  type="text"
                  className="input w-full mt-1"
                  disabled={isSubmitting}
                  placeholder="Escriba su nombre"
                  {...register('firstName')}
                />
              </div>
              <div className="w-1/2">
                <label className="font-semibold">Apellido</label>
                <input
                  type="text"
                  className="input w-full mt-1"
                  disabled={isSubmitting}
                  placeholder="Escriba su apellido"
                  {...register('lastName')}
                />
              </div>
            </div>
            <div className="w-full mb-2">
              <label className="font-semibold">Usuario</label>
              <input
                type="text"
                className="input w-full mt-1"
                disabled={isSubmitting}
                placeholder="Escriba su nombre de usuario"
                {...register('username')}
              />
            </div>
            <div className="w-full mb-2">
              <label className="font-semibold">Contraseña</label>
              <input
                type="password"
                className="input w-full mt-1"
                placeholder="Escriba su contraseña (minimo 6 caracteres)"
                disabled={isSubmitting}
                {...register('password')}
              />
            </div>
            <button className="btn w-full mb-3" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                'Actualizar'
              )}
            </button>
            {message && (
              <div className="text-green-600 p-3 font-semibold border rounded-md bg-green-50">
                {message}
              </div>
            )}
            {error ? (
              <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
                {error}
              </div>
            ) : null}
          </form>
        )}
      </div>
    </Layout>
  );
}
