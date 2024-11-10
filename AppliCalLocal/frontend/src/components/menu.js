"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../app/contexts/authContext';
import { useRouter } from 'next/navigation';

export default function Menu() {
  const { isAuthenticated, userRole, userId, updateAuthContext } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await updateAuthContext(); 
    setMenuOpen(false); 
    router.push('/'); 
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setMenuOpen(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-gray-100 border-b-2 border-purple-600">
      <div className="flex justify-end items-center py-4">
        {isAuthenticated && (
          <>
            {userRole === 'gerant' && (
              <>
                <button aria-label='admin' onClick={() => router.push('/admin')} className="hidden md:block text-purple-600 focus:ring-2 focus:ring-purple-400 mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none">Admin</button>
                <button aria-label='decors' onClick={() => router.push('/decor&article')} className="hidden md:block text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4 hover:bg-purple-100 py-2 px-4 ">Décors</button>
                <button aria-label='lieux' onClick={() => router.push('/lieux')} className="hidden md:block text-purple-600 focus:ring-2 focus:ring-purple-400 mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ">Lieux</button>
                <button aria-label='prestataire' onClick={() => router.push('/prestataire')} className="hidden md:block text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4 hover:bg-purple-100 py-2 px-4 ">Prestataire</button>
                <button aria-label='historique' onClick={() => router.push('/historique')} className="hidden md:block text-purple-600 focus:ring-2 focus:ring-purple-400 mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ">Historique</button>
              </>
            )}
            {userRole !== 'gerant' && (
              <button aria-label='recapitulatif' onClick={() => router.push(`/prestataire/${userId}`)} className="hidden md:block text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4 hover:bg-purple-100 py-2 px-4">Récapitulatif</button>
            )}
            <button aria-label='calendrier' onClick={() => router.push('/calendar')} className="hidden md:block text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4 hover:bg-purple-100 py-2 px-4 ">Calendrier</button>
            <button aria-label='deconnexion' 
              className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4" 
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </>
        )}

        {isAuthenticated && (
          <button aria-label='menu' className="md:hidden bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4" onClick={() => setMenuOpen(!menuOpen)}>
            Menu
          </button>
        )}
      </div>
      {isAuthenticated && menuOpen && (
  <div className="md:hidden bg-gray-100 border-t-2 border-purple-600">
    <button aria-label='calendrier'
      onClick={() => {
        router.push('/calendar');
        setMenuOpen(false);
      }}
      className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
    >
      Calendrier
    </button>

    {userRole === 'gerant' && (
      <>
        <button aria-label='admin'
          onClick={() => {
            router.push('/admin');
            setMenuOpen(false);
          }}
          className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
        >
          Admin
        </button>
        <button aria-label='decors'
          onClick={() => {
            router.push('/decor&article');
            setMenuOpen(false);
          }}
          className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
        >
          Décors
        </button>
        <button aria-label='lieux'
          onClick={() => {
            router.push('/lieux');
            setMenuOpen(false);
          }}
          className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
        >
          Lieux
        </button>
        <button aria-label='prestataire'
          onClick={() => {
            router.push('/prestataire');
            setMenuOpen(false);
          }}
          className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
        >
          Prestataire
        </button>
        <button aria-label='historique'
          onClick={() => {
            router.push('/historique');
            setMenuOpen(false);
          }}
          className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
        >
          Historique
        </button>
      </>
    )}
    
    {userRole !== 'gerant' && (
      <>
        <button aria-label='recapitulatif'
          onClick={() => {
            router.push(`/prestataire/${userId}`);
            setMenuOpen(false);
          }}
          className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
        >
          Récapitulatif
        </button>
      </>
    )}

    <button aria-label='deconnexion'
      className="block w-full text-left text-purple-600 hover:bg-purple-100 py-2 px-4 focus:outline-none"
      onClick={() => {
        handleLogout();
        setMenuOpen(false);
      }}
    >
      Déconnexion
    </button>
  </div>
)}

    </nav>
  );
}
