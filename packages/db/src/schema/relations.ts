import { relations } from "drizzle-orm/relations";
import { resultTbl, scanTbl } from "./tables";

export const resultRelations = relations(resultTbl, ({ one }) => ({
  scan: one(scanTbl, {
    fields: [resultTbl.scanId],
    references: [scanTbl.id],
  }),
}));

export const scanRelations = relations(scanTbl, ({ many }) => ({
  results: many(resultTbl),
}));
