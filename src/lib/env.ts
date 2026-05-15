import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  NEXTAUTH_URL: z.string().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_CACHE_SECRET: z.string().default("math-cache-secret-key"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
