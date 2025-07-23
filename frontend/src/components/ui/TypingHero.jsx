import React from 'react';

const line1 = ["KeyCrypt."];
const line2 = [
  "Secure Passwords",
  "Encrypted Vault",
  "Access Anywhere",
];

const TypingHero = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-700">
      <h1 className="text-4xl font-bold mb-4">
        {line1.map((word, index) => (
          <span key={index} className="inline-block animate-fadeIn">
            {word}
          </span>
        ))}
      </h1>
      <div className="text-2xl font-semibold">
        {line2.map((word, index) => (
          <span key={index} className="inline-block animate-fadeIn delay-200">
            {word}
            {index < line2.length - 1 && ', '}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TypingHero;
