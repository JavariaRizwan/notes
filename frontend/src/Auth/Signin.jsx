import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from "axios";
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const SignIn=({ onSuccess })=> {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/login-user`, formData,
        {withCredentials: true}
      );
      if (response.data.success) {
        toast.success('Logged in successfully!');
        navigate('/user_dashboard'); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed!');
    }
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
            <h1 className="text-xl text-white font-extrabold tracking-tight">StackNotes</h1>
            <p className="text-blue-100/90 text-xs mt-0.5 font-medium mb-3">
              Welcome back to your workspace.
            </p>
          </div>

          <div className="relative z-10 text-center md:text-left text-xs text-blue-100/80 pt-3 border-t border-white/15 mt-4 md:mt-0">
            <p>Access all your synchronized notes.</p>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-4 sm:p-6 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Sign In
            </h2>
            <p className="text-xs text-slate-500">
              Enter your details to sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="usernameOrEmail" className="block text-xs font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <User size={14} />
                </div>
                <input
                  type="text"
                  id="usernameOrEmail"
                  autoComplete='off'
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username/email"
                  className="form-input"
                />
              </div>
            </div>


<div>
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor='password' className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={14} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
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
              
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Having trouble in sign in?
                </button>
              </div>
            </div>



            <button
              type="submit"
              className="form-button"
            >
              <span>Log In</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button type="button"
              onClick={() => navigate('/signup')}
              className="text-blue-600 cursor-pointer font-semibold hover:underline"
            >
              Signup Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
export default SignIn