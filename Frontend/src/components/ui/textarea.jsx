import React from "react";

export const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};