import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';
import Signup from '../Auth/Signup';

jest.mock('axios');
jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );
};

const fillForm = (user = 'test_user', email = 'testing1@gmail.com', pass = '123456') => {
    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), { target: { name: 'username', value: user } });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { name: 'email', value: email } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { name: 'password', value: pass } });

};

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


 it('shoudl register user and navigate to /signin', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    renderComponent();
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    try{
    await waitFor(() => {

      expect(axios.post).toHaveBeenCalledWith(
          `${import.meta.env.VITE_API_URL}/api/save-user`,
        expect.objectContaining({
          username: 'test_user',
          email: 'testing1@gmail.com',
          password: '123456',
        })
      );
    });


    }
catch(error){
  throw error;
}
    expect(toast.success).toHaveBeenCalledWith('User registered successfully!');
    expect(mockNavigate).toHaveBeenCalledWith('/signin');
  });


it('should show error toast when email already exists', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 409,
        data: {
          success: false,
          message: "Email already exists!" 
        }
      }
    });

    renderComponent();
    fillForm();

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    try{
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Email already exists!');
    });
    }
    catch(error)
{
  throw error;
}
  });




})