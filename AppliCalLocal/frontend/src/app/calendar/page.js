"use client";
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import Modal from '../../components/modal';
import ModalLecture from '../../components/modalLecture';
import { useAuth } from '../contexts/authContext';
import Loader from '../../components/Loader';

const API_URL = 'http://165.232.115.209:8081/events';
const API_DECORS_URL = 'http://165.232.115.209:8081/decors';
const API_ARTICLES_URL = 'http://165.232.115.209:8081/articles';
const API_ADDRESS_URL = 'http://165.232.115.209:8081/addresses';
const API_DECORS_ARTICLES_URL = 'http://165.232.115.209:8081/decor_articles';
const API_EVENT_ARTICLES_URL = 'http://165.232.115.209:8081/event_articles';
const API_EVENT_DECORS_URL = 'http://165.232.115.209:8081/event_decors'

export default function Events() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalLectureIsOpen, setModalLectureIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [decors, setDecors] = useState([]);
  const [articles, setArticles] = useState([]);
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [decorArticles, setDecorArticles] = useState([]);
  const [eventArticle, setEventArticle] = useState([]);
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
      fetchDecors();
      fetchArticles();
      fetchAddress();
      loadDecorArticles();
      fetchEventArticles()
    } else {
      setIsLoading(false); 
    }
  }, [isAuthenticated, userRole]);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      const dayCells = document.querySelectorAll('.fc-daygrid-day');
      if (dayCells.length > 0) {
        console.log('trouvé');
        dayCells.forEach((cell) => {
          if (cell.getAttribute('tabIndex') === null) {
            cell.setAttribute('tabIndex', '0');
          }
  
          cell.classList.add('focus:outline-none', 'focus:ring', 'focus:ring-purple-500', 'focus:border-purple-700');
          cell.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { 
              e.preventDefault(); 
              const date = cell.getAttribute('data-date'); 
              const selectInfo = {
                startStr: `${date}T00:00:00`, 
                endStr: `${date}T23:59:59`,  
                allDay: true, 
              };
              handleDateSelect(selectInfo); 
            }
          });
        });
        observer.disconnect();
      }
    });
  
    const calendarElement = document.querySelector('.fc'); 
    if (calendarElement) {
      observer.observe(calendarElement, {
        childList: true,
        subtree: true,  
      });
    }
  
    setTimeout(() => {
      const dayCells = document.querySelectorAll('.fc-daygrid-day');
      dayCells.forEach((cell) => {
        if (cell.getAttribute('tabIndex') === null) {
          cell.setAttribute('tabIndex', '0');
        }
        // Ajouter les styles de focus
        cell.classList.add('focus:outline-none', 'focus:ring', 'focus:ring-purple-500', 'focus:border-purple-700');
        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault(); 
            
            const date = cell.getAttribute('data-date');
            
            const selectInfo = {
              startStr: `${date}T00:00:00`, 
              endStr: `${date}T23:59:59`, 
              allDay: true, 
            };
            handleDateSelect(selectInfo); 
          }
        });
      });
    }, 500); 
    return () => {
      observer.disconnect();
    };
  
  }, [events]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}?role=${userRole}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setIsLoading(false);
    }
  };

  const fetchEventArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_EVENT_ARTICLES_URL , {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch decors');
      const data = await response.json();
      setEventArticle(data);
    } catch (error) {
      console.error('Failed to fetch decors:', error);
    }
  };

  const fetchDecors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_DECORS_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch decors');
      const data = await response.json();
      const sortedDecors = data.sort((a, b) => a.name.localeCompare(b.name));
      setDecors(sortedDecors);
    } catch (error) {
      console.error('Failed to fetch decors:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ARTICLES_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      const sortedArticles = data.sort((a, b) => a.title.localeCompare(b.title));
      setArticles(sortedArticles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ADDRESS_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      const sortedAddress = data.sort((a, b) => a.name.localeCompare(b.name));
      setAddress(sortedAddress);
    } catch (error) {
      console.error('Failed to fetch address:', error);
    }
  };

  const loadDecorArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://165.232.115.209:8081/decor_articles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      setDecorArticles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des décor-articles:', error);
    }
  };

  // Calculer le nombre d'articles problématiques pour un décor spécifique
  const getProblematicArticleCount = (decorId) => {
    const associatedArticles = decorArticles
      .filter(da => da.decor_id === decorId)
      .map(da => articles.find(article => article.id === da.article_id));

    return associatedArticles.filter(article => article?.deteriorated || article?.lost).length;
  };

  const handleDateSelect = (selectInfo) => {
    if (isAuthenticated && userRole === 'gerant') {
      setSelectedEvent({
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
      setModalIsOpen(true);
    }
  };

  const handleEventClick = async (clickInfo) => {
    console.log(clickInfo);
    const event = clickInfo.event;
    const eventDetails = {
        id: event.id,
        title: event.title,
        description: event.extendedProps.description,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        participants: event.extendedProps.participants,
        isCompleted: event.extendedProps.isCompleted,
        location_type: event.extendedProps.location_type,
        decor_id: event.extendedProps.decor_id,
        article_ids: event.extendedProps.article_ids ? event.extendedProps.article_ids.split(',').map(id => parseInt(id)) : [],
        address_id: event.extendedProps.address_id,
    };

    try {
        let addressResponse = null;

        // Récupérer l'adresse si un address_id est présent
        if (eventDetails.address_id) {
          const token = localStorage.getItem('token');
            addressResponse = await fetch(`${API_ADDRESS_URL}/${eventDetails.address_id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            addressResponse = addressResponse.ok ? await addressResponse.json() : null;
        }

        let filteredArticles = [];
        let articleValidationStatus = [];
        let decorValidationStatus = null;
        let decorMontageStatus = null;
        let decorDemontageStatus = null;
        let decorName = null;

        // Trouver le nom du décor en utilisant l'ID de decor_id
        if (eventDetails.decor_id) {
            const decor = decors.find(decor => decor.id === eventDetails.decor_id);
            if (decor) {
                decorName = decor.name;
            }
        }

        // Récupérer les articles si l'utilisateur est photographe
        if (userRole === 'photographe') {
            if (eventArticle.length > 0) {
                const eventArticleIds = eventArticle
                    .filter(ea => ea.event_id === parseInt(eventDetails.id, 10))  // Assurez-vous que l'ID de l'événement est un nombre
                    .map(ea => ea.article_id.toString());

                console.log('eventArticleIds:', eventArticleIds);

                filteredArticles = articles.filter(article => eventArticleIds.includes(article.id.toString()));

                console.log('filteredArticles:', filteredArticles);

                if (filteredArticles.length > 0) {
                    articleValidationStatus = await Promise.all(
                        filteredArticles.map(async (article) => {
                            try {
                              const token = localStorage.getItem('token');
                                const response = await fetch(`${API_EVENT_ARTICLES_URL}/event_id/${eventDetails.id}/article_id/${article.id}/isValidated?role=${userRole}`, {
                                  headers: {
                                    Authorization: `Bearer ${token}`
                                  }
                                });
                                if (!response.ok) throw new Error('Failed to fetch validation status');
                                const { isValidated } = await response.json();
                                console.log('Validation Status for article ID:', article.id, 'isValidated:', isValidated);
                                return { ...article, isValidated };
                            } catch (error) {
                                console.error('Erreur lors de la récupération du statut de validation pour l\'article ID:', article.id, error);
                                return { ...article, isValidated: false }; // Par défaut, définir comme non validé en cas d'erreur
                            }
                        })
                    );
                }
            }
        }

        // Récupérer le statut de validation des décors si l'utilisateur est photographe
        if (userRole === 'photographe' && eventDetails.decor_id) {
            try {
              const token = localStorage.getItem('token');
                const validationResponse = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventDetails.id}/decor_id/${eventDetails.decor_id}/validation_decors?role=${userRole}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                if (validationResponse.ok) {
                    const validationData = await validationResponse.json();
                    decorValidationStatus = validationData.validation_decors;
                    console.log('Décor Validation Status:', decorValidationStatus);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du statut de validation des décors:', error);
            }
        }

        // Récupérer le statut de montage des décors si l'utilisateur est décorateur
        if (userRole === 'decorateur' && eventDetails.decor_id) {
            try {
              const token = localStorage.getItem('token');
                const montageResponse = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventDetails.id}/decor_id/${eventDetails.decor_id}/montage_decors?role=${userRole}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                if (montageResponse.ok) {
                    const montageData = await montageResponse.json();
                    decorMontageStatus = montageData.montage_decors;
                    console.log('Décor Montage Status:', decorMontageStatus);
                }
                
                const demontageResponse = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventDetails.id}/decor_id/${eventDetails.decor_id}/demontage_decors?role=${userRole}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                if (demontageResponse.ok) {
                    const demontageData = await demontageResponse.json();
                    decorDemontageStatus = demontageData.demontage_decors;
                    console.log('Décor Démontage Status:', decorDemontageStatus);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du statut de montage/démontage des décors:', error);
            }
        }

        setSelectedEvent({
            ...eventDetails,
            filteredArticles: articleValidationStatus,
            address: addressResponse,
            decorValidationStatus,
            decorMontageStatus,
            decorDemontageStatus,
            decorName,
        });

        if (isAuthenticated && userRole === 'gerant') {
            setModalIsOpen(true);
        } else {
            setModalLectureIsOpen(true);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
};

  

  const handleEventDelete = async () => {
    if (selectedEvent) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/${selectedEvent.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },);
        if (!response.ok) throw new Error('Failed to delete event');
        fetchEvents();
        setModalIsOpen(false);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleEventSave = async (event) => {
    const participantsString = Array.isArray(event.participants)
      ? event.participants.join(', ')
      : typeof event.participants === 'string' ? event.participants : '';

    const eventToSave = {
      id: event.id || undefined,
      title: event.title,
      start: event.allDay 
  ? moment(event.start).startOf('day').format('YYYY-MM-DD') 
  : moment(event.start).format(),
end: event.allDay 
  ? moment(event.end).endOf('day').format('YYYY-MM-DD') 
  : moment(event.end).format(),

      allDay: event.allDay,
      description: event.description,
      participants: participantsString,
      isCompleted: event.isCompleted,
      location_type: event.location_type,
      decor_id: event.decor_id,
      article_ids: Array.isArray(event.article_ids) ? event.article_ids.join(',') : event.article_ids,
      address_id: event.address_id,
    };

    try {
      const token = localStorage.getItem('token');
      const response = eventToSave.id
        ? await fetch(`${API_URL}/${eventToSave.id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventToSave),
          })
        : await fetch(API_URL, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventToSave),
          });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      fetchEvents();
      fetchEventArticles()
      fetchArticles
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleEventDrop = async (info) => {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.allDay 
  ? moment(info.event.start).startOf('day').format('YYYY-MM-DD') 
  : moment(info.event.start).format(),
end: info.event.allDay 
  ? moment(info.event.end).endOf('day').format('YYYY-MM-DD') 
  : moment(info.event.end).format(),
      allDay: info.event.allDay,
      description: info.event.extendedProps.description,
      participants: info.event.extendedProps.participants,
      isCompleted: info.event.extendedProps.isCompleted,
      location_type: info.event.extendedProps.location_type,
      decor_id: info.event.extendedProps.decor_id,
      article_ids: info.event.extendedProps.article_ids,
      address_id: info.event.extendedProps.address_id,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/${updatedEvent.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
      if (!response.ok) throw new Error('Failed to update event');
      fetchEvents();
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const validateArticle = async (articleId) => {
    const eventId = selectedEvent.id;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://165.232.115.209:8081/event_articles/event_id/${eventId}/article_id/${articleId}/isValidated?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isValidated: true }),
      });
      if (!response.ok) throw new Error(`Erreur de validation, Status: ${response.status}`);
      fetchEventArticles()
      setSelectedEvent(prevState => ({
        ...prevState,
        filteredArticles: prevState.filteredArticles.map(article =>
          article.id === articleId ? { ...article, isValidated: true } : article
        )
      }));
    } catch (error) {
      console.error('Erreur de validation article:', error);
    }
  };
  
  const invalidateArticle = async (articleId) => {
    const eventId = selectedEvent.id;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_EVENT_ARTICLES_URL}/event_id/${eventId}/article_id/${articleId}/isValidated?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isValidated: false }),
      });
      if (!response.ok) throw new Error(`Failed to invalidate article, Status: ${response.status}`);
      fetchEventArticles()
      // Mise à jour locale
      setSelectedEvent(prevState => ({
        ...prevState,
        filteredArticles: prevState.filteredArticles.map(article =>
          article.id === articleId ? { ...article, isValidated: false } : article
        )
      }));
    } catch (error) {
      console.error('Erreur de dévalidation de l\'article:', error);
    }
  };
  

  const validateMontageDecor = async () => {
    const eventId = selectedEvent.id;
    const decor_id = selectedEvent.decor_id
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventId}/decor_id/${decor_id}/montage_decors?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decorMontageStatus: true }),
      });
      if (!response.ok) throw new Error('Failed to validate decor');
      
      setSelectedEvent(prevState => ({
        ...prevState,
        decorMontageStatus: true
      }));
    } catch (error) {
      console.error('Erreur de validation du décor:', error);
    }
  };
  
  const invalidateMontageDecor = async () => {
    const eventId = selectedEvent.id;
    const decor_id = selectedEvent.decor_id
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventId}/decor_id/${decor_id}/montage_decors?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decorMontageStatus: false }),
      });
      if (!response.ok) throw new Error('Failed to invalidate decor');
      
      setSelectedEvent(prevState => ({
        ...prevState,
        decorMontageStatus: false
      }));
    } catch (error) {
      console.error('Erreur de dévalidation du décor:', error);
    }
  };

  const validateDecor = async () => {
    const eventId = selectedEvent.id;
    const decor_id = selectedEvent.decor_id
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventId}/decor_id/${decor_id}/validation_decors?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ validation_decors: true }),
      });
      if (!response.ok) throw new Error('Failed to validate decor');
      
      setSelectedEvent(prevState => ({
        ...prevState,
        decorValidationStatus: true,
      }));
    } catch (error) {
      console.error('Erreur de validation du décor:', error);
    }
  };
  
  const invalidateDecor = async () => {
    const eventId = selectedEvent.id;
    const decor_id = selectedEvent.decor_id
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventId}/decor_id/${decor_id}/validation_decors?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ validation_decors: false }),
      });
      if (!response.ok) throw new Error('Failed to invalidate decor');
      
      setSelectedEvent(prevState => ({
        ...prevState,
        decorValidationStatus: false,
      }));
    } catch (error) {
      console.error('Erreur de dévalidation du décor:', error);
    }
  };

  const validateDemontageDecor = async () => {
    const eventId = selectedEvent.id;
    const decor_id = selectedEvent.decor_id
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventId}/decor_id/${decor_id}/demontage_decors?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decorDemontageStatus: true }),
      });
      if (!response.ok) throw new Error('Failed to validate decor');
      
      setSelectedEvent(prevState => ({
        ...prevState,
          decorDemontageStatus: true
      }));
    } catch (error) {
      console.error('Erreur de validation du décor:', error);
    }
  };
  
  const invalidateDemontageDecor = async () => {
    const eventId = selectedEvent.id;
    const decor_id = selectedEvent.decor_id
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_EVENT_DECORS_URL}/event_id/${eventId}/decor_id/${decor_id}/demontage_decors?role=${userRole}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ decorDemontageStatus: false }),
      });
      if (!response.ok) throw new Error('Failed to invalidate decor');
      
      setSelectedEvent(prevState => ({
        ...prevState,
          decorDemontageStatus: false
      }));
    } catch (error) {
      console.error('Erreur de dévalidation du décor:', error);
    }
  };
  
  

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col items-center p-4 lg:p-6 bg-gray-100">
      <h1 style={{fontSize:'36px', marginBottom:'30px', color:'#000', display:'flex', justifyContent:'center'}}>Planning des shootings</h1>
      <div className="relative w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-white p-4 md:p-6 rounded-lg shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          timeZone="Europe/Paris"
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          events={events.map((event) => ({
            id: event.id,title: event.title,start: event.allDay 
            ? moment(event.start).startOf('day').format('YYYY-MM-DD') 
            : moment(event.start).format(),
          end: event.allDay 
            ? moment(event.end).endOf('day').format('YYYY-MM-DD') 
            : moment(event.end).format(),
            allDay: event.allDay,description: event.description,participants: event.participants,isCompleted: event.isCompleted,location_type: event.location_type,decor_id: event.decor_id,article_ids: event.article_ids,address_id: event.address_id,backgroundColor: event.isCompleted ? '#2c3e50' : '#6f2eaf',borderColor: event.isCompleted ? '#2c3e50' : '#6f2eaf',
          }))}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.35}
        />
      </div>

      {/* Inline style for responsive toolbar */}
      <style>
        {`
          /* Mobile styles for FullCalendar toolbar */
          @media (max-width: 640px) {
            .fc-header-toolbar {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .fc-header-toolbar .fc-toolbar-chunk {
              margin-bottom: 0.5rem; /* Space between buttons on small screens */
            }
            .fc-header-toolbar .fc-toolbar-chunk.fc-toolbar-chunk-left {
              order: 2; /* Move 'prev,next today' to the bottom */
            }
            .fc-header-toolbar .fc-toolbar-chunk.fc-toolbar-chunk-center {
              order: 1; /* Move 'title' to the top */
            }
            .fc-header-toolbar .fc-toolbar-chunk.fc-toolbar-chunk-right {
              order: 3; /* Move 'dayGridMonth,timeGridWeek,timeGridDay' to the bottom */
            }
          }
          /* Desktop styles for FullCalendar toolbar */
          @media (min-width: 641px) {
            .fc-header-toolbar {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }
            .fc-header-toolbar .fc-toolbar-chunk {
              margin-bottom: 0; /* Reset margin for larger screens */
            }
            .fc-header-toolbar .fc-toolbar-chunk-left {
              order: 1;
            }
            .fc-header-toolbar .fc-toolbar-chunk-center {
              order: 2;
            }
            .fc-header-toolbar .fc-toolbar-chunk-right {
              order: 3;
            }
          }
        `}
      </style>

      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
        event={selectedEvent}
        decors={decors}
        articles={articles}
        address={address}
        count={(decorId) => getProblematicArticleCount(decorId)}
        decorArticles={decorArticles}
        eventArticle={eventArticle}
      />
      <ModalLecture
        isOpen={modalLectureIsOpen}
        onClose={() => setModalLectureIsOpen(false)}
        event={selectedEvent}
        validateArticle={validateArticle}
        invalidateArticle={invalidateArticle}
        validateDecor={validateDecor}
        invalidateDecor={invalidateDecor}
        invalidateMontageDecor={invalidateMontageDecor}
        validateMontageDecor={validateMontageDecor}
        userRole={userRole}
        invalidateDemontageDecor={invalidateDemontageDecor}
        validateDemontageDecor={validateDemontageDecor}
        eventArticle={eventArticle}
        articles={articles}
      />
    </div>
  );
};
