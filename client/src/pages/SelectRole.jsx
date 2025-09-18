import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/slice/userSlice";
import { toast } from "sonner";
import API from "../api/api";

const SelectRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const { accessToken, user } = useSelector((state) => state.user);

  const chooseRole = async (role) => {
    try {
      if (!accessToken) {
        toast.error("Token missing, please login again");
        navigate("/login");
        return;
      }

      // Call backend to update role
      const res = await API.put(
        "/auth/update-role",
        { role },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("✅ Response from update-role API:", res.data);

      const updatedUser = res.data.user;

      // ✅ Update Redux with new user info
      dispatch(loginSuccess({ user: updatedUser, accessToken }));

      toast.success(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to set role:", err);
      toast.error(err.response?.data?.message || "Failed to select role");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-indigo-900 rounded-2xl p-8 border border-indigo-700 shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6 text-white">Select Your Role</h1>
        <p className="text-indigo-200 mb-8">
          {user?.username
            ? `Welcome ${user.username}, choose your role to continue`
            : "Choose your role to continue"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => chooseRole("editor")}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Editor
          </button>
          <button
            onClick={() => chooseRole("viewer")}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-lg"
          >
            Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
