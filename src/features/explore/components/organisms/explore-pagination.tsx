"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ExplorePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export function ExplorePagination({ 
    currentPage, 
    totalPages, 
    totalItems, 
    itemsPerPage 
}: ExplorePaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/explore?${params.toString()}`);
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0) return null;

    return (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground tabular-nums">
                {startItem}-{endItem} of {totalItems}
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    className="h-9 px-4"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <div className="text-xs text-muted-foreground px-2 tabular-nums">
                    Page {currentPage} / {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="h-9 px-4"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
