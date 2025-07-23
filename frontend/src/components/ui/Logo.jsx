import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg'; // Replace with actual SVG

export default function Logo() {
  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 text-center">
      <Link to="/" className="group block">
        <div className="transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:drop-shadow-lg">
          <img
            src={logo}
            alt="KeyCrpyt Logo"
            className="w-48 mx-auto cursor-pointer filter  brightness-200"
          />
          <span className="relative mt-2 block text-white text-xl font-semibold tracking-wide">
            <span className="text-white drop-shadow-sm blur-[0.5px] text-4xl">
              Key
              <span className="text-blue-400 drop-shadow-md blur-[0.4px]">
                Crpyt
              </span>
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}
