// Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

export default function Logo() {
  return (
    <Link to="/" className="group block w-full max-w-[200px] mx-auto">
      <div className="transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:drop-shadow-lg">
        <img
          src={logo}
          alt="KeyCrpyt Logo"
          className="w-full mx-auto cursor-pointer filter brightness-200"
        />
        <span className="mt-2 block text-white text-center text-3xl font-semibold tracking-wide drop-shadow">
          Key<span className="text-blue-400">Crpyt</span>
        </span>
      </div>
    </Link>
  );
}
