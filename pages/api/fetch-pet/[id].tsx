export default async function handler(req, res) {
  console.log("fetch pet api hit!");
  console.log("fetchpet id", req.query.id);
  res.status(200).json("you hit the fetch pet API!");
};
