import { useContext } from "react";
import { BookOpen, LogOut, Users } from "react-feather";
import { useHistory } from "react-router";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import authService from "../../services/AuthService";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useContext(
    AuthenticationContext
  );

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push("/login");
  };

  return (
    <div className="fixed h-screen w-72 p-5 shadow flex flex-col">
      <h1 className="font-semibold text-center">Carna Project</h1>
      <nav className="mt-5 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        {authenticatedUser.role === "admin" ? (
          <SidebarItem to="/users">
            <Users /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="text-red-500 rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
