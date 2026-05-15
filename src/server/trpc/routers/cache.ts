import { z } from "zod";
import { decryptCache, encryptCache } from "@/server/actions/cache";
import { baseProcedure, createTRPCRouter } from "../init";

export const cacheRouter = createTRPCRouter({
  encrypt: baseProcedure
    .input(z.object({ data: z.string() }))
    .mutation(async ({ input }) => {
      const ciphertext = await encryptCache(input.data);
      return { ciphertext };
    }),

  decrypt: baseProcedure
    .input(z.object({ ciphertext: z.string() }))
    .mutation(async ({ input }) => {
      const plaintext = await decryptCache(input.ciphertext);
      if (!plaintext) {
        throw new Error("Decryption failed");
      }
      return { plaintext };
    }),
});
