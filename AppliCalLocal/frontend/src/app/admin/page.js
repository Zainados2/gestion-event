"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/authContext";
import Loader from "../../components/Loader";

export default function ManageUsersAndRegister() {
  const { isAuthenticated, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && userRole === "gerant") {
      fetchUsers();
    }
    setIsLoading(false);
  }, [isAuthenticated, userRole]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://165.232.115.209:8081/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError({ global: response.data.message });
      }
    } catch (error) {
      setError({ global: "Une erreur s'est produite. Veuillez réessayer." });
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://165.232.115.209:8081/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        fetchUsers();
      } else {
        setError({ global: response.data.message });
      }
    } catch (error) {
      setError({ global: "Une erreur s'est produite. Veuillez réessayer." });
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: "",
      role: user.role,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData.username || !formData.role) {
      setError({
        username: !formData.username ? "Nom d'utilisateur requis" : "",
        role: !formData.role ? "Rôle requis" : "",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://165.232.115.209:8081/users/${selectedUser.id}`,
        {
          username: formData.username,
          password: formData.password,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setShowModal(false);
        fetchUsers();
      } else {
        setError({ global: response.data.message });
      }
    } catch (error) {
      setError({ global: "Une erreur s'est produite. Veuillez réessayer." });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || userRole !== "gerant") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 text-left bg-white shadow-lg rounded-lg">
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
        {/* Liste des utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Liste des Utilisateurs</h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-lg"
              >
                <span className="text-gray-800">{user.username} - {user.role}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Modifier l'utilisateur</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium" htmlFor="username">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium" htmlFor="password">
                  Mot de passe (laisser vide pour ne pas modifier)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium" htmlFor="role">
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="gerant">Gérant</option>
                  <option value="photographe">Photographe</option>
                  <option value="photographeassistant">Photographe Assistant</option>
                  <option value="decorateur">Décorateur</option>
                  <option value="decorateurassistant">Décorateur Assistant</option>
                  <option value="chauffeur">Chauffeur</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
