import React, { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

type StrengthLevel = 'empty' | 'weak' | 'medium' | 'strong' | 'very-strong';

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = useMemo((): StrengthLevel => {
    if (!password) return 'empty';
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Determine strength level based on score
    if (score === 0) return 'empty';
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    if (score <= 5) return 'strong';
    return 'very-strong';
  }, [password]);
  
  const getLabel = (strength: StrengthLevel): string => {
    switch (strength) {
      case 'empty': return 'Enter password';
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      case 'very-strong': return 'Very strong';
    }
  };
  
  const getColor = (strength: StrengthLevel): string => {
    switch (strength) {
      case 'empty': return 'bg-gray-200';
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very-strong': return 'bg-green-600';
    }
  };
  
  const getWidth = (strength: StrengthLevel): string => {
    switch (strength) {
      case 'empty': return 'w-0';
      case 'weak': return 'w-1/4';
      case 'medium': return 'w-2/4';
      case 'strong': return 'w-3/4';
      case 'very-strong': return 'w-full';
    }
  };
  
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getWidth(strength)} ${getColor(strength)} transition-all duration-300`}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">
        {getLabel(strength)}
      </p>
    </div>
  );
};

export default PasswordStrength;