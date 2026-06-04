'use client'

import * as Icons from "lucide-react";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;  // color প্রপ যোগ করুন
}

export default function Icon({ name, size = 24, className = "", color }: IconProps) {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent
      size={size}
      className={className}
      color={color}  // color প্রপ ব্যবহার করুন
      strokeWidth={1.5}
    />
  );
}