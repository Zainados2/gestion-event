"use client";
import React, { useState, useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  decors,
  articles,
  address,
  count,
  eventArticle
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [locationType, setLocationType] = useState('shooting');
  const [decor, setDecor] = useState('');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showLocationTypeDropdown, setShowLocationTypeDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setIsCompleted(event.isCompleted || false);
      setParticipants(event.participants ? event.participants.split(', ') : []);
      setLocationType(event.location_type || 'shooting');
      setDecor(event.decor_id || '');

      // Initialisation des articles sélectionnés
      const eventArticleIds = eventArticle
        .filter(ea => ea.event_id === parseInt(event.id, 10))  // Assurez-vous que l'ID de l'événement est un nombre
        .map(ea => ea.article_id.toString());

      setSelectedArticles(eventArticleIds);

      setAddressId(event.address_id || '');

      // Filtrer les articles en fonction des eventArticle
      const filteredArticles = articles.filter(article => eventArticleIds.includes(article.id.toString()));
    }
  }, [event, eventArticle, articles]);

 

  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Le titre est requis.';
    if (!description.trim()) newErrors.description = 'La description est requise.';
    if (locationType === 'shooting' && !decor) newErrors.decor = 'Le décor est requis pour le shooting.';
    if (locationType === 'studio' && selectedArticles.length === 0) newErrors.articles = 'Sélectionnez au moins un article pour le studio.';
    if (!addressId) newErrors.addressId = 'L\'adresse est requise.';
    if (participants.length === 0) newErrors.participants = 'Les participants sont requis.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateFields()) return;
    const updatedParticipants = participants.includes('gerant')
      ? participants
      : ['gerant', ...participants];

    onSave({
      ...event,
      title,
      description,
      isCompleted,
      participants: updatedParticipants.join(', '),
      location_type: locationType,
      decor_id: decor || undefined,
      article_ids: selectedArticles.join(','),
      start: event?.start,
      end: event?.end,
      allDay: event?.allDay,
      address_id: addressId || null,
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      onDelete(event);
      onClose();
    }
  };

  const toggleParticipant = (role) => {
    setParticipants(prev =>
      prev.includes(role)
        ? prev.filter(p => p !== role)
        : [...prev, role]
    );
  };

  const toggleArticle = (id) => {
    setSelectedArticles(prev => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.includes(id)
        ? prevArray.filter(selectedId => selectedId !== id)
        : [...prevArray, id];
    });
  };

  const handleDecorSelect = (decorId) => {
    setDecor(decorId);
    setShowDropdown(false);
  };

  const handleAddressSelect = (addressId) => {
    setAddressId(addressId);
    setShowAddressDropdown(false);
  };

  const handleLocationTypeSelect = (type) => {
    setLocationType(type);
    setShowLocationTypeDropdown(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2">
      <div className="bg-white rounded-lg p-4 shadow-lg w-full sm:w-11/12 md:w-4/5 lg:w-3/5 xl:w-1/2 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
          {event ? 'Modifier l\'événement' : 'Créer un événement'}
        </h2>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
            <label htmlFor='title' className="block mb-1 text-sm font-semibold text-gray-800">Titre</label>
            <input id='title' aria-label='title'
            name='title'
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
            <label htmlFor='description' className="block mb-1 text-sm font-semibold text-gray-800">Description</label>
            <textarea id='description' aria-label='description'
            name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              rows="2"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
            <label id='lieu' htmlFor='lieu' className="block mb-1 text-sm font-semibold text-gray-800">Type de lieu</label>
            <div className="relative">
              <button aria-labelledby="lieu" id='lieu' aria-label='selection type photo'
                onClick={() => setShowLocationTypeDropdown(!showLocationTypeDropdown)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-md text-sm flex justify-between items-center"
              >
                <span>{locationType === 'shooting' ? 'Shooting en situation' : 'En studio'}</span>
                <svg
                  className={`transform transition-transform duration-200 ${showLocationTypeDropdown ? 'rotate-180' : 'rotate-0'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 6l6 6 6-6h-12z" />
                </svg>
              </button>
              {showLocationTypeDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                  <div
                    onClick={() => handleLocationTypeSelect('shooting')}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                    tabIndex="0"
                      role="option"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLocationTypeSelect('shooting');
                        }
                      }}
                  >
                    Shooting en situation
                  </div>
                  <div
                    onClick={() => handleLocationTypeSelect('studio')}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                    tabIndex="0"
                      role="option"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLocationTypeSelect('studio');
                        }
                      }}
                  >
                    En studio
                  </div>
                </div>
              )}
            </div>
          </div>

          {locationType === 'shooting' && (
            <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
              <label id='decor' htmlFor='decor' className="block mb-1 text-sm font-semibold text-gray-800">Décor</label>
              <div className="relative">
                <button aria-labelledby="decor" id='decor' aria-label='selection decor'
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-md text-sm flex justify-between items-center"
                >
                  <span>{decor ? decors.find(d => d.id === decor)?.name : 'Sélectionner un décor'}</span>
                  <svg
                    className={`transform transition-transform duration-200 ${showDropdown ? 'rotate-180' : 'rotate-0'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 6l6 6 6-6h-12z" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                    {decors.map(decorItem => {
                      const problematicCount = count(decorItem.id);
                      const isDisabled = problematicCount > 0;
                      return (
                        <div
                          key={decorItem.id}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleDecorSelect(decorItem.id);
                            }
                          }}
                          tabIndex="0"
                      role="option"
                          onClick={() => !isDisabled && handleDecorSelect(decorItem.id)}
                          className={`px-4 py-2 flex justify-between items-center text-sm ${
                            isDisabled
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-gray-100 cursor-pointer'
                          }`}
                          aria-disabled={isDisabled ? "true" : "false"}
                        >
                          <span>{decorItem.name}</span>
                          {problematicCount > 0 && (
                            <span className="text-red-500">
                              {` (${problematicCount} article${problematicCount > 1 ? 's' : ''} problématique${problematicCount > 1 ? 's' : ''})`}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.decor && <p className="text-red-500 text-xs mt-1">{errors.decor}</p>}
              </div>
            </div>
          )}

          {locationType === 'studio' && (
            <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
              <label htmlFor='article' className="block mb-1 text-sm font-semibold text-gray-800">Articles</label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 p-1 rounded-lg">
                {articles.map(article => {
                  const isProblematic = article.deteriorated || article.lost;
                  const itemClasses = `flex items-center mb-1 p-1 rounded-lg ${isProblematic ? 'bg-red-100 text-red-500' : 'hover:bg-gray-100 transition'}`;

                  const statusText = isProblematic ? (
                    <span className="text-red-500 ml-2 text-xs">
                      ({article.deteriorated ? 'Détérioré' : ''} {article.deteriorated && article.lost ? 'et ' : ''}{article.lost ? 'Perdu ' : ''})
                    </span>
                  ) : null;

                  return (
                    <label
                      key={article.id}
                      className={itemClasses}
                    >
                      <input id='article' aria-label='selection article'
                        type="checkbox"
                        value={article.id}
                        checked={selectedArticles.includes(article.id.toString())}
                        onChange={() => !isProblematic && toggleArticle(article.id.toString())}
                        className={`mr-1 ${isProblematic ? 'cursor-not-allowed' : ''}`}
                        disabled={isProblematic}
                      />
                      <span className={`text-xs ${isProblematic ? 'text-red-500' : 'text-gray-700'}`}>
                        {article.title}
                        {statusText}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.articles && <p className="text-red-500 text-xs mt-1">{errors.articles}</p>}
            </div>
          )}

          <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
            <label id='adresse' htmlFor='adresse' className="block mb-1 text-sm font-semibold text-gray-800">Adresse</label>
            <div className="relative">
              <button aria-labelledby="adresse" id='adresse' aria-label='selection adresse'
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-md text-sm flex justify-between items-center"
              >
                <span>{addressId ? address.find(a => a.id === addressId)?.name : 'Sélectionner une adresse'}</span>
                <svg
                  className={`transform transition-transform duration-200 ${showAddressDropdown ? 'rotate-180' : 'rotate-0'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 6l6 6 6-6h-12z" />
                </svg>
              </button>
              {showAddressDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                  {address.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAddressSelect(addr.id);
                        }
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                      tabIndex="0"
                      role="option"
                    >
                      {addr.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.addressId && <p className="text-red-500 text-xs mt-1">{errors.addressId}</p>}
          </div>

          <div className="bg-gray-50 p-2 rounded-lg shadow-inner">
            <label htmlFor='etatevent' className="block mb-1 text-sm font-semibold text-gray-800">Etat de l'événement</label>
            <label className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition">
              <input id='etatevent' aria-label='selection etat evenement'
                type="checkbox"
                checked={isCompleted}
                onChange={() => setIsCompleted(!isCompleted)}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm flex-grow text-left">Marquer comme complété</span>
            </label>
          </div>
            <fieldset className='bg-gray-50 p-2 rounded-lg shadow-inner lg:col-span-2'> 
          <div className="bg-gray-50 p-2 rounded-lg shadow-inner lg:col-span-2">
            <legend className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"><label htmlFor='participant' className="block mb-1 text-sm font-semibold text-gray-800">Participants</label></legend>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[
                { value: 'photographe', label: 'Photographe' },
                { value: 'photographeassistant', label: 'Photographe Assistant' },
                { value: 'decorateur', label: 'Décorateur' },
                { value: 'decorateurassistant', label: 'Décorateur Assistant' },
                { value: 'chauffeur', label: 'Chauffeur' },
              ].map(participant => (
                <label key={participant.value} className="flex items-center p-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition h-10">
                  <input id='participant' aria-label='selection participant'
                  name='participants'
                    type="checkbox"
                    value={participant.value}
                    checked={participants.includes(participant.value)}
                    onChange={() => toggleParticipant(participant.value)}
                    className="mr-1"
                  />
                  <span className="text-gray-700 text-xs">{participant.label}</span>
                </label>
              ))}
            </div>
            {errors.participants && <p className="text-red-500 text-xs mt-1">{errors.participants}</p>}
          </div>
          </fieldset> 
        </div>

        <div className="mt-4 flex justify-between">
          {event && (
            <button aria-label='supprimer'
              onClick={handleDelete}
              className="bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-700 transition"
            >
              Supprimer
            </button>
          )}
          <div className="space-x-2">
            <button aria-label='annuler'
              onClick={onClose}
              className="bg-gray-300 text-gray-800 py-1 px-4 rounded-lg hover:bg-gray-400 transition"
            >
              Annuler
            </button>
            <button aria-label='valider'
              onClick={handleSave}
              className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              {event ? 'Sauvegarder' : 'Créer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
