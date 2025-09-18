import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
import { toast } from "sonner";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const user = {
      id: params.get("id"),
      username: params.get("username"),
      role: params.get("role"),
      email: params.get("email") || "",
    };

    const accessToken = params.get("accessToken");
    // ✅ Refresh token is stored in secure cookie by backend, so we don't need it here.

    if (accessToken && user) {
      dispatch(loginSuccess({ user, accessToken }));

      toast.success("Login successful!");

      if (!user.role) {
        navigate("/select-role");
      } else {
        navigate("/dashboard");
      }
    } else {
      toast.error("OAuth login failed");
      navigate("/login");
    }
  }, [location, navigate, dispatch]);

  return <div className="container">Logging you in...</div>;
};

export default OAuthSuccess;
