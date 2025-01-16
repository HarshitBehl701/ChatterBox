import React from "react";
import {Link}  from "react-router-dom"

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 text-gray-100 rounded-lg shadow-md">
        <div className="header flex  justify-between items-center">
        <div className="brandHeader flex items-center gap-4">
        <img src="/assets/images/logo.jpg" alt="logo" className="w-12 h-12 rounded-full" />
        <h1   className="font-bold  text-2xl"><span  className="text-cyan-400">Chatter</span><span  className="text-pink-400">Box</span></h1>
        </div>
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        </div>
        <form className="space-y-4">
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
          <Link
            to="/register"
            className="text-indigo-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;