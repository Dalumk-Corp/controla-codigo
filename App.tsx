
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';

import Layout from './components/Layout';
import Home from './pages/Home';
import MeuDinheiro from './pages/MeuDinheiro';
import BusinessMoney from './pages/BusinessMoney';
import Brasil from './pages/Brasil';
import Chatbot from './components/Chatbot';

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <HashRouter>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/meu-dinheiro" element={<MeuDinheiro />} />
            <Route path="/business-money" element={<BusinessMoney />} />
            <Route path="/brasil" element={<Brasil />} />
          </Route>
        </Routes>
        
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 z-40"
          aria-label="Open AI Chatbot"
        >
          <MessageSquarePlus size={28} />
        </button>

        {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </HashRouter>
  );
}

export default App;
