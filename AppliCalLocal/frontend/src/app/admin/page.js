"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/authContext';
import Loader from '../../components/Loader';

export default function ManageUsersAndRegister() {
  const { isAuthenticated, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && userRole === 'gerant') {
      fetchUsers();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, userRole]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8081/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError({ global: response.data.message });
      }
    } catch (error) {
      setError({ global: 'Une erreur s\'est produite. Veuillez réessayer.' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8081/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        fetchUsers();
      } else {
        setError({ global: response.data.message });
      }
    } catch (error) {
      setError({ global: 'Une erreur s\'est produite. Veuillez réessayer.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    // Vérification des champs vides
    if (!username || !password || !role) {
      setError({
        username: !username ? "Nom d'utilisateur est requis" : '',
        password: !password ? 'Mot de passe est requis' : '',
        role: !role ? 'Rôle est requis' : '',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/users', {
        username,
        password,
        role,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

      if (response.data.success) {
        fetchUsers();
        // Réinitialiser les champs du formulaire et les erreurs
        setUsername('');
        setPassword('');
        setRole('');
        setError({});
      } else {
        setError({ global: response.data.message });
      }
    } catch (error) {
      setError({ global: 'Une erreur s\'est produite. Veuillez réessayer.' });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || userRole !== 'gerant') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg rounded-lg">
          <h1 className="text-xl font-bold text-center text-black">Accès refusé</h1>
          <p className="text-center text-gray-600">Vous n'avez pas la permission d'accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">Gestion des Utilisateurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloc Inscription */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '400px' }}>
          <h3 className="text-xl font-semibold mb-4 text-black">Inscription</h3>
          {error.global && <p className="text-red-500 mb-4">{error.global}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-auto">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="username">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="role">
                Rôle
              </label>
              <select
                id="role"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Sélectionnez un rôle</option>
                <option value="gerant">Gérant</option>
                <option value="photographe">Photographe</option>
                <option value="photographeassistant">Photographe Assistant</option>
                <option value="decorateur">Décorateur</option>
                <option value="decorateurassistant">Décorateur Assistant</option>
                <option value="chauffeur">Chauffeur</option>
              </select>
              {error.role && <p className="text-red-500 text-sm mt-1">{error.role}</p>}
            </div>
            <button type="submit" className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              S'inscrire
            </button>
          </form>
        </div>

        {/* Bloc Liste des Utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '400px' }}>
          <h3 className="text-xl font-semibold mb-4 text-black">Liste des Utilisateurs</h3>
          {error.global && <div className="text-red-500 mb-4">{error.global}</div>}
          <div className="flex-1 overflow-auto">
            <ul className="space-y-4">
              {users.map(user => (
                <li key={user.id} className="flex lg:flex-row flex-col items-left justify-between p-4 border-b border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                  <span className="text-gray-800">{user.username} - {user.role}</span>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition mt-2 w-24"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
