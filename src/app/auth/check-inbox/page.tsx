import { CheckInboxForm } from "@/features/authentication/components/organisms/check-inbox-form";
import { AuthTemplate } from "@/features/authentication/components/templates/auth-template";

export default function CheckInboxPage() {
  return (
    <AuthTemplate
      title="Verify your email"
      description="One more step before you can sign in."
      form={<CheckInboxForm />}
    />
  );
}