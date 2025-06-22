import React from 'react';

const Logo = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "w-8 h-8 text-sm",
    default: "w-12 h-12 text-lg", 
    large: "w-16 h-16 text-2xl",
    xl: "w-20 h-20 text-3xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-purple-400/30 relative overflow-hidden group hover:scale-105 transition-all duration-300`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* HB Text */}
        <span className="text-white font-bold tracking-tight relative z-10">
          HB
        </span>
        
        {/* Subtle fitness icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg className="w-3/4 h-3/4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
        </div>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent leading-tight">
          HealthBru
        </h2>
        <p className="text-purple-300 text-xs font-medium leading-tight">
          Fitness Journey
        </p>
      </div>
    </div>
  );
};

export default Logo; 