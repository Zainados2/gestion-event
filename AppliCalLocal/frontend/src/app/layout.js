import React from "react";
import "./globals.css";
import Menu from "../components/menu";
import { AuthProvider } from './contexts/authContext';
import Footer from "../components/footer";


export const metadata = {
  title: "Photographe Calendar",
  description: "Une application pour gérer les événements de l'entreprise",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Menu />
          {children}
        </AuthProvider>
          <Footer />
      </body>
    </html>
  );
}
