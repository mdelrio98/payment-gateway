import React, { forwardRef } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  error?: string | null;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { label, placeholder, value, onChange, disabled, className, error },
  ref
) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={`${className} text-gray-700 bg-white border border-gray-300 rounded-lg p-4 h-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${
          error ? 'border-red-500' : ''
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default forwardRef(Input);
