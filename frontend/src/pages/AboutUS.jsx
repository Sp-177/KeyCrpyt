import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, AlertTriangle, Globe, Lock, Zap, User, Github, Linkedin, ArrowRight, CheckCircle, Star, Code, Shield } from 'lucide-react';

export default function KeyCryptAbout() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rafId = useRef(null);
  const lastScrollY = useRef(0);

  // Smooth, throttled scroll handler for jitter-free parallax
  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      // Use linear interpolation for ultra-smooth scrolling
      const smoothY = lastScrollY.current + (currentScrollY - lastScrollY.current) * 0.1;
      setScrollY(smoothY);
      lastScrollY.current = smoothY;
    });
  }, []);

  // Smooth mouse tracking with throttling
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
    // Passive event listeners for better performance
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' // Trigger animations slightly before element is visible
      }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Refined parallax with will-change for GPU acceleration
  const parallaxStyle = useCallback((speed, axis = 'Y') => ({
    transform: axis === 'Y' 
      ? `translate3d(0, ${scrollY * speed}px, 0)` 
      : `translate3d(${scrollY * speed}px, 0, 0)`,
    willChange: 'transform',
  }), [scrollY]);

  const features = [
    {
      icon: <Lock className="w-10 h-10" />,
      title: "Secure Password Storage",
      description: "Military-grade AES-256 encryption ensures your credentials remain protected with zero-knowledge architecture",
      gradient: "from-cyan-400 to-teal-400"
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI-powered Suggestions",
      description: "Advanced machine learning algorithms analyze patterns to generate contextually perfect, unbreakable passwords",
      gradient: "from-teal-400 to-cyan-300"
    },
    {
      icon: <AlertTriangle className="w-10 h-10" />,
      title: "Anomaly Detection",
      description: "Real-time behavioral analysis detects suspicious login attempts and compromised credentials instantly",
      gradient: "from-cyan-300 to-cyan-400"
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "Universal Access",
      description: "Seamless synchronization across all platforms with end-to-end encrypted cloud infrastructure",
      gradient: "from-cyan-400 to-teal-400"
    }
  ];

  const techStack = [
    { name: "React", icon: "⚛️", color: "bg-gradient-to-br from-cyan-400 to-teal-400" },
    { name: "Node.js", icon: "🟢", color: "bg-gradient-to-br from-teal-400 to-cyan-300" },
    { name: "MongoDB", icon: "🍃", color: "bg-gradient-to-br from-cyan-300 to-cyan-400" },
    { name: "Express", icon: "⚡", color: "bg-gradient-to-br from-cyan-400 to-teal-400" },
    { name: "Firebase", icon: "🔥", color: "bg-gradient-to-br from-teal-400 to-cyan-300" },
    { name: "Python", icon: "🐍", color: "bg-gradient-to-br from-cyan-300 to-cyan-400" },
    { name: "AI/ML", icon: "🧠", color: "bg-gradient-to-br from-cyan-400 to-teal-400" }
  ];

  const stats = [
    { number: "256-bit", label: "AES Encryption", icon: <Shield className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime SLA", icon: <Zap className="w-6 h-6" /> },
    { number: "0ms", label: "Data Logging", icon: <Lock className="w-6 h-6" /> },
    { number: "∞", label: "Password Storage", icon: <Star className="w-6 h-6" /> }
  ];

  /* 
   * TODO: REPLACE WITH YOUR ACTUAL LOGO
   * Replace this component with your actual SVG logo
   * Example:
   * import KeyCryptLogo from './assets/keycrypt-logo.svg';
   * const LogoComponent = () => <KeyCryptLogo className="w-12 h-12" />;
   */
  const LogoPlaceholder = () => (
    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center text-black font-bold text-lg">
      KC
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Smooth animated background grid with GPU acceleration */}
      <div 
        className="fixed inset-0 opacity-30 transition-all duration-300 ease-out"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15) 0%, transparent 50%)`,
          willChange: 'background-image',
        }}
      />
      
      {/* Floating particles with staggered animations */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
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
            opacity: 0.6; 
          }
          50% { 
            transform: translate3d(0, -20px, 0) rotate(180deg); 
            opacity: 1; 
          }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.5); 
          }
          50% { 
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.8), 0 0 60px rgba(20, 184, 166, 0.4); 
          }
        }
        
        /* Smooth scrolling for better parallax */
        html {
          scroll-behavior: smooth;
        }
        
        /* GPU acceleration for all animated elements */
        .parallax-element {
          will-change: transform;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              {/* TODO: LOGO INTEGRATION - Replace LogoPlaceholder with your actual logo */}
              <LogoPlaceholder />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                KeyCrypt
              </span>
            </div>
            <div className="flex space-x-4">
              {/* TODO: NAVIGATION LINKS - Add your actual navigation routes */}
              <button 
                className="px-6 py-3 text-gray-200 hover:text-cyan-300 transition-all duration-300 hover:bg-white/5 rounded-lg"
                onClick={() => {
                  // TODO: Navigate to login page
                  // Example: navigate('/login') or window.location.href = '/login'
                  console.log('Navigate to login');
                }}
              >
                Login
              </button>
              <button 
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  // TODO: Navigate to signup page
                  // Example: navigate('/signup') or window.location.href = '/signup'
                  console.log('Navigate to signup');
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with refined parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements with smooth parallax */}
        <div 
          className="parallax-element absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"
          style={parallaxStyle(0.15)}
        />
        <div 
          className="parallax-element absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-cyan-300/20 rounded-full blur-3xl"
          style={parallaxStyle(0.25)}
        />
        <div 
          className="parallax-element absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-300/10 to-cyan-400/10 rounded-full blur-2xl"
          style={parallaxStyle(0.1)}
        />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div 
            className="parallax-element mb-8"
            style={parallaxStyle(-0.1)}
          >
            <div className="mb-8 flex justify-center">
              <div className="p-4 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-2xl backdrop-blur-sm border border-white/10">
                {/* TODO: HERO LOGO - Replace with your actual logo */}
                <LogoPlaceholder />
              </div>
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none">
              <span className="bg-gradient-to-r from-white via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                Key
              </span>
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Crypt
              </span>
            </h1>
            
            <div className="relative mb-8">
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-4 font-light leading-relaxed">
                Your <span className="text-cyan-300 font-semibold">intelligent companion</span> for managing passwords
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light">
                <span className="text-teal-400 font-semibold">effortlessly</span> and <span className="text-cyan-400 font-semibold">securely</span>
              </p>
            </div>
          </div>
          
          {/* Stats Row with smooth animation */}
          <div 
            className="parallax-element grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
            style={parallaxStyle(-0.05)}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500 hover:bg-cyan-400/5">
                  <div className="text-cyan-400 mb-2 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div 
            className="parallax-element flex flex-col sm:flex-row items-center justify-center gap-6"
            style={parallaxStyle(-0.02)}
          >
            {/* TODO: CTA BUTTONS - Add your actual navigation/functionality */}
            <button 
              className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
              onClick={() => {
                // TODO: Navigate to main app or signup
                // Example: navigate('/dashboard') or navigate('/signup')
                console.log('Navigate to main app');
              }}
            >
              <span>Start Securing Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              className="px-10 py-4 bg-black/60 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg rounded-xl hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300"
              onClick={() => {
                // TODO: Open demo video or navigate to demo page
                // Example: setShowDemo(true) or navigate('/demo')
                console.log('Show demo');
              }}
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Why KeyCrypt Section with refined parallax */}
      <section id="why-section" className="relative py-32 bg-slate-900/50">
        <div 
          className="parallax-element absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"
          style={parallaxStyle(0.05)}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible['why-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 px-6 py-3 rounded-full mb-6 border border-cyan-400/30">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">Why Choose KeyCrypt</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Security Meets
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              In an era of constant data breaches and evolving cyber threats, 
              <span className="text-cyan-300 font-semibold"> KeyCrypt empowers you</span> with 
              next-generation tools to stay ahead of the curve.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-black/60 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-cyan-400/50 transition-all duration-700 hover:bg-gradient-to-br hover:from-cyan-400/5 hover:to-teal-400/5 ${isVisible['why-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-teal-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 text-black group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-section" className="relative py-32 bg-gray-900/30">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible['tech-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-400/20 to-cyan-300/20 px-6 py-3 rounded-full mb-6 border border-teal-400/30">
              <Code className="w-5 h-5 text-teal-400" />
              <span className="text-teal-300 font-semibold">Technology Stack</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Built with Excellence
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
              Leveraging cutting-edge technologies to deliver unparalleled performance and security
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {techStack.map((tech, index) => (
              <div 
                key={index}
                className={`group relative bg-black/60 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-500 text-center hover:scale-110 hover:bg-cyan-400/5 ${isVisible['tech-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {tech.icon}
                </div>
                
                <div className={`w-full h-1 ${tech.color} rounded-full mb-3 group-hover:h-2 transition-all duration-300`} />
                
                <h3 className="text-white font-semibold text-sm group-hover:text-cyan-300 transition-colors">
                  {tech.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developer-section" className="relative py-32 bg-slate-900/70">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible['developer-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-300/20 to-cyan-400/20 px-6 py-3 rounded-full mb-6 border border-cyan-300/30">
                <User className="w-5 h-5 text-cyan-300" />
                <span className="text-cyan-300 font-semibold">Meet the Developer</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Passion Meets Innovation
              </h2>
            </div>
            
            <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-cyan-400/30 transition-all duration-700 relative overflow-hidden">
              <div className="parallax-element absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-3xl" style={parallaxStyle(0.02)} />
              
              <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center md:text-left">
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full mx-auto md:mx-0 mb-6 flex items-center justify-center shadow-2xl shadow-cyan-400/25">
                    {/* TODO: DEVELOPER PHOTO - Replace User icon with actual photo */}
                    <User className="w-16 h-16 text-black" />
                    {/* 
                     * To add your photo:
                     * <img src="/path/to/your/photo.jpg" alt="Developer" className="w-full h-full object-cover rounded-full" />
                     */}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {/* TODO: ADD YOUR NAME */}
                      Final-Year Developer
                    </h3>
                    <p className="text-lg text-cyan-300 font-semibold">B.Tech IT • NIT Raipur</p>
                    <div className="flex justify-center md:justify-start space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {/* TODO: CUSTOMIZE YOUR PERSONAL DESCRIPTION */}
                  <p className="text-gray-200 text-lg leading-relaxed mb-6">
                    Hello! I'm a passionate technologist dedicated to solving real-world security challenges. 
                    <span className="text-cyan-300 font-semibold"> KeyCrypt represents the culmination</span> of my 
                    academic journey—a full-stack capstone project that combines cutting-edge AI with robust security practices.
                  </p>
                  
                  <p className="text-gray-200 text-lg leading-relaxed mb-8">
                    Built with modern technologies and enhanced by AI-powered development tools, KeyCrypt embodies 
                    <span className="text-teal-400 font-semibold"> privacy-first design principles</span> for the next generation of digital users.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    {/* TODO: SOCIAL MEDIA LINKS - Add your actual GitHub and LinkedIn URLs */}
                    <button 
                      className="flex items-center space-x-3 bg-gray-800/80 hover:bg-gray-700/80 px-6 py-3 rounded-xl transition-all duration-300 border border-white/10 hover:border-cyan-400/50 group"
                      onClick={() => {
                        // TODO: Replace with your GitHub URL
                        // window.open('https://github.com/yourusername', '_blank');
                        console.log('Open GitHub profile');
                      }}
                    >
                      <Github className="w-5 h-5 text-gray-300 group-hover:text-cyan-300" />
                      <span className="text-gray-300 group-hover:text-white font-medium">View Projects</span>
                    </button>
                    <button 
                      className="flex items-center space-x-3 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-black px-6 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105"
                      onClick={() => {
                        // TODO: Replace with your LinkedIn URL
                        // window.open('https://linkedin.com/in/yourusername', '_blank');
                        console.log('Open LinkedIn profile');
                      }}
                    >
                      <Linkedin className="w-5 h-5" />
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="parallax-element absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-teal-400/5" style={parallaxStyle(0.03)} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 px-6 py-3 rounded-full mb-8 border border-cyan-400/30">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">Join the Revolution</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Your Digital Security?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of security-conscious users who trust KeyCrypt to protect their digital lives. 
              Experience the future of password management today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* TODO: FINAL CTA BUTTON - Link to your main application */}
            <button 
              className="group px-12 py-5 bg-gradient-to-r from-cyan-400 to-teal-400 text-black font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
              onClick={() => {
                // TODO: Navigate to your main app signup/dashboard
                // Example: navigate('/signup') or window.location.href = '/signup'
                console.log('Navigate to main app signup');
              }}
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-gray-400 text-sm">
              No credit card required • 30-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              {/* TODO: FOOTER LOGO - Replace with your actual logo */}
              <LogoPlaceholder />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                KeyCrypt
              </span>
            </div>
            
            <p className="text-gray-400 mb-4">
              Securing digital lives with intelligence and innovation
            </p>
            
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2025 KeyCrypt</span>
              <span>•</span>
              <span>Built with ❤️ for secure experiences</span>
              {/* TODO: ADD FOOTER LINKS */}
              {/* 
               * Add additional footer links like:
               * <a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
               * <a href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
               * <a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a>
               */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}