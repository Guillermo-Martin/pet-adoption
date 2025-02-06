"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";


interface PetDetails {
  animal: {
    name: string;
    age: string;
    gender: string;
    description: string;
    size: string;
    status: string;
    breeds: {
      primary: string;
      secondary: string;
    };
    photos: {full: string}[] | [];
    tags: string[];
  }
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
  
        console.log("here is your pet data", data.animal);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetById(id);
  }, [id]);
  

  // ---------- check to see if pet data has been loaded ----------
  const renderedChar = pet?.animal.tags.map((char: string) => {
    return <p key={char}>{char}</p>
  });

  return (
    <div>
      {(pet && isLoading === false) 
        ? 
          <div>
            <img src={pet.animal.photos[0].full} />
            <p>{pet.animal.name}</p>
            <p>{pet.animal.breeds.primary}, {pet.animal.breeds.secondary}</p>
            <p>{pet.animal.age}</p>
            <p>{pet.animal.gender}</p>
            <p>{pet.animal.description}</p>
            <p>{pet.animal.size}</p>
            <p>{pet.animal.status}</p>
            <div>{renderedChar}</div>
          </div>
        : 
          <h1>loading</h1>}
    </div>
  );
};

export default PetDetails;
