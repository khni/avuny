import UsersButton from "@/src/app/_component/user-button";
import { SignUpForm } from "@/src/features/auth/form";

export const dynamic = "force-dynamic"; // ensures fresh data

export default async function Page() {
  return <SignUpForm />;
}
