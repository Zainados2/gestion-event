import React from 'react';
import Link from 'next/link'; 


const Footer = () => {

  return (
    <footer className="text-center p-5 text-sm text-gray-700 border-t-violet-600">
      <p>
        En vous connectant à l'application, vous acceptez la gestion de vos données personnelles conformément à notre 
        <Link href="/politiquedeconfidentialite">
          <a className="text-purple-600 hover:text-purple-800 underline">politique de confidentialité</a>
        </Link>.
      </p>
    </footer>
  );
};

export default Footer;
