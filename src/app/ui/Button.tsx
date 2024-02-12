import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  ...props
}) => {
  const buttonClassNames = [
    'relative',
    'min-w-full',
    'flex',
    'justify-center',
    'items-center',
    'gap-2',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-opacity-50',
    'active:bg-opacity-90', 
    'bg-blue-500',
    'active:bg-blue-600', ,
    'py-4',
    'text-white',
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonClassNames}
      disabled={disabled}
      onClick={(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
