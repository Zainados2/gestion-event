"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Loader from '../../../components/Loader';
import { useAuth } from '../../contexts/authContext';

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [hoursByMonth, setHoursByMonth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
  const [selectedYear, setSelectedYear] = useState(currentYear); 
  const { isAuthenticated, userRole, userId } = useAuth();

  console.log(userId)
  console.log(id)

  useEffect(() => {
    if (isAuthenticated && (userRole === 'gerant' || userRole === 'admin' || userId == id)) {
      if (id) {
        fetchUser();
      }
    } else {
      setError('Accès non autorisé.');
    }
  }, [id, isAuthenticated, userRole, userId]);

  useEffect(() => {
    if (isAuthenticated && (userRole === 'gerant' || userRole === 'admin' || userId == id)) {
      if (user) {
        fetchEvents();
      }
    }
  }, [user, isAuthenticated, userRole, userId]);

  useEffect(() => {
    if (isAuthenticated && (userRole === 'gerant' || userRole === 'admin' || userId == id)) {
      if (events.length > 0) {
        calculateHoursByMonthAndYear();
      }
    }
  }, [events, selectedMonth, selectedYear, isAuthenticated, userRole, userId]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://165.232.115.209:8081/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = user.role;
      const response = await axios.get(`http://165.232.115.209:8081/events?role=${role}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const eventsWithHours = response.data.map(event => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        let hoursWorked = 0;
        if (event.allDay) {
          hoursWorked = 8;
        } else {
          hoursWorked = (end - start) / (1000 * 60 * 60); 
        }
        return { ...event, hoursWorked };
      });
      setEvents(eventsWithHours || []);
    } catch (error) {
      setError('Une erreur s\'est produite lors de la récupération des événements.');
    } finally {
      setIsLoading(false);
    }
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const capitalizeTitle = (title) => {
    return title.split(' ').map(capitalize).join(' ');
  };

  const capitalizeFirstWord = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const calculateHoursByMonthAndYear = () => {
    const hours = {
        completed: 0,
        upcoming: 0,
        total: 0
    };

    events.forEach(event => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const eventMonth = start.getMonth() + 1;
        const eventYear = start.getFullYear();
        const now = new Date();

        const eventHours = event.hoursWorked || 0;

        if (eventMonth === selectedMonth && eventYear === selectedYear) {
            hours.total += eventHours;

            if (event.isCompleted === 1 || event.isCompleted === true) {
                hours.completed += eventHours;
            } else if (end > now) {
                hours.upcoming += eventHours;
            }
        }
    });

    setHoursByMonth(hours);

    console.log('Heures calculées :', hours);
};

const filteredEvents = events
    .filter(event => {
        const start = new Date(event.start);
        const eventMonth = start.getMonth() + 1;
        const eventYear = start.getFullYear();

        return eventMonth === selectedMonth && eventYear === selectedYear;
    })
    .sort((a, b) => new Date(b.start) - new Date(a.start));


  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!user) {
    return <p>Utilisateur non trouvé.</p>;
  }

  const totalHours = hoursByMonth.total || 0;
  const totalCompletedHours = hoursByMonth.completed || 0;
  const totalUpcomingHours = hoursByMonth.upcoming || 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Détails du prestataire</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-purple-600 text-white shadow-lg rounded-lg p-6 text-center flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold mb-2">{capitalize(user.username)}</h2>
          <h3 className="text-2xl font-medium">{capitalize(user.role)}</h3>
        </div>
        <div className="bg-gray-50 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Filtrer par mois et année</h2>
          <label htmlFor='choixmois' className="block mb-2 text-sm font-medium text-gray-700">Seléctionner le mois</label>
          <select id='choixmois' aria-label='choix du mois'
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          >
            {months.map((month, index) => (
              <option aria-label='mois' key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <label htmlFor='choixannee' className="block mb-2 text-sm font-medium text-gray-700">Seléctionner l'année'</label>
          <select aria-label='selection année' id='choixannee'
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            {years.map((year, index) => (
              <option aria-label='annees' key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-50 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Heures travaillées</h2>
        <p className="text-lg"><strong>Mois sélectionné:</strong> {months[selectedMonth - 1]}</p>
        <p className="text-lg"><strong>Année sélectionnée:</strong> {selectedYear}</p>
        <p className="text-lg"><strong>Total des heures travaillées:</strong> {totalHours.toFixed(2)} heures</p>
        <p className="text-lg"><strong>Heures effectuées:</strong> {totalCompletedHours.toFixed(2)} heures</p>
        <p className="text-lg"><strong>Heures à venir:</strong> {totalUpcomingHours.toFixed(2)} heures</p>
      </div>

      <div className='bg-gray-50 shadow-lg rounded-lg p-6'>
        <h2 className="text-2xl font-semibold mb-4">Événements du mois</h2>
        {filteredEvents.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {filteredEvents.map(event => (
              <div key={event._id} className="bg-gray-200 p-4 mb-4 rounded-lg">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p><strong>Start:</strong> {new Date(event.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(event.end).toLocaleString()}</p>
                <p><strong>Durée:</strong> {event.hoursWorked} heures</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun événement trouvé pour ce mois.</p>
        )}
      </div>
    </div>
  );
}
