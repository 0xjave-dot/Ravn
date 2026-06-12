import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface CharProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const Char: React.FC<CharProps> = ({ char, index, total, progress }) => {
  // Distribute character animations evenly across the scroll duration
  // Each character starts transitioning relative to its position in the string
  const start = index / total;
  const end = Math.min(1, start + 0.08); // Overlapping window for a smooth, natural transition
  
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      {/* Invisible placeholder to preserve layout/width */}
      <span className="opacity-0 select-none">{char === ' ' ? '\u00A0' : char}</span>
      {/* Absolute positioned animated character */}
      <motion.span
        style={{ opacity }}
        className="absolute top-0 left-0"
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "", style }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  
  // Custom scroll tracker targeted on the paragraph element itself
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(' ');
  
  let currentCharacterIndex = 0;
  const parsedWords = words.map((word, wordIdx) => {
    const wordCharacters = word.split('').map((char) => {
      const charIndex = currentCharacterIndex;
      currentCharacterIndex++;
      return { char, index: charIndex };
    });
    // Add 1 to currentCharacterIndex to account for the space after this word
    if (wordIdx < words.length - 1) {
      currentCharacterIndex++;
    }
    return wordCharacters;
  });

  return (
    <p
      id="scroll-reveal-text"
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={style}
    >
      {parsedWords.map((wordCharacters, wordIdx) => (
        <React.Fragment key={wordIdx}>
          <span className="inline-block whitespace-nowrap">
            {wordCharacters.map(({ char, index }) => (
              <Char
                key={index}
                char={char}
                index={index}
                total={text.length}
                progress={scrollYProgress}
              />
            ))}
          </span>
          {wordIdx < parsedWords.length - 1 && ' '}
        </React.Fragment>
      ))}
    </p>
  );
};
