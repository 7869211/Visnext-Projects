"use client";

import React, { useState, useMemo } from "react";
import { useFetchAvatars } from "@/app/nextapi/avatars/api";
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;
const ROW_HEIGHT = 57;
const MIN_TABLE_HEIGHT = ROW_HEIGHT * ITEMS_PER_PAGE;

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function MemotarsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: memotars = [], isLoading } = useFetchAvatars();

  const handleSort = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    setCurrentPage(1);
  };

  const filteredAndSortedMemotars = useMemo(() => {
    let result = memotars;

    // First apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (memotar) =>
          memotar.characterCard?.data?.name?.toLowerCase().includes(query) ??
          false
      );
    }

    // Always apply sorting
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [memotars, searchQuery, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedMemotars.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMemotars = filteredAndSortedMemotars.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (memotar: any) => {
    router.push(`/memotars/details?id=${memotar.id}`);
  };

  return (
    <div className="p-6 md:p-10 dark:bg-b-black-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold font-montserrat tracking-spaced text-b-black-1 dark:text-white">
          Memotars
        </h1>
        <Link
          href="/memotars/create"
          className="flex items-center gap-2 bg-b-purple-1 text-white px-4 py-2 rounded-lg
           font-montserrat text-sm font-semibold tracking-wide dark:bg-b-purple-1 dark:text-white"
        >
          <Plus size={18} />
          Create memotar
        </Link>
      </div>

      <div className="flex gap-2 mb-6 ">
        <div className="relative w-[330px] ">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-b-grey-4 dark:text-white"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name"
            className="w-full pl-10 pr-4 py-2 border border-b-grey-2 rounded-lg focus:outline-none
             focus:ring-2 focus:ring-b-purple-1 font-montserrat dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-b-grey-2 overflow-hidden dark:border-[var(--dark-border-color)]">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-b-grey-2 font-montserrat font-semibold text-sm text-b-black-1 
            dark:text-white dark:bg-b-black-2 dark:border-b-[var(--dark-border-color)]">
              <div>Name</div>
              <div>Nickname</div>
              <button
                onClick={handleSort}
                className="flex items-center gap-1 hover:text-b-purple-1 transition-colors"
              >
                Created
                {sortDirection === "asc" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              <div>Created by</div>
              <div>Status</div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-b-purple-1"></div>
              </div>
            ) : filteredAndSortedMemotars.length === 0 ? (
              <div
                className="flex justify-center items-center text-b-grey-4 font-montserrat dark:text-white"
                style={{ minHeight: MIN_TABLE_HEIGHT }}
              >
                {searchQuery ? "No results found" : "No items to display"}
              </div>
            ) : (
              <div className="divide-y  dark:bg-b-black-1 ">
                {paginatedMemotars.map((memotar) => (
                  <div
                    key={memotar.id}
                    className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-50 font-montserrat text-sm cursor-pointer 
                    dark:border-[var(--dark-border-color)] dark:text-white dark:border-b-[var(--dark-border-color)] dark:hover:bg-b-black-2"
                    onClick={() => handleRowClick(memotar)}
                  >
                    <div className="flex items-center gap-2">
                      {memotar.thumbnail && (
                        <Image
                          src={memotar.thumbnail}
                          alt={memotar.characterCard.data.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      )}
                      <span>{memotar.characterCard.data.name}</span>
                    </div>
                    <div>{memotar.voice || "-"}</div>
                    <div>{formatDate(new Date(memotar.updatedAt))}</div>
                    <div>-</div>
                    <div>-</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between font-montserrat">
        <div className="text-sm text-b-grey-4 dark:text-white">
          {startIndex + 1}-
          {Math.min(
            startIndex + ITEMS_PER_PAGE,
            filteredAndSortedMemotars.length
          )}{" "}
          of {filteredAndSortedMemotars.length} items
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1 rounded-md ${
              currentPage === 1
                ? "text-b-grey-4 cursor-not-allowed"
                : "text-b-black-1 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={20} className="dark:text-white" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-md text-sm font-medium dark:text-white  dark:border-b-purple-5  ${
                currentPage === page
                  ? "bg-b-purple-1 text-white "
                  : "text-b-black-1 dark:hover:bg-b-purple-5"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-1 rounded-md ${
              currentPage === totalPages
                ? "text-b-grey-4 cursor-not-allowed"
                : "text-b-black-1 hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={20} className="dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
