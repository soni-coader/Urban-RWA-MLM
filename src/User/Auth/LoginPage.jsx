import { useState, useEffect } from "react";
import axios from "axios";
import loginimg from "../../assets/userImages/images/loginimg.webp";
import logo from "../../assets/userImages/Logo/logo_lght.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { appConfig } from "../../config/appConfig";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: localStorage.getItem("rememberMe") === "true",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  // Check if already logged in on mount
  useEffect(() => {
    const storedToken =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (storedToken && window.location.pathname !== "/user/dashboard") {
      console.log("Token found, redirecting to /user/dashboard:", storedToken);
      navigate("/user/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Demo Mode: Skip validation and API calls
    if (demoMode) {
      setIsLoading(true);
      setTimeout(() => {
        // Set demo mode flag and token
        localStorage.setItem("userDemoMode", "true");
        localStorage.setItem("authToken", "demo_token_" + Date.now());
        toast.success("🚀 Logged in with Demo Mode!");
        setIsLoading(false);
        navigate("/user/dashboard", { replace: true });
      }, 800);
      return;
    }

    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${appConfig.baseURL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      const { message } = response.data;

      // OTP sent successfully, redirect to verify page
      toast.success(message || "Login OTP sent to your email for verification");

      // Pass email and type to verify page via state
      navigate("/user/verify-user", {
        state: {
          email: formData.email,
          type: "login"
        },
        replace: true
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password.";
      if (errorMessage === "Invalid credentials" || errorMessage === "User not found") {
        setErrors((prev) => ({
          ...prev,
          email: errorMessage,
          password: errorMessage,
        }));
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-fit md:h-screen overflow-hidden shadow-xl flex flex-col-reverse md:flex-row">
      <div className="w-full md:w-1/2 bg-[#1a152d] relative">
        <img src={loginimg} alt="Login" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6">
          <Link
            to="/"
            className="self-end text-sm text-white bg-white/10 px-4 py-1 rounded-full backdrop-blur-md"
            aria-label="Back to website"
          >
            Back to website →
          </Link>
          <div>
            <p className="text-xl font-medium">Capturing Moments,</p>
            <p className="text-xl font-medium">Creating Memories</p>
            <div className="mt-3 flex space-x-1">
              <span className="w-2 h-2 bg-white/40 rounded-full"></span>
              <span className="w-2 h-2 bg-white/40 rounded-full"></span>
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full relative min-h-screen md:min-h-auto flex items-center justify-center md:w-1/2 p-8 md:p-12 bg-white">
        <Link
          to="/"
          className="absolute top-5 right-5 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full transition-colors"
          aria-label="Back to website"
        >
          Back to website →
        </Link>
        <div className="w-full max-w-xl">
          <div className="mb-5">
            <img src={logo} className="w-40" alt="Logo" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Sign in to your account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your credentials to receive an OTP for verification.
          </p>

          {/* Demo Mode Option */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500/30 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-blue-600 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <p className="text-blue-600 font-bold text-sm">Demo Mode Login</p>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Enable this to login without server connection. Perfect for UI/UX testing.
                  No API calls will be made and dummy data will be displayed.
                </p>
              </div>
            </label>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-50 text-gray-800 border ${errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-blue-700"
                  }`}
                disabled={isLoading}
                autoFocus
                aria-label="Email input"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-gray-50 text-gray-800 border ${errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500" : "focus:ring-blue-700"
                  }`}
                disabled={isLoading}
                aria-label="Password input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                className={`absolute right-3 top-4 text-gray-600 text-lg hover:text-gray-800 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="accent-blue-ring-blue-700"
                  disabled={isLoading}
                  aria-label="Remember me checkbox"
                />
                Remember me
              </label>
              <Link
                to="/user/forgot-password"
                className="text-blue-600 hover:underline"
                aria-label="Forgot password link"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:opacity-90 transition-colors font-semibold ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={isLoading}
              aria-label="Login button"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="my-6 flex items-center gap-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-600 text-sm">
              Want to create an account?{" "}
              <Link
                to="/user/signup"
                className="text-blue-600 text-nowrap underline-offset-4 hover:underline"
                aria-label="Sign up link"
              >
                Sign Up
              </Link>
            </span>
            <hr className="flex-1 border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;