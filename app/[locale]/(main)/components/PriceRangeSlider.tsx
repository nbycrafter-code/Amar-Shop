// components/PriceRangeSlider.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  minLimit?: number;
  maxLimit?: number;
  minGap?: number;
  currency?: string;
  isBn?: boolean;
  showSubmitButton?: boolean;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  minLimit = 0,
  maxLimit = 10000,
  minGap = 500,
  currency = "৳",
  isBn = false,
  showSubmitButton = true
}) => {
  const [minValue, setMinValue] = useState(minPrice);
  const [maxValue, setMaxValue] = useState(maxPrice);
  const [minThumb, setMinThumb] = useState(0);
  const [maxThumb, setMaxThumb] = useState(0);
  const [localMinValue, setLocalMinValue] = useState(minPrice.toString());
  const [localMaxValue, setLocalMaxValue] = useState(maxPrice.toString());
  const [tempMinValue, setTempMinValue] = useState(minPrice);
  const [tempMaxValue, setTempMaxValue] = useState(maxPrice);
  
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  // Calculate thumb positions
  const calculateThumbPositions = useCallback(() => {
    const minPercent = ((tempMinValue - minLimit) / (maxLimit - minLimit)) * 100;
    const maxPercent = 100 - (((tempMaxValue - minLimit) / (maxLimit - minLimit)) * 100);
    setMinThumb(minPercent);
    setMaxThumb(maxPercent);
  }, [tempMinValue, tempMaxValue, minLimit, maxLimit]);

  // Update thumb positions when values change
  useEffect(() => {
    calculateThumbPositions();
  }, [calculateThumbPositions]);

  // Update values when props change
  useEffect(() => {
    setMinValue(minPrice);
    setMaxValue(maxPrice);
    setTempMinValue(minPrice);
    setTempMaxValue(maxPrice);
    setLocalMinValue(minPrice.toString());
    setLocalMaxValue(maxPrice.toString());
  }, [minPrice, maxPrice]);

  // Validation function
  const validateValues = useCallback((min: number, max: number) => {
    let validMin = min;
    let validMax = max;

    validMin = Math.max(minLimit, Math.min(validMin, maxLimit));
    validMax = Math.min(maxLimit, Math.max(validMax, minLimit));
    
    if (validMin > validMax - minGap) {
      validMin = Math.max(minLimit, validMax - minGap);
    }
    if (validMax < validMin + minGap) {
      validMax = Math.min(maxLimit, validMin + minGap);
    }

    return { validMin, validMax };
  }, [minLimit, maxLimit, minGap]);

  // Handle min price change (from slider) - FIXED
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    
    // Ensure min doesn't exceed max - gap
    let clampedMin = Math.min(newMin, tempMaxValue - minGap);
    clampedMin = Math.max(clampedMin, minLimit);
    
    const { validMin, validMax } = validateValues(clampedMin, tempMaxValue);
    
    setTempMinValue(validMin);
    setLocalMinValue(validMin.toString());
    setTempMaxValue(validMax);
    setLocalMaxValue(validMax.toString());
    
    if (!showSubmitButton) {
      setMinValue(validMin);
      setMaxValue(validMax);
      onPriceChange(validMin, validMax);
    }
  };

  // Handle max price change (from slider) - FIXED
  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    
    // Ensure max doesn't go below min + gap
    let clampedMax = Math.max(newMax, tempMinValue + minGap);
    clampedMax = Math.min(clampedMax, maxLimit);
    
    const { validMin, validMax } = validateValues(tempMinValue, clampedMax);
    
    setTempMinValue(validMin);
    setLocalMinValue(validMin.toString());
    setTempMaxValue(validMax);
    setLocalMaxValue(validMax.toString());
    
    if (!showSubmitButton) {
      setMinValue(validMin);
      setMaxValue(validMax);
      onPriceChange(validMin, validMax);
    }
  };

  // Handle min input change
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === "") {
      setLocalMinValue("");
      return;
    }
    
    if (/^\d*$/.test(value)) {
      setLocalMinValue(value);
      const newMin = parseInt(value);
      if (!isNaN(newMin)) {
        const clampedMin = Math.min(newMin, tempMaxValue - minGap);
        setTempMinValue(Math.max(clampedMin, minLimit));
      }
    }
  };

  // Handle min input blur
  const handleMinInputBlur = () => {
    let newMin = parseInt(localMinValue) || minLimit;
    newMin = Math.min(newMin, tempMaxValue - minGap);
    newMin = Math.max(newMin, minLimit);
    
    const { validMin, validMax } = validateValues(newMin, tempMaxValue);
    
    setTempMinValue(validMin);
    setLocalMinValue(validMin.toString());
    setTempMaxValue(validMax);
    setLocalMaxValue(validMax.toString());
    
    if (!showSubmitButton) {
      setMinValue(validMin);
      setMaxValue(validMax);
      onPriceChange(validMin, validMax);
    }
  };

  // Handle max input change
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === "") {
      setLocalMaxValue("");
      return;
    }
    
    if (/^\d*$/.test(value)) {
      setLocalMaxValue(value);
      const newMax = parseInt(value);
      if (!isNaN(newMax)) {
        const clampedMax = Math.max(newMax, tempMinValue + minGap);
        setTempMaxValue(Math.min(clampedMax, maxLimit));
      }
    }
  };

  // Handle max input blur
  const handleMaxInputBlur = () => {
    let newMax = parseInt(localMaxValue) || maxLimit;
    newMax = Math.max(newMax, tempMinValue + minGap);
    newMax = Math.min(newMax, maxLimit);
    
    const { validMin, validMax } = validateValues(tempMinValue, newMax);
    
    setTempMinValue(validMin);
    setLocalMinValue(validMin.toString());
    setTempMaxValue(validMax);
    setLocalMaxValue(validMax.toString());
    
    if (!showSubmitButton) {
      setMinValue(validMin);
      setMaxValue(validMax);
      onPriceChange(validMin, validMax);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, type: 'min' | 'max') => {
    if (e.key === 'Enter') {
      if (type === 'min') {
        handleMinInputBlur();
        if (!showSubmitButton) maxInputRef.current?.focus();
      } else {
        handleMaxInputBlur();
        if (!showSubmitButton) minInputRef.current?.focus();
      }
    }
  };

  // Handle submit
  const handleSubmit = () => {
    const { validMin, validMax } = validateValues(tempMinValue, tempMaxValue);
    setMinValue(validMin);
    setMaxValue(validMax);
    setTempMinValue(validMin);
    setTempMaxValue(validMax);
    setLocalMinValue(validMin.toString());
    setLocalMaxValue(validMax.toString());
    onPriceChange(validMin, validMax);
  };

  // Handle quick selection
  const handleQuickSelect = (min: number, max: number) => {
    const { validMin, validMax } = validateValues(min, max);
    setTempMinValue(validMin);
    setTempMaxValue(validMax);
    setLocalMinValue(validMin.toString());
    setLocalMaxValue(validMax.toString());
    
    if (!showSubmitButton) {
      setMinValue(validMin);
      setMaxValue(validMax);
      onPriceChange(validMin, validMax);
    }
  };

  // Handle reset
  const handleReset = () => {
    setTempMinValue(minLimit);
    setTempMaxValue(maxLimit);
    setLocalMinValue(minLimit.toString());
    setLocalMaxValue(maxLimit.toString());
    
    if (!showSubmitButton) {
      setMinValue(minLimit);
      setMaxValue(maxLimit);
      onPriceChange(minLimit, maxLimit);
    }
  };

  // Format price display
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Range Slider Container */}
      <div className="relative h-2 mb-8">
        {/* Min Slider */}
        <input
          type="range"
          step="100"
          min={minLimit}
          max={maxLimit}
          value={tempMinValue}
          onChange={handleMinSliderChange}
          className="absolute pointer-events-auto appearance-none z-30 h-2 w-full opacity-0 cursor-pointer
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:bg-transparent"
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* Max Slider */}
        <input
          type="range"
          step="100"
          min={minLimit}
          max={maxLimit}
          value={tempMaxValue}
          onChange={handleMaxSliderChange}
          className="absolute pointer-events-auto appearance-none z-30 h-2 w-full opacity-0 cursor-pointer
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:bg-transparent"
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* Slider Track */}
        <div className="relative z-10 h-2 w-full">
          {/* Background Track */}
          <div className="absolute left-0 right-0 bottom-0 top-0 rounded-md bg-gray-200"></div>
          
          {/* Active Range Track */}
          <div 
            className="absolute z-20 top-0 bottom-0 rounded-md bg-gradient-to-r from-red-500 to-red-600"
            style={{ 
              left: `${minThumb}%`,
              right: `${maxThumb}%`
            }}
          ></div>
          
          {/* Min Thumb */}
          <div 
            className="absolute z-40 w-5 h-5 top-1/2 -translate-y-1/2 bg-white border-2 border-red-500 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
            style={{ left: `calc(${minThumb}% - 10px)` }}
          ></div>
          
          {/* Max Thumb */}
          <div 
            className="absolute z-40 w-5 h-5 top-1/2 -translate-y-1/2 bg-white border-2 border-red-500 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
            style={{ right: `calc(${maxThumb}% - 10px)` }}
          ></div>
        </div>
      </div>

      {/* Price Input Fields */}
      <div className="flex items-center justify-between pt-6 space-x-4 text-sm text-gray-700">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">
            {isBn ? "ন্যূনতম মূল্য" : "Min Price"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {currency}
            </span>
            <input
              ref={minInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={localMinValue}
              onChange={handleMinInputChange}
              onBlur={handleMinInputBlur}
              onKeyPress={(e) => handleKeyPress(e, 'min')}
              className="w-full pl-8 pr-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">
            {isBn ? "সর্বোচ্চ মূল্য" : "Max Price"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {currency}
            </span>
            <input
              ref={maxInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={localMaxValue}
              onChange={handleMaxInputChange}
              onBlur={handleMaxInputBlur}
              onKeyPress={(e) => handleKeyPress(e, 'max')}
              className="w-full pl-8 pr-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
              placeholder={maxLimit.toString()}
            />
          </div>
        </div>
      </div>

      {/* Price Range Display */}
      <div className="flex justify-between items-center mt-4 pt-2 text-xs text-gray-500">
        <span>{currency}{formatPrice(minLimit)}</span>
        <span className="text-red-500 font-medium">
          {showSubmitButton && (tempMinValue !== minValue || tempMaxValue !== maxValue) ? (
            <span className="animate-pulse">{isBn ? "পরিবর্তন করা হয়েছে" : "Changed"}</span>
          ) : (
            <span>{isBn ? "নির্বাচিত রেঞ্জ" : "Selected Range"}</span>
          )}
        </span>
        <span>{currency}{formatPrice(maxLimit)}</span>
      </div>

      {/* Show current range when not submitted */}
      {(showSubmitButton && (tempMinValue !== minValue || tempMaxValue !== maxValue)) && (
        <div className="mt-2 text-center text-sm text-orange-600 bg-orange-50 rounded-lg p-2">
          {isBn ? "বর্তমান নির্বাচন:" : "Current selection:"} {currency}{formatPrice(tempMinValue)} - {currency}{formatPrice(tempMaxValue)}
        </div>
      )}

      {/* Quick Selection Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[
          { min: 0, max: 1000, label: `0-1k` },
          { min: 1000, max: 5000, label: `1k-5k` },
          { min: 5000, max: 10000, label: `5k-10k` },
          { min: 10000, max: 25000, label: `10k-25k` },
          { min: 25000, max: maxLimit, label: `25k+` }
        ].map((range, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickSelect(range.min, range.max)}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
              tempMinValue === range.min && tempMaxValue === range.max
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {currency}{range.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-all duration-200"
        >
          {isBn ? "রিসেট" : "Reset"}
        </button>

        {/* Submit Button */}
        {showSubmitButton && (
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
          >
            {isBn ? "ফিল্টার করুন" : "Apply Filter"}
          </button>
        )}
      </div>

      {!showSubmitButton && (
        <div className="mt-3 text-center text-xs text-gray-500">
          {isBn ? "লাইভ আপডেট" : "Live updates"}
        </div>
      )}
    </div>
  );
};