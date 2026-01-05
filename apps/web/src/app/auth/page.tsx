import UsersButton from "@/src/app/_component/user-button";
import { SignUpForm } from "@/src/features/auth/form";
import { prisma } from "@avuny/db";

export const dynamic = "force-dynamic"; // ensures fresh data

export default async function Page() {
  const users = await prisma.user.findMany();

  return <SignUpForm />;
}
