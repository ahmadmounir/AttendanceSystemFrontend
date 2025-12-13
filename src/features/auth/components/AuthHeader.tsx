import { GalleryVerticalEnd } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

interface AuthHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function AuthHeader({ className, children }: AuthHeaderProps) {
  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs", className)}>
      <div className="flex items-center justify-between w-full px-6 py-4 md:px-10">
        {/* Logo and company name on the left */}
        <Link to="login" className="flex items-center gap-3 font-medium hover:opacity-90 transition-opacity">
          <div className="bg-primary text-primary-foreground flex w-8 h-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className='text-xl font-medium'>FSM</span>
        </Link>
        
        {/* Language switcher and optional children on the right */}
        <div className="flex items-center gap-2">
          {children}
        </div>
      </div>
    </header>
  );
}