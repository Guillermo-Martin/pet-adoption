"use client";
import { createContext, ReactNode } from "react";


interface ProviderProps {
  children: ReactNode;
};

interface Animal {
  id: number;
  name: string;
  gender: string;
  age: string;
  breeds: {
    primary: string;
  };
  contact: {
    address: {
      city: string
    }
  };
  primary_photo_cropped: {
    full: string;
  }
};

// create the context.  Tyep: The data is going to be an array of objects or null
const PetContext = createContext<Animal[] | null>(null);

// create the Provider
function Provider({ children }: ProviderProps) {
  return (
    <PetContext.Provider value={5}>
      {children}
    </PetContext.Provider>
  );
};

export { Provider };
export default PetContext;
