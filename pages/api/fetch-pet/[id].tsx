import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ---------- testing ----------
  console.log("fetch pet api hit!");
  // console.log("fetchpet id", req.query.id);
  // res.status(200).json("you hit the fetch pet API!");

  // get the petId from the client
  const { id } = req.query;

  // ----- function to get pet by id -----
  const fetchPetById = async (petId: string) => {
    // make the request to get individual pet data
    const response = await fetch(`https://api.petfinder.com/v2/animals/${petId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // convert the response to JSON, then send it to the client
    const petData = await response.json();
    res.status(200).json(petData);
  };

  // call the function with pet id
  fetchPetById(id);
};
