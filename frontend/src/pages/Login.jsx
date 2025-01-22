import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../helpers/toastHelpers";
import { ToastContainer } from "react-toastify";
import { login } from "../helpers/userHelpers";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChangeEvent = (ev) => {
    const { name, value } = ev.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();
    const response = await login(formData);
    if (response.status) {
      handleSuccess("Successfully login to  you  account");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      handleError(response.message);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 text-gray-100 rounded-lg shadow-md">
          <div className="header flex  justify-between items-center">
            <div className="brandHeader flex items-center gap-4">
              <img
                src="/src/assets/images/logo.jpg"
                alt="logo"
                className="w-12 h-12 rounded-full"
              />
              <h1 className="font-bold  text-2xl">
                <span className="text-cyan-400">Chatter</span>
                <span className="text-pink-400">Box</span>
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-center">Login</h2>
          </div>
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="block w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your Username"
                onChange={handleInputChangeEvent}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="block w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                onChange={handleInputChangeEvent}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
