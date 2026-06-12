import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  onActiveChange?: (active: boolean) => void;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = "",
  onActiveChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (onActiveChange) {
      onActiveChange(isActive);
    }
  }, [isActive, onActiveChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const clientX = e.clientX;
      const clientY = e.clientY;

      // Check if mouse is within padding distance of element edge
      const isNear =
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding;

      if (isNear) {
        setIsActive(true);
        const distX = clientX - centerX;
        const distY = clientY - centerY;

        // Apply translate3d transform divided by strength factor
        setTransform({
          x: distX / strength,
          y: distY / strength,
        });
      } else {
        setIsActive(false);
        setTransform({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, strength]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      id="magnet-wrapper-outer"
      ref={containerRef}
      className={`inline-block ${className}`}
    >
      <div
        id="magnet-wrapper-inner"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) `,
          transition: transitionStyle,
          willChange: 'transform',
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};
