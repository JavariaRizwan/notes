import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PanelLeft, Search, User, Keyboard, ChevronDown, CheckCircle2, LogOut, X } from 'lucide-react';

export default function Navbar({ onToggleSidebar, onLogout, searchQuery, setSearchQuery }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const navigate=useNavigate();


const handleLogout=async()=>{
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, 
      {},
      {withCredentials:true}
    );
    toast.success('User Logged out');
    navigate('/signin', { replace: true });
  } catch (error) {
    console.error(error.message);
  }
}


useEffect(() => {
  const getUserName = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify`, {
        withCredentials: true,
      });

      if (response.data.success || response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      }
    }
  };

  getUserName();
}, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();

        if (window.innerWidth < 768) {
          setMobileSearchOpen(true);
        } else {
          searchRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {mobileSearchOpen ? (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 px-4 flex items-center gap-3 border-b border-slate-200 shadow-sm animate-in fade-in duration-150">
          <Search size={18} className="text-blue-500 shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search notes..."
            className="w-full bg-transparent text-sm outline-none text-slate-800= placeholder:text-slate-400"
          />
          <button type="button" 
            onClick={() => setMobileSearchOpen(false)}
            
            aria-label="Close search overlay"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
      ) : null}

<header className="fixed top-0 left-0 right-0 h-16 z-40 bg-white/90 border-b border-slate-200/80 text-slate-800 backdrop-blur-md px-3 md:px-6 flex items-center justify-between shadow-xs">               
 <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button type="button" 
            onClick={() => {
              if (typeof onToggleSidebar === 'function') onToggleSidebar();
            }}
        className="p-2 cursor-pointer rounded-xl transition-colors hover:bg-slate-100 text-slate-60"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft size={20} strokeWidth={1.8} />
          </button>

          <div className="flex items-center gap-2 cursor-pointer select-none">
            <img 
              // src="/sticky-notes.png"
              src="/notes.png"
              alt="StackNotes Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            />
<span className="text-base sm:text-lg font-bold tracking-tight text-[#5B5BFF]">
    StackNotes
</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
<div className="w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all duration-200 bg-slate-100/70 border-slate-200/80 hover:border-slate-300 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:shadow-md">
<Search size={17} className="text-slate-400" />
            <input
              ref={searchRef}  // using refrence for the serach cntrol using Ctrl + K
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search notes, tags, or memory..."
className="w-full bg-transparent text-sm outline-none text-slate-800 placeholder:text-slate-400"/>
<kbd className="hidden sm:inline-flex items-center justify-center min-w-[58px] whitespace-nowrap shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium tracking-wide bg-slate-200/80 text-slate-500 border border-slate-300/60">              Ctrl + K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button type="button" 
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Open search"
className="md:hidden p-2 rounded-xl transition-colors hover:bg-slate-100 text-slate-600">
            <Search size={19} strokeWidth={1.8} />
          </button>

          <div className="relative" ref={profileRef}>
            <button type="button" 
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
              aria-label="User profile menu"
              className="flex cursor-pointer items-center gap-1.5 p-2 rounded-full hover:bg-slate-100"
            >
              <p className="hidden lg:block text-sm font-medium">
        {user?.username || 'Guest User'}
      </p>
<div className="w-8 h-8 rounded-full bg-[#5B5BFF] text-white flex items-center justify-center font-bold text-sm shadow-xs">  
  {userInitial}
</div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>

            {profileOpen && (
  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-xl overflow-hidden z-50 bg-white text-slate-700">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold capitalize">
                    {user?.username || 'Guest User'}
                  </p>
                  <p className="text-xs text-slate-400 font-normal truncate mt-0.5">
                    {user?.email || 'No email associated'}
                  </p>
                  <p className="text-xs text-blue-500 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 size={12} /> Sync Active
                  </p>
                </div>

                <div className="p-1.5 space-y-0.5">
<button type="button" 
  onClick={() => {
    setProfileOpen(false);
    navigate('/user-profile');
  }}
className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-100">
  <User size={16} /> Profile
</button>                  
<button type="button" 
onClick={()=>{
navigate('/forward-note');
}}

className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-slate-100">
     <Keyboard size={16} /> Forward Note
                  </button>
                  <div className="my-1 border-t border-slate-100 " />
                  <button type="button" className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50"
                  onClick={handleLogout}>
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}