import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from '../store/useAuthStore.js';
import { Eye, EyeOff } from "lucide-react"; // for icon toggle
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;
    if (!username.trim() || !password.trim()) {
      toast.error("Both username and password are required.");
      return;
    }
    console.log("Username : ",username);
    console.log("password : ",password);
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/users/login`,
        {
          username: username.trim(),
          password: password.trim(),
        },
        {
          withCredentials:true
        },
      );
      console.log("Response : ",response.data.data.user);
      toast.success("Login successful!");
      login(response.data.data.user);
      navigate("/dashboard");
    } catch (error) {
      if(error.status===404){
        toast.error("No such User !");
      }else if(error.status===400){
        toast.error("Password is Incorrect !");
      }else{
        toast.error("Login Failed !");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-[#4b74ed]">Login</h2>

        {/* Username */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#66c1ba]"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg pr-10 focus:outline-none focus:ring focus:ring-[#66c1ba]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#4b74ed] hover:bg-[#3a5fc7] text-white font-bold py-2 px-4 rounded-lg transition ${loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Logging in..." : "Login →"}
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#4b74ed] hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
