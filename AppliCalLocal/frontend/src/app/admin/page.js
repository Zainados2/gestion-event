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
    if (isAuthenticated && (userRole === "gerant" || userRole === "admin")) {
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

  const handleCreateSubmit = async (e) => {
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

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setModalFormData({ username: user.username, password: "", role: user.role });
    setShowModal(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { username, password, role } = modalFormData;
    if (!username || !role) {
      setError({
        username: !username ? "Nom d'utilisateur requis" : "",
        role: !role ? "Rôle requis" : "",
      });
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir modifier ce compte utilisateur ?')) {
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
  }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
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
    }}
  };

  if (isLoading) return <Loader />;
  if (!isAuthenticated || userRole !== "gerant" && userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="px-8 py-6 text-left bg-gray-50 shadow-lg rounded-lg">
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

        <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '400px' }}>
          <h2 className="text-xl font-semibold mb-4 text-black">Inscription</h2>
          {error.global && <p className="text-red-500 mb-4">{error.global}</p>}
          <form onSubmit={handleCreateSubmit} className="flex flex-col flex-grow overflow-auto">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="username">Nom d'utilisateur</label>
              <input
                name="username"
                id="username"
                aria-label="Nom d'utilisateur"
                type="text"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
              className="w-full text-white bg-lime-700 hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Créer un utilisateur
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '400px', overflow:'auto' }}>
          <h2 className="text-xl font-semibold mb-4 text-black">Utilisateurs existants</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Modifier l'utilisateur</h2>
            {error.global && <p className="text-red-500 mb-4">{error.global}</p>}
            <form className="flex flex-col">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium" htmlFor="modalUsername">Nom d'utilisateur</label>
                <input
                  name="username"
                  id="modalUsername"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={modalFormData.username}
                  onChange={handleModalInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="modalPassword">Mot de passe</label>
                <input
                  name="password"
                  id="modalPassword"
                  type="password"
                  placeholder="Mot de passe"
                  value={modalFormData.password}
                  onChange={handleModalInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="modalRole">Rôle</label>
                <select
                  name="role"
                  id="modalRole"
                  value={modalFormData.role}
                  onChange={handleModalInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="gerant">Gérant</option>
                  <option value="photographe">Photographe</option>
                  <option value="photographeassistant">Photographe Assistant</option>
                  <option value="decorateur">Décorateur</option>
                  <option value="decorateurassistant">Décorateur Assistant</option>
                  <option value="chauffeur">Chauffeur</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
