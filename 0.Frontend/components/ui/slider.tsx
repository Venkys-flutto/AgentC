'use client'

import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  defaultValue = 0,
  onChange,
  className = '',
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const calculatePercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const calculateValue = (percentage: number) => {
    return Math.round(((max - min) * percentage) / 100 + min);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = calculateValue(percentage);
    
    setValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={`relative w-full h-6 ${className}`}>
      <div
        ref={sliderRef}
        className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* Filled Track */}
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${calculatePercentage(value)}%` }}
        />
        
        {/* Thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full transform -translate-y-1/2 top-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: `${calculatePercentage(value)}%` }}
        />
      </div>
    </div>
  );
};

export default Slider;