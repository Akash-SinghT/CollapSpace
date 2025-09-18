import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    navigate("/"); // Redirect if not logged in
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}</h1>
      <p className="mb-6">
        Your role: <strong>{user.role}</strong>
      </p>

      {user.role === "admin" && (
        <div className="mb-4 p-4 bg-green-500 rounded-md">
          Admin Panel: Add/Edit/Delete users
        </div>
      )}

      {user.role === "editor" && (
        <div className="mb-4 p-4 bg-green-500 rounded-md">
          Editor Panel: Create/Edit documents
        </div>
      )}

      {user.role === "viewer" && (
        <div className="mb-4 p-4 bg-green-500 rounded-md">
          Viewer Panel: View documents
        </div>
      )}

      <button onClick={handleLogout} className=" mt-4">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
