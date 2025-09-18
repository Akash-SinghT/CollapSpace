import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
import { toast } from "sonner";
import API from "../../api/api";
import {
  FaGoogle,
  FaGithub,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/))
      errs.email = "Please enter a valid email";
    if (!form.password || form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsLoading(true);
    try {
      const res = await API.post("/auth/register", form);

      const { user, accessToken } = res.data;

      if (!accessToken) {
        toast.error("Signup failed: access token missing");
        return;
      }

      // Save user + access token in Redux (refresh token is in httpOnly cookie)
      dispatch(loginSuccess({ user, accessToken }));

      toast.success("Signup successful!");
      navigate("/select-role");
    } catch (err) {
      console.error("❌ Signup error:", err);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = (provider) => {
    window.location.href = `${API.defaults.baseURL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-200 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="form-card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
            <p className="text-indigo-200">
              Join thousands of teams collaborating on CollabSpace
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="text-sm font-medium mb-1 block">Username</span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="form-input"
              />
              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium mb-1 block">Email</span>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </label>

            <label className="block mb-6 relative">
              <span className="text-sm font-medium mb-1 block">Password</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="form-input pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-300 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </label>

            <button type="submit" disabled={isLoading} className="btn-gradient">
              {isLoading ? (
                <>
                  <span className="spinner"></span> Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="flex items-center my-6 text-indigo-200">
            <div className="flex-grow border-t border-indigo-700"></div>
            <span className="mx-4 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-indigo-700"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="btn-social"
              onClick={() => socialLogin("google")}
            >
              <FaGoogle className="text-red-400 mr-2" /> Google
            </button>
            <button
              className="btn-social"
              onClick={() => socialLogin("github")}
            >
              <FaGithub className="text-gray-300 mr-2" /> GitHub
            </button>
          </div>

          <p className="text-center text-indigo-200 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-200 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
