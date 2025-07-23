import React, { useRef, useEffect, useState } from 'react';
import TypingHero from './TypingHero';
import video from '../../assets/video.mp4';
import videorev from '../../assets/videorev.mp4';

export default function VideoBackground() {
  const forwardRef = useRef(null);
  const reverseRef = useRef(null);
  const [isReversed, setIsReversed] = useState(false);

  // Handle switching video playback
  useEffect(() => {
    const active = isReversed ? reverseRef.current : forwardRef.current;
    const onEnd = () => setIsReversed(prev => !prev);
    active?.addEventListener('ended', onEnd);

    return () => {
      active?.removeEventListener('ended', onEnd);
    };
  }, [isReversed]);

  // Start and pause appropriate video
  useEffect(() => {
    const forward = forwardRef.current;
    const reverse = reverseRef.current;

    if (isReversed) {
      forward.pause();
      reverse.currentTime = 0;
      reverse.play().catch(() => {});
    } else {
      reverse.pause();
      forward.currentTime = 0;
      forward.play().catch(() => {});
    }
  }, [isReversed]);

  return (
    <div className="w-1/2 h-full relative overflow-hidden rounded-r-3xl">
      {/* Forward video */}
      <video
        ref={forwardRef}
        muted
        playsInline
        className={`absolute left-0 top-0 w-full h-full object-cover object-[60%_center] transition-opacity duration-700 ease-in-out ${
          isReversed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Reverse video */}
      <video
        ref={reverseRef}
        muted
        playsInline
        className={`absolute left-0 top-0 w-full h-full object-cover object-[60%_center] transition-opacity duration-700 ease-in-out ${
          isReversed ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={videorev} type="video/mp4" />
      </video>

      {/* TypingHero stays untouched */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <TypingHero />
      </div>
    </div>
  );
}
