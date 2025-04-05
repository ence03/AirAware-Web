import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Logo from "../assets/logo.png";

const API_URL = "https://airaware.up.railway.app/api/auth/login"; // Replace with your API endpoint

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const credentials = { username, password };
      const response = await axios.post(API_URL, credentials);

      if (response.data.success) {
        const { user, token } = response.data;

        Cookie.set("token", token, { expires: 7 });

        setLoading(false);
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/error"); // Redirect to non-admin dashboard or other page
        }
      } else {
        setError(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-5">
      <img src={Logo} alt="Logo" className="w-[500px] h-36 mb-8" />
      <h1 className="text-2xl font-semibold text-blue-600 mb-10">
        Login an account
      </h1>
      <div className="w-4/5 max-w-md space-y-6">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
          placeholder="Username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
            placeholder="Password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
