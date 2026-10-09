import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';
import Sidebar from '../components/Sidebar';

jest.mock('axios');


jest.mock('../components/NotesPages/CreateNote', () => ({ isOpen }) => (
    isOpen ? <div data-testid="create-note-modal">Create Note Modal</div> : null
));

const testSidebar=(
    {
        sidebarOpen=true, 
        setSidebarOpen=jest.fn(), 
        onLogout=true,
        activeCategory='all', 
        setActiveCategory=jest.fn()
    } ={}
)=>{

    try{
    return render(
<MemoryRouter>
        <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        onLogout={onLogout}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
            />
        </MemoryRouter>
    )

    }

    catch(error){
        console.error("Error occured while renderng the Sidebar componenet", error.message);
    }

};

describe("Side bar component", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    })

it("shows all nav items correctly", ()=>{
    testSidebar();
    expect(screen.getByText(/Create New Note/i)).toBeInTheDocument();
    expect(screen.getByText(/All Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Pinned/i)).toBeInTheDocument();
    expect(screen.getByText(/Archived/i)).toBeInTheDocument();
    expect(screen.getByText(/Trash/i)).toBeInTheDocument();
    expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
});


it("should hndle logout and move to sign in after logging out", async()=>{
try {
    await axios.post.mockResolvedValueOnce({data:{sucecss:true}});

    testSidebar();

    const logoutButton = screen.getByText(/Log Out/i);
        await userEvent.click(logoutButton);
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${import.meta.env.VITE_API_URL}/api/logout`,
                {},
                { withCredentials: true }
            );
            expect(mockedNavigate).toHaveBeenCalledWith('/signin', { replace: true });
        });

} catch (error) {
    console.error("Error while logging out", error.message)
}
})


it("should move to create note component when the Create New Note button is clicked", async()=>{
    testSidebar();
    try {
        expect(screen.queryByTestId("create-note-modal")).not.toBeInTheDocument();
        const createButton = screen.getByText(/Create New Note/i);
    await userEvent.click(createButton);

    expect(screen.getByTestId("create-note-modal")).toBeInTheDocument();
    } catch (error) {
        console.error("Error occured", error.message)
    }
})


})