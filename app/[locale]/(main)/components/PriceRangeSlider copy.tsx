"use client";

import { useState, useEffect } from "react";

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  minLimit?: number;
  maxLimit?: number;
  minGap?: number;
  currency?: string;
  isBn?: boolean;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPricee,
  maxPricee,
  onPriceChange,
  minLimit = 500,
  maxLimit = 10000,
  minGap = 1,
  currency = "৳",
  isBn = false
}) => {
  const min = 0;
  const max = 10000;
  const gap = 500;

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  

  const [minThumb, setMinThumb] = useState(0);
  const [maxThumb, setMaxThumb] = useState(0);

  useEffect(() => {
    setMinThumb(((minPrice - min) / (max - min)) * 100);

    setMaxThumb(
      100 - ((maxPrice - min) / (max - min)) * 100
    );
  }, [minPrice, maxPrice]);

  const handleMinChange = (e) => {
    const value = Number(e.target.value);

    if (value < maxPrice - gap) {
      setMinPrice(value);
    }
    
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);

    if (value > minPrice + gap) {
      setMaxPrice(value);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative max-w-xl w-full">

        {/* Range Inputs */}
        <div className="relative">

          <input
            type="range"
            min={min}
            max={max}
            step="100"
            value={minPrice}
            onMouseUp={handleMinChange}
            className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0"
          />

          <input
            type="range"
            min={min}
            max={max}
            step="100"
            value={maxPrice}
            onChange={handleMaxChange}
            className="absolute pointer-events-none appearance-none z-20 h-2 w-full opacity-0"
          />

          {/* Track */}
          <div className="relative h-2">

            <div className="absolute inset-0 rounded-md bg-gray-200"></div>

            <div
              className="absolute rounded-md bg-green-400 h-2"
              style={{
                left: `${minThumb}%`,
                right: `${maxThumb}%`,
              }}
            />

            {/* Left thumb */}
            <div
              className="absolute w-6 h-6 bg-green-400 rounded-full -top-2"
              style={{
                left: `${minThumb}%`,
                transform: "translateX(-50%)",
              }}
            />

            {/* Right thumb */}
            <div
              className="absolute w-6 h-6 bg-green-400 rounded-full -top-2"
              style={{
                right: `${maxThumb}%`,
                transform: "translateX(50%)",
              }}
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="flex justify-between pt-6">

          <input
            type="number"
            value={minPrice}
            onChange={handleMinChange}
            className="w-24 px-3 py-2 border rounded-lg text-center"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxChange}
            className="w-24 px-3 py-2 border rounded-lg text-center"
          />
        </div>

        {/* Price labels */}
        <div className="flex justify-between mt-4">
          <span>৳{minPrice}</span>
          <span>৳{maxPrice}</span>
        </div>

      </div>
    </div>
  );
};