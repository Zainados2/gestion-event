import React from 'react';
import Link from 'next/link'; 


const Footer = () => {

  return (
    <footer className="text-center p-5 bg-gray-100 text-sm text-gray-700 mt-5">
      <p>
        En vous connectant à l'application, vous acceptez la gestion de vos données personnelles conformément à notre
        <Link href="/politiquedeconfidentialite">
          <a className="text-blue-600 hover:text-blue-800 underline"> politique de confidentialité</a>
        </Link>.
      </p>
    </footer>
  );
};

export default Footer;
