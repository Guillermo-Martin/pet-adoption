import type { Metadata } from "next";
import PetDetails from "./PetDetails";

export const metadata: Metadata = {
  title: "More details on your selected pet",
  description: "Learn more about the pet and where to find them."
}

function PetDetailsPage() {
  return <PetDetails />
};

export default PetDetailsPage;
