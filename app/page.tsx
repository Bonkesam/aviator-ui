
// app/page.tsx - Landing page with route selection
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { GSAPAnimations, createTimeline } from '@/lib/gsap';
import { Plane, Shield, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && heroRef.current && cardsRef.current) {
      const tl = createTimeline();
      
      tl.fromTo(heroRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }
      )
      .fromTo(cardsRef.current.children,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.6 },
        "-=0.4"
      );
    }
  }, []);

  const handleCardClick = (route: string) => {
    if (!isConnected) {
      return; // ConnectButton will handle this
    }
    router.push(route);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-cyan-400" />
              <span className="font-bold text-xl text-white">AdvancedAviator</span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Take Flight with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Blockchain Gaming
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience the ultimate aviator game powered by Chainlink VRF. 
            Real randomness, fair gameplay, and immersive 3D flight simulation.
          </p>
        </div>
      </div>

      {/* Route Cards */}
      <div ref={cardsRef} className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Player Route */}
          <RouteCard
            title="Play Game"
            description="Experience thrilling flight betting with realistic 3D graphics and blockchain-powered randomness"
            icon={<Plane className="h-12 w-12 text-cyan-400" />}
            features={[
              "3D Flight Simulation",
              "VRF-Powered Randomness", 
              "Real-time Multipliers",
              "Mobile Optimized"
            ]}
            route="/player"
            buttonText="Start Flying"
            isConnected={isConnected}
            onClick={() => handleCardClick('/player')}
          />

          {/* Admin Route */}
          <RouteCard
            title="Admin Dashboard"
            description="Monitor game statistics, manage rounds, and oversee all gaming operations"
            icon={<Shield className="h-12 w-12 text-emerald-400" />}
            features={[
              "Real-time Analytics",
              "Round Management",
              "Player Statistics",
              "Emergency Controls"
            ]}
            route="/admin"
            buttonText="Access Dashboard"
            isConnected={isConnected}
            onClick={() => handleCardClick('/admin')}
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}

interface RouteCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  route: string;
  buttonText: string;
  isConnected: boolean;
  onClick: () => void;
  variant?: 'player' | 'admin';
}

function RouteCard({ 
  title, 
  description, 
  icon, 
  features, 
  buttonText, 
  isConnected, 
  onClick,
  variant = 'player'
}: RouteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (cardRef.current) {
      GSAPAnimations.buttonPress(cardRef.current);
    }
    onClick();
  };

  const accentColor = variant === 'admin' ? 'emerald' : 'cyan';

  return (
    <div 
      ref={cardRef}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br from-slate-800/50 to-slate-900/50
        backdrop-blur-sm border border-slate-700
        rounded-2xl p-8 transition-all duration-300
        hover:border-${accentColor}-500/50 hover:shadow-2xl
        ${!isConnected ? 'opacity-75' : ''}
      `}
      onClick={handleClick}
    >
      {/* Icon */}
      <div className="mb-6">
        {icon}
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-300 leading-relaxed">{description}</p>
      </div>

      {/* Features */}
      <div className="mb-8">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-slate-400">
              <ChevronRight className={`h-4 w-4 text-${accentColor}-400 mr-2`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Button */}
      <button 
        className={`
          w-full py-4 px-6 rounded-xl font-semibold
          ${isConnected 
            ? `bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600 
               hover:from-${accentColor}-600 hover:to-${accentColor}-700
               text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }
          transition-all duration-300
        `}
        disabled={!isConnected}
      >
        {isConnected ? buttonText : 'Connect Wallet First'}
      </button>

      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        bg-gradient-to-r from-${accentColor}-500/10 to-${accentColor}-600/10
        transition-opacity duration-300 pointer-events-none
      `} />
    </div>
  );
}