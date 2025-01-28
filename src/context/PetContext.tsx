"use client";

import { createContext } from "react";

const PetContext = createContext();

// create the Provider
function Provider({ children }) {
  return (
    <PetContext.Provider value={5}>
      {children}
    </PetContext.Provider>
  );
};

export { Provider };
export default PetContext;
