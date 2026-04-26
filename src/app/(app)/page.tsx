import { auth } from "@/lib/auth/auth";
import { StatsClient } from "./StatsClient";

export default async function HomePage() {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] || "Aluno";
  const userImage = session?.user?.image || null;

  return <StatsClient userName={userName} userImage={userImage} />;
}
