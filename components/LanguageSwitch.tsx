"use client";

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LanguageSwitchProps {
  variant?: 'default' | 'compact' | 'startup';
  className?: string;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ 
  variant = 'default', 
  className = '' 
}) => {
  const { language, toggleLanguage } = useLanguage();

  const baseClasses = "flex items-center space-x-2 transition-all duration-300";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-800/40 border border-blue-400/30 backdrop-blur-sm rounded-lg p-2 hover:border-blue-300/50 shadow-lg shadow-blue-500/20",
    compact: "bg-gradient-to-r from-purple-900/40 via-violet-900/30 to-purple-800/40 border border-purple-400/30 backdrop-blur-sm rounded-md p-1.5 hover:border-purple-300/50 shadow-md shadow-purple-500/20",
    startup: "bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-gray-900/60 border border-gray-400/30 backdrop-blur-sm rounded-lg p-2 hover:border-gray-300/50 shadow-lg shadow-gray-500/20"
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
  };

  return (
    <button
      onClick={handleLanguageToggle}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {/* 语言图标 */}
      <div className="flex items-center space-x-1">
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
          ${language === 'zh' 
            ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-lg shadow-red-500/30' 
            : 'bg-gradient-to-r from-blue-500 to-red-500 text-white shadow-lg shadow-blue-500/30'
          }
        `}>
          {language === 'zh' ? '中' : 'EN'}
        </div>
        
        {variant !== 'compact' && (
          <span className={`
            text-sm font-medium transition-colors duration-300
            ${language === 'zh' 
              ? 'text-yellow-300' 
              : 'text-blue-300'
            }
          `}>
            {language === 'zh' ? '中文' : 'English'}
          </span>
        )}
      </div>
      
      {/* 切换指示器 */}
      <div className="flex items-center space-x-1">
        <div className={`
          w-1 h-1 rounded-full transition-all duration-300
          ${language === 'zh' ? 'bg-yellow-400' : 'bg-blue-400'}
        `}></div>
        <div className="w-3 h-3 border border-gray-400/50 rounded-full flex items-center justify-center">
          <div className={`
            w-1.5 h-1.5 rounded-full transition-all duration-300
            ${language === 'zh' ? 'bg-yellow-400' : 'bg-blue-400'}
          `}></div>
        </div>
        <div className={`
          w-1 h-1 rounded-full transition-all duration-300
          ${language === 'zh' ? 'bg-blue-400' : 'bg-yellow-400'}
        `}></div>
      </div>
    </button>
  );
};

export default LanguageSwitch;