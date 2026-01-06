
import React from "react";
import { Link } from "react-router-dom";
import { Wallet, Briefcase, MapPin } from "lucide-react";
import Card from "@/components/ui/Card";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

const Home: React.FC = () => {
  return (
    <AnimatedBackground>
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="mb-16 space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Controla+
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Clareza para o seu dinheiro, poder para o seu recomeço 🌅
          </p>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Sua ferramenta completa para gerenciar finanças pessoais e empresariais
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link to="/meu-dinheiro" className="group animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Card className="p-8 h-full cursor-pointer border-meu-dinheiro-primary/30">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-meu-dinheiro-primary/10 group-hover:bg-meu-dinheiro-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Wallet className="w-12 h-12 text-meu-dinheiro-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  💚 Meu Dinheiro
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Equilíbrio e estabilidade financeira pessoal
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/business-money" className="group animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Card className="p-8 h-full cursor-pointer border-business-primary/30">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-business-primary/10 group-hover:bg-business-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Briefcase className="w-12 h-12 text-business-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  💼 Business Money
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Profissionalismo e controle do seu negócio
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/brasil" className="group animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Card className="p-8 h-full cursor-pointer border-brasil-primary/30">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-brasil-primary/10 group-hover:bg-brasil-primary/20 transition-all duration-300 group-hover:scale-110">
                  <MapPin className="w-12 h-12 text-brasil-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  🇧🇷 Brasil
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Conexão com casa — acompanhe suas remessas
                </p>
              </div>
            </Card>
          </Link>
        </div>

        <footer className="mt-20 text-sm text-gray-500 space-y-2 animate-fade-in">
          <p className="font-medium">Controla+ — Construindo estabilidade, passo a passo 🌱</p>
          <p>Versão 1.0</p>
        </footer>
      </div>
    </AnimatedBackground>
  );
};

export default Home;
