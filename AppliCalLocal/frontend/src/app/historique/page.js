"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../contexts/authContext';
import Loader from '../../components/Loader';

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

export default function Historique() {
  const { isAuthenticated, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [hoursByMonth, setHoursByMonth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
  const [selectedYear, setSelectedYear] = useState(currentYear); 
  const [articles, setArticles] = useState([]);
  const [eventArticles, setEventArticles] = useState([]);
  const [validatedArticles, setValidatedArticles] = useState([]);
  const [eventDecors, setEventDecors] = useState([]);
  const [validatedDecors, setValidatedDecors] = useState([]);
  const [eventsById, setEventsById] = useState({});
  const [decorsById, setDecorsById] = useState({});
  const [addressesById, setAddressesById] = useState({});
  const [heureTotal, setHeureTotal] = useState(0); 
  const [heureEffectue, setHeureEffectue] = useState(0); 
  const [heureAVenir, setHeureAVenir] = useState(0); 

  useEffect(() => {
    if (isAuthenticated && (userRole === 'gerant' || userRole === 'admin')) {
      fetchEvents();
      fetchAddresses();
      fetchEventArticles();
      fetchEventDecors();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    if (isAuthenticated && (userRole === 'gerant' || userRole === 'admin')) {
      if (events.length > 0) {
        calculateHoursByMonth();
      }
    } else {
      setIsLoading(false);
    }
  }, [events, selectedMonth, selectedYear, isAuthenticated, userRole]);

  useEffect(() => {
    if (isAuthenticated && (userRole === 'gerant' || userRole === 'admin')) {
      if (eventArticles.length > 0) {
        fetchArticles();
      }
    } else {
      setIsLoading(false);
    }
  }, [eventArticles, isAuthenticated, userRole]);

  useEffect(() => {
    if (isAuthenticated && (userRole === 'gerant' || userRole === 'admin')) {
      if (eventDecors.length > 0) {
        fetchDecors();
      }
    } else {
      setIsLoading(false);
    }
  }, [eventDecors, isAuthenticated, userRole]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = userRole;
      const response = await axios.get(`http://165.232.115.209:8081/events?role=${role}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const eventsData = response.data || [];
      setEvents(eventsData);
      
      const eventsMap = eventsData.reduce((acc, event) => {
        acc[event.id] = event;
        return acc;
      }, {});
      setEventsById(eventsMap);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      setError('Une erreur s\'est produite lors de la récupération des événements.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/addresses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const addressesById = response.data.reduce((acc, address) => {
        acc[address.id] = address;
        return acc;
      }, {});
      setAddressesById(addressesById);
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
      setError('Une erreur s\'est produite lors de la récupération des adresses.');
    }
  };

  const fetchEventArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/event_articles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEventArticles(response.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles d\'événements:', error);
      setError('Une erreur s\'est produite lors de la récupération des articles d\'événements.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/articles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const articlesById = response.data.reduce((acc, article) => {
        acc[article.id] = article;
        return acc;
      }, {});

      const validated = eventArticles
        .filter(ea => ea.isValidated === true)
        .map(ea => ({
          ...articlesById[ea.article_id],
          event_id: ea.event_id,
          event_start: eventsById[ea.event_id]?.start
        }))
        .sort((a, b) => new Date(b.event_start) - new Date(a.event_start));

      setValidatedArticles(validated);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      setError('Une erreur s\'est produite lors de la récupération des articles.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventDecors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/event_decors', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEventDecors(response.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des décors d\'événements:', error);
      setError('Une erreur s\'est produite lors de la récupération des décors d\'événements.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDecors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://165.232.115.209:8081/decors', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const decorsById = response.data.reduce((acc, decor) => {
        acc[decor.id] = decor;
        return acc;
      }, {});

      const validated = eventDecors
        .filter(ed => ed.validation_decors === true)
        .map(ed => ({
          ...decorsById[ed.decor_id],
          event_id: ed.event_id,
          event_start: eventsById[ed.event_id]?.start
        }))
        .sort((a, b) => new Date(b.event_start) - new Date(a.event_start));

      setValidatedDecors(validated);
    } catch (error) {
      console.error('Erreur lors de la récupération des décors:', error);
      setError('Une erreur s\'est produite lors de la récupération des décors.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateHoursByMonth = () => {
    const now = new Date();
    let effectue = 0;
    let aVenir = 0;
  
    const completedEvents = events.filter(event => event.isCompleted === 1);
    
    console.log('completedEvents:', completedEvents);  
    
    completedEvents.forEach(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const eventHeure = (eventEnd - eventStart) / (1000 * 60 * 60);  
  
      const heureTravaille = eventHeure >= 8 ? 8 : eventHeure; 
  
      if (eventStart.getMonth() + 1 === selectedMonth && eventStart.getFullYear() === selectedYear) {
        if (eventEnd < now) {
          effectue += heureTravaille;  
        } else if (eventStart > now) {
          aVenir += heureTravaille;  
        }
      }
    });
  
    setHeureEffectue(effectue);
    setHeureAVenir(aVenir);
    setHeureTotal(effectue + aVenir);
  };
  
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const eventMonth = eventDate.getMonth() + 1;
    const eventYear = eventDate.getFullYear();
    console.log('Event:', event);  
    return eventMonth === selectedMonth && eventYear === selectedYear && event.isCompleted === 1;
  }).sort((a, b) => new Date(b.start) - new Date(a.start));
  
  console.log('filteredEvents:', filteredEvents);  
  

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || userRole !== 'gerant' && userRole !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-semibold mb-4">Accès non autorisé</h1>
          <p className="text-center text-gray-600">Vous n'avez pas la permission d'accéder à cette page.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Historique général</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-6">
          <div className="bg-gray-50 border border-gray-300 shadow-lg rounded-lg p-6 max-h-[550px]">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Filtrer par mois et année</h2>
            <label htmlFor='choixmois' className="block mb-2 text-sm font-medium text-gray-700">Seléctionner le mois</label>
            <select id='choixmois' aria-label='choix du mois'
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option aria-label='mois' key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <label htmlFor='choixannee' className="block mb-2 text-sm font-medium text-gray-700">Seléctionner l'année'</label>
            <select aria-label='choix annnée' id='choixannee'
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((year, index) => (
                <option aria-label='annee' key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 border border-gray-300 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Total des heures travaillées</h2>
            <p className="text-lg"><strong>Mois sélectionné:</strong> {months[selectedMonth - 1]}</p>
            <p className="text-lg"><strong>Année sélectionnée:</strong> {selectedYear}</p>
            <p className="text-lg"><strong>Heures effectuées:</strong> {heureEffectue.toFixed(2)} heures</p>
            <p className="text-lg"><strong>Heures à venir:</strong> {heureAVenir.toFixed(2)} heures</p>
            <p className="text-lg"><strong>Total des heures:</strong> {heureTotal.toFixed(2)} heures</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 max-h-[550px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Événements du mois</h2>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                const eventHeure = (eventEnd - eventStart) / (1000 * 60 * 60);
                const heureTravaille = eventHeure >= 8 ? 8 : eventHeure;

                return (
                  <div key={event.id} className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{event.title}</h3>
                    <p className="mb-2"><strong>Début:</strong> {moment(eventStart).startOf('day').format('YYYY-MM-DD-HH:mm')}</p>
                    <p className="mb-2"><strong>Fin:</strong> {moment(eventEnd).startOf('day').format('YYYY-MM-DD-HH:mm')}</p>
                    <p className="mb-2"><strong>Adresse:</strong> {addressesById[event.address_id]?.name || 'Inconnu'}</p>
                    <p className="mb-2"><strong>Emplacement:</strong> {addressesById[event.address_id]?.location || 'Inconnu'}</p>
                    <p className="mb-2"><strong>Heures travaillées:</strong> {heureTravaille.toFixed(2)} heures</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600">Aucun événement trouvé pour le mois et l'année sélectionnés.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 max-h-[500px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Articles Photographiés</h2>
          {validatedArticles.length > 0 && moment(validatedArticles.event_start).month() + 1  == selectedMonth ? (
            validatedArticles.map(article => (
              <div key={article.id} className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{article.title}</h3>
                {(article.deteriorated === 1 || article.lost === 1) && (
                  <p className="mb-2 text-red-600">
                    <strong>État:</strong> 
                    {article.deteriorated ? ' Détérioré' : ''} 
                    {article.lost ? ' Perdu' : ''}
                  </p>
                )}
                <p className="mb-2"><strong>Événement associé:</strong> {eventsById[article.event_id]?.title || 'Inconnu'}</p>
                <p className="mb-2"><strong>Date et heure de prise:</strong> {article.event_start ? moment(article.event_start).startOf('day').format('YYYY-MM-DD-HH:mm')  : 'Non disponible'}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Aucun article photographié trouvé.</p>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 max-h-[500px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Décors Photographiés</h2>
          {validatedDecors.length > 0 && moment(validatedDecors.event_start).month() + 1  == selectedMonth ? (
            validatedDecors.map(decor => (
              <div key={decor.id} className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{decor.name}</h3>
                <p className="mb-2"><strong>Événement associé:</strong> {eventsById[decor.event_id]?.title || 'Inconnu'}</p>
                <p className="mb-2"><strong>Date et heure de prise:</strong> {decor.event_start ? moment(decor.event_start).startOf('day').format('YYYY-MM-DD-HH:mm') : 'Non disponible'}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Aucun décor photographié trouvé.</p>
          )}
        </div>
      </div>
    </div>
  );



}
