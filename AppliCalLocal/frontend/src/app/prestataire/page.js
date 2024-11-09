"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/authContext';
import Loader from '../../components/Loader';

export default function Prestataire() {
  const { isAuthenticated, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && userRole === 'gerant') {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, userRole]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (userId) => {
    router.push(`/prestataire/${userId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || userRole !== 'gerant') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg rounded-lg border border-gray-300">
          <h1 className="text-2xl font-bold text-center text-gray-800">Accès refusé</h1>
          <p className="text-center text-gray-700 mt-2">Vous n'avez pas la permission d'accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-200 h-[90vh]">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Liste des Prestataires</h1>
      {error && <p className="text-red-500 mb-6 text-lg font-medium">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {users.map(user => (
          <div key={user.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300 transform transition-transform hover:scale-105">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {user.username.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ')}
              </h2>
              <p className="text-gray-600 mt-1 capitalize">
                Role: <span className="font-medium text-gray-800">{user.role.split(' ').map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(' ')}</span>
              </p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
              <button aria-label='voir les détails'
                onClick={() => handleViewDetails(user.id)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Voir les détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
