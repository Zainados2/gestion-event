"use client"
import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loader from '../../components/Loader';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  // Fonction pour mettre à jour le contexte d'authentification
  const updateAuthContext = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://165.232.115.209:8081/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setUserRole(response.data.user.role);
          setUserId(response.data.user.id);
          setIsAuthenticated(true);
        } else {
          router.push('/');
          setIsAuthenticated(false);
          setUserRole(''); 
          setUserId(''); 
        }
      } catch (error) {
        router.push('/');
        setIsAuthenticated(false); 
        setUserRole(''); 
        setUserId('');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(''); 
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      updateAuthContext(); // Appel de la fonction updateAuthContext
    } else {
      router.push('/');
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, updateAuthContext }}> {/* Transmettez updateAuthContext */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}