import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../components/modal';  
describe('Modal Component', () => {
  
  const mockEvent = {
    id: 64,
    title: 'fefaef',
    start: '2024-08-08T22:00:00.000Z',
    end: '2024-08-09T22:00:00.000Z',
    allDay: true,
    description: 'eafaa',
    isCompleted: true,
    participants: 'gerant, photographe, decorateur',
    location_type: 'shooting',
    decor_id: 5,
    address_id: 2,
  };

  const mockDecors = [
    { id: 5, name: 'Décor 1' },
    { id: 6, name: 'Décor 2' },
  ];

  const mockArticles = [
    { id: 12, title: 'Fourche', deteriorated: false, lost: false },
    { id: 11, title: 'Chapeau de paille', deteriorated: false, lost: true },
  ];

  const mockAddress = [
    { id: 2, name: 'Forêt de villejuif' },
  ];

  const mockEventArticle = [
    { event_id: 64, article_id: 12, isValidated: true },
  ];

  const mockOnClose = jest.fn(); 
  const mockOnSave = jest.fn();  
  const mockOnDelete = jest.fn(); 
  const mockCount = jest.fn().mockReturnValue(0); 

  test('validates the "Photographe Assistant" checkbox in participants', async () => {
    
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        event={mockEvent}
        decors={mockDecors}
        articles={mockArticles}
        address={mockAddress}
        count={mockCount}
        eventArticle={mockEventArticle}
      />
    );

    const assistantCheckbox = screen.getByLabelText('Photographe Assistant');
    expect(assistantCheckbox).toBeInTheDocument(); 
    expect(assistantCheckbox).not.toBeChecked(); 

    fireEvent.click(assistantCheckbox);

    await waitFor(() => {
      expect(screen.getByLabelText('Photographe Assistant')).toBeChecked();
    });

    fireEvent.click(screen.getByText(/Sauvegarder/i));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        participants: expect.stringContaining('photographeassistant'),
      }));
    });
  });
});
