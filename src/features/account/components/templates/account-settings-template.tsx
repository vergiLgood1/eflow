import { ProfileForm } from "../organisms/profile-form";
import { DeleteAccountSection } from "../organisms/delete-account-section";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

interface AccountSettingsTemplateProps {
  user: {
    name: string;
    email: string;
  };
}

/**
 * Template for the Account Settings page.
 * Organizes profile management and account deletion into a clear, standard layout.
 */
export function AccountSettingsTemplate({ user }: AccountSettingsTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Update your personal details and manage your account preferences.
        </p>
      </div>
      
      <Separator />

      <div className="space-y-10">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground">
              This information will be visible across your workspaces.
            </p>
          </div>
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Personal Details</CardTitle>
              <CardDescription>
                How you appear to others in eflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </section>

        {/* Danger Zone Section */}
        <section className="space-y-6 pt-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground">
              Actions here are permanent and cannot be reversed.
            </p>
          </div>
          <DeleteAccountSection />
        </section>
      </div>
    </div>
  );
}
