"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ name: '', location: '', type: 'studio' });
  const [editingAddress, setEditingAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userRole === 'gerant') {
    fetchAddresses();
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/addresses',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    }
  };

  const validateAddress = (address) => {
    if (!address.name || !address.location || !address.type) {
      setErrorMessage('Tous les champs doivent être remplis.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleCreateAddress = async () => {
    if (validateAddress(newAddress)) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://165.232.115.209:8081/addresses', newAddress, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setNewAddress({ name: '', location: '', type: 'studio' });
        fetchAddresses();
      } catch (error) {
        console.error('Failed to create address', error);
      }
    }
  };

  const handleUpdateAddress = async () => {
    if (validateAddress(editingAddress)) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://165.232.115.209:8081/addresses/${editingAddress.id}`, editingAddress, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEditingAddress(null);
        fetchAddresses();
      } catch (error) {
        console.error('Failed to update address', error);
      }
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://165.232.115.209:8081/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen lg:min-h-[85vh]">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Gestion des Adresses</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex-1">
          <h2 className="text-xl font-semibold mb-6 text-black">Créer une Adresse</h2>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <select aria-label='selection type photo'
            data-testid="create-address-type"
            value={newAddress.type}
            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
            className="p-3 border border-gray-300 rounded mb-6 w-full focus:ring-purple-600 focus:border-purple-600"
          >
            <option aria-label='studio' value="studio">Studio</option>
            <option aria-label='studio' value="shooting">Shooting</option>
          </select>
          <input aria-label='adresse'
            type="text"
            data-testid="address-name"
            placeholder="Nom de l'adresse"
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            className="p-3 border border-gray-300 rounded mb-6 w-full focus:ring-purple-600 focus:border-purple-600"
          />
          <input aria-label='emplacement'
            type="text"
            placeholder="Emplacement de l'adresse"
            value={newAddress.location}
            onChange={(e) => setNewAddress({ ...newAddress, location: e.target.value })}
            className="p-3 border border-gray-300 rounded mb-6 w-full focus:ring-purple-600 focus:border-purple-600"
          />
          <button aria-label='créer'
            onClick={handleCreateAddress}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            Créer Adresse
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md flex-1">
          <h2 className="text-xl font-semibold mb-4 text-black">Adresses Existantes</h2>
          <div className="max-h-[400px] overflow-y-auto">
            <ul className="space-y-4">
              {addresses.map((address) => (
                <li key={address.id} className="bg-gray-50 rounded-lg p-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="text-gray-800">{address.name} - {address.location} ({address.type})</span>
                    <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 sm:space-x-2">
                      <button aria-label='modifier'
                        onClick={() => setEditingAddress(address)}
                        className="bg-lime-700 text-white py-1 px-3 rounded hover:bg-lime-800 transition"
                      >
                        Modifier
                      </button>
                      <button aria-label='supprimer'
                        onClick={() => handleDeleteAddress(address.id)}
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition mt-2 sm:mt-0"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {editingAddress && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 max-h-[80%] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-black">Modifier l'Adresse</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <input aria-label='nom adresse'
              type="text"
              placeholder="Nom modifié de l'adresse"
              value={editingAddress.name}
              onChange={(e) => setEditingAddress({ ...editingAddress, name: e.target.value })}
              className="p-3 border border-gray-300 rounded mb-4 w-full focus:ring-purple-600 focus:border-purple-600"
            />
            <input aria-label='emplacement adresse'
              type="text"
              placeholder="Emplacement modifié de l'adresse"
              value={editingAddress.location}
              onChange={(e) => setEditingAddress({ ...editingAddress, location: e.target.value })}
              className="p-3 border border-gray-300 rounded mb-4 w-full focus:ring-purple-600 focus:border-purple-600"
            />
            <select aria-label='choix type photo'
              data-testid="edit-address-type"
              value={editingAddress.type}
              onChange={(e) => setEditingAddress({ ...editingAddress, type: e.target.value })}
              className="p-3 border border-gray-300 rounded mb-4 w-full focus:ring-purple-600 focus:border-purple-600"
            >
              <option aria-label='studio' value="studio">Studio</option>
              <option aria-label='shooting' value="shooting">Shooting</option>
            </select>
            <div className='flex lg:flex-row flex-col justify-left'>
              <button aria-label='mettre à jour'
                onClick={handleUpdateAddress}
                className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-500 transition"
              >
                Mettre à jour Adresse
              </button>
              <button aria-label='annuler'
                onClick={() => setEditingAddress(null)}
                className="bg-gray-400 text-gray-800 py-2 px-4 rounded hover:bg-gray-500 transition mt-2 lg:mt-0 lg:ml-2 ml-0"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
