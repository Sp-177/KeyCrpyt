import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Home, 
  RefreshCw, 
  ArrowLeft, 
  Zap,
  Lock,
  AlertCircle,
  WifiOff,
  Server,
  FileX
} from 'lucide-react';

export default function KeyCryptErrorPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [errorCode, setErrorCode] = useState('404');
  const [isRetrying, setIsRetrying] = useState(false);
  const rafId = useRef(null);
  const lastScrollY = useRef(0);

  // Smooth scroll handler for parallax effects
  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const smoothY = lastScrollY.current + (currentScrollY - lastScrollY.current) * 0.1;
      setScrollY(smoothY);
      lastScrollY.current = smoothY;
    });
  }, []);

  // Smooth mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      setMousePosition({ 
        x: e.clientX, 
        y: e.clientY 
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll, handleMouseMove]);

  // Auto-detect error type from URL or props
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('500') || path.includes('server')) {
      setErrorCode('500');
    } else if (path.includes('403') || path.includes('forbidden')) {
      setErrorCode('403');
    } else if (path.includes('network') || path.includes('offline')) {
      setErrorCode('NETWORK');
    } else {
      setErrorCode('404');
    }
  }, []);

  const parallaxStyle = useCallback((speed, axis = 'Y') => ({
    transform: axis === 'Y' 
      ? `translate3d(0, ${scrollY * speed}px, 0)` 
      : `translate3d(${scrollY * speed}px, 0, 0)`,
    willChange: 'transform',
  }), [scrollY]);

  // Error configurations
  const errorConfigs = {
    '404': {
      icon: <FileX className="w-24 h-24" />,
      title: "Page Not Found",
      subtitle: "The page you're looking for has vanished into the digital void",
      description: "This could be a broken link, a typo, or the page may have been moved or deleted.",
      glitchText: "404",
      color: "from-cyan-400 to-teal-400"
    },
    '500': {
      icon: <Server className="w-24 h-24" />,
      title: "Server Error",
      subtitle: "Our servers are having a moment",
      description: "Something went wrong on our end. Our team has been notified and is working on a fix.",
      glitchText: "500",
      color: "from-red-400 to-rose-400"
    },
    '403': {
      icon: <Lock className="w-24 h-24" />,
      title: "Access Denied",
      subtitle: "You don't have permission to access this resource",
      description: "This area is restricted. Please check your credentials or contact support if you believe this is an error.",
      glitchText: "403",
      color: "from-yellow-400 to-orange-400"
    },
    'NETWORK': {
      icon: <WifiOff className="w-24 h-24" />,
      title: "Connection Lost",
      subtitle: "Unable to connect to KeyCrypt servers",
      description: "Please check your internet connection and try again. If the problem persists, our servers might be down.",
      glitchText: "NET",
      color: "from-purple-400 to-pink-400"
    }
  };

  const currentError = errorConfigs[errorCode] || errorConfigs['404'];

  /* 
   * TODO: REPLACE WITH YOUR ACTUAL LOGO
   * Replace this component with your actual SVG logo
   */
  const LogoPlaceholder = () => (
    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-lg flex items-center justify-center text-black font-bold">
      KC
    </div>
  );

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // TODO: Add your actual retry logic here
    // Example: await retryConnection() or window.location.reload()
    
    setTimeout(() => {
      setIsRetrying(false);
      // For demonstration - in real app, implement actual retry logic
      console.log('Retry attempted');
    }, 2000);
  };

  const handleGoHome = () => {
    // TODO: Navigate to home page
    // Example: navigate('/') or window.location.href = '/'
    console.log('Navigate to home');
  };

  const handleGoBack = () => {
    // TODO: Navigate back or to previous page
    // Example: navigate(-1) or window.history.back()
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center">
      {/* Animated background with mouse tracking */}
      <div 
        className="fixed inset-0 opacity-20 transition-all duration-500 ease-out"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`,
          willChange: 'background-image',
        }}
      />
      
      {/* Floating error particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>

      {/* Glitch effect particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-0.5 bg-gradient-to-r ${currentError.color} opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `glitch ${2 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translate3d(0, 0px, 0) rotate(0deg); 
            opacity: 0.4; 
          }
          50% { 
            transform: translate3d(0, -30px, 0) rotate(180deg); 
            opacity: 0.8; 
          }
        }
        
        @keyframes glitch {
          0%, 100% { 
            transform: translate3d(0, 0, 0) scaleX(1); 
            opacity: 0.6; 
          }
          25% { 
            transform: translate3d(-5px, 0, 0) scaleX(0.9); 
            opacity: 0.8; 
          }
          50% { 
            transform: translate3d(5px, 0, 0) scaleX(1.1); 
            opacity: 0.4; 
          }
          75% { 
            transform: translate3d(-3px, 0, 0) scaleX(0.95); 
            opacity: 0.9; 
          }
        }
        
        @keyframes glitch-text {
          0%, 100% { 
            transform: translate3d(0, 0, 0); 
            text-shadow: 0 0 0 transparent;
          }
          20% { 
            transform: translate3d(-2px, 0, 0); 
            text-shadow: 2px 0 0 #06b6d4;
          }
          40% { 
            transform: translate3d(2px, 0, 0); 
            text-shadow: -2px 0 0 #14b8a6;
          }
          60% { 
            transform: translate3d(-1px, 0, 0); 
            text-shadow: 1px 0 0 #06b6d4;
          }
          80% { 
            transform: translate3d(1px, 0, 0); 
            text-shadow: -1px 0 0 #14b8a6;
          }
        }
        
        .glitch-text {
          animation: glitch-text 3s ease-in-out infinite;
        }
        
        /* GPU acceleration */
        .parallax-element {
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
      `}</style>

      {/* Main error content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Background decorative elements */}
        <div 
          className="parallax-element absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-2xl"
          style={parallaxStyle(0.1)}
        />
        <div 
          className="parallax-element absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-red-400/10 to-rose-400/10 rounded-full blur-2xl"
          style={parallaxStyle(0.15)}
        />

        {/* Header with logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            {/* TODO: LOGO INTEGRATION - Replace LogoPlaceholder with your actual logo */}
            <LogoPlaceholder />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              KeyCrypt
            </span>
          </div>
        </div>

        {/* Error icon and glitch number */}
        <div className="mb-8 relative">
          <div className={`text-6xl md:text-8xl lg:text-9xl font-black mb-4 glitch-text bg-gradient-to-r ${currentError.color} bg-clip-text text-transparent`}>
            {currentError.glitchText}
          </div>
          
          <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${currentError.color.replace('to-', 'to-')}/20 backdrop-blur-sm border border-white/10 mb-6`}>
            <div className={`text-gradient bg-gradient-to-br ${currentError.color} bg-clip-text text-transparent`}>
              {currentError.icon}
            </div>
          </div>
        </div>

        {/* Error text content */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            {currentError.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-cyan-300 mb-6 font-medium">
            {currentError.subtitle}
          </p>
          
          <p className="text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {currentError.description}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* TODO: HOME BUTTON - Link to your home page */}
          <button 
            onClick={handleGoHome}
            className="group px-8 py-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>

          {/* Retry button (conditional based on error type) */}
          {(errorCode === '500' || errorCode === 'NETWORK') && (
            <button 
              onClick={handleRetry}
              disabled={isRetrying}
              className="group px-8 py-4 bg-black/60 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg rounded-xl hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
            </button>
          )}

          {/* TODO: BACK BUTTON - Navigate to previous page */}
          <button 
            onClick={handleGoBack}
            className="group px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-white font-semibold text-lg rounded-xl transition-all duration-300 border border-white/10 hover:border-cyan-400/50 flex items-center space-x-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional help section */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">Need Help?</span>
          </div>
          
          <p className="text-gray-200 text-sm mb-4">
            If you continue to experience issues, here are some things you can try:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Clear your browser cache</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <span>Check your internet connection</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
              <span>Try a different browser</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
              <span>Contact our support team</span>
            </div>
          </div>
          
          {/* TODO: SUPPORT CONTACT - Add your actual support contact */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <button 
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              onClick={() => {
                // TODO: Open support page or contact form
                // Example: navigate('/support') or window.location.href = 'mailto:support@keycrypt.com'
                console.log('Contact support');
              }}
            >
              Contact Support →
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Status</span>
          </div>
          <span>•</span>
          {/* TODO: SYSTEM STATUS - Link to your status page */}
          <button 
            className="hover:text-cyan-400 transition-colors"
            onClick={() => {
              // TODO: Link to status page
              // Example: window.open('https://status.keycrypt.com', '_blank')
              console.log('Open status page');
            }}
          >
            Check Service Status
          </button>
        </div>
      </div>
    </div>
  );
}