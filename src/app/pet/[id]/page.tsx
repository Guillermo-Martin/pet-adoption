import type { Metadata } from "next";
import PetDetails from "./PetDetails";

export const metadata: Metadata = {
  title: "THIS IS THE TITLE FOR PET DATA",
  description: "PET DATA!!!!!"
}

function PetDetailsPage() {
  return <PetDetails />
};

export default PetDetailsPage;
