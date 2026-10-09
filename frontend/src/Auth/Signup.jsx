import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';



const SignUp=({ onSuccess })=> {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({

    username: '',
    email: '',
    password: '',
    emailUpdates: false,

  });



  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: type === 'checkbox' ? checked : value,

    }));

  };



  const handleSubmit = async(e) => {

    e.preventDefault();
   if(formData.password.length<6){
        return toast.error("Password must be atleast 6 characters");
      }
      
    try {

      const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/save-user`, formData);
      
      if (response.data.success) {
      toast.success("User registered successfully!");
      navigate('/signin'); 

      setFormData({
     username: '',
    email: '',
    password: '',
    emailUpdates: false,
      }
      )

    }

    } catch (error) {
    const errorMesssage = error.response?.data?.message || "Error occurred while registering user";
    toast.error(errorMesssage);    }
    
  };



  return (

<div className="min-h-screen w-full flex items-center justify-center p-0 md:p-3 bg-white md:bg-slate-100/80 text-slate-800 transition-colors">

  <div className="w-full h-full min-h-screen md:min-h-0 md:max-w-3xl md:max-h-[88vh] bg-white rounded-none md:rounded-2xl shadow-none md:shadow-xl border-none md:border md:border-slate-200/80 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">        


      <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-purple-700 p-6">
     
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">

            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md p-2 flex items-center justify-center shadow-sm border border-white/20 mb-2">

              <img

                src="/notes.png"

                alt="StackNotes Logo"

                className="w-full h-full object-contain drop-shadow-md"

              />

            </div>

            <h1 className="text-xl font-extrabold tracking-tight text-white">StackNotes</h1>

            <p className="text-blue-100/90 text-xs mt-0.5 font-medium mb-3">

              Start building your personal knowledge memory stack.

            </p>

          </div>



          <div className="relative z-10 text-center md:text-left text-xs text-blue-100/80 pt-3 border-t border-white/15 mt-4 md:mt-0">

            <p>Join StackNotes today.</p>

          </div>

        </div>




        <div className="w-full md:w-7/12 p-6 bg-white overflow-y-auto">

          <div className="mb-2">

            <h2 className="text-xl font-bold tracking-tight text-slate-900">

              Sign Up

            </h2>

            <p className="text-xs text-slate-500">

              Enter your details to create your account

            </p>

          </div>



          <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-medium">

            <Lock size={12} className="shrink-0 text-blue-600" />

            <span>Your information is safe with us</span>

          </div>



          <form onSubmit={handleSubmit} className="space-y-2.5" autoComplete='off'>

            <div>

              <label htmlFor='username' className="block text-xs font-bold text-slate-500 mb-0.5 uppercase tracking-wider">

                Username

              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">

                  <User size={14} />

                </div>

                <input

                  type="text"
    autoComplete='off'
                  name="username"

                  value={formData.username}

                  onChange={handleChange}

                  required

                  placeholder="Enter your username"

                  className="form-input"

                />

              </div>

            </div>



            <div>

              <label htmlFor="email" className="block text-xs font-bold text-slate-500 mb-0.5 uppercase tracking-wider">

                Email Address

              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">

                  <Mail size={14} />

                </div>

                <input

                  type="email"

                  name="email"

                  value={formData.email}

                  onChange={handleChange}

                  required

                  placeholder="name@example.com"

                  className="form-input"

                />

              </div>

            </div>



            <div>

              <label htmlFor="password" className="block text-xs font-bold text-slate-500 mb-0.5 uppercase tracking-wider">

                Password

              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">

                  <Lock size={14} />

                </div>

                <input

                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  name="password"
                  value={formData.password}

                  onChange={handleChange}

                  required

                  placeholder="Enter your password"

                  className="form-input"

                />

                <button

                  type="button"

                  onClick={() => setShowPassword(!showPassword)}

                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"

                >

                  {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}

                </button>

              </div>

            </div>



            <div className="flex items-center gap-2 pt-0.5">

              <input

                type="checkbox"

                id="emailUpdates"

                name="emailUpdates"

                value="emailUpdates"

                checked={formData.emailUpdates}

                onChange={handleChange}

                className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"

              />

              <label

                htmlFor="emailUpdates"

                className="text-xs text-slate-600 cursor-pointer select-none font-medium"

              >

                Get free email updates?

              </label>

            </div>



            <button

              type="submit"

              className="form-button"

            >

              <span>Sign Up</span>

              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />

            </button>

          </form>




          <div className="mt-3 text-center text-xs text-slate-500">

            Already have an account?{' '}

            <Link

              to="/signin"

              className="text-blue-600 font-semibold hover:underline cursor-pointer"

            >

              Sign in Now

            </Link>

          </div>

        </div>



      </div>

    </div>

  );

} 

export default SignUp