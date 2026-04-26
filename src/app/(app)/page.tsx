import { auth } from "@/lib/auth/auth";
import { StatsClient } from "./StatsClient";

export default async function HomePage() {
  await auth();
  return <StatsClient />;
}