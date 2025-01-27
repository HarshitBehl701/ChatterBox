import React, { useState } from "react";
import {Link, useNavigate}  from "react-router-dom"
import  {handleError,handleSuccess} from "../helpers/toastHelpers";
import { ToastContainer } from "react-toastify";
import {registration} from "../helpers/userHelpers";

const Register = () => {
  const navigate = useNavigate();

  const [formData,setFormData] = useState({
      'name':  '',
      'email':  '',
      'username':  '',
      'password':  '',
  });

  const handleInputChangeEvent = (ev) =>{
      const {name,value} = ev.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
  }

  const handleFormSubmit =  async (ev) => {
    ev.preventDefault();
    const response =  await registration(formData);
    if(response.status){
      handleSuccess('Successfully registered  now  you  can  login  to your  account');
      setTimeout(() => {navigate('/login')},2000);
    }else{
      handleError(response.message);
    }
  }
  

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 text-gray-100 rounded-lg shadow-md">
      <div className="header flex  justify-between items-center">
        <div className="brandHeader flex items-center gap-4">
        <img src="/assets/images/logo.jpg" alt="logo" className="w-12 h-12 rounded-full" />
        <h1   className="font-bold  text-2xl"><span  className="text-cyan-400">Chatter</span><span  className="text-pink-400">Box</span></h1>
        </div>
        <h2 className="text-2xl font-semibold text-center">Register</h2>
        </div>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="block w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
              onChange={handleInputChangeEvent}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="block w-full px-4 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              onChange={handleInputChangeEvent}
            />
          </div>
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
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
    <ToastContainer  />
    </>
  );
};

export default Register;