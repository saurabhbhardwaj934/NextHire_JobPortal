import React, { useState } from "react";

export const Tabs = ({ children }) => {
  const [active, setActive] = useState(0);

  return React.Children.map(children, (child) => {
    return React.cloneElement(child, { active, setActive });
  });
};

export const TabsList = ({ children, active, setActive }) => {
  return (
    <div className="flex gap-2 border-b mb-2">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { index, active, setActive })
      )}
    </div>
  );
};

export const TabsTrigger = ({ children, index, active, setActive }) => {
  return (
    <button
      onClick={() => setActive(index)}
      className={`px-4 py-2 ${
        active === index ? "border-b-2 border-blue-600 text-blue-600" : ""
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, active }) => {
  return <div>{children[active]}</div>;
};