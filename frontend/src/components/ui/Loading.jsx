import React from 'react';

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative">
      {/* Skeleton background */}
      <div className="skeleton h-32 w-32 rounded-xl bg-gray-800 opacity-40 absolute z-0" />

      {/* Foreground loading spinner and text */}
      <div className="flex flex-col items-center gap-4 z-10">
        <span className="loading loading-bars loading-lg text-white" />
        <p className="text-white text-sm">Loading PayPact...</p>
      </div>
    </div>
  );
}
