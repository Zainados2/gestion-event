import React, { useState, useEffect } from 'react';

const ModalLecture = ({
  isOpen,
  onClose,
  event,
  validateArticle,
  invalidateArticle,
  validateDecor,
  invalidateDecor,
  validateMontageDecor,
  invalidateMontageDecor,
  validateDemontageDecor,
  invalidateDemontageDecor,
  userRole,
  eventArticle,
  articles
}) => {
  const [loadingArticleId, setLoadingArticleId] = useState(null);
  const [loadingMontageDecorId, setLoadingMontageDecorId] = useState(null);
  const [loadingDemontageDecorId, setLoadingDemontageDecorId] = useState(null);
  const [loadingValidationDecorId, setLoadingValidationDecorId] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [filteredArticlesbis, setFilteredArticlesbis] = useState([]);

  useEffect(() => {
    if (event) {
      const eventArticleIdsWithValidation = eventArticle
        .filter(ea => ea.event_id === parseInt(event.id, 10))
        .reduce((acc, ea) => {
          acc[ea.article_id.toString()] = ea.isValidated;
          return acc;
        }, {});

      const filteredArticlesWithValidation = articles
        .filter(article => eventArticleIdsWithValidation.hasOwnProperty(article.id.toString()))
        .map(article => ({
          ...article,
          isValidated: eventArticleIdsWithValidation[article.id.toString()]
        }));

      setFilteredArticles(filteredArticlesWithValidation);
      setFilteredArticlesbis(filteredArticlesWithValidation);
    }
  }, [event, eventArticle, articles]);

  const updateArticleState = (articleId, isValidated) => {
    setFilteredArticles(prevArticles =>
      prevArticles.map(article =>
        article.id === articleId ? { ...article, isValidated } : article
      )
    );
    setFilteredArticlesbis(prevArticles =>
      prevArticles.map(article =>
        article.id === articleId ? { ...article, isValidated } : article
      )
    );
  };

  const handleValidateArticle = async (articleId) => {
    setLoadingArticleId(articleId);
    setValidationError(null);
  
    try {
      await validateArticle(articleId);
      updateArticleState(articleId, true); 
    } catch (error) {
      setValidationError('Erreur de validation de l\'article. Veuillez réessayer.');
    } finally {
      setLoadingArticleId(null);
    }
  };
  
  const handleInvalidateArticle = async (articleId) => {
    setLoadingArticleId(articleId);
    setValidationError(null);
  
    try {
      await invalidateArticle(articleId);
      updateArticleState(articleId, false); 
    } catch (error) {
      setValidationError('Erreur de dévalidation de l\'article. Veuillez réessayer.');
    } finally {
      setLoadingArticleId(null);
    }
  };
  

  const handleValidateDecor = async () => {
    setLoadingValidationDecorId('decor');
    setValidationError(null);

    try {
      await validateDecor();
    } catch (error) {
      setValidationError('Erreur de validation du décor. Veuillez réessayer.');
    } finally {
      setLoadingValidationDecorId(null);
    }
  };

  const handleInvalidateDecor = async () => {
    setLoadingValidationDecorId('decor');
    setValidationError(null);

    try {
      await invalidateDecor();
    } catch (error) {
      setValidationError('Erreur de dévalidation du décor. Veuillez réessayer.');
    } finally {
      setLoadingValidationDecorId(null);
    }
  };

  const handleValidateMontageDecor = async () => {
    setLoadingMontageDecorId('montage_decor');
    setValidationError(null);

    try {
      await validateMontageDecor();
    } catch (error) {
      setValidationError('Erreur de validation du montage du décor. Veuillez réessayer.');
    } finally {
      setLoadingMontageDecorId(null);
    }
  };

  const handleInvalidateMontageDecor = async () => {
    setLoadingMontageDecorId('montage_decor');
    setValidationError(null);

    try {
      await invalidateMontageDecor();
    } catch (error) {
      setValidationError('Erreur de dévalidation du montage du décor. Veuillez réessayer.');
    } finally {
      setLoadingMontageDecorId(null);
    }
  };

  const handleValidateDemontageDecor = async () => {
    setLoadingDemontageDecorId('demontage_decor');
    setValidationError(null);

    try {
      await validateDemontageDecor();
    } catch (error) {
      setValidationError('Erreur de validation du démontage du décor. Veuillez réessayer.');
    } finally {
      setLoadingDemontageDecorId(null);
    }
  };

  const handleInvalidateDemontageDecor = async () => {
    setLoadingDemontageDecorId('demontage_decor');
    setValidationError(null);

    try {
      await invalidateDemontageDecor();
    } catch (error) {
      setValidationError('Erreur de dévalidation du démontage du décor. Veuillez réessayer.');
    } finally {
      setLoadingDemontageDecorId(null);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50 p-4">
      <div className="bg-gray-50 rounded-xl p-8 shadow-2xl w-full max-w-6xl mx-auto relative border border-gray-200">
        <button aria-label='fermer'
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-3xl font-bold mb-8 text-gray-900 border-b-2 pb-4 border-gray-300">
          Détails de l'Événement
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-gray-700">
              {event && (
                <>
                  {event.title && <p><strong className="font-semibold text-gray-800">Titre :</strong> {event.title}</p>}
                  {event.description && <p><strong className="font-semibold text-gray-800">Description :</strong> {event.description}</p>}
                  {event.start && <p><strong className="font-semibold text-gray-800">Début :</strong> {formatDateTime(event.start)}</p>}
                  {event.end && <p><strong className="font-semibold text-gray-800">Fin :</strong> {formatDateTime(event.end)}</p>}
                  {event.address && (
                    <>
                      <p><strong className="font-semibold text-gray-800">Type de Lieu :</strong> {event.address.type}</p>
                      <p><strong className="font-semibold text-gray-800">Adresse :</strong> {event.address.name}, {event.address.location}</p>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="space-y-4 text-gray-700">
              {userRole === 'photographe' && filteredArticles.length > 0 && (
                <>
                  <strong className="font-semibold text-gray-800">Articles :</strong>
                  <ul className="space-y-4">
                    {filteredArticlesbis.map(article => {
                      const isValidationButton = article.isValidated === 0 || article.isValidated === false;
                      const buttonText = isValidationButton ? 'Valider' : 'Annuler';
                      const buttonClass = isValidationButton
                        ? 'bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors'
                        : 'bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors';
                      const buttonAction = isValidationButton ? handleValidateArticle : handleInvalidateArticle;

                      return (
                        <li key={article.id} className="flex items-center justify-between">
                          {article.title}
                          <button aria-label='valider article'
                            onClick={() => buttonAction(article.id)}
                            disabled={loadingArticleId === article.id}
                            className={buttonClass}
                          >
                            {loadingArticleId === article.id ? 'Chargement...' : buttonText}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {validationError && <p className="text-red-500 mt-2">{validationError}</p>}
                </>
              )}
              {userRole === 'photographe' && event?.decorName && (
                <>
                  <strong className="font-semibold text-gray-800">Décor :</strong>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{event.decorName}</span>
                    <div className="flex space-x-4">
                      <button aria-label='valider decors'
                        onClick={event.decorValidationStatus ? handleInvalidateDecor : handleValidateDecor}
                        disabled={loadingValidationDecorId === 'decor'}
                        className={event.decorValidationStatus ? 'bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors' : 'bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors'}
                      >
                        {loadingValidationDecorId === 'decor' ? 'Chargement...' : event.decorValidationStatus ? 'Annuler Décor' : 'Valider Décor'}
                      </button>
                    </div>
                    {validationError && <p className="text-red-500 mt-2">{validationError}</p>}
                  </div>
                </>
              )}
              {userRole === 'decorateur' && event?.decorName && (
                <>
                  <strong className="font-semibold text-gray-800">Décor :</strong>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{event.decorName}</span>
                    <div className="flex space-x-4">
                      <button aria-label='valider decors'
                        onClick={event.decorMontageStatus ? handleInvalidateMontageDecor : handleValidateMontageDecor}
                        disabled={loadingMontageDecorId === 'montage_decor'}
                        className={event.decorMontageStatus ? 'bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors' : 'bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors'}
                      >
                        {loadingMontageDecorId === 'montage_decor' ? 'Chargement...' : event.decorMontageStatus ? 'Annuler montage Décor' : 'Valider montage Décor'}
                      </button>
                    </div>
                    {validationError && <p className="text-red-500 mt-2">{validationError}</p>}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{event.decorName}</span>
                    <div className="flex space-x-4">
                      <button aria-label='valider demontage decors'
                        onClick={event.decorDemontageStatus ? handleInvalidateDemontageDecor : handleValidateDemontageDecor}
                        disabled={loadingDemontageDecorId === 'demontage_decor'}
                        className={event.decorDemontageStatus ? 'bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors' : 'bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors'}
                      >
                        {loadingDemontageDecorId === 'demontage_decor' ? 'Chargement...' : event.decorDemontageStatus ? 'Annuler démontage Décor' : 'Valider démontage Décor'}
                      </button>
                    </div>
                    {validationError && <p className="text-red-500 mt-2">{validationError}</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLecture;
