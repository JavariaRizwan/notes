import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Tag, Check } from 'lucide-react';
import axios from "axios";

const getCharCount = (html) => html ? new DOMParser().parseFromString(html, 'text/html').body.textContent?.length || 0 : 0;

const CreateNote = ({ isOpen, onClose, onSaveNote, isEditingNote = null }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [formData, setFormData] = useState({ title: '', description: '', category: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories]=useState([]);

       const config = useMemo(() => ({
        readonly: false,
         spellcheck: true,
         placeholder: isEditingNote ? '' : 'Start typing your detailed note here...',
         height: 'calc(100vh - 220px)',
         buttons: [
             'bold', 'italic', 'underline', 'strikethrough', '|',
             'heading', 'font', 'fontsize', '|',
             'ul', 'ol', '|',
             'outdent', 'indent', '|',
             'align', 'undo', 'redo', '|',
             'hr', 'eraser'
         ]
     }), [isEditingNote]);


const getCategories=async()=>{
    try {
        const res=await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`, {withCredentials:true});
        if(res.data.success){
            setCategories(res.data.response || []);
        }

    } catch (error) {
        toast.error("Error occured while fetching categories");
        console.error(error.message);
    }
}

useEffect(()=>{
    if(isOpen){
    getCategories()
    }
}, [isOpen]);



    useEffect(() => {
    if (!isOpen) return;

if (isEditingNote) {
    const c_id = isEditingNote.category;
    const catId = typeof c_id === "object" && c_id !== null ? c_id?._id : c_id;
    const categoryId = categories.find(cat => cat._id === catId || cat.c_name === c_id)?._id || "";

        setFormData({
            title: isEditingNote.title || '',
            description: isEditingNote.description || '',
            category: categoryId,
        });
        setContent(isEditingNote.description || '');
    } else {
        setFormData({ title: '', description: '', category: '' });
        setContent('');
    }
    setIsSubmitting(false);
}, [isEditingNote, isOpen, categories]);




    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isSubmitting) return;

        if (!formData.title.trim()) 
            return toast.error("Please add a title for your note.");
        setIsSubmitting(true);
        try {
            const noteId = isEditingNote?._id;
            const url = isEditingNote 
                ? `${import.meta.env.VITE_API_URL}/api/edit-note/${noteId}` 
                : `${import.meta.env.VITE_API_URL}/api/create-note`;
            
            const method = isEditingNote ? axios.put : axios.post;
            const response = await method(url, { ...formData, description: content }, { withCredentials: true });

            if (response.data.success) {
              onSaveNote?.(response.data.note); 
                toast.success(isEditingNote ? "Note updated successfully!" : "Note created successfully!");
               setFormData({ title: '', description: '', category: ''});
                setContent('');
                onClose();
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error(error.message || "Failed to save Note!");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-screen w-screen overflow-hidden">
            <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={onClose} className="p-2.5 cursor-pointer text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm font-semibold">Dashboard</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/notes.png" alt="Logo" className="h-7 w-auto" />
                        <span className="text-sm font-bold text-slate-800 hidden md:inline">StackNotes.</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl">
                        Cancel
                    </button>
                    <button type="submit" form="create-note-form" 
                    disabled={isSubmitting || !formData.title.trim()}
                     className="flex items-center cursor-pointer gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-40">
                        <Check className="w-4 h-4" />
                        <span>{isSubmitting ? 'Saving...' : 'Save Note'}</span>
                    </button>
                </div>
            </header>

            <form id="create-note-form" onSubmit={handleSubmit} 
            className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col gap-4 overflow-hidden">
                <input
                    type="text"
                    name="title"
                    placeholder="Untitled Note..."
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-300"
                    autoFocus
                />

                <div className="flex items-center gap-3 flex-wrap pb-2 border-b border-slate-200 ">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Category:</span>
                    </div>
                    <select name="category" value={formData.category} onChange={handleChange} disabled={categories.length===0} className="px-3 py-1.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-700 outline-none  disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="">
        {categories.length === 0 ? "No categories yet" : "Select category"}
    </option>
    {categories.map(cat => 
        <option key={cat._id} value={cat._id}>{cat.c_name}</option>
    )}
                    </select>

                  
                </div>

                <div className="flex-1 min-h-[400px]">
                    <JoditEditor ref={editor} value={content} config={config} 
                    onBlur={newContent => setContent(newContent)} />
                </div>

                <span className="text-xs text-slate-400">{getCharCount(content)} characters</span>
            </form>
        </div>
    );
};

export default CreateNote;