"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/authContext";
import Loader from "../../components/Loader";

export default function ManageUsersAndRegister() {
  const { isAuthenticated, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [modalFormData, setModalFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
        headers: { Authorization: `Bearer ${token}` },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, role } = formData;
    const token = localStorage.getItem("token");

    if (!username || !password || !role) {
      setError({
        username: !username ? "Nom d'utilisateur est requis" : "",
        password: !password ? "Mot de passe est requis" : "",
        role: !role ? "Rôle est requis" : "",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://165.232.115.209:8081/users",
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchUsers();
        setFormData({ username: "", password: "", role: "" });
        setError({});
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
        headers: { Authorization: `Bearer ${token}` },
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
    setFormData({ username: user.username, password: "", role: user.role });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { username, password, role } = formData;
    if (!username || !role) {
      setError({
        username: !username ? "Nom d'utilisateur requis" : "",
        role: !role ? "Rôle requis" : "",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://165.232.115.209:8081/users/${selectedUser.id}`,
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
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

  if (isLoading) return <Loader />;
  if (!isAuthenticated || userRole !== "gerant") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 text-left bg-white shadow-lg rounded-lg">
          <h1 className="text-xl font-bold text-center">Accès refusé</h1>
          <p className="text-center text-gray-600">Vous n'avez pas la permission d'accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Gestion des Utilisateurs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Formulaire d'inscription */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '400px' }}>
          <h2 className="text-xl font-semibold mb-4 text-black">Inscription</h2>
          {error.global && <p className="text-red-500 mb-4">{error.global}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-auto">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="username">Nom d'utilisateur</label>
              <input
                name="username"
                id="username"
                aria-label="Nom d'utilisateur"
                type="text"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              />
              {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Mot de passe</label>
              <input
                name="password"
                id="password"
                aria-label="Mot de passe"
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              />
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="role">Rôle</label>
              <select
                name="role"
                id="role"
                aria-label="Sélectionnez un rôle"
                value={formData.role}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
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
            <button
              aria-label="Inscrire"
              type="submit"
              className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              S'inscrire
            </button>
          </form>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-md overflow-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">Liste des Utilisateurs</h2>
          {error.global && <p className="text-red-500 mb-4">{error.global}</p>}
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead>
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Nom d'utilisateur</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Rôle</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="p-4 text-sm font-medium text-gray-800">{user.username}</td>
                    <td className="p-4 text-sm font-medium text-gray-800">{user.role}</td>
                    <td className="p-4 text-center">
                      <button
                        aria-label={`Modifier ${user.username}`}
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Modifier
                      </button>
                      <button
                        aria-label={`Supprimer ${user.username}`}
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-sm text-gray-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-black">Modifier l'utilisateur</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="username">Nom d'utilisateur</label>
              <input
                name="username"
                id="username"
                aria-label="Nom d'utilisateur"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              />
              {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="role">Rôle</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              >
                <option value="gerant">Gérant</option>
                <option value="photographe">Photographe</option>
                <option value="photographeassistant">Photographe Assistant</option>
                <option value="decorateur">Décorateur</option>
                <option value="decorateurassistant">Décorateur Assistant</option>
                <option value="chauffeur">Chauffeur</option>
              </select>
              {error.role && <p className="text-red-500 text-sm mt-1">{error.role}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Mot de passe</label>
              <input
                name="password"
                id="password"
                aria-label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdate}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
