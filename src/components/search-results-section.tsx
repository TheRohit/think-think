"use client";

import { useState } from "react";
import ContentMasonry from "./content-masonary";
import InputField from "./input-field";
import { ContentItem } from "~/types/dashboard.types";
import { useContent } from "~/hooks/use-content";
import IngestModal from "~/app/components/ingest/ingest-modal";

import { Button } from "./ui/button";

interface SearchResultsSectionProps {
  initialData: ContentItem[];
}

export default function SearchResultsSection({
  initialData,
}: SearchResultsSectionProps) {
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    data: contentData,
    isLoading,
    isRefetching,
  } = useContent(initialData);

  const handleSearchResults = (results: ContentItem[]) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleScroll = () => {
    document.getElementById("notes-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      <InputField onSearchResults={handleSearchResults} />
      <IngestModal />
      {/* <div
        className="flex w-full cursor-pointer flex-col items-center py-2"
        onClick={handleScroll}
      >
        <ChevronsDownIcon className="h-10 w-10 animate-bounce" />
        <h1 className="text-md font-medium">
          Scroll down to see your memories
        </h1>
      </div> */}

      {isSearching ? (
        <div className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-pink-500">
              Search Results ({searchResults.length})
            </h2>
            <Button variant="reverse" onClick={handleClearSearch}>
              Clear Search
            </Button>
          </div>
          <ContentMasonry data={searchResults} />
        </div>
      ) : isLoading ? (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              />
            ))}
        </div>
      ) : (
        <div className="relative w-full" id="notes-section">
          {isRefetching && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-black/50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-transparent dark:border-gray-600 dark:border-t-transparent"></div>
            </div>
          )}
          <ContentMasonry data={contentData ?? []} />
        </div>
      )}
    </>
  );
}
