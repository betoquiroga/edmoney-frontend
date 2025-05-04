import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withLink?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium',
  withLink = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  const logoContent = (
    <span className={`font-bold ${sizeClasses[size]} text-blue-600 ${className}`}>
      FinTrack
    </span>
  );

  if (withLink) {
    return (
      <Link href="/" className="flex items-center focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo; 