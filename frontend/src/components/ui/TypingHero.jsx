import React from 'react';

const line1 = ['KeyCrypt.'];
const line2 = [
  'Secure Passwords',
  'Encrypted Vault',
  'Access Anywhere',
];

const TypingHero = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-100 px-4 sm:px-6 md:px-10">
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
        {line1.map((word, index) => (
          <span
            key={index}
            className={`inline-block animate-fadeIn opacity-0 animate-delay-[${index * 200}ms]`}
            style={{
              animation: `fadeIn 0.8s ease forwards`,
              animationDelay: `${index * 200}ms`,
            }}
          >
            {word}
          </span>
        ))}
      </h1>
      <div className="text-xl sm:text-2xl font-semibold space-x-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        {line2.map((word, index) => (
          <span
            key={index}
            className="inline-block opacity-0"
            style={{
              animation: `fadeIn 0.8s ease forwards`,
              animationDelay: `${800 + index * 300}ms`,
              animationFillMode: 'forwards',
            }}
          >
            {word}
            {index < line2.length - 1 && <span>, </span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TypingHero;
