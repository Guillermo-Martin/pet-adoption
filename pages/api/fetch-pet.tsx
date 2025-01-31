export default async function handler(req, res) {
  console.log("fetch pet api hit!");
  res.status(200).json("you hit the fetch pet API!");
};
