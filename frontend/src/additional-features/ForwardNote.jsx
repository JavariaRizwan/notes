import React, { useState, useEffect } from 'react';
import { Mail, X, Check, FileText, ArrowLeftIcon, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ForwardNote = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-notes`, { withCredentials: true });
                if (response.data.success) {
                    setNotes(response.data.notes || []);
                }
            } catch (error) {
                console.error("Failed to load notes", error);
                toast.error("Error occured whle fetching notes.");
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const handleSelectNote = async(note) => {
        setSelectedNoteId(note._id);
        
        const noteContentText = `------------Note Details
Title: ${note.title || 'Untitled Note'}
Description: 
${note.description || ''}

-----------------
Sent via StackNotes`;

       try {
            await navigator.clipboard.writeText(noteContentText);
            toast.success("Note copied to clipboard!");
        } catch {
            toast.error("Could not copy the note to the clipboard.");
        }
    };

    const handleOpenEmail = () => {
        const note = notes.find(n => (n._id) === selectedNoteId);
        if (!note) {
            toast.error("Please select a note first.");
            return;
        }

        const subject = encodeURIComponent(`Shared Note: ${note.title}`);
        const body = encodeURIComponent(`*Note Content*\nTitle: ${note.title}\n\n${note.description}\n\nSent via StackNotes`);
        

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

        // window.location.href = `mailto:?subject=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
        setIsModalOpen(false);
        setSelectedNoteId(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
            
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                
                <button 
                    type="button"
                    onClick={() => navigate('/user_dashboard')}
                    className="inline-flex items-center cursor-pointer gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-white p-6 sm:p-8 rounded-2xl border border-blue-100">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            <Send className="w-3.5 h-3.5" /> Quick Share
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Instantly send your note to anyone using StackNotes.
                        </h1>
                        <p className="text-sm text-slate-600 max-w-xl">
                            Select any of your saved notes, copy them instantly to your clipboard, and forward them via email with just a click.
                        </p>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                        <Mail className="w-4 h-4" />
                        Forward note via email
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-xs text-blue-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Notes</p>
                            <p className="text-lg font-bold text-slate-900">{loading ? 'Loading...' : notes.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
                    <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
                        
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Select Note(s) to Forward
                                </h3>
                            </div>
                            <button 
                            type="button"
                                onClick={() =>{setIsModalOpen(false); setSelectedNoteId(null);}}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-500">
                            Choose a note below. Checking it will automatically copy its content to your clipboard.
                        </p>

                        <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                            {notes.length === 0 ? (
                                <p className="text-center text-sm text-slate-400 py-8">No notes found to forward.</p>
                            ) : (
                                notes.map((note) => {
                                    const noteId = note._id || note.id;
                                    const isSelected = selectedNoteId === noteId;
                                    const isDisabled = selectedNoteId !== null && !isSelected;
                                    return (
                                        <button
                                        type="button"
                                            key={noteId}
                                            onClick={() => handleSelectNote(note)}
                                            disabled={isDisabled}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                                isSelected 
                                                    ? 'bg-blue-50/80 border-blue-300 shadow-xs' 
                                                    : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                                                }`}>
                                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                </div>
                                                <span className="text-sm font-medium text-slate-800 truncate">
                                                    {note.title || "Untitled Note"}
                                                </span>
                                                   <span className="text-sm font-medium text-slate-800 truncate">
                                                    {note.description || ""}
                                                </span>
                                            </div>

                                        </button>
                                    );
                                })
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                            <button
    type="button"
onClick={() => { setIsModalOpen(false); setSelectedNoteId(null); }}
                                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                    type="button"
                 onClick={handleOpenEmail}
                                disabled={!selectedNoteId}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all ${
                                    selectedNoteId 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                <Mail className="w-4 h-4" />
                                Open Gmail & Send
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ForwardNote;