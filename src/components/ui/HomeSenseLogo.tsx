'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeSenseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  layout?: 'stacked' | 'horizontal';
  className?: string;
  href?: string;
  showText?: boolean;
  showSubtitle?: boolean;
  subtitleText?: string;
}

export default function HomeSenseLogo({
  size = 'md',
  layout = 'stacked',
  className = '',
  href = '/',
  showText = true,
  showSubtitle = false,
  subtitleText = 'Intelligence',
}: HomeSenseLogoProps) {
  const iconBoxStyles = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-[16px]',
    lg: 'w-16 h-16 rounded-[22px]',
  };

  const sparkIconStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  };

  const titleStyles = {
    sm: 'text-xs font-extrabold tracking-tight',
    md: 'text-base font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
  };

  const innerContent = (
    <div
      className={cn(
        'group inline-flex items-center justify-center transition-all duration-300',
        layout === 'stacked' ? 'flex-col gap-1.5 text-center' : 'flex-row gap-3',
        className
      )}
    >
      {/* Centered Glowing Purple Icon Box */}
      <div
        className={cn(
          'relative flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40 border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-violet-600/60 group-hover:border-white/40',
          iconBoxStyles[size]
        )}
      >
        <Sparkles className={cn('text-white drop-shadow-md transition-transform duration-300 group-hover:rotate-12', sparkIconStyles[size])} />
        {/* Decorative subtle dot glowing effect at bottom corner as in design */}
        <span className="absolute bottom-1 left-1.5 h-1 w-1 rounded-full bg-white/70 animate-pulse" />
      </div>

      {/* Centered Brand Name Underneath Icon */}
      {showText && (
        <div className={cn('flex flex-col', layout === 'stacked' ? 'items-center' : 'items-start')}>
          <span className={cn('text-white font-extrabold drop-shadow-sm leading-none', titleStyles[size])}>
            Home<span className="text-violet-300">Sense</span>
          </span>
          {showSubtitle && (
            <span className="mt-0.5 text-[9px] font-bold tracking-widest text-violet-300/80 uppercase">
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block no-underline focus:outline-none">
        {innerContent}
      </Link>
    );
  }

  return innerContent;
}
