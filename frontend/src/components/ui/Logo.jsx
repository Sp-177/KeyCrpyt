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
          alt="KeyCrypt Logo"
          className="w-full mx-auto cursor-pointer filter brightness-[1.6] saturate-[1.4] drop-shadow-[0_0_6px_rgba(13,255,247,0.3)]"
        />
        <span className="mt-2 block text-3xl font-bold text-center bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent tracking-wide drop-shadow-sm">
          Key<span className="ml-1">Crypt</span>
        </span>
      </div>
    </Link>
  );
}
