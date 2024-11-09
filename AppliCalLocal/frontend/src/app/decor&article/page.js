"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import Loader from '../../components/Loader';
import Modal from '../../components/modaldecor';

export default function DecorArticle() {
  const { isAuthenticated, userRole } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [decors, setDecors] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', deteriorated: false, lost: false });
  const [newDecor, setNewDecor] = useState({ name: '' });
  const [selectedArticleIds, setSelectedArticleIds] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingDecor, setEditingDecor] = useState(null);
  const [editingDecorArticleIds, setEditingDecorArticleIds] = useState([]);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isDecorModalOpen, setIsDecorModalOpen] = useState(false);
  const [decorArticles, setDecorArticles] = useState([]);

  // États pour les messages d'erreur
  const [articleError, setArticleError] = useState('');
  const [decorError, setDecorError] = useState('');

  useEffect(() => {
    if (isAuthenticated && userRole === 'gerant') {
      loadArticles();
      loadDecors();
      loadDecorArticles();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, userRole]);

  const loadArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/articles',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllArticles(response.data.sort((a, b) => a.title.localeCompare(b.title)));
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    }
  };

  const loadDecors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/decors', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDecors(response.data.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Erreur lors du chargement des décors:', error);
    }
  };

  const handleCreateArticle = async () => {
    if (!newArticle.title) {
      setArticleError('Le titre de l\'article est requis.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://165.232.115.209:8081/articles', newArticle, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });      
      setAllArticles(prevArticles => [...prevArticles, response.data].sort((a, b) => a.title.localeCompare(b.title)));
      setNewArticle({ title: '', deteriorated: false, lost: false });
      setIsArticleModalOpen(false);
      setArticleError(''); // Réinitialiser le message d'erreur
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
    }
  };

  const handleUpdateArticle = async () => {
    if (!editingArticle.title) {
      setArticleError('Le titre de l\'article est requis.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://165.232.115.209:8081/articles/${editingArticle.id}`, editingArticle, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllArticles(prevArticles =>
        prevArticles.map(article => article.id === editingArticle.id ? editingArticle : article)
          .sort((a, b) => a.title.localeCompare(b.title))
      );
      setEditingArticle(null);
      setIsArticleModalOpen(false);
      setArticleError(''); // Réinitialiser le message d'erreur
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://165.232.115.209:8081/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllArticles(prevArticles => prevArticles.filter(article => article.id !== id).sort((a, b) => a.title.localeCompare(b.title)));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
    }
  };

  const handleCreateDecor = async () => {
    if (!newDecor.name) {
      setDecorError('Le nom du décor est requis.');
      return;
    }
    if (selectedArticleIds.length < 2) {
      setDecorError('Au moins deux articles doivent être sélectionnés.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://165.232.115.209:8081/decors', {
        name: newDecor.name,
        articleIds: selectedArticleIds
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });      
      setDecors(prevDecors => [...prevDecors, response.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewDecor({ name: '' });
      setSelectedArticleIds([]);
      setIsDecorModalOpen(false);
      setDecorError(''); // Réinitialiser le message d'erreur
    } catch (error) {
      console.error('Erreur lors de la création du décor:', error);
    }
  };

  const handleUpdateDecor = async () => {
    if (!editingDecor.name) {
      setDecorError('Le nom du décor est requis.');
      return;
    }
    if (editingDecorArticleIds.length < 2) {
      setDecorError('Au moins deux articles doivent être sélectionnés.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://165.232.115.209:8081/decors/${editingDecor.id}`, {
        name: editingDecor.name,
        articleIds: editingDecorArticleIds
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDecors(prevDecors =>
        prevDecors.map(decor => decor.id === editingDecor.id ? { ...decor, name: editingDecor.name } : decor)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingDecor(null);
      setEditingDecorArticleIds([]);
      setIsDecorModalOpen(false);
      setDecorError(''); // Réinitialiser le message d'erreur
    } catch (error) {
      console.error('Erreur lors de la mise à jour du décor:', error);
    }
  };

  const handleDeleteDecor = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://165.232.115.209:8081/decors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDecors(prevDecors => prevDecors.filter(decor => decor.id !== id).sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Erreur lors de la suppression du décor:', error);
    }
  };

  const handleSelectDecor = async (decor) => {
    setEditingDecor(decor);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://165.232.115.209:8081/decors/${decor.id}/articles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditingDecorArticleIds(response.data.map(article => article.id));
    } catch (error) {
      console.error('Erreur lors du chargement des articles pour le décor:', error);
    }
  };

  const loadDecorArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/decor_articles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDecorArticles(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des décor-articles:', error);
    }
  };

  // Calculer le nombre d'articles problématiques pour un décor spécifique
  const getProblematicArticleCount = (decorId) => {
    const associatedArticles = decorArticles
      .filter(da => da.decor_id === decorId)
      .map(da => allArticles.find(article => article.id === da.article_id));

    return associatedArticles.filter(article => article?.deteriorated || article?.lost).length;
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
    <div className="p-8 bg-gray-100 h-[90vh]">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Gestion des Décors et Articles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Création d'Article */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '250px' }}>
          <h2 className="text-xl font-semibold mb-4 text-black">Créer un Article</h2>
          <button
            className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition"
            onClick={() => {
              setEditingArticle(null); // Clear editing state
              setIsArticleModalOpen(true);
            }}
          >
            Ouvrir Création Article
          </button>
        </div>

        {/* Création de Décor */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '250px' }}>
          <h2 className="text-xl font-semibold mb-4 text-black">Créer un Décor</h2>
          <button
            className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition"
            onClick={() => {
              setEditingDecor(null); // Clear editing state
              setIsDecorModalOpen(true);
            }}
          >
            Ouvrir Création Décor
          </button>
        </div>

        {/* Liste des articles */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '400px' }}>
          <h2 className="text-xl font-semibold mb-4 text-black">Articles Existants</h2>
          <div className="flex-1 overflow-auto">
            <ul className="space-y-4">
              {allArticles.map(article => (
                <li key={article.id} className="flex flex-col items-left justify-between p-4 border-b border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-800">{article.title}</span>
                    <span className="text-red-600 text-sm font-medium">
                      {article.deteriorated ? 'Détérioré' : ''} {article.lost ? 'Perdu' : ''}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      onClick={() => {
                        setEditingArticle(article);
                        setIsArticleModalOpen(true);
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Liste des décors */}
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col" style={{ maxHeight: '400px' }}>
  <h2 className="text-xl font-semibold mb-4 text-black">Liste des Décors</h2>
  <div className="flex-1 overflow-auto">
    <ul className="space-y-4">
      {decors.map(decor => {
        const problematicCount = getProblematicArticleCount(decor.id);

        return (
          <li key={decor.id} className="bg-gray-50 border-b border-gray-200 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-black">
              {decor.name}
              {problematicCount > 0 && (
                <span className="text-red-600 text-sm ml-2">
                  {problematicCount} article{problematicCount > 1 ? 's' : ''} problématique{problematicCount > 1 ? 's' : ''}
                </span>
              )}
            </h3>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                onClick={() => {
                  handleSelectDecor(decor);
                  setIsDecorModalOpen(true);
                }}
              >
                Modifier
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                onClick={() => handleDeleteDecor(decor.id)}
              >
                Supprimer
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
</div>


      {/* Modale pour créer ou modifier un Article */}
      <Modal isOpen={isArticleModalOpen} onClose={() => setIsArticleModalOpen(false)}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingArticle ? 'Modifier l\'Article' : 'Créer un Article'}
          </h2>
          <input
            type="text"
            placeholder="Nom de l'article"
            value={editingArticle ? editingArticle.title : newArticle.title}
            onChange={(e) => {
              const value = e.target.value;
              if (editingArticle) {
                setEditingArticle({ ...editingArticle, title: value });
              } else {
                setNewArticle({ ...newArticle, title: value });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
          />
          {articleError && <p className="text-red-600 mb-4">{articleError}</p>}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="deteriorated"
              checked={editingArticle ? editingArticle.deteriorated : newArticle.deteriorated}
              onChange={(e) => {
                const value = e.target.checked;
                if (editingArticle) {
                  setEditingArticle({ ...editingArticle, deteriorated: value });
                } else {
                  setNewArticle({ ...newArticle, deteriorated: value });
                }
              }}
              className="mr-2"
            />
            <label htmlFor="deteriorated" className="text-gray-800">Détérioré</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="lost"
              checked={editingArticle ? editingArticle.lost : newArticle.lost}
              onChange={(e) => {
                const value = e.target.checked;
                if (editingArticle) {
                  setEditingArticle({ ...editingArticle, lost: value });
                } else {
                  setNewArticle({ ...newArticle, lost: value });
                }
              }}
              className="mr-2"
            />
            <label htmlFor="lost" className="text-gray-800">Perdu</label>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              if (editingArticle) {
                handleUpdateArticle();
              } else {
                handleCreateArticle();
              }
            }}
          >
            {editingArticle ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </Modal>

      {/* Modale pour créer ou modifier un Décor */}
      <Modal isOpen={isDecorModalOpen} onClose={() => setIsDecorModalOpen(false)}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingDecor ? 'Modifier le Décor' : 'Créer un Décor'}
          </h2>
          <input
            type="text"
            placeholder="Nom du décor"
            value={editingDecor ? editingDecor.name : newDecor.name}
            onChange={(e) => {
              const value = e.target.value;
              if (editingDecor) {
                setEditingDecor({ ...editingDecor, name: value });
              } else {
                setNewDecor({ ...newDecor, name: value });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
          />
          {decorError && <p className="text-red-600 mb-4">{decorError}</p>}
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Sélectionner des Articles</h3>
            <ul className="space-y-2 max-h-64 overflow-auto">
              {allArticles.map(article => (
                <li key={article.id} className={`p-2 border rounded-md cursor-pointer ${article.deteriorated || article.lost ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={editingDecor ? editingDecorArticleIds.includes(article.id) : selectedArticleIds.includes(article.id)}
                      disabled={article.deteriorated || article.lost}
                      onChange={(e) => {
                        const id = article.id;
                        if (editingDecor) {
                          setEditingDecorArticleIds(
                            e.target.checked
                              ? [...editingDecorArticleIds, id]
                              : editingDecorArticleIds.filter(articleId => articleId !== id)
                          );
                        } else {
                          setSelectedArticleIds(
                            e.target.checked
                              ? [...selectedArticleIds, id]
                              : selectedArticleIds.filter(articleId => articleId !== id)
                          );
                        }
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className={`text-gray-800 ${article.deteriorated || article.lost ? 'line-through' : ''}`}>
                      {article.title}
                    </span>
                    <span className="text-red-500 text-sm">
                      {article.deteriorated ? 'Détérioré' : ''} {article.lost ? 'Perdu' : ''}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              if (editingDecor) {
                handleUpdateDecor();
              } else {
                handleCreateDecor();
              }
            }}
          >
            {editingDecor ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </Modal>
    </div>
    </div>
  );
}
