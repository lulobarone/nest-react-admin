import { BookOpen, Edit, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={`sidebar ${className}`}>
      <img
        src={`${process.env.PUBLIC_URL}/sidemenu-bg.jpg`}
        alt="sidebar"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: -1, opacity: 0.8 }}
      />
      <div
        className="absolute inset-0 bg-black opacity-70"
        style={{ zIndex: -1 }}
      />
      <Link to="/" className="no-underline text-black">
        <img
          src={`${process.env.PUBLIC_URL}/urbano-logo-white.png`}
          alt="logo-urbano"
          className="h-auto mx-auto mt-5"
        />
      </Link>
      <nav className="mt-20 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/">
          <Home /> Panel principal
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen /> Cursos
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users /> Usuarios
          </SidebarItem>
        ) : null}
        <SidebarItem to="/user-profile">
          <Edit /> Editar perfil
        </SidebarItem>
      </nav>

      <button
        className="text-red-500 rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none"
        onClick={handleLogout}
      >
        <LogOut /> Cerrar sesion
      </button>
    </div>
  );
}
