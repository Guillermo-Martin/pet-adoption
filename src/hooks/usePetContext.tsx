import { useContext } from "react";
import PetContext from "@/context/PetContext";

function usePetContext() {
  const petContext = useContext(PetContext);

  // Destructuring shows an error: https://stackoverflow.com/questions/68579498/typescript-react-destructuring-from-usecontext-throws-an-error
  // check to see if the context object exists; if it doesn't throw an error
  if(!petContext){
    throw new Error("PetContext must be used within a provider.");
  };

  return petContext;
};

export default usePetContext;
