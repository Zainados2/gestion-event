import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Events from '../app/calendar/page';  
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { useAuth } from '@/app/contexts/authContext';

jest.mock('../app/contexts/authContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    userRole: 'gerant',
  }),
}));

beforeEach(() => {
  fetch.resetMocks(); 
});

describe('Events Component', () => {
  test('renders without crashing', async () => {
    fetch.mockResponses(
      [JSON.stringify([
        {
          "id": 64,
          "title": "fefaef",
          "start": "2024-08-08T22:00:00.000Z",
          "end": "2024-08-09T22:00:00.000Z",
          "allDay": true,
          "description": "eafaa",
          "isCompleted": true,
          "participants": "gerant, photographe, photographeassistant, decorateur",
          "location_type": "shooting",
          "decor_id": 5,
          "address_id": 2
        },
        {
          "id": 67,
          "title": "rgrgzrg",
          "start": "2024-08-15T22:00:00.000Z",
          "end": "2024-08-16T22:00:00.000Z",
          "allDay": true,
          "description": "gzrgzrg",
          "isCompleted": true,
          "participants": "gerant, photographe, photographeassistant",
          "location_type": "studio",
          "decor_id": null,
          "address_id": 13
        },
      ]), { status: 200 }],
      [JSON.stringify([{ id: 3, name: 'Chasse et pêche' }, { id: 5, name: 'Racing' }]), { status: 200 }],
      [JSON.stringify([
        { id: 12, title: 'Fourche', deteriorated: false, lost: false },
        { id: 11, title: 'Chapeau de paille', deteriorated: false, lost: true },
        { id: 10, title: 'Fusil', deteriorated: false, lost: false },
      ]), { status: 200 }],
      [JSON.stringify([
        { id: 1, name: 'Studio Porte de la chapelle', location: '2 rue machin 75000 Paris', type: 'studio' },
        { id: 2, name: 'Forêt de villejuif', location: '2 rue jean jaurès', type: 'shooting' },
      ]), { status: 200 }],
      [JSON.stringify([
        { decor_id: 3, article_id: 9 },
        { decor_id: 3, article_id: 10 },
      ]), { status: 200 }],
      [JSON.stringify([
        { event_id: 70, article_id: 12, isValidated: true },
        { event_id: 67, article_id: 13, isValidated: true },
      ]), { status: 200 }]
    );

    render(<Events />);

    await waitFor(() => {
      expect(screen.queryByText(/Chargement.../i)).not.toBeInTheDocument();
    });

  });
});

describe('FullCalendar Component', () => {
  test('renders FullCalendar component', () => {
    render(<FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.35} 
      />);
    
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
