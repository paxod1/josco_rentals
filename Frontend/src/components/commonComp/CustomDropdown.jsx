import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const CustomDropdown = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
    className = "",
    renderOption = null,
    error = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        if (option.disabled) return;
        onChange(option.value);
        setIsOpen(false);
    };

    // Find selected option object
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className={`w-full px-4 py-2 bg-white border rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'hover:border-blue-400'
                    } ${error ? 'border-red-500' : 'border-gray-300'} ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''
                    }`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-800'}`}>
                    {selectedOption ? (selectedOption.label || selectedOption.text) : placeholder}
                </span>
                <FiChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto animate-fade-in-down">
                    <div className="py-1">
                        {options.length > 0 ? (
                            options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`px-4 py-2 cursor-pointer transition-colors duration-150 flex items-center justify-between ${option.disabled
                                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : option.value === value
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-800 hover:bg-gray-50 hover:text-blue-600'
                                        }`}
                                >
                                    <div className="flex-1">
                                        {renderOption ? renderOption(option) : (option.label || option.text)}
                                    </div>
                                    {option.value === value && (
                                        <FiCheck className="w-4 h-4 text-blue-600 ml-2" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .animate-fade-in-down {
                    animation: fadeInDown 0.2s ease-out forwards;
                    transform-origin: top center;
                }
                @keyframes fadeInDown {
                    0% {
                        opacity: 0;
                        transform: scaleY(0.95) translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: scaleY(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default CustomDropdown;
