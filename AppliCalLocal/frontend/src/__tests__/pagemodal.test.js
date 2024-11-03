import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../components/modal';  // Assurez-vous que le chemin est correct

// Début du bloc de tests pour le composant Modal
describe('Modal Component', () => {
  
  // Définition des données fictives (mock) pour simuler un événement
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

  // Définition des données fictives pour les décors
  const mockDecors = [
    { id: 5, name: 'Décor 1' },
    { id: 6, name: 'Décor 2' },
  ];

  // Définition des données fictives pour les articles
  const mockArticles = [
    { id: 12, title: 'Fourche', deteriorated: false, lost: false },
    { id: 11, title: 'Chapeau de paille', deteriorated: false, lost: true },
  ];

  // Définition des données fictives pour les adresses
  const mockAddress = [
    { id: 2, name: 'Forêt de villejuif' },
  ];

  // Définition des données fictives pour les articles associés à un événement
  const mockEventArticle = [
    { event_id: 64, article_id: 12, isValidated: true },
  ];

  // Création de fonctions fictives (mock) pour les callbacks
  const mockOnClose = jest.fn();  // Fonction fictive pour fermer la modal
  const mockOnSave = jest.fn();   // Fonction fictive pour sauvegarder les modifications
  const mockOnDelete = jest.fn(); // Fonction fictive pour supprimer l'événement
  const mockCount = jest.fn().mockReturnValue(0); // Fonction fictive pour compter, retourne 0

  // Définition du test
  test('validates the "Photographe Assistant" checkbox in participants', async () => {
    
    // Rendu du composant Modal avec les données fictives
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

    // Vérifie que la case à cocher "Photographe Assistant" est bien affichée dans le DOM
    const assistantCheckbox = screen.getByLabelText('Photographe Assistant');
    expect(assistantCheckbox).toBeInTheDocument(); // Vérifie que l'élément est présent
    expect(assistantCheckbox).not.toBeChecked(); // Vérifie que la case n'est pas cochée initialement

    // Simule un clic sur la case à cocher pour l'activer
    fireEvent.click(assistantCheckbox);

    // Attend que les changements d'état se reflètent dans le DOM
    await waitFor(() => {
      // Vérifie que la case à cocher "Photographe Assistant" est maintenant cochée
      expect(screen.getByLabelText('Photographe Assistant')).toBeChecked();
    });

    // Simule un clic sur le bouton de sauvegarde
    fireEvent.click(screen.getByText(/Sauvegarder/i));

    // Attend que les effets de l'événement de clic se produisent et vérifie l'appel de la fonction mockOnSave
    await waitFor(() => {
      // Vérifie que la fonction mockOnSave a été appelée avec un objet contenant 'photographeassistant' dans les participants
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        participants: expect.stringContaining('photographeassistant'),
      }));
    });
  });
});
