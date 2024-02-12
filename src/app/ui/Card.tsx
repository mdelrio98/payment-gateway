import React from 'react';


interface CardProps {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="w-full mt-2 flex justify-center items-center bg-white rounded-lg shadow-lg border border-gray-200 p-8  m-0 max-w-sm md:max-w-md lg:max-w-lg h-full">
      {children}
    </div>
  );
};

export default Card;
