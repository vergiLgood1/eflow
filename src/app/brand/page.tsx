import { BrandTemplate } from "@/features/brand/components/templates/brand-template";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Identity | Eflow",
  description:
    "Explore the Eflow brand system, visual language, logo usage, colors, typography, and product voice.",
};

export default function BrandPage() {
  return <BrandTemplate />;
}
