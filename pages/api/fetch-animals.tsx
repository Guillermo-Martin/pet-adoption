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
  access_token: string;
}

interface FetchPetsInfo {
  animal: string;
  zipcode: string;
  token: string | null;
  tokenType: string | null;
  tokenExpiration: number;
  searchResults: Animal[];
};

interface SearchResults {
  animals: Animal[];
};

// object to hold information for retrieving a token
const fetchPetsInfo: FetchPetsInfo = {
  animal: "",
  zipcode: "",
  token: null,
  tokenType: null,
  tokenExpiration: 0,
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
  // ----- Function to check and get token -----
  const checkToken = async () => {
    // Check to see if there's no token or the token has expired, get a new token
    if(fetchPetsInfo.token === null || Date.now() >= fetchPetsInfo.tokenExpiration) {
      console.log("serverside:  token missing or expired! getting a new token");

      try {
        // ----- 1. Get token (for authenticating the request) -----
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

        // store the token information in the "fetchPetsInfo" object
        fetchPetsInfo.token = data.access_token;
        fetchPetsInfo.tokenType = data.token_type;
        fetchPetsInfo.tokenExpiration = Date.now() + data.expires_in * 1000;
      } catch(error) {
        // if there's a problem fetching a token, respond with an error
        console.error("Error fetching token", error);
        res.status(500).json({ error: "Failed to fetch token" });
      };
    };
  };




  // ----- Function to get pets -----
  const fetchPets = async (obj: FetchPetsInfo) => {
    // destructure info from the object
    const { animal, zipcode, tokenType, token } = obj;

    // make request to get search results
    const response = await fetch(`https://api.petfinder.com/v2/animals?type=${animal}&location=${zipcode}`, {
      method: "GET",
      headers: {
        "Authorization": `${tokenType} ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // convert the data to JSON, then send it to the client
    const searchData: SearchResults = await response.json();

    fetchPetsInfo.searchResults = searchData.animals;
    res.status(200).json(fetchPetsInfo);
  };

  
  // See what request is being made
  if(req.method === "GET" && type && zipcode) {
    console.log("getting all animals!");

    // get token
    await checkToken();

    // ---------- Get all animals ----------
    fetchPets(fetchPetsInfo);
  } else if(req.method === "GET" && id) {
    console.log("i'm getting an individual animal");

    // get token
    await checkToken();

    // ----- 2. Fetch pet info -----
    const petResponse = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `${fetchPetsInfo.tokenType} ${fetchPetsInfo.token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const petData = await petResponse.json();

    res.status(200).json(petData);
  };
};
