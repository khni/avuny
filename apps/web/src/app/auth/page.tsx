import UsersButton from "@/src/app/_component/user-button";
import { prisma } from "@avuny/db";

export const dynamic = "force-dynamic"; // ensures fresh data

export default async function Page() {
  const users = await prisma.user.findMany();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Users</h1>

        <UsersButton />

        {users.map((user) => (
          <div key={user.id}>{user.email}</div>
        ))}
      </div>
    </div>
  );
}
