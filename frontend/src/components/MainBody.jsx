

import { toast } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import CreateNote from './NotesPages/CreateNote';
import DOMPurify from 'dompurify'

import {RotateCcw, Trash2, ArchiveRestore, Archive, Pin, Pencil, Plus} from 'lucide-react'

import axios from "axios";
import SortDropDown from "./NotesPages/SortDropDown";
import sortingOptions from '../data/sortingOptions';

import DownloadNote from '../additional-features/DownloadNote';
import ImportFile from "../additional-features/ImportFile"



import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  justify-content: center;
  color: #ffffff;
  background-image: linear-gradient(to bottom right, #9333ea, #3b82f6);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.375rem 0.5rem;
  text-align: center;
  transition: all 0.15s ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: none;

  &:hover {
    background-image: linear-gradient(to bottom left, #9333ea, #3b82f6);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px #93c5fd, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 640px) {
    padding: 0.625rem 1rem;
  }
`;


const Actions=styled.button`
position: relative;
  z-index: 20;
  pointer-events: auto;
  padding: 0.375rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #94a3b8;
  background: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease, background-color 0.15s ease;

  opacity: 0;
  .group:hover & {
    opacity: 1;
  }

 &:hover {
    color: ${({ $hoverColor }) => $hoverColor || '#2563eb'};
    background-color: #f1f5f9;
  }
`


const Card=styled.div`
width: 100%;
  text-align: left;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: all 0.3s ease-in-out;
  position: relative;
  border-left-width: 4px;
  border-left-color: ${({ isPinned }) => (isPinned ? '#f59e0b' : '#3b82f6')};
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  @media (min-width: 640px) {
    padding: 1.25rem;
  }
`


const getNoteActionButtons=(currentCategory, note, currentId, buttonHandlers)=>{
  const { handleDelete, openDeletePopup, handleArchive, handlePin, handleUpdate } = buttonHandlers;




  switch(currentCategory){
    case "trash":
      return (
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 pointer-events-none group-hover:pointer-events-auto">


                          <Actions
                            type="button"
                            onClick={(e) => handleDelete(e, currentId)}
                            title="Restore note"
                            $hoverColor="#3b82f6"

                         >
                            <RotateCcw className="w-4 h-4 pointer-events-none" strokeWidth={2} />

                          </Actions>


                        
                        <Actions
                          type="button"
                          onClick={(e) => openDeletePopup(e, currentId)}
                          title="Delete note"
  $hoverColor="#f43f5e"
                        >
            <Trash2 className="w-4 h-4 pointer-events-none" strokeWidth={2} />
                        </Actions>

                      </div>

      )

      case "archived":
        return (
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 pointer-events-none group-hover:pointer-events-auto">


                          <Actions
                            type="button"
                            onClick={(e) => handleArchive(e, currentId)}
                            title="Un Archive note"
                          $hoverColor="#d97706"

                          >
            <ArchiveRestore className="w-4 h-4 pointer-events-none" strokeWidth={2} />

                          </Actions>



                          <Actions
                            type="button"
                            onClick={(e) => handleDelete(e, currentId)}
                            title="Delete note"
  $hoverColor="#f43f5e"

                          >
            <Trash2 className="w-4 h-4 pointer-events-none" strokeWidth={2} />
                          </Actions>
                        </div>
        )

        default:
          return (
                                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 pointer-events-none group-hover:pointer-events-auto">

  <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePin(e, currentId);
                          }}
                          title={note.isPinned ? "Unpin note" : "Pin note"}
                          className={`relative z-20 pointer-events-auto p-1.5 cursor-pointer rounded-lg transition-colors ${note.isPinned
                              ? "text-amber-500 bg-amber-100/50 hover:bg-amber-200/50"
                              : "text-slate-400 hover:text-amber-500 hover:bg-slate-100"
                            }`}
                        >
 <Pin
              className="w-4 h-4 pointer-events-none"
              strokeWidth={2}
              fill={note.isPinned ? "currentColor" : "none"}
            />                        </button>


                        <Actions
                          type="button"
                          onClick={(e) => handleArchive(e, currentId)}
                          title="Archive note"
                              $hoverColor="#d97706"

         >
                          <Archive className="w-4 h-4 pointer-events-none" strokeWidth={2} />

                        </Actions>


                        <Actions
                          type="button"
                          onClick={(e) => handleUpdate(e, note)}
                          title="Edit note"
                              $hoverColor="#2563eb"

>
            <Pencil className="w-4 h-4 pointer-events-none" strokeWidth={2} />
                        </Actions>


                          <Actions
                            type="button"
                            onClick={(e) => handleDelete(e, currentId)}
                            title="Delete note"
  $hoverColor="#f43f5e"

>
            <Trash2 className="w-4 h-4 pointer-events-none" strokeWidth={2} />
                          </Actions>

</div>

          )


  }
}




const MainBody = ({ activeCategory, searchQuery, categories=[], onSelectCategory}) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [isEditingNote, setIsEditingNote] = useState(null)
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const parseFileContent=(content)=>{
    const title=content.match(/^Title:(.*)$/m)
    const category=content.match(/^Category:(.*)$/m)
    const description=content.match(/Description:\n([\s\S]*)/)

    if(!title){ throw new Error('Invalid file format')};
    return {
        title: title[1].trim(),
        category: category ? category[1].trim() : '',
        description: description ? description[1].trim() : '',
    };

  }




  const handleFileImport=(fileContent)=>{
    try {
   const parseddata=parseFileContent(fileContent);
   const rawCategory = parseddata.category;

const safeCategory = (typeof rawCategory === "string" && rawCategory.includes("object Object")) 
  ? "" 
  : (rawCategory?._id || rawCategory || ""); 
   setIsEditingNote({
      title:parseddata.title || "",
      description:parseddata.description || "",
      category:safeCategory,
         });
    setIsModelOpen(true);
      
    } 
    catch (error) {
  console.error("Error occured while parsing data in the file", error.message);
  toast.error("Inavid File Format")      
    }
  }


  const currentCategory = activeCategory || "all";


  const getAllNotes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user-notes`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Fetch notes error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch notes");
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);


  const openDeletePopup = (e, noteId) => {
    e.stopPropagation();
    setDeletingNoteId(noteId);
  };

  const closeDeletePopup = () => {
    setDeletingNoteId(null);
  };


  const handleOpenCreateModal = () => {
    setIsEditingNote(null);
    setIsModelOpen(true);
  };

  const handleCloseModal = () => {
    setIsModelOpen(false);
    setIsEditingNote(null);
  };


  const filteredNotes = notes.filter((note) => {

    if (note.isDeleted && currentCategory !== "trash") {
      return false;
    }

    const query = searchQuery?.toLowerCase().trim() || '';
    const matchingSearch = query === '' ||
      note.title?.toLowerCase().includes(query) || note.description?.toLowerCase().includes(query)
      || note.category?.c_name.toLowerCase().includes(query);

    if (currentCategory === "pinned") { return (note.isPinned && matchingSearch) };
    if (!currentCategory || currentCategory === "all") { return !note.isArchived && matchingSearch; }
    if (currentCategory === "trash") { return note.isDeleted && matchingSearch; }
    if (currentCategory === "archived") { return note.isArchived && matchingSearch; }

    return note.category?.c_name === currentCategory && matchingSearch;
  });


const filteredCategories = categories.filter((cat) => {
  const catName = typeof cat === 'string' ? cat : cat.c_name;
  const query = searchQuery?.toLowerCase().trim() || '';
  return query === '' || catName?.toLowerCase().includes(query);
});


  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const activeOption = sortingOptions.find((option) => option.value === sortBy);
    return activeOption?.compareFn ? activeOption.compareFn(a, b) : 0;
  });



  const handleSaveNote = () => {
    getAllNotes();
    setIsModelOpen(false);
    setIsEditingNote(null);
  };


  const handleKeyDownNote = (e, note) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleUpdate(e, note);
    }
  };


  const handleArchive = async (e, noteId) => {
    e.stopPropagation();
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/archive-note/${noteId}`, {}, { withCredentials: true });
      if (response.data?.success) {
        toast.success(response.data.message || "Note archived successfully");
        getAllNotes();
      }
    }

    catch (error) {
      toast.error("Failed to archive note");
      console.error("Error while archiving the note", error.message);
    }
  }


  const handlePermanentDelete = async (e, noteId) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/permanent-delete/${noteId}`, { withCredentials: true });
      if (response.data?.success) {
        toast.success(`Note ${noteId} deleted successfully`);
        getAllNotes();
      }

    } catch (error) {
      toast.error("Error happened while deleting");
      console.error(error.message);
    }
  }



  const handlePin = async (e, noteId) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pin-note/${noteId}`,
        {},
        { withCredentials: true }
      );
      if (response.data?.success) {
        toast.success(response.data.message || "Pin status updated");
        getAllNotes();
      }
    } catch (error) {
      console.error("Pin error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to pin note");
    }
  };

  const handleDelete = async (e, noteId) => {
    e.stopPropagation();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/delete-note/${noteId}`,
        {},
        { withCredentials: true }
      );
      if (response.data?.success) {
        toast.success(response.data.message || "Note deleted successfully");
        getAllNotes();
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error("Failed to delete note");
    }
  };

  const handleUpdate = async (e, note) => {
    e.stopPropagation();
    setIsEditingNote(note);
    setIsModelOpen(true);
  };



const getNoteTitle=()=>{
if(currentCategory==='categories'){
  return 'All Categories';
}
if(activeCategory){
  return `${activeCategory} Notes`
}
return 'My Notes'
}



const renderMainContent = () => {
  if (currentCategory === 'categories') {
    if (filteredCategories.length === 0) {
      return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <p className="text-slate-500 text-sm">No categories found.</p>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => {
            const catName = typeof cat === 'string' ? cat : cat.c_name;
            const catId = cat._id || cat.id;
            return (
              <button 
                type="button" 
                key={catId}
                onClick={() => onSelectCategory ? onSelectCategory(catId) : console.log(catId)}
                className="w-full text-left bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-between group hover:-translate-y-0.5"
              >
                <p className="text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                  {catName}
                </p>
              </button>
            );
          })}
        </div>
      );
    }
  } else if (sortedNotes.length === 0) {
    return (
      <Card>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
            No {currentCategory} notes found
          </h3>
        </div>
      </Card>
    );
  } else {
    return (
      <div className="space-y-4">
        {sortedNotes.map((note) => {
          const currentId = note._id || note.id;
          return (
            <Card 
              className="group"
              isPinned={note.isPinned}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDownNote(e, note)}
              onClick={(e) => handleUpdate(e, note)}
              key={currentId}
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold line-clamp-1 text-slate-900 text-base sm:text-lg">
                    {note.title}
                  </h3>
                  <span className="w-fit text-xs text-blue-600 bg-blue-50 font-medium px-2 py-0.5 rounded-full">
                    {note.category?.c_name || "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {getNoteActionButtons(currentCategory, note, currentId, {
                    handleDelete,
                    openDeletePopup,
                    handleArchive,
                    handlePin,
                    handleUpdate
                  })}
                  <DownloadNote note={note} />
                </div>
              </div>
              <div
                className="text-slate-600 text-sm mt-1 line-clamp-1 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(note.description || '')
                }}
              />
            </Card>
          );
        })}
      </div>
    );
  }
};





  return (
    <>
      <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight capitalize">
              {getNoteTitle()}

            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {currentCategory === 'categories' 
                ? 'Manage and view all your note categories' 
                : 'Manage and organize your ideas'}
            </p>
          </div>

<div className="flex items-center gap-2 sm:gap-3 shrink-0">
<Button
  type="button"
  onClick={handleOpenCreateModal}
> 
  <Plus className="w-4 h-4" strokeWidth={2.5} />

  <span className="hidden sm:inline">New Note</span>
</Button>

<ImportFile onFileImport={handleFileImport}/>
</div>


        </div>

{currentCategory!=="categories" &&
        <SortDropDown sortBy={sortBy} setSortBy={setSortBy} />

}



<div className="space-y-3">

{renderMainContent()}


        </div>


      </main>

      <CreateNote
        isOpen={isModelOpen}
        onClose={handleCloseModal}
        onSaveNote={handleSaveNote}
        isEditingNote={isEditingNote}
      />

      {deletingNoteId && (
        <div id="delete-confirmation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p className="text-lg font-bold mb-2">⚠️ Warning</p>
            <p className="text-sm text-gray-600 mb-4">Do you really want to delete it? It will be permanent and you can't recover it.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeletePopup}
                className="px-4 py-2 bg-gray-200 rounded text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  handlePermanentDelete(e, deletingNoteId);
                  closeDeletePopup();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

      )}


    </>
  );
};

export default MainBody;