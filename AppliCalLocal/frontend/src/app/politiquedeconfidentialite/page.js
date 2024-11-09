import React from 'react';
import Link from 'next/link'; 
import { useAuth } from '../contexts/authContext';
const PolitiqueDeConfidentialite = () => {
  const { isAuthenticated, userRole } = useAuth();
  return (
    <div className="bg-white text-gray-800 h-[100vh]">
      {!isAuthenticated && 
        <div className="absolute top-5 left-5">
        <Link href="/" className="text-purple-600 font-semibold text-lg">
        <a className="text-purple-600 hover:text-purple-800 underline">Retour à l'accueil</a>
        </Link>
      </div>
      }
      
      <div className="max-w-none mx-auto p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-center mb-5">Politique de confidentialité</h1>

        <p className="mb-4">
          Nous prenons la protection de vos données personnelles très au sérieux. Cette politique de confidentialité vous
          explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre
          application.
        </p>

        <h2 className="text-2xl font-semibold mt-5 mb-3">1. Collecte des données</h2>
        <p className="mb-4">
          Nous collectons des informations personnelles lorsque vous vous inscrivez sur notre application. Cela inclut,
          mais ne se limite pas à, vos nom, prénom, adresse e-mail, et toute autre information nécessaire pour vous
          fournir nos services.
        </p>

        <h2 className="text-2xl font-semibold mt-5 mb-3">2. Utilisation des données</h2>
        <p className="mb-4">
          Les données personnelles que nous collectons sont utilisées uniquement dans le cadre de la gestion de vos
          horaires de travail, la validation de vos tâches et le suivi comptable de votre travail pour l'entreprise.
        </p>

        <h2 className="text-2xl font-semibold mt-5 mb-3">3. Protection des données</h2>
        <p className="mb-4">
          Nous utilisons des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données
          contre tout accès non autorisé, altération ou destruction.
        </p>

        <h2 className="text-2xl font-semibold mt-5 mb-3">4. Partage des données</h2>
        <p className="mb-4">
          Nous ne partageons pas vos données personnelles avec des tiers, sauf si cela est nécessaire pour répondre à
          des exigences légales ou pour la gestion interne de notre entreprise.
        </p>

        <h2 className="text-2xl font-semibold mt-5 mb-3">5. Durée de conservation des données</h2>
        <p className="mb-4">
          Vos données seront conservées pendant la durée nécessaire à l'accomplissement des finalités pour lesquelles
          elles ont été collectées, et ce, conformément à la législation en vigueur. En général, les données seront
          conservées pendant 5 ans après la fin de votre mission.
        </p>

        <h2 className="text-2xl font-semibold mt-5 mb-3">6. Vos droits</h2>
        <p className="mb-4">
          Conformément à la législation en vigueur, vous disposez des droits suivants concernant vos données personnelles :
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification de vos données</li>
          <li>Droit à l'effacement de vos données</li>
          <li>Droit à la limitation du traitement de vos données</li>
          <li>Droit à la portabilité de vos données</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-5 mb-3">7. Contact</h2>
        <p className="mb-4">
          Si vous avez des questions concernant cette politique de confidentialité ou si vous souhaitez exercer vos droits,
          veuillez nous contacter à l'adresse suivante :{' '}
          <a href="mailto:gerant.exemple@mail.com" className="text-blue-600">
            gerant.exemple@mail.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default PolitiqueDeConfidentialite;
