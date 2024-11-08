import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className="mt-auto flex justify-between">
      {!loading ? (
        <BiLogOut
          className="w-6 h-6 text-white cursor-pointer flex hover:text-orange-700 transition duration-200 ease-in-out"
          onClick={logout}
        />
      ) : (
        <span className="loading loading-spinner"></span>
      )}
    </div>
  );
};
export default LogoutButton;
