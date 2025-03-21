import type { Metadata } from "next";
import SearchResults from "./SearchResults";

export const metadata: Metadata = {
  title: "Search results",
  description: "A list of available pets."
}

function SearchResultsPage() {
  return <SearchResults />
};

export default SearchResultsPage;
