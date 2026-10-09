import React, { useState, useEffect } from 'react';
import Navbar from './Nav';
import Sidebar from './Sidebar';
import MainBody from './MainBody';
import axios from 'axios';
import {toast} from 'react-hot-toast'


const Middle = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories]=useState([]);

    
const handleGetCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`, { withCredentials: true });
    if (response.data.success) {
      setCategories(response.data.response);
    } else {
      toast.error(response.data.message || "Failed to load categories");
    }
  } catch (error) {
    console.error("Fetch categories error:", error);
    
    const errorMessage = error.response?.data?.message || error.message || "Error occurred while fetching categories";
    toast.error(errorMessage);
  }
};

useEffect(() => {
    handleGetCategories();
}, []);


  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="h-screen flex flex-col bg-slate-100/70 text-slate-900 transition-colors overflow-hidden">
      <Navbar 
        onToggleSidebar={toggleSidebar} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
      />

      <div className="pt-16 flex-1 flex flex-row h-[calc(100vh)] overflow-hidden relative w-full">
        {sidebarOpen && (
          <button 
            type="button" 
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 md:hidden"
          />
        )}

        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          onLogout={onLogout}
          onCategoryAdded={handleGetCategories}
        />

        <div className={`flex-1 h-full overflow-y-auto w-full transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-0' : 'md:-ml-64'}`}>
          <MainBody 
            activeCategory={activeCategory} 
            searchQuery={searchQuery}
            categories={categories}
           onSelectCategory={(catId) => setActiveCategory(catId)}
/>
        </div>
      </div>
    </div>
  );
};

export default Middle;