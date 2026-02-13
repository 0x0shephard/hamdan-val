import React, { useEffect, useState } from 'react';
import { Heart, Diamond, Club, Spade } from 'lucide-react';

interface FloatingItem {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  delay: number;
  type: 'heart' | 'diamond' | 'club' | 'spade';
}

const FloatingHearts: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const types: ('heart' | 'diamond' | 'club' | 'spade')[] = ['heart', 'diamond', 'club', 'spade'];
    // Generate random suits for background
    const newItems = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      animationDuration: 15 + Math.random() * 20, // seconds
      size: 14 + Math.random() * 24, // px
      delay: Math.random() * 5, // seconds
      type: types[Math.floor(Math.random() * types.length)]
    }));
    setItems(newItems);
  }, []);

  const renderIcon = (type: string, size: number) => {
      switch(type) {
          case 'heart': return <Heart fill="currentColor" size={size} />;
          case 'diamond': return <Diamond fill="currentColor" size={size} />;
          case 'club': return <Club fill="currentColor" size={size} />;
          case 'spade': return <Spade fill="currentColor" size={size} />;
          default: return <Heart fill="currentColor" size={size} />;
      }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute text-[#C65060] opacity-20"
          style={{
            left: `${item.left}%`,
            bottom: '-50px',
            animation: `float ${item.animationDuration}s linear infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
            {renderIcon(item.type, item.size)}
        </div>
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingHearts;