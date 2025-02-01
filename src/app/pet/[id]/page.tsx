"use client";

import { useParams } from "next/navigation";

function PetDetails() {
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
  const fetchPetById = async (petId: string) => {
    try {
      // get the response
      const response = await fetch(`/api/fetch-animals?id=${petId}`, { // <--- use query parameter
        method: "GET"
      });

      // convert the response to data
      const data = await response.json();

      console.log("individual pet data", data);

      
    } catch (error) {
      console.log(error);
    };
  };

  fetchPetById(id);


  return (
    <div>
      <h1>Pet Details page</h1>
    </div>
  );
};

export default PetDetails;
