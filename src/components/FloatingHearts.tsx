
import { useEffect, useState } from "react";

type Heart = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  speed: number;
  color: string;
};

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  
  useEffect(() => {
    const colors = ["#ea384c", "#FF5C8A", "#FFDEE2", "#9b87f5"];
    let interval: number | null = null;
    let heartId = 0;
    
    const createHeart = () => {
      const newHeart: Heart = {
        id: heartId++,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 100,
        size: 15 + Math.random() * 20,
        opacity: 0.7 + Math.random() * 0.3,
        rotation: Math.random() * 360,
        speed: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      
      setHearts(prev => [...prev, newHeart]);
      
      // Remove hearts after they go off screen
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
      }, 15000);
    };
    
    // Create a heart every 300ms
    interval = window.setInterval(createHeart, 300);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);
  
  useEffect(() => {
    let animationFrameId: number;
    
    const moveHearts = () => {
      setHearts(prevHearts => 
        prevHearts.map(heart => ({
          ...heart,
          y: heart.y - heart.speed,
          rotation: heart.rotation + 0.2
        }))
      );
      
      animationFrameId = requestAnimationFrame(moveHearts);
    };
    
    animationFrameId = requestAnimationFrame(moveHearts);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map(heart => (
        <div
          key={heart.id}
          style={{
            position: 'absolute',
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            transform: `rotate(${heart.rotation}deg)`,
            opacity: heart.opacity,
            color: heart.color,
            fontSize: `${heart.size}px`,
            zIndex: -1
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
