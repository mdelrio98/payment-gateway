import React, { useState, forwardRef, ForwardedRef } from 'react';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  disabled?: boolean;
  className?: string;
  error?: string | null;
}

const Textarea = forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      rows = 4,
      disabled,
      className,
      error
    }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const [textareaValue, setTextareaValue] = useState(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextareaValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>
        )}
        <textarea
          ref={ref}
          className={`${className} text-gray-700 bg-white border border-gray-300 rounded-lg p-4 h-auto resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          } ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={textareaValue}
          onChange={handleChange}
          rows={rows}
          disabled={disabled}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
