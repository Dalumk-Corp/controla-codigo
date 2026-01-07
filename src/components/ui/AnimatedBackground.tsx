
import React from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-green-900/20 animate-background-pan bg-[length:200%_200%]" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
