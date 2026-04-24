"use client";

import { Button } from "@/shared/components/ui/button";
import { 
  Card, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/shared/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { deleteAccount } from "../../applications/account.action";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Organism that handles account deletion with a confirmation dialog.
 */
export function DeleteAccountSection() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success("Your account has been deleted successfully.");
        // Redirect to sign-up or home page after deletion
        router.push("/auth/sign-up");
      } else {
        toast.error(result.error || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("[DeleteAccountSection]", error);
      toast.error("An unexpected error occurred while deleting your account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive/50 bg-destructive/5 shadow-none">
      <CardHeader>
        <CardTitle className="text-destructive text-lg font-semibold">Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data, including workspaces and models. 
          This action is irreversible.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove your account and all associated data from our servers. 
                You will not be able to recover your workspaces or data models.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Yes, Delete My Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
