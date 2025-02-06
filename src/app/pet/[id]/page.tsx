"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";


interface PetDetails {
  name: string;
  age: string;
  gender: string;
  description: string;
  size: string;
  status: string;
}


function PetDetails() {
  const [pet, setPet] = useState<PetDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------- get the pet id from the URL ----------
  const params = useParams<{id: string}>();

  // handle case if type is "undefined"
  if(!params) {
    throw new Error("Unable to get URL information.");
  };

  // destructure id from url
  const { id } = params;
  console.log("here's the pet's id", typeof id);


  

  

  // ---------- make request to get pet by id ----------
  useEffect(() => {
    const fetchPetById = async (petId: string) => {
      try {
        // set isLoading to "true"
        setIsLoading(true);

        // get the response
        const response = await fetch(`/api/fetch-animals?id=${petId}`, { // <--- use query parameter
          method: "GET"
        });
  
        // convert the response to data
        const data = await response.json();
  
        // set the pet state
        setPet(data);
  
        console.log("here is your pet data", data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetById(id);
  }, [id]);
  

  




  return (
    <div>
      {(pet && isLoading === false) ? <h1>results</h1> : <h1>loading</h1>}
      {/* <h1>Pet Details page</h1> */}
      {/* <p>{pet.name}</p>
      <p>{pet.age}</p>
      <p>{pet.gender}</p>
      <p>{pet.description}</p>
      <p>{pet.size}</p>
      <p>{pet.status}</p> */}
    </div>
  );
};

export default PetDetails;
