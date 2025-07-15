import React, { useEffect, useState } from 'react';

const FloatingBubbles = () => {
  const [bubbles, setBubbles] = useState<Array<{
    id: number;
    size: number;
    left: number;
    duration: number;
    delay: number;
    colorClass: string;
    sizeClass: string;
    glowClass: string;
  }>>([]);

  const colorClasses = ['bubble-white', 'bubble-blue', 'bubble-purple', 'bubble-pink', 'bubble-yellow', 'bubble-green', 'bubble-orange'];
  const sizeClasses = ['', 'bubble-small', 'bubble-large'];
  const glowClasses = ['', 'bubble-glow'];

  useEffect(() => {
    const createBubble = (position = 'anywhere') => {
      let leftPosition;
      
      if (position === 'left') {
        leftPosition = Math.random() * 25; // Left 25% of screen
      } else if (position === 'right') {
        leftPosition = Math.random() * 25 + 75; // Right 25% of screen
      } else {
        leftPosition = Math.random() * 100; // Anywhere
      }
      
      const newBubble = {
        id: Date.now() + Math.random(),
        size: Math.random() * 1.5 + 0.8, // 0.8rem to 2.3rem
        left: leftPosition,
        duration: Math.random() * 10 + 5, // 5s to 15s
        delay: Math.random() * 8, // 0s to 8s delay (reduced from 12s)
        colorClass: colorClasses[Math.floor(Math.random() * colorClasses.length)],
        sizeClass: sizeClasses[Math.floor(Math.random() * sizeClasses.length)],
        glowClass: Math.random() > 0.7 ? 'bubble-glow' : '', // 30% chance of glow
      };
      
      setBubbles(prev => [...prev, newBubble]);
      
      // Remove bubble after animation completes
      setTimeout(() => {
        setBubbles(prev => prev.filter(bubble => bubble.id !== newBubble.id));
      }, (newBubble.duration + newBubble.delay) * 1000);
    };

    // Create initial bubbles (60 bubbles total for more density)
    for (let i = 0; i < 60; i++) {
      let position;
      if (i % 3 === 0) position = 'left';
      else if (i % 3 === 1) position = 'right';
      else position = 'anywhere';
      
      setTimeout(() => createBubble(position), i * 80); // Faster initial spawn (80ms instead of 150ms)
    }

    // Create new bubbles every 1.2 seconds (faster continuous generation)
    const interval = setInterval(() => {
      const rand = Math.random();
      let position;
      if (rand < 0.35) position = 'left';
      else if (rand < 0.7) position = 'right';
      else position = 'anywhere';
      
      createBubble(position);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bubble-container">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className={`bubble ${bubble.colorClass} ${bubble.sizeClass} ${bubble.glowClass}`}
          style={{
            width: bubble.sizeClass ? undefined : `${bubble.size}rem`,
            height: bubble.sizeClass ? undefined : `${bubble.size}rem`,
            left: `${bubble.left}%`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBubbles;
