import React from 'react';
import Link from 'next/link'; 


const Footer = () => {

  return (
    <footer className="text-center p-5 text-sm text-white border-t-violet-600 h-[10vh] bg-black">
      <div className='flex justify-center align-middle text-center items-center h-full'>
        <div>
        En vous connectant à l'application, vous acceptez la gestion de vos données personnelles conformément à notre&nbsp; 
        <Link href="/politiquedeconfidentialite">
          <a className="text-purple-600 hover:text-purple-800 underline">politique de confidentialité</a>
        </Link>.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
