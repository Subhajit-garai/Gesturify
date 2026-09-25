import React, { useRef, useEffect, useState, useMemo } from 'react';

interface SplitTextProps {
  text?: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity?: number; transform?: string };
  animationTo?: { opacity?: number; transform?: string };
  easing?: string;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';
  onLetterAnimationComplete?: () => void;
}

export default function SplitText({
  text = '',
  className = '',
  delay = 50,
  animationFrom = { opacity: 0, transform: 'translate3d(0,35px,0)' },
  animationTo = { opacity: 1, transform: 'translate3d(0,0,0)' },
  easing = 'cubic-bezier(0.2, 0.65, 0.3, 0.9)',
  threshold = 0.1,
  rootMargin = '-50px',
  textAlign = 'center',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const words = useMemo(() => text.split(' '), [text]);

  let letterIndex = 0;

  return (
    <p
      ref={containerRef}
      className={`inline-block overflow-hidden ${className}`}
      style={{ textAlign, whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {words.map((word, wordIdx) => {
        const letters = word.split('');
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {letters.map((char, charIdx) => {
              const currentDelay = letterIndex * delay;
              const isLast = wordIdx === words.length - 1 && charIdx === letters.length - 1;
              letterIndex++;

              return (
                <span
                  key={charIdx}
                  className="inline-block transition-all will-change-transform will-change-opacity"
                  style={{
                    opacity: inView ? animationTo.opacity ?? 1 : animationFrom.opacity ?? 0,
                    transform: inView
                      ? animationTo.transform ?? 'translate3d(0,0,0)'
                      : animationFrom.transform ?? 'translate3d(0,35px,0)',
                    transitionDuration: '0.6s',
                    transitionTimingFunction: easing,
                    transitionDelay: `${currentDelay}ms`,
                  }}
                  onTransitionEnd={isLast ? onLetterAnimationComplete : undefined}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </p>
  );
}
