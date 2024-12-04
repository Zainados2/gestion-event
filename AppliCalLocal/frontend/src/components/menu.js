"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../app/contexts/authContext';
import { useRouter } from 'next/navigation';

export default function Menu() {
  const { isAuthenticated, userRole, userId, updateAuthContext } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('');

  useEffect(() => {
    setActiveRoute(router.pathname);
    if (!isAuthenticated) {
      setMenuOpen(false);
    }
  }, [router.pathname, isAuthenticated]);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await updateAuthContext(); 
    setMenuOpen(false); 
    router.push('/'); 
  };

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (route) => (activeRoute === route ? 'bg-purple-200 font-bold focus:ring-2 focus:ring-purple-400' : '');

  return (
    <nav className="bg-gray-100 border-b-2 border-purple-600">
      <div className="flex justify-end items-center py-4">
        {(userRole === 'gerant' || userRole === 'admin') && (
          <>
            <button
              onClick={() => router.push('/admin')}
              className={`hidden md:block text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/admin')}`}
              aria-label="admin"
            >
              Admin
            </button>
            <button
              onClick={() => router.push('/decor&article')}
              className={`hidden md:block text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/decor&article')}`}
              aria-label="decors"
            >
              Décors
            </button>
            <button
              onClick={() => router.push('/lieux')}
              className={`hidden md:block text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/lieux')}`}
              aria-label="lieux"
            >
              Lieux
            </button>
            <button
              onClick={() => router.push('/prestataire')}
              className={`hidden md:block text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/prestataire')}`}
              aria-label="prestataire"
            >
              Prestataire
            </button>
            <button
              onClick={() => router.push('/historique')}
              className={`hidden md:block text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/historique')}`}
              aria-label="historique"
            >
              Historique
            </button>
          </>
        )}
        {(userRole !== 'gerant' && userRole !== 'admin') && (
          <button
            onClick={() => router.push(`/prestataire/${userId}`)}
            className={`hidden md:block text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive(`/prestataire/${userId}`)}`}
            aria-label="recapitulatif"
          >
            Récapitulatif
          </button>
        )}
        <button
          onClick={() => router.push('/calendar')}
          className={`hidden md:block text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/calendar')}`}
          aria-label="calendrier"
        >
          Calendrier
        </button>
        <button
          onClick={handleLogout}
          className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4"
          aria-label="deconnexion"
        >
          Déconnexion
        </button>
      </div>

      {isAuthenticated && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4"
          aria-label="menu"
        >
          Menu
        </button>
      )}

      {isAuthenticated && menuOpen && (
        <div className="md:hidden bg-gray-100 border-t-2 border-purple-600">
          <button
            onClick={() => {
              router.push('/calendar');
              setMenuOpen(false);
            }}
            className={`block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/calendar')}`}
            aria-label="calendrier"
          >
            Calendrier
          </button>
          {(userRole === 'gerant' || userRole === 'admin') && (
            <>
              <button
                onClick={() => {
                  router.push('/admin');
                  setMenuOpen(false);
                }}
                className={`block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none ${isActive('/admin')}`}
                aria-label="admin"
              >
                Admin
              </button>
              {/* Autres boutons similaires avec logique active */}
            </>
          )}
          <button
            onClick={handleLogout}
            className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
            aria-label="deconnexion"
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}
