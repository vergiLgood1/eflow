import { auth } from "@/features/authentication/lib/auth-server";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth.getSession();
    
    if (!session || !session.data) {
        return redirect("/auth/sign-in");
    }

    const user = session.data.user;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your public profile and personal information.
                </p>
            </div>

            <div className="space-y-4 pt-6">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-linear-to-tr from-primary to-purple-500 flex items-center justify-center text-4xl text-white font-bold shrink-0">
                        {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="space-y-1">
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            JPG, GIF or PNG. 1MB max.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 pt-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" defaultValue={user.name || ""} placeholder="Your name" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                        <p className="text-xs text-muted-foreground">
                            Your email address cannot be changed.
                        </p>
                    </div>
                </div>

                <div className="pt-6">
                    <Button>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
