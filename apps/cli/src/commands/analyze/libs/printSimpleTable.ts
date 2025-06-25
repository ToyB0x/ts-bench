import { Console } from "node:console";
import { Transform } from "node:stream";

// biome-ignore lint/complexity/noBannedTypes: temp
export const printSimpleTable = (obj: Object): string => {
  const ts = new Transform({
    transform(chunk, _enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });

  logger.table(obj);
  return (ts.read() || "").toString();
};
