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
  console.log("here's the pet's id", id);

  


  return (
    <div>
      <h1>Pet Details page</h1>
    </div>
  );
};

export default PetDetails;
