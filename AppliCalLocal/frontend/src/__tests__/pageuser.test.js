import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import axios from 'axios';
import LoginPage from '../app/page'; 
import { useAuth } from '../app/contexts/authContext'; 

jest.mock('../app/contexts/authContext', () => ({
  useAuth: () => ({
    updateAuthContext: jest.fn(), 
  }),
}));

jest.mock('axios'); 

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(), 
}));

describe('LoginPage Component', () => {
  let useRouterMock;

  beforeEach(() => {
    useRouterMock = require('next/navigation').useRouter; 
    useRouterMock.mockReturnValue({
      push: jest.fn(), 
    });

    jest.clearAllMocks(); 
  });

  test('should successfully login with correct credentials', async () => {
    axios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mocked_token', 
      },
    });

    render(<LoginPage />); 

    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'gerant' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'azerty619' } });

    fireEvent.click(screen.getByText(/Se connecter/i)); 

    await waitFor(() => {
      expect(useRouterMock().push).toHaveBeenCalledWith('/calendar'); 
    });

    expect(localStorage.getItem('token')).toBe('mocked_token'); 
  });

  test('should fail to login with incorrect credentials', async () => {
    axios.post.mockResolvedValue({
      data: {
        success: false,
        message: 'Identifiants incorrects', 
      },
    });

    render(<LoginPage />); 

    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'incorrect_user' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'wrong_password' } });

    fireEvent.click(screen.getByText(/Se connecter/i)); 

    await waitFor(() => {
      expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument(); 
    });
  });

  test('should handle server error', async () => {
    axios.post.mockRejectedValue(new Error('Erreur serveur')); 

    render(<LoginPage />); 

    fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'gerant' } });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'azerty619' } });

    fireEvent.click(screen.getByText(/Se connecter/i)); 

    await waitFor(() => {
      expect(screen.getByText("Une erreur s'est produite. Veuillez réessayer.")).toBeInTheDocument(); 
    });
  });
});
