import React, { useState, useEffect, useRef, forwardRef, ForwardedRef } from "react";
import { Option } from '../lib/definitions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface DropdownProps<T> {
  label: string;
  placeholder: string;
  options: Option<T>[];
  onSelect: (option: Option<T>) => void;
}

const Dropdown: React.FC<DropdownProps<unknown>> = forwardRef(
  ({ label, placeholder, options, onSelect }: DropdownProps<unknown>, ref: ForwardedRef<HTMLDivElement>) => {
    const [selectedOption, setSelectedOption] = useState<Option<unknown> | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener("click", handleOutsideClick, true);

      return () => {
        document.removeEventListener("click", handleOutsideClick, true);
      };
    }, []);

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      const selectedOption = options.find((option) => String(option.value) === selectedValue) || null;
      setSelectedOption(selectedOption);
      onSelect(selectedOption!); // Assuming onSelect will always receive a non-null option
      setIsOpen(false);
    };

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className="w-full relative" ref={ref || dropdownRef}>
        {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          <select
            value={selectedOption?.label ?? ""}
            onChange={handleOptionChange}
            className="z-0 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option: Option<unknown>) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          >
            <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} />
          </div>
        </div>
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
