import { NextApiRequest, NextApiResponse } from 'next';
import type { Animal } from "@/interfaces/Animal";

// Configuration for "API resolved without sending a response" message
// https://github.com/vercel/next.js/discussions/40270
export const config = {
  api: {
    externalResolver: true,
  },
};

// ---------- Interfaces ----------
interface Token {
  token_type: string;
  expires_in: number;
  access_token: null | string;
}

interface FetchPetsInfo {
  animal: string;
  zipcode: string;
  searchResults: Animal[];
};

interface SearchResults {
  animals: Animal[];
};

const tokenInformation: Token = {
  token_type: "",
  expires_in: 0,
  access_token: null
};


// object to hold information for retrieving a token
const fetchPetsInfo: FetchPetsInfo = {
  animal: "",
  zipcode: "",
  searchResults: []
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ---------- testing ----------
  console.log('fetch token api hit!', req.method, req.query);

  // ---------- Get data from the client, add it to the "fetchPetsInfo" object ----------
  const { type, zipcode, id } = req.query as { type: string; zipcode: string; id: string | null };
  fetchPetsInfo.animal = type;
  fetchPetsInfo.zipcode = zipcode;

  // ---------- Functions ---------
  // ----- Get a token -----
  const checkToken = async () => {
    console.log('IN CHECK TOKEN', tokenInformation);
    
    try {
      // make an API request to get a token 
      // make a POST request since we're sending some data to get a token
      const response = await fetch("https://api.petfinder.com/v2/oauth2/token",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
        }
      );

      // convert the data to json
      const data: Token = await response.json();

      // store the token information in the "tokenInformation" object
      tokenInformation.access_token = data.access_token;
      tokenInformation.token_type = data.token_type;
      tokenInformation.expires_in = Date.now() + data.expires_in * 1000;
    } catch(error) {
      // if there's a problem fetching a token, respond with an error
      console.error("Error fetching token", error);
      res.status(500).json({ error: "Failed to fetch token" });
    };
  };

  // ----- Function to get all pets -----
  const fetchPets = async (obj: FetchPetsInfo) => {
    // check to see if a token has already been retrieved and isn't expired
    if(tokenInformation.access_token && !(Date.now() >= tokenInformation.expires_in)) {
      console.log("a token exists and isn't expired.  getting animals.")

      // make the request
      try {
        // make request to get search results
        const response = await fetch(`https://api.petfinder.com/v2/animals?type=${obj.animal}&location=${obj.zipcode}`, {
          method: "GET",
          headers: {
            "Authorization": `${tokenInformation.token_type} ${tokenInformation.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
  
        // convert the data to JSON, store it in the "fetchPetsInfo" object, then send it to the client
        const searchData: SearchResults = await response.json();
        fetchPetsInfo.searchResults = searchData.animals;
        res.status(200).json(fetchPetsInfo);
      } catch(error) {
        console.error("Error fetching search results", error);
        res.status(500).json({ error: "Failed to fetch search results"});
      };
    } else {
      // if a token hasn't been retrieved (or is expired) get one
      console.log("no token or expired.  getting a token, then getting pets.");
      await checkToken();

      // then make the request
      try {
        // make request to get search results
        const response = await fetch(`https://api.petfinder.com/v2/animals?type=${obj.animal}&location=${obj.zipcode}`, {
          method: "GET",
          headers: {
            "Authorization": `${tokenInformation.token_type} ${tokenInformation.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
  
        // convert the data to JSON, store it in the "fetchPetsInfo" object, then send it to the client
        const searchData: SearchResults = await response.json();
        fetchPetsInfo.searchResults = searchData.animals;
        res.status(200).json(fetchPetsInfo);
      } catch(error) {
        console.error("Error fetching search results", error);
        res.status(500).json({ error: "Failed to fetch search results"});
      };
    };
  };

  
  // See what request is being made
  if(req.method === "GET" && type && zipcode) {
    console.log("getting all animals!");

    // ---------- Get all animals ----------
    fetchPets(fetchPetsInfo);
  } else if(req.method === "GET" && id) {
    console.log("i'm getting an individual animal");

    // get token
    await checkToken();

    // ----- 2. Fetch pet info -----
    try {
      // make request to get individual pet
      const petResponse = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `${fetchPetsInfo.tokenType} ${fetchPetsInfo.token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      // convert response to json and send it to the client
      const petData = await petResponse.json();
      res.status(200).json(petData);
    } catch(error) {
      console.error("Error fetching individual pet", error);
      res.status(500).json({ error: "Failed to fetch individual pet data"});
    };
  };
};
