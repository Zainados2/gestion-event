"use client"
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../app/contexts/authContext'; // Importez useAuth

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const { updateAuthContext } = useAuth(); // Importez updateAuthContext
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081', {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
       await updateAuthContext();
        router.push('/calendar'); 
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg rounded-lg lg:w-1/3">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Connexion</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="username">
              Nom d'utilisateur
            </label>
            <input
            name='username'
              type="text"
              id="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="password">
              Mot de passe
            </label>
            <input
            name='password'
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full text-white bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
