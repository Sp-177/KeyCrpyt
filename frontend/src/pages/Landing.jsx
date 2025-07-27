// Fixed Landing.jsx - Only fixing authentication check logic
import React, { lazy, Suspense, useEffect } from 'react';
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
  const [method, setMethod] = React.useState('SignIn');
  const navigate = useNavigate();
  const { email, isAuthenticated } = useSelector((state) => state.auth); // Added isAuthenticated

  useEffect(() => {
    // Fixed authentication check to use both email and isAuthenticated
    if (email && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [email, isAuthenticated, navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen flex bg-black text-white font-sans overflow-hidden">
        {/* Left – Background Video & Hero */}
        <VideoBackground>
          <TypingHero />
        </VideoBackground>

        {/* Right – Auth Area */}
        <div className="w-1/2 h-full flex flex-col justify-center items-center px-8 relative">
          {/* ✅ Logo at center top – hover effect contained */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
            <Logo />
          </div>

          {/* Auth Form Area */}
          <div className="w-full max-w-sm space-y-6 mt-40">
            <h3 className="text-3xl font-semibold text-center text-gray-200 transition-all duration-300">
              {method === 'SignIn'
                ? 'Welcome Back!'
                : method === 'SignUp'
                ? 'Join Us!'
                : 'Reset Password'}
            </h3>

            {method === 'SignIn' ? (
              <SignIn setMethod={setMethod} />
            ) : method === 'SignUp' ? (
              <SignUp setMethod={setMethod} />
            ) : (
              <ForgetPassword setMethod={setMethod} />
            )}

            {method !== 'ForgotPassword' && (
              <div className="text-sm text-center text-gray-400 transition-opacity duration-300">
                {method === 'SignIn'
                  ? 'Dont have an account?'
                  : 'Already a user?'}
                <button
                  onClick={() =>
                    setMethod(method === 'SignIn' ? 'SignUp' : 'SignIn')
                  }
                  className="ml-2 underline text-white hover:text-gray-300 transition duration-300 cursor-pointer"
                >
                  {method === 'SignIn' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}