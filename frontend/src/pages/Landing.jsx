import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../components/ui/Loading';

const TypingHero = lazy(() => import('../components/ui/TypingHero'));
const Logo = lazy(() => import('../components/ui/Logo'));
const SignIn = lazy(() => import('../components/ui/SignIn'));
const SignUp = lazy(() => import('../components/ui/SignUp'));
const ForgetPassword = lazy(() => import('../components/ui/ForgetPassword'));
const VideoBackground = lazy(() => import('../components/ui/VideoBackground'));

export default function Landing() {
  const [authScreen, setAuthScreen] = useState('signin'); // values: signin, signup, forgotpassword
  const navigate = useNavigate();
  const { email, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (email && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [email, isAuthenticated, navigate]);

  const onNavigate = (target) => {
    setAuthScreen(target.toLowerCase());
  };

  const title =
    authScreen === 'signin'
      ? 'Welcome Back!'
      : authScreen === 'signup'
      ? 'Join Us!'
      : 'Reset Password';

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen flex bg-gradient-to-br from-[#0d0d0d] via-slate-900 to-black text-white font-sans overflow-hidden">
        {/* Left: Video Hero */}
        <VideoBackground>
          <TypingHero />
        </VideoBackground>

        {/* Right: Auth Card */}
        <div className="w-1/2 h-full flex flex-col justify-center items-center px-8 relative bg-black/50 backdrop-blur-sm shadow-inner">
          {/* Logo */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
            <Logo />
          </div>

          {/* Form Section */}
          <div className="w-full max-w-sm space-y-6 mt-40">
            <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent tracking-wide drop-shadow-sm">
              {title}
            </h3>

            {authScreen === 'signin' && <SignIn onNavigate={onNavigate} />}
            {authScreen === 'signup' && <SignUp onNavigate={onNavigate} />}
            {authScreen === 'forgotpassword' && <ForgetPassword onNavigate={onNavigate} />}

            {/* Switch Button (SignIn/SignUp only) */}
            {authScreen !== 'forgotpassword' && (
              <div className="text-sm text-center text-gray-400 transition-opacity duration-300">
                {authScreen === 'signin'
                  ? "Don't have an account?"
                  : 'Already a user?'}
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(authScreen === 'signin' ? 'signup' : 'signin')
                  }
                  className="ml-2 underline bg-gradient-to-r from-white via-teal-300 to-cyan-300 bg-clip-text text-transparent hover:opacity-80 transition duration-300 cursor-pointer"
                >
                  {authScreen === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
