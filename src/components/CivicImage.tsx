import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface CivicImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function CivicImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel = 'Civic Inspection Photo',
}: CivicImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-navy-900 to-navy-800 text-slate-300 p-6 text-center"
      >
        <ImageOff className="w-7 h-7 text-teal-400" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-200">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
