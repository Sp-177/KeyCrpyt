import React from "react";
import { HiHome, HiKey, HiBell } from "react-icons/hi";

const FloatingHint = ({ isDark }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20">
      <div
        className={`inline-flex items-center gap-3 ${
          isDark ? "text-teal-300/70" : "text-teal-600/60"
        } text-sm font-light`}
      >
        <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" />
        <span className="flex items-center gap-1">
          <HiHome className="text-base" />
          <span className="font-medium">Home</span>
        </span>

        <div
          className="w-1 h-1 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.3s" }}
        />
        <span className="flex items-center gap-1">
          <HiKey className="text-base" />
          <span className="font-medium">Passwords</span>
        </span>

        <div
          className="w-1 h-1 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.6s" }}
        />
        <span className="flex items-center gap-1">
          <HiBell className="text-base" />
          <span className="font-medium">Alerts</span>
        </span>

        <div
          className="w-1 h-1 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.9s" }}
        />
        <span>
          Tap <span className="font-semibold">Avatar</span> for Settings
        </span>

        <div
          className="w-1 h-1 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "1.2s" }}
        />
      </div>
    </div>
  );
};

export default FloatingHint;
