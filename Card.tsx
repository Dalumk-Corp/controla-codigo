
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-white/20 hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
