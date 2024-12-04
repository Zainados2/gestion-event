"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../app/contexts/authContext";
import { useRouter, usePathname } from "next/navigation";

export default function Menu() {
  const { isAuthenticated, userRole, userId, updateAuthContext } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await updateAuthContext();
    setMenuOpen(false);
    router.push("/");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setMenuOpen(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const getActiveClass = (path) =>
    pathname === path
      ? "bg-purple-200 text-purple-800" 
      : "text-purple-600"; 

  return (
    <nav className="bg-gray-100 border-b-2 border-purple-600">
      <div className="flex justify-end items-center py-4">
        {isAuthenticated && (
          <>
            {(userRole === "gerant" || userRole === "admin") && (
              <>
                <button
                  onClick={() => router.push("/admin")}
                  className={`hidden md:block mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ${getActiveClass(
                    "/admin"
                  )}`}
                >
                  Admin
                </button>
                <button
                  onClick={() => router.push("/decor&article")}
                  className={`hidden md:block mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ${getActiveClass(
                    "/decor&article"
                  )}`}
                >
                  Décors
                </button>
                <button
                  onClick={() => router.push("/lieux")}
                  className={`hidden md:block mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ${getActiveClass(
                    "/lieux"
                  )}`}
                >
                  Lieux
                </button>
                <button
                  onClick={() => router.push("/prestataire")}
                  className={`hidden md:block mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ${getActiveClass(
                    "/prestataire"
                  )}`}
                >
                  Prestataire
                </button>
                <button
                  onClick={() => router.push("/historique")}
                  className={`hidden md:block mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ${getActiveClass(
                    "/historique"
                  )}`}
                >
                  Historique
                </button>
              </>
            )}
            {userRole !== "gerant" && userRole !== "admin" && (
              <button
                onClick={() => router.push(`/prestataire/${userId}`)}
                className={`hidden md:block mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ${getActiveClass(
                  `/prestataire/${userId}`
                )}`}
              >
                Récapitulatif
              </button>
            )}
            <button
              onClick={() => router.push("/calendar")}
              className={`hidden md:block mr-4 hover:bg-purple-100 py-2 px-4 focus:outline-none ${getActiveClass(
                "/calendar"
              )}`}
            >
              Calendrier
            </button>
            <button
              onClick={handleLogout}
              className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4"
            >
              Déconnexion
            </button>
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 mr-4"
          >
            Menu
          </button>
        )}
      </div>
      {isAuthenticated && menuOpen && (
        <div className="md:hidden bg-gray-100 border-t-2 border-purple-600">
          <button
            onClick={() => {
              router.push("/calendar");
              setMenuOpen(false);
            }}
            className={`block w-full text-left py-2 px-4 focus:outline-none ${getActiveClass(
              "/calendar"
            )}`}
          >
            Calendrier
          </button>
        </div>
      )}
    </nav>
  );
}
