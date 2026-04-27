"use client";

import { Chip } from "@/shared/components/ui/chip";
import React, { useState } from "react";
import { TemplateEmptyState } from "../organisms/template-empty-state";
import { TemplateHero } from "../organisms/template-hero";

const DB_TYPES = ["All", "PostgreSQL", "MySQL", "Oracle", "SQL Server", "SQLite"];

export function TemplatesLayoutTemplate() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <div className="min-h-screen bg-background">
            <TemplateHero 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                totalCount={0} 
            />
            
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center gap-2 mb-10">
                    {DB_TYPES.map((type) => (
                        <Chip
                            key={type}
                            variant={activeFilter === type ? "active" : "default"}
                            onClick={() => setActiveFilter(type)}
                        >
                            {type}
                        </Chip>
                    ))}
                </div>

                <TemplateEmptyState />
            </div>
        </div>
    );
}
