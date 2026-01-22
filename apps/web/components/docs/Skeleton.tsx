import React from 'react'
import { SkeletonDetails } from '../../types/Types'

const Skeleton = ({ 
  variant = 'text', 
  width = '100%', 
  height = '16px',
  className = '' 
}: SkeletonDetails) => {
    const baseStyles = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse'
  
  const variantStyles = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  }
  
  const selectedVariant = variantStyles[variant as keyof typeof variantStyles] || variantStyles.text
  
  const circularHeight = variant === 'circular' ? width : height
  
  return (
    <div
      className={`${baseStyles} ${selectedVariant} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof circularHeight === 'number' ? `${circularHeight}px` : circularHeight,
      }}
    />
  )
}

export default Skeleton