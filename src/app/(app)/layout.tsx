// Server-only layout

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { ClientLayoutWrapper } from "./ClientLayoutWrapper";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userName = session?.user?.name?.split(" ")[0] || "Aluno";
  const userImage = session?.user?.image || null;

  return (
    <ClientLayoutWrapper userName={userName} userImage={userImage}>
      {children}
    </ClientLayoutWrapper>
  );
}
