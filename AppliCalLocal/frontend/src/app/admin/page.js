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

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Inscription</h2>
        {error.global && <p className="text-red-500 mb-4">{error.global}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          {error.username && <p className="text-red-500">{error.username}</p>}
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          {error.password && <p className="text-red-500">{error.password}</p>}
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionnez un rôle</option>
            <option value="gerant">Gérant</option>
            <option value="photographe">Photographe</option>
            {/* Ajoutez les rôles restants */}
          </select>
          {error.role && <p className="text-red-500">{error.role}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">S'inscrire</button>
        </form>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Liste des Utilisateurs</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id} className="flex justify-between items-center p-4 border-b">
                <span>{user.username} - {user.role}</span>
                <div className="space-x-2">
                  <button onClick={() => handleEditClick(user)} className="bg-lime-700 text-white px-3 py-1 rounded hover:bg-lime-800 transition">Modifier</button>
                  <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700transition">Supprimer</button>
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
