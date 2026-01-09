import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import { AppHeader } from './AppHeader';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageDescription: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle, pageDescription }) => {
  return (
    <>
      <AppHeader />
      <AnimatedBackground>
        <div className="container mx-auto px-4 pt-24 pb-12">
          <header className="mb-10 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100">{pageTitle}</h1>
            <p className="text-lg text-slate-400 mt-2 max-w-2xl mx-auto">{pageDescription}</p>
          </header>
          <div className="animate-slide-up">
            {children}
          </div>
        </div>
      </AnimatedBackground>
    </>
  );
};

export default Layout;
