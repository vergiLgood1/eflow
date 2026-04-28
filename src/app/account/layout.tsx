import { AccountLayoutTemplate } from "@/features/account/components/templates/account-layout-template";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account Settings | EFLOW",
    description: "Manage your account settings, profile, and billing information.",
};

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AccountLayoutTemplate>{children}</AccountLayoutTemplate>;
}
