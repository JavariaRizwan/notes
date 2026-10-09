import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CreateNote from '../components/NotesPages/CreateNote';


jest.mock('axios');

jest.mock('react-hot-toast', () => {
    const mockToast = {
        success: jest.fn(),
        error: jest.fn(),
    };
    return {
        __esModule: true,
        default: mockToast,
        toast: mockToast,
    };
});

jest.mock('jodit-react', () => {
    return function DummyJodit({ onBlur }) {
        return (
            <textarea
                data-testid="mock-jodit-editor"
                onChange={(e) => onBlur(e.target.value)}
            />
        );
    };
});


describe("Create Note componens", ()=>{
    const onClose = jest.fn();
    const onSaveNote = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should no show when isOpen is false', () => {
        const { container } = render(
            <CreateNote isOpen={false} onClose={onClose} onSaveNote={onSaveNote} />
        );
        expect(container.firstChild).toBeNull();
    });


it('successfully creates a new note and calls onSaveNote', async () => {
        axios.get.mockResolvedValueOnce({
            data: { success: true, response: [] }
        });
        axios.post.mockResolvedValueOnce({
            data: { success: true, note: { id: 'note1', title: 'Test Note' } }
        });

        render(
            <CreateNote isOpen={true} onClose={onClose} onSaveNote={onSaveNote} />
        );

        const titleInput = screen.getByPlaceholderText('Untitled Note...');
        fireEvent.change(titleInput, { target: { name: 'title', value: 'Test Note' } });

        const saveButton = screen.getByRole('button', { name: /save note/i });
        fireEvent.click(saveButton);
try{
    await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${import.meta.env.VITE_API_URL}/api/create-note`,
                expect.objectContaining({
                    title: 'Test Note',
                    description: '',
                    category: '',
                }),
                { withCredentials: true }
            );
            expect(toast.success).toHaveBeenCalledWith('Note created successfully!');
            expect(onSaveNote).toHaveBeenCalledWith({ id: 'note1', title: 'Test Note' });
            expect(onClose).toHaveBeenCalled();
        });
    
}
catch(error){
    throw error;
}
    });


})

