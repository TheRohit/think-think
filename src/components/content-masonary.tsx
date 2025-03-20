"use client";

import { Filter, Grid, List, Search } from "lucide-react";
import type { RenderComponentProps } from "masonic";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import ContentCard from "~/components/content-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useIsMobile } from "~/hooks/is-mobile";
import { cn } from "~/lib/utils";
import { ContentItem } from "~/types/dashboard.types";

export type ContentType = "link" | "tweet" | "note" | "youtube";
type ViewMode = "masonry" | "grid" | "list";

// Dynamic import for Masonry with SSR fallback
const DynamicMasonry = dynamic(
  () => import("masonic").then((mod) => mod.Masonry),
  {
    ssr: false,
    loading: () => <MasonryFallback />,
  },
);

const MasonryFallback = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
    {Array(6)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="bg-muted h-64 animate-pulse rounded-md" />
      ))}
  </div>
);

const MasonryCard = ({ data }: RenderComponentProps<unknown>) => {
  try {
    return <ContentCard item={data as ContentItem} />;
  } catch (error) {
    console.error("Error rendering masonry card:", error);
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-500">Failed to render content</p>
      </div>
    );
  }
};

const ViewToggleButtons = ({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) => (
  <div className="flex overflow-hidden rounded-md border">
    <ViewButton
      isActive={viewMode === "masonry"}
      onClick={() => onChange("masonry")}
      title="Masonry View"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="8" height="9" />
        <rect x="13" y="3" width="8" height="5" />
        <rect x="13" y="12" width="8" height="9" />
        <rect x="3" y="16" width="8" height="5" />
      </svg>
    </ViewButton>
    <ViewButton
      isActive={viewMode === "grid"}
      onClick={() => onChange("grid")}
      title="Grid View"
    >
      <Grid size={18} />
    </ViewButton>
    <ViewButton
      isActive={viewMode === "list"}
      onClick={() => onChange("list")}
      title="List View"
    >
      <List size={18} />
    </ViewButton>
  </div>
);

const ViewButton = ({
  isActive,
  onClick,
  title,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <Button
    variant="noShadow"
    size="icon"
    className={cn(
      "rounded-none border-none",
      isActive ? "bg-pink-400 text-white" : "bg-white",
    )}
    onClick={onClick}
    title={title}
  >
    {children}
  </Button>
);

const EmptyState = () => (
  <div className="container mx-auto p-4 text-center md:p-6">
    <div className="my-16 flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">No content found</h2>
      <p className="text-muted-foreground">
        Your content library is empty. Start by adding some content!
      </p>
    </div>
  </div>
);

const ContentHeader = ({
  viewMode,
  activeFilter,
  onFilterChange,
  onViewModeChange,
}: {
  viewMode: ViewMode;
  activeFilter: ContentType | "all";
  onFilterChange: (value: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
}) => (
  <div className="mb-8 flex flex-col gap-4">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold md:text-3xl">Content Library</h1>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:max-w-[200px]">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input type="search" placeholder="Search..." className="pl-8" />
        </div>
        <ViewToggleButtons viewMode={viewMode} onChange={onViewModeChange} />
      </div>
    </div>

    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Tabs
        value={activeFilter}
        onValueChange={onFilterChange}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
          <TabsTrigger value="tweet">Tweets</TabsTrigger>
          <TabsTrigger value="note">Notes</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="default" size="sm" className="gap-1">
          <Filter size={14} />
          <span>Filter</span>
        </Button>
        <Button variant="default" size="sm">
          Sort: Newest
        </Button>
      </div>
    </div>
  </div>
);

export default function ContentMasonry({
  data = [],
}: {
  data?: ContentItem[];
}) {
  const isMobile = useIsMobile();

  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [activeFilter, setActiveFilter] = useState<ContentType | "all">("all");

  const [filterChangeCount, setFilterChangeCount] = useState(0);

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) => activeFilter === "all" || item.type === activeFilter,
      ),
    [data, activeFilter],
  );

  useEffect(() => {
    setViewMode(isMobile ? "grid" : "masonry");
  }, [isMobile]);

  if (data.length === 0) {
    return <EmptyState />;
  }

  const handleFilterChange = (value: string) => {
    if (
      value === "all" ||
      ["link", "tweet", "note", "youtube"].includes(value)
    ) {
      setActiveFilter(value as ContentType | "all");

      setFilterChangeCount((prev) => prev + 1);
    }
  };

  // Generate a unique key for each item for better performance
  const itemKey = (item: unknown, index: number): string => {
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      typeof item.id === "string"
    ) {
      return item.id;
    }
    // Fallback to index if id is not available
    return index.toString();
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <ContentHeader
        viewMode={viewMode}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onViewModeChange={setViewMode}
      />

      {viewMode === "masonry" ? (
        <div className="pb-8">
          <DynamicMasonry
            scrollFps={24}
            key={`masonry-${filterChangeCount}-${activeFilter}-${data.length}`}
            items={filteredData}
            columnWidth={300}
            columnGutter={16}
            rowGutter={16}
            render={MasonryCard}
            itemKey={itemKey}
            overscanBy={5}
            ssrWidth={1200}
            scrollToIndex={0}
            itemHeightEstimate={400}
            className="masonry-grid"
          />
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              : "grid-cols-1",
          )}
        >
          {filteredData.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
